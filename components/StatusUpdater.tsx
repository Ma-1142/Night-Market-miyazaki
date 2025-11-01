"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type StatusUpdaterProps = {
  formId: string;
  currentStatus: string;
  currentAdminNotes?: string | null;
};

export default function StatusUpdater({ formId, currentStatus, currentAdminNotes }: StatusUpdaterProps) {
  const [status, setStatus] = useState(currentStatus);
  const [adminNotes, setAdminNotes] = useState(currentAdminNotes || "");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  const handleSave = async () => {
    if (status === currentStatus && adminNotes === (currentAdminNotes || "")) {
      setMessage({ type: "error", text: "変更がありません" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/forms/${formId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, adminNotes }),
      });

      if (!response.ok) {
        throw new Error("ステータスの更新に失敗しました");
      }

      setMessage({ type: "success", text: "ステータスを更新しました" });

      // Refresh the page to show updated status
      router.refresh();
    } catch (error) {
      setMessage({ type: "error", text: "エラーが発生しました" });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusLabel = (statusValue: string) => {
    switch (statusValue) {
      case "pending":
        return "受理";
      case "reviewing":
        return "審査中";
      case "conditional":
        return "条件提示";
      case "approved":
        return "確定";
      case "rejected":
        return "却下";
      default:
        return statusValue;
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4">ステータス管理</h2>

      {message && (
        <div
          className={`mb-4 p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            申込ステータス
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={isLoading}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
          >
            <option value="pending">{getStatusLabel("pending")}</option>
            <option value="reviewing">{getStatusLabel("reviewing")}</option>
            <option value="conditional">{getStatusLabel("conditional")}</option>
            <option value="approved">{getStatusLabel("approved")}</option>
            <option value="rejected">{getStatusLabel("rejected")}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            管理者メモ
          </label>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            disabled={isLoading}
            rows={4}
            placeholder="内部メモ（出店者には表示されません）"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
          />
          <p className="mt-1 text-xs text-gray-500">
            このメモは管理者とスタッフのみが閲覧できます
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={isLoading || (status === currentStatus && adminNotes === (currentAdminNotes || ""))}
            className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "保存中..." : "保存"}
          </button>
          {(status !== currentStatus || adminNotes !== (currentAdminNotes || "")) && (
            <button
              onClick={() => {
                setStatus(currentStatus);
                setAdminNotes(currentAdminNotes || "");
              }}
              disabled={isLoading}
              className="rounded-md bg-gray-200 px-6 py-2 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100"
            >
              リセット
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
