"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";

type ResetState = "checking" | "ready" | "success" | "error" | "missing";

type ResetResult = {
  success?: boolean;
  message?: string;
};

const API_BASE_URL = "https://astrajanma-backend.onrender.com";

export default function ResetPasswordPage() {
  const [state, setState] = useState<ResetState>("checking");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const receivedToken = params.get("token")?.trim() ?? "";

    if (!receivedToken) {
      setState("missing");
      setMessage(
        "This password-reset link is missing its security token. Please request a new reset email from AstraJanma."
      );
      return;
    }

    if (!/^[a-fA-F0-9]{64}$/.test(receivedToken)) {
      setState("error");
      setMessage(
        "This password-reset link is invalid. Please request a new reset email from AstraJanma."
      );
      return;
    }

    setToken(receivedToken);
    setState("ready");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (state !== "ready" || !token || loading) {
      return;
    }

    if (newPassword.length < 12 || newPassword.length > 128) {
      setMessage("Your password must contain between 12 and 128 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("The passwords do not match. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            newPassword,
          }),
        }
      );

      const result: ResetResult = await response.json();

      if (response.ok && result.success) {
        setState("success");
        setMessage(
          result.message || "Your password has been reset successfully."
        );
        setToken("");
        setNewPassword("");
        setConfirmPassword("");
        return;
      }

      setMessage(
        result.message ||
          "Password reset could not be completed. The link may be invalid or expired."
      );
    } catch {
      setMessage(
        "We could not connect to AstraJanma right now. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function openAstraJanma() {
    window.location.href = "astrajanma://";
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-12">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-xl items-center justify-center">
        <section className="w-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">
          <div className="flex justify-center">
            <Image
              src="/products/astrajanma/logo.png"
              alt="AstraJanma logo"
              width={160}
              height={160}
              priority
              className="h-32 w-32 object-contain sm:h-36 sm:w-36"
            />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#8B6508]">
            VEDIC WISDOM. AI GUIDANCE.
          </p>

          {state === "checking" && (
            <>
              <h1 className="mt-8 text-3xl font-bold text-[#0b2347]">
                Preparing Password Reset
              </h1>
              <p className="mx-auto mt-4 max-w-md leading-7 text-gray-600">
                Please wait while we check your reset link.
              </p>
              <div
                role="status"
                aria-label="Loading"
                className="mx-auto mt-8 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#8B6508]"
              />
            </>
          )}

          {state === "ready" && (
            <>
              <h1 className="mt-8 text-3xl font-bold text-[#0b2347]">
                Create New Password
              </h1>
              <p className="mx-auto mt-4 max-w-md leading-7 text-gray-600">
                Choose a strong password for your AstraJanma account.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5 text-left">
                <div>
                  <label
                    htmlFor="new-password"
                    className="mb-2 block text-sm font-semibold text-[#0b2347]"
                  >
                    New Password
                  </label>
                  <div className="flex rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-[#8B6508]">
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      minLength={12}
                      maxLength={128}
                      required
                      disabled={loading}
                      className="min-w-0 flex-1 rounded-l-xl bg-white px-4 py-3 text-base text-gray-900 outline-none"
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      disabled={loading}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="rounded-r-xl px-4 text-sm font-semibold text-[#8B6508] disabled:opacity-50"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Minimum 12 characters; maximum 128.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="mb-2 block text-sm font-semibold text-[#0b2347]"
                  >
                    Confirm New Password
                  </label>
                  <div className="flex rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-[#8B6508]">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      minLength={12}
                      maxLength={128}
                      required
                      disabled={loading}
                      className="min-w-0 flex-1 rounded-l-xl bg-white px-4 py-3 text-base text-gray-900 outline-none"
                      placeholder="Re-enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((current) => !current)
                      }
                      disabled={loading}
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirmation password"
                          : "Show confirmation password"
                      }
                      className="rounded-r-xl px-4 text-sm font-semibold text-[#8B6508] disabled:opacity-50"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {message && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
                  >
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-[#0b2347] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#163761] focus:outline-none focus:ring-2 focus:ring-[#8B6508] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Resetting Password..." : "Reset Password"}
                </button>
              </form>
            </>
          )}

          {state === "success" && (
            <>
              <div className="mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#f4f0df]">
                <span className="text-2xl text-[#8B6508]" aria-hidden="true">
                  ✓
                </span>
              </div>
              <h1 className="mt-6 text-3xl font-bold text-[#0b2347]">
                Password Updated
              </h1>
              <p className="mx-auto mt-4 max-w-md leading-7 text-gray-600">
                {message}
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
                You can now sign in to AstraJanma using your new password.
              </p>
              <button
                type="button"
                onClick={openAstraJanma}
                className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-[#0b2347] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#163761] focus:outline-none focus:ring-2 focus:ring-[#8B6508] focus:ring-offset-2"
              >
                Open AstraJanma
              </button>
            </>
          )}

          {(state === "error" || state === "missing") && (
            <>
              <div className="mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#f8fafc]">
                <span className="text-2xl text-[#8B6508]" aria-hidden="true">
                  !
                </span>
              </div>
              <h1 className="mt-6 text-3xl font-bold text-[#0b2347]">
                {state === "missing"
                  ? "Reset Link Incomplete"
                  : "Reset Link Invalid"}
              </h1>
              <p className="mx-auto mt-4 max-w-md leading-7 text-gray-600">
                {message}
              </p>
              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-500">
                For your security, request a fresh password-reset email from
                AstraJanma and use the newest link.
              </p>
              <button
                type="button"
                onClick={openAstraJanma}
                className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-[#0b2347] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#163761] focus:outline-none focus:ring-2 focus:ring-[#8B6508] focus:ring-offset-2"
              >
                Open AstraJanma
              </button>
            </>
          )}

          {state === "ready" && message && (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-left text-sm leading-6 text-red-800"
            >
              {message}
            </p>
          )}

          <div className="mt-10 border-t border-gray-100 pt-6">
            <p className="text-xs leading-5 text-gray-500">
              AstraJanma — Ancient Wisdom Meets Intelligent Technology
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Powered by AdhiKrishna Solutions LLP
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
