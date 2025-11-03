import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user.role !== "STAFF" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { arrivalId, notes } = body;

    if (!arrivalId) {
      return NextResponse.json(
        { error: "Missing arrivalId" },
        { status: 400 }
      );
    }

    // Find the arrival record
    const arrival = await prisma.arrival.findUnique({
      where: { id: arrivalId },
    });

    if (!arrival) {
      return NextResponse.json(
        { error: "Arrival record not found" },
        { status: 404 }
      );
    }

    // Check if vendor has checked in
    if (!arrival.vendorCheckedIn) {
      return NextResponse.json(
        { error: "Vendor has not checked in yet" },
        { status: 400 }
      );
    }

    // Check if already confirmed
    if (arrival.staffConfirmed) {
      return NextResponse.json(
        { error: "Already confirmed" },
        { status: 400 }
      );
    }

    // Update arrival record with staff confirmation
    const updatedArrival = await prisma.arrival.update({
      where: { id: arrivalId },
      data: {
        staffConfirmed: true,
        staffConfirmedAt: new Date(),
        staffConfirmedBy: session.user.id as string,
        notes: notes || arrival.notes,
      },
    });

    // TODO: Send real-time notification to vendor
    // This would typically use WebSocket or Server-Sent Events
    // For now, the vendor's polling will pick up the change

    return NextResponse.json({
      success: true,
      arrival: updatedArrival,
    });
  } catch (error) {
    console.error("Error confirming arrival:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
