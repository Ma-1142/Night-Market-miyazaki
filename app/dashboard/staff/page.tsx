import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import StaffSidebar from "@/components/StaffSidebar";
import { prisma } from "@/lib/prisma";

export default async function StaffDashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login/staff");
  }

  if (session.user.role !== "STAFF") {
    redirect("/");
  }

  // Get all approved forms with shop, user, and event data
  const approvedForms = await prisma.form.findMany({
    where: {
      status: "approved",
    },
    include: {
      shop: {
        include: {
          user: true,
        },
      },
      events: {
        orderBy: {
          date: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Group shops by participation months with their events
  const shopsByMonth: Record<number, Array<{
    shopName: string;
    ownerName: string;
    formType: string;
    formId: string;
    participationMonths: number[];
    events: Array<{
      date: Date;
      startTime: string | null;
      endTime: string | null;
    }>;
  }>> = {};

  approvedForms.forEach((form) => {
    const formData = form.data as any;
    const participationMonths = formData.participationMonths || [];
    const formType = formData.formType || "food";
    const shopName = formData.shopName || formData.brandName || formData.boothName || form.shop.name;

    participationMonths.forEach((month: number) => {
      if (!shopsByMonth[month]) {
        shopsByMonth[month] = [];
      }

      // Filter events for this specific month
      const monthEvents = form.events.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate.getMonth() + 1 === month;
      });

      shopsByMonth[month].push({
        shopName,
        ownerName: form.shop.user.name || form.shop.user.email,
        formType,
        formId: form.id,
        participationMonths,
        events: monthEvents.map((e) => ({
          date: e.date,
          startTime: e.startTime,
          endTime: e.endTime,
        })),
      });
    });
  });

  // Get current month and year
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
  const currentYear = now.getFullYear();

  // Create array of all 12 months starting from current month
  const allMonths = Array.from({ length: 12 }, (_, i) => {
    const monthNum = ((currentMonth - 1 + i) % 12) + 1;
    return monthNum;
  });

  // Helper function to get month name in Japanese
  const getMonthName = (month: number) => {
    const year = month < currentMonth ? currentYear + 1 : currentYear;
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffSidebar />
      <div className="p-8 pl-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">出店予定一覧</h1>
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

          <div className="space-y-6">
            {allMonths.map((month, index) => {
              const shops = shopsByMonth[month] || [];
              const isNextEvent = index === 0;

              return (
                <div
                  key={month}
                  className={`rounded-lg bg-white p-8 shadow-md ${
                    isNextEvent ? "border-l-4 border-blue-500" : ""
                  }`}
                >
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {getMonthName(month)}
                      </h2>
                      {isNextEvent && (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                          今月
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-gray-700">
                      出店予定: {shops.length} 店舗
                    </div>
                  </div>

                  {shops.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      この月の出店予定はまだありません
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {shops.map((shop, shopIndex) => (
                        <Link
                          key={`${month}-${shopIndex}`}
                          href={`/dashboard/staff/submissions/${shop.formId}`}
                          className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                        >
                          <div className="font-semibold text-gray-900 mb-1">
                            {shop.shopName}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            {shop.ownerName}
                          </div>
                          <div className="text-xs text-gray-500 mb-2">
                            {shop.formType === "food" && "飲食"}
                            {shop.formType === "goods" && "物販"}
                            {shop.formType === "workshop" && "ワークショップ"}
                          </div>
                          <div className="text-xs text-blue-600 mb-2">
                            参加予定月: {shop.participationMonths.map((m) => `${m}月`).join("、")}
                          </div>
                          {shop.events.length > 0 ? (
                            <div className="mt-3 pt-3 border-t border-gray-200 space-y-1">
                              <div className="text-xs font-semibold text-gray-700 mb-1">出店予定日:</div>
                              {shop.events.map((event, eventIndex) => (
                                <div key={eventIndex} className="text-xs text-gray-600">
                                  {new Date(event.date).toLocaleDateString("ja-JP", {
                                    month: "numeric",
                                    day: "numeric",
                                    weekday: "short",
                                  })}
                                  {event.startTime && event.endTime && (
                                    <span className="ml-2">
                                      {event.startTime} - {event.endTime}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="text-xs text-gray-400 italic">
                                出店日未設定
                              </div>
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
