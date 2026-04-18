import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // 1. Resolve the internal user and their portfolio via clerkUserId
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: { portfolio: { select: { id: true, createdAt: true } } },
    });

    const portfolio = user?.portfolio;

    if (!portfolio) {
      return NextResponse.json({
        metrics: { totalViews: 0, uniqueVisitors: 0, growth: 0, linkClicks: 0, avgTime: "0m 0s" },
        chartData: [],
        referrers: [],
        platforms: []
      });
    }

    // Configurable time frame
    const searchParams = req.nextUrl.searchParams;
    const daysParam = searchParams.get("days");
    const parsedDays = daysParam ? parseInt(daysParam, 10) : 30;
    const days = isNaN(parsedDays) || parsedDays <= 0 ? 30 : parsedDays;

    const now = new Date();
    const currentStart = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    const previousStart = new Date(now.getTime() - (2 * days * 24 * 60 * 60 * 1000));
    
    currentStart.setHours(0, 0, 0, 0);
    previousStart.setHours(0, 0, 0, 0);

    // 2. Fetch Aggregated Metrics
    const [
      currentViews,
      previousViews,
      currentUniquesResult,
      previousUniquesResult,
      currentClicks,
      previousClicks,
      currentTime,
      previousTime,
      dailyVisits,
      dailyClicks,
      referrersRaw,
      platformsRaw
    ] = await Promise.all([
      prisma.analyticsVisit.count({ where: { portfolioId: portfolio.id, createdAt: { gte: currentStart } } }),
      prisma.analyticsVisit.count({ where: { portfolioId: portfolio.id, createdAt: { gte: previousStart, lt: currentStart } } }),
      prisma.$queryRaw`
        SELECT COUNT(DISTINCT "viewerIp")::int as count 
        FROM "AnalyticsVisit" 
        WHERE "portfolioId" = ${portfolio.id} AND "createdAt" >= ${currentStart}
      ` as Promise<{ count: number }[]>,
      prisma.$queryRaw`
        SELECT COUNT(DISTINCT "viewerIp")::int as count 
        FROM "AnalyticsVisit" 
        WHERE "portfolioId" = ${portfolio.id} AND "createdAt" >= ${previousStart} AND "createdAt" < ${currentStart}
      ` as Promise<{ count: number }[]>,
      prisma.linkClick.count({ where: { portfolioId: portfolio.id, createdAt: { gte: currentStart } } }),
      prisma.linkClick.count({ where: { portfolioId: portfolio.id, createdAt: { gte: previousStart, lt: currentStart } } }),
      prisma.analyticsVisit.aggregate({ where: { portfolioId: portfolio.id, createdAt: { gte: currentStart } }, _sum: { durationSeconds: true } }),
      prisma.analyticsVisit.aggregate({ where: { portfolioId: portfolio.id, createdAt: { gte: previousStart, lt: currentStart } }, _sum: { durationSeconds: true } }),
      // Chart Data: Grouped by day
      prisma.$queryRaw`
        SELECT DATE("createdAt") as date, COUNT(*)::int as views
        FROM "AnalyticsVisit"
        WHERE "portfolioId" = ${portfolio.id} AND "createdAt" >= ${currentStart}
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      ` as Promise<{ date: Date, views: number }[]>,
      prisma.$queryRaw`
        SELECT DATE("createdAt") as date, COUNT(*)::int as clicks
        FROM "LinkClick"
        WHERE "portfolioId" = ${portfolio.id} AND "createdAt" >= ${currentStart}
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      ` as Promise<{ date: Date, clicks: number }[]>,
      // Referrers
      prisma.analyticsVisit.groupBy({
        by: ['referer'],
        where: { portfolioId: portfolio.id, createdAt: { gte: currentStart } },
        _count: { _all: true },
        orderBy: { _count: { referer: 'desc' } },
        take: 10
      }),
      // Platforms (using userAgent - still needs some JS parsing but we'll fetch only what's needed)
      prisma.analyticsVisit.groupBy({
        by: ['userAgent'],
        where: { portfolioId: portfolio.id, createdAt: { gte: currentStart } },
        _count: { _all: true },
        orderBy: { _count: { userAgent: 'desc' } },
        take: 50 // Fetch more for variety, then group in JS
      })
    ]);
    
    // Extract raw counts from query results
    const currentUniques = Number(currentUniquesResult[0]?.count || 0);
    const previousUniques = Number(previousUniquesResult[0]?.count || 0);

    // 3. Format Chart Data (Merging visits and clicks)
    const timeSeriesMap = new Map();
    for (let i = 0; i < days; i++) {
        const d = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
        const dateStr = d.toISOString().split('T')[0];
        timeSeriesMap.set(dateStr, { date: dateStr, views: 0, clicks: 0 });
    }

    dailyVisits.forEach(v => {
        const dStr = new Date(v.date).toISOString().split('T')[0];
        if (timeSeriesMap.has(dStr)) timeSeriesMap.get(dStr).views = v.views;
    });
    dailyClicks.forEach(c => {
        const dStr = new Date(c.date).toISOString().split('T')[0];
        if (timeSeriesMap.has(dStr)) timeSeriesMap.get(dStr).clicks = c.clicks;
    });

    const chartData = Array.from(timeSeriesMap.values()).reverse();

    // 4. Format Referrers & Platforms
    const referrers = referrersRaw.map(r => ({
        name: r.referer || "Direct Traffic",
        visits: r._count._all
    }));

    const platformCounts = new Map<string, { count: number, icon: string }>();
    platformsRaw.forEach(p => {
        const ua = (p.userAgent || "").toLowerCase();
        let os = "Other";
        let browser = "Other";
        let icon = "globe";

        if (ua.includes("windows")) { os = "Windows"; icon = "monitor"; }
        else if (ua.includes("mac os") || ua.includes("macintosh")) { os = "macOS"; icon = "laptop"; }
        else if (ua.includes("android")) { os = "Android"; icon = "smartphone"; }
        else if (ua.includes("iphone") || ua.includes("ipad")) { os = "iOS"; icon = "smartphone"; }
        else if (ua.includes("linux")) { os = "Linux"; icon = "monitor"; }

        if (ua.includes("firefox")) browser = "Firefox";
        else if (ua.includes("edg/")) browser = "Edge";
        else if (ua.includes("chrome") || ua.includes("crios")) browser = "Chrome";
        else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
        
        const name = `${browser} on ${os}`;
        const count = p._count._all;
        const existing = platformCounts.get(name) || { count: 0, icon };
        platformCounts.set(name, { count: existing.count + count, icon: existing.icon });
    });

    const platforms = Array.from(platformCounts.entries())
        .map(([name, d]) => ({ 
            name, 
            count: d.count, 
            pct: currentViews > 0 ? Math.round((d.count / currentViews) * 100) : 0, 
            icon: d.icon 
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 4);

    // 5. Calculate Metrics & Growth
    const calcGrowth = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return Math.round(((curr - prev) / prev) * 100);
    };

    const currentTimeTotal = currentTime._sum.durationSeconds || 0;
    const previousTimeTotal = previousTime._sum.durationSeconds || 0;

    const currentAvgTime = currentViews > 0 ? Math.round(currentTimeTotal / currentViews) : 0;
    const previousAvgTime = previousViews > 0 ? Math.round(previousTimeTotal / previousViews) : 0;

    const formatTime = (totalSecs: number) => {
      const m = Math.floor(totalSecs / 60);
      const s = totalSecs % 60;
      return `${m}m ${s}s`;
    };

    return NextResponse.json({
      metrics: {
        totalViews: currentViews,
        uniqueVisitors: currentUniques,
        linkClicks: currentClicks,
        totalTime: formatTime(currentTimeTotal),
        avgTime: formatTime(currentAvgTime),
        growth: {
          views: calcGrowth(currentViews, previousViews),
          visitors: calcGrowth(currentUniques, previousUniques),
          clicks: calcGrowth(currentClicks, previousClicks),
          time: calcGrowth(currentTimeTotal, previousTimeTotal),
          avgTime: calcGrowth(currentAvgTime, previousAvgTime)
        }
      },
      chartData,
      referrers,
      platforms
    });
  } catch (error) {
    console.error("[ANALYTICS_STATS_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
