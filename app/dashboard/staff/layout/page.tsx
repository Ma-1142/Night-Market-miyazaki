"use client";

import { useEffect, useState } from "react";
import StaffSidebar from "@/components/StaffSidebar";
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

interface LayoutData {
  isPublished: boolean;
  message?: string;
  settings?: {
    id: string;
    publishAt: string | null;
    isPublished: boolean;
  };
  assignments?: BoothAssignment[];
}

export default function StaffLayoutPage() {
  const [data, setData] = useState<LayoutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/staff/layout");
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
        <StaffSidebar />
        <div className="p-8 pl-20">
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

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffSidebar />
      <div className="p-8 pl-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
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
              <p className="mt-2 text-gray-600">
                ブース配置一覧 - {assignedCount} / {totalBooths} ブース割り当て済み
              </p>
            )}
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
                            </tr>
                          ))}
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
