"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type FormWithRelations = {
  id: string;
  status: string;
  createdAt: Date;
  shop: {
    name: string;
    user: {
      name: string | null;
      email: string;
    };
  };
};

type ApplicationsTableProps = {
  forms: FormWithRelations[];
};

export default function ApplicationsTable({ forms }: ApplicationsTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // Toggle individual selection
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Toggle all selection
  const toggleSelectAll = () => {
    if (selectedIds.length === forms.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(forms.map((f) => f.id));
    }
  };

  // Bulk approve
  const handleBulkApprove = async () => {
    if (
      !confirm(
        `${selectedIds.length}件の申込を「確定」に変更しますか？`
      )
    ) {
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/admin/applications/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: selectedIds,
          action: "approve",
        }),
      });

      if (response.ok) {
        alert("ステータスを更新しました");
        setSelectedIds([]);
        router.refresh();
      } else {
        alert("エラーが発生しました");
      }
    } catch (error) {
      alert("エラーが発生しました");
    } finally {
      setIsProcessing(false);
    }
  };

  // Bulk reject
  const handleBulkReject = async () => {
    if (
      !confirm(
        `${selectedIds.length}件の申込を「却下」に変更しますか？`
      )
    ) {
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/admin/applications/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: selectedIds,
          action: "reject",
        }),
      });

      if (response.ok) {
        alert("ステータスを更新しました");
        setSelectedIds([]);
        router.refresh();
      } else {
        alert("エラーが発生しました");
      }
    } catch (error) {
      alert("エラーが発生しました");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-blue-50 p-4">
          <span className="text-sm font-medium text-blue-900">
            {selectedIds.length}件選択中
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleBulkApprove}
              disabled={isProcessing}
              className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:bg-gray-400"
            >
              一括確定
            </button>
            <button
              onClick={handleBulkReject}
              disabled={isProcessing}
              className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:bg-gray-400"
            >
              一括却下
            </button>
          </div>
        </div>
      )}

      <div className="rounded-lg bg-white shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    forms.length > 0 && selectedIds.length === forms.length
                  }
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                申込ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                出店者名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                店舗名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ステータス
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                申込日
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                アクション
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {forms.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  応募がまだありません
                </td>
              </tr>
            ) : (
              forms.map((form) => (
                <tr
                  key={form.id}
                  className={`hover:bg-gray-50 ${
                    selectedIds.includes(form.id) ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(form.id)}
                      onChange={() => toggleSelection(form.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {form.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {form.shop.user.name || form.shop.user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {form.shop.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        form.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : form.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : form.status === "reviewing"
                          ? "bg-blue-100 text-blue-800"
                          : form.status === "conditional"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {form.status === "pending"
                        ? "受理"
                        : form.status === "reviewing"
                        ? "審査中"
                        : form.status === "conditional"
                        ? "条件提示"
                        : form.status === "approved"
                        ? "確定"
                        : "却下"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(form.createdAt).toLocaleDateString("ja-JP")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      href={`/dashboard/admin/applications/${form.id}`}
                      className="text-blue-600 hover:text-blue-900 hover:underline"
                    >
                      詳細
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        合計: {forms.length} 件
      </div>
    </div>
  );
}
