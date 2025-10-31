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
    const { formId, date, startTime, endTime } = body;

    if (!formId || !date) {
      return NextResponse.json(
        { error: "formId and date are required" },
        { status: 400 }
      );
    }

    // Verify the form belongs to the user
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        shop: true,
      },
    });

    if (!form || form.shop.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Verify the form is approved
    if (form.status !== "approved") {
      return NextResponse.json(
        { error: "Form must be approved to add events" },
        { status: 400 }
      );
    }

    // Create the event
    const event = await prisma.event.create({
      data: {
        formId,
        date: new Date(date),
        startTime,
        endTime,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
