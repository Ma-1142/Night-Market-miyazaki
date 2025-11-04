import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET: グローバル配置図を取得（ベンダー用）
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "USER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get global layout settings
    const settings = await prisma.layoutSettings.findFirst();

    // Only return data if published
    if (!settings?.isPublished) {
      return NextResponse.json({
        isPublished: false,
        message: "配置図はまだ公開されていません"
      });
    }

    // Get all booth assignments
    const assignments = await prisma.boothAssignment.findMany({
      orderBy: { boothId: "asc" }
    });

    // Fetch form and shop data for each assignment
    const assignmentsWithDetails = await Promise.all(
      assignments.map(async (assignment) => {
        const form = await prisma.form.findUnique({
          where: { id: assignment.formId },
          include: { shop: true }
        });
        return {
          ...assignment,
          form
        };
      })
    );

    // Get the current user's booth assignment
    const userShops = await prisma.shop.findMany({
      where: { userId: session.user.id as string },
      include: {
        forms: {
          where: { status: "approved" },
          include: {
            boothAssignment: true
          }
        }
      }
    });

    // Find user's booth assignment
    let userBoothId: string | null = null;
    for (const shop of userShops) {
      for (const form of shop.forms) {
        if (form.boothAssignment) {
          userBoothId = form.boothAssignment.boothId;
          break;
        }
      }
      if (userBoothId) break;
    }

    return NextResponse.json({
      isPublished: true,
      settings,
      assignments: assignmentsWithDetails,
      userBoothId
    });
  } catch (error) {
    console.error("Error fetching layout for user:", error);
    return NextResponse.json(
      { error: "Failed to fetch layout" },
      { status: 500 }
    );
  }
}
