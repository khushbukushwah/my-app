"use client";

import React, { useState } from "react";

/**
 * NextLogin.tsx
 * A self-contained Next.js (app router / client) React component in TypeScript (TSX)
 * - Email / password form
 * - Client-side validation
 * - Example mock-auth (replace with your API call)
 * - "Forgot password" flow that requests an email and simulates sending a reset link
 * - Tailwind CSS classes used for styling (change to your style system if needed)
 *
 * Example test credentials (for the mock server in this component):
 *   email:  user@example.com
 *   password: Password123!
 *
 * How to use:
 * 1. Drop this file into a Next.js app route or component tree (e.g. app/(auth)/login/page.tsx or components/NextLogin.tsx)
 * 2. Import and render <NextLogin /> inside a client component.
 * 3. Replace `mockSignIn` and `mockSendResetEmail` with real API calls.
 */

type FormState = {
  email: string;
  password: string;
};

export default function NextLogin() {
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Forgot password modal state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  // Simple email regex for client-side validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Mock sign-in: replace with real API call (fetch/post to /api/auth/login)
  async function mockSignIn(email: string, password: string) {
    await new Promise((r) => setTimeout(r, 700)); // simulate latency
    // sample test credential
    if (email === "user@example.com" && password === "Password123!") {
      return { ok: true, token: "mock-jwt-token" };
    }
    return { ok: false, message: "Invalid email or password" };
  }

  // Mock forgot password: replace with real API call that sends reset email
  async function mockSendResetEmail(email: string) {
    await new Promise((r) => setTimeout(r, 600));
    if (!emailRegex.test(email)) {
      return { ok: false, message: "Please provide a valid email" };
    }
    // pretend success even if email not registered (security best practice)
    return { ok: true };
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    setError(null);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await mockSignIn(form.email, form.password);
      if (res.ok) {
        setMessage("Logged in successfully (mock). Token: " + res.token);
        // TODO: save token in cookie/localStorage and redirect to protected page
        // example: localStorage.setItem('token', res.token); router.push('/dashboard')
      } else {
        setError(res.message || "Login failed.");
      }
    } catch (err) {
      setError("Unexpected error. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotMessage(null);
    setLoading(true);
    try {
      const res = await mockSendResetEmail(forgotEmail);
      if (res.ok) {
        setForgotMessage(
          "If that email exists, we sent a password reset link. (mock)"
        );
        setForgotEmail("");
      } else {
        setForgotError(res.message || "Could not send reset email.");
      }
    } catch (err) {
      setForgotError("Unexpected error while sending reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-slate-900 p-6">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold mb-2 text-center">Sign in</h1>
        <p className="text-sm text-center text-gray-500 mb-6">
          Use the example credentials: <code>user@example.com</code> /{" "}
          <code>Password123!</code>
        </p>

        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
        {message && (
          <div className="text-green-600 text-sm mb-4 break-words">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm">Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
              required
            />
          </label>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForgot(true);
                setForgotError(null);
                setForgotMessage(null);
              }}
              className="text-sm underline text-indigo-600"
            >
              Forgot password?
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <span className="text-indigo-600 font-medium">Sign up</span>
        </div>
      </div>

      {/* Forgot password modal (simple) */}
      {showForgot && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowForgot(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-2">Reset password</h2>
            <p className="text-sm text-gray-500 mb-4">
              Enter your email and we'll send password reset instructions.
            </p>

            {forgotError && (
              <div className="text-red-600 text-sm mb-2">{forgotError}</div>
            )}
            {forgotMessage && (
              <div className="text-green-600 text-sm mb-2">{forgotMessage}</div>
            )}

            <form onSubmit={handleForgot} className="space-y-3">
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="you@company.com"
                className="block w-full rounded-md border-gray-200 shadow-sm p-2"
                required
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-3 py-2 rounded-lg border"
                  onClick={() => setShowForgot(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-3 py-2 rounded-lg bg-indigo-600 text-white"
                >
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
