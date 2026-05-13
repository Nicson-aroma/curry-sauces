import { NextResponse } from "next/server";

import { createStaffSubscriber } from "../../../../lib/staff-store-server";

export async function POST(request) {
  try {
    const payload = await request.json();
    const subscriber = await createStaffSubscriber(payload ?? {});
    return NextResponse.json({ subscriber });
  } catch (error) {
    const status =
      error.message === "Please enter a valid email address." ||
      error.message === "This email is already subscribed." ||
      error.message === "Invalid subscriber status."
        ? 400
        : 500;

    return NextResponse.json(
      { error: error.message || "Unable to create subscriber." },
      { status }
    );
  }
}
