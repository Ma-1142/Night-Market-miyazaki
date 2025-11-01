import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import FormDetailView from "@/components/FormDetailView";
import StatusUpdater from "@/components/StatusUpdater";

export default async function AdminFormDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  if (!session) {
    redirect("/login/admin");
  }

  if (session.user.role !== "ADMIN") {
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
    },
  });

  if (!form) {
    notFound();
  }

  const formData = form.data as any;

  // Helper function to get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "受理", color: "bg-yellow-100 text-yellow-800" };
      case "reviewing":
        return { label: "審査中", color: "bg-blue-100 text-blue-800" };
      case "conditional":
        return { label: "条件提示", color: "bg-orange-100 text-orange-800" };
      case "approved":
        return { label: "確定", color: "bg-green-100 text-green-800" };
      case "rejected":
        return { label: "却下", color: "bg-red-100 text-red-800" };
      default:
        return { label: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  const statusInfo = getStatusLabel(form.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="p-8 pl-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <Link
              href="/dashboard/admin/applications"
              className="text-blue-600 hover:underline mb-2 inline-block"
            >
              ← 応募管理に戻る
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">申込詳細</h1>
                <p className="mt-2 text-gray-600">
                  出店者: {form.shop.user.name || form.shop.user.email}
                </p>
                <p className="text-sm text-gray-500">
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

          <div className="mt-6">
            <StatusUpdater
              formId={form.id}
              currentStatus={form.status}
              currentAdminNotes={form.adminNotes}
            />
          </div>

          <div className="mt-6 flex gap-4">
            <Link
              href="/dashboard/admin/applications"
              className="inline-block rounded-md bg-gray-600 px-6 py-2 text-white hover:bg-gray-700"
            >
              応募管理に戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
