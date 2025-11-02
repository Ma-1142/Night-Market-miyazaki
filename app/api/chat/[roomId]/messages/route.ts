import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const session = await auth();
    const { roomId } = await params;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user has access to this chat room
    const chatRoom = await prisma.chatRoom.findUnique({
      where: { id: roomId },
    });

    if (!chatRoom) {
      return NextResponse.json({ error: "Chat room not found" }, { status: 404 });
    }

    // Check access permissions
    const userRole = session.user.role;
    if (userRole !== "ADMIN" && chatRoom.type !== userRole) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch messages
    const messages = await prisma.message.findMany({
      where: { chatRoomId: roomId },
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
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const session = await auth();
    const { roomId } = await params;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await request.json();

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // Verify user has access to this chat room
    const chatRoom = await prisma.chatRoom.findUnique({
      where: { id: roomId },
    });

    if (!chatRoom) {
      return NextResponse.json({ error: "Chat room not found" }, { status: 404 });
    }

    // ONLY ADMIN can send messages to announcement boards (ChatRooms)
    const userRole = session.user.role;
    if (userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Only administrators can post announcements" },
        { status: 403 }
      );
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        chatRoomId: roomId,
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
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
