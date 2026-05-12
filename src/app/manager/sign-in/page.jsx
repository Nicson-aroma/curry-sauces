"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useStaff } from "../../../components/staff-provider";

export default function ManagerSignInPage() {
  const router = useRouter();
  const { signIn, currentUser, canAccessDashboard, useDefaultAdmin } = useStaff();
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (canAccessDashboard && currentUser) {
      router.replace("/admin");
    }
  }, [canAccessDashboard, currentUser, router]);

  function updateField(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    try {
      signIn(formValues);
      router.push("/admin");
    } catch (error) {
      setErrorMessage(error.message || "Unable to sign in.");
    }
  }

  function handleAdminAccess() {
    useDefaultAdmin();
    router.push("/admin");
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#130d0b,#341d14_45%,#fff7ea_100%)] px-4 py-10">
      <section className="mx-auto max-w-4xl rounded-[40px] border border-white/10 bg-white/94 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)] md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-[34px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)]/68 p-8">
            <p className="section-eyebrow">Manager sign in</p>
            <h1 className="mt-4 text-4xl font-semibold">Open the order dashboard</h1>
            <p className="mt-5 text-base leading-8 text-[color:var(--theme-muted)]">
              Approved managers and the seeded admin account can access the staff order dashboard here. This route is intentionally separate from the public shop navigation.
            </p>
            <div className="mt-8 rounded-[26px] border border-[color:var(--theme-border)] bg-white/72 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--theme-primary)]">Default admin account</p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--theme-foreground)]">
                Email: <span className="font-semibold">admin@meahs.local</span>
                <br />
                Password: <span className="font-semibold">Admin123!</span>
              </p>
              <button type="button" onClick={handleAdminAccess} className="primary-button mt-5">
                Use default admin
              </button>
            </div>
          </div>

          <div className="rounded-[34px] bg-white p-7 shadow-[0_18px_48px_rgba(0,0,0,0.08)]">
            <p className="section-eyebrow">Approved staff only</p>
            <h2 className="mt-3 text-3xl font-semibold">Sign in</h2>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="field-shell">
                Email
                <input
                  className="field-input"
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={updateField}
                  required
                />
              </label>

              <label className="field-shell">
                Password
                <input
                  className="field-input"
                  type="password"
                  name="password"
                  value={formValues.password}
                  onChange={updateField}
                  required
                />
              </label>

              <button type="submit" className="primary-button w-full justify-center">
                Sign in
              </button>
            </form>

            {errorMessage ? <p className="mt-4 text-sm font-medium text-red-700">{errorMessage}</p> : null}

            <p className="mt-6 text-sm text-[color:var(--theme-muted)]">
              Need a staff account? <Link href="/manager/sign-up" className="font-semibold text-[color:var(--theme-primary)]">Create one</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
