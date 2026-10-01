"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type VerificationState =
  | "checking"
  | "success"
  | "error"
  | "missing";

type VerificationResult = {
  success?: boolean;
  message?: string;
};

const API_BASE_URL = "http://localhost:3000";

export default function VerifyEmailPage() {
  const [state, setState] =
    useState<VerificationState>("checking");

  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setState("missing");
        setMessage(
          "This verification link is missing the required information."
        );
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/auth/verify-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token,
            }),
          }
        );

        const result: VerificationResult =
          await response.json();

        if (response.ok && result.success) {
          setState("success");
          setMessage(
            result.message ||
              "Email address verified successfully."
          );
          return;
        }

        setState("error");
        setMessage(
          result.message ||
            "Invalid or expired email verification token."
        );
      } catch (error) {
        console.error(
          "AstraJanma email verification request failed:",
          error
        );

        setState("error");
        setMessage(
          "We could not connect to AstraJanma right now. Please try again."
        );
      }
    };

    verifyEmail();
  }, []);

  const openAstraJanma = () => {
    window.location.href = "astrajanma://";
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-12">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-xl items-center justify-center">
        <section className="w-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">

          {/* AstraJanma Logo */}
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

          {/* Brand */}
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#8B6508]">
            VEDIC WISDOM. AI GUIDANCE.
          </p>

          {/* Checking */}
          {state === "checking" && (
            <>
              <h1 className="mt-8 text-3xl font-bold text-[#0b2347]">
                Verifying Your Email
              </h1>

              <p className="mx-auto mt-4 max-w-md leading-7 text-gray-600">
                Please wait while we securely verify your
                AstraJanma email address.
              </p>

              <div className="mx-auto mt-8 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#8B6508]" />
            </>
          )}

          {/* Success */}
          {state === "success" && (
            <>
              <div className="mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#f4f0df]">
                <span className="text-2xl text-[#8B6508]">
                  ✓
                </span>
              </div>

              <h1 className="mt-6 text-3xl font-bold text-[#0b2347]">
                Email Verified
              </h1>

              <p className="mx-auto mt-4 max-w-md leading-7 text-gray-600">
                {message}
              </p>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
                Your AstraJanma account is now ready. You can
                continue in the AstraJanma application.
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

          {/* Invalid / Expired */}
          {state === "error" && (
            <>
              <div className="mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#f8fafc]">
                <span className="text-2xl text-[#8B6508]">
                  !
                </span>
              </div>

              <h1 className="mt-6 text-3xl font-bold text-[#0b2347]">
                Verification Unsuccessful
              </h1>

              <p className="mx-auto mt-4 max-w-md leading-7 text-gray-600">
                {message}
              </p>

              <div className="mt-8 rounded-xl border border-gray-200 bg-[#f8fafc] p-5 text-left">
                <p className="text-sm leading-6 text-gray-600">
                  If your verification link has expired, request a
                  new verification email from the AstraJanma
                  application.
                </p>
              </div>
            </>
          )}

          {/* Missing Token */}
          {state === "missing" && (
            <>
              <div className="mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#f8fafc]">
                <span className="text-2xl text-[#8B6508]">
                  !
                </span>
              </div>

              <h1 className="mt-6 text-3xl font-bold text-[#0b2347]">
                Verification Link Incomplete
              </h1>

              <p className="mx-auto mt-4 max-w-md leading-7 text-gray-600">
                {message}
              </p>

              <div className="mt-8 rounded-xl border border-gray-200 bg-[#f8fafc] p-5 text-left">
                <p className="text-sm leading-6 text-gray-600">
                  Please use the latest verification email sent
                  by AstraJanma.
                </p>
              </div>
            </>
          )}

          {/* Footer */}
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
