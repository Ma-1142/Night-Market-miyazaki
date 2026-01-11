import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BOOTH_TYPE_LABELS, PLAN_LABELS, formatPrice } from "@/lib/stripe/pricing";

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session) {
    redirect("/login/user");
  }

  if (session.user.role !== "USER") {
    redirect("/");
  }

  const { session_id } = await searchParams;

  // Get payment information if session_id is provided
  let payment = null;
  if (session_id) {
    payment = await prisma.payment.findFirst({
      where: {
        stripeSessionId: session_id,
        form: {
          shop: {
            userId: session.user.id as string,
          },
        },
      },
      include: {
        form: {
          include: {
            shop: true,
          },
        },
      },
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="rounded-lg bg-white p-8 shadow-lg text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            決済が完了しました
          </h1>
          <p className="text-gray-600 mb-6">
            出店申請が確定しました。ご登録ありがとうございます。
          </p>

          {/* Payment Details */}
          {payment && (
            <div className="mb-6 rounded-lg bg-gray-50 p-4 text-left">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">決済内容</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">店舗名</span>
                  <span className="font-medium">{payment.form.shop.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">出店形態</span>
                  <span className="font-medium">
                    {BOOTH_TYPE_LABELS[payment.boothType] || payment.boothType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">参加プラン</span>
                  <span className="font-medium">
                    {PLAN_LABELS[payment.participationPlan] || payment.participationPlan}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="text-gray-600">お支払い金額</span>
                  <span className="font-bold text-lg">{formatPrice(payment.amount)}</span>
                </div>
                {payment.paidAt && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>決済日時</span>
                    <span>
                      {new Date(payment.paidAt).toLocaleString("ja-JP", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/dashboard/user"
              className="block w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white hover:bg-blue-700 transition-colors"
            >
              ダッシュボードに戻る
            </Link>
            <p className="text-xs text-gray-500">
              出店スケジュールの管理はダッシュボードから行えます
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
