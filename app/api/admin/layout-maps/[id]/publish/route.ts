import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// POST: 配置図の公開設定
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
    const body = await request.json();
    const { publishAt } = body;

    if (!publishAt) {
      return NextResponse.json(
        { error: "公開日時を指定してください" },
        { status: 400 }
      );
    }

    const publishDate = new Date(publishAt);
    const now = new Date();

    // 指定された日時が現在より前または現在の場合、すぐに公開
    const isPublished = publishDate <= now;

    const layoutMap = await prisma.layoutMap.update({
      where: { id },
      data: {
        isPublished,
        publishAt: publishDate,
      }
    });

    return NextResponse.json({
      message: isPublished
        ? "配置図を公開しました"
        : "公開予約を設定しました",
      layoutMap
    });
  } catch (error) {
    console.error("Error publishing layout map:", error);
    return NextResponse.json(
      { error: "公開設定に失敗しました" },
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
