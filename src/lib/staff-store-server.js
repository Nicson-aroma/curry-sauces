import bcrypt from "bcryptjs";

import { getDatabase } from "./mongodb";
import {
  DEFAULT_ADMIN,
  ORDER_STATUS,
  ORDER_STATUS_OPTIONS,
  STAFF_ROLE_OPTIONS,
  STAFF_ROLES,
  SUBSCRIBER_STATUS,
  SUBSCRIBER_STATUS_OPTIONS,
} from "./staff-constants";
import { productDetailsBySlug } from "./meahs-data";

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

function createId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();
}

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  const { _id, passwordHash, ...safeUser } = user;
  return safeUser;
}

function sanitizeSubscriber(subscriber) {
  if (!subscriber) {
    return null;
  }

  const { _id, ...safeSubscriber } = subscriber;
  return safeSubscriber;
}

async function getCollections() {
  const db = await getDatabase();
  const users = db.collection("users");
  const orders = db.collection("orders");
  const subscribers = db.collection("subscribers");

  await Promise.all([
    users.createIndex({ email: 1 }, { unique: true }),
    users.createIndex({ id: 1 }, { unique: true }),
    orders.createIndex({ id: 1 }, { unique: true }),
    orders.createIndex({ stripeSessionId: 1 }, { unique: true, sparse: true }),
    orders.createIndex({ createdAt: -1 }),
    subscribers.createIndex({ email: 1 }, { unique: true }),
    subscribers.createIndex({ createdAt: -1 }),
  ]);

  return { users, orders, subscribers };
}

export async function ensureStaffData() {
  const { users, orders } = await getCollections();
  const existingAdmin = await users.findOne({ email: DEFAULT_ADMIN.email });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
    await users.insertOne({
      id: DEFAULT_ADMIN.id,
      name: DEFAULT_ADMIN.name,
      email: DEFAULT_ADMIN.email,
      passwordHash,
      role: DEFAULT_ADMIN.role,
      createdAt: DEFAULT_ADMIN.createdAt,
    });
  }

  const orderCount = await orders.countDocuments();
  if (!orderCount) {
    await orders.insertMany(seededOrders);
  }
}

export async function listUsers() {
  await ensureStaffData();
  const { users } = await getCollections();
  const results = await users.find({}, { projection: { _id: 0, passwordHash: 0 } }).sort({ createdAt: -1 }).toArray();
  return results;
}

export async function listOrders() {
  await ensureStaffData();
  const { orders } = await getCollections();
  return orders.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
}

export async function listSubscribers() {
  await ensureStaffData();
  const { subscribers } = await getCollections();
  return subscribers.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
}

async function validateUniqueUserEmail(users, email, excludeUserId) {
  const existingUser = await users.findOne({ email });
  if (existingUser && existingUser.id !== excludeUserId) {
    throw new Error("A user with that email already exists.");
  }
}

export async function createPendingManagerAccount({ name, email, password }) {
  await ensureStaffData();
  const { users } = await getCollections();
  const normalizedEmail = String(email).trim().toLowerCase();

  await validateUniqueUserEmail(users, normalizedEmail);

  const passwordHash = await bcrypt.hash(String(password), 10);
  const newUser = {
    id: createId("staff"),
    name: String(name).trim(),
    email: normalizedEmail,
    passwordHash,
    role: STAFF_ROLES.PENDING,
    createdAt: new Date().toISOString(),
  };

  await users.insertOne(newUser);
  return sanitizeUser(newUser);
}

