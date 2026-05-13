import { NextResponse } from "next/server";
import Stripe from "stripe";

import { finalizeOrderBySession } from "../../../../lib/staff-store-server";

export async function POST(request) {
  try {
    const payload = await request.json();

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe secret key is missing. Add STRIPE_SECRET_KEY to finalize orders." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(payload?.sessionId);
    const order = await finalizeOrderBySession(payload?.sessionId, {
      email: session.customer_details?.email || session.customer_email || null,
      name:
        session.customer_details?.name ||
        session.customer_details?.individual_name ||
        null,
      address: session.customer_details?.address || null,
      paymentStatus: session.payment_status || "paid",
    });

    return NextResponse.json({ order });
  } catch (error) {
    const status = error.message === "Missing Stripe session ID." ? 400 : 500;
    return NextResponse.json(
      { error: error.message || "Unable to finalize order." },
      { status }
    );
  }
}
