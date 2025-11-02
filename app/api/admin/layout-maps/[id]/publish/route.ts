import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// POST: 配置図を公開
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const layoutMap = await prisma.layoutMap.update({
      where: { id },
      data: {
        isPublished: true,
        publishAt: new Date()
      }
    });

    return NextResponse.json({
      message: "Layout map published successfully",
      layoutMap
    });
  } catch (error) {
    console.error("Error publishing layout map:", error);
    return NextResponse.json(
      { error: "Failed to publish layout map" },
      { status: 500 }
    );
  }
}

// DELETE: 配置図を非公開
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
    const layoutMap = await prisma.layoutMap.update({
      where: { id },
      data: {
        isPublished: false
      }
    });

    return NextResponse.json({
      message: "Layout map unpublished successfully",
      layoutMap
    });
  } catch (error) {
    console.error("Error unpublishing layout map:", error);
    return NextResponse.json(
      { error: "Failed to unpublish layout map" },
      { status: 500 }
    );
  }
}
