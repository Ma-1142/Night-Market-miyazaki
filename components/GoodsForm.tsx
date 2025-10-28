"use client";

import { FormEvent, useState, useRef } from "react";

export default function GoodsForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const participationMonths = formData.getAll("participationMonths");

    const data = {
      formType: "goods",
      brandName: formData.get("brandName"),
      contactPerson: formData.get("contactPerson"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      emailConfirm: formData.get("emailConfirm"),
      participationMonths: participationMonths,
      participationPlan: formData.get("participationPlan"),
      productType: formData.get("productType"),
      productFeatures: formData.get("productFeatures"),
      priceRange: formData.get("priceRange"),
      salesDescription: formData.get("salesDescription"),
      agreementCheck: formData.get("agreementCheck"),
      companyName: formData.get("companyName"),
      representativeName: formData.get("representativeName"),
      companyAddress: formData.get("companyAddress"),
      productPhotos: formData.getAll("productPhotos"),
      snsLinks: formData.get("snsLinks"),
      remarks: formData.get("remarks"),
    };

    try {
      const response = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess(true);
        formRef.current?.reset();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">物販・雑貨出店申込フォーム</h2>
          <p className="mt-2 text-gray-600">以下の情報を入力してください</p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
          {/* 基本情報 */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">基本情報</h3>

            <div>
              <label htmlFor="brandName" className="block text-sm font-medium text-gray-700">
                1. 屋号・ブランド名 <span className="text-red-500">*</span>
              </label>
              <input
                id="brandName"
                name="brandName"
                type="text"
                required
                placeholder="例：〇〇雑貨、△△クラフト"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
                  2. 担当者名 <span className="text-red-500">*</span>
                </label>
                <input
                  id="contactPerson"
                  name="contactPerson"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  3. 連絡先電話番号 <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="携帯番号"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  4. メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="emailConfirm" className="block text-sm font-medium text-gray-700">
                  メールアドレス（確認用） <span className="text-red-500">*</span>
                </label>
                <input
                  id="emailConfirm"
                  name="emailConfirm"
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                5. 出店希望月（複数選択可） <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-3">
                {["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"].map((month, index) => (
                  <label key={month} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="participationMonths"
                      value={index + 1}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm">{month}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="participationPlan" className="block text-sm font-medium text-gray-700">
                6. 出店プラン <span className="text-red-500">*</span>
              </label>
              <select
                id="participationPlan"
                name="participationPlan"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              >
                <option value="">選択してください</option>
                <option value="1month">1ヶ月</option>
                <option value="6months">6ヶ月</option>
                <option value="1year">1年間</option>
              </select>
            </div>
          </div>

          {/* 販売内容 */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">販売内容</h3>

            <div>
              <label htmlFor="productType" className="block text-sm font-medium text-gray-700">
                7. 取り扱い商品・販売内容 <span className="text-red-500">*</span>
              </label>
              <input
                id="productType"
                name="productType"
                type="text"
                required
                placeholder="例：アクセサリー、アパレル、インテリア雑貨など"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="productFeatures" className="block text-sm font-medium text-gray-700">
                8. 商品の特徴やこだわり <span className="text-red-500">*</span>
              </label>
              <textarea
                id="productFeatures"
                name="productFeatures"
                rows={3}
                required
                placeholder="例：ハンドメイド、オリジナルブランド、輸入雑貨など"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700">
                9. 価格帯 <span className="text-red-500">*</span>
              </label>
              <input
                id="priceRange"
                name="priceRange"
                type="text"
                required
                placeholder="例：¥500〜¥5,000"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="salesDescription" className="block text-sm font-medium text-gray-700">
                10. 販売内容・PR文
              </label>
              <textarea
                id="salesDescription"
                name="salesDescription"
                rows={5}
                placeholder="商品の特徴やアピールポイントを自由に記入してください"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              />
            </div>
          </div>

          {/* 書類・確認項目 */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">書類・確認項目</h3>

            <div>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="agreementCheck"
                  required
                  className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm">
                  <span className="font-medium">11. 出店規約・注意事項を確認し、内容に同意します</span> <span className="text-red-500">*</span>
                </span>
              </label>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  会社名 <span className="text-red-500">*</span>
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="representativeName" className="block text-sm font-medium text-gray-700">
                  代表者氏名 <span className="text-red-500">*</span>
                </label>
                <input
                  id="representativeName"
                  name="representativeName"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700">
                住所 <span className="text-red-500">*</span>
              </label>
              <input
                id="companyAddress"
                name="companyAddress"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="productPhotos" className="block text-sm font-medium text-gray-700">
                12. 商品・ブース写真（任意／最大3点までアップロード）
              </label>
              <input
                id="productPhotos"
                name="productPhotos"
                type="file"
                multiple
                accept=".jpg,.jpeg,.png"
                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-purple-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-purple-700 hover:file:bg-purple-100"
              />
            </div>
          </div>

          {/* その他 */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">その他</h3>

            <div>
              <label htmlFor="snsLinks" className="block text-sm font-medium text-gray-700">
                13. SNSリンク
              </label>
              <textarea
                id="snsLinks"
                name="snsLinks"
                rows={3}
                placeholder="Instagram / X / TikTok など&#10;例：&#10;Instagram: https://instagram.com/...&#10;X: https://x.com/..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                14. 備考欄
              </label>
              <textarea
                id="remarks"
                name="remarks"
                rows={4}
                placeholder="質問・希望など自由に記入してください"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              />
            </div>
          </div>

          {success && (
            <div className="rounded-md bg-green-50 p-4 text-green-800 text-center font-semibold">
              フォームが正常に送信されました！
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white px-6 py-2 text-gray-700 hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-purple-600 px-6 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? "送信中..." : "送信"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
