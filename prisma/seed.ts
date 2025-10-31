import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Password for all test users: "password123"
  const hashedPassword = await hash("password123", 10);

  console.log("Starting database seed...\n");

  // Create test accounts (admin, staff, user)
  const testUser = await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {},
    create: {
      email: "user@test.com",
      name: "Test User",
      password: hashedPassword,
      role: "USER",
    },
  });

  const testStaff = await prisma.user.upsert({
    where: { email: "staff@test.com" },
    update: {},
    create: {
      email: "staff@test.com",
      name: "Test Staff",
      password: hashedPassword,
      role: "STAFF",
    },
  });

  const testAdmin = await prisma.user.upsert({
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

  // Create sample vendor users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "user1@example.com" },
      update: {},
      create: {
        email: "user1@example.com",
        name: "田中 太郎",
        password: hashedPassword,
        role: "USER",
      },
    }),
    prisma.user.upsert({
      where: { email: "user2@example.com" },
      update: {},
      create: {
        email: "user2@example.com",
        name: "佐藤 花子",
        password: hashedPassword,
        role: "USER",
      },
    }),
    prisma.user.upsert({
      where: { email: "user3@example.com" },
      update: {},
      create: {
        email: "user3@example.com",
        name: "鈴木 健太",
        password: hashedPassword,
        role: "USER",
      },
    }),
    prisma.user.upsert({
      where: { email: "user4@example.com" },
      update: {},
      create: {
        email: "user4@example.com",
        name: "高橋 美咲",
        password: hashedPassword,
        role: "USER",
      },
    }),
    prisma.user.upsert({
      where: { email: "user5@example.com" },
      update: {},
      create: {
        email: "user5@example.com",
        name: "渡辺 勇気",
        password: hashedPassword,
        role: "USER",
      },
    }),
  ]);

  console.log("✅ Created 5 sample vendor users");

  // Sample food forms data
  const foodFormsData = [
    {
      shopName: "宮崎チキン南蛮本舗",
      formType: "food",
      contactPerson: "山田 一郎",
      phone: "090-1234-5678",
      email: "user1@example.com",
      emailConfirm: "user1@example.com",
      boothType: "yatai",
      participationMonths: ["1", "2", "3", "4", "5", "6"],
      participationPlan: "6months",
      businessType: "チキン南蛮専門店",
      menuItems: "宮崎名物チキン南蛮、タルタルソース付き唐揚げ、チキン南蛮丼",
      priceRange: "¥600〜¥1,200",
      cookingMethod: "fire",
      allergens: ["卵", "小麦", "乳"],
      allergensOther: "",
      requiredSpace: "3m×3m",
      salesDescription: "宮崎県産の新鮮な地鶏を使った本格チキン南蛮をお届けします！",
      businessPermit: "permit-1.pdf",
      foodSafetyCert: "cert-1.pdf",
      insuranceStatus: "enrolled",
      agreementCheck: "on",
      companyName: "宮崎フードサービス株式会社",
      representativeName: "山田 一郎",
      companyAddress: "宮崎県宮崎市橘通東1-1-1",
      snsLinks: "Instagram: @miyazaki_chicken\nX: @miyazaki_nanban",
      remarks: "電源が必要です",
    },
    {
      shopName: "マンゴースイーツカフェ",
      formType: "food",
      contactPerson: "佐藤 花子",
      phone: "080-9876-5432",
      email: "user2@example.com",
      emailConfirm: "user2@example.com",
      boothType: "kitchencar",
      participationMonths: ["4", "5", "6", "7", "8", "9"],
      participationPlan: "6months",
      businessType: "スイーツ・ドリンク",
      menuItems: "完熟マンゴーパフェ、マンゴージュース、マンゴーかき氷",
      priceRange: "¥500〜¥1,500",
      cookingMethod: "electric",
      allergens: ["乳"],
      allergensOther: "マンゴー",
      vehicleSize: "全長4.5m・高さ2.3m",
      requiredSpace: "5m×3m",
      salesDescription: "宮崎県産の完熟マンゴーを贅沢に使用したスイーツとドリンクをご提供！",
      businessPermit: "permit-2.pdf",
      foodSafetyCert: "cert-2.pdf",
      insuranceStatus: "enrolled",
      agreementCheck: "on",
      companyName: "トロピカルデザート株式会社",
      representativeName: "佐藤 花子",
      companyAddress: "宮崎県宮崎市神宮2-2-2",
      snsLinks: "Instagram: @mango_cafe_miyazaki",
      remarks: "冷蔵設備を使用するため電源容量をご確認ください",
    },
    {
      shopName: "地頭鶏炭火焼き",
      formType: "food",
      contactPerson: "鈴木 健太",
      phone: "090-5555-1111",
      email: "user3@example.com",
      emailConfirm: "user3@example.com",
      boothType: "yatai",
      participationMonths: ["1", "2", "11", "12"],
      participationPlan: "1month",
      businessType: "焼き鳥・炭火焼き",
      menuItems: "地頭鶏もも焼き、砂肝、レバー、手羽先、焼き鳥盛り合わせ",
      priceRange: "¥300〜¥800",
      cookingMethod: "fire",
      allergens: [],
      allergensOther: "",
      requiredSpace: "3m×3m",
      salesDescription: "宮崎が誇る地頭鶏を炭火でじっくり焼き上げます！香ばしい香りが自慢です。",
      businessPermit: "permit-3.pdf",
      foodSafetyCert: "cert-3.pdf",
      insuranceStatus: "enrolled",
      agreementCheck: "on",
      companyName: "九州やきとり本舗",
      representativeName: "鈴木 健太",
      companyAddress: "宮崎県宮崎市中央通3-3-3",
      snsLinks: "X: @jitokko_yakitori",
      remarks: "炭火を使用するため、煙が出ます。配置場所にご配慮ください。",
    },
    {
      shopName: "釜揚げうどん 讃岐",
      formType: "food",
      contactPerson: "高橋 美咲",
      phone: "080-7777-2222",
      email: "user4@example.com",
      emailConfirm: "user4@example.com",
      boothType: "tent",
      participationMonths: ["1", "2", "3", "10", "11", "12"],
      participationPlan: "6months",
      businessType: "うどん専門店",
      menuItems: "釜揚げうどん、ぶっかけうどん、天ぷらうどん、カレーうどん",
      priceRange: "¥400〜¥900",
      cookingMethod: "fire",
      allergens: ["小麦", "えび"],
      allergensOther: "",
      requiredSpace: "4m×4m",
      salesDescription: "毎朝手打ちで作る本格讃岐うどん。コシのある麺が自慢です！",
      businessPermit: "permit-4.pdf",
      foodSafetyCert: "cert-4.pdf",
      insuranceStatus: "enrolled",
      agreementCheck: "on",
      companyName: "讃岐うどん本舗",
      representativeName: "高橋 美咲",
      companyAddress: "宮崎県宮崎市昭和町4-4-4",
      snsLinks: "Instagram: @sanuki_udon_miyazaki\nTikTok: @sanuki_udon",
      remarks: "水道設備が必要です",
    },
    {
      shopName: "クラフトビール工房",
      formType: "food",
      contactPerson: "渡辺 勇気",
      phone: "090-3333-8888",
      email: "user5@example.com",
      emailConfirm: "user5@example.com",
      boothType: "kitchencar",
      participationMonths: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      participationPlan: "1yearA",
      businessType: "クラフトビール・ドリンク",
      menuItems: "宮崎クラフトIPA、ヴァイツェン、スタウト、ノンアルコールビール",
      priceRange: "¥600〜¥1,000",
      cookingMethod: "electric",
      allergens: ["小麦"],
      allergensOther: "",
      vehicleSize: "全長5m・高さ2.5m",
      requiredSpace: "5m×3m",
      salesDescription: "宮崎の素材を使った地ビールを販売！フルーティーな味わいが特徴です。",
      businessPermit: "permit-5.pdf",
      foodSafetyCert: "cert-5.pdf",
      insuranceStatus: "enrolled",
      agreementCheck: "on",
      companyName: "宮崎ブルワリー株式会社",
      representativeName: "渡辺 勇気",
      companyAddress: "宮崎県宮崎市橘通西5-5-5",
      snsLinks: "Instagram: @miyazaki_brewery\nX: @craft_beer_miya",
      remarks: "酒類販売許可証を別途提出予定です",
    },
  ];

  // Sample goods forms data
  const goodsFormsData = [
    {
      shopName: "宮崎クラフト工房",
      formType: "goods",
      contactPerson: "伊藤 真美",
      phone: "090-2222-3333",
      email: "user1@example.com",
      emailConfirm: "user1@example.com",
      boothType: "tent",
      participationMonths: ["4", "5", "6", "7", "8"],
      participationPlan: "1month",
      businessType: "ハンドメイドアクセサリー",
      productDescription: "天然石を使ったブレスレット、ピアス、ネックレス、キーホルダー",
      priceRange: "¥800〜¥5,000",
      productOrigin: "自社製作（宮崎県内）",
      requiredSpace: "2m×2m",
      displayMethod: "テーブル展示、ディスプレイスタンド使用",
      salesDescription: "宮崎の自然をイメージした天然石アクセサリーを販売しています。",
      insuranceStatus: "enrolled",
      agreementCheck: "on",
      companyName: "クラフト工房美",
      representativeName: "伊藤 真美",
      companyAddress: "宮崎県宮崎市大橋6-6-6",
      snsLinks: "Instagram: @craft_miyazaki",
      remarks: "雨天時の対策として、テントが必要です",
    },
    {
      shopName: "オーガニックソープ工房",
      formType: "goods",
      contactPerson: "中村 由紀",
      phone: "080-4444-6666",
      email: "user2@example.com",
      emailConfirm: "user2@example.com",
      boothType: "tent",
      participationMonths: ["1", "2", "3", "4", "5", "6"],
      participationPlan: "6months",
      businessType: "手作り石鹸・コスメ",
      productDescription: "オーガニック石鹸、リップクリーム、ハンドクリーム、バスソルト",
      priceRange: "¥500〜¥3,000",
      productOrigin: "自社製作（国産原料使用）",
      requiredSpace: "2.5m×2.5m",
      displayMethod: "棚展示、サンプル展示",
      salesDescription: "化学添加物不使用の優しい石鹸とコスメを手作りしています。",
      insuranceStatus: "enrolled",
      agreementCheck: "on",
      companyName: "ナチュラルビューティー合同会社",
      representativeName: "中村 由紀",
      companyAddress: "宮崎県宮崎市清武町7-7-7",
      snsLinks: "Instagram: @organic_soap_miyazaki\nX: @natural_beauty_mz",
      remarks: "商品の香りサンプルを置きたいです",
    },
    {
      shopName: "レザークラフトショップ",
      formType: "goods",
      contactPerson: "小林 大輔",
      phone: "090-6666-7777",
      email: "user3@example.com",
      emailConfirm: "user3@example.com",
      boothType: "tent",
      participationMonths: ["9", "10", "11", "12"],
      participationPlan: "1month",
      businessType: "革製品・レザーグッズ",
      productDescription: "本革財布、キーケース、名刺入れ、バッグ、ベルト",
      priceRange: "¥2,000〜¥15,000",
      productOrigin: "自社製作（国産革使用）",
      requiredSpace: "3m×2m",
      displayMethod: "ディスプレイラック、壁掛け展示",
      salesDescription: "職人が一つ一つ手縫いで仕上げる本革製品を販売しています。",
      insuranceStatus: "enrolled",
      agreementCheck: "on",
      companyName: "レザーワークス宮崎",
      representativeName: "小林 大輔",
      companyAddress: "宮崎県宮崎市霧島8-8-8",
      snsLinks: "Instagram: @leather_works_miyazaki",
      remarks: "実演販売も検討しています",
    },
    {
      shopName: "古着セレクトショップ",
      formType: "goods",
      contactPerson: "吉田 彩",
      phone: "080-8888-9999",
      email: "user4@example.com",
      emailConfirm: "user4@example.com",
      boothType: "tent",
      participationMonths: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      participationPlan: "1yearB",
      businessType: "古着・ヴィンテージ衣料",
      productDescription: "ヴィンテージTシャツ、デニム、ジャケット、帽子、バッグ",
      priceRange: "¥1,000〜¥8,000",
      productOrigin: "仕入れ（国内外）",
      requiredSpace: "4m×3m",
      displayMethod: "ハンガーラック、テーブル展示",
      salesDescription: "70~90年代のヴィンテージアイテムを中心にセレクトしています。",
      insuranceStatus: "considering",
      agreementCheck: "on",
      companyName: "ヴィンテージスタイル",
      representativeName: "吉田 彩",
      companyAddress: "宮崎県宮崎市江平9-9-9",
      snsLinks: "Instagram: @vintage_style_mz\nTikTok: @vintage_miyazaki",
      remarks: "試着スペースが確保できれば助かります",
    },
    {
      shopName: "植物雑貨＆多肉植物",
      formType: "goods",
      contactPerson: "松本 緑",
      phone: "090-1111-2222",
      email: "user5@example.com",
      emailConfirm: "user5@example.com",
      boothType: "tent",
      participationMonths: ["3", "4", "5", "6", "7", "8"],
      participationPlan: "6months",
      businessType: "観葉植物・雑貨",
      productDescription: "多肉植物、サボテン、観葉植物、植木鉢、ガーデニング雑貨",
      priceRange: "¥300〜¥5,000",
      productOrigin: "自社栽培・仕入れ",
      requiredSpace: "3m×3m",
      displayMethod: "棚展示、地面展示",
      salesDescription: "育てやすい多肉植物と可愛い鉢のセットを販売しています。",
      insuranceStatus: "enrolled",
      agreementCheck: "on",
      companyName: "グリーンライフ宮崎",
      representativeName: "松本 緑",
      companyAddress: "宮崎県宮崎市大塚10-10-10",
      snsLinks: "Instagram: @green_life_miyazaki",
      remarks: "植物のため、日陰スペースが望ましいです",
    },
  ];

  // Sample workshop forms data
  const workshopFormsData = [
    {
      shopName: "キッズアート教室",
      formType: "workshop",
      contactPerson: "木村 愛子",
      phone: "090-5555-4444",
      email: "user1@example.com",
      emailConfirm: "user1@example.com",
      boothType: "tent",
      participationMonths: ["5", "6", "7", "8"],
      participationPlan: "1month",
      businessType: "子供向けアート体験",
      workshopContent: "お絵かき体験、粘土アート、折り紙教室",
      targetAge: "3歳〜12歳",
      sessionDuration: "30分",
      maxParticipants: "6人/回",
      participationFee: "¥500/1回",
      materialsProvided: "画材、粘土、折り紙など全て提供",
      requiredSpace: "4m×4m",
      requiredFacilities: "テーブル6台、椅子12脚",
      salesDescription: "子供たちの創造力を育むアート体験を提供します！",
      insuranceStatus: "enrolled",
      agreementCheck: "on",
      companyName: "アートキッズ宮崎",
      representativeName: "木村 愛子",
      companyAddress: "宮崎県宮崎市錦町11-11-11",
      snsLinks: "Instagram: @art_kids_miyazaki",
      remarks: "保護者同伴をお願いしています",
    },
    {
      shopName: "陶芸体験工房",
      formType: "workshop",
      contactPerson: "石井 拓也",
      phone: "080-3333-5555",
      email: "user2@example.com",
      emailConfirm: "user2@example.com",
      boothType: "tent",
      participationMonths: ["4", "5", "6", "9", "10", "11"],
      participationPlan: "6months",
      businessType: "陶芸・ろくろ体験",
      workshopContent: "手びねり陶芸、電動ろくろ体験",
      targetAge: "小学生以上（保護者同伴で未就学児も可）",
      sessionDuration: "45分",
      maxParticipants: "4人/回",
      participationFee: "¥1,500/1回（焼成・配送料込み）",
      materialsProvided: "粘土、道具一式",
      requiredSpace: "5m×4m",
      requiredFacilities: "電源、水道、テーブル、椅子",
      salesDescription: "初心者でも楽しめる陶芸体験！作品は後日焼成してお送りします。",
      insuranceStatus: "enrolled",
      agreementCheck: "on",
      companyName: "宮崎陶芸工房",
      representativeName: "石井 拓也",
      companyAddress: "宮崎県宮崎市花ケ島12-12-12",
      snsLinks: "Instagram: @pottery_miyazaki\nX: @tougeimiyazaki",
      remarks: "作品の焼成には2週間程度かかります",
    },
    {
      shopName: "アロマワークショップ",
      formType: "workshop",
      contactPerson: "前田 香織",
      phone: "090-7777-8888",
      email: "user3@example.com",
      emailConfirm: "user3@example.com",
      boothType: "tent",
      participationMonths: ["1", "2", "3", "10", "11", "12"],
      participationPlan: "6months",
      businessType: "アロマテラピー体験",
      workshopContent: "アロマスプレー作り、アロマワックスバー作り",
      targetAge: "中学生以上",
      sessionDuration: "20分",
      maxParticipants: "8人/回",
      participationFee: "¥800/1回",
      materialsProvided: "精油、容器、ワックス、装飾品など",
      requiredSpace: "3m×3m",
      requiredFacilities: "テーブル、椅子",
      salesDescription: "自分だけのオリジナルアロマグッズを作りましょう！",
      insuranceStatus: "enrolled",
      agreementCheck: "on",
      companyName: "アロマセラピー宮崎",
      representativeName: "前田 香織",
      companyAddress: "宮崎県宮崎市高千穂13-13-13",
      snsLinks: "Instagram: @aroma_workshop_mz",
      remarks: "アロマオイルを使用するため、換気が必要です",
    },
    {
      shopName: "マジックパフォーマンス",
      formType: "workshop",
      contactPerson: "山本 マジ太",
      phone: "080-9999-0000",
      email: "user4@example.com",
      emailConfirm: "user4@example.com",
      boothType: "tent",
      participationMonths: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      participationPlan: "1yearA",
      businessType: "マジックショー・マジック教室",
      workshopContent: "マジックショー観覧、簡単マジック教室",
      targetAge: "全年齢",
      sessionDuration: "ショー15分、教室30分",
      maxParticipants: "ショー50人、教室10人",
      participationFee: "ショー無料、教室¥500",
      materialsProvided: "マジック道具（教室参加者には持ち帰り用道具付き）",
      requiredSpace: "6m×5m",
      requiredFacilities: "電源、椅子、音響設備",
      salesDescription: "プロマジシャンによる本格マジックショー＆体験教室！",
      insuranceStatus: "enrolled",
      agreementCheck: "on",
      companyName: "エンターテイメント宮崎",
      representativeName: "山本 マジ太",
      companyAddress: "宮崎県宮崎市神宮西14-14-14",
      snsLinks: "Instagram: @magic_show_mz\nTikTok: @majita_magic\nX: @magic_miyazaki",
      remarks: "音響設備の確認をお願いします",
    },
    {
      shopName: "和太鼓体験道場",
      formType: "workshop",
      contactPerson: "田辺 太鼓",
      phone: "090-1234-9999",
      email: "user5@example.com",
      emailConfirm: "user5@example.com",
      boothType: "tent",
      participationMonths: ["8", "9", "10", "11"],
      participationPlan: "1month",
      businessType: "和太鼓演奏体験",
      workshopContent: "和太鼓の基本リズム体験、簡単な曲の演奏",
      targetAge: "小学生以上",
      sessionDuration: "30分",
      maxParticipants: "6人/回",
      participationFee: "¥800/1回",
      materialsProvided: "和太鼓、バチ",
      requiredSpace: "6m×6m",
      requiredFacilities: "広いスペース",
      salesDescription: "迫力満点の和太鼓を叩いてみよう！初心者大歓迎！",
      insuranceStatus: "enrolled",
      agreementCheck: "on",
      companyName: "和太鼓宮崎",
      representativeName: "田辺 太鼓",
      companyAddress: "宮崎県宮崎市橘通15-15-15",
      snsLinks: "Instagram: @wadaiko_miyazaki",
      remarks: "音が大きいため、他ブースから離れた配置が望ましいです",
    },
  ];

  const statuses = ["pending", "approved", "approved", "rejected", "pending"];

  // Create shops and forms for each user
  for (let i = 0; i < 5; i++) {
    // Food form
    const foodShop = await prisma.shop.create({
      data: {
        name: foodFormsData[i].shopName,
        description: foodFormsData[i].salesDescription,
        userId: users[i].id,
      },
    });

    const foodForm = await prisma.form.create({
      data: {
        shopId: foodShop.id,
        status: statuses[i],
        data: foodFormsData[i],
      },
    });

    // Add events for approved forms
    if (statuses[i] === "approved") {
      await prisma.event.create({
        data: {
          formId: foodForm.id,
          date: new Date(2025, 10, 15), // November 15, 2025
          startTime: "10:00",
          endTime: "18:00",
        },
      });
      await prisma.event.create({
        data: {
          formId: foodForm.id,
          date: new Date(2025, 11, 20), // December 20, 2025
          startTime: "11:00",
          endTime: "19:00",
        },
      });
    }

    // Goods form
    const goodsShop = await prisma.shop.create({
      data: {
        name: goodsFormsData[i].shopName,
        description: goodsFormsData[i].salesDescription,
        userId: users[i].id,
      },
    });

    await prisma.form.create({
      data: {
        shopId: goodsShop.id,
        status: statuses[(i + 1) % 5],
        data: goodsFormsData[i],
      },
    });

    // Workshop form
    const workshopShop = await prisma.shop.create({
      data: {
        name: workshopFormsData[i].shopName,
        description: workshopFormsData[i].salesDescription,
        userId: users[i].id,
      },
    });

    await prisma.form.create({
      data: {
        shopId: workshopShop.id,
        status: statuses[(i + 2) % 5],
        data: workshopFormsData[i],
      },
    });
  }

  console.log("✅ Created 15 sample forms (5 food, 5 goods, 5 workshop)");
  console.log("✅ Created sample events for approved forms");

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
  console.log("\nSample Vendor Users (all have password: password123):");
  console.log("  user1@example.com - 田中 太郎");
  console.log("  user2@example.com - 佐藤 花子");
  console.log("  user3@example.com - 鈴木 健太");
  console.log("  user4@example.com - 高橋 美咲");
  console.log("  user5@example.com - 渡辺 勇気");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("✅ Seed completed successfully!\n");
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
