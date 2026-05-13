import { NextResponse } from "next/server";

import { createPendingManagerAccount } from "../../../../lib/staff-store-server";

export async function POST(request) {
  try {
    const payload = await request.json();
    const user = await createPendingManagerAccount(payload ?? {});
    return NextResponse.json({ user });
  } catch (error) {
    const status = error.message === "A user with that email already exists." ? 409 : 500;
    return NextResponse.json(
      { error: error.message || "Unable to create account." },
      { status }
    );
  }
}