export async function createStaffUser({ name, email, password, role = STAFF_ROLES.MANAGER }) {
  await ensureStaffData();
  const { users } = await getCollections();
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!String(name || "").trim()) {
    throw new Error("Name is required.");
  }

  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error("Please enter a valid email address.");
  }

  if (!String(password || "").trim()) {
    throw new Error("Password is required.");
  }

  if (!STAFF_ROLE_OPTIONS.includes(role)) {
    throw new Error("Invalid staff role.");
  }

  await validateUniqueUserEmail(users, normalizedEmail);

  const user = {
    id: createId("staff"),
    name: String(name).trim(),
    email: normalizedEmail,
    passwordHash: await bcrypt.hash(String(password), 10),
    role,
    createdAt: new Date().toISOString(),
  };

  await users.insertOne(user);
  return sanitizeUser(user);
}

export async function authenticateStaffUser({ email, password }) {
  await ensureStaffData();
  const { users } = await getCollections();
  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await users.findOne({ email: normalizedEmail });

  if (!user || !(await bcrypt.compare(String(password), user.passwordHash))) {
    throw new Error("Incorrect email or password.");
  }

  if (user.role === STAFF_ROLES.PENDING) {
    throw new Error("Your account is waiting for admin approval.");
  }

  return sanitizeUser(user);
}

export async function getDefaultAdminUser() {
  await ensureStaffData();
  const { users } = await getCollections();
  return sanitizeUser(await users.findOne({ email: DEFAULT_ADMIN.email }));
}

export async function updateUserRole(userId, role) {
  await ensureStaffData();

  if (!STAFF_ROLE_OPTIONS.includes(role)) {
    throw new Error("Invalid staff role.");
  }

  const { users } = await getCollections();
  await users.updateOne({ id: userId }, { $set: { role } });
  return listUsers();
}

export async function updateUser(userId, { name, email, role, password }) {
  await ensureStaffData();
  const { users } = await getCollections();
  const existingUser = await users.findOne({ id: userId });

  if (!existingUser) {
    throw new Error("User not found.");
  }

  const update = {};

  if (typeof name === "string") {
    if (!name.trim()) {
      throw new Error("Name is required.");
    }
    update.name = name.trim();
  }

  if (typeof email === "string") {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new Error("Please enter a valid email address.");
    }
    await validateUniqueUserEmail(users, normalizedEmail, userId);
    update.email = normalizedEmail;
  }

  if (typeof role === "string") {
    if (!STAFF_ROLE_OPTIONS.includes(role)) {
      throw new Error("Invalid staff role.");
    }
    update.role = role;
  }

  if (typeof password === "string" && password.trim()) {
    update.passwordHash = await bcrypt.hash(password, 10);
  }

  await users.updateOne({ id: userId }, { $set: update });
  return listUsers();
}

export async function deleteUser(userId) {
  await ensureStaffData();
  const { users } = await getCollections();
  const existingUser = await users.findOne({ id: userId });

  if (!existingUser) {
    throw new Error("User not found.");
  }

  if (existingUser.email === DEFAULT_ADMIN.email) {
    throw new Error("The default admin account cannot be deleted.");
  }

  await users.deleteOne({ id: userId });
  return listUsers();
}

export async function updateOrderStatus(orderId, status) {
  await ensureStaffData();

  if (!ORDER_STATUS_OPTIONS.includes(status)) {
    throw new Error("Invalid order status.");
  }

  const { orders } = await getCollections();
  await orders.updateOne({ id: orderId }, { $set: { status } });
  return listOrders();
}

function buildOrderItems(items) {
  const normalizedOrder = normalizeOrderItems(items);

  if (!normalizedOrder.items.length) {
    throw new Error("At least one valid order item is required.");
  }

  return normalizedOrder;
}

export function normalizeOrderItems(items) {
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
  const totalAmount = normalizedItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return {
    items: normalizedItems,
    totalItems,
    totalAmount,
  };
}

function normalizeAddress(address) {
  if (!address || typeof address !== "object") {
    return null;
  }

  const normalized = {
    line1: address.line1 || "",
    line2: address.line2 || "",
    city: address.city || "",
    state: address.state || "",
    postal_code: address.postal_code || "",
    country: address.country || "",
  };

  return Object.values(normalized).some(Boolean) ? normalized : null;
}

