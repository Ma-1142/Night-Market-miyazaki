"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";

interface Assignment {
  id: string;
  boothId: string;
  formId: string | null;
  form?: {
    id: string;
    shop: {
      name: string;
      user: {
        name: string | null;
        email: string;
      };
    };
    data: any;
  };
}

interface LayoutMap {
  id: string;
  imageUrl: string | null;
  publishAt: string | null;
  isPublished: boolean;
  assignments: Assignment[];
}

export default function LayoutMapEditPage() {
  const params = useParams();
  const [layoutMap, setLayoutMap] = useState<LayoutMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [assignResult, setAssignResult] = useState<{message: string; count: number} | null>(null);
  const [publishDateTime, setPublishDateTime] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (params.id) {
      fetchLayoutMap();
    }
  }, [params.id]);

  const fetchLayoutMap = async () => {
    try {
      const response = await fetch(`/api/admin/layout-maps/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setLayoutMap(data);
      }
    } catch (error) {
      console.error("Error fetching layout map:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });

      if (uploadResponse.ok) {
        const { url } = await uploadResponse.json();

        const updateResponse = await fetch(`/api/admin/layout-maps/${params.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: url })
        });

        if (updateResponse.ok) {
          alert("✅ 配置図画像をアップロードしました");
          fetchLayoutMap();
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("❌ 画像のアップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  const handleAutoAssign = async () => {
    if (!confirm("承認済みの出店者に自動的にブース（A01～D40）を割り振りますか？\n\n⚠️ 既存の割り当ては削除されます。")) {
      return;
    }

    setAssigning(true);
    setAssignResult(null);
    try {
      const response = await fetch(
        `/api/admin/layout-maps/${params.id}/auto-assign`,
        { method: "POST" }
      );

      if (response.ok) {
        const result = await response.json();
        setAssignResult({
          message: "✅ ブース割り振りが完了しました！",
          count: result.assignedCount
        });
        fetchLayoutMap();
      } else {
        const error = await response.json();
        alert(`❌ エラー: ${error.error}`);
      }
    } catch (error) {
      console.error("Error auto-assigning:", error);
      alert("❌ 自動割り振りに失敗しました");
    } finally {
      setAssigning(false);
    }
  };

  const handlePublish = async () => {
    if (layoutMap.assignments.length === 0) {
      alert("❌ ブース割り振りを実行してください");
      return;
    }

    if (!publishDateTime) {
      alert("❌ 公開日時を設定してください");
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/layout-maps/${params.id}/publish`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            publishAt: new Date(publishDateTime).toISOString(),
          }),
        }
      );

      if (response.ok) {
        alert("✅ 公開日時を設定しました");
        fetchLayoutMap();
      }
    } catch (error) {
      console.error("Error publishing:", error);
      alert("❌ 公開設定に失敗しました");
    }
  };

  const handlePublishNow = async () => {
    if (layoutMap.assignments.length === 0) {
      alert("❌ ブース割り振りを実行してください");
      return;
    }

    if (!confirm("今すぐ配置図を公開しますか？")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/layout-maps/${params.id}/publish`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            publishAt: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        alert("✅ 配置図を公開しました");
        fetchLayoutMap();
      }
    } catch (error) {
      console.error("Error publishing:", error);
      alert("❌ 公開に失敗しました");
    }
  };

  const handleUnpublish = async () => {
    try {
      const response = await fetch(
        `/api/admin/layout-maps/${params.id}/publish`,
        { method: "DELETE" }
      );

      if (response.ok) {
        alert("✅ 配置図を非公開にしました");
        fetchLayoutMap();
      }
    } catch (error) {
      console.error("Error unpublishing:", error);
      alert("❌ 非公開に失敗しました");
    }
  };

  if (loading) {
    return <div className="p-8">読み込み中...</div>;
  }

  if (!layoutMap) {
    return <div className="p-8">配置図が見つかりません</div>;
  }

  // ブースIDをグループ別に整理
  const groupedBooths: Record<string, Assignment[]> = {
    A: [],
    B: [],
    C: [],
    D: []
  };

  layoutMap.assignments.forEach((assignment) => {
    const group = assignment.boothId[0];
    if (groupedBooths[group]) {
      groupedBooths[group].push(assignment);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="p-8 pl-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <Link
              href="/dashboard/admin/layout"
              className="text-blue-600 hover:underline"
            >
              ← 配置図一覧に戻る
            </Link>
          </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">配置図編集</h1>
          <div className="mt-2 flex items-center gap-4">
            <span
              className={`rounded-full px-4 py-1 text-sm font-semibold ${
                layoutMap.isPublished
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {layoutMap.isPublished ? "✓ 公開中" : "非公開"}
            </span>
            <span className="text-sm text-gray-600">
              割り当て数: <strong>{layoutMap.assignments.length}</strong> ブース
            </span>
          </div>
        </div>

        {/* 結果表示 */}
        {assignResult && (
          <div className="mb-6 rounded-lg bg-green-50 border-2 border-green-500 p-6">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🎉</div>
              <div>
                <div className="text-xl font-bold text-green-900">{assignResult.message}</div>
                <div className="mt-1 text-green-700">
                  {assignResult.count}件のブースを割り振りました
                </div>
              </div>
            </div>
          </div>
        )}

        {/* メインコンテンツ */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* 左側: 配置図画像 */}
          <div className="space-y-6">
            <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold">配置図画像</h2>

              <div className="mb-4">
                <div className="relative w-full overflow-hidden rounded-lg border-2 border-gray-300">
                  <img
                    src="/resource/arrangement.png"
                    alt="配置図"
                    className="w-full"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  ナイトマーケット配置図（グループA-D、各40ブース）
                </p>
              </div>
            </div>

            {/* 公開タイミング設定 */}
            <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold">公開タイミング設定</h2>

              {layoutMap.isPublished ? (
                <div className="rounded-lg bg-green-50 p-4">
                  <div className="font-bold text-green-900">✓ 公開中</div>
                  {layoutMap.publishAt && (
                    <div className="mt-2 text-sm text-green-700">
                      公開日時: {new Date(layoutMap.publishAt).toLocaleString("ja-JP")}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      公開日時を設定
                    </label>
                    <input
                      type="datetime-local"
                      value={publishDateTime}
                      onChange={(e) => setPublishDateTime(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    />
                  </div>
                  <button
                    onClick={handlePublish}
                    disabled={!publishDateTime}
                    className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    📅 公開予約を設定
                  </button>
                  <p className="text-xs text-gray-500">
                    設定した日時に自動的にスタッフと出店者に公開されます
                  </p>
                </div>
              )}
            </div>

            {/* 操作ボタン */}
            <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold">操作</h2>

              <div className="space-y-3">
                <button
                  onClick={handleAutoAssign}
                  disabled={assigning}
                  className="w-full rounded-lg bg-purple-600 px-6 py-4 text-lg font-bold text-white hover:bg-purple-700 disabled:bg-gray-400"
                >
                  {assigning ? "⏳ 割り振り中..." : "🎲 自動抽選 (A01〜D40)"}
                </button>

                <div className="rounded bg-blue-50 p-3 text-sm text-blue-900">
                  💡 承認済み出店者にブースID（A01〜D40）を自動で割り振ります
                </div>

                {layoutMap.isPublished ? (
                  <button
                    onClick={handleUnpublish}
                    className="w-full rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
                  >
                    🔒 非公開にする
                  </button>
                ) : (
                  <button
                    onClick={handlePublishNow}
                    className="w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
                  >
                    ✓ 今すぐ公開
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 右側: ブース割り当て一覧 */}
          <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold">
              ブース割り当て一覧 ({layoutMap.assignments.length}件)
            </h2>

            {layoutMap.assignments.length === 0 ? (
              <div className="flex h-96 flex-col items-center justify-center rounded-lg bg-gray-50 p-8">
                <div className="text-6xl text-gray-300">📋</div>
                <p className="mt-4 text-lg font-semibold text-gray-600">
                  まだブースが割り当てられていません
                </p>
                <p className="mt-2 text-center text-sm text-gray-500">
                  「自動割り振り実行」ボタンをクリックして、<br />
                  承認済み出店者にブースを割り当ててください
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* グループ別表示 */}
                {Object.entries(groupedBooths).map(([group, assignments]) => (
                  assignments.length > 0 && (
                    <div key={group} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h3 className="mb-3 text-lg font-bold text-gray-900">
                        グループ {group} ({assignments.length}ブース)
                      </h3>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {assignments
                          .sort((a, b) => a.boothId.localeCompare(b.boothId))
                          .map((assignment) => (
                            <div
                              key={assignment.id}
                              className={`flex items-center gap-3 rounded p-3 shadow-sm ${
                                assignment.form
                                  ? "bg-white"
                                  : "bg-gray-100"
                              }`}
                            >
                              <div className={`flex h-12 w-12 items-center justify-center rounded-lg font-bold text-white text-xs ${
                                assignment.form
                                  ? "bg-blue-600"
                                  : "bg-gray-400"
                              }`}>
                                {assignment.boothId}
                              </div>
                              <div className="flex-1 min-w-0">
                                {assignment.form ? (
                                  <>
                                    <div className="truncate font-semibold text-gray-900">
                                      {assignment.form.shop.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {assignment.form.shop.user.name || assignment.form.shop.user.email}
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-sm text-gray-500">未割り当て</div>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
