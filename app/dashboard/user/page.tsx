import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function UserDashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login/user");
  }

  if (session.user.role !== "USER") {
    redirect("/");
  }

  // Get user's submitted forms
  const userForms = await prisma.form.findMany({
    where: {
      shop: {
        userId: session.user.id as string,
      },
    },
    include: {
      shop: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Helper function to get form type label
  const getFormTypeLabel = (formType: string) => {
    switch (formType) {
      case "food":
        return "飲食";
      case "goods":
        return "物販";
      case "workshop":
        return "ワークショップ";
      default:
        return "その他";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">出店者ダッシュボード</h1>
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

        <div className="mx-auto max-w-4xl space-y-8">
          <div className="rounded-lg bg-white p-8 shadow-md">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold">出店フォームを選択してください</h2>
              <p className="mt-2 text-gray-600">該当する出店タイプを選んでください</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Link
                href="/dashboard/user/food"
                className="flex flex-col items-center rounded-lg border-2 border-orange-500 bg-white p-6 text-center transition-all hover:bg-orange-50 hover:shadow-lg"
              >
                <div className="mb-4 text-5xl">🍜</div>
                <h3 className="text-lg font-bold text-gray-800">飲食出店フォーム</h3>
                <p className="mt-2 text-sm text-gray-600">屋台・キッチンカー・飲食ブース</p>
              </Link>

              <Link
                href="/dashboard/user/goods"
                className="flex flex-col items-center rounded-lg border-2 border-purple-500 bg-white p-6 text-center transition-all hover:bg-purple-50 hover:shadow-lg"
              >
                <div className="mb-4 text-5xl">🛍️</div>
                <h3 className="text-lg font-bold text-gray-800">物販・雑貨出店フォーム</h3>
                <p className="mt-2 text-sm text-gray-600">物販・雑貨・アクセサリーなど</p>
              </Link>

              <Link
                href="/dashboard/user/workshop"
                className="flex flex-col items-center rounded-lg border-2 border-green-500 bg-white p-6 text-center transition-all hover:bg-green-50 hover:shadow-lg"
              >
                <div className="mb-4 text-5xl">✨</div>
                <h3 className="text-lg font-bold text-gray-800">ワークショップ・体験・その他出店フォーム</h3>
                <p className="mt-2 text-sm text-gray-600">体験型・その他のブース</p>
              </Link>
            </div>
          </div>

          {/* Submitted Forms History */}
          <div className="rounded-lg bg-white p-8 shadow-md">
            <h2 className="text-2xl font-bold mb-6">提出済みフォーム</h2>

            {userForms.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                まだフォームを提出していません
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        店舗名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        タイプ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        提出日
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ステータス
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userForms.map((form) => (
                      <tr key={form.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {form.shop.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getFormTypeLabel((form.data as any).formType)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(form.createdAt).toLocaleDateString("ja-JP", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {form.status === "pending" && (
                            <span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-5 text-yellow-800">
                              審査中
                            </span>
                          )}
                          {form.status === "approved" && (
                            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                              承認済み
                            </span>
                          )}
                          {form.status === "rejected" && (
                            <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
                              却下
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            href={`/dashboard/user/forms/${form.id}`}
                            className="text-blue-600 hover:text-blue-900 hover:underline"
                          >
                            詳細を見る
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
