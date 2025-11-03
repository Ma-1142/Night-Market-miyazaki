import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Creating test event for today...");

  // Find the user
  const user = await prisma.user.findUnique({
    where: { email: "user@test.com" },
  });

  if (!user) {
    console.error("User not found! Please run seed first.");
    return;
  }

  // Find or create shop for user
  let shop = await prisma.shop.findFirst({
    where: { userId: user.id },
  });

  if (!shop) {
    shop = await prisma.shop.create({
      data: {
        userId: user.id,
        name: "テストショップ",
      },
    });
    console.log("Created shop:", shop.name);
  }

  // Create an approved form if it doesn't exist
  let form = await prisma.form.findFirst({
    where: {
      shopId: shop.id,
      status: "approved",
    },
  });

  if (!form) {
    form = await prisma.form.create({
      data: {
        shopId: shop.id,
        status: "approved",
        data: {
          formType: "food",
          shopName: "テストショップ",
          participationMonths: [new Date().getMonth() + 1],
          ownerName: "テストユーザー",
          ownerPhone: "090-1234-5678",
          ownerEmail: "user@test.com",
        },
      },
    });
    console.log("Created approved form:", form.id);
  }

  // Get today's date
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // Check if event for today exists
  const existingEvent = await prisma.event.findFirst({
    where: {
      formId: form.id,
      date: todayStart,
    },
  });

  if (existingEvent) {
    console.log("Event for today already exists:", existingEvent.id);
  } else {
    // Create event for today
    const event = await prisma.event.create({
      data: {
        formId: form.id,
        date: todayStart,
        startTime: "10:00",
        endTime: "17:00",
      },
    });
    console.log("Created event for today:", event.id);

    // Create booth assignment
    const boothAssignment = await prisma.boothAssignment.create({
      data: {
        formId: form.id,
        boothId: "A-01",
      },
    });
    console.log("Created booth assignment:", boothAssignment.boothId);
  }

  console.log("\n✅ Test data created successfully!");
  console.log("You can now:");
  console.log("1. Login as user@test.com (passwords123)");
  console.log("2. Visit /dashboard/user/today to see the event and check in");
  console.log("3. Login as staff@test.com (passwords123)");
  console.log("4. Visit /dashboard/staff/arrivals/today to see the arrival and confirm");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
