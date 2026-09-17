"use client";

// The last screen of sign-up: a plain confirmation that the account is set
// up, plus a quick reminder of the two privacy choices made a moment ago, so
// nobody leaves this screen unsure what they just agreed to.

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { useStore } from "@/lib/store";

export default function SignupDonePage() {
  const router = useRouter();
  const { currentUser } = useStore();

  // Reads from the now-updated signed-in user rather than the sign-up draft,
  // since applySignup() already copied everything over on the previous
  // screen -- this is the single "what actually got saved" source of truth.
  const firstName = currentUser?.displayName?.split(" ")[0] ?? "there";
  const username = currentUser?.username ?? "";
  const phoneHidden = currentUser?.phoneHidden ?? true;
  const emailHidden = currentUser?.emailHidden ?? true;

  return (
    <AuthShell>
      <div className="flex flex-col items-center pt-8 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-brand-tint">
          <Check className="size-8 text-brand" strokeWidth={2.5} />
        </div>

        <h1 className="mt-5 text-xl font-semibold text-foreground">You&apos;re in, {firstName}</h1>
        <p className="mt-1 text-[13px] text-muted-text">
          @{username} · Verified Hokie
        </p>

        {/* Plain-words recap of the two privacy choices, so the two toggles
            picked a couple of screens ago aren't forgotten immediately. */}
        <div className="mt-6 w-full space-y-2 rounded-xl border border-hairline p-4 text-left">
          <p className="text-[13px] text-foreground">
            Phone: {phoneHidden ? "hidden from other users" : "visible on your profile"}
          </p>
          <p className="text-[13px] text-foreground">
            Email: {emailHidden ? "hidden from other users" : "visible on your profile"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-8 h-11 w-full cursor-pointer rounded-lg bg-brand text-[13px] font-semibold text-white outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Start browsing
        </button>
      </div>
    </AuthShell>
  );
}
