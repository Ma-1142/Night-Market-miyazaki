"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ApplicationFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [formType, setFormType] = useState(searchParams.get("formType") || "");
  const [dateFrom, setDateFrom] = useState(searchParams.get("dateFrom") || "");
  const [dateTo, setDateTo] = useState(searchParams.get("dateTo") || "");

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (formType) params.set("formType", formType);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);

    router.push(`/dashboard/admin/applications?${params.toString()}`);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setFormType("");
    setDateFrom("");
    setDateTo("");
    router.push("/dashboard/admin/applications");
  };

  // Check if any filters are active
  const hasActiveFilters =
    search || status || formType || dateFrom || dateTo;

  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow-md">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* Search */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            検索
          </label>
          <input
            type="text"
            placeholder="店舗名、出店者名、メールアドレス、申込ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyFilters();
            }}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Status filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ステータス
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="">全て</option>
            <option value="pending">受理</option>
            <option value="reviewing">審査中</option>
            <option value="conditional">条件提示</option>
            <option value="approved">確定</option>
            <option value="rejected">却下</option>
          </select>
        </div>

        {/* Form type filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            フォームタイプ
          </label>
          <select
            value={formType}
            onChange={(e) => setFormType(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="">全て</option>
            <option value="food">飲食</option>
            <option value="goods">物販・雑貨</option>
            <option value="workshop">ワークショップ・体験</option>
          </select>
        </div>

        {/* Date range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            申込日（開始）
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            申込日（終了）
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Action buttons and active filters */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={applyFilters}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            フィルター適用
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
            >
              クリア
            </button>
          )}
        </div>

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 text-sm">
            {search && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-800">
                検索: {search}
              </span>
            )}
            {status && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-800">
                ステータス:{" "}
                {status === "pending"
                  ? "受理"
                  : status === "reviewing"
                  ? "審査中"
                  : status === "conditional"
                  ? "条件提示"
                  : status === "approved"
                  ? "確定"
                  : "却下"}
              </span>
            )}
            {formType && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-800">
                タイプ:{" "}
                {formType === "food"
                  ? "飲食"
                  : formType === "goods"
                  ? "物販・雑貨"
                  : "ワークショップ"}
              </span>
            )}
            {dateFrom && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-800">
                開始: {dateFrom}
              </span>
            )}
            {dateTo && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-800">
                終了: {dateTo}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
