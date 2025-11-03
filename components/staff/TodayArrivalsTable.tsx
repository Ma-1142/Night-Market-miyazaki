"use client";

import { useEffect, useState } from "react";

type ArrivalStatus = "pending" | "checked_in" | "confirmed";

type Arrival = {
  id: string;
  formId: string;
  eventId: string;
  shopName: string;
  formType: string;
  boothId: string | null;
  userEmail: string;
  userPhone: string | null;
  startTime: string | null;
  endTime: string | null;
  status: ArrivalStatus;
  vendorCheckedIn: boolean;
  vendorCheckedInAt: Date | null;
  staffConfirmed: boolean;
  staffConfirmedAt: Date | null;
  staffConfirmedBy: string | null;
  notes: string | null;
};

export default function TodayArrivalsTable() {
  const [arrivals, setArrivals] = useState<Arrival[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch arrivals
  const fetchArrivals = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (searchQuery) params.set("search", searchQuery);

      const response = await fetch(`/api/staff/arrivals/today?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch arrivals");
      }
      const data = await response.json();
      setArrivals(data.arrivals);
    } catch (error) {
      console.error("Error fetching arrivals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArrivals();
    // Poll every 30 seconds
    const interval = setInterval(fetchArrivals, 30000);
    return () => clearInterval(interval);
  }, [statusFilter, searchQuery]);

  // Handle staff confirmation
  const handleConfirm = async (arrivalId: string) => {
    setConfirmingId(arrivalId);
    setMessage(null);

    try {
      const response = await fetch("/api/arrivals/staff-confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          arrivalId,
        }),
      });

      if (!response.ok) {
        throw new Error("Confirmation failed");
      }

      setMessage({
        type: "success",
        text: "到着を確認しました",
      });

      // Refresh data
      await fetchArrivals();
    } catch (error) {
      setMessage({
        type: "error",
        text: "エラーが発生しました。もう一度お試しください。",
      });
    } finally {
      setConfirmingId(null);
    }
  };

  // Get status badge
  const getStatusBadge = (status: ArrivalStatus) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 border border-gray-300">
            ○ 未到着
          </span>
        );
      case "checked_in":
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 border border-yellow-300">
            ⏳ 待機中
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 border border-green-300">
            ✓ 確認済み
          </span>
        );
    }
  };

  // Get form type label
  const getFormTypeLabel = (formType: string) => {
    switch (formType) {
      case "food":
        return "飲食";
      case "goods":
        return "物販・雑貨";
      case "workshop":
        return "ワークショップ・体験";
      default:
        return formType;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-8 shadow-md">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ステータス
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">全て</option>
              <option value="checked_in">待機中</option>
              <option value="pending">未到着</option>
              <option value="confirmed">確認済み</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              検索
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="店舗名、メール、ブース番号"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg bg-yellow-50 p-6 border-2 border-yellow-200">
          <div className="text-3xl font-bold text-yellow-800">
            {arrivals.filter((a) => a.status === "checked_in").length}
          </div>
          <div className="text-sm text-yellow-700 mt-1">待機中</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-6 border-2 border-gray-200">
          <div className="text-3xl font-bold text-gray-800">
            {arrivals.filter((a) => a.status === "pending").length}
          </div>
          <div className="text-sm text-gray-700 mt-1">未到着</div>
        </div>
        <div className="rounded-lg bg-green-50 p-6 border-2 border-green-200">
          <div className="text-3xl font-bold text-green-800">
            {arrivals.filter((a) => a.status === "confirmed").length}
          </div>
          <div className="text-sm text-green-700 mt-1">確認済み</div>
        </div>
      </div>

      {/* Arrivals table */}
      <div className="rounded-lg bg-white shadow-md overflow-hidden">
        {arrivals.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">📭</div>
            <p>該当する出店者がいません</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    店舗名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    種別
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ブース
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    時間
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    チェックイン時刻
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {arrivals.map((arrival) => (
                  <tr key={arrival.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {arrival.shopName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {arrival.userEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getFormTypeLabel(arrival.formType)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {arrival.boothId || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {arrival.startTime && arrival.endTime
                          ? `${arrival.startTime} - ${arrival.endTime}`
                          : "未定"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(arrival.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {arrival.vendorCheckedInAt
                          ? new Date(arrival.vendorCheckedInAt).toLocaleTimeString("ja-JP", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {arrival.status === "checked_in" ? (
                        <button
                          onClick={() => handleConfirm(arrival.id)}
                          disabled={confirmingId === arrival.id}
                          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {confirmingId === arrival.id ? "確認中..." : "確認"}
                        </button>
                      ) : arrival.status === "confirmed" ? (
                        <span className="text-green-600">
                          ✓ {arrival.staffConfirmedAt
                            ? new Date(arrival.staffConfirmedAt).toLocaleTimeString("ja-JP", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "確認済み"}
                        </span>
                      ) : (
                        <span className="text-gray-400">待機中</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
