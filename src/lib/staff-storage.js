import { productDetailsBySlug } from "./meahs-data";

const USERS_KEY = "meahs-staff-users";
const CURRENT_USER_KEY = "meahs-staff-current-user";
const ORDERS_KEY = "meahs-staff-orders";
const PENDING_ORDER_KEY = "meahs-pending-order";

export const STAFF_ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  PENDING: "pending",
};

export const DEFAULT_ADMIN = {
  id: "staff-admin-1",
  name: "Meah's Admin",
  email: "admin@meahs.local",
  password: "Admin123!",
  role: STAFF_ROLES.ADMIN,
  createdAt: "2026-05-12T09:00:00.000Z",
};

const seededOrders = [
  {
    id: "ORD-1001",
    customerName: "Sarah Khan",
    customerEmail: "sarah.khan@example.com",
    status: "processing",
    paymentStatus: "paid",
    createdAt: "2026-05-11T10:30:00.000Z",
    totalItems: 6,
    totalAmount: 28.2,
    items: [
      { slug: "korma", name: "Korma", quantity: 2, unitPrice: 4.7 },
      { slug: "tikka-masala", name: "Tikka Masala", quantity: 2, unitPrice: 4.7 },
      { slug: "madras", name: "Madras", quantity: 2, unitPrice: 4.7 },
    ],
  },
  {
    id: "ORD-1002",
    customerName: "Imran Patel",
    customerEmail: "imran.patel@example.com",
    status: "ready",
    paymentStatus: "paid",
    createdAt: "2026-05-10T14:45:00.000Z",
    totalItems: 6,
    totalAmount: 28.2,
    items: [
      { slug: "jalfrezi", name: "Jalfrezi", quantity: 3, unitPrice: 4.7 },
      { slug: "dhansak", name: "Dhansak", quantity: 3, unitPrice: 4.7 },
    ],
  },
];

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeRead(key, fallback) {
  if (!canUseStorage()) {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function createId(prefix) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return safeUser;
}

export function ensureStaffStorage() {
  if (!canUseStorage()) {
    return;
  }

  const users = safeRead(USERS_KEY, []);
  if (!Array.isArray(users) || !users.length) {
    safeWrite(USERS_KEY, [DEFAULT_ADMIN]);
  } else if (!users.some((user) => user.email === DEFAULT_ADMIN.email)) {
    safeWrite(USERS_KEY, [DEFAULT_ADMIN, ...users]);
  }

  const orders = safeRead(ORDERS_KEY, []);
  if (!Array.isArray(orders) || !orders.length) {
    safeWrite(ORDERS_KEY, seededOrders);
  }
}

export function getUsers() {
  ensureStaffStorage();
  return safeRead(USERS_KEY, []);
}

export function getOrders() {
  ensureStaffStorage();
  return safeRead(ORDERS_KEY, []).sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
}

export function getCurrentUser() {
  ensureStaffStorage();
  return safeRead(CURRENT_USER_KEY, null);
}

function setUsers(users) {
  safeWrite(USERS_KEY, users);
}

function setOrders(orders) {
  safeWrite(ORDERS_KEY, orders);
}

export function createPendingManagerAccount({ name, email, password }) {
  const users = getUsers();
  const normalizedEmail = String(email).trim().toLowerCase();

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error("A user with that email already exists.");
  }

  const newUser = {
    id: createId("staff"),
    name: String(name).trim(),
    email: normalizedEmail,
    password,
    role: STAFF_ROLES.PENDING,
    createdAt: new Date().toISOString(),
  };

  setUsers([...users, newUser]);
  return sanitizeUser(newUser);
}

export function authenticateStaffUser({ email, password }) {
  const normalizedEmail = String(email).trim().toLowerCase();
  const user = getUsers().find(
    (entry) => entry.email === normalizedEmail && entry.password === password
  );

  if (!user) {
    throw new Error("Incorrect email or password.");
  }

  if (user.role === STAFF_ROLES.PENDING) {
    throw new Error("Your account is waiting for admin approval.");
  }

  const safeUser = sanitizeUser(user);
  safeWrite(CURRENT_USER_KEY, safeUser);
  return safeUser;
}

export function signInAsDefaultAdmin() {
  ensureStaffStorage();
  const safeUser = sanitizeUser(DEFAULT_ADMIN);
  safeWrite(CURRENT_USER_KEY, safeUser);
  return safeUser;
}

export function signOutStaffUser() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(CURRENT_USER_KEY);
}

export function canAccessDashboard(user) {
  return user?.role === STAFF_ROLES.ADMIN || user?.role === STAFF_ROLES.MANAGER;
}

export function updateUserRole(userId, role) {
  const users = getUsers();
  const updatedUsers = users.map((user) =>
    user.id === userId ? { ...user, role } : user
  );
  setUsers(updatedUsers);

  const currentUser = getCurrentUser();
  if (currentUser?.id === userId) {
    const nextCurrentUser = sanitizeUser(updatedUsers.find((user) => user.id === userId));

    if (nextCurrentUser && canAccessDashboard(nextCurrentUser)) {
      safeWrite(CURRENT_USER_KEY, nextCurrentUser);
    } else {
      signOutStaffUser();
    }
  }

  return updatedUsers.map(sanitizeUser);
}

export function updateOrderStatus(orderId, status) {
  const updatedOrders = getOrders().map((order) =>
    order.id === orderId ? { ...order, status } : order
  );
  setOrders(updatedOrders);
  return updatedOrders;
}

export function storePendingOrder(items, customer = {}) {
  const normalizedItems = Array.isArray(items)
    ? items
        .map((item) => {
          const product = productDetailsBySlug[item?.slug];
          const quantity = Number.parseInt(item?.quantity, 10) || 0;

          if (!product || quantity <= 0) {
            return null;
          }

          return {
            slug: product.slug,
            name: product.name,
            quantity,
            unitPrice: Number(product.priceValue || 0),
          };
        })
        .filter(Boolean)
    : [];

  const totalItems = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = normalizedItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const pendingOrder = {
    id: createId("pending-order"),
    customerName: customer.name || "Guest customer",
    customerEmail: customer.email || "guest@checkout.local",
    items: normalizedItems,
    totalItems,
    totalAmount,
    createdAt: new Date().toISOString(),
  };

  safeWrite(PENDING_ORDER_KEY, pendingOrder);
}

export function finalizePendingOrder(sessionId) {
  const pendingOrder = safeRead(PENDING_ORDER_KEY, null);
  if (!pendingOrder || !Array.isArray(pendingOrder.items) || !pendingOrder.items.length) {
    return null;
  }

  const orders = getOrders();
  const finalizedOrder = {
    ...pendingOrder,
    id: `ORD-${String(orders.length + 1001).padStart(4, "0")}`,
    paymentStatus: "paid",
    status: "new",
    stripeSessionId: sessionId || null,
    createdAt: new Date().toISOString(),
  };

  setOrders([finalizedOrder, ...orders]);
  if (canUseStorage()) {
    window.localStorage.removeItem(PENDING_ORDER_KEY);
  }
  return finalizedOrder;
}
