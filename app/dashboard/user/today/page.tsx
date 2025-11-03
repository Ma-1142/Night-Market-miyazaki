import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import TodayEventCard from "@/components/user/TodayEventCard";

export default async function TodayEventPage() {
  const session = await auth();

  if (!session) {
    redirect("/login/user");
  }

  if (session.user.role !== "USER") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">本日の出店</h1>
              <p className="mt-2 text-gray-600">
                Today's Event - {new Date().toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                })}
              </p>
            </div>
            <Link
              href="/dashboard/user"
              className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
            >
              ダッシュボードへ戻る
            </Link>
          </div>

          <TodayEventCard />
        </div>
      </div>
    </div>
  );
}
