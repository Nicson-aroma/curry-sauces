import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="page-shell">
      <section className="mx-auto mt-14 max-w-3xl px-4 lg:px-6">
        <div className="rounded-[34px] border border-[color:var(--theme-border)] bg-[linear-gradient(135deg,#1D5E34,#2E7D32,#7FB54A)] p-8 text-white shadow-[0_24px_60px_rgba(0,0,0,0.16)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/72">Payment complete</p>
          <h1 className="mt-5 text-5xl font-semibold">Your order request has been received.</h1>
          <p className="mt-5 text-base leading-8 text-white/82">
            Stripe returned successfully. If you want, the next step can be webhook-backed order handling and basket clearing after confirmed payment.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="primary-button bg-white text-[#1D5E34]">Return to shop</Link>
            <Link href="/cart" className="secondary-button border-white/24 bg-white/12 text-white">View basket</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
