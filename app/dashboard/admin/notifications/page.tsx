import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";

export default async function NotificationsPage() {
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
              <h1 className="text-3xl font-bold">通知・アナウンス</h1>
              <p className="mt-2 text-gray-600">一斉通知・対象別通知・チャット機能</p>
            </div>
            <Link
              href="/api/auth/signout"
              className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              ログアウト
            </Link>
          </div>

          <div className="rounded-lg bg-white p-12 shadow-md">
            <div className="text-center text-gray-500">
              メッセージング機能と統合予定です
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
