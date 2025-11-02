"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LayoutMap {
  id: string;
  imageUrl: string | null;
  publishAt: string | null;
  isPublished: boolean;
  createdAt: string;
  _count: {
    assignments: number;
  };
}

export default function LayoutMapsPage() {
  const [layoutMaps, setLayoutMaps] = useState<LayoutMap[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchLayoutMaps();
  }, []);

  const fetchLayoutMaps = async () => {
    try {
      const response = await fetch("/api/admin/layout-maps");
      if (response.ok) {
        const data = await response.json();
        setLayoutMaps(data);
      }
    } catch (error) {
      console.error("Error fetching layout maps:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = async () => {
    try {
      const response = await fetch("/api/admin/layout-maps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });

      if (response.ok) {
        const newLayoutMap = await response.json();
        router.push(`/admin/layout-maps/${newLayoutMap.id}`);
      }
    } catch (error) {
      console.error("Error creating layout map:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("この配置図を削除してもよろしいですか？")) return;

    try {
      const response = await fetch(`/api/admin/layout-maps/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchLayoutMaps();
      }
    } catch (error) {
      console.error("Error deleting layout map:", error);
    }
  };

  if (loading) {
    return <div className="p-8">読み込み中...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">配置図管理</h1>
        <button
          onClick={handleCreateNew}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          新規作成
        </button>
      </div>

      {layoutMaps.length === 0 ? (
        <div className="rounded border border-gray-300 bg-gray-50 p-8 text-center">
          <p className="text-gray-600">配置図がまだありません。</p>
          <button
            onClick={handleCreateNew}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            最初の配置図を作成
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {layoutMaps.map((layoutMap) => (
            <div
              key={layoutMap.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4">
                {layoutMap.imageUrl ? (
                  <img
                    src={layoutMap.imageUrl}
                    alt="配置図"
                    className="h-48 w-full rounded object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center rounded bg-gray-100 text-gray-400">
                    画像未設定
                  </div>
                )}
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">ステータス:</span>
                  <span
                    className={`rounded px-2 py-1 text-sm ${
                      layoutMap.isPublished
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {layoutMap.isPublished ? "公開中" : "非公開"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">割り当て数:</span>
                  <span className="font-semibold">
                    {layoutMap._count.assignments} 件
                  </span>
                </div>
                {layoutMap.publishAt && (
                  <div className="text-sm text-gray-600">
                    公開日時:{" "}
                    {new Date(layoutMap.publishAt).toLocaleString("ja-JP")}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/admin/layout-maps/${layoutMap.id}`}
                  className="flex-1 rounded bg-blue-500 px-4 py-2 text-center text-white hover:bg-blue-600"
                >
                  編集
                </Link>
                <button
                  onClick={() => handleDelete(layoutMap.id)}
                  className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
