import { NextResponse } from "next/server";

import { createManualOrder } from "../../../../lib/staff-store-server";

export async function POST(request) {
  try {
    const payload = await request.json();
    const orders = await createManualOrder(payload ?? {});
    return NextResponse.json({ orders });
  } catch (error) {
    const status =
      error.message === "Customer name is required." ||
      error.message === "Please enter a valid email address." ||
      error.message === "Invalid order status." ||
      error.message === "At least one valid order item is required."
        ? 400
        : 500;

    return NextResponse.json({ error: error.message || "Unable to create order." }, { status });
  }
}
