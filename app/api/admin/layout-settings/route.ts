import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET: Fetch or create global layout settings
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Try to find existing settings
    let settings = await prisma.layoutSettings.findUnique({
      where: { id: "global" }
    });

    // Create if doesn't exist
    if (!settings) {
      settings = await prisma.layoutSettings.create({
        data: {
          id: "global",
          isPublished: false
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching layout settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch layout settings" },
      { status: 500 }
    );
  }
}

// PUT: Update layout settings (publishAt timestamp)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { publishAt } = body;

    // Ensure settings exist
    await prisma.layoutSettings.upsert({
      where: { id: "global" },
      update: {
        publishAt: publishAt ? new Date(publishAt) : null
      },
      create: {
        id: "global",
        publishAt: publishAt ? new Date(publishAt) : null,
        isPublished: false
      }
    });

    const updatedSettings = await prisma.layoutSettings.findUnique({
      where: { id: "global" }
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error("Error updating layout settings:", error);
    return NextResponse.json(
      { error: "Failed to update layout settings" },
      { status: 500 }
    );
  }
}
