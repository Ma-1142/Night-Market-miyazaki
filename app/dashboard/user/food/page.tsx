import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ShopForm from "@/components/ShopForm";

export default async function FoodFormPage() {
  const session = await auth();

  if (!session) {
    redirect("/login/user");
  }

  if (session.user.role !== "USER") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/dashboard/user" className="text-blue-600 hover:underline mb-2 inline-block">
              ← 戻る
            </Link>
            <h1 className="text-3xl font-bold">🍜 飲食出店フォーム</h1>
            <p className="mt-2 text-gray-600">屋台・キッチンカー・飲食ブース</p>
          </div>
          <Link
            href="/api/auth/signout"
            className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            ログアウト
          </Link>
        </div>

        <ShopForm />
      </div>
    </div>
  );
}
