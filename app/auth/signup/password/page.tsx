"use client";

// Sign-up step 4: choosing a password. This is the last step before the
// account is considered "created" (in this prototype, that just means the
// pretend signed-in user gets updated with everything typed so far).

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupProgress } from "@/components/auth/signup-progress";
import { PasswordChecklist } from "@/components/auth/password-checklist";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSignupDraft } from "@/lib/signup-context";
import { useStore } from "@/lib/store";
import { isPasswordValid, passwordsMatch } from "@/lib/validation";
import { cn } from "@/lib/utils";

export default function SignupPasswordPage() {
  const router = useRouter();
  const { draft } = useSignupDraft();
  const { applySignup } = useStore();

  // The password itself never gets saved anywhere -- not in the shared
  // sign-up draft, not sent anywhere. It only exists here, in this one
  // screen's memory, for exactly as long as it takes to check it.
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [submitError, setSubmitError] = useState("");

  const passwordOk = isPasswordValid(password);
  const matchOk = passwordsMatch(password, confirmation);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!passwordOk) {
      setSubmitError("Your password does not meet all the requirements yet");
      return;
    }
    if (!matchOk) {
      setSubmitError("Passwords do not match");
      return;
    }

    // Everything checks out -- hand the whole sign-up draft over to the
    // store so the rest of the app (profile, settings) shows what was
    // actually typed instead of the original placeholder person.
    applySignup({
      email: draft.email,
      fullName: draft.fullName,
      username: draft.username,
      phone: draft.phone,
      phoneHidden: draft.phoneHidden,
      emailHidden: draft.emailHidden,
    });
    router.push("/auth/signup/done");
  }

  // What the little line under "Confirm password" says right now. It only
  // reacts once the person has actually typed something into that box --
  // an empty confirm box isn't a mismatch, it just hasn't been tried yet.
  let confirmationStatus: { text: string; className: string };
  if (confirmation === "") {
    confirmationStatus = { text: "Re-enter it to be sure.", className: "text-muted-text" };
  } else if (matchOk) {
    confirmationStatus = { text: "Passwords match", className: "text-success" };
  } else {
    confirmationStatus = { text: "Passwords do not match", className: "text-danger" };
  }

  return (
    <AuthShell backHref="/auth/signup/profile">
      <SignupProgress step={3} />

      <h1 className="text-xl font-semibold text-foreground">Create a password</h1>
      <p className="mt-1.5 text-[13px] text-muted-text">
        You&apos;ll use this with your email or username to sign in.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <Field label="Password" htmlFor="signup-password">
            <Input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (submitError) setSubmitError("");
              }}
              className="cursor-text text-[13px]"
            />
          </Field>
          <PasswordChecklist password={password} touched={password.length > 0} className="mt-2" />
        </div>

        <div>
          <Field label="Confirm password" htmlFor="signup-confirm">
            <Input
              id="signup-confirm"
              type="password"
              value={confirmation}
              onChange={(e) => {
                setConfirmation(e.target.value);
                if (submitError) setSubmitError("");
              }}
              className="cursor-text text-[13px]"
            />
          </Field>
          <p className={cn("mt-1.5 text-[11px]", confirmationStatus.className)}>
            {confirmationStatus.text}
          </p>
        </div>

        {submitError && <p className="text-[11px] text-danger">{submitError}</p>}

        <button
          type="submit"
          className="h-11 w-full cursor-pointer rounded-lg bg-brand text-[13px] font-semibold text-white outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Create account
        </button>

        <p className="text-center text-[11px] text-muted-text">
          By creating an account you agree to meet in public campus spaces and handle payment
          yourselves.
        </p>
      </form>
    </AuthShell>
  );
}
