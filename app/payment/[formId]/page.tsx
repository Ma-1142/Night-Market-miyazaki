"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BOOTH_TYPE_LABELS, PLAN_LABELS, formatPrice, getPrice } from "@/lib/stripe/pricing";

interface FormData {
  id: string;
  status: string;
  shopName?: string;
  boothType?: string;
  participationPlan?: string;
  email?: string;
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.formId as string;

  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchForm() {
      try {
        const res = await fetch(`/api/forms/${formId}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("申請が見つかりません");
          } else {
            setError("データの取得に失敗しました");
          }
          return;
        }
        const data = await res.json();
        setFormData(data);
      } catch {
        setError("データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    }
    fetchForm();
  }, [formId]);

  const handlePayment = async () => {
    setProcessing(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "決済の開始に失敗しました");
        setProcessing(false);
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("決済の開始に失敗しました");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error && !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">エラー</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/dashboard/user")}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            ダッシュボードに戻る
          </button>
        </div>
      </div>
    );
  }

  if (!formData) {
    return null;
  }

  if (formData.status !== "awaiting_payment") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">お支払い不要</h1>
          <p className="text-gray-600 mb-6">
            この申請は現在お支払い待ちの状態ではありません。
            <br />
            ステータス: {formData.status}
          </p>
          <button
            onClick={() => router.push("/dashboard/user")}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            ダッシュボードに戻る
          </button>
        </div>
      </div>
    );
  }

  const boothType = formData.boothType || "";
  const plan = formData.participationPlan || "";
  const price = getPrice(boothType, plan);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-600 text-white px-6 py-4">
            <h1 className="text-xl font-bold">出店料金のお支払い</h1>
          </div>

          <div className="p-6">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">店舗名</span>
                <span className="font-medium">{formData.shopName || "未設定"}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">出店形態</span>
                <span className="font-medium">{BOOTH_TYPE_LABELS[boothType] || boothType}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">参加プラン</span>
                <span className="font-medium">{PLAN_LABELS[plan] || plan}</span>
              </div>
              <div className="flex justify-between py-3 bg-gray-50 px-3 rounded">
                <span className="text-gray-800 font-medium">お支払い金額</span>
                <span className="text-2xl font-bold text-green-600">
                  {price ? formatPrice(price) : "---"}
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={processing || !price}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {processing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  処理中...
                </span>
              ) : (
                "お支払いへ進む"
              )}
            </button>

            <p className="mt-4 text-xs text-gray-500 text-center">
              Stripeの安全な決済ページに移動します
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/dashboard/user")}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            ← ダッシュボードに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
