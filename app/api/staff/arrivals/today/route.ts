import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user.role !== "STAFF" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get today's date (start and end)
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    // Get URL search params for filtering
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status"); // "pending", "checked_in", "confirmed", "all"
    const searchQuery = searchParams.get("search");

    // Find all events for today with approved applications
    const todayEvents = await prisma.event.findMany({
      where: {
        date: {
          gte: todayStart,
          lt: todayEnd,
        },
        form: {
          status: "approved",
        },
      },
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
    });

    // Get or create arrival records for all events
    const arrivals = await Promise.all(
      todayEvents.map(async (event) => {
        const formData = event.form.data as any;
        const shopName = formData.shopName || formData.brandName || formData.boothName || event.form.shop.name;

        // Get booth assignment if exists
        const boothAssignment = await prisma.boothAssignment.findUnique({
          where: {
            formId: event.formId,
          },
        });

        // Get or create arrival record
        let arrival = await prisma.arrival.findUnique({
          where: {
            formId_eventDate: {
              formId: event.formId,
              eventDate: event.date,
            },
          },
        });

        // If no arrival record exists, create one
        if (!arrival) {
          arrival = await prisma.arrival.create({
            data: {
              formId: event.formId,
              eventDate: event.date,
            },
          });
        }

        // Determine status
        let status: "pending" | "checked_in" | "confirmed";
        if (arrival.staffConfirmed) {
          status = "confirmed";
        } else if (arrival.vendorCheckedIn) {
          status = "checked_in";
        } else {
          status = "pending";
        }

        return {
          id: arrival.id,
          formId: event.formId,
          eventId: event.id,
          shopName,
          formType: formData.formType,
          boothId: boothAssignment?.boothId || null,
          userEmail: event.form.shop.user.email,
          userPhone: event.form.shop.user.phone,
          startTime: event.startTime,
          endTime: event.endTime,
          status,
          vendorCheckedIn: arrival.vendorCheckedIn,
          vendorCheckedInAt: arrival.vendorCheckedInAt,
          staffConfirmed: arrival.staffConfirmed,
          staffConfirmedAt: arrival.staffConfirmedAt,
          staffConfirmedBy: arrival.staffConfirmedBy,
          notes: arrival.notes,
        };
      })
    );

    // Apply filters
    let filteredArrivals = arrivals;

    // Status filter
    if (statusFilter && statusFilter !== "all") {
      filteredArrivals = filteredArrivals.filter((a) => a.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredArrivals = filteredArrivals.filter(
        (a) =>
          a.shopName.toLowerCase().includes(query) ||
          a.userEmail.toLowerCase().includes(query) ||
          (a.boothId && a.boothId.toLowerCase().includes(query))
      );
    }

    // Sort by status priority (checked_in first, then pending, then confirmed)
    filteredArrivals.sort((a, b) => {
      const statusOrder = { checked_in: 0, pending: 1, confirmed: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    });

    return NextResponse.json({
      arrivals: filteredArrivals,
      totalCount: filteredArrivals.length,
    });
  } catch (error) {
    console.error("Error fetching today's arrivals:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
