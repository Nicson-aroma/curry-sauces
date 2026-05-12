"use client";

import { createContext, useContext, useEffect, useState } from "react";

import {
  authenticateStaffUser,
  canAccessDashboard,
  createPendingManagerAccount,
  ensureStaffStorage,
  getCurrentUser,
  getOrders,
  getUsers,
  signInAsDefaultAdmin,
  signOutStaffUser,
  updateOrderStatus,
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
  const [isReady, setIsReady] = useState(false);

  function refresh() {
    ensureStaffStorage();
    setCurrentUser(getCurrentUser());
    setUsers(sanitizeUsers(getUsers()));
    setOrders(getOrders());
  }

  useEffect(() => {
    refresh();
    setIsReady(true);
  }, []);

  function signUp(formValues) {
    const user = createPendingManagerAccount(formValues);
    setUsers(sanitizeUsers(getUsers()));
    return user;
  }

  function signIn(formValues) {
    const user = authenticateStaffUser(formValues);
    setCurrentUser(user);
    setUsers(sanitizeUsers(getUsers()));
    return user;
  }

  function useDefaultAdmin() {
    const user = signInAsDefaultAdmin();
    setCurrentUser(user);
    return user;
  }

  function signOut() {
    signOutStaffUser();
    setCurrentUser(null);
  }

  function changeUserRole(userId, role) {
    const updatedUsers = updateUserRole(userId, role);
    setUsers(updatedUsers);
    setCurrentUser(getCurrentUser());
  }

  function changeOrderStatus(orderId, status) {
    const updatedOrders = updateOrderStatus(orderId, status);
    setOrders(updatedOrders);
  }

  return (
    <StaffContext.Provider
      value={{
        currentUser,
        users,
        orders,
        isReady,
        canAccessDashboard: canAccessDashboard(currentUser),
        signIn,
        signOut,
        signUp,
        useDefaultAdmin,
        changeUserRole,
        changeOrderStatus,
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
