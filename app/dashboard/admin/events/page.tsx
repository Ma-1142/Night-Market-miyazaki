import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";

export default async function EventsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login/admin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Sample event data
  const events = [
    { id: 1, date: "2025-11-15", time: "17:00-22:00", location: "宮崎市中央公園", slots: 50, filled: 0 },
    { id: 2, date: "2025-12-20", time: "18:00-23:00", location: "宮崎市中央公園", slots: 60, filled: 0 },
    { id: 3, date: "2026-01-18", time: "16:00-21:00", location: "宮崎市中央公園", slots: 50, filled: 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="p-8 pl-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">開催日・枠管理</h1>
              <p className="mt-2 text-gray-600">イベント日程・ゾーン・区画設定</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                + 新規イベント追加
              </button>
              <Link
                href="/api/auth/signout"
                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                ログアウト
              </Link>
            </div>
          </div>

          {/* Simple Calendar View */}
          <div className="grid gap-6">
            {events.map((event) => (
              <div key={event.id} className="rounded-lg bg-white p-6 shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{event.date}</h3>
                    <p className="text-gray-600 mt-1">{event.time}</p>
                    <p className="text-gray-600">{event.location}</p>
                    <div className="mt-4">
                      <div className="text-sm text-gray-600">応募状況</div>
                      <div className="mt-1">
                        <span className="font-bold text-lg">{event.filled}</span> / {event.slots} 枠
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(event.filled / event.slots) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-900">編集</button>
                    <button className="text-green-600 hover:text-green-900">区画設定</button>
                    <button className="text-red-600 hover:text-red-900">削除</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
