import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET: 配置図一覧取得
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const layoutMaps = await prisma.layoutMap.findMany({
      include: {
        _count: {
          select: { assignments: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(layoutMaps);
  } catch (error) {
    console.error("Error fetching layout maps:", error);
    return NextResponse.json(
      { error: "Failed to fetch layout maps" },
      { status: 500 }
    );
  }
}

// POST: 新規配置図作成
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const layoutMap = await prisma.layoutMap.create({
      data: {
        imageUrl: null,
        publishAt: null,
        isPublished: false
      }
    });

    return NextResponse.json(layoutMap, { status: 201 });
  } catch (error) {
    console.error("Error creating layout map:", error);
    return NextResponse.json(
      { error: "Failed to create layout map" },
      { status: 500 }
    );
  }
}
