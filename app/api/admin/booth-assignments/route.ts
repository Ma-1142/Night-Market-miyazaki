import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET: Get all booth assignments
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const assignments = await prisma.boothAssignment.findMany({
      include: {
        form: {
          include: {
            shop: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { boothId: "asc" }
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error("Error fetching booth assignments:", error);
    return NextResponse.json(
      { error: "Failed to fetch booth assignments" },
      { status: 500 }
    );
  }
}
