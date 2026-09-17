"use client";

// Lists the ways someone can prove it's them when signing in. The one-time
// code can never be turned off here, because it's tied directly to the VT
// email that was verified during sign-up -- that email address is what makes
// the account "theirs" in the first place. A password is optional on top of
// that, so it can be added or removed.

import { KeyRound, Mail } from "lucide-react";
import { BackHeader } from "@/components/nav/app-header";
import { useStore } from "@/lib/store";

export default function SignInMethodsPage() {
  const { currentUser, updateProfile } = useStore();
  const hasPassword = currentUser?.hasPassword ?? false;

  return (
    <div>
      <BackHeader title="Sign-in methods" backHref="/settings" />

      <div className="divide-y divide-hairline border-y border-hairline">
        <div className="flex min-h-11 items-center gap-3 px-4 py-3">
          <KeyRound className="size-4 shrink-0 text-stone" />
          <span className="flex-1 text-[13px] text-foreground">Password</span>
          <button
            type="button"
            onClick={() => updateProfile({ hasPassword: !hasPassword })}
            className="min-h-9 cursor-pointer rounded-lg border border-input-border px-3 text-[12px] text-foreground outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {hasPassword ? "Remove" : "Add password"}
          </button>
        </div>

        <div className="flex min-h-11 items-center gap-3 px-4 py-3">
          <Mail className="size-4 shrink-0 text-stone" />
          <span className="flex-1 text-[13px] text-foreground">One-time code to your VT email</span>
          <span className="text-[12px] text-muted-text">Always on</span>
        </div>
      </div>

      {!hasPassword && (
        <p className="px-4 pt-3 text-[12px] text-danger">
          You&apos;ll sign in with a one-time code to your VT email each time.
        </p>
      )}
    </div>
  );
}
