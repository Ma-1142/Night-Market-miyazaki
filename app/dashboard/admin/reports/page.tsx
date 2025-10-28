import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { prisma } from "@/lib/prisma";

export default async function ReportsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login/admin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const forms = await prisma.form.findMany();
  const vendors = await prisma.user.findMany({ where: { role: "USER" } });

  const stats = {
    totalApplications: forms.length,
    pendingApplications: forms.filter((f) => f.status === "pending").length,
    approvedApplications: forms.filter((f) => f.status === "approved").length,
    rejectedApplications: forms.filter((f) => f.status === "rejected").length,
    totalVendors: vendors.length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="p-8 pl-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">レポート／統計</h1>
              <p className="mt-2 text-gray-600">申込数・売上・入金率・書類不備率</p>
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
              <div className="text-3xl font-bold mt-2">{stats.totalApplications}</div>
              <div className="text-sm text-gray-500 mt-1">件</div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="text-sm text-gray-600">確定数</div>
              <div className="text-3xl font-bold mt-2 text-green-600">{stats.approvedApplications}</div>
              <div className="text-sm text-gray-500 mt-1">件</div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="text-sm text-gray-600">キャンセル／却下</div>
              <div className="text-3xl font-bold mt-2 text-red-600">{stats.rejectedApplications}</div>
              <div className="text-sm text-gray-500 mt-1">件</div>
            </div>
          </div>

          <div className="rounded-lg bg-white shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold">統計詳細</h2>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    項目
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    数値
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    割合
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    出店申込数
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stats.totalApplications} 件
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    100%
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    保留中
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stats.pendingApplications} 件
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stats.totalApplications > 0
                      ? Math.round((stats.pendingApplications / stats.totalApplications) * 100)
                      : 0}%
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    確定数
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stats.approvedApplications} 件
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stats.totalApplications > 0
                      ? Math.round((stats.approvedApplications / stats.totalApplications) * 100)
                      : 0}%
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    登録出店者数
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stats.totalVendors} 名
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    売上・入金率
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    -
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    準備中
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    書類不備率
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    -
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    準備中
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
