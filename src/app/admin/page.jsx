"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useStaff } from "../../components/staff-provider";
import { DEFAULT_ADMIN, STAFF_ROLES } from "../../lib/staff-storage";

const statusOptions = ["new", "processing", "ready", "completed", "cancelled"];

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount || 0);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const {
    currentUser,
    users,
    orders,
    isReady,
    canAccessDashboard,
    signOut,
    useDefaultAdmin,
    changeUserRole,
    changeOrderStatus,
  } = useStaff();

  useEffect(() => {
    if (isReady && currentUser && !canAccessDashboard) {
      router.replace("/manager/sign-in");
    }
  }, [canAccessDashboard, currentUser, isReady, router]);

  if (!isReady) {
    return (
      <main className="min-h-screen bg-[#120d0a] px-4 py-12 text-white">
        <section className="mx-auto max-w-4xl rounded-[34px] border border-white/10 bg-white/6 p-10">
          Loading staff dashboard...
        </section>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#120d0a,#311b12_45%,#fff7ea_100%)] px-4 py-10">
        <section className="mx-auto max-w-3xl rounded-[40px] border border-white/10 bg-white/94 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.18)] md:p-10">
          <p className="section-eyebrow">Admin panel</p>
          <h1 className="mt-4 text-4xl font-semibold">Staff dashboard</h1>
          <p className="mt-5 text-base leading-8 text-[color:var(--theme-muted)]">
            This admin panel is hidden from the public navigation. Use the default admin account or sign in with an approved manager account.
          </p>
          <div className="mt-8 rounded-[28px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)]/72 p-6">
            <p className="font-semibold text-[color:var(--theme-primary)]">Seeded admin account</p>
            <p className="mt-3 text-sm leading-7">
              Email: <span className="font-semibold">{DEFAULT_ADMIN.email}</span>
              <br />
              Password: <span className="font-semibold">{DEFAULT_ADMIN.password}</span>
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={useDefaultAdmin} className="primary-button">
                Enter as admin
              </button>
              <Link href="/manager/sign-in" className="secondary-button">
                Manager sign in
              </Link>
              <Link href="/manager/sign-up" className="secondary-button">
                Manager sign up
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!canAccessDashboard) {
    return null;
  }

  const pendingUsers = users.filter((user) => user.role === STAFF_ROLES.PENDING).length;
  const activeManagers = users.filter((user) => user.role === STAFF_ROLES.MANAGER).length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(245,166,35,0.18),transparent_24%),linear-gradient(180deg,#1a120e,#2b1710_38%,#fff7ea_100%)] px-4 py-8">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[36px] border border-white/10 bg-white/96 p-6 shadow-[0_26px_80px_rgba(0,0,0,0.22)] md:p-8">
          <div className="flex flex-col gap-4 border-b border-[color:var(--theme-border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="section-eyebrow">Hidden staff workspace</p>
              <h1 className="mt-3 text-4xl font-semibold">Order management dashboard</h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[color:var(--theme-muted)]">
                Admins can approve staff accounts and managers can update order statuses. No sign in or sign up links were added to the public site navigation.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-4 py-2 text-sm font-semibold">
                {currentUser.name} • {currentUser.role}
              </div>
              <button type="button" onClick={signOut} className="secondary-button">
                Sign out
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-[28px] border border-[color:var(--theme-border)] bg-[linear-gradient(135deg,#8B1E1E,#C34D22)] p-6 text-white">
              <p className="text-sm uppercase tracking-[0.24em] text-white/74">Total orders</p>
              <p className="mt-4 text-4xl font-semibold">{orders.length}</p>
            </article>
            <article className="rounded-[28px] border border-[color:var(--theme-border)] bg-white p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-[color:var(--theme-muted)]">Pending staff</p>
              <p className="mt-4 text-4xl font-semibold">{pendingUsers}</p>
            </article>
            <article className="rounded-[28px] border border-[color:var(--theme-border)] bg-white p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-[color:var(--theme-muted)]">Active managers</p>
              <p className="mt-4 text-4xl font-semibold">{activeManagers}</p>
            </article>
            <article className="rounded-[28px] border border-[color:var(--theme-border)] bg-white p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-[color:var(--theme-muted)]">Tracked revenue</p>
              <p className="mt-4 text-4xl font-semibold">{formatCurrency(totalRevenue)}</p>
            </article>
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[1.4fr_0.9fr]">
            <section className="rounded-[32px] border border-[color:var(--theme-border)] bg-white/86 p-6 shadow-[0_18px_46px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="section-eyebrow">Orders</p>
                  <h2 className="mt-2 text-3xl font-semibold">Manage customer orders</h2>
                </div>
                <Link href="/shop" className="secondary-button">
                  View storefront
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {orders.map((order) => (
                  <article key={order.id} className="rounded-[26px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)]/52 p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--theme-muted)]">
                          {order.id}
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold">{order.customerName}</h3>
                        <p className="mt-2 text-sm text-[color:var(--theme-muted)]">
                          {order.customerEmail} • {formatDate(order.createdAt)}
                        </p>
                        <p className="mt-3 text-sm leading-7 text-[color:var(--theme-foreground)]">
                          {order.items.map((item) => `${item.name} x${item.quantity}`).join(", ")}
                        </p>
                      </div>
                      <div className="flex min-w-[220px] flex-col gap-3">
                        <div className="rounded-[22px] bg-white/86 px-4 py-3 text-sm">
                          <p className="font-semibold">Payment: {order.paymentStatus}</p>
                          <p className="mt-1">Total: {formatCurrency(order.totalAmount)}</p>
                          <p className="mt-1">Items: {order.totalItems}</p>
                        </div>
                        <label className="field-shell text-sm">
                          Order status
                          <select
                            className="field-input"
                            value={order.status}
                            onChange={(event) => changeOrderStatus(order.id, event.target.value)}
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="space-y-8">
              <article className="rounded-[32px] border border-[color:var(--theme-border)] bg-white/88 p-6 shadow-[0_18px_46px_rgba(0,0,0,0.06)]">
                <p className="section-eyebrow">Staff approvals</p>
                <h2 className="mt-2 text-3xl font-semibold">Manage user roles</h2>
                <div className="mt-6 space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="rounded-[24px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)]/56 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-semibold">{user.name}</p>
                          <p className="mt-1 text-sm text-[color:var(--theme-muted)]">{user.email}</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--theme-primary)]">
                          {user.role}
                        </span>
                      </div>
                      {currentUser.role === STAFF_ROLES.ADMIN ? (
                        <label className="field-shell mt-4 text-sm">
                          Change role
                          <select
                            className="field-input"
                            value={user.role}
                            onChange={(event) => changeUserRole(user.id, event.target.value)}
                            disabled={user.email === DEFAULT_ADMIN.email}
                          >
                            <option value={STAFF_ROLES.PENDING}>pending</option>
                            <option value={STAFF_ROLES.MANAGER}>manager</option>
                            <option value={STAFF_ROLES.ADMIN}>admin</option>
                          </select>
                        </label>
                      ) : (
                        <p className="mt-4 text-sm text-[color:var(--theme-muted)]">
                          Only admins can change staff roles.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[32px] border border-[color:var(--theme-border)] bg-[linear-gradient(135deg,#1D5E34,#2E7D32,#7FB54A)] p-6 text-white shadow-[0_18px_46px_rgba(0,0,0,0.12)]">
                <p className="text-sm uppercase tracking-[0.24em] text-white/76">Workflow</p>
                <h2 className="mt-2 text-3xl font-semibold">How staff access works</h2>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-white/84">
                  <li>Managers create an account on the hidden sign-up page.</li>
                  <li>New accounts start as pending and cannot view orders yet.</li>
                  <li>An admin changes the role to manager or admin from this dashboard.</li>
                  <li>Approved staff then sign in and can manage order statuses.</li>
                </ul>
              </article>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
