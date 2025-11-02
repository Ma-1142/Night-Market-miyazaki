"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import Image from "next/image";

interface BoothAssignment {
  id: string;
  boothId: string;
  formId: string;
  form?: {
    shop: {
      name: string;
    };
  };
}

interface LayoutSettings {
  publishAt: string | null;
  isPublished: boolean;
}

export default function LayoutManagementPage() {
  const [assignments, setAssignments] = useState<BoothAssignment[]>([]);
  const [settings, setSettings] = useState<LayoutSettings>({
    publishAt: null,
    isPublished: false,
  });
  const [publishAt, setPublishAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignmentsRes, settingsRes] = await Promise.all([
        fetch("/api/admin/booth-assignments"),
        fetch("/api/admin/layout-settings"),
      ]);

      if (assignmentsRes.ok) {
        const assignmentsData = await assignmentsRes.json();
        setAssignments(assignmentsData);
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData);
        if (settingsData.publishAt) {
          // Convert to datetime-local format
          const date = new Date(settingsData.publishAt);
          const localDateTime = new Date(
            date.getTime() - date.getTimezoneOffset() * 60000
          )
            .toISOString()
            .slice(0, 16);
          setPublishAt(localDateTime);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLottery = async () => {
    if (
      !confirm(
        "自動抽選を実行しますか？既存の割り当てはすべてクリアされます。"
      )
    ) {
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(
        "/api/admin/booth-assignments/lottery",
        {
          method: "POST",
        }
      );

      if (response.ok) {
        alert("自動抽選が完了しました");
        await fetchData();
      } else {
        const error = await response.json();
        alert(`エラー: ${error.message || "自動抽選に失敗しました"}`);
      }
    } catch (error) {
      alert("エラーが発生しました");
      console.error("Error running lottery:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdatePublishAt = async () => {
    if (!publishAt) {
      alert("公開日時を設定してください");
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch("/api/admin/layout-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publishAt }),
      });

      if (response.ok) {
        alert("公開日時を設定しました");
        await fetchData();
      } else {
        alert("公開日時の設定に失敗しました");
      }
    } catch (error) {
      alert("エラーが発生しました");
      console.error("Error updating publishAt:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handlePublish = async () => {
    if (!confirm("今すぐ公開しますか？")) {
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(
        "/api/admin/layout-settings/publish",
        {
          method: "POST",
        }
      );

      if (response.ok) {
        alert("配置図を公開しました");
        await fetchData();
      } else {
        alert("公開に失敗しました");
      }
    } catch (error) {
      alert("エラーが発生しました");
      console.error("Error publishing:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleUnpublish = async () => {
    if (!confirm("公開を取り消しますか？")) {
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(
        "/api/admin/layout-settings/unpublish",
        {
          method: "POST",
        }
      );

      if (response.ok) {
        alert("公開を取り消しました");
        await fetchData();
      } else {
        alert("公開取消に失敗しました");
      }
    } catch (error) {
      alert("エラーが発生しました");
      console.error("Error unpublishing:", error);
    } finally {
      setProcessing(false);
    }
  };

  // Generate all booth IDs (A01-D40)
  const allBoothIds: string[] = [];
  const sections = ["A", "B", "C", "D"];
  for (const section of sections) {
    for (let i = 1; i <= 40; i++) {
      allBoothIds.push(`${section}${i.toString().padStart(2, "0")}`);
    }
  }

  // Create a map of boothId to assignment
  const assignmentMap = new Map<string, BoothAssignment>();
  assignments.forEach((assignment) => {
    assignmentMap.set(assignment.boothId, assignment);
  });

  const assignedCount = assignments.length;
  const totalBooths = 160;

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
                ブース配置・自動抽選・公開設定
              </p>
            </div>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                ログアウト
              </button>
            </form>
          </div>

          {/* Status and Controls */}
          <div className="mb-6 rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span
                  className={`rounded-full px-4 py-2 text-lg font-semibold ${
                    settings.isPublished
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {settings.isPublished ? "公開中" : "非公開"}
                </span>
                <span className="text-lg text-gray-700">
                  <strong className="text-2xl text-blue-600">
                    {assignedCount}
                  </strong>{" "}
                  / {totalBooths} ブース割り当て済み
                </span>
              </div>
              <button
                onClick={handleLottery}
                disabled={processing}
                className="rounded-md bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:bg-gray-400"
              >
                {processing ? "処理中..." : "自動抽選を実行"}
              </button>
            </div>

            {/* Publication Controls */}
            <div className="mt-6 border-t pt-6">
              <h3 className="mb-4 text-lg font-bold">公開設定</h3>
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[250px]">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    公開日時
                  </label>
                  <input
                    type="datetime-local"
                    value={publishAt}
                    onChange={(e) => setPublishAt(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <button
                  onClick={handleUpdatePublishAt}
                  disabled={processing || !publishAt}
                  className="rounded-md bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
                >
                  設定
                </button>
                <button
                  onClick={handlePublish}
                  disabled={processing}
                  className="rounded-md bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700 disabled:bg-gray-400"
                >
                  今すぐ公開
                </button>
                <button
                  onClick={handleUnpublish}
                  disabled={processing}
                  className="rounded-md bg-orange-600 px-6 py-2 font-semibold text-white hover:bg-orange-700 disabled:bg-gray-400"
                >
                  公開取消
                </button>
              </div>
            </div>
          </div>

          {/* Arrangement Image */}
          <div className="mb-6 rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">配置図</h2>
            <div className="flex justify-center">
              <Image
                src="/arrangement.png"
                alt="ブース配置図"
                width={800}
                height={600}
                className="rounded-lg border border-gray-300"
              />
            </div>
          </div>

          {/* Booth Grid */}
          <div className="mb-6 rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">ブース一覧</h2>
            <div className="grid grid-cols-10 gap-2">
              {allBoothIds.map((boothId) => {
                const assignment = assignmentMap.get(boothId);
                const isAssigned = !!assignment;

                return (
                  <div
                    key={boothId}
                    className={`rounded-md border-2 p-2 text-center text-sm font-semibold ${
                      isAssigned
                        ? "border-green-500 bg-green-100 text-green-800"
                        : "border-gray-300 bg-gray-50 text-gray-600"
                    }`}
                  >
                    <div className="font-bold">{boothId}</div>
                    <div className="mt-1 text-xs">
                      {isAssigned
                        ? assignment.form?.shop?.name || "割当済"
                        : "未割当"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assignments Table */}
          <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">割り当て一覧</h2>
            {assignments.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                割り当てられたブースはありません
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-300 bg-gray-50">
                      <th className="px-4 py-3 text-left font-semibold">
                        ブースID
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        店舗名
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        申込ID
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments
                      .sort((a, b) => a.boothId.localeCompare(b.boothId))
                      .map((assignment) => (
                        <tr
                          key={assignment.id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 font-semibold text-blue-600">
                            {assignment.boothId}
                          </td>
                          <td className="px-4 py-3">
                            {assignment.form?.shop?.name || "未設定"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {assignment.formId}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
