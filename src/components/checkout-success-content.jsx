"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useCart } from "./cart-provider";
import { finalizePendingOrder } from "../lib/staff-storage";

export default function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const [createdOrderId, setCreatedOrderId] = useState(null);

  useEffect(() => {
    const createdOrder = finalizePendingOrder(sessionId);
    if (createdOrder?.id) {
      setCreatedOrderId(createdOrder.id);
      clearCart();
    }
  }, [clearCart, sessionId]);

  return (
    <main className="page-shell">
      <section className="mx-auto mt-14 max-w-3xl px-4 lg:px-6">
        <div className="rounded-[34px] border border-[color:var(--theme-border)] bg-[linear-gradient(135deg,#1D5E34,#2E7D32,#7FB54A)] p-8 text-white shadow-[0_24px_60px_rgba(0,0,0,0.16)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/72">Payment complete</p>
          <h1 className="mt-5 text-5xl font-semibold">Your order request has been received.</h1>
          <p className="mt-5 text-base leading-8 text-white/82">
            Stripe returned successfully and the order has been added to the staff dashboard for admin and manager review.
          </p>
          {createdOrderId ? (
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.22em] text-white/84">
              Order reference: {createdOrderId}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="primary-button bg-white text-[#1D5E34]">Return to shop</Link>
            <Link href="/admin" className="secondary-button border-white/24 bg-white/12 text-white">Open staff dashboard</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
