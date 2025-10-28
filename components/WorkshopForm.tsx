"use client";

import { FormEvent, useState, useRef } from "react";

export default function WorkshopForm() {
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
      formType: "workshop",
      brandName: formData.get("brandName"),
      contactPerson: formData.get("contactPerson"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      emailConfirm: formData.get("emailConfirm"),
      participationMonths: participationMonths,
      participationPlan: formData.get("participationPlan"),
      activityContent: formData.get("activityContent"),
      durationAndAge: formData.get("durationAndAge"),
      participationFee: formData.get("participationFee"),
      materialsTools: formData.get("materialsTools"),
      boothSpace: formData.get("boothSpace"),
      detailedDescription: formData.get("detailedDescription"),
      agreementCheck: formData.get("agreementCheck"),
      companyName: formData.get("companyName"),
      representativeName: formData.get("representativeName"),
      companyAddress: formData.get("companyAddress"),
      activityPhotos: formData.getAll("activityPhotos"),
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
          <h2 className="text-2xl font-bold">ワークショップ・体験・その他出店申込フォーム</h2>
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
                placeholder="例：〇〇ワークショップ、△△体験"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
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
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
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
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
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
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
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
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
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
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
              >
                <option value="">選択してください</option>
                <option value="1month">1ヶ月</option>
                <option value="6months">6ヶ月</option>
                <option value="1year">1年間</option>
              </select>
            </div>
          </div>

          {/* 実施内容 */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">実施内容</h3>

            <div>
              <label htmlFor="activityContent" className="block text-sm font-medium text-gray-700">
                7. 実施内容・体験内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="activityContent"
                name="activityContent"
                rows={3}
                required
                placeholder="例：アクセサリー作り、占い、ハンドマッサージなど"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="durationAndAge" className="block text-sm font-medium text-gray-700">
                8. 所要時間・対象年齢 <span className="text-red-500">*</span>
              </label>
              <input
                id="durationAndAge"
                name="durationAndAge"
                type="text"
                required
                placeholder="例：15分程度、小学生以上"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="participationFee" className="block text-sm font-medium text-gray-700">
                9. 参加費 <span className="text-red-500">*</span>
              </label>
              <input
                id="participationFee"
                name="participationFee"
                type="text"
                required
                placeholder="例：¥500〜、無料"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="materialsTools" className="block text-sm font-medium text-gray-700">
                10. 必要な材料・道具 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="materialsTools"
                name="materialsTools"
                rows={3}
                required
                placeholder="すべてこちらで準備します、または、ご自身で準備が必要なもの"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="boothSpace" className="block text-sm font-medium text-gray-700">
                11. ブーススペース必要サイズ <span className="text-red-500">*</span>
              </label>
              <input
                id="boothSpace"
                name="boothSpace"
                type="text"
                required
                placeholder="例：2m×2m、テーブル1台程度"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="detailedDescription" className="block text-sm font-medium text-gray-700">
                12. 詳細説明・PR文
              </label>
              <textarea
                id="detailedDescription"
                name="detailedDescription"
                rows={5}
                placeholder="内容の特徴やアピールポイントを自由に記入してください"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
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
                  className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm">
                  <span className="font-medium">13. 出店規約・注意事項を確認し、内容に同意します</span> <span className="text-red-500">*</span>
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
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
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
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="activityPhotos" className="block text-sm font-medium text-gray-700">
                14. 実施内容・ブース写真（任意／最大3点までアップロード）
              </label>
              <input
                id="activityPhotos"
                name="activityPhotos"
                type="file"
                multiple
                accept=".jpg,.jpeg,.png"
                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-green-700 hover:file:bg-green-100"
              />
            </div>
          </div>

          {/* その他 */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">その他</h3>

            <div>
              <label htmlFor="snsLinks" className="block text-sm font-medium text-gray-700">
                15. SNSリンク
              </label>
              <textarea
                id="snsLinks"
                name="snsLinks"
                rows={3}
                placeholder="Instagram / X / TikTok など&#10;例：&#10;Instagram: https://instagram.com/...&#10;X: https://x.com/..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                16. 備考欄
              </label>
              <textarea
                id="remarks"
                name="remarks"
                rows={4}
                placeholder="質問・希望など自由に記入してください"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
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
              className="rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "送信中..." : "送信"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
