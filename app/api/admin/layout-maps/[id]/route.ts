import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET: 配置図詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const layoutMap = await prisma.layoutMap.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            form: {
              include: {
                shop: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
          orderBy: {
            boothId: "asc",
          },
        },
      },
    });

    if (!layoutMap) {
      return NextResponse.json(
        { error: "Layout map not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(layoutMap);
  } catch (error) {
    console.error("Error fetching layout map:", error);
    return NextResponse.json(
      { error: "Failed to fetch layout map" },
      { status: 500 }
    );
  }
}

// PUT: 配置図更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { imageUrl, publishAt, isPublished } = body;

    const layoutMap = await prisma.layoutMap.update({
      where: { id },
      data: {
        imageUrl,
        publishAt: publishAt ? new Date(publishAt) : null,
        isPublished
      }
    });

    return NextResponse.json(layoutMap);
  } catch (error) {
    console.error("Error updating layout map:", error);
    return NextResponse.json(
      { error: "Failed to update layout map" },
      { status: 500 }
    );
  }
}

// DELETE: 配置図削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.layoutMap.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Layout map deleted successfully" });
  } catch (error) {
    console.error("Error deleting layout map:", error);
    return NextResponse.json(
      { error: "Failed to delete layout map" },
      { status: 500 }
    );
  }
}
