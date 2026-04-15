
import { prisma } from "../src/server/db";

async function main() {
  console.log("--- DEBUG: ALL PORTFOLIOS ---");
  const portfolios = await prisma.portfolio.findMany({
    select: { id: true, slug: true, userId: true }
  });

  console.log(`Found ${portfolios.length} portfolios total.`);

  const slugMap: Record<string, string[]> = {};
  portfolios.forEach(p => {
    const s = (p.slug || "").toLowerCase();
    if (!slugMap[s]) slugMap[s] = [];
    slugMap[s].push(p.id);
  });

  const duplicates = Object.entries(slugMap).filter(([s, ids]) => ids.length > 1);

  if (duplicates.length === 0) {
    console.log("✅ No duplicate slugs found in the array logic.");
  } else {
    console.log("❌ CRITICAL: Duplicate slugs found!");
    duplicates.forEach(([slug, ids]) => {
      console.log(`Slug: "${slug}" is used by portfolio IDs: ${ids.join(", ")}`);
    });
  }

  // Also try a raw SQL query to see if the DB allows it
  try {
    const rawResult: any = await prisma.$queryRaw`SELECT slug, COUNT(*) FROM "Portfolio" GROUP BY slug HAVING COUNT(*) > 1`;
    console.log("\n--- DB RAW QUERY RESULTS ---");
    console.log(rawResult);
  } catch (e) {
    console.log("Could not run raw query (maybe table name differs)");
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
