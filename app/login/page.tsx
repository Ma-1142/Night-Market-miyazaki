import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl space-y-8 rounded-lg bg-white p-12 shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Night Market Miyazaki</h1>
          <p className="mt-4 text-lg text-gray-600">ログインタイプを選択してください</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Link
            href="/login/user"
            className="flex flex-col items-center rounded-lg border-2 border-blue-500 bg-white p-8 text-center transition-all hover:bg-blue-50 hover:shadow-lg"
          >
            <div className="mb-4 text-5xl">👤</div>
            <h2 className="text-2xl font-bold text-gray-800">出店者</h2>
            <p className="mt-2 text-sm text-gray-600">User Login</p>
          </Link>

          <Link
            href="/login/staff"
            className="flex flex-col items-center rounded-lg border-2 border-green-500 bg-white p-8 text-center transition-all hover:bg-green-50 hover:shadow-lg"
          >
            <div className="mb-4 text-5xl">👔</div>
            <h2 className="text-2xl font-bold text-gray-800">スタッフ</h2>
            <p className="mt-2 text-sm text-gray-600">Staff Login</p>
          </Link>

          <Link
            href="/login/admin"
            className="flex flex-col items-center rounded-lg border-2 border-red-500 bg-white p-8 text-center transition-all hover:bg-red-50 hover:shadow-lg"
          >
            <div className="mb-4 text-5xl">🔐</div>
            <h2 className="text-2xl font-bold text-gray-800">管理者</h2>
            <p className="mt-2 text-sm text-gray-600">Admin Login</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