export async function createOrderRecord({ items, customer = {}, stripeSessionId }) {
  await ensureStaffData();
  const { orders } = await getCollections();
  const normalizedOrder = normalizeOrderItems(items);

  if (!normalizedOrder.items.length) {
    throw new Error("No valid products were found in the cart.");
  }

  if (normalizedOrder.totalItems !== 6) {
    throw new Error("Orders must contain exactly 6 sauces before payment.");
  }

  const order = {
    id: `ORD-${Date.now().toString().slice(-6)}${Math.random().toString().slice(2, 4)}`,
    customerName: customer.name || "Guest customer",
    customerEmail: customer.email || "guest@checkout.local",
    customerAddress: normalizeAddress(customer.address),
    items: normalizedOrder.items,
    totalItems: normalizedOrder.totalItems,
    totalAmount: normalizedOrder.totalAmount,
    paymentStatus: "pending",
    status: ORDER_STATUS.AWAITING_PAYMENT,
    stripeSessionId: stripeSessionId || null,
    createdAt: new Date().toISOString(),
  };

  await orders.insertOne(order);
  return order;
}

export async function createManualOrder({
  customerName,
  customerEmail,
  customerAddress,
  status = ORDER_STATUS.NEW,
  paymentStatus = "paid",
  items,
}) {
  await ensureStaffData();
  const { orders } = await getCollections();
  const normalizedOrder = buildOrderItems(items);

  if (!String(customerName || "").trim()) {
    throw new Error("Customer name is required.");
  }

  const normalizedEmail = String(customerEmail || "").trim().toLowerCase();
  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error("Please enter a valid email address.");
  }

  if (![ORDER_STATUS.AWAITING_PAYMENT, ...ORDER_STATUS_OPTIONS].includes(status)) {
    throw new Error("Invalid order status.");
  }

  const order = {
    id: `ORD-${Date.now().toString().slice(-6)}${Math.random().toString().slice(2, 4)}`,
    customerName: customerName.trim(),
    customerEmail: normalizedEmail,
    customerAddress: normalizeAddress(customerAddress),
    items: normalizedOrder.items,
    totalItems: normalizedOrder.totalItems,
    totalAmount: normalizedOrder.totalAmount,
    paymentStatus: paymentStatus || "paid",
    status,
    stripeSessionId: null,
    createdAt: new Date().toISOString(),
  };

  await orders.insertOne(order);
  return listOrders();
}

export async function updateOrder(
  orderId,
  { customerName, customerEmail, customerAddress, items, status, paymentStatus }
) {
  await ensureStaffData();
  const { orders } = await getCollections();
  const existingOrder = await orders.findOne({ id: orderId });

  if (!existingOrder) {
    throw new Error("Order not found.");
  }

  const update = {};

  if (typeof customerName === "string") {
    if (!customerName.trim()) {
      throw new Error("Customer name is required.");
    }
    update.customerName = customerName.trim();
  }

  if (typeof customerEmail === "string") {
    const normalizedEmail = customerEmail.trim().toLowerCase();
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new Error("Please enter a valid email address.");
    }
    update.customerEmail = normalizedEmail;
  }

  if (typeof customerAddress !== "undefined") {
    update.customerAddress = normalizeAddress(customerAddress);
  }

  if (typeof status === "string") {
    if (![ORDER_STATUS.AWAITING_PAYMENT, ...ORDER_STATUS_OPTIONS].includes(status)) {
      throw new Error("Invalid order status.");
    }
    update.status = status;
  }

  if (typeof paymentStatus === "string" && paymentStatus.trim()) {
    update.paymentStatus = paymentStatus.trim().toLowerCase();
  }

  if (typeof items !== "undefined") {
    const normalizedOrder = buildOrderItems(items);
    update.items = normalizedOrder.items;
    update.totalItems = normalizedOrder.totalItems;
    update.totalAmount = normalizedOrder.totalAmount;
  }

  await orders.updateOne({ id: orderId }, { $set: update });
  return listOrders();
}

