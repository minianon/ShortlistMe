
import { prisma } from "../src/server/db";

async function main() {
  console.log("--- 🔍 AUDIT: Checking for duplicate slugs ---");
  const allPortfolios = await prisma.portfolio.findMany({
    orderBy: { createdAt: 'asc' }, // Keep the oldest one
    select: { id: true, slug: true, createdAt: true, userId: true }
  });

  const slugMap: Record<string, typeof allPortfolios> = {};
  allPortfolios.forEach(p => {
    const s = p.slug.toLowerCase();
    if (!slugMap[s]) slugMap[s] = [];
    slugMap[s].push(p);
  });

  const duplicateGroups = Object.entries(slugMap).filter(([s, list]) => list.length > 1);

  if (duplicateGroups.length === 0) {
    console.log("✅ No duplicate slugs found. Ready for DB push.");
    return;
  }

  console.log(`❌ Found ${duplicateGroups.length} duplicate slug clusters. Resolving...`);

  for (const [slug, portfolios] of duplicateGroups) {
    // Portfolios are sorted by createdAt ASC.
    // Keep the first one, rename the rest.
    const [original, ...toRename] = portfolios;
    console.log(`\nSlug: "${slug}"`);
    console.log(`  Keeping original: ID ${original.id} (Created: ${original.createdAt.toISOString()})`);

    for (let i = 0; i < toRename.length; i++) {
        const p = toRename[i];
        let newSlug = `${slug}-${i + 1}`;
        let attempt = 1;
        
        // Find a truly unique one
        while (true) {
            const collision = await prisma.portfolio.findFirst({
                where: { slug: { equals: newSlug, mode: 'insensitive' } }
            });
            if (!collision) break;
            newSlug = `${slug}-${i + 1 + attempt}`;
            attempt++;
        }

        console.log(`  Renaming Duplicate: ID ${p.id} -> "${newSlug}" (Created: ${p.createdAt.toISOString()})`);
        await prisma.portfolio.update({
            where: { id: p.id },
            data: { slug: newSlug }
        });
    }
  }

  console.log("\n✅ Duplicate resolution complete.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
