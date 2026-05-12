"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useStaff } from "../../../components/staff-provider";

export default function ManagerSignUpPage() {
  const router = useRouter();
  const { signUp } = useStaff();
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function updateField(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      signUp(formValues);
      setSuccessMessage(
        "Account created. An admin must change your role from pending to manager before you can view orders."
      );
      setFormValues({ name: "", email: "", password: "" });
    } catch (error) {
      setErrorMessage(error.message || "Unable to create account.");
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#1f120d,#412116_45%,#fff7ea_100%)] px-4 py-10">
      <section className="mx-auto max-w-5xl rounded-[40px] border border-white/10 bg-white/92 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)] md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[34px] bg-[linear-gradient(135deg,#8B1E1E,#C34D22,#F5A623)] p-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/76">Staff access</p>
            <h1 className="mt-4 text-4xl font-semibold">Create a manager request</h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/82">
              This page is separate from the shop navigation. Sign up here, then let an admin approve your account so you can manage orders.
            </p>
            <div className="mt-8 rounded-[26px] border border-white/18 bg-white/10 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/78">Default admin</p>
              <p className="mt-3 text-base leading-7 text-white/86">
                Email: <span className="font-semibold">admin@meahs.local</span>
                <br />
                Password: <span className="font-semibold">Admin123!</span>
              </p>
            </div>
          </div>

          <div className="rounded-[34px] border border-[color:var(--theme-border)] bg-white/86 p-7 shadow-[0_18px_48px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="section-eyebrow">Manager sign up</p>
                <h2 className="mt-3 text-3xl font-semibold">Request access</h2>
              </div>
              <button
                type="button"
                onClick={() => router.push("/admin")}
                className="secondary-button"
              >
                Admin panel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="field-shell">
                Full name
                <input
                  className="field-input"
                  name="name"
                  value={formValues.name}
                  onChange={updateField}
                  placeholder="Manager name"
                  required
                />
              </label>

              <label className="field-shell">
                Email
                <input
                  className="field-input"
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={updateField}
                  placeholder="manager@example.com"
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
                  placeholder="Choose a password"
                  required
                />
              </label>

              <button type="submit" className="primary-button w-full justify-center">
                Create request
              </button>
            </form>

            {errorMessage ? <p className="mt-4 text-sm font-medium text-red-700">{errorMessage}</p> : null}
            {successMessage ? <p className="mt-4 text-sm font-medium text-[#1D5E34]">{successMessage}</p> : null}

            <p className="mt-6 text-sm text-[color:var(--theme-muted)]">
              Already approved? <Link href="/manager/sign-in" className="font-semibold text-[color:var(--theme-primary)]">Sign in</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
