"use client";

// Sign-up step 2: the six-digit code that proves the person can actually read
// email sent to the VT address they just typed. In this prototype there is no
// real code being sent or checked -- any six digits are accepted.

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupProgress } from "@/components/auth/signup-progress";
import { OtpInput } from "@/components/auth/otp-input";
import { useSignupDraft } from "@/lib/signup-context";
import { validateOtpCode } from "@/lib/validation";

// How many seconds someone has to wait before "Resend code" appears. Chosen
// to match the design spec exactly (0:42).
const RESEND_SECONDS = 42;

export default function SignupVerifyPage() {
  const router = useRouter();
  const { draft } = useSignupDraft();

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  // Ticks the countdown down once a second until it hits zero, at which
  // point "Resend in 0:xx" turns into a clickable "Resend code" link.
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  function handleResend() {
    // Mock only -- no code is actually being sent again. This just restarts
    // the wait so the countdown UI can be tried again.
    setSecondsLeft(RESEND_SECONDS);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const message = validateOtpCode(digits);
    if (message) {
      setError(message);
      return;
    }
    router.push("/auth/signup/profile");
  }

  // Turns 42 into "0:42", 5 into "0:05", so the countdown always reads as
  // minutes:seconds even though it never actually reaches a full minute here.
  const countdownLabel = `0:${String(secondsLeft).padStart(2, "0")}`;

  return (
    <AuthShell backHref="/auth/signup">
      <SignupProgress step={1} />

      <h1 className="text-xl font-semibold text-foreground">Enter your code</h1>
      <p className="mt-1.5 text-[13px] text-muted-text">
        We sent a code to {draft.email || "your VT email"}. It expires in 10 minutes.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <OtpInput
          value={digits}
          onChange={(next) => {
            setDigits(next);
            if (error) setError("");
          }}
          error={error}
        />

        <button
          type="submit"
          className="h-11 w-full cursor-pointer rounded-lg bg-brand text-[13px] font-semibold text-white outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Verify
        </button>

        <p className="text-center text-[12px] text-muted-text">
          Didn&apos;t get it?{" "}
          {secondsLeft > 0 ? (
            <span>Resend in {countdownLabel}</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="cursor-pointer font-semibold text-brand hover:underline"
            >
              Resend code
            </button>
          )}
        </p>
      </form>
    </AuthShell>
  );
}
