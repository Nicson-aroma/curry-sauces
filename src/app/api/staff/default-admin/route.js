import { NextResponse } from "next/server";

import { getDefaultAdminUser } from "../../../../lib/staff-store-server";

export async function POST() {
  try {
    const user = await getDefaultAdminUser();
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to load the default admin account." },
      { status: 500 }
    );
  }
}
