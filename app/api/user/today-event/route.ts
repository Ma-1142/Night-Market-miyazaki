import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session || session.user.role !== "USER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get today's date (start and end)
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    // Find user's events for today
    const todayEvents = await prisma.event.findMany({
      where: {
        date: {
          gte: todayStart,
          lt: todayEnd,
        },
        form: {
          shop: {
            userId: session.user.id as string,
          },
          status: "approved", // Only show for approved applications
        },
      },
      include: {
        form: {
          include: {
            shop: true,
          },
        },
      },
    });

    if (todayEvents.length === 0) {
      return NextResponse.json({ hasEvent: false, event: null });
    }

    // Get the first event (assuming one event per day)
    const event = todayEvents[0];
    const formData = event.form.data as any;

    // Get booth assignment if exists
    const boothAssignment = await prisma.boothAssignment.findUnique({
      where: {
        formId: event.formId,
      },
    });

    // Get or create arrival record for today
    const arrival = await prisma.arrival.findUnique({
      where: {
        formId_eventDate: {
          formId: event.formId,
          eventDate: event.date,
        },
      },
    });

    // If no arrival record exists, create one
    if (!arrival) {
      await prisma.arrival.create({
        data: {
          formId: event.formId,
          eventDate: event.date,
        },
      });
    }

    return NextResponse.json({
      hasEvent: true,
      event: {
        id: event.id,
        formId: event.formId,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        shopName: formData.shopName || formData.brandName || formData.boothName || event.form.shop.name,
        formType: formData.formType,
        boothId: boothAssignment?.boothId || null,
        arrival: arrival || {
          vendorCheckedIn: false,
          vendorCheckedInAt: null,
          staffConfirmed: false,
          staffConfirmedAt: null,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching today's event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
