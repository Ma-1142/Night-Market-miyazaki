import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe/client";
import { getPrice, BOOTH_TYPE_LABELS, PLAN_LABELS } from "@/lib/stripe/pricing";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { formId } = await request.json();

    if (!formId) {
      return NextResponse.json({ error: "Form ID is required" }, { status: 400 });
    }

    // Get form and verify ownership
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        shop: true,
        payment: true,
      },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (form.shop.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (form.status !== "awaiting_payment") {
      return NextResponse.json(
        { error: "Form is not awaiting payment" },
        { status: 400 }
      );
    }

    // Extract booth type and plan from form data
    const formData = form.data as Record<string, unknown>;
    const boothType = formData.boothType as string;
    const participationPlan = formData.participationPlan as string;

    if (!boothType || !participationPlan) {
      return NextResponse.json(
        { error: "Booth type or participation plan not found" },
        { status: 400 }
      );
    }

    const price = getPrice(boothType, participationPlan);
    if (!price) {
      return NextResponse.json(
        { error: "Invalid pricing combination" },
        { status: 400 }
      );
    }

    // Create or update payment record
    let payment = form.payment;
    if (!payment) {
      payment = await prisma.payment.create({
        data: {
          formId: form.id,
          amount: price,
          boothType,
          participationPlan,
          status: "pending",
        },
      });
    }

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: `${BOOTH_TYPE_LABELS[boothType] || boothType} - ${PLAN_LABELS[participationPlan] || participationPlan}`,
              description: `Night Market Miyazaki 出店料金`,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/user/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/user?payment=cancelled`,
      metadata: {
        formId: form.id,
        paymentId: payment.id,
        userId: session.user.id,
      },
      customer_email: formData.email as string | undefined,
    });

    // Update payment with session ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: { stripeSessionId: checkoutSession.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
