"use client";

import { useState } from "react";

import { Button } from "./ui/button";

export default function CheckoutButton({ items, disabled }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleCheckout() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to start checkout.");
      }

      if (!payload.url) {
        throw new Error("Stripe checkout URL was not returned.");
      }

      window.location.href = payload.url;
    } catch (error) {
      setErrorMessage(error.message || "Checkout failed.");
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="default"
        className="w-full"
        onClick={handleCheckout}
        disabled={disabled || isLoading}
      >
        {isLoading ? "Redirecting to Stripe..." : "Pay With Stripe"}
      </Button>
      {errorMessage ? <p className="text-sm text-error">{errorMessage}</p> : null}
    </div>
  );
}
