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
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-700">決済を完了してください</p>
          <p className="text-xs text-gray-400 mt-1">
            {shopName} - {BOOTH_TYPE_LABELS[boothType] || boothType} / {PLAN_LABELS[participationPlan] || participationPlan}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xl font-bold text-gray-900">{formatPrice(amount)}</p>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <button
            onClick={handlePayment}
            disabled={isLoading}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "処理中..." : "決済する"}
          </button>
        </div>
      </div>
    </div>
  );
}
