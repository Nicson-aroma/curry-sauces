"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  Download,
  LayoutDashboard,
  LogOut,
  Mail,
  Pencil,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";

import { useStaff } from "../../components/staff-provider";
import { products } from "../../lib/meahs-data";
import {
  DEFAULT_ADMIN,
  ORDER_STATUS,
  ORDER_STATUS_OPTIONS,
  STAFF_ROLE_OPTIONS,
  STAFF_ROLES,
  SUBSCRIBER_STATUS,
  SUBSCRIBER_STATUS_OPTIONS,
} from "../../lib/staff-constants";

const paymentStatusOptions = ["pending", "paid", "refunded", "failed"];

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "staff", label: "Users", icon: Users },
  { id: "subscribers", label: "Subscribers", icon: Mail },
  { id: "workflow", label: "Workflow", icon: Settings },
];

const orderStatusOptions = [ORDER_STATUS.AWAITING_PAYMENT, ...ORDER_STATUS_OPTIONS];
const productOptions = products.map((product) => ({
  slug: product.slug,
  name: product.name,
}));

function createLineItem() {
  const defaultProduct = productOptions[0];
  return {
    key: `line-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    slug: defaultProduct?.slug ?? "",
    quantity: 1,
  };
}

function getDefaultOrderForm() {
  return {
    customerName: "",
    customerEmail: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    status: ORDER_STATUS.NEW,
    paymentStatus: "paid",
    items: [createLineItem()],
  };
}

function getDefaultUserForm() {
  return {
    name: "",
    email: "",
    password: "",
    role: STAFF_ROLES.MANAGER,
  };
}

function getDefaultSubscriberForm() {
  return {
    email: "",
    source: "website",
    status: SUBSCRIBER_STATUS.ACTIVE,
  };
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(Number(amount || 0));
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

function AdminNotice({ notice, onDismiss }) {
  if (!notice) {
    return null;
  }

  return (
    <div
      className={`rounded-[20px] border px-5 py-4 text-sm ${
        notice.type === "error"
          ? "border-[#f1c4c4] bg-[#fff5f5] text-[#8a3030]"
          : "border-[#cfe6d3] bg-[#f2fbf3] text-[#215a2b]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <p>{notice.message}</p>
        <button type="button" onClick={onDismiss} className="text-xs font-semibold uppercase">
          Close
        </button>
      </div>
    </div>
  );
}

function StatPill({ label, value }) {
  return (
    <div className="rounded-[18px] border border-[#dde8f0] bg-[#f8fbfd] px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7d95ab]">{label}</p>
      <p className="mt-2 text-xl font-semibold text-[#31465b]">{value}</p>
    </div>
  );
}

function DataShell({ title, count, children }) {
  return (
    <div className="rounded-[24px] border border-[#dde8f0] bg-[#f8fbfd] p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-[#31465b]">{title}</h3>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7d95ab]">
          {count}
        </span>
      </div>
      {children}
    </div>
  );
}

function toCsvValue(value) {
  const normalized = value == null ? "" : String(value);
  return `"${normalized.replaceAll('"', '""')}"`;
}

