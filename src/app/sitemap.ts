import type { MetadataRoute } from "next";

import { prisma } from "@/server/db";
import { SITE_URL } from "@/lib/site";

/** Rebuilt hourly, so newly published portfolios show up without a deploy. */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const home: MetadataRoute.Sitemap = [{ url: SITE_URL, changeFrequency: "weekly", priority: 1 }];

  try {
    /* Only portfolios that are published and public — private ones must never be listed. */
    const portfolios = await prisma.portfolio.findMany({
      where: { isPublic: true, publishedVersionId: { not: null } },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 5000,
    });
    return [
      ...home,
      ...portfolios.map((p: { slug: string; updatedAt: Date }) => ({ url: `${SITE_URL}/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
    ];
  } catch (error) {
    console.error("[sitemap] could not list portfolios", error);
    return home;
  }
}
