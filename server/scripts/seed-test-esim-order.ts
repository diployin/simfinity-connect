import { db } from "../db";
import { users, unifiedPackages, orders } from "@shared/schema";
import { eq, and } from "drizzle-orm";

const TEST_USER_ID = "690dfb75-af56-4d82-b39d-9ca8211724db";

async function main() {
  console.log("🚀 Seeding test eSIM order with shortUrl...\n");

  // 1. Check user exists
  const [user] = await db.select().from(users).where(eq(users.id, TEST_USER_ID)).limit(1);
  if (!user) {
    console.log(`❌ User ${TEST_USER_ID} not found. Please create the user first.`);
    process.exit(1);
  }
  console.log(`✅ Found user: ${user.email || user.id}`);

  // 2. Get an enabled package
  const [pkg] = await db.select()
    .from(unifiedPackages)
    .where(and(eq(unifiedPackages.isEnabled, true)))
    .limit(1);

  if (!pkg) {
    console.log("❌ No enabled packages found in unified_packages.");
    process.exit(1);
  }
  console.log(`✅ Found package: ${pkg.title} (${pkg.id})`);

  // 3. Check if user already has a completed order with this package
  const [existingOrder] = await db.select()
    .from(orders)
    .where(and(
      eq(orders.userId, TEST_USER_ID),
      eq(orders.packageId, pkg.id),
      eq(orders.status, "completed"),
    ))
    .limit(1);

  if (existingOrder) {
    // Update existing order with shortUrl if not set
    if (!existingOrder.shortUrl) {
      await db.update(orders)
        .set({
          shortUrl: "https://example.com/quick-setup/test",
          updatedAt: new Date(),
        })
        .where(eq(orders.id, existingOrder.id));
      console.log(`✅ Updated existing order ${existingOrder.id} with shortUrl`);
    } else {
      console.log(`⏭️  Order ${existingOrder.id} already has shortUrl: ${existingOrder.shortUrl}`);
    }
  } else {
    // Insert a new test order
    const [newOrder] = await db.insert(orders).values({
      userId: TEST_USER_ID,
      packageId: pkg.id,
      providerId: pkg.providerId,
      status: "completed",
      price: pkg.retailPrice,
      wholesalePrice: pkg.wholesalePrice,
      currency: pkg.currency,
      orderCurrency: pkg.currency,
      dataAmount: pkg.dataAmount,
      validity: pkg.validityDays,
      iccid: "89000000000000000000",
      shortUrl: "https://example.com/quick-setup/test",
      qrCodeUrl: pkg.operatorImage || null,
      esimStatus: "active",
      activatedAt: new Date(),
      expiresAt: new Date(Date.now() + pkg.validityDays * 86400000),
    }).returning();

    console.log(`✅ Created test order ${newOrder.id} with shortUrl`);
  }

  console.log("\n✅ Done! The Quick Setup button should now appear in My eSIMs for the test user.");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
