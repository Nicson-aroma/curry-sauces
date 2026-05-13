import { NextResponse } from "next/server";

import { deleteOrder, updateOrder } from "../../../../../lib/staff-store-server";

export async function PATCH(request, { params }) {
  try {
    const payload = await request.json();
    const { orderId } = await params;
    const orders = await updateOrder(orderId, payload ?? {});
    return NextResponse.json({ orders });
  } catch (error) {
    const status =
      error.message === "Order not found."
        ? 404
        : error.message === "Customer name is required." ||
            error.message === "Please enter a valid email address." ||
            error.message === "Invalid order status." ||
            error.message === "At least one valid order item is required."
          ? 400
          : 500;

    return NextResponse.json({ error: error.message || "Unable to update order." }, { status });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { orderId } = await params;
    const orders = await deleteOrder(orderId);
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to delete order." }, { status: 500 });
  }
}
