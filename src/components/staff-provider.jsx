"use client";

import { createContext, useContext, useEffect, useState } from "react";

import {
  authenticateStaffUser,
  canAccessDashboard,
  createOrder,
  createPendingManagerAccount,
  createSubscriber,
  createUser,
  deleteOrder,
  deleteSubscriber,
  deleteUser,
  getCurrentUser,
  getStaffSnapshot,
  setCurrentUserSession,
  signInAsDefaultAdmin,
  signOutStaffUser,
  updateOrder,
  updateOrderStatus,
  updateSubscriber,
  updateUser,
  updateUserRole,
} from "../lib/staff-storage";

const StaffContext = createContext(null);

function sanitizeUsers(users) {
  return users.map(({ password, ...user }) => user);
}

export function StaffProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [isReady, setIsReady] = useState(false);

  async function refresh() {
    const storedUser = getCurrentUser();
    const snapshot = await getStaffSnapshot();
    const nextUsers = sanitizeUsers(snapshot.users);
    const matchedUser = storedUser
      ? nextUsers.find((user) => user.id === storedUser.id) || null
      : null;

    setCurrentUserSession(matchedUser);
    setCurrentUser(matchedUser);
    setUsers(nextUsers);
    setOrders(snapshot.orders);
    setSubscribers(Array.isArray(snapshot.subscribers) ? snapshot.subscribers : []);
  }

  useEffect(() => {
    let isMounted = true;

    async function loadStaffData() {
      try {
        await refresh();
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    }

    loadStaffData();

    return () => {
      isMounted = false;
    };
  }, []);

  async function signUp(formValues) {
    const user = await createPendingManagerAccount(formValues);
    await refresh();
    return user;
  }

  async function signIn(formValues) {
    const user = await authenticateStaffUser(formValues);
    setCurrentUser(user);
    await refresh();
    return user;
  }

  async function useDefaultAdmin() {
    const user = await signInAsDefaultAdmin();
    setCurrentUser(user);
    await refresh();
    return user;
  }

  function signOut() {
    signOutStaffUser();
    setCurrentUser(null);
  }

  async function changeUserRole(userId, role) {
    const updatedUsers = await updateUserRole(userId, role);
    setUsers(updatedUsers);
    const storedUser = getCurrentUser();
    const matchedUser = storedUser
      ? updatedUsers.find((user) => user.id === storedUser.id) || null
      : null;
    setCurrentUserSession(matchedUser);
    setCurrentUser(matchedUser);
  }

  async function changeOrderStatus(orderId, status) {
    const updatedOrders = await updateOrderStatus(orderId, status);
    setOrders(updatedOrders);
  }

  async function createDashboardUser(formValues) {
    const user = await createUser(formValues);
    await refresh();
    return user;
  }

  async function updateDashboardUser(userId, formValues) {
    const updatedUsers = await updateUser(userId, formValues);
    setUsers(updatedUsers);
    const storedUser = getCurrentUser();
    const matchedUser = storedUser
      ? updatedUsers.find((user) => user.id === storedUser.id) || null
      : null;
    setCurrentUserSession(matchedUser);
    setCurrentUser(matchedUser);
  }

  async function deleteDashboardUser(userId) {
    const updatedUsers = await deleteUser(userId);
    setUsers(updatedUsers);
    const storedUser = getCurrentUser();
    const matchedUser = storedUser
      ? updatedUsers.find((user) => user.id === storedUser.id) || null
      : null;
    setCurrentUserSession(matchedUser);
    setCurrentUser(matchedUser);
  }

  async function createDashboardOrder(formValues) {
    const updatedOrders = await createOrder(formValues);
    setOrders(updatedOrders);
  }

  async function updateDashboardOrder(orderId, formValues) {
    const updatedOrders = await updateOrder(orderId, formValues);
    setOrders(updatedOrders);
  }

  async function deleteDashboardOrder(orderId) {
    const updatedOrders = await deleteOrder(orderId);
    setOrders(updatedOrders);
  }

  async function createDashboardSubscriber(formValues) {
    const subscriber = await createSubscriber(formValues);
    await refresh();
    return subscriber;
  }

  async function updateDashboardSubscriber(subscriberId, formValues) {
    const updatedSubscribers = await updateSubscriber(subscriberId, formValues);
    setSubscribers(updatedSubscribers);
  }

  async function deleteDashboardSubscriber(subscriberId) {
    const updatedSubscribers = await deleteSubscriber(subscriberId);
    setSubscribers(updatedSubscribers);
  }

  return (
    <StaffContext.Provider
      value={{
        currentUser,
        users,
        orders,
        subscribers,
        isReady,
        canAccessDashboard: canAccessDashboard(currentUser),
        signIn,
        signOut,
        signUp,
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
      }}
    >
      {children}
    </StaffContext.Provider>
  );
}

export function useStaff() {
  const context = useContext(StaffContext);

  if (!context) {
    throw new Error("useStaff must be used within a StaffProvider.");
  }

  return context;
}
