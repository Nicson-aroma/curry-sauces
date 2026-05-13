export const STAFF_ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  PENDING: "pending",
};

export const STAFF_ROLE_OPTIONS = [
  STAFF_ROLES.PENDING,
  STAFF_ROLES.MANAGER,
  STAFF_ROLES.ADMIN,
];

export const ORDER_STATUS = {
  AWAITING_PAYMENT: "awaiting_payment",
  NEW: "new",
  PROCESSING: "processing",
  READY: "ready",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const DEFAULT_ADMIN = {
  id: "staff-admin-1",
  name: "Meah's Admin",
  email: "admin@meahs.local",
  password: "Admin123!",
  role: STAFF_ROLES.ADMIN,
  createdAt: "2026-05-12T09:00:00.000Z",
};

export const ORDER_STATUS_OPTIONS = [
  ORDER_STATUS.NEW,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.READY,
  ORDER_STATUS.COMPLETED,
  ORDER_STATUS.CANCELLED,
];

export const SUBSCRIBER_STATUS = {
  ACTIVE: "active",
  UNSUBSCRIBED: "unsubscribed",
};

export const SUBSCRIBER_STATUS_OPTIONS = [
  SUBSCRIBER_STATUS.ACTIVE,
  SUBSCRIBER_STATUS.UNSUBSCRIBED,
];
