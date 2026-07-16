import { db } from "../server/db";
import { destinations, unifiedPackages, regions } from "../shared/schema";
import { eq, or, sql } from "drizzle-orm";

async function main() {
  console.log("🚀 Running production database fix...");

  // 1. UK / Scotland Package Migration
  const allDests = await db.select().from(destinations);
  
  const activeUk = allDests.find(d => d.name === "United Kingdom" && d.countryCode.toUpperCase() === "GB");
  const scotland = allDests.find(d => d.name === "Scotland" && d.countryCode.toUpperCase() === "GB");

  if (activeUk && scotland) {
    console.log(`✅ United Kingdom Destination ID: ${activeUk.id}`);
    console.log(`✅ Scotland Destination ID: ${scotland.id}`);
    
    const scotlandPkgs = await db
      .select()
      .from(unifiedPackages)
      .where(eq(unifiedPackages.destinationId, scotland.id));
    
    if (scotlandPkgs.length > 0) {
      console.log(`📦 Found ${scotlandPkgs.length} packages assigned to Scotland. Reassigning them to United Kingdom...`);
      const result = await db
        .update(unifiedPackages)
        .set({ destinationId: activeUk.id })
        .where(eq(unifiedPackages.destinationId, scotland.id))
        .returning();
      console.log(`🎉 Successfully migrated ${result.length} packages to United Kingdom!`);
    } else {
      console.log("ℹ️ No packages found under Scotland to migrate.");
    }
  } else {
    console.log("ℹ️ Scotland or UK destination not found in database, skipping package migration.");
  }

  // 2. Global Packages regionId Fix
  const globalRegion = await db.query.regions.findFirst({
    where: eq(regions.slug, "global")
  });

  if (globalRegion) {
    console.log(`✅ Found Global Region ID: ${globalRegion.id}`);
    
    // Find packages that are global but have null/wrong regionId
    const globalPkgs = await db
      .select()
      .from(unifiedPackages)
      .where(
        or(
          eq(unifiedPackages.type, "global"),
          sql`array_length(${unifiedPackages.coverage}, 1) > 10`
        )
      );

    const needsFix = globalPkgs.filter(p => p.regionId !== globalRegion.id);

    if (needsFix.length > 0) {
      console.log(`📦 Found ${needsFix.length} global packages missing regionId. Updating to Global region...`);
      
      let updatedCount = 0;
      for (const pkg of needsFix) {
        await db
          .update(unifiedPackages)
          .set({ regionId: globalRegion.id })
          .where(eq(unifiedPackages.id, pkg.id));
        updatedCount++;
      }
      
      console.log(`🎉 Successfully updated regionId for ${updatedCount} global packages!`);
    } else {
      console.log("ℹ️ All global packages already have correct regionId.");
    }
  } else {
    console.error("❌ Global region not found in database.");
  }

  console.log("🔥 Database migration checks completed successfully!");
}

main().catch(console.error);
