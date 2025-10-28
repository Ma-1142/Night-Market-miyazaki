import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import StaffSidebar from "@/components/StaffSidebar";

export default async function Option3Page() {
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
              <h1 className="text-3xl font-bold">オプション3</h1>
              <p className="mt-2 text-gray-600">準備中</p>
            </div>
            <Link
              href="/api/auth/signout"
              className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
            >
              ログアウト
            </Link>
          </div>

          <div className="rounded-lg bg-white p-12 shadow-md">
            <div className="text-center text-gray-500">
              このページは準備中です
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
