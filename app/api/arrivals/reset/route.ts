import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // Check authentication and authorization
    if (!session?.user || (session.user.role !== "STAFF" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { arrivalId } = body;

    if (!arrivalId) {
      return NextResponse.json({ error: "Missing arrivalId" }, { status: 400 });
    }

    // Get the arrival record
    const arrival = await prisma.arrival.findUnique({
      where: { id: arrivalId },
    });

    if (!arrival) {
      return NextResponse.json({ error: "Arrival not found" }, { status: 404 });
    }

    // Reset the arrival status back to the initial state
    const updatedArrival = await prisma.arrival.update({
      where: { id: arrivalId },
      data: {
        vendorCheckedIn: false,
        vendorCheckedInAt: null,
        staffConfirmed: false,
        staffConfirmedAt: null,
        staffConfirmedBy: null,
      },
    });

    return NextResponse.json({
      success: true,
      arrival: updatedArrival,
    });
  } catch (error) {
    console.error("Error resetting arrival:", error);
    return NextResponse.json(
      { error: "Failed to reset arrival" },
      { status: 500 }
    );
  }
}
