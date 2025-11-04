import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash("passwords123", 10);

  console.log("Creating test vendor for today (2025-11-04)...\n");

  // Create a test vendor user
  const vendor = await prisma.user.upsert({
    where: { email: "vendor.today@test.com" },
    update: {},
    create: {
      email: "vendor.today@test.com",
      name: "今日のベンダー (Today's Vendor)",
      password: hashedPassword,
      role: "USER",
    },
  });

  console.log("✅ Vendor user created:", vendor.name);

  // Create a shop for this vendor
  const shop = await prisma.shop.upsert({
    where: { id: "test-shop-today-001" },
    update: {},
    create: {
      id: "test-shop-today-001",
      name: "本日テスト店舗 (Today's Test Shop)",
      description: "Arrival tracking test shop for November 4, 2025",
      userId: vendor.id,
    },
  });

  console.log("✅ Shop created:", shop.name);

  // Create a form submission (approved)
  const form = await prisma.form.upsert({
    where: { id: "test-form-today-001" },
    update: {},
    create: {
      id: "test-form-today-001",
      shopId: shop.id,
      status: "approved",
      data: {
        formType: "food",
        shopName: "本日テスト店舗",
        representativeName: "今日のベンダー",
        email: "vendor.today@test.com",
        phone: "090-1234-5678",
        participationPlan: "1month",
        boothType: "yatai",
        menuItems: [
          { name: "テストラーメン", price: "800円" },
          { name: "テスト餃子", price: "500円" },
        ],
        powerRequired: true,
        waterRequired: true,
        fireUsage: "gas",
        agreementSigned: true,
        agreementDate: "2025-11-01",
      },
    },
  });

  console.log("✅ Form created (approved):", form.id);

  // Create an event for today (November 4, 2025)
  const today = new Date("2025-11-04T09:00:00+09:00");

  const event = await prisma.event.upsert({
    where: { id: "test-event-today-001" },
    update: {},
    create: {
      id: "test-event-today-001",
      formId: form.id,
      date: today,
      startTime: "09:00",
      endTime: "18:00",
    },
  });

  console.log("✅ Event created for today:", today.toISOString());

  // Create arrival record (not yet arrived)
  const arrival = await prisma.arrival.upsert({
    where: {
      formId_eventDate: {
        formId: form.id,
        eventDate: today,
      },
    },
    update: {},
    create: {
      formId: form.id,
      eventDate: today,
      vendorCheckedIn: false,
      staffConfirmed: false,
    },
  });

  console.log("✅ Arrival record created:", arrival.id);

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 Test Vendor Summary");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Vendor Email: vendor.today@test.com");
  console.log("Password: passwords123");
  console.log("Shop Name: 本日テスト店舗 (Today's Test Shop)");
  console.log("Event Date: November 4, 2025");
  console.log("Event Time: 09:00 - 18:00");
  console.log("Status: Approved, Not Yet Arrived");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("✅ Test vendor created successfully!");
  console.log("You can now test the 到着済み (Arrival) button feature.\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
