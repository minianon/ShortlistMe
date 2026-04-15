import { prisma } from "@/server/db";
import { headers } from "next/headers";
import { createHash } from "crypto";
import { clerkClient } from "@clerk/nextjs/server";

/**
 * Records a visit to a portfolio anonymously.
 * Uses a hashed IP + UserAgent to allow for unique visitor counts
 * without storing PII.
 */
export async function recordVisit(portfolioId: string) {
  try {
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    const userAgent = headersList.get("user-agent") ?? "";
    const referer = headersList.get("referer");

    // Use the first IP from forwarded-for or fallback to real-ip
    const ip = forwardedFor?.split(",")[0].trim() || realIp || "0.0.0.0";

    // Create a daily unique hash per visitor (IP + UA + Date)
    // This allows us to track unique visitors per day without storing IPs
    const dateSalt = new Date().toISOString().split("T")[0];
    const visitorHash = createHash("sha256")
      .update(`${ip}-${userAgent}-${dateSalt}`)
      .digest("hex");

    // Extract cleaner referer (domain only or full if preferred)
    let cleanReferer = null;
    if (referer) {
      try {
        const url = new URL(referer);
        // Only ignore if it's our own domain (recursive hits)
        const host = headersList.get("host") || "";
        if (!url.host.includes(host)) {
          cleanReferer = url.origin;
        }
      } catch {
        cleanReferer = referer;
      }
    }

    const visit = await prisma.analyticsVisit.create({
      data: {
        portfolioId,
        viewerIp: visitorHash, // Storing hash instead of raw IP
        userAgent,
        referer: cleanReferer,
      },
    });

    // Generate notification if owner has "Portfolio Activity" setting enabled
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
      include: { user: true }
    });

    if (portfolio?.user) {
      try {
        const client = await clerkClient();
        const clerkUser = await client.users.getUser(portfolio.user.clerkUserId);
        
        // Default to true. Only block if explicitly set to false in settings.
        const notifPortfolio = clerkUser?.unsafeMetadata?.notifPortfolio !== false;
        
        if (notifPortfolio) {
          // Check for "Returning Visitor" (if this hash has visited before in the last 30 days)
          const isReturning = await prisma.analyticsVisit.findFirst({
            where: {
              portfolioId,
              viewerIp: visitorHash,
              createdAt: { lt: new Date() } // Before the current one
            }
          });

          if (isReturning) {
             const recentReturningNotif = await prisma.notification.findFirst({
               where: {
                 userId: portfolio.user.id,
                 message: { contains: "returned" },
                 createdAt: { gte: new Date(Date.now() - 6 * 60 * 60 * 1000) } // 6 hour cooldown for returning alerts
               }
             });

             if (!recentReturningNotif) {
                await prisma.notification.create({
                  data: {
                    userId: portfolio.user.id,
                    title: "High Intent",
                    message: "A previous visitor just returned to your portfolio for another look!",
                    type: "engagement",
                    icon: "Star",
                  }
                });
             }
          }

          // Prevent notification spam: maximum of 1 view notification per minute
          const recentNotif = await prisma.notification.findFirst({
            where: {
              userId: portfolio.user.id,
              type: "view",
              createdAt: { gte: new Date(Date.now() - 60 * 1000) }
            }
          });

          if (!recentNotif && !isReturning) {
            await prisma.notification.create({
              data: {
                userId: portfolio.user.id,
                title: "New Portfolio View",
                message: `Someone just viewed your ${portfolio.slug} portfolio.`,
                type: "view",
                icon: "Globe",
              }
            });
          }

          // --- Achievement Milestones ---
          const totalViews = await prisma.analyticsVisit.count({
            where: { portfolioId }
          });

          const milestones = [10, 50, 100, 500, 1000];
          if (milestones.includes(totalViews)) {
            // Check if we already sent this specific milestone alert
            const milestoneType = `achievement:views:${totalViews}`;
            const existingMilestone = await prisma.notification.findFirst({
              where: {
                userId: portfolio.user.id,
                type: milestoneType
              }
            });

            if (!existingMilestone) {
              await prisma.notification.create({
                data: {
                  userId: portfolio.user.id,
                  title: `Milestone Achievement: ${totalViews} Views`,
                  message: `Congratulations! Your portfolio has officially reached ${totalViews} total views. Your career engine is heating up!`,
                  type: milestoneType,
                  icon: "Trophy",
                }
              });
            }
          }
        }
      } catch (clerkErr) {
        console.error("[NOTIFICATION_AUTH_ERROR]", clerkErr);
      }
    }

    return visit;
  } catch (error) {
    console.error("[ANALYTICS_TRACK_ERROR]", error);
    return null;
  }
}
