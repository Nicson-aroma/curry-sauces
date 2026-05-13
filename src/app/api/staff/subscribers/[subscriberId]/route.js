import { NextResponse } from "next/server";

import {
  deleteSubscriber,
  updateSubscriber,
} from "../../../../../lib/staff-store-server";

export async function PATCH(request, { params }) {
  try {
    const payload = await request.json();
    const { subscriberId } = await params;
    const subscribers = await updateSubscriber(subscriberId, payload ?? {});
    return NextResponse.json({ subscribers });
  } catch (error) {
    const status =
      error.message === "Subscriber not found."
        ? 404
        : error.message === "Please enter a valid email address." ||
            error.message === "This email is already subscribed." ||
            error.message === "Invalid subscriber status."
          ? 400
          : 500;

    return NextResponse.json(
      { error: error.message || "Unable to update subscriber." },
      { status }
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { subscriberId } = await params;
    const subscribers = await deleteSubscriber(subscriberId);
    return NextResponse.json({ subscribers });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to delete subscriber." },
      { status: 500 }
    );
  }
}
