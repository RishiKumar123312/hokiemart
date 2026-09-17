"use client";

// Lets someone change their password: type the current one to prove it's
// really them, then a new one twice. Reuses the exact same PasswordChecklist
// component from sign-up, so "what counts as a strong password" can never
// quietly differ between the two screens.
//
// This prototype never stored a real password anywhere (see the note above
// MOCK_CURRENT_PASSWORD below), so "current password" is checked against a
// stand-in value rather than anything real.

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BackHeader } from "@/components/nav/app-header";
import { PasswordChecklist } from "@/components/auth/password-checklist";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { isPasswordValid, passwordsMatch } from "@/lib/validation";
import { cn } from "@/lib/utils";

// Stands in for whatever the real current password would be, since this
// prototype never actually stores one. Typing anything else demonstrates the
// "wrong current password" error described in the spec.
const MOCK_CURRENT_PASSWORD = "Password1";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { updateProfile } = useStore();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");

  const newPasswordOk = isPasswordValid(newPassword);
  const matchOk = passwordsMatch(newPassword, confirmation);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (currentPassword !== MOCK_CURRENT_PASSWORD) {
      setError("That current password doesn't match");
      return;
    }
    if (!newPasswordOk) {
      setError("Your password does not meet all the requirements yet");
      return;
    }
    if (!matchOk) {
      setError("Passwords do not match");
      return;
    }

    updateProfile({ hasPassword: true });
    router.push("/settings");
  }

  let confirmationStatus: { text: string; className: string };
  if (confirmation === "") {
    confirmationStatus = { text: "Re-enter it to be sure.", className: "text-muted-text" };
  } else if (matchOk) {
    confirmationStatus = { text: "Passwords match", className: "text-success" };
  } else {
    confirmationStatus = { text: "Passwords do not match", className: "text-danger" };
  }

  return (
    <div>
      <BackHeader title="Change password" backHref="/settings" />
      <form onSubmit={handleSubmit} className="space-y-5 px-5 py-6">
        <div>
          <Field label="Current password" htmlFor="current-password">
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                if (error) setError("");
              }}
              className="cursor-text text-[13px]"
            />
          </Field>
          <p className="mt-1 text-[12px] text-muted-text">
            For this prototype, the current password is {MOCK_CURRENT_PASSWORD}.
          </p>
        </div>

        <div>
          <Field label="New password" htmlFor="new-password">
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (error) setError("");
              }}
              className="cursor-text text-[13px]"
            />
          </Field>
          <PasswordChecklist password={newPassword} touched={newPassword.length > 0} className="mt-2" />
        </div>

        <div>
          <Field label="Confirm new password" htmlFor="confirm-new-password">
            <Input
              id="confirm-new-password"
              type="password"
              value={confirmation}
              onChange={(e) => {
                setConfirmation(e.target.value);
                if (error) setError("");
              }}
              className="cursor-text text-[13px]"
            />
          </Field>
          <p className={cn("mt-1.5 text-[11px]", confirmationStatus.className)}>
            {confirmationStatus.text}
          </p>
        </div>

        {error && <p className="text-[11px] text-danger">{error}</p>}

        <button
          type="submit"
          className="h-11 w-full cursor-pointer rounded-lg bg-brand text-[13px] font-semibold text-white outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Save new password
        </button>
      </form>
    </div>
  );
}
