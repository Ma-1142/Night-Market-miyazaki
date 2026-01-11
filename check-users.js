const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    console.log('=== ユーザー一覧 ===');
    console.log(`合計: ${users.length}人`);
    console.log('');

    users.forEach(user => {
      console.log(`ID: ${user.id}`);
      console.log(`名前: ${user.name || '未設定'}`);
      console.log(`メール: ${user.email}`);
      console.log(`ロール: ${user.role}`);
      console.log(`作成日: ${user.createdAt}`);
      console.log('---');
    });

  } catch (error) {
    console.error('エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
