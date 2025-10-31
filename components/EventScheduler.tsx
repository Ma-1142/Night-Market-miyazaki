"use client";

import { useState } from "react";

type Event = {
  id: string;
  date: Date;
  startTime: string | null;
  endTime: string | null;
};

type EventSchedulerProps = {
  formId: string;
  initialEvents: Event[];
  participationMonths: number[];
};

export default function EventScheduler({
  formId,
  initialEvents,
  participationMonths,
}: EventSchedulerProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [newDate, setNewDate] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleAddEvent = async () => {
    if (!newDate) {
      setMessage({ type: "error", text: "日付を選択してください" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formId,
          date: newDate,
          startTime: newStartTime || null,
          endTime: newEndTime || null,
        }),
      });

      if (!response.ok) {
        throw new Error("イベントの追加に失敗しました");
      }

      const newEvent = await response.json();
      setEvents([...events, newEvent]);
      setNewDate("");
      setNewStartTime("");
      setNewEndTime("");
      setMessage({ type: "success", text: "出店日を追加しました" });
    } catch (error) {
      setMessage({ type: "error", text: "エラーが発生しました" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("この出店日を削除しますか？")) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("イベントの削除に失敗しました");
      }

      setEvents(events.filter((e) => e.id !== eventId));
      setMessage({ type: "success", text: "出店日を削除しました" });
    } catch (error) {
      setMessage({ type: "error", text: "エラーが発生しました" });
    } finally {
      setIsLoading(false);
    }
  };

  // Group events by month
  const eventsByMonth = events.reduce((acc, event) => {
    const month = new Date(event.date).getMonth() + 1;
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(event);
    return acc;
  }, {} as Record<number, Event[]>);

  return (
    <div className="rounded-lg bg-white p-8 shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4">出店スケジュール管理</h2>
      <p className="text-sm text-gray-600 mb-6">
        出店する日付と時間帯を設定してください。選択した月（
        {participationMonths.map((m) => `${m}月`).join("、")}）の日付のみ選択できます。
      </p>

      {message && (
        <div
          className={`mb-4 p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Add new event */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">出店日を追加</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              日付
            </label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              開始時間（任意）
            </label>
            <input
              type="time"
              value={newStartTime}
              onChange={(e) => setNewStartTime(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              終了時間（任意）
            </label>
            <input
              type="time"
              value={newEndTime}
              onChange={(e) => setNewEndTime(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              disabled={isLoading}
            />
          </div>
        </div>
        <button
          onClick={handleAddEvent}
          disabled={isLoading}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? "追加中..." : "出店日を追加"}
        </button>
      </div>

      {/* Display existing events */}
      <div>
        <h3 className="text-lg font-semibold mb-4">登録済みの出店日</h3>
        {events.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            まだ出店日が登録されていません
          </p>
        ) : (
          <div className="space-y-4">
            {participationMonths.map((month) => {
              const monthEvents = eventsByMonth[month] || [];
              if (monthEvents.length === 0) return null;

              return (
                <div key={month} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">{month}月</h4>
                  <div className="space-y-2">
                    {monthEvents
                      .sort(
                        (a, b) =>
                          new Date(a.date).getTime() - new Date(b.date).getTime()
                      )
                      .map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                        >
                          <div>
                            <div className="font-medium text-gray-900">
                              {new Date(event.date).toLocaleDateString("ja-JP", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                weekday: "short",
                              })}
                            </div>
                            {event.startTime && event.endTime && (
                              <div className="text-sm text-gray-600 mt-1">
                                {event.startTime} - {event.endTime}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            disabled={isLoading}
                            className="text-red-600 hover:text-red-800 text-sm disabled:text-gray-400"
                          >
                            削除
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
