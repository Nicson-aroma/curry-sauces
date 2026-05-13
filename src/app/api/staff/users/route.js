import { NextResponse } from "next/server";

import { createStaffUser } from "../../../../lib/staff-store-server";

export async function POST(request) {
  try {
    const payload = await request.json();
    const user = await createStaffUser(payload ?? {});
    return NextResponse.json({ user });
  } catch (error) {
    const status =
      error.message === "A user with that email already exists."
        ? 409
        : error.message === "Invalid staff role." ||
            error.message === "Please enter a valid email address." ||
            error.message === "Name is required." ||
            error.message === "Password is required."
          ? 400
          : 500;

    return NextResponse.json({ error: error.message || "Unable to create user." }, { status });
  }
}
