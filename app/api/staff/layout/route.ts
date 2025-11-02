import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET: グローバル配置図を取得（スタッフ用）
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== "STAFF" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get global layout settings
    const settings = await prisma.globalLayoutSettings.findFirst();

    // Only return data if published
    if (!settings?.isPublished) {
      return NextResponse.json({
        isPublished: false,
        message: "配置図はまだ公開されていません"
      });
    }

    // Get all booth assignments
    const assignments = await prisma.globalBoothAssignment.findMany({
      include: {
        form: {
          include: {
            shop: true
          }
        }
      },
      orderBy: { boothId: "asc" }
    });

    return NextResponse.json({
      isPublished: true,
      settings,
      assignments
    });
  } catch (error) {
    console.error("Error fetching layout for staff:", error);
    return NextResponse.json(
      { error: "Failed to fetch layout" },
      { status: 500 }
    );
  }
}
