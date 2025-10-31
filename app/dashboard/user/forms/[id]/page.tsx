import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import FormDetailView from "@/components/FormDetailView";
import EventScheduler from "@/components/EventScheduler";

export default async function UserFormDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  if (!session) {
    redirect("/login/user");
  }

  if (session.user.role !== "USER") {
    redirect("/");
  }

  const form = await prisma.form.findUnique({
    where: { id },
    include: {
      shop: {
        include: {
          user: true,
        },
      },
      events: {
        orderBy: {
          date: "asc",
        },
      },
    },
  });

  if (!form) {
    notFound();
  }

  // Verify this form belongs to the logged-in user
  if (form.shop.userId !== session.user.id) {
    redirect("/dashboard/user");
  }

  const formData = form.data as any;

  // Helper function to get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "審査中", color: "bg-yellow-100 text-yellow-800" };
      case "approved":
        return { label: "承認済み", color: "bg-green-100 text-green-800" };
      case "rejected":
        return { label: "却下", color: "bg-red-100 text-red-800" };
      default:
        return { label: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  const statusInfo = getStatusLabel(form.status);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/dashboard/user"
            className="text-blue-600 hover:underline mb-2 inline-block"
          >
            ← ダッシュボードに戻る
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">申込詳細</h1>
              <p className="mt-2 text-gray-600">
                提出日: {new Date(form.createdAt).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>
          </div>
        </div>

        <FormDetailView formData={formData} form={form} />

        {form.status === "approved" && (
          <EventScheduler
            formId={form.id}
            initialEvents={form.events}
            participationMonths={formData.participationMonths || []}
          />
        )}

        <div className="mt-6">
          <Link
            href="/dashboard/user"
            className="inline-block rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            ダッシュボードに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
