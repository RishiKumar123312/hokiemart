"use client";

// The account-deletion confirmation. Deleting an account can't be undone, so
// this asks the person to type their own username before the button even
// works -- a small extra step that makes it much harder to do by accident.
//
// True to the spec, this is mock only: nothing is actually deleted, and no
// data in the store is touched. Confirming just sends the person to the
// sign-in screen, as if their account (and session) were gone.

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { BackHeader } from "@/components/nav/app-header";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";

export default function DeleteAccountPage() {
  const router = useRouter();
  const { currentUser } = useStore();
  const [typedUsername, setTypedUsername] = useState("");

  const expectedUsername = currentUser?.username ?? "";
  const matches = typedUsername.trim() !== "" && typedUsername.trim() === expectedUsername;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!matches) return;
    // Mock only -- see file comment above. Nothing is deleted.
    router.push("/auth/signin");
  }

  return (
    <div>
      <BackHeader title="Delete account" backHref="/settings" />

      <form onSubmit={handleSubmit} className="space-y-5 px-5 py-6">
        <div className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/5 p-3.5">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-danger" />
          <p className="text-[12px] text-danger">
            This can&apos;t be undone. Your listings, saved items and group memberships will all
            be removed.
          </p>
        </div>

        <div>
          <label htmlFor="confirm-username" className="text-[12px] text-label">
            Type <span className="font-semibold">@{expectedUsername}</span> to confirm
          </label>
          <Input
            id="confirm-username"
            value={typedUsername}
            onChange={(e) => setTypedUsername(e.target.value)}
            className="mt-1.5 cursor-text text-[13px]"
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          disabled={!matches}
          className="h-11 w-full cursor-pointer rounded-lg bg-danger text-[13px] font-semibold text-white outline-none disabled:cursor-not-allowed disabled:opacity-40 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Delete my account
        </button>
      </form>
    </div>
  );
}
