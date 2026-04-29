import { NextResponse } from "next/server";
import Stripe from "stripe";

import { getProductDetails } from "../../../lib/meahs-data";
import { priceToPence } from "../../../lib/pricing";

export async function POST(request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      {
        error:
          "Stripe secret key is missing. Add STRIPE_SECRET_KEY to enable test checkout.",
      },
      { status: 500 }
    );
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid checkout payload." }, { status: 400 });
  }

  const items = Array.isArray(payload?.items) ? payload.items : [];

  if (!items.length) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const lineItems = items
    .map((item) => {
      const product = getProductDetails(item?.slug);
      const quantity = Number.parseInt(item?.quantity, 10) || 0;

      if (!product || quantity <= 0) {
        return null;
      }

      return {
        price_data: {
          currency: "gbp",
          product_data: {
            name: product.name,
            description: product.shortDescription,
            images: product.imageUrl ? [product.imageUrl] : [],
          },
          unit_amount: priceToPence(product.price),
        },
        quantity,
      };
    })
    .filter(Boolean);

  if (!lineItems.length) {
    return NextResponse.json({ error: "No valid products were found in the cart." }, { status: 400 });
  }

  const totalQuantity = lineItems.reduce((total, item) => total + item.quantity, 0);

  if (totalQuantity < 6) {
    return NextResponse.json(
      { error: "Add at least 6 sauces before going to payment." },
      { status: 400 }
    );
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin = request.headers.get("origin") || request.nextUrl.origin;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      billing_address_collection: "auto",
      line_items: lineItems,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || "Unable to create Stripe checkout session.",
      },
      { status: 500 }
    );
  }
}
