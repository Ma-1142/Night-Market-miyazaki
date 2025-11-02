import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Adding chat rooms...\n");

  // Get admin user
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!admin) {
    console.log("No admin user found. Creating one...");
    return;
  }

  // Create chat rooms
  const userChatRoom = await prisma.chatRoom.upsert({
    where: { id: "user-chatroom" },
    update: {},
    create: {
      id: "user-chatroom",
      name: "出展者向けチャット",
      type: "USER",
    },
  });

  const staffChatRoom = await prisma.chatRoom.upsert({
    where: { id: "staff-chatroom" },
    update: {},
    create: {
      id: "staff-chatroom",
      name: "スタッフ向けチャット",
      type: "STAFF",
    },
  });

  // Create welcome messages
  await prisma.message.create({
    data: {
      chatRoomId: userChatRoom.id,
      senderId: admin.id,
      content: "出展者の皆様、こちらは管理者との連絡用チャットルームです。ご質問等がございましたらお気軽にメッセージをお送りください。",
    },
  });

  await prisma.message.create({
    data: {
      chatRoomId: staffChatRoom.id,
      senderId: admin.id,
      content: "スタッフの皆様、こちらは管理者との連絡用チャットルームです。業務に関する連絡事項を共有します。",
    },
  });

  console.log("✅ Created chat rooms and welcome messages\n");
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