export async function deleteOrder(orderId) {
  await ensureStaffData();
  const { orders } = await getCollections();
  await orders.deleteOne({ id: orderId });
  return listOrders();
}

export async function finalizeOrderBySession(sessionId, sessionDetails = {}) {
  await ensureStaffData();
  const { orders } = await getCollections();

  if (!sessionId) {
    throw new Error("Missing Stripe session ID.");
  }

  const existingOrder = await orders.findOne({ stripeSessionId: sessionId });

  if (!existingOrder) {
    return null;
  }

  const customerName = sessionDetails.name || existingOrder.customerName || "Guest customer";
  const customerEmail =
    sessionDetails.email || existingOrder.customerEmail || "guest@checkout.local";
  const customerAddress =
    normalizeAddress(sessionDetails.address) || normalizeAddress(existingOrder.customerAddress);
  const paymentStatus = sessionDetails.paymentStatus || "paid";

  await orders.updateOne(
    { stripeSessionId: sessionId },
    {
      $set: {
        customerName,
        customerEmail,
        customerAddress,
        paymentStatus,
        status:
          paymentStatus === "paid"
            ? ORDER_STATUS.NEW
            : existingOrder.status || ORDER_STATUS.AWAITING_PAYMENT,
      },
    }
  );

  return orders.findOne({ stripeSessionId: sessionId }, { projection: { _id: 0 } });
}

export async function createSubscriber({ email, source }) {
  await ensureStaffData();
  const { subscribers } = await getCollections();

  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();

  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error("Please enter a valid email address.");
  }

  const existingSubscriber = await subscribers.findOne({ email: normalizedEmail });
  if (existingSubscriber) {
    throw new Error("This email is already subscribed.");
  }

  const subscriber = {
    id: createId("subscriber"),
    email: normalizedEmail,
    source: source || "website",
    status: "active",
    createdAt: new Date().toISOString(),
  };

  await subscribers.insertOne(subscriber);
  return sanitizeSubscriber(subscriber);
}

export async function createStaffSubscriber({ email, source, status = SUBSCRIBER_STATUS.ACTIVE }) {
  await ensureStaffData();

  if (!SUBSCRIBER_STATUS_OPTIONS.includes(status)) {
    throw new Error("Invalid subscriber status.");
  }

  const subscriber = await createSubscriber({ email, source });
  if (status !== SUBSCRIBER_STATUS.ACTIVE) {
    const updatedSubscribers = await updateSubscriber(subscriber.id, { status });
    return updatedSubscribers.find((entry) => entry.id === subscriber.id) || subscriber;
  }
  return subscriber;
}

export async function updateSubscriber(subscriberId, { email, source, status }) {
  await ensureStaffData();
  const { subscribers } = await getCollections();
  const existingSubscriber = await subscribers.findOne({ id: subscriberId });

  if (!existingSubscriber) {
    throw new Error("Subscriber not found.");
  }

  const update = {};

  if (typeof email === "string") {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new Error("Please enter a valid email address.");
    }

    const duplicate = await subscribers.findOne({ email: normalizedEmail });
    if (duplicate && duplicate.id !== subscriberId) {
      throw new Error("This email is already subscribed.");
    }

    update.email = normalizedEmail;
  }

  if (typeof source === "string" && source.trim()) {
    update.source = source.trim();
  }

  if (typeof status === "string") {
    if (!SUBSCRIBER_STATUS_OPTIONS.includes(status)) {
      throw new Error("Invalid subscriber status.");
    }
    update.status = status;
  }

  await subscribers.updateOne({ id: subscriberId }, { $set: update });
  return listSubscribers();
}

export async function deleteSubscriber(subscriberId) {
  await ensureStaffData();
  const { subscribers } = await getCollections();
  await subscribers.deleteOne({ id: subscriberId });
  return listSubscribers();
}
