import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import StaffSidebar from "@/components/StaffSidebar";

export default async function StaffDashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login/staff");
  }

  if (session.user.role !== "STAFF") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffSidebar />
      <div className="p-8 pl-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">次回出店日と時間の表示</h1>
              <p className="mt-2 text-gray-600">
                ようこそ、{session.user?.name || session.user?.email}さん
              </p>
            </div>
            <Link
              href="/api/auth/signout"
              className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
            >
              ログアウト
            </Link>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-md mb-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h2 className="text-2xl font-bold text-gray-900">次回イベント</h2>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-700">
                  <span className="font-semibold w-24">日付:</span>
                  <span className="text-lg">2025年11月15日（土）</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="font-semibold w-24">時間:</span>
                  <span className="text-lg">17:00 - 22:00</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="font-semibold w-24">場所:</span>
                  <span className="text-lg">宮崎市中央公園</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-md">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">今後の予定</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                <div>
                  <div className="font-semibold text-gray-900">2025年12月20日（金）</div>
                  <div className="text-sm text-gray-600">18:00 - 23:00 | 宮崎市中央公園</div>
                </div>
                <span className="text-sm text-gray-500">クリスマス特別開催</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                <div>
                  <div className="font-semibold text-gray-900">2026年1月18日（日）</div>
                  <div className="text-sm text-gray-600">16:00 - 21:00 | 宮崎市中央公園</div>
                </div>
                <span className="text-sm text-gray-500">新年特別企画</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
