"use client";

import { useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";

export default function LayoutPage() {
  // Simple grid layout - 6x8 spots
  const [spots, setSpots] = useState(
    Array.from({ length: 48 }, (_, i) => ({
      id: `SPOT-${String(i + 1).padStart(3, "0")}`,
      occupied: false,
      vendor: null,
    }))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="p-8 pl-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">配置図管理</h1>
              <p className="mt-2 text-gray-600">出店者の配置・自動抽選・通知設定</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                自動抽選実行
              </button>
              <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                配置通知送信
              </button>
              <Link
                href="/api/auth/signout"
                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                ログアウト
              </Link>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border-2 border-gray-300"></div>
                <span className="text-sm">空き</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500"></div>
                <span className="text-sm">配置済み</span>
              </div>
            </div>

            {/* Grid Layout Map */}
            <div className="grid grid-cols-8 gap-2">
              {spots.map((spot) => (
                <div
                  key={spot.id}
                  className={`aspect-square border-2 rounded-md flex items-center justify-center text-xs font-mono cursor-pointer transition-colors ${
                    spot.occupied
                      ? "bg-blue-500 text-white border-blue-600"
                      : "bg-white border-gray-300 hover:border-blue-400"
                  }`}
                  onClick={() => {
                    // Toggle spot occupation for demo
                    setSpots(
                      spots.map((s) =>
                        s.id === spot.id ? { ...s, occupied: !s.occupied } : s
                      )
                    );
                  }}
                >
                  {spot.id.split("-")[1]}
                </div>
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-600">
              配置済み: {spots.filter((s) => s.occupied).length} / {spots.length} 区画
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
