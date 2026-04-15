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

    // 2. Fetch all relevant data for the double timeframe (to compare current vs previous)
    const [visits, linkClicks] = await Promise.all([
      prisma.analyticsVisit.findMany({
        where: {
          portfolioId: portfolio.id,
          createdAt: { gte: previousStart },
        },
        orderBy: { createdAt: "asc" },
      }),
      prisma.linkClick.findMany({
        where: {
          portfolioId: portfolio.id,
          createdAt: { gte: previousStart },
        },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    // Split data into Current and Previous periods
    const currentVisits = visits.filter(v => v.createdAt >= currentStart);
    const previousVisits = visits.filter(v => v.createdAt < currentStart);
    
    const currentClicks = linkClicks.filter(c => c.createdAt >= currentStart);
    const previousClicks = linkClicks.filter(c => c.createdAt < currentStart);

    // 3. Aggregate Data: Time Series (Current Period Only for graph)
    const timeSeriesMap = new Map();
    for (let i = 0; i < days; i++) {
        const d = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
        const date = d.toISOString().split('T')[0];
        timeSeriesMap.set(date, { date, views: 0, clicks: 0, visitors: new Set() });
    }

    currentVisits.forEach(v => {
        const dayStr = v.createdAt.toISOString().split('T')[0];
        if (timeSeriesMap.has(dayStr)) {
            const entry = timeSeriesMap.get(dayStr);
            entry.views += 1;
            if (v.viewerIp) entry.visitors.add(v.viewerIp);
        }
    });

    currentClicks.forEach(c => {
        const dayStr = c.createdAt.toISOString().split('T')[0];
        if (timeSeriesMap.has(dayStr)) {
            timeSeriesMap.get(dayStr).clicks += 1;
        }
    });

    const chartData = Array.from(timeSeriesMap.values()).reverse();

    // 4. Referrers & Platforms (Current Period)
    const refererCounts = new Map();
    currentVisits.forEach(v => {
        const ref = v.referer || "Direct Traffic";
        refererCounts.set(ref, (refererCounts.get(ref) || 0) + 1);
    });

    const referrers = Array.from(refererCounts.entries())
        .map(([name, visits]) => ({ name, visits }))
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 10);

    const platformCounts = new Map<string, { count: number, icon: string }>();
    currentVisits.forEach(v => {
        const ua = (v.userAgent || "").toLowerCase();
        let os = "Unknown OS";
        let browser = "Unknown Browser";
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
        const existing = platformCounts.get(name) || { count: 0, icon };
        platformCounts.set(name, { count: existing.count + 1, icon: existing.icon });
    });

    const totalViews = currentVisits.length;
    const platforms = Array.from(platformCounts.entries())
        .map(([name, data]) => ({ 
            name, 
            count: data.count, 
            pct: totalViews > 0 ? Math.round((data.count / totalViews) * 100) : 0, 
            icon: data.icon 
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 4);

    // 5. Calculate Metrics & Growth (Scientific Period-over-Period)
    const calcGrowth = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return Math.round(((curr - prev) / prev) * 100);
    };

    // Current totals
    const currentUniques = new Set(currentVisits.map(v => v.viewerIp)).size;
    const currentTime = currentVisits.reduce((acc, v) => acc + (v.durationSeconds || 0), 0);
    
    // Previous totals
    const previousUniques = new Set(previousVisits.map(v => v.viewerIp)).size;
    const previousTime = previousVisits.reduce((acc, v) => acc + (v.durationSeconds || 0), 0);

    const formatTime = (totalSecs: number) => {
      const m = Math.floor(totalSecs / 60);
      const s = totalSecs % 60;
      return `${m}m ${s}s`;
    };

    const currentAvgTime = currentVisits.length > 0 ? Math.round(currentTime / currentVisits.length) : 0;
    const previousAvgTime = previousVisits.length > 0 ? Math.round(previousTime / previousVisits.length) : 0;

    return NextResponse.json({
      metrics: {
        totalViews: currentVisits.length,
        uniqueVisitors: currentUniques,
        linkClicks: currentClicks.length,
        totalTime: formatTime(currentTime),
        avgTime: formatTime(currentAvgTime),
        growth: {
          views: calcGrowth(currentVisits.length, previousVisits.length),
          visitors: calcGrowth(currentUniques, previousUniques),
          clicks: calcGrowth(currentClicks.length, previousClicks.length),
          time: calcGrowth(currentTime, previousTime),
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
