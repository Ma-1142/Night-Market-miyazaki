import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login/admin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Get statistics
  const [totalForms, totalUsers, totalStaff, approvedForms] = await Promise.all([
    prisma.form.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.user.count({ where: { role: "STAFF" } }),
    prisma.form.findMany({
      where: { status: "approved" },
      include: {
        shop: { include: { user: true } },
        events: { orderBy: { date: "asc" } },
      },
    }),
  ]);

  // Group approved forms by participation months for schedule overview
  const shopsByMonth: Record<number, Array<{
    shopName: string;
    ownerName: string;
    formType: string;
    formId: string;
    participationMonths: number[];
  }>> = {};

  approvedForms.forEach((form) => {
    const formData = form.data as any;
    const participationMonths = formData.participationMonths || [];
    const formType = formData.formType || "food";
    const shopName = formData.shopName || formData.brandName || formData.boothName || form.shop.name;

    participationMonths.forEach((month: number) => {
      if (!shopsByMonth[month]) {
        shopsByMonth[month] = [];
      }

      shopsByMonth[month].push({
        shopName,
        ownerName: form.shop.user.name || form.shop.user.email,
        formType,
        formId: form.id,
        participationMonths,
      });
    });
  });

  // Get current month and create array of next 3 months for preview
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const previewMonths = Array.from({ length: 3 }, (_, i) => {
    const monthNum = ((currentMonth - 1 + i) % 12) + 1;
    return monthNum;
  });

  const getMonthName = (month: number) => {
    const year = month < currentMonth ? currentYear + 1 : currentYear;
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="p-8 pl-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">管理者ダッシュボード</h1>
              <p className="mt-2 text-gray-600">
                ようこそ、{session.user?.name || session.user?.email}さん
              </p>
            </div>
            <Link
              href="/api/auth/signout"
              className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              ログアウト
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="text-sm text-gray-600">総申込数</div>
              <div className="text-3xl font-bold mt-2">{totalForms}</div>
              <div className="text-sm text-gray-500 mt-1">件</div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="text-sm text-gray-600">出店者数</div>
              <div className="text-3xl font-bold mt-2">{totalUsers}</div>
              <div className="text-sm text-gray-500 mt-1">名</div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="text-sm text-gray-600">スタッフ数</div>
              <div className="text-3xl font-bold mt-2">{totalStaff}</div>
              <div className="text-sm text-gray-500 mt-1">名</div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4">クイックアクセス</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Link href="/dashboard/admin/applications" className="p-4 border rounded-md hover:bg-gray-50">
                <div className="font-semibold">応募管理</div>
                <div className="text-sm text-gray-600 mt-1">応募フォームの管理</div>
              </Link>
              <Link href="/dashboard/admin/vendors" className="p-4 border rounded-md hover:bg-gray-50">
                <div className="font-semibold">出店者管理</div>
                <div className="text-sm text-gray-600 mt-1">出店者情報の管理</div>
              </Link>
              <Link href="/dashboard/admin/events" className="p-4 border rounded-md hover:bg-gray-50">
                <div className="font-semibold">開催日・枠管理</div>
                <div className="text-sm text-gray-600 mt-1">イベント日程の設定</div>
              </Link>
            </div>
          </div>

          {/* Schedule Overview */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">出店予定一覧（今後3ヶ月）</h2>
              <Link
                href="/dashboard/staff"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                全スケジュールを見る →
              </Link>
            </div>

            <div className="space-y-6">
              {previewMonths.map((month, index) => {
                const shops = shopsByMonth[month] || [];
                const isCurrentMonth = index === 0;

                return (
                  <div
                    key={month}
                    className={`pb-6 border-b last:border-b-0 ${
                      isCurrentMonth ? "border-l-4 border-blue-500 pl-4 -ml-2" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        {getMonthName(month)}
                      </h3>
                      {isCurrentMonth && (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                          今月
                        </span>
                      )}
                      <span className="text-sm text-gray-600">
                        {shops.length} 店舗
                      </span>
                    </div>

                    {shops.length === 0 ? (
                      <div className="text-sm text-gray-400 italic">
                        この月の出店予定はまだありません
                      </div>
                    ) : (
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                        {shops.slice(0, 8).map((shop, shopIndex) => (
                          <Link
                            key={`${month}-${shopIndex}`}
                            href={`/dashboard/admin/applications/${shop.formId}`}
                            className="block p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
                          >
                            <div className="font-semibold text-sm text-gray-900 truncate">
                              {shop.shopName}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {shop.formType === "food" && "🍜 飲食"}
                              {shop.formType === "goods" && "🛍️ 物販"}
                              {shop.formType === "workshop" && "✨ ワークショップ"}
                            </div>
                            <div className="text-xs text-blue-600 mt-1">
                              参加月: {shop.participationMonths.map((m) => `${m}月`).join("、")}
                            </div>
                          </Link>
                        ))}
                        {shops.length > 8 && (
                          <div className="flex items-center justify-center p-3 bg-gray-50 rounded-md border border-gray-200 text-gray-500 text-sm">
                            他 {shops.length - 8} 店舗
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
