"use client";

export async function subscribeEmail({ email, source }) {
  const response = await fetch("/api/subscribers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, source }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Unable to subscribe right now.");
  }

  return payload.subscriber;
}
