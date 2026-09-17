"use client";

// Sign-up step 3: the profile other students will actually see -- a name, a
// username, and two pieces of contact info (phone and the now-verified VT
// email) that the person can choose to hide or show.
//
// Every field here reads from and writes straight to the shared sign-up
// draft (see lib/signup-context.tsx) instead of its own local copy. That way
// nothing is lost no matter which direction someone navigates -- including
// flipping a privacy pill, which only ever changes that one field.

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupProgress } from "@/components/auth/signup-progress";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { VisibilityToggle, visibilityHelperText } from "@/components/settings/visibility-toggle";
import { useSignupDraft } from "@/lib/signup-context";
import { validateFullName, validateUsername } from "@/lib/validation";

export default function SignupProfilePage() {
  const router = useRouter();
  const { draft, updateDraft } = useSignupDraft();

  const [nameError, setNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nameMessage = validateFullName(draft.fullName);
    const usernameMessage = validateUsername(draft.username);
    setNameError(nameMessage ?? "");
    setUsernameError(usernameMessage ?? "");
    if (nameMessage || usernameMessage) return;
    router.push("/auth/signup/password");
  }

  return (
    <AuthShell backHref="/auth/signup/verify">
      <SignupProgress step={2} />

      <h1 className="text-xl font-semibold text-foreground">Set up your profile</h1>
      <p className="mt-1.5 text-[13px] text-muted-text">
        This is what other students see when you list something.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <Field label="Full name" htmlFor="signup-name" error={nameError}>
          <Input
            id="signup-name"
            value={draft.fullName}
            onChange={(e) => {
              updateDraft({ fullName: e.target.value });
              if (nameError) setNameError("");
            }}
            aria-invalid={nameError ? true : undefined}
            className="cursor-text text-[13px]"
          />
        </Field>

        <Field label="Username" htmlFor="signup-username" error={usernameError}>
          <Input
            id="signup-username"
            value={draft.username}
            onChange={(e) => {
              updateDraft({ username: e.target.value });
              if (usernameError) setUsernameError("");
            }}
            aria-invalid={usernameError ? true : undefined}
            className="cursor-text text-[13px]"
          />
          {!usernameError && (
            <p className="mt-1 text-[12px] text-muted-text">
              Letters, numbers and underscores. 3 to 20 characters.
            </p>
          )}
        </Field>

        <div className="border-t border-hairline pt-5 space-y-5">
          <div>
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="signup-phone" className="text-[12px] text-label">
                Phone number
              </label>
              <VisibilityToggle
                label="Phone number"
                hidden={draft.phoneHidden}
                onChange={(hidden) => updateDraft({ phoneHidden: hidden })}
              />
            </div>
            <Input
              id="signup-phone"
              type="tel"
              value={draft.phone}
              onChange={(e) => updateDraft({ phone: e.target.value })}
              className="mt-1.5 cursor-text text-[13px]"
            />
            <p className="mt-1 text-[12px] text-muted-text">
              {visibilityHelperText("phone", draft.phoneHidden)}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between gap-2">
              <label className="text-[12px] text-label">VT email</label>
              <VisibilityToggle
                label="VT email"
                hidden={draft.emailHidden}
                onChange={(hidden) => updateDraft({ emailHidden: hidden })}
              />
            </div>
            {/* Read-only: this is the address verified two steps ago, so it
                can't be edited from here. */}
            <div className="mt-1.5 flex h-11 items-center gap-1.5 rounded-lg border border-input-border bg-muted px-3 text-[13px] text-muted-text">
              <span className="flex-1 truncate">{draft.email}</span>
              <BadgeCheck className="size-4 shrink-0 text-success" />
            </div>
            <p className="mt-1 text-[12px] text-muted-text">
              {visibilityHelperText("email", draft.emailHidden)}
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="h-11 w-full cursor-pointer rounded-lg bg-brand text-[13px] font-semibold text-white outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Continue
        </button>
      </form>
    </AuthShell>
  );
}
