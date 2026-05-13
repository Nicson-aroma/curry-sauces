"use client";

import { DEFAULT_ADMIN, STAFF_ROLES } from "./staff-constants";

const CURRENT_USER_KEY = "meahs-staff-current-user";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function getStoredCurrentUser() {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const value = window.localStorage.getItem(CURRENT_USER_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function setStoredCurrentUser(user) {
  if (!canUseStorage()) {
    return;
  }

  if (!user) {
    window.localStorage.removeItem(CURRENT_USER_KEY);
    return;
  }

  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

async function parseResponse(response, fallbackMessage) {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || fallbackMessage);
  }

  return payload;
}

export { DEFAULT_ADMIN, STAFF_ROLES };

export function getCurrentUser() {
  return getStoredCurrentUser();
}

export function signOutStaffUser() {
  setStoredCurrentUser(null);
}

export function setCurrentUserSession(user) {
  setStoredCurrentUser(user);
}

export function canAccessDashboard(user) {
  return user?.role === STAFF_ROLES.ADMIN || user?.role === STAFF_ROLES.MANAGER;
}

export async function getStaffSnapshot() {
  const payload = await parseResponse(
    await fetch("/api/staff/bootstrap", { cache: "no-store" }),
    "Unable to load staff data."
  );

  return {
    users: Array.isArray(payload.users) ? payload.users : [],
    orders: Array.isArray(payload.orders) ? payload.orders : [],
    subscribers: Array.isArray(payload.subscribers) ? payload.subscribers : [],
  };
}

export async function createPendingManagerAccount(formValues) {
  const payload = await parseResponse(
    await fetch("/api/staff/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    }),
    "Unable to create account."
  );

  return payload.user;
}

export async function authenticateStaffUser(formValues) {
  const payload = await parseResponse(
    await fetch("/api/staff/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    }),
    "Unable to sign in."
  );

  setStoredCurrentUser(payload.user);
  return payload.user;
}

export async function signInAsDefaultAdmin() {
  const payload = await parseResponse(
    await fetch("/api/staff/default-admin", { method: "POST" }),
    "Unable to load the default admin account."
  );

  setStoredCurrentUser(payload.user);
  return payload.user;
}

export async function updateUserRole(userId, role) {
  const payload = await parseResponse(
    await fetch(`/api/staff/users/${userId}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    }),
    "Unable to update user role."
  );

  return payload.users;
}

export async function createUser(user) {
  const payload = await parseResponse(
    await fetch("/api/staff/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }),
    "Unable to create user."
  );

  return payload.user;
}

export async function updateUser(userId, user) {
  const payload = await parseResponse(
    await fetch(`/api/staff/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }),
    "Unable to update user."
  );

  return payload.users;
}

export async function deleteUser(userId) {
  const payload = await parseResponse(
    await fetch(`/api/staff/users/${userId}`, {
      method: "DELETE",
    }),
    "Unable to delete user."
  );

  return payload.users;
}

export async function updateOrderStatus(orderId, status) {
  const payload = await parseResponse(
    await fetch(`/api/staff/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }),
    "Unable to update order status."
  );

  return payload.orders;
}

export async function createOrder(order) {
  const payload = await parseResponse(
    await fetch("/api/staff/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    }),
    "Unable to create order."
  );

  return payload.orders;
}

export async function updateOrder(orderId, order) {
  const payload = await parseResponse(
    await fetch(`/api/staff/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    }),
    "Unable to update order."
  );

  return payload.orders;
}

export async function deleteOrder(orderId) {
  const payload = await parseResponse(
    await fetch(`/api/staff/orders/${orderId}`, {
      method: "DELETE",
    }),
    "Unable to delete order."
  );

  return payload.orders;
}

export async function createSubscriber(subscriber) {
  const payload = await parseResponse(
    await fetch("/api/staff/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscriber),
    }),
    "Unable to create subscriber."
  );

  return payload.subscriber;
}

export async function updateSubscriber(subscriberId, subscriber) {
  const payload = await parseResponse(
    await fetch(`/api/staff/subscribers/${subscriberId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscriber),
    }),
    "Unable to update subscriber."
  );

  return payload.subscribers;
}

export async function deleteSubscriber(subscriberId) {
  const payload = await parseResponse(
    await fetch(`/api/staff/subscribers/${subscriberId}`, {
      method: "DELETE",
    }),
    "Unable to delete subscriber."
  );

  return payload.subscribers;
}

export async function finalizePendingOrder(sessionId) {
  const payload = await parseResponse(
    await fetch("/api/orders/finalize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    }),
    "Unable to finalize order."
  );

  return payload.order || null;
}
