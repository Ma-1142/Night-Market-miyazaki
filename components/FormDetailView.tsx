type FormDetailViewProps = {
  formData: any;
  form: {
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
};

export default function FormDetailView({ formData, form }: FormDetailViewProps) {
  // Helper function to display array values
  const displayArray = (arr: any) => {
    if (!arr || !Array.isArray(arr)) return "未設定";
    return arr.length > 0 ? arr.join(", ") : "未設定";
  };

  const formType = formData.formType || "food";

  // Render based on form type
  if (formType === "goods") {
    return <GoodsDetailView formData={formData} displayArray={displayArray} />;
  }

  if (formType === "workshop") {
    return <WorkshopDetailView formData={formData} displayArray={displayArray} />;
  }

  // Default: Food form
  return <FoodDetailView formData={formData} displayArray={displayArray} />;
}

function FoodDetailView({ formData, displayArray }: { formData: any; displayArray: (arr: any) => string }) {
  return (
    <div className="rounded-lg bg-white p-8 shadow-md space-y-8">
      {/* 基本情報 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">基本情報</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">1. 屋号・店舗名</label>
            <p className="mt-1 text-gray-900">{formData.shopName || "未設定"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">2. 担当者名</label>
            <p className="mt-1 text-gray-900">{formData.contactPerson || "未設定"}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">3. 連絡先電話番号</label>
            <p className="mt-1 text-gray-900">{formData.phone || "未設定"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">4. メールアドレス</label>
            <p className="mt-1 text-gray-900">{formData.email || "未設定"}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">5. 出店形態</label>
          <p className="mt-1 text-gray-900">
            {formData.boothType === "yatai" && "屋台"}
            {formData.boothType === "kitchencar" && "キッチンカー"}
            {formData.boothType === "tent" && "テント"}
            {!formData.boothType && "未設定"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">6. 出店希望月</label>
          <p className="mt-1 text-gray-900">
            {displayArray(formData.participationMonths?.map((m: number) => `${m}月`))}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">7. 出店プラン</label>
          <p className="mt-1 text-gray-900">
            {formData.participationPlan === "1month" && "1ヶ月"}
            {formData.participationPlan === "6months" && "6ヶ月"}
            {formData.participationPlan === "1yearA" && "1年間A"}
            {formData.participationPlan === "1yearB" && "1年間B"}
            {!formData.participationPlan && "未設定"}
          </p>
        </div>
      </div>

      {/* 事業内容・販売内容 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">事業内容・販売内容</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">8. 事業の業種</label>
          <p className="mt-1 text-gray-900">{formData.businessType || "未設定"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">9. 主な販売メニュー</label>
          <p className="mt-1 text-gray-900 whitespace-pre-wrap">{formData.menuItems || "未設定"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">10. 販売価格帯</label>
          <p className="mt-1 text-gray-900">{formData.priceRange || "未設定"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">11. 調理方法</label>
          <p className="mt-1 text-gray-900">
            {formData.cookingMethod === "fire" && "火気使用あり"}
            {formData.cookingMethod === "electric" && "電気調理のみ"}
            {!formData.cookingMethod && "未設定"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">12. アレルゲン表示</label>
          <p className="mt-1 text-gray-900">{displayArray(formData.allergens)}</p>
          {formData.allergensOther && (
            <p className="mt-1 text-sm text-gray-600">その他: {formData.allergensOther}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">13. 車両サイズ（キッチンカーの場合）</label>
          <p className="mt-1 text-gray-900">{formData.vehicleSize || "未設定"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">14. 必要スペース</label>
          <p className="mt-1 text-gray-900">{formData.requiredSpace || "未設定"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">15. 販売内容・PR文</label>
          <p className="mt-1 text-gray-900 whitespace-pre-wrap">{formData.salesDescription || "未設定"}</p>
        </div>
      </div>

      {/* 書類・確認項目 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">書類・確認項目</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">16. 営業許可証</label>
          <p className="mt-1 text-sm text-gray-500">
            {formData.businessPermit ? "アップロード済み" : "未アップロード"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">17. 食品衛生責任者証</label>
          <p className="mt-1 text-sm text-gray-500">
            {formData.foodSafetyCert ? "アップロード済み" : "未アップロード"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">18. 賠償責任保険（PL保険等）</label>
          <p className="mt-1 text-gray-900">
            {formData.insuranceStatus === "enrolled" && "加入している"}
            {formData.insuranceStatus === "considering" && "検討中"}
            {formData.insuranceStatus === "notEnrolled" && "加入していない"}
            {!formData.insuranceStatus && "未設定"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">19. 保険証書アップロード</label>
          <p className="mt-1 text-sm text-gray-500">
            {formData.insuranceCert ? "アップロード済み" : "未アップロード"}
          </p>
        </div>
      </div>

      {/* 規約・同意 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">規約・同意</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">20. 出店規約・注意事項</label>
          <p className="mt-1 text-gray-900">
            {formData.agreementCheck ? "✓ 同意済み" : "未同意"}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">会社名</label>
            <p className="mt-1 text-gray-900">{formData.companyName || "未設定"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">代表者氏名</label>
            <p className="mt-1 text-gray-900">{formData.representativeName || "未設定"}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">住所</label>
          <p className="mt-1 text-gray-900">{formData.companyAddress || "未設定"}</p>
        </div>
      </div>

      {/* その他 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">その他</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">21. SNSリンク</label>
          <p className="mt-1 text-gray-900 whitespace-pre-wrap">{formData.snsLinks || "未設定"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">22. 備考欄</label>
          <p className="mt-1 text-gray-900 whitespace-pre-wrap">{formData.remarks || "未設定"}</p>
        </div>
      </div>
    </div>
  );
}

function GoodsDetailView({ formData, displayArray }: { formData: any; displayArray: (arr: any) => string }) {
  return (
    <div className="rounded-lg bg-white p-8 shadow-md space-y-8">
      {/* 基本情報 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">基本情報</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">1. 屋号・ブランド名</label>
          <p className="mt-1 text-gray-900">{formData.brandName || "未設定"}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">2. 担当者名</label>
            <p className="mt-1 text-gray-900">{formData.contactPerson || "未設定"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">3. 連絡先電話番号</label>
            <p className="mt-1 text-gray-900">{formData.phone || "未設定"}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">4. メールアドレス</label>
          <p className="mt-1 text-gray-900">{formData.email || "未設定"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">5. 出店希望月</label>
          <p className="mt-1 text-gray-900">
            {displayArray(formData.participationMonths?.map((m: number) => `${m}月`))}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">6. 出店プラン</label>
          <p className="mt-1 text-gray-900">
            {formData.participationPlan === "1month" && "1ヶ月"}
            {formData.participationPlan === "6months" && "6ヶ月"}
            {formData.participationPlan === "1year" && "1年間"}
            {!formData.participationPlan && "未設定"}
          </p>
        </div>
      </div>

      {/* 販売内容 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">販売内容</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">7. 取り扱い商品・販売内容</label>
          <p className="mt-1 text-gray-900 whitespace-pre-wrap">{formData.productType || "未設定"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">8. 商品の特徴やこだわり</label>
          <p className="mt-1 text-gray-900 whitespace-pre-wrap">{formData.productFeatures || "未設定"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">9. 価格帯</label>
          <p className="mt-1 text-gray-900">{formData.priceRange || "未設定"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">10. 販売内容・PR文</label>
          <p className="mt-1 text-gray-900 whitespace-pre-wrap">{formData.salesDescription || "未設定"}</p>
        </div>
      </div>

      {/* 書類・確認項目 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">書類・確認項目</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">11. 出店規約・注意事項</label>
          <p className="mt-1 text-gray-900">
            {formData.agreementCheck ? "✓ 同意済み" : "未同意"}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">会社名</label>
            <p className="mt-1 text-gray-900">{formData.companyName || "未設定"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">代表者氏名</label>
            <p className="mt-1 text-gray-900">{formData.representativeName || "未設定"}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">住所</label>
          <p className="mt-1 text-gray-900">{formData.companyAddress || "未設定"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">12. 商品・ブース写真</label>
          <p className="mt-1 text-sm text-gray-500">
            {formData.productPhotos && formData.productPhotos.length > 0
              ? `${formData.productPhotos.length}点アップロード済み`
              : "未アップロード"}
          </p>
        </div>
      </div>

      {/* その他 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">その他</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">13. SNSリンク</label>
          <p className="mt-1 text-gray-900 whitespace-pre-wrap">{formData.snsLinks || "未設定"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">14. 備考欄</label>
          <p className="mt-1 text-gray-900 whitespace-pre-wrap">{formData.remarks || "未設定"}</p>
        </div>
      </div>
    </div>
  );
}

function WorkshopDetailView({ formData, displayArray }: { formData: any; displayArray: (arr: any) => string }) {
  return (
    <div className="rounded-lg bg-white p-8 shadow-md space-y-8">
      {/* 基本情報 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">基本情報</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">1. ブース名・団体名</label>
          <p className="mt-1 text-gray-900">{formData.boothName || "未設定"}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">2. 担当者名</label>
            <p className="mt-1 text-gray-900">{formData.contactPerson || "未設定"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">3. 連絡先電話番号</label>
            <p className="mt-1 text-gray-900">{formData.phone || "未設定"}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">4. メールアドレス</label>
          <p className="mt-1 text-gray-900">{formData.email || "未設定"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">5. 出店希望月</label>
          <p className="mt-1 text-gray-900">
            {displayArray(formData.participationMonths?.map((m: number) => `${m}月`))}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">6. 出店プラン</label>
          <p className="mt-1 text-gray-900">
            {formData.participationPlan === "1month" && "1ヶ月"}
            {formData.participationPlan === "6months" && "6ヶ月"}
            {formData.participationPlan === "1year" && "1年間"}
            {!formData.participationPlan && "未設定"}
          </p>
        </div>
      </div>

      {/* ワークショップ・体験内容 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">ワークショップ・体験内容</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">7. 体験・ワークショップ内容</label>
          <p className="mt-1 text-gray-900 whitespace-pre-wrap">{formData.workshopContent || "未設定"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">8. 参加費・料金</label>
          <p className="mt-1 text-gray-900">{formData.participationFee || "未設定"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">9. 所要時間</label>
          <p className="mt-1 text-gray-900">{formData.duration || "未設定"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">10. 定員・制限事項</label>
          <p className="mt-1 text-gray-900 whitespace-pre-wrap">{formData.capacity || "未設定"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">11. 必要スペース</label>
          <p className="mt-1 text-gray-900">{formData.requiredSpace || "未設定"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">12. PR文・アピールポイント</label>
          <p className="mt-1 text-gray-900 whitespace-pre-wrap">{formData.salesDescription || "未設定"}</p>
        </div>
      </div>

      {/* 書類・確認項目 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">書類・確認項目</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">13. 出店規約・注意事項</label>
          <p className="mt-1 text-gray-900">
            {formData.agreementCheck ? "✓ 同意済み" : "未同意"}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">会社名・団体名</label>
            <p className="mt-1 text-gray-900">{formData.companyName || "未設定"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">代表者氏名</label>
            <p className="mt-1 text-gray-900">{formData.representativeName || "未設定"}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">住所</label>
          <p className="mt-1 text-gray-900">{formData.companyAddress || "未設定"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">14. ブース写真・活動写真</label>
          <p className="mt-1 text-sm text-gray-500">
            {formData.boothPhotos && formData.boothPhotos.length > 0
              ? `${formData.boothPhotos.length}点アップロード済み`
              : "未アップロード"}
          </p>
        </div>
      </div>

      {/* その他 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">その他</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">15. SNSリンク</label>
          <p className="mt-1 text-gray-900 whitespace-pre-wrap">{formData.snsLinks || "未設定"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">16. 備考欄</label>
          <p className="mt-1 text-gray-900 whitespace-pre-wrap">{formData.remarks || "未設定"}</p>
        </div>
      </div>
    </div>
  );
}
