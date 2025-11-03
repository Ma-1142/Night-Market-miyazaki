import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import TodayArrivalsTable from "@/components/staff/TodayArrivalsTable";

export default async function StaffArrivalsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login/staff");
  }

  if (session.user.role !== "STAFF" && session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">本日の到着確認</h1>
              <p className="mt-2 text-gray-600">
                Today's Vendor Arrivals - {new Date().toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                })}
              </p>
            </div>
            <Link
              href="/dashboard/staff"
              className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
            >
              ダッシュボードへ戻る
            </Link>
          </div>

          <TodayArrivalsTable />
        </div>
      </div>
    </div>
  );
}
