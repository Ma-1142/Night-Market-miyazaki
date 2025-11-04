"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type EventData = {
  hasEvent: boolean;
  event: {
    id: string;
    formId: string;
    date: Date;
    startTime: string | null;
    endTime: string | null;
    shopName: string;
    formType: string;
    boothId: string | null;
    layoutMap: {
      id: string;
      imageUrl: string | null;
      publishedAt: Date | null;
      isPublished: boolean;
    } | null;
    arrival: {
      vendorCheckedIn: boolean;
      vendorCheckedInAt: Date | null;
      staffConfirmed: boolean;
      staffConfirmedAt: Date | null;
    };
  } | null;
};

export default function TodayEventCard() {
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  // Fetch today's event
  const fetchEvent = async () => {
    try {
      const response = await fetch("/api/user/today-event");
      if (!response.ok) {
        throw new Error("Failed to fetch event");
      }
      const data = await response.json();
      setEventData(data);
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
    // Poll every 30 seconds to check for staff confirmation
    const interval = setInterval(fetchEvent, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle vendor check-in
  const handleCheckIn = async () => {
    if (!eventData?.event) return;

    setIsCheckingIn(true);
    setMessage(null);

    try {
      const response = await fetch("/api/arrivals/vendor-checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formId: eventData.event.formId,
          eventDate: eventData.event.date,
        }),
      });

      if (!response.ok) {
        throw new Error("Check-in failed");
      }

      setMessage({
        type: "success",
        text: "チェックイン完了！スタッフの確認をお待ちください",
      });

      // Refresh event data
      await fetchEvent();
    } catch (error) {
      setMessage({
        type: "error",
        text: "エラーが発生しました。もう一度お試しください。",
      });
    } finally {
      setIsCheckingIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-8 shadow-md">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!eventData?.hasEvent || !eventData.event) {
    return (
      <div className="rounded-lg bg-white p-8 shadow-md text-center">
        <div className="text-6xl mb-4">📅</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          本日の出店はありません
        </h2>
        <p className="text-gray-600 mb-6">
          今日予定されている出店イベントがありません
        </p>
        <a
          href="/dashboard/user"
          className="inline-block rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          ダッシュボードへ戻る
        </a>
      </div>
    );
  }

  const { event } = eventData;
  const { arrival } = event;

  // Determine status
  const getStatus = () => {
    if (arrival.staffConfirmed) {
      return {
        label: "確認済み",
        color: "bg-green-100 text-green-800 border-green-300",
        icon: "✓",
      };
    } else if (arrival.vendorCheckedIn) {
      return {
        label: "待機中 - スタッフ確認待ち",
        color: "bg-yellow-100 text-yellow-800 border-yellow-300",
        icon: "⏳",
      };
    } else {
      return {
        label: "未到着",
        color: "bg-gray-100 text-gray-800 border-gray-300",
        icon: "○",
      };
    }
  };

  const status = getStatus();

  return (
    <div className="space-y-6">
      {/* Main event card */}
      <div className="rounded-lg bg-white p-8 shadow-md border-l-4 border-blue-500">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {event.shopName}
            </h2>
            <p className="text-gray-600">
              {event.formType === "food" && "飲食"}
              {event.formType === "goods" && "物販・雑貨"}
              {event.formType === "workshop" && "ワークショップ・体験"}
            </p>
          </div>
          <span className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-lg font-semibold ${status.color}`}>
            <span>{status.icon}</span>
            {status.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">開催時間</div>
            <div className="text-xl font-semibold text-gray-900">
              {event.startTime && event.endTime
                ? `${event.startTime} - ${event.endTime}`
                : "時間未定"}
            </div>
          </div>
          {event.boothId && (
            <div>
              <div className="text-sm text-gray-500 mb-1">ブース番号</div>
              <div className="text-xl font-semibold text-gray-900">
                {event.boothId}
              </div>
            </div>
          )}
        </div>

        {/* Timestamps */}
        {arrival.vendorCheckedInAt && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              チェックイン済み:{" "}
              <span className="font-medium">
                {new Date(arrival.vendorCheckedInAt).toLocaleTimeString("ja-JP", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            {arrival.staffConfirmed && arrival.staffConfirmedAt && (
              <div className="text-sm text-gray-600 mt-1">
                スタッフ確認:{" "}
                <span className="font-medium">
                  {new Date(arrival.staffConfirmedAt).toLocaleTimeString("ja-JP", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-md ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Check-in button */}
        {!arrival.vendorCheckedIn ? (
          <button
            onClick={handleCheckIn}
            disabled={isCheckingIn}
            className="w-full rounded-lg bg-blue-600 px-8 py-4 text-2xl font-bold text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isCheckingIn ? "チェックイン中..." : "来場済み"}
          </button>
        ) : !arrival.staffConfirmed ? (
          <div className="w-full rounded-lg bg-yellow-50 border-2 border-yellow-300 px-8 py-4 text-center">
            <div className="text-lg font-semibold text-yellow-800 mb-2">
              スタッフの確認をお待ちください
            </div>
            <div className="text-sm text-yellow-700">
              スタッフがあなたの到着を確認すると、ステータスが更新されます
            </div>
          </div>
        ) : (
          <div className="w-full rounded-lg bg-green-50 border-2 border-green-300 px-8 py-4 text-center">
            <div className="text-lg font-semibold text-green-800 mb-2">
              ✓ 到着確認済み
            </div>
            <div className="text-sm text-green-700">
              ブースの設営を開始してください
            </div>
          </div>
        )}
      </div>

      {/* Important Information - Only show when both vendor and staff confirmed */}
      {arrival.vendorCheckedIn && arrival.staffConfirmed && (
        <>
          {/* Layout Map Display - 配置図表示 */}
          <div className="rounded-lg bg-white p-6 shadow-md border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🗺️</span>
              <h3 className="text-xl font-bold text-gray-900">
                配置図表示
              </h3>
            </div>

            {event.layoutMap && event.layoutMap.isPublished && event.layoutMap.imageUrl ? (
              <div className="space-y-6">
                {/* Main Layout Image */}
                <div className="bg-gray-50 p-4 rounded-lg flex justify-center">
                  <img
                    src={event.layoutMap.imageUrl}
                    alt="会場配置図"
                    className="max-w-full h-auto rounded border-2 border-gray-200"
                    style={{ maxHeight: "600px" }}
                  />
                </div>

                {/* User's Booth Highlight */}
                {event.boothId && (
                  <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-semibold text-blue-900">あなたのブース</span>
                      <span className="text-3xl font-bold text-blue-600">{event.boothId}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded border border-blue-200">
                        <div className="text-xs text-gray-600 mb-1">エリア</div>
                        <div className="text-lg font-bold text-blue-600">
                          {event.boothId.charAt(0)}ゾーン
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded border border-blue-200">
                        <div className="text-xs text-gray-600 mb-1">ブース番号</div>
                        <div className="text-lg font-bold text-blue-600">
                          {event.boothId}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Booth Grid - All booths with user's highlighted */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">全ブース一覧</h4>

                  {/* Legend */}
                  {event.boothId && (
                    <div className="flex items-center gap-4 mb-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded border-2 border-blue-500 bg-blue-200"></div>
                        <span className="text-gray-700">あなたのブース</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded border-2 border-green-500 bg-green-100"></div>
                        <span className="text-gray-700">割当済</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded border-2 border-gray-300 bg-gray-50"></div>
                        <span className="text-gray-700">未割当</span>
                      </div>
                    </div>
                  )}

                  {/* Booth Grid */}
                  <div className="grid grid-cols-10 gap-2">
                    {(() => {
                      const allBoothIds: string[] = [];
                      const sections = ["A", "B", "C", "D"];
                      for (const section of sections) {
                        for (let i = 1; i <= 40; i++) {
                          allBoothIds.push(`${section}${i.toString().padStart(2, "0")}`);
                        }
                      }
                      return allBoothIds.map((boothId) => {
                        const isUserBooth = boothId === event.boothId;
                        // For simplicity, we'll show assigned booths later if we have that data
                        return (
                          <div
                            key={boothId}
                            className={`rounded-md border-2 p-2 text-center text-xs font-semibold ${
                              isUserBooth
                                ? "border-blue-500 bg-blue-200 text-blue-900 ring-2 ring-blue-400"
                                : "border-gray-300 bg-gray-50 text-gray-600"
                            }`}
                          >
                            <div className="font-bold">{boothId}</div>
                            {isUserBooth && (
                              <div className="text-[10px] mt-1">あなた</div>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Important Notes */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">注意事項</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>配置図をよく確認し、ブースの位置を把握してください</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>指定されたブース以外での出店はできません</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>不明な点があればスタッフにお尋ねください</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  配置図はまだ公開されていません。公開され次第、こちらに表示されます。
                </p>
              </div>
            )}
          </div>

          {/* Delivery Route & Parking - 搬入ルート・駐車位置の確認 */}
          <div className="rounded-lg bg-white p-6 shadow-md border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🚗</span>
              <h3 className="text-xl font-bold text-gray-900">
                搬入ルート・駐車位置の確認
              </h3>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">搬入ルート</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">①</span>
                    <span>正面入口から入場してください</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">②</span>
                    <span>スタッフの指示に従い、指定されたルートを通ってブースへ向かってください</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">③</span>
                    <span>搬入車両は搬入完了後、速やかに指定駐車場へ移動してください</span>
                  </li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">駐車位置</h4>
                {event.boothId ? (
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      ブース番号: <span className="font-bold text-purple-600">{event.boothId}</span>
                    </p>
                    <p className="text-gray-700">
                      {event.boothId.startsWith('A') && '駐車エリア: Aゾーン駐車場'}
                      {event.boothId.startsWith('B') && '駐車エリア: Bゾーン駐車場'}
                      {event.boothId.startsWith('C') && '駐車エリア: Cゾーン駐車場'}
                      {event.boothId.startsWith('D') && '駐車エリア: Dゾーン駐車場'}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600">
                    ブースが割り当てられていないため、駐車位置は未定です。スタッフにお尋ねください。
                  </p>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  ⚠️ 搬入は開始時刻の1時間前から可能です。搬入完了後は速やかに車両を移動してください。
                </p>
              </div>
            </div>
          </div>

          {/* Role Assignment - 役割配置 */}
          <div className="rounded-lg bg-white p-6 shadow-md border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">👥</span>
              <h3 className="text-xl font-bold text-gray-900">
                役割配置
              </h3>
            </div>

            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-3">スタッフ配置情報</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded border border-orange-200">
                    <div className="text-sm text-gray-600 mb-1">担当エリア</div>
                    <div className="font-semibold text-gray-900">
                      {event.boothId ? `${event.boothId.charAt(0)}ゾーン` : '未割当'}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded border border-orange-200">
                    <div className="text-sm text-gray-600 mb-1">緊急連絡先</div>
                    <div className="font-semibold text-gray-900">090-XXXX-XXXX</div>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">重要な連絡事項</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>緊急時は最寄りのスタッフまたは本部（090-XXXX-XXXX）にご連絡ください</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>ゴミは分別して指定のゴミ集積所に捨ててください</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>イベント終了後は、ブースを元の状態に戻してからお帰りください</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>忘れ物がないか必ず確認してください</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Setup checklist */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              設営チェックリスト
            </h3>
            <div className="space-y-2 text-gray-700">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="h-5 w-5" />
                <label>ブース位置の確認</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="h-5 w-5" />
                <label>テーブル・椅子の設置</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="h-5 w-5" />
                <label>商品・機材の配置</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="h-5 w-5" />
                <label>装飾・看板の設置</label>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
