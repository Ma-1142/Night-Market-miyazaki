import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET: 公開済み配置図一覧を取得（スタッフ用）
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== "STAFF" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const layoutMaps = await prisma.layoutMap.findMany({
      where: { isPublished: true },
      include: {
        assignments: {
          include: {
            event: {
              include: {
                form: {
                  include: {
                    shop: true
                  }
                }
              }
            }
          },
          orderBy: { boothId: "asc" }
        },
        event: true
      },
      orderBy: { publishAt: "desc" }
    });

    return NextResponse.json(layoutMaps);
  } catch (error) {
    console.error("Error fetching layout maps for staff:", error);
    return NextResponse.json(
      { error: "Failed to fetch layout maps" },
      { status: 500 }
    );
  }
}
