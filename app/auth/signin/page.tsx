"use client";

// The sign-in screen: email-or-username plus a password, with a fallback to a
// one-time code. Everything here is pretend -- there is no real account
// check, so "signing in" just moves on to the feed after checking the boxes
// aren't empty.

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { validateSignInEmailOrUsername, validateSignInPassword } from "@/lib/validation";

export default function SignInPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const idError = validateSignInEmailOrUsername(identifier);
    const pwError = validateSignInPassword(password);
    setIdentifierError(idError ?? "");
    setPasswordError(pwError ?? "");
    if (idError || pwError) return;

    // There is no real backend to check credentials against yet, so any
    // filled-in sign-in is treated as successful and sent to the feed.
    router.push("/");
  }

  return (
    <AuthShell>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-brand">Maroon Market</h1>
        <p className="mt-1.5 text-[13px] text-muted-text">
          Buy and sell with verified Hokies
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email or username" htmlFor="signin-identifier" error={identifierError}>
          <Input
            id="signin-identifier"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              if (identifierError) setIdentifierError("");
            }}
            aria-invalid={identifierError ? true : undefined}
            className="cursor-text text-[13px]"
          />
        </Field>

        <div>
          <Field label="Password" htmlFor="signin-password" error={passwordError}>
            <Input
              id="signin-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError("");
              }}
              aria-invalid={passwordError ? true : undefined}
              className="cursor-text text-[13px]"
            />
          </Field>
          <div className="mt-1.5 text-right">
            {/* Mock only -- there is no real password-reset flow behind this link. */}
            <Link href="/auth/signin" className="cursor-pointer text-[12px] text-brand hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          className="h-11 w-full cursor-pointer rounded-lg bg-brand text-[13px] font-semibold text-white outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Sign in
        </button>
      </form>

      <p className="mt-5 text-center text-[13px] text-muted-text">
        New here?{" "}
        <Link href="/auth/signup" className="cursor-pointer font-semibold text-brand hover:underline">
          Create an account
        </Link>
      </p>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-hairline" />
        <span className="text-[12px] text-muted-text">or</span>
        <div className="h-px flex-1 bg-hairline" />
      </div>

      {/* Mock only -- routes straight to the feed, same as password sign-in above. */}
      <button
        type="button"
        onClick={() => router.push("/")}
        className="h-11 w-full cursor-pointer rounded-lg border border-input-border text-[13px] font-semibold text-foreground outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        Sign in with a one-time code
      </button>
    </AuthShell>
  );
}
