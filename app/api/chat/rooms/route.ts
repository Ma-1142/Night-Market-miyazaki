import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role;

    // Admin can see all chat rooms
    if (userRole === "ADMIN") {
      const chatRooms = await prisma.chatRoom.findMany({
        orderBy: { createdAt: "asc" },
      });
      return NextResponse.json(chatRooms);
    }

    // Users can only see their respective chat room
    const chatRoom = await prisma.chatRoom.findFirst({
      where: { type: userRole },
    });

    if (!chatRoom) {
      return NextResponse.json({ error: "Chat room not found" }, { status: 404 });
    }

    return NextResponse.json([chatRoom]);
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
