import { NextResponse } from "next/server";

import { authenticateStaffUser } from "../../../../lib/staff-store-server";

export async function POST(request) {
  try {
    const payload = await request.json();
    const user = await authenticateStaffUser(payload ?? {});
    return NextResponse.json({ user });
  } catch (error) {
    const status = error.message === "Your account is waiting for admin approval." ? 403 : 401;
    return NextResponse.json(
      { error: error.message || "Unable to sign in." },
      { status }
    );
  }
}
