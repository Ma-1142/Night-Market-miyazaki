import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { prisma } from "@/lib/prisma";

export default async function ApplicationsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login/admin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const forms = await prisma.form.findMany({
    include: {
      shop: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="p-8 pl-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">応募管理</h1>
              <p className="mt-2 text-gray-600">応募フォーム受信一覧</p>
            </div>
            <Link
              href="/api/auth/signout"
              className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              ログアウト
            </Link>
          </div>

          {/* Filters */}
          <div className="mb-6 flex gap-4">
            <select className="rounded-md border border-gray-300 px-3 py-2">
              <option>全てのステータス</option>
              <option>受理</option>
              <option>審査中</option>
              <option>条件提示</option>
              <option>確定</option>
              <option>却下</option>
            </select>
            <input
              type="text"
              placeholder="検索..."
              className="rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="rounded-lg bg-white shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    申込ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    出店者名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    店舗名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    申込日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {forms.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      応募がまだありません
                    </td>
                  </tr>
                ) : (
                  forms.map((form) => (
                    <tr key={form.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {form.id.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {form.shop.user.name || form.shop.user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {form.shop.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(form.createdAt).toLocaleDateString("ja-JP")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/dashboard/admin/applications/${form.id}`}
                          className="text-blue-600 hover:text-blue-900 hover:underline mr-3"
                        >
                          詳細
                        </Link>
                        <button className="text-green-600 hover:text-green-900">
                          編集
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            合計: {forms.length} 件
          </div>
        </div>
      </div>
    </div>
  );
}
