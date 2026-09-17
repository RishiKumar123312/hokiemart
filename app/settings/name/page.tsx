"use client";

// Lets someone change the name shown on their listings. Uses the exact same
// validation rule as typing a name during sign-up (see lib/validation.ts),
// so a name that was good enough at sign-up is never rejected here, or the
// other way around.

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BackHeader } from "@/components/nav/app-header";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { validateFullName } from "@/lib/validation";
import { initialsFromName } from "@/lib/format";

export default function EditNamePage() {
  const router = useRouter();
  const { currentUser, updateProfile } = useStore();

  const [name, setName] = useState(currentUser?.displayName ?? "");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const message = validateFullName(name);
    if (message) {
      setError(message);
      return;
    }
    // The little two-letter avatar badge is derived from the name, so it
    // has to be recalculated whenever the name changes.
    updateProfile({ displayName: name.trim(), initials: initialsFromName(name) });
    router.push("/settings");
  }

  return (
    <div>
      <BackHeader title="Display name" backHref="/settings" />
      <form onSubmit={handleSubmit} className="space-y-5 px-5 py-6">
        <Field label="Full name" htmlFor="settings-name" error={error}>
          <Input
            id="settings-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
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
          Save
        </button>
      </form>
    </div>
  );
}
