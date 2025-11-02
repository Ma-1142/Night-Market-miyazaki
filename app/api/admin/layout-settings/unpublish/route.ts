import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// POST: Unpublish layout settings
export async function POST() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Upsert to ensure settings exist
    const settings = await prisma.layoutSettings.upsert({
      where: { id: "global" },
      update: {
        isPublished: false
      },
      create: {
        id: "global",
        isPublished: false
      }
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error unpublishing layout settings:", error);
    return NextResponse.json(
      { error: "Failed to unpublish layout settings" },
      { status: 500 }
    );
  }
}
