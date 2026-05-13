import { NextResponse } from "next/server";

import { listOrders, listSubscribers, listUsers } from "../../../../lib/staff-store-server";

export async function GET() {
  try {
    const [users, orders, subscribers] = await Promise.all([
      listUsers(),
      listOrders(),
      listSubscribers(),
    ]);
    return NextResponse.json({ users, orders, subscribers });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to load staff data." },
      { status: 500 }
    );
  }
}
