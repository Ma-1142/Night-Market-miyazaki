import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ブースID生成関数: A01～D40
function generateBoothId(index: number): string {
  const groups = ["A", "B", "C", "D"];
  const groupIndex = Math.floor(index / 40);
  const boothNumber = (index % 40) + 1;

  if (groupIndex >= groups.length) {
    throw new Error("Too many exhibitors to assign");
  }

  return `${groups[groupIndex]}${boothNumber.toString().padStart(2, "0")}`;
}

// POST: 自動割り振り実行
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id: layoutMapId } = await params;

    // 配置図が存在するか確認
    const layoutMap = await prisma.layoutMap.findUnique({
      where: { id: layoutMapId },
      include: { event: true }
    });

    if (!layoutMap) {
      return NextResponse.json(
        { error: "Layout map not found" },
        { status: 404 }
      );
    }

    // 承認済みの出店者を取得（イベントに紐付いているフォーム）
    const approvedForms = await prisma.form.findMany({
      where: {
        status: "approved",
        events: {
          some: {}
        }
      },
      include: {
        events: true,
        shop: true
      }
    });

    if (approvedForms.length === 0) {
      return NextResponse.json(
        { error: "No approved exhibitors found" },
        { status: 400 }
      );
    }

    if (approvedForms.length > 160) {
      return NextResponse.json(
        { error: "Too many exhibitors. Maximum 160 booths (A01-D40)" },
        { status: 400 }
      );
    }

    // 既存の割り当てを削除
    await prisma.layoutAssignment.deleteMany({
      where: { layoutMapId }
    });

    // 新しい割り当てを作成
    const assignments = approvedForms.flatMap((form, formIndex) => {
      return form.events.map((event, eventIndex) => {
        const boothId = generateBoothId(formIndex * form.events.length + eventIndex);
        return {
          layoutMapId,
          eventId: event.id,
          boothId
        };
      });
    });

    // 一括作成
    const createdAssignments = await prisma.layoutAssignment.createMany({
      data: assignments
    });

    // 作成された割り当てを取得して返す
    const result = await prisma.layoutAssignment.findMany({
      where: { layoutMapId },
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
      }
    });

    return NextResponse.json({
      message: "Auto-assignment completed successfully",
      assignedCount: createdAssignments.count,
      assignments: result
    });
  } catch (error) {
    console.error("Error in auto-assignment:", error);
    return NextResponse.json(
      { error: "Failed to auto-assign booths" },
      { status: 500 }
    );
  }
}
