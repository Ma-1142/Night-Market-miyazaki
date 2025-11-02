import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// POST: Publish layout settings now
export async function POST() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const now = new Date();

    // Upsert to ensure settings exist
    const settings = await prisma.layoutSettings.upsert({
      where: { id: "global" },
      update: {
        isPublished: true,
        publishAt: now
      },
      create: {
        id: "global",
        isPublished: true,
        publishAt: now
      }
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error publishing layout settings:", error);
    return NextResponse.json(
      { error: "Failed to publish layout settings" },
      { status: 500 }
    );
  }
}
