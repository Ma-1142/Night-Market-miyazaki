"use client";

import { FormEvent, useState, useRef } from "react";

export default function ShopForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);

    // Get checkbox values
    const participationMonths = formData.getAll("participationMonths");
    const allergens = formData.getAll("allergens");

    const data = {
      formType: "food",
      // 基本情報
      shopName: formData.get("shopName"),
      contactPerson: formData.get("contactPerson"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      emailConfirm: formData.get("emailConfirm"),
      boothType: formData.get("boothType"),
      participationMonths: participationMonths,
      participationPlan: formData.get("participationPlan"),

      // 事業内容・販売内容
      businessType: formData.get("businessType"),
      menuItems: formData.get("menuItems"),
      priceRange: formData.get("priceRange"),
      cookingMethod: formData.get("cookingMethod"),
      allergens: allergens,
      allergensOther: formData.get("allergensOther"),
      vehicleSize: formData.get("vehicleSize"),
      requiredSpace: formData.get("requiredSpace"),
      salesDescription: formData.get("salesDescription"),

      // 書類・確認項目
      businessPermit: formData.get("businessPermit"),
      foodSafetyCert: formData.get("foodSafetyCert"),
      insuranceStatus: formData.get("insuranceStatus"),
      insuranceCert: formData.get("insuranceCert"),

      // 規約・同意
      agreementCheck: formData.get("agreementCheck"),
      companyName: formData.get("companyName"),
      representativeName: formData.get("representativeName"),
      companyAddress: formData.get("companyAddress"),

      // その他
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
          <h2 className="text-2xl font-bold">出店申込フォーム</h2>
          <p className="mt-2 text-gray-600">以下の情報を入力してください</p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
          {/* 基本情報 */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">基本情報</h3>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">
                  1. 屋号・店舗名 <span className="text-red-500">*</span>
                </label>
                <input
                  id="shopName"
                  name="shopName"
                  type="text"
                  required
                  placeholder="例：〇〇キッチン、△△カフェ"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
                  2. 担当者名 <span className="text-red-500">*</span>
                </label>
                <input
                  id="contactPerson"
                  name="contactPerson"
                  type="text"
                  required
                  placeholder="代表者または現場責任者"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  3. 連絡先電話番号 <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="携帯番号・緊急連絡用"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  4. メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="boothType" className="block text-sm font-medium text-gray-700">
                5. 出店形態 <span className="text-red-500">*</span>
              </label>
              <select
                id="boothType"
                name="boothType"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                <option value="yatai">屋台</option>
                <option value="kitchencar">キッチンカー</option>
                <option value="tent">テント</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                6. 出店希望月（複数選択可） <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-3">
                {["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"].map((month, index) => (
                  <label key={month} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="participationMonths"
                      value={index + 1}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{month}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="participationPlan" className="block text-sm font-medium text-gray-700">
                7. 出店プラン <span className="text-red-500">*</span>
              </label>
              <select
                id="participationPlan"
                name="participationPlan"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                <option value="1month">1ヶ月</option>
                <option value="6months">6ヶ月</option>
                <option value="1yearA">1年間A</option>
                <option value="1yearB">1年間B</option>
              </select>
            </div>
          </div>

          {/* 事業内容・販売内容 */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">事業内容・販売内容</h3>

            <div>
              <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
                8. 事業の業種 <span className="text-red-500">*</span>
              </label>
              <input
                id="businessType"
                name="businessType"
                type="text"
                required
                placeholder="例：焼きそば、唐揚げ、クラフトドリンクなど"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="menuItems" className="block text-sm font-medium text-gray-700">
                9. 主な販売メニュー <span className="text-red-500">*</span>
              </label>
              <textarea
                id="menuItems"
                name="menuItems"
                rows={3}
                required
                placeholder="提供する料理・ドリンクを具体的に記載"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700">
                10. 販売価格帯 <span className="text-red-500">*</span>
              </label>
              <input
                id="priceRange"
                name="priceRange"
                type="text"
                required
                placeholder="例：¥500〜¥1,000"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="cookingMethod" className="block text-sm font-medium text-gray-700">
                11. 調理方法 <span className="text-red-500">*</span>
              </label>
              <select
                id="cookingMethod"
                name="cookingMethod"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                <option value="fire">火気使用あり</option>
                <option value="electric">電気調理のみ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                12. アレルゲン表示（該当するものにチェック）
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["卵", "乳", "小麦", "えび", "かに", "そば", "落花生"].map((allergen) => (
                  <label key={allergen} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="allergens"
                      value={allergen}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{allergen}</span>
                  </label>
                ))}
              </div>
              <div className="mt-3">
                <input
                  type="text"
                  name="allergensOther"
                  placeholder="その他のアレルゲンがあれば記入"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="vehicleSize" className="block text-sm font-medium text-gray-700">
                13. 車両サイズ（キッチンカーの場合）
              </label>
              <input
                id="vehicleSize"
                name="vehicleSize"
                type="text"
                placeholder="例：全長5m以内・高さ2.5m以内"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="requiredSpace" className="block text-sm font-medium text-gray-700">
                14. 必要スペース <span className="text-red-500">*</span>
              </label>
              <input
                id="requiredSpace"
                name="requiredSpace"
                type="text"
                required
                placeholder="例：3m×3m、5m×3mなど"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="salesDescription" className="block text-sm font-medium text-gray-700">
                15. 販売内容・PR文
              </label>
              <textarea
                id="salesDescription"
                name="salesDescription"
                rows={5}
                placeholder="店舗の特徴やアピールポイントを自由に記入してください"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 書類・確認項目 */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">書類・確認項目</h3>

            <div>
              <label htmlFor="businessPermit" className="block text-sm font-medium text-gray-700">
                16. 営業許可証 <span className="text-red-500">*</span>
              </label>
              <p className="mt-1 text-xs text-gray-500">臨時営業許可証または仮設営業許可証のいずれか1点をアップロード</p>
              <input
                id="businessPermit"
                name="businessPermit"
                type="file"
                required
                accept=".pdf,.jpg,.jpeg,.png"
                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div>
              <label htmlFor="foodSafetyCert" className="block text-sm font-medium text-gray-700">
                17. 食品衛生責任者証 <span className="text-red-500">*</span>
              </label>
              <p className="mt-1 text-xs text-gray-500">現場責任者1名分の証明書をアップロード</p>
              <input
                id="foodSafetyCert"
                name="foodSafetyCert"
                type="file"
                required
                accept=".pdf,.jpg,.jpeg,.png"
                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                18. 賠償責任保険（PL保険等）【加入推奨】 <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="insuranceStatus"
                    value="enrolled"
                    required
                    className="border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">加入している</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="insuranceStatus"
                    value="considering"
                    className="border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">検討中</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="insuranceStatus"
                    value="notEnrolled"
                    className="border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">加入していない</span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="insuranceCert" className="block text-sm font-medium text-gray-700">
                19. 保険証書アップロード（任意／加入している方のみ）
              </label>
              <input
                id="insuranceCert"
                name="insuranceCert"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          {/* 規約・同意 */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">規約・同意</h3>

            <div>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="agreementCheck"
                  required
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">
                  <span className="font-medium">20. 出店規約・注意事項を確認し、内容に同意します</span> <span className="text-red-500">*</span>
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
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>

          {/* その他 */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">その他</h3>

            <div>
              <label htmlFor="snsLinks" className="block text-sm font-medium text-gray-700">
                21. SNSリンク
              </label>
              <textarea
                id="snsLinks"
                name="snsLinks"
                rows={3}
                placeholder="Instagram / X（旧Twitter）/ TikTok など&#10;例：&#10;Instagram: https://instagram.com/...&#10;X: https://x.com/..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                22. 備考欄
              </label>
              <textarea
                id="remarks"
                name="remarks"
                rows={4}
                placeholder="特記事項・質問など自由に記入してください"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
              className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "送信中..." : "送信"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
