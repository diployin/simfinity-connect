import { db } from "../server/db";
import { destinations, unifiedPackages } from "../shared/schema";
import { eq, and } from "drizzle-orm";

async function main() {
  console.log("🚀 Running production database fix...");

  // 1. Find the main United Kingdom destination (active: true, code: GB)
  const allDests = await db.select().from(destinations);
  
  const activeUk = allDests.find(d => d.name === "United Kingdom" && d.countryCode.toUpperCase() === "GB");
  const scotland = allDests.find(d => d.name === "Scotland" && d.countryCode.toUpperCase() === "GB");

  if (!activeUk) {
    console.error("❌ Active United Kingdom destination not found in database.");
    return;
  }

  console.log(`✅ Found United Kingdom Destination ID: ${activeUk.id}`);

  if (scotland) {
    console.log(`✅ Found Scotland Destination ID: ${scotland.id}`);
    
    // Find packages assigned to Scotland
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
    console.log("ℹ️ Scotland destination not found in database, no packages to migrate.");
  }

  console.log("🔥 Database check complete. Please trigger a Provider Sync in your Admin Dashboard to ensure packages are fully up-to-date!");
}

main().catch(console.error);
