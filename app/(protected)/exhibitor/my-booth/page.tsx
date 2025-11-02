"use client";

import { useEffect, useState } from "react";

interface BoothAssignment {
  eventId: string;
  eventDate: string;
  boothId: string;
  layoutMapId: string;
  imageUrl: string | null;
  shopName: string;
}

export default function MyBoothPage() {
  const [booths, setBooths] = useState<BoothAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBooths();
  }, []);

  const fetchMyBooths = async () => {
    try {
      const response = await fetch("/api/exhibitor/my-booth");
      if (response.ok) {
        const data = await response.json();
        setBooths(data);
      }
    } catch (error) {
      console.error("Error fetching booth assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-4xl font-bold text-gray-900">
          あなたのブース割り当て
        </h1>

        {booths.length === 0 ? (
          <div className="rounded-xl border-2 border-gray-300 bg-white p-12 text-center shadow-sm">
            <div className="text-6xl text-gray-300">📍</div>
            <p className="mt-4 text-xl font-semibold text-gray-600">
              まだブースが割り当てられていません
            </p>
            <p className="mt-2 text-gray-500">
              承認後、管理者によって配置が決定されます。
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {booths.map((booth) => (
              <div
                key={booth.eventId}
                className="overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-lg"
              >
                {/* ヘッダー */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm opacity-90">あなたのブースID</div>
                      <div className="text-5xl font-bold">{booth.boothId}</div>
                    </div>
                    <div className="rounded-lg bg-white/20 px-4 py-2 backdrop-blur">
                      <div className="text-sm opacity-90">店舗名</div>
                      <div className="text-lg font-semibold">{booth.shopName}</div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm opacity-90">
                    📅 開催日:{" "}
                    <span className="font-semibold">
                      {new Date(booth.eventDate).toLocaleDateString("ja-JP", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        weekday: "long"
                      })}
                    </span>
                  </div>
                </div>

                {/* 配置図 */}
                <div className="p-6">
                  <h2 className="mb-4 text-2xl font-bold text-gray-900">
                    配置図
                  </h2>

                  {booth.imageUrl ? (
                    <div className="rounded-lg border-2 border-gray-300 bg-gray-50 p-4">
                      <img
                        src={booth.imageUrl}
                        alt="配置図"
                        className="w-full rounded"
                      />
                      <div className="mt-4 rounded-lg bg-blue-50 p-4 text-center">
                        <p className="text-lg font-bold text-blue-900">
                          📍 あなたのブース位置: <span className="text-2xl">{booth.boothId}</span>
                        </p>
                        <p className="mt-2 text-sm text-blue-700">
                          配置図で <strong>{booth.boothId}</strong> の位置をご確認ください
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-96 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                      <div className="text-6xl text-gray-300">🗺️</div>
                      <p className="mt-4 font-semibold text-gray-600">
                        配置図準備中
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        管理者が配置図を公開するまでお待ちください
                      </p>
                    </div>
                  )}
                </div>

                {/* 注意事項 */}
                <div className="border-t-2 border-gray-100 bg-yellow-50 p-6">
                  <h3 className="mb-2 font-bold text-yellow-900">
                    ⚠️ 重要事項
                  </h3>
                  <ul className="list-inside list-disc space-y-1 text-sm text-yellow-800">
                    <li>当日は割り当てられたブースIDの位置にお越しください</li>
                    <li>ブース位置の変更は原則できません</li>
                    <li>ご不明な点は管理者にお問い合わせください</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
