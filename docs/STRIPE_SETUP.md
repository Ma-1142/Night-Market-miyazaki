# Stripe 決済設定手順

## 環境変数

`.env` に以下を設定:

```
STRIPE_SECRET_KEY=sk_live_xxxxx          # 本番キー（またはsk_test_xxxxx）
STRIPE_WEBHOOK_SECRET=whsec_xxxxx        # Webhook署名シークレット
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx  # 公開キー
```

## Webhook 設定（本番環境）

### 1. Stripe Dashboard で設定

1. [Stripe Dashboard](https://dashboard.stripe.com/webhooks) にアクセス
2. 「Add endpoint」をクリック
3. 以下を入力:
   - **Endpoint URL**: `https://your-domain.com/api/stripe/webhook`
   - **Events to send**:
     - `checkout.session.completed` （決済完了）
     - `checkout.session.expired` （セッション期限切れ）

4. 作成後、「Signing secret」をコピー
5. `.env` の `STRIPE_WEBHOOK_SECRET` に設定

### 2. サーバー再起動

環境変数を反映するためにサーバーを再起動。

## 動作確認

### 決済フロー

1. ユーザーがフォーム送信
2. 管理者が「決済待ち」ステータスに変更
3. ユーザーダッシュボードに決済バナー表示
4. 「決済する」ボタン → Stripe Checkout ページ
5. 決済完了 → Webhook で通知
6. フォームステータスが自動で「確定」に変更
7. 決済バナーが非表示になる

### テスト用カード番号

| カード番号 | 説明 |
|-----------|------|
| 4242 4242 4242 4242 | 成功 |
| 4000 0000 0000 0002 | 拒否 |
| 4000 0000 0000 3220 | 3Dセキュア |

有効期限: 将来の任意の日付
CVC: 任意の3桁

## ローカル開発（オプション）

ローカルでWebhookをテストする場合は Stripe CLI を使用:

```bash
# インストール
winget install Stripe.StripeCLI

# ログイン
stripe login

# Webhookをlocalhostに転送
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

表示される `whsec_xxxxx` を `.env` に設定。

## 関連ファイル

- `app/api/stripe/checkout/route.ts` - Checkout セッション作成
- `app/api/stripe/webhook/route.ts` - Webhook 処理
- `lib/stripe/pricing.ts` - 料金設定
- `lib/stripe/client.ts` - Stripe クライアント
- `components/PaymentBanner.tsx` - 決済バナーUI
