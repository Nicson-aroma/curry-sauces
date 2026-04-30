import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="page-shell">
      <section className="mx-auto mt-14 max-w-3xl px-4 lg:px-6">
        <div className="rounded-[34px] border border-[color:var(--theme-border)] bg-[linear-gradient(135deg,#6B3C14,#A14E1B,#D98D31)] p-8 text-white shadow-[0_24px_60px_rgba(0,0,0,0.16)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/72">Checkout cancelled</p>
          <h1 className="mt-5 text-5xl font-semibold">Your basket is still waiting for you.</h1>
          <p className="mt-5 text-base leading-8 text-white/82">
            The payment flow was cancelled before completion, so no order has been placed. You can return to the basket and try again any time.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/cart" className="primary-button bg-white text-[#6B3C14]">Back to basket</Link>
            <Link href="/shop" className="secondary-button border-white/24 bg-white/12 text-white">Continue shopping</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
