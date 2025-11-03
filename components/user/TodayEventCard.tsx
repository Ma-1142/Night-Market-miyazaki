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

      {/* Setup checklist (optional - can add later) */}
      {arrival.staffConfirmed && (
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
      )}
    </div>
  );
}
