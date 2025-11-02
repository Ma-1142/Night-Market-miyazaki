import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST: Send announcement to both USER and STAFF rooms
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin can send bulk announcements
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { content } = await request.json();

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // Get both chat rooms
    const rooms = await prisma.chatRoom.findMany({
      where: {
        type: {
          in: ["USER", "STAFF"],
        },
      },
    });

    if (rooms.length === 0) {
      return NextResponse.json(
        { error: "Chat rooms not found" },
        { status: 404 }
      );
    }

    // Create messages in both rooms
    const messages = await Promise.all(
      rooms.map((room) =>
        prisma.message.create({
          data: {
            chatRoomId: room.id,
            senderId: session.user.id as string,
            content: content.trim(),
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        })
      )
    );

    return NextResponse.json(
      {
        success: true,
        count: messages.length,
        messages,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending bulk announcement:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
