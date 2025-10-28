import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Password for all test users: "password123"
  const hashedPassword = await hash("password123", 10);

  // Create USER role test account
  const user = await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {},
    create: {
      email: "user@test.com",
      name: "Test User",
      password: hashedPassword,
      role: "USER",
    },
  });

  // Create STAFF role test account
  const staff = await prisma.user.upsert({
    where: { email: "staff@test.com" },
    update: {},
    create: {
      email: "staff@test.com",
      name: "Test Staff",
      password: hashedPassword,
      role: "STAFF",
    },
  });

  // Create ADMIN role test account
  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      email: "admin@test.com",
      name: "Test Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Test users created successfully!");
  console.log("\n📧 Login credentials:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("USER Role:");
  console.log("  Email: user@test.com");
  console.log("  Password: password123");
  console.log("\nSTAFF Role:");
  console.log("  Email: staff@test.com");
  console.log("  Password: password123");
  console.log("\nADMIN Role:");
  console.log("  Email: admin@test.com");
  console.log("  Password: password123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
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
