import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await prisma.form.findUnique({
      where: { id },
      include: {
        shop: true,
        payment: true,
      },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Check if user owns this form or is admin/staff
    const isOwner = form.shop.userId === session.user.id;
    const isAdminOrStaff = session.user.role === "ADMIN" || session.user.role === "STAFF";

    if (!isOwner && !isAdminOrStaff) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract relevant data from form.data JSON
    const formData = form.data as Record<string, unknown>;

    return NextResponse.json({
      id: form.id,
      status: form.status,
      shopName: formData.shopName || formData.storeName,
      boothType: formData.boothType,
      participationPlan: formData.participationPlan,
      email: formData.email,
      formType: formData.formType,
      createdAt: form.createdAt,
      payment: form.payment,
    });
  } catch (error) {
    console.error("Error fetching form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
