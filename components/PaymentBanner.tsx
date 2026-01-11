"use client";

import { useState } from "react";
import { BOOTH_TYPE_LABELS, PLAN_LABELS, formatPrice } from "@/lib/stripe/pricing";

type PaymentBannerProps = {
  formId: string;
  shopName: string;
  boothType: string;
  participationPlan: string;
  amount: number;
};

export default function PaymentBanner({
  formId,
  shopName,
  boothType,
  participationPlan,
  amount,
}: PaymentBannerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "決済の開始に失敗しました");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            決済待ち
          </h3>
          <p className="text-purple-100">
            決済を完了してください。それをもって確定となります。
          </p>
          <div className="text-sm text-purple-200 space-y-1">
            <p>店舗名: {shopName}</p>
            <p>出店形態: {BOOTH_TYPE_LABELS[boothType] || boothType}</p>
            <p>参加プラン: {PLAN_LABELS[participationPlan] || participationPlan}</p>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="text-3xl font-bold">{formatPrice(amount)}</div>

          {error && (
            <p className="text-red-200 text-sm">{error}</p>
          )}

          <button
            onClick={handlePayment}
            disabled={isLoading}
            className="rounded-lg bg-white px-6 py-3 font-bold text-purple-600 hover:bg-purple-50 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                処理中...
              </span>
            ) : (
              "お支払いへ進む"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
