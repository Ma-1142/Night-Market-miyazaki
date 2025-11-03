import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "USER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { formId, eventDate } = body;

    if (!formId || !eventDate) {
      return NextResponse.json(
        { error: "Missing formId or eventDate" },
        { status: 400 }
      );
    }

    // Verify this form belongs to the user
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        shop: true,
      },
    });

    if (!form || form.shop.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update or create arrival record
    const arrival = await prisma.arrival.upsert({
      where: {
        formId_eventDate: {
          formId,
          eventDate: new Date(eventDate),
        },
      },
      update: {
        vendorCheckedIn: true,
        vendorCheckedInAt: new Date(),
      },
      create: {
        formId,
        eventDate: new Date(eventDate),
        vendorCheckedIn: true,
        vendorCheckedInAt: new Date(),
      },
    });

    // TODO: Send real-time notification to staff/admin
    // This would typically use WebSocket or Server-Sent Events
    // For now, we'll rely on polling or manual refresh

    return NextResponse.json({
      success: true,
      arrival,
    });
  } catch (error) {
    console.error("Error checking in vendor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
