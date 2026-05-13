import { NextResponse } from "next/server";

import { createSubscriber } from "../../../lib/staff-store-server";

export async function POST(request) {
  try {
    const payload = await request.json();
    const subscriber = await createSubscriber(payload ?? {});
    return NextResponse.json({ subscriber });
  } catch (error) {
    const status =
      error.message === "Please enter a valid email address."
        ? 400
        : error.message === "This email is already subscribed."
          ? 409
          : 500;

    return NextResponse.json(
      { error: error.message || "Unable to subscribe right now." },
      { status }
    );
  }
}
