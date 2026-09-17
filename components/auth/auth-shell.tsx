"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

// The plain white page frame shared by every sign-in and sign-up screen: a
// centered column that is never wider than 390px (a comfortable phone width),
// generous space around the edges, and an optional back arrow at the top.
//
// Pulling this into one component means every auth screen automatically
// matches, instead of each one guessing its own padding.
export function AuthShell({
  children,
  // When given, shows a back arrow in the top-left that goes to this address.
  // When left out, no back arrow appears (used on the sign-in screen, which
  // is the very start of the flow).
  backHref,
}: {
  children: ReactNode;
  backHref?: string;
}) {
  const router = useRouter();

  return (
    <div className="min-h-dvh bg-white px-5 py-6">
      <div className="mx-auto w-full max-w-[390px] min-w-[320px]">
        {backHref !== undefined &&
          (backHref === "" ? (
            // An empty string means "go back to wherever the person came
            // from" rather than a fixed address.
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Back"
              className="mb-4 flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg -ml-2.5 outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <ArrowLeft className="size-[18px]" />
            </button>
          ) : (
            <Link
              href={backHref}
              aria-label="Back"
              className="mb-4 flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg -ml-2.5 outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <ArrowLeft className="size-[18px]" />
            </Link>
          ))}
        {children}
      </div>
    </div>
  );
}
