"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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

interface LayoutData {
  isPublished: boolean;
  message?: string;
  settings?: {
    id: string;
    publishAt: string | null;
    isPublished: boolean;
  };
  assignments?: BoothAssignment[];
  userBoothId?: string | null;
}

export default function UserLayoutPage() {
  const [data, setData] = useState<LayoutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/user/layout");
      if (response.ok) {
        const layoutData = await response.json();
        setData(layoutData);
      }
    } catch (error) {
      console.error("Error fetching layout data:", error);
    } finally {
      setLoading(false);
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
  if (data?.assignments) {
    data.assignments.forEach((assignment) => {
      assignmentMap.set(assignment.boothId, assignment);
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-8">
          <div className="flex h-96 items-center justify-center">
            <div className="text-xl">読み込み中...</div>
          </div>
        </div>
      </div>
    );
  }

  const assignedCount = data?.assignments?.length || 0;
  const totalBooths = 160;
  const isPublished = data?.isPublished || false;
  const userBoothId = data?.userBoothId;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">配置図</h1>
              {!isPublished ? (
                <div className="mt-4 rounded-lg bg-yellow-50 border-2 border-yellow-300 p-4">
                  <p className="text-lg font-semibold text-yellow-800">
                    配置はまだ決まっていません
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    管理者が配置を決定し、公開するまでお待ちください。
                  </p>
                </div>
              ) : (
                <div className="mt-2">
                  {userBoothId ? (
                    <div className="inline-flex items-center gap-2 rounded-lg bg-blue-100 border-2 border-blue-400 px-4 py-2">
                      <span className="text-blue-800 font-semibold">
                        あなたのブース:
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        {userBoothId}
                      </span>
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      ブース配置一覧 - {assignedCount} / {totalBooths} ブース割り当て済み
                    </p>
                  )}
                </div>
              )}
            </div>
            <Link
              href="/dashboard/user"
              className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
            >
              ダッシュボードへ戻る
            </Link>
          </div>

          {/* Arrangement Image - Always show */}
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

          {/* Show booth details only if published */}
          {isPublished && (
            <>
              {/* Legend */}
              {userBoothId && (
                <div className="mb-4 flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border-2 border-blue-500 bg-blue-200"></div>
                    <span className="text-sm text-gray-700">あなたのブース</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border-2 border-green-500 bg-green-100"></div>
                    <span className="text-sm text-gray-700">割当済</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border-2 border-gray-300 bg-gray-50"></div>
                    <span className="text-sm text-gray-700">未割当</span>
                  </div>
                </div>
              )}

              {/* Booth Grid */}
              <div className="mb-6 rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold">ブース一覧</h2>
                <div className="grid grid-cols-10 gap-2">
                  {allBoothIds.map((boothId) => {
                    const assignment = assignmentMap.get(boothId);
                    const isAssigned = !!assignment;
                    const isUserBooth = boothId === userBoothId;

                    return (
                      <div
                        key={boothId}
                        className={`rounded-md border-2 p-2 text-center text-sm font-semibold ${
                          isUserBooth
                            ? "border-blue-500 bg-blue-200 text-blue-900 ring-2 ring-blue-400"
                            : isAssigned
                            ? "border-green-500 bg-green-100 text-green-800"
                            : "border-gray-300 bg-gray-50 text-gray-600"
                        }`}
                      >
                        <div className="font-bold">{boothId}</div>
                        <div className="mt-1 text-xs">
                          {isUserBooth
                            ? "あなた"
                            : isAssigned
                            ? "割当済"
                            : "未割当"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* User's Booth Info */}
              {userBoothId && (
                <div className="mb-6 rounded-xl border-2 border-blue-300 bg-blue-50 p-6 shadow-sm">
                  <h2 className="mb-4 text-xl font-bold text-blue-900">
                    あなたのブース情報
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <div className="text-sm text-gray-600 mb-1">ブース番号</div>
                      <div className="text-3xl font-bold text-blue-600">
                        {userBoothId}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <div className="text-sm text-gray-600 mb-1">エリア</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {userBoothId.charAt(0)}ゾーン
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 bg-white p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">注意事項</h3>
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
              )}

              {/* Assignments Table - Only show if user doesn't have a booth or wants to see all */}
              {data.assignments && data.assignments.length > 0 && (
                <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-xl font-bold">割り当て一覧</h2>
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
                        </tr>
                      </thead>
                      <tbody>
                        {data.assignments
                          .sort((a, b) => a.boothId.localeCompare(b.boothId))
                          .map((assignment) => {
                            const isUserBooth = assignment.boothId === userBoothId;
                            return (
                              <tr
                                key={assignment.id}
                                className={`border-b border-gray-200 ${
                                  isUserBooth
                                    ? "bg-blue-50 hover:bg-blue-100"
                                    : "hover:bg-gray-50"
                                }`}
                              >
                                <td className={`px-4 py-3 font-semibold ${
                                  isUserBooth ? "text-blue-600" : "text-gray-600"
                                }`}>
                                  {assignment.boothId}
                                  {isUserBooth && (
                                    <span className="ml-2 text-xs font-normal text-blue-500">
                                      (あなた)
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  {assignment.form?.shop?.name || "未設定"}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
