"use client";

import { useEffect, useState } from "react";

interface Assignment {
  id: string;
  boothId: string;
  event: {
    id: string;
    date: string;
    form: {
      shop: {
        name: string;
      };
    };
  };
}

interface LayoutMap {
  id: string;
  imageUrl: string | null;
  publishAt: string | null;
  isPublished: boolean;
  assignments: Assignment[];
}

export default function StaffLayoutMapsPage() {
  const [layoutMaps, setLayoutMaps] = useState<LayoutMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLayoutMap, setSelectedLayoutMap] = useState<LayoutMap | null>(
    null
  );

  useEffect(() => {
    fetchLayoutMaps();
  }, []);

  const fetchLayoutMaps = async () => {
    try {
      const response = await fetch("/api/staff/layout-maps");
      if (response.ok) {
        const data = await response.json();
        setLayoutMaps(data);
        if (data.length > 0) {
          setSelectedLayoutMap(data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching layout maps:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">読み込み中...</div>;
  }

  if (layoutMaps.length === 0) {
    return (
      <div className="p-8">
        <h1 className="mb-6 text-3xl font-bold">配置図一覧</h1>
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-8 text-center">
          <p className="text-gray-600">公開されている配置図がありません。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold">配置図一覧（スタッフ用）</h1>

      {/* 配置図セレクタ */}
      {layoutMaps.length > 1 && (
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            配置図を選択:
          </label>
          <select
            value={selectedLayoutMap?.id || ""}
            onChange={(e) => {
              const selected = layoutMaps.find((lm) => lm.id === e.target.value);
              setSelectedLayoutMap(selected || null);
            }}
            className="rounded border border-gray-300 px-4 py-2"
          >
            {layoutMaps.map((layoutMap) => (
              <option key={layoutMap.id} value={layoutMap.id}>
                {layoutMap.publishAt
                  ? `公開: ${new Date(layoutMap.publishAt).toLocaleString(
                      "ja-JP"
                    )}`
                  : "配置図"}
                {" - "}
                {layoutMap.assignments.length}件
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedLayoutMap && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 左側: 配置図画像 */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">配置図</h2>

            {selectedLayoutMap.imageUrl ? (
              <img
                src={selectedLayoutMap.imageUrl}
                alt="配置図"
                className="w-full rounded border border-gray-300"
              />
            ) : (
              <div className="flex h-96 items-center justify-center rounded border-2 border-dashed border-gray-300 bg-gray-50">
                <p className="text-gray-400">画像が設定されていません</p>
              </div>
            )}

            <div className="mt-4 rounded bg-blue-50 p-4">
              <p className="text-sm text-gray-700">
                <strong>公開日時:</strong>{" "}
                {selectedLayoutMap.publishAt
                  ? new Date(selectedLayoutMap.publishAt).toLocaleString(
                      "ja-JP"
                    )
                  : "未設定"}
              </p>
              <p className="mt-1 text-sm text-gray-700">
                <strong>総ブース数:</strong>{" "}
                {selectedLayoutMap.assignments.length}
              </p>
            </div>
          </div>

          {/* 右側: ブース一覧 */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">
              ブース一覧 ({selectedLayoutMap.assignments.length}件)
            </h2>

            <div className="mb-4">
              <input
                type="text"
                placeholder="ブースIDまたは店舗名で検索..."
                className="w-full rounded border border-gray-300 px-4 py-2"
                onChange={(e) => {
                  const search = e.target.value.toLowerCase();
                  // TODO: 検索機能の実装
                }}
              />
            </div>

            <div className="max-h-[600px] space-y-2 overflow-y-auto">
              {selectedLayoutMap.assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between rounded border border-gray-200 bg-gray-50 p-3 hover:bg-gray-100"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="rounded bg-blue-500 px-3 py-1 font-bold text-white">
                        {assignment.boothId}
                      </span>
                      <div>
                        <div className="font-semibold">
                          {assignment.event.form.shop.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(assignment.event.date).toLocaleDateString(
                            "ja-JP",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
