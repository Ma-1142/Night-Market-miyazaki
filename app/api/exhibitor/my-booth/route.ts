import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET: 自分の割り当てられたブースIDを取得
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // ユーザーの店舗を取得
    const shops = await prisma.shop.findMany({
      where: { userId: session.user.id },
      include: {
        forms: {
          where: { status: "approved" },
          include: {
            events: {
              include: {
                layoutAssignment: {
                  include: {
                    layoutMap: true
                  }
                }
              }
            }
          }
        }
      }
    });

    // 公開済みのブース割り当てのみをフィルタリング
    const myBooths = shops.flatMap(shop =>
      shop.forms.flatMap(form =>
        form.events
          .filter(event =>
            event.layoutAssignment &&
            event.layoutAssignment.layoutMap.isPublished
          )
          .map(event => ({
            eventId: event.id,
            eventDate: event.date,
            boothId: event.layoutAssignment!.boothId,
            layoutMapId: event.layoutAssignment!.layoutMapId,
            imageUrl: event.layoutAssignment!.layoutMap.imageUrl,
            shopName: shop.name
          }))
      )
    );

    return NextResponse.json(myBooths);
  } catch (error) {
    console.error("Error fetching my booth:", error);
    return NextResponse.json(
      { error: "Failed to fetch booth assignment" },
      { status: 500 }
    );
  }
}
