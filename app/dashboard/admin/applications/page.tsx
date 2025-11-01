import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { prisma } from "@/lib/prisma";
import ApplicationFilters from "@/components/admin/ApplicationFilters";
import ApplicationsTable from "@/components/admin/ApplicationsTable";
import { Prisma } from "@prisma/client";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
    formType?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login/admin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Await searchParams in Next.js 16
  const params = await searchParams;

  // Build where clause based on filters
  const where: Prisma.FormWhereInput = {};

  // Search across multiple fields
  if (params.search) {
    where.OR = [
      {
        shop: {
          name: {
            contains: params.search,
            mode: "insensitive" as Prisma.QueryMode,
          },
        },
      },
      {
        shop: {
          user: {
            name: {
              contains: params.search,
              mode: "insensitive" as Prisma.QueryMode,
            },
          },
        },
      },
      {
        shop: {
          user: {
            email: {
              contains: params.search,
              mode: "insensitive" as Prisma.QueryMode,
            },
          },
        },
      },
      {
        id: {
          contains: params.search,
        },
      },
    ];
  }

  // Filter by status
  if (params.status) {
    where.status = params.status;
  }

  // Filter by form type (stored in JSON data)
  if (params.formType) {
    where.data = {
      path: ["formType"],
      equals: params.formType,
    };
  }

  // Filter by date range
  if (params.dateFrom || params.dateTo) {
    where.createdAt = {};
    if (params.dateFrom) {
      where.createdAt.gte = new Date(params.dateFrom);
    }
    if (params.dateTo) {
      // Add 1 day to include the entire end date
      const endDate = new Date(params.dateTo);
      endDate.setDate(endDate.getDate() + 1);
      where.createdAt.lt = endDate;
    }
  }

  const forms = await prisma.form.findMany({
    where,
    include: {
      shop: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="p-8 pl-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">応募管理</h1>
              <p className="mt-2 text-gray-600">応募フォーム受信一覧</p>
            </div>
            <Link
              href="/api/auth/signout"
              className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              ログアウト
            </Link>
          </div>

          {/* Filters */}
          <ApplicationFilters />

          {/* Applications Table with bulk actions */}
          <ApplicationsTable forms={forms} />
        </div>
      </div>
    </div>
  );
}
