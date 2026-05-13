import { NextResponse } from "next/server";

import { deleteUser, updateUser } from "../../../../../lib/staff-store-server";

export async function PATCH(request, { params }) {
  try {
    const payload = await request.json();
    const { userId } = await params;
    const users = await updateUser(userId, payload ?? {});
    return NextResponse.json({ users });
  } catch (error) {
    const status =
      error.message === "User not found."
        ? 404
        : error.message === "A user with that email already exists." ||
            error.message === "Invalid staff role." ||
            error.message === "Please enter a valid email address." ||
            error.message === "Name is required."
          ? 400
          : 500;

    return NextResponse.json({ error: error.message || "Unable to update user." }, { status });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { userId } = await params;
    const users = await deleteUser(userId);
    return NextResponse.json({ users });
  } catch (error) {
    const status =
      error.message === "User not found."
        ? 404
        : error.message === "The default admin account cannot be deleted."
          ? 400
          : 500;

    return NextResponse.json({ error: error.message || "Unable to delete user." }, { status });
  }
}
