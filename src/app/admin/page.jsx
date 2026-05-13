"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";

import { useStaff } from "../../components/staff-provider";
import { DEFAULT_ADMIN, STAFF_ROLES } from "../../lib/staff-storage";

const statusOptions = ["new", "processing", "ready", "completed", "cancelled"];

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "staff", label: "Staff", icon: Users },
  { id: "workflow", label: "Workflow", icon: Settings },
];

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

function MetricCard({ label, value, helper }) {
  return (
    <article className="rounded-[22px] border border-[#dbe6ee] bg-white p-6">
      <p className="text-base font-medium text-[#34495d]">{label}</p>
      <p className="mt-5 text-5xl font-semibold tracking-[-0.05em] text-[#ff5b08]">{value}</p>
      <p className="mt-4 text-sm leading-6 text-[#7a93ab]">{helper}</p>
    </article>
  );
}

function Panel({ id, title, eyebrow, actions, children }) {
  return (
    <section
      id={id}
      className="rounded-[22px] border border-[#dbe6ee] bg-white p-6 shadow-[0_4px_10px_rgba(33,55,80,0.04)]"
    >
      <div className="flex flex-col gap-4 border-b border-[#e7eef5] pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#7d95ab]">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-[#31465b]">{title}</h2>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function SidebarButton({ active, icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between border-b-2 px-6 py-5 text-left transition ${
        active
          ? "border-[#ff5b08] bg-[#ff5b08] text-white"
          : "border-[#ff5b08] bg-transparent text-white hover:bg-white/5"
      }`}
    >
      <span className="flex items-center gap-3">
        <Icon className="h-5 w-5" />
        <span className="text-[15px] font-medium">{label}</span>
      </span>
      <ChevronRight className="h-4 w-4 opacity-85" />
    </button>
  );
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
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    if (isReady && currentUser && !canAccessDashboard) {
      router.replace("/manager/sign-in");
    }
  }, [canAccessDashboard, currentUser, isReady, router]);

  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return orders;
    }

    return orders.filter((order) =>
      [
        order.id,
        order.customerName,
        order.customerEmail,
        order.status,
        order.paymentStatus,
        ...(order.items || []).map((item) => item.name),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [orders, searchTerm]);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return users;
    }

    return users.filter((user) =>
      [user.name, user.email, user.role].join(" ").toLowerCase().includes(query)
    );
  }, [users, searchTerm]);

  function jumpToSection(sectionId) {
    setActiveSection(sectionId);
    if (typeof document === "undefined") {
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  if (!isReady) {
    return (
      <main className="min-h-screen bg-[#8ea3bb] px-4 py-12 text-white">
        <section className="mx-auto max-w-4xl rounded-[28px] bg-[#2f4153] p-10 shadow-[0_24px_80px_rgba(39,60,86,0.28)]">
          Loading staff dashboard...
        </section>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-[#8ea3bb] px-4 py-10">
        <section className="mx-auto max-w-4xl rounded-[30px] bg-[#dcecf7] p-6 shadow-[0_24px_80px_rgba(39,60,86,0.28)] md:p-8">
          <div className="rounded-[24px] bg-[#ff5b08] px-6 py-7 text-white">
            <p className="text-xs uppercase tracking-[0.28em] text-white/75">Admin panel</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">
              Staff dashboard access
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/82">
              This route is hidden from the public site navigation. Use the seeded admin account or
              sign in with an approved manager account.
            </p>
          </div>

          <div className="mt-6 rounded-[24px] bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7d95ab]">
              Seeded admin account
            </p>
            <p className="mt-4 text-sm leading-7 text-[#31465b]">
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
    <main className="min-h-screen bg-[#8ea3bb] px-4 py-8">
      <section className="mx-auto max-w-[1500px]">
        <div className="overflow-hidden rounded-[30px] bg-[#dcecf7] shadow-[0_26px_90px_rgba(39,60,86,0.30)]">
          <div className="grid lg:grid-cols-[290px_minmax(0,1fr)]">
            <aside className="bg-[#2f4153] text-white">
              <div className="flex h-full flex-col">
                <div className="px-8 py-14 text-center">
                  <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full bg-[#ff5b08]">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-4xl font-semibold text-[#2f4153]">
                      {String(currentUser.name || "A").charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <p className="mt-8 text-sm text-white/70">Signed in as</p>
                  <h2 className="mt-2 text-[2rem] font-medium tracking-[-0.04em]">
                    @{currentUser.name.replaceAll(" ", "_")}
                  </h2>
                  <p className="mt-3 text-xs uppercase tracking-[0.26em] text-white/55">
                    {currentUser.role}
                  </p>
                </div>

                <nav className="pb-8">
                  {sidebarItems.map((item) => (
                    <SidebarButton
                      key={item.id}
                      active={activeSection === item.id}
                      icon={item.icon}
                      label={item.label}
                      onClick={() => jumpToSection(item.id)}
                    />
                  ))}
                </nav>
              </div>
            </aside>

            <div>
              <div className="bg-[#ff5b08] px-6 py-8 md:px-8">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <label className="flex w-full max-w-3xl items-center gap-4 rounded-full border-4 border-white px-6 py-4 text-white">
                    <Search className="h-7 w-7 shrink-0" />
                    <input
                      className="w-full bg-transparent text-xl outline-none placeholder:text-white/80"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={signOut}
                    className="inline-flex items-center gap-3 text-xl font-medium text-white"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              </div>

              <div className="space-y-8 px-6 py-8 md:px-8">
                <div id="dashboard" className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  <MetricCard
                    label="Total Orders"
                    value={orders.length}
                    helper={`${filteredOrders.length} matching current search`}
                  />
                  <MetricCard
                    label="Pending Staff"
                    value={pendingUsers}
                    helper="Waiting for admin approval"
                  />
                  <MetricCard
                    label="Active Managers"
                    value={activeManagers}
                    helper="Approved manager accounts"
                  />
                  <MetricCard
                    label="Tracked Revenue"
                    value={formatCurrency(totalRevenue)}
                    helper="Based on recorded order totals"
                  />
                </div>

                <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                  <Panel
                    id="orders"
                    eyebrow="Orders"
                    title="Manage customer orders"
                    actions={
                      <Link href="/shop" className="secondary-button">
                        View storefront
                      </Link>
                    }
                  >
                    <div className="space-y-4">
                      {filteredOrders.length ? (
                        filteredOrders.map((order) => (
                          <article
                            key={order.id}
                            className="rounded-[20px] border border-[#dde8f0] bg-[#fdfefe] p-5"
                          >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d95ab]">
                                  {order.id}
                                </p>
                                <h3 className="mt-2 text-2xl font-semibold text-[#31465b]">
                                  {order.customerName}
                                </h3>
                                <p className="mt-2 text-sm text-[#7a93ab]">
                                  {order.customerEmail} • {formatDate(order.createdAt)}
                                </p>
                                <p className="mt-3 text-sm leading-7 text-[#41576c]">
                                  {order.items.map((item) => `${item.name} x${item.quantity}`).join(", ")}
                                </p>
                              </div>
                              <div className="flex min-w-[260px] flex-col gap-3">
                                <div className="rounded-[18px] bg-[#eef5fb] px-4 py-4 text-sm text-[#31465b]">
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
                        ))
                      ) : (
                        <div className="rounded-[20px] border border-dashed border-[#c8d8e6] bg-white p-6 text-sm text-[#7a93ab]">
                          No orders match the current search.
                        </div>
                      )}
                    </div>
                  </Panel>

                  <div className="space-y-8">
                    <Panel id="staff" eyebrow="Staff" title="Manage user roles">
                      <div className="space-y-4">
                        {filteredUsers.length ? (
                          filteredUsers.map((user) => (
                            <article
                              key={user.id}
                              className="rounded-[20px] border border-[#dde8f0] bg-[#fdfefe] p-5"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-lg font-semibold text-[#31465b]">{user.name}</p>
                                  <p className="mt-1 text-sm text-[#7a93ab]">{user.email}</p>
                                </div>
                                <span className="rounded-full bg-[#eef5fb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff5b08]">
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
                                <p className="mt-4 text-sm text-[#7a93ab]">
                                  Only admins can change staff roles.
                                </p>
                              )}
                            </article>
                          ))
                        ) : (
                          <div className="rounded-[20px] border border-dashed border-[#c8d8e6] bg-white p-6 text-sm text-[#7a93ab]">
                            No staff accounts match the current search.
                          </div>
                        )}
                      </div>
                    </Panel>

                    <Panel id="workflow" eyebrow="Workflow" title="How staff access works">
                      <div className="space-y-4 text-sm leading-7 text-[#6e879e]">
                        <div className="rounded-[18px] bg-[#eef5fb] px-4 py-4">
                          Managers create an account on the hidden sign-up page.
                        </div>
                        <div className="rounded-[18px] bg-[#eef5fb] px-4 py-4">
                          New accounts start as pending and cannot view orders yet.
                        </div>
                        <div className="rounded-[18px] bg-[#eef5fb] px-4 py-4">
                          An admin changes the role to manager or admin from this dashboard.
                        </div>
                        <div className="rounded-[18px] bg-[#eef5fb] px-4 py-4">
                          Approved staff then sign in and can manage order statuses.
                        </div>
                      </div>
                    </Panel>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
