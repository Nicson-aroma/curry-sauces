import { NextResponse } from "next/server";

import { updateOrderStatus } from "../../../../../../lib/staff-store-server";

export async function PATCH(request, { params }) {
  try {
    const payload = await request.json();
    const { orderId } = await params;
    const orders = await updateOrderStatus(orderId, payload?.status);
    return NextResponse.json({ orders });
  } catch (error) {
    const status = error.message === "Invalid order status." ? 400 : 500;
    return NextResponse.json(
      { error: error.message || "Unable to update order status." },
      { status }
    );
  }
}