function buildCsv(rows, columns) {
  const header = columns.map((column) => toCsvValue(column.label)).join(",");
  const body = rows.map((row) => columns.map((column) => toCsvValue(column.getValue(row))).join(","));
  return [header, ...body].join("\n");
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function sanitizeOrderForm(form) {
  return {
    customerName: form.customerName,
    customerEmail: form.customerEmail,
    customerAddress: {
      line1: form.addressLine1,
      line2: form.addressLine2,
      city: form.city,
      state: form.state,
      postal_code: form.postalCode,
      country: form.country,
    },
    status: form.status,
    paymentStatus: form.paymentStatus,
    items: form.items.map((item) => ({
      slug: item.slug,
      quantity: Number.parseInt(item.quantity, 10) || 0,
    })),
  };
}

function getOrderFormFromOrder(order) {
  return {
    customerName: order.customerName || "",
    customerEmail: order.customerEmail || "",
    addressLine1: order.customerAddress?.line1 || "",
    addressLine2: order.customerAddress?.line2 || "",
    city: order.customerAddress?.city || "",
    state: order.customerAddress?.state || "",
    postalCode: order.customerAddress?.postal_code || "",
    country: order.customerAddress?.country || "",
    status: order.status || ORDER_STATUS.NEW,
    paymentStatus: order.paymentStatus || "paid",
    items:
      order.items?.map((item) => ({
        key: `line-${item.slug}-${Math.random().toString(36).slice(2, 7)}`,
        slug: item.slug,
        quantity: item.quantity,
      })) || [createLineItem()],
  };
}

function getUserFormFromUser(user) {
  return {
    name: user.name || "",
    email: user.email || "",
    password: "",
    role: user.role || STAFF_ROLES.MANAGER,
  };
}

function getSubscriberFormFromSubscriber(subscriber) {
  return {
    email: subscriber.email || "",
    source: subscriber.source || "website",
    status: subscriber.status || SUBSCRIBER_STATUS.ACTIVE,
  };
}

function compactAddress(address) {
  return [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ]
    .filter(Boolean)
    .join(", ");
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const {
    currentUser,
    users,
    orders,
    subscribers,
    isReady,
    canAccessDashboard,
    signOut,
    useDefaultAdmin,
    changeUserRole,
    changeOrderStatus,
    createDashboardUser,
    updateDashboardUser,
    deleteDashboardUser,
    createDashboardOrder,
    updateDashboardOrder,
    deleteDashboardOrder,
    createDashboardSubscriber,
    updateDashboardSubscriber,
    deleteDashboardSubscriber,
    refresh,
  } = useStaff();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [notice, setNotice] = useState(null);
  const [busyKey, setBusyKey] = useState("");

  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingSubscriberId, setEditingSubscriberId] = useState(null);

  const [orderForm, setOrderForm] = useState(getDefaultOrderForm);
  const [userForm, setUserForm] = useState(getDefaultUserForm);
  const [subscriberForm, setSubscriberForm] = useState(getDefaultSubscriberForm);

  useEffect(() => {
    if (isReady && currentUser && !canAccessDashboard) {
      router.replace("/manager/sign-in");
    }
  }, [canAccessDashboard, currentUser, isReady, router]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const hashSection = window.location.hash.replace("#", "");
    if (sidebarItems.some((item) => item.id === hashSection)) {
      setActiveSection(hashSection);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const nextHash = `#${activeSection}`;
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }
  }, [activeSection]);

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
        compactAddress(order.customerAddress),
        ...(order.items || []).map((item) => `${item.name} ${item.slug}`),
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
      [user.id, user.name, user.email, user.role].join(" ").toLowerCase().includes(query)
    );
  }, [users, searchTerm]);

  const filteredSubscribers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return subscribers;
    }

    return subscribers.filter((subscriber) =>
      [subscriber.id, subscriber.email, subscriber.source, subscriber.status]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [subscribers, searchTerm]);

  const pendingUsers = users.filter((user) => user.role === STAFF_ROLES.PENDING).length;
  const activeManagers = users.filter((user) => user.role === STAFF_ROLES.MANAGER).length;
  const activeSubscribers = subscribers.filter(
    (subscriber) => subscriber.status === SUBSCRIBER_STATUS.ACTIVE
  ).length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
  const averageOrderValue = orders.length ? totalRevenue / orders.length : 0;

  function showNotice(type, message) {
    setNotice({ type, message });
  }

  function jumpToSection(sectionId) {
    setActiveSection(sectionId);
  }

  function resetOrderEditor() {
    setEditingOrderId(null);
    setOrderForm(getDefaultOrderForm());
  }

  function resetUserEditor() {
    setEditingUserId(null);
    setUserForm(getDefaultUserForm());
  }

  function resetSubscriberEditor() {
    setEditingSubscriberId(null);
    setSubscriberForm(getDefaultSubscriberForm());
  }

  function updateOrderField(field, value) {
    setOrderForm((current) => ({ ...current, [field]: value }));
  }

  function updateOrderItem(key, field, value) {
    setOrderForm((current) => ({
      ...current,
      items: current.items.map((item) => (item.key === key ? { ...item, [field]: value } : item)),
    }));
  }

  function addOrderItem() {
    setOrderForm((current) => ({
      ...current,
      items: [...current.items, createLineItem()],
    }));
  }

  function removeOrderItem(key) {
    setOrderForm((current) => ({
      ...current,
      items: current.items.length > 1 ? current.items.filter((item) => item.key !== key) : current.items,
    }));
  }

  function exportOrders() {
    const csv = buildCsv(orders, [
      { label: "ID", getValue: (row) => row.id },
      { label: "Customer", getValue: (row) => row.customerName },
      { label: "Email", getValue: (row) => row.customerEmail },
      { label: "Status", getValue: (row) => row.status },
      { label: "Payment", getValue: (row) => row.paymentStatus },
      { label: "Total Items", getValue: (row) => row.totalItems },
      { label: "Total Amount", getValue: (row) => row.totalAmount },
      { label: "Address", getValue: (row) => compactAddress(row.customerAddress) },
      {
        label: "Items",
        getValue: (row) => row.items.map((item) => `${item.name} x${item.quantity}`).join(" | "),
      },
      { label: "Created At", getValue: (row) => row.createdAt },
    ]);

    downloadFile("admin-orders.csv", csv, "text/csv;charset=utf-8;");
    showNotice("success", "Orders export created.");
  }

  function exportUsers() {
    const csv = buildCsv(users, [
      { label: "ID", getValue: (row) => row.id },
      { label: "Name", getValue: (row) => row.name },
      { label: "Email", getValue: (row) => row.email },
      { label: "Role", getValue: (row) => row.role },
      { label: "Created At", getValue: (row) => row.createdAt },
    ]);

    downloadFile("admin-users.csv", csv, "text/csv;charset=utf-8;");
    showNotice("success", "Users export created.");
  }

  function exportSubscribers() {
    const csv = buildCsv(subscribers, [
      { label: "ID", getValue: (row) => row.id },
      { label: "Email", getValue: (row) => row.email },
      { label: "Source", getValue: (row) => row.source },
      { label: "Status", getValue: (row) => row.status },
      { label: "Created At", getValue: (row) => row.createdAt },
    ]);

    downloadFile("admin-subscribers.csv", csv, "text/csv;charset=utf-8;");
    showNotice("success", "Subscribers export created.");
  }

  function exportCombined() {
    const snapshot = {
      exportedAt: new Date().toISOString(),
      totals: {
        orders: orders.length,
        users: users.length,
        subscribers: subscribers.length,
        revenue: totalRevenue,
      },
      orders,
      users,
      subscribers,
    };

    downloadFile(
      "admin-dashboard-snapshot.json",
      JSON.stringify(snapshot, null, 2),
      "application/json;charset=utf-8;"
    );
    showNotice("success", "Combined dashboard snapshot exported.");
  }

  async function handleOrderSubmit(event) {
    event.preventDefault();
    setBusyKey("order-submit");

    try {
      const payload = sanitizeOrderForm(orderForm);
      if (editingOrderId) {
        await updateDashboardOrder(editingOrderId, payload);
        showNotice("success", "Order updated.");
      } else {
        await createDashboardOrder(payload);
        showNotice("success", "Order created.");
      }
      resetOrderEditor();
    } catch (error) {
      showNotice("error", error.message || "Unable to save order.");
    } finally {
      setBusyKey("");
    }
  }

  async function handleUserSubmit(event) {
    event.preventDefault();
    setBusyKey("user-submit");

    try {
      const payload = {
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
      };

      if (userForm.password.trim()) {
        payload.password = userForm.password;
      }

      if (editingUserId) {
        await updateDashboardUser(editingUserId, payload);
        showNotice("success", "User updated.");
      } else {
        await createDashboardUser({
          ...payload,
          password: userForm.password,
        });
        showNotice("success", "User created.");
      }

      resetUserEditor();
    } catch (error) {
      showNotice("error", error.message || "Unable to save user.");
    } finally {
      setBusyKey("");
    }
  }

  async function handleSubscriberSubmit(event) {
    event.preventDefault();
    setBusyKey("subscriber-submit");

    try {
      if (editingSubscriberId) {
        await updateDashboardSubscriber(editingSubscriberId, subscriberForm);
        showNotice("success", "Subscriber updated.");
      } else {
        await createDashboardSubscriber(subscriberForm);
        showNotice("success", "Subscriber created.");
      }

      resetSubscriberEditor();
    } catch (error) {
      showNotice("error", error.message || "Unable to save subscriber.");
    } finally {
      setBusyKey("");
    }
  }

  async function handleDeleteOrder(orderId) {
    if (!window.confirm("Delete this order?")) {
      return;
    }

    setBusyKey(`delete-order-${orderId}`);
    try {
      await deleteDashboardOrder(orderId);
      if (editingOrderId === orderId) {
        resetOrderEditor();
      }
      showNotice("success", "Order deleted.");
    } catch (error) {
      showNotice("error", error.message || "Unable to delete order.");
    } finally {
      setBusyKey("");
    }
  }

  async function handleDeleteUser(userId) {
    if (!window.confirm("Delete this user?")) {
      return;
    }

    setBusyKey(`delete-user-${userId}`);
    try {
      await deleteDashboardUser(userId);
      if (editingUserId === userId) {
        resetUserEditor();
      }
      showNotice("success", "User deleted.");
    } catch (error) {
      showNotice("error", error.message || "Unable to delete user.");
    } finally {
      setBusyKey("");
    }
  }

  async function handleDeleteSubscriber(subscriberId) {
    if (!window.confirm("Delete this subscriber?")) {
      return;
    }

    setBusyKey(`delete-subscriber-${subscriberId}`);
    try {
      await deleteDashboardSubscriber(subscriberId);
      if (editingSubscriberId === subscriberId) {
        resetSubscriberEditor();
      }
      showNotice("success", "Subscriber deleted.");
    } catch (error) {
      showNotice("error", error.message || "Unable to delete subscriber.");
    } finally {
      setBusyKey("");
    }
  }

  async function handleQuickRoleChange(userId, role) {
    setBusyKey(`role-${userId}`);
    try {
      await changeUserRole(userId, role);
      await refresh();
      showNotice("success", "User role updated.");
    } catch (error) {
      showNotice("error", error.message || "Unable to update user role.");
    } finally {
      setBusyKey("");
    }
  }

  async function handleQuickOrderStatusChange(orderId, status) {
    setBusyKey(`status-${orderId}`);
    try {
      await changeOrderStatus(orderId, status);
      showNotice("success", "Order status updated.");
    } catch (error) {
      showNotice("error", error.message || "Unable to update order status.");
    } finally {
      setBusyKey("");
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

  function renderActiveSection() {
    if (activeSection === "dashboard") {
      return (
        <>
          <div id="dashboard" className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            <MetricCard
              label="Total Orders"
              value={orders.length}
              helper={`${filteredOrders.length} matching current search`}
            />
            <MetricCard
              label="Tracked Revenue"
              value={formatCurrency(totalRevenue)}
              helper={`${formatCurrency(averageOrderValue)} average order value`}
            />
            <MetricCard
              label="Active Managers"
              value={activeManagers}
              helper={`${pendingUsers} pending approvals`}
            />
            <MetricCard
              label="Subscribers"
              value={subscribers.length}
              helper={`${activeSubscribers} currently active`}
            />
            <MetricCard
              label="Staff Accounts"
              value={users.length}
              helper="Admins, managers and pending users"
            />
          </div>

          <Panel
            id="workflow"
            eyebrow="Overview"
            title="Admin dashboard overview"
            actions={
              <Link href="/shop" className="secondary-button">
                View storefront
              </Link>
            }
          >
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[18px] bg-[#eef5fb] px-4 py-4 text-sm leading-7 text-[#6e879e]">
                Track orders, revenue, and payment states from a single operational view.
              </div>
              <div className="rounded-[18px] bg-[#eef5fb] px-4 py-4 text-sm leading-7 text-[#6e879e]">
                Open the Users section to create staff accounts, approve managers, and update roles.
              </div>
              <div className="rounded-[18px] bg-[#eef5fb] px-4 py-4 text-sm leading-7 text-[#6e879e]">
                Open Subscribers to manage newsletter contacts, sources, and lifecycle status.
              </div>
              <div className="rounded-[18px] bg-[#eef5fb] px-4 py-4 text-sm leading-7 text-[#6e879e]">
                Use Export all to download the complete admin snapshot for reporting and backup.
              </div>
            </div>
          </Panel>
        </>
      );
    }

    if (activeSection === "orders") {
      return (
        <Panel
          id="orders"
          eyebrow="Orders"
          title="Advanced order management"
          actions={
            <>
              <button type="button" onClick={exportOrders} className="secondary-button">
                <Download className="h-4 w-4" />
                Export orders
              </button>
              <button type="button" onClick={resetOrderEditor} className="secondary-button">
                <Plus className="h-4 w-4" />
                New order
              </button>
            </>
          }
        >
          <div className="grid gap-8 xl:grid-cols-[420px_minmax(0,1fr)]">
            <div className="space-y-5">
              <DataShell
                title={editingOrderId ? "Edit order" : "Create order"}
                count={editingOrderId ? editingOrderId : "new"}
              >
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <label className="field-shell">
                    Customer name
                    <input
                      className="field-input"
                      value={orderForm.customerName}
                      onChange={(event) => updateOrderField("customerName", event.target.value)}
                      placeholder="Customer name"
                    />
                  </label>

                  <label className="field-shell">
                    Customer email
                    <input
                      type="email"
                      className="field-input"
                      value={orderForm.customerEmail}
                      onChange={(event) => updateOrderField("customerEmail", event.target.value)}
                      placeholder="customer@example.com"
                    />
                  </label>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="field-shell">
                      Order status
                      <select
                        className="field-input"
                        value={orderForm.status}
                        onChange={(event) => updateOrderField("status", event.target.value)}
                      >
                        {orderStatusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="field-shell">
                      Payment status
                      <select
                        className="field-input"
                        value={orderForm.paymentStatus}
                        onChange={(event) => updateOrderField("paymentStatus", event.target.value)}
                      >
                        {paymentStatusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="field-shell">
                      Address line 1
                      <input
                        className="field-input"
                        value={orderForm.addressLine1}
                        onChange={(event) => updateOrderField("addressLine1", event.target.value)}
                      />
                    </label>
                    <label className="field-shell">
                      Address line 2
                      <input
                        className="field-input"
                        value={orderForm.addressLine2}
                        onChange={(event) => updateOrderField("addressLine2", event.target.value)}
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="field-shell">
                      City
                      <input
                        className="field-input"
                        value={orderForm.city}
                        onChange={(event) => updateOrderField("city", event.target.value)}
                      />
                    </label>
                    <label className="field-shell">
                      State
                      <input
                        className="field-input"
                        value={orderForm.state}
                        onChange={(event) => updateOrderField("state", event.target.value)}
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="field-shell">
                      Postal code
                      <input
                        className="field-input"
                        value={orderForm.postalCode}
                        onChange={(event) => updateOrderField("postalCode", event.target.value)}
                      />
                    </label>
                    <label className="field-shell">
                      Country
                      <input
                        className="field-input"
                        value={orderForm.country}
                        onChange={(event) => updateOrderField("country", event.target.value)}
                      />
                    </label>
                  </div>

                  <div className="space-y-3 rounded-[20px] border border-[#dde8f0] bg-white p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[#31465b]">Line items</p>
                        <p className="text-xs text-[#7a93ab]">
                          Build the order with product and quantity rows.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addOrderItem}
                        className="secondary-button !px-4 !py-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add item
                      </button>
                    </div>

                    <div className="space-y-3">
                      {orderForm.items.map((item, index) => (
                        <div
                          key={item.key}
                          className="grid gap-3 rounded-[18px] border border-[#edf2f6] bg-[#f8fbfd] p-3 md:grid-cols-[minmax(0,1fr)_110px_54px]"
                        >
                          <label className="field-shell text-xs">
                            Product
                            <select
                              className="field-input"
                              value={item.slug}
                              onChange={(event) => updateOrderItem(item.key, "slug", event.target.value)}
                            >
                              {productOptions.map((product) => (
                                <option key={product.slug} value={product.slug}>
                                  {product.name}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="field-shell text-xs">
                            Qty
                            <input
                              type="number"
                              min="1"
                              className="field-input"
                              value={item.quantity}
                              onChange={(event) =>
                                updateOrderItem(item.key, "quantity", event.target.value)
                              }
                            />
                          </label>
                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={() => removeOrderItem(item.key)}
                              className="secondary-button h-[52px] w-full !px-0 !py-0"
                              disabled={orderForm.items.length === 1}
                              aria-label={`Remove order item ${index + 1}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      className="primary-button"
                      disabled={busyKey === "order-submit"}
                    >
                      {editingOrderId ? "Update order" : "Create order"}
                    </button>
                    <button type="button" onClick={resetOrderEditor} className="secondary-button">
                      Clear
                    </button>
                  </div>
                </form>
              </DataShell>

              <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-1">
                <StatPill
                  label="New orders"
                  value={orders.filter((order) => order.status === ORDER_STATUS.NEW).length}
                />
                <StatPill
                  label="Processing"
                  value={orders.filter((order) => order.status === ORDER_STATUS.PROCESSING).length}
                />
                <StatPill
                  label="Awaiting payment"
                  value={
                    orders.filter((order) => order.status === ORDER_STATUS.AWAITING_PAYMENT).length
                  }
                />
              </div>
            </div>

            <DataShell title="Orders list" count={filteredOrders.length}>
              <div className="space-y-4">
                {filteredOrders.length ? (
                  filteredOrders.map((order) => (
                    <article
                      key={order.id}
                      className="rounded-[20px] border border-[#dde8f0] bg-white p-5"
                    >
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d95ab]">
                            {order.id}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-3">
                            <h3 className="text-2xl font-semibold text-[#31465b]">
                              {order.customerName}
                            </h3>
                            <span className="rounded-full bg-[#eef5fb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#ff5b08]">
                              {order.status}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-[#7a93ab]">
                            {order.customerEmail} | {formatDate(order.createdAt)}
                          </p>
                          <p className="mt-3 text-sm leading-7 text-[#41576c]">
                            {order.items.map((item) => `${item.name} x${item.quantity}`).join(", ")}
                          </p>
                          <p className="mt-2 text-sm text-[#6e879e]">
                            {compactAddress(order.customerAddress) ||
                              "No customer address recorded."}
                          </p>
                        </div>

                        <div className="flex min-w-[290px] flex-col gap-3">
                          <div className="rounded-[18px] bg-[#eef5fb] px-4 py-4 text-sm text-[#31465b]">
                            <p className="font-semibold">Payment: {order.paymentStatus}</p>
                            <p className="mt-1">Total: {formatCurrency(order.totalAmount)}</p>
                            <p className="mt-1">Items: {order.totalItems}</p>
                          </div>

                          <label className="field-shell text-sm">
                            Quick status update
                            <select
                              className="field-input"
                              value={order.status}
                              onChange={(event) =>
                                handleQuickOrderStatusChange(order.id, event.target.value)
                              }
                              disabled={busyKey === `status-${order.id}`}
                            >
                              {orderStatusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </label>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingOrderId(order.id);
                                setOrderForm(getOrderFormFromOrder(order));
                              }}
                              className="secondary-button !px-4 !py-2"
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(order.id)}
                              className="secondary-button !px-4 !py-2 text-[#8a3030]"
                              disabled={busyKey === `delete-order-${order.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
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
            </DataShell>
          </div>
        </Panel>
      );
    }

    if (activeSection === "staff") {
      return (
        <Panel
          id="staff"
          eyebrow="Users"
          title="User CRUD and role control"
          actions={
            <>
              <button type="button" onClick={exportUsers} className="secondary-button">
                <Download className="h-4 w-4" />
                Export users
              </button>
              <button type="button" onClick={resetUserEditor} className="secondary-button">
                <UserRound className="h-4 w-4" />
                New user
              </button>
            </>
          }
        >
          <div className="grid gap-8 xl:grid-cols-[380px_minmax(0,1fr)]">
            <DataShell
              title={editingUserId ? "Edit user" : "Create user"}
              count={editingUserId ? editingUserId : "new"}
            >
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <label className="field-shell">
                  Full name
                  <input
                    className="field-input"
                    value={userForm.name}
                    onChange={(event) =>
                      setUserForm((current) => ({ ...current, name: event.target.value }))
                    }
                  />
                </label>

                <label className="field-shell">
                  Email address
                  <input
                    type="email"
                    className="field-input"
                    value={userForm.email}
                    onChange={(event) =>
                      setUserForm((current) => ({ ...current, email: event.target.value }))
                    }
                  />
                </label>

                <label className="field-shell">
                  Password {editingUserId ? "(leave blank to keep current password)" : ""}
                  <input
                    type="password"
                    className="field-input"
                    value={userForm.password}
                    onChange={(event) =>
                      setUserForm((current) => ({ ...current, password: event.target.value }))
                    }
                  />
                </label>

                <label className="field-shell">
                  Role
                  <select
                    className="field-input"
                    value={userForm.role}
                    onChange={(event) =>
                      setUserForm((current) => ({ ...current, role: event.target.value }))
                    }
                  >
                    {STAFF_ROLE_OPTIONS.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="flex flex-wrap gap-3">
                  <button type="submit" className="primary-button" disabled={busyKey === "user-submit"}>
                    {editingUserId ? "Update user" : "Create user"}
                  </button>
                  <button type="button" onClick={resetUserEditor} className="secondary-button">
                    Clear
                  </button>
                </div>
              </form>
            </DataShell>

            <DataShell title="Users list" count={filteredUsers.length}>
              <div className="space-y-4">
                {filteredUsers.length ? (
                  filteredUsers.map((user) => (
                    <article
                      key={user.id}
                      className="rounded-[20px] border border-[#dde8f0] bg-white p-5"
                    >
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-[#31465b]">{user.name}</p>
                          <p className="mt-1 text-sm text-[#7a93ab]">{user.email}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#91a5b9]">
                            {user.id} | created {formatDate(user.createdAt)}
                          </p>
                        </div>

                        <div className="flex min-w-[290px] flex-col gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-[#eef5fb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff5b08]">
                              {user.role}
                            </span>
                            {user.email === DEFAULT_ADMIN.email ? (
                              <span className="rounded-full bg-[#fff1db] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#8f5b00]">
                                Protected
                              </span>
                            ) : null}
                          </div>

                          <label className="field-shell text-sm">
                            Quick role change
                            <select
                              className="field-input"
                              value={user.role}
                              onChange={(event) => handleQuickRoleChange(user.id, event.target.value)}
                              disabled={
                                currentUser.role !== STAFF_ROLES.ADMIN ||
                                user.email === DEFAULT_ADMIN.email ||
                                busyKey === `role-${user.id}`
                              }
                            >
                              {STAFF_ROLE_OPTIONS.map((role) => (
                                <option key={role} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>
                          </label>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingUserId(user.id);
                                setUserForm(getUserFormFromUser(user));
                              }}
                              className="secondary-button !px-4 !py-2"
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(user.id)}
                              className="secondary-button !px-4 !py-2 text-[#8a3030]"
                              disabled={
                                user.email === DEFAULT_ADMIN.email ||
                                busyKey === `delete-user-${user.id}`
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[20px] border border-dashed border-[#c8d8e6] bg-white p-6 text-sm text-[#7a93ab]">
                    No users match the current search.
                  </div>
                )}
              </div>
            </DataShell>
          </div>
        </Panel>
      );
    }

    if (activeSection === "subscribers") {
      return (
        <Panel
          id="subscribers"
          eyebrow="Subscribers"
          title="Subscriber CRM and lifecycle controls"
          actions={
            <>
              <button type="button" onClick={exportSubscribers} className="secondary-button">
                <Download className="h-4 w-4" />
                Export subscribers
              </button>
              <button type="button" onClick={resetSubscriberEditor} className="secondary-button">
                <Plus className="h-4 w-4" />
                New subscriber
              </button>
            </>
          }
        >
          <div className="grid gap-8 xl:grid-cols-[380px_minmax(0,1fr)]">
            <DataShell
              title={editingSubscriberId ? "Edit subscriber" : "Create subscriber"}
              count={editingSubscriberId ? editingSubscriberId : "new"}
            >
              <form onSubmit={handleSubscriberSubmit} className="space-y-4">
                <label className="field-shell">
                  Email address
                  <input
                    type="email"
                    className="field-input"
                    value={subscriberForm.email}
                    onChange={(event) =>
                      setSubscriberForm((current) => ({ ...current, email: event.target.value }))
                    }
                  />
                </label>

                <label className="field-shell">
                  Source
                  <input
                    className="field-input"
                    value={subscriberForm.source}
                    onChange={(event) =>
                      setSubscriberForm((current) => ({ ...current, source: event.target.value }))
                    }
                    placeholder="website, popup, event..."
                  />
                </label>

                <label className="field-shell">
                  Status
                  <select
                    className="field-input"
                    value={subscriberForm.status}
                    onChange={(event) =>
                      setSubscriberForm((current) => ({ ...current, status: event.target.value }))
                    }
                  >
                    {SUBSCRIBER_STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="primary-button"
                    disabled={busyKey === "subscriber-submit"}
                  >
                    {editingSubscriberId ? "Update subscriber" : "Create subscriber"}
                  </button>
                  <button
                    type="button"
                    onClick={resetSubscriberEditor}
                    className="secondary-button"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </DataShell>

            <DataShell title="Subscribers list" count={filteredSubscribers.length}>
              <div className="space-y-4">
                {filteredSubscribers.length ? (
                  filteredSubscribers.map((subscriber) => (
                    <article
                      key={subscriber.id}
                      className="rounded-[20px] border border-[#dde8f0] bg-white p-5"
                    >
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-[#31465b]">{subscriber.email}</p>
                          <p className="mt-1 text-sm text-[#7a93ab]">
                            Source: {subscriber.source || "website"}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#91a5b9]">
                            {subscriber.id} | created {formatDate(subscriber.createdAt)}
                          </p>
                        </div>

                        <div className="flex min-w-[290px] flex-col gap-3">
                          <span className="w-fit rounded-full bg-[#eef5fb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff5b08]">
                            {subscriber.status}
                          </span>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSubscriberId(subscriber.id);
                                setSubscriberForm(getSubscriberFormFromSubscriber(subscriber));
                              }}
                              className="secondary-button !px-4 !py-2"
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSubscriber(subscriber.id)}
                              className="secondary-button !px-4 !py-2 text-[#8a3030]"
                              disabled={busyKey === `delete-subscriber-${subscriber.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[20px] border border-dashed border-[#c8d8e6] bg-white p-6 text-sm text-[#7a93ab]">
                    No subscribers match the current search.
                  </div>
                )}
              </div>
            </DataShell>
          </div>
        </Panel>
      );
    }

    return (
      <Panel id="workflow" eyebrow="Operations" title="Admin dashboard workflow">
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[18px] bg-[#eef5fb] px-4 py-4 text-sm leading-7 text-[#6e879e]">
            Create manual orders, update statuses, and correct customer records from one place.
          </div>
          <div className="rounded-[18px] bg-[#eef5fb] px-4 py-4 text-sm leading-7 text-[#6e879e]">
            Create users, promote pending managers, edit access levels, and protect the seeded admin.
          </div>
          <div className="rounded-[18px] bg-[#eef5fb] px-4 py-4 text-sm leading-7 text-[#6e879e]">
            Manage subscribers as a simple CRM with source tracking and lifecycle status controls.
          </div>
          <div className="rounded-[18px] bg-[#eef5fb] px-4 py-4 text-sm leading-7 text-[#6e879e]">
            Export orders, users, subscribers, or the combined admin snapshot for reporting and backup.
          </div>
        </div>
      </Panel>
    );
  }

  return (
    <main className="min-h-screen bg-[#8ea3bb] px-4 py-8">
      <section className="mx-auto max-w-[1600px]">
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
                      placeholder="Search orders, users, subscribers, emails..."
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                    />
                  </label>

                  <div className="flex flex-wrap gap-3">
                    <button type="button" onClick={exportCombined} className="secondary-button bg-white/90">
                      <Download className="h-4 w-4" />
                      Export all
                    </button>
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
              </div>

              <div className="space-y-8 px-6 py-8 md:px-8">
                <AdminNotice notice={notice} onDismiss={() => setNotice(null)} />
                {renderActiveSection()}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
