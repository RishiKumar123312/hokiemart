"use client";

// Lets someone change their username. Same validation rule as sign-up (3 to
// 20 letters, numbers or underscores), plus a plain warning that changing it
// breaks any link to their profile that someone else already saved.

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BackHeader } from "@/components/nav/app-header";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { validateUsername } from "@/lib/validation";

export default function EditUsernamePage() {
  const router = useRouter();
  const { currentUser, updateProfile } = useStore();

  const [username, setUsername] = useState(currentUser?.username ?? "");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const message = validateUsername(username);
    if (message) {
      setError(message);
      return;
    }
    updateProfile({ username: username.trim() });
    router.push("/settings");
  }

  return (
    <div>
      <BackHeader title="Username" backHref="/settings" />
      <form onSubmit={handleSubmit} className="space-y-5 px-5 py-6">
        <Field label="Username" htmlFor="settings-username" error={error}>
          <Input
            id="settings-username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError("");
            }}
            aria-invalid={error ? true : undefined}
            className="cursor-text text-[13px]"
          />
          {!error && (
            <p className="mt-1 text-[12px] text-muted-text">
              Letters, numbers and underscores. 3 to 20 characters.
            </p>
          )}
        </Field>

        <p className="text-[12px] text-danger">
          Changing your username breaks any link to your profile that someone else has already
          saved.
        </p>

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
