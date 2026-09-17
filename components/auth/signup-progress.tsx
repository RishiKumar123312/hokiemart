"use client";

import { cn } from "@/lib/utils";

// The three short bars near the top of every sign-up screen showing how far
// through the process someone is. Sign-up has four screens (email, code,
// profile, password) but only three "real" steps to show progress for -- the
// code-verification screen shares its bar with the email step, since from the
// person's point of view "confirm your email" is really one job in two parts.
export function SignupProgress({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="mb-6 flex gap-1.5" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3}>
      {[1, 2, 3].map((segment) => (
        <div
          key={segment}
          className={cn(
            "h-1 flex-1 rounded-full transition-colors",
            segment <= step ? "bg-brand" : "bg-hairline"
          )}
        />
      ))}
    </div>
  );
}
