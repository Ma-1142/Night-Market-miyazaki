import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login/admin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

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
              <div className="text-3xl font-bold mt-2">0</div>
              <div className="text-sm text-gray-500 mt-1">件</div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="text-sm text-gray-600">出店者数</div>
              <div className="text-3xl font-bold mt-2">1</div>
              <div className="text-sm text-gray-500 mt-1">名</div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="text-sm text-gray-600">スタッフ数</div>
              <div className="text-3xl font-bold mt-2">1</div>
              <div className="text-sm text-gray-500 mt-1">名</div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
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
        </div>
      </div>
    </div>
  );
}
