"use client";

// Sign-up step 1: the person types their Virginia Tech email so we can send
// them a verification code. This is the only proof, in this app, that
// someone is actually a current VT student.

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupProgress } from "@/components/auth/signup-progress";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSignupDraft } from "@/lib/signup-context";
import { validateVTEmail } from "@/lib/validation";

export default function SignupEmailPage() {
  const router = useRouter();
  const { draft, updateDraft } = useSignupDraft();
  const [email, setEmail] = useState(draft.email);
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const message = validateVTEmail(email);
    if (message) {
      setError(message);
      return;
    }
    // Remember the email in the shared draft so later steps (and the final
    // "done" screen) can use it, then move on to entering the code.
    updateDraft({ email: email.trim() });
    router.push("/auth/signup/verify");
  }

  return (
    <AuthShell backHref="/auth/signin">
      <SignupProgress step={1} />

      <h1 className="text-xl font-semibold text-foreground">Verify you&apos;re a Hokie</h1>
      <p className="mt-1.5 text-[13px] text-muted-text">
        Only @vt.edu addresses can join. We&apos;ll send you a six-digit code.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <Field label="Virginia Tech email" htmlFor="signup-email" error={error}>
          <Input
            id="signup-email"
            type="email"
            placeholder="you@vt.edu"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            aria-invalid={error ? true : undefined}
            className="cursor-text text-[13px]"
          />
        </Field>

        <button
          type="submit"
          className="h-11 w-full cursor-pointer rounded-lg bg-brand text-[13px] font-semibold text-white outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Send code
        </button>

        <p className="text-center text-[12px] text-muted-text">
          Your email is used only to confirm you are a current student. You choose later
          whether other users can see it.
        </p>
      </form>
    </AuthShell>
  );
}
