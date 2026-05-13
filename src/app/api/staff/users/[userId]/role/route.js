import { NextResponse } from "next/server";

import { updateUserRole } from "../../../../../../lib/staff-store-server";

export async function PATCH(request, { params }) {
  try {
    const payload = await request.json();
    const { userId } = await params;
    const users = await updateUserRole(userId, payload?.role);
    return NextResponse.json({ users });
  } catch (error) {
    const status = error.message === "Invalid staff role." ? 400 : 500;
    return NextResponse.json(
      { error: error.message || "Unable to update user role." },
      { status }
    );
  }
}
