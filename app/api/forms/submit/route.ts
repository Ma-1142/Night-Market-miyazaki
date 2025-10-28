import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Extract shop name from different form types
    const shopName = body.shopName || body.brandName || body.contactPerson || "未設定";
    const formType = body.formType || "general"; // food, goods, workshop

    // Create or get the shop for this user
    let shop = await prisma.shop.findFirst({
      where: { userId: session.user.id as string },
    });

    if (!shop) {
      shop = await prisma.shop.create({
        data: {
          name: shopName,
          description: body.salesDescription || body.productFeatures || body.menuItems || "",
          userId: session.user.id as string,
        },
      });
    }

    // Create the form submission with all form data
    const form = await prisma.form.create({
      data: {
        shopId: shop.id,
        data: body, // Store the entire form data as JSON
        status: "pending",
      },
    });

    return NextResponse.json({ success: true, formId: form.id }, { status: 200 });
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
