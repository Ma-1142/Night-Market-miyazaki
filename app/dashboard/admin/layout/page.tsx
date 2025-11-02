"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";

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

export default function LayoutPage() {
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
        router.push(`/dashboard/admin/layout/${newLayoutMap.id}`);
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
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="p-8 pl-20">
          <div className="flex h-96 items-center justify-center">
            <div className="text-xl">読み込み中...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="p-8 pl-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">配置図管理</h1>
              <p className="mt-2 text-gray-600">
                出店者の配置・自動抽選・通知設定
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreateNew}
                className="rounded-md bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
              >
                ➕ 新規配置図作成
              </button>
              <Link
                href="/api/auth/signout"
                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                ログアウト
              </Link>
            </div>
          </div>

          {layoutMaps.length === 0 ? (
            <div className="rounded-xl border-2 border-gray-300 bg-white p-12 text-center shadow-sm">
              <div className="text-6xl">📋</div>
              <p className="mt-4 text-xl font-semibold text-gray-600">
                配置図がまだありません
              </p>
              <p className="mt-2 text-gray-500">
                「新規配置図作成」ボタンから最初の配置図を作成してください
              </p>
              <button
                onClick={handleCreateNew}
                className="mt-6 rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
              >
                ➕ 最初の配置図を作成
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {layoutMaps.map((layoutMap) => (
                <div
                  key={layoutMap.id}
                  className="overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="aspect-video bg-gray-100">
                    {layoutMap.imageUrl ? (
                      <img
                        src={layoutMap.imageUrl}
                        alt="配置図"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        <div className="text-center">
                          <div className="text-4xl">📍</div>
                          <p className="mt-2 text-sm">画像未設定</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          layoutMap.isPublished
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {layoutMap.isPublished ? "✓ 公開中" : "非公開"}
                      </span>
                      <span className="text-sm text-gray-600">
                        <strong>{layoutMap._count.assignments}</strong> ブース
                      </span>
                    </div>

                    {layoutMap.publishAt && (
                      <div className="mb-3 text-xs text-gray-500">
                        公開日時:{" "}
                        {new Date(layoutMap.publishAt).toLocaleString("ja-JP")}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/admin/layout/${layoutMap.id}`}
                        className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center font-semibold text-white hover:bg-blue-700"
                      >
                        編集
                      </Link>
                      <button
                        onClick={() => handleDelete(layoutMap.id)}
                        className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
