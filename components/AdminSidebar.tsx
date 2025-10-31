"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 rounded-md bg-red-800 p-2 text-white hover:bg-red-700"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-40 h-full w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">管理者メニュー</h2>
          <nav className="space-y-2">
            <Link
              href="/dashboard/admin"
              className="block rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              ダッシュボード
            </Link>
            <Link
              href="/dashboard/admin/applications"
              className="block rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              1. 応募管理
            </Link>
            <Link
              href="/dashboard/admin/vendors"
              className="block rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              2. 出店者管理
            </Link>
            <Link
              href="/dashboard/admin/events"
              className="block rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              3. 開催日・枠管理
            </Link>
            <Link
              href="/dashboard/admin/layout"
              className="block rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              4. 配置図管理
            </Link>
            <Link
              href="/dashboard/admin/billing"
              className="block rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              5. 請求・入金管理
            </Link>
            <Link
              href="/dashboard/admin/operations"
              className="block rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              6. 来場・当日運用
            </Link>
            <Link
              href="/dashboard/admin/notifications"
              className="block rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              7. 通知・アナウンス
            </Link>
            <Link
              href="/dashboard/admin/reports"
              className="block rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              8. レポート／統計
            </Link>
            <Link
              href="/dashboard/admin/security"
              className="block rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              9. 権限・セキュリティ
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
