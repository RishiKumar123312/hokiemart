"use client";

import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

// A small two-state pill that says whether one piece of personal information
// (a phone number, an email address) is hidden from other students or shown to
// them. Tapping it flips between the two.
//
// The exact same component is used during sign-up and later in account
// settings. That is on purpose: if there were two copies, one could quietly
// start behaving differently from the other after an edit.
export function VisibilityToggle({
  hidden,
  onChange,
  label,
  className,
}: {
  // true means "only you can see this"; false means other students can see it.
  hidden: boolean;
  // Called with the new value when the person taps the pill.
  onChange: (hidden: boolean) => void;
  // Describes what is being hidden or shown, read aloud by screen readers.
  label: string;
  className?: string;
}) {
  const Icon = hidden ? EyeOff : Eye;

  return (
    <button
      type="button"
      onClick={() => onChange(!hidden)}
      // Spells out the current state for anyone using a screen reader, since
      // the eye icon on its own does not announce anything useful.
      aria-label={`${label} is currently ${hidden ? "hidden" : "visible"}. Tap to change.`}
      className={cn(
        "inline-flex min-h-8 cursor-pointer items-center gap-1 rounded-full px-2.5 text-[11px] transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        hidden
          ? "bg-muted text-stone hover:bg-muted/80"
          : "bg-brand-tint text-brand-ink hover:bg-brand-tint/70",
        className
      )}
    >
      <Icon className="size-3.5" />
      {hidden ? "Hidden" : "Visible"}
    </button>
  );
}

// The plain-English sentence shown under a field explaining what the current
// choice actually means in practice. A privacy switch whose consequences are
// not spelled out is a switch people get wrong, so every toggle is paired with
// one of these.
export function visibilityHelperText(
  field: "phone" | "email",
  hidden: boolean
): string {
  if (field === "phone") {
    return hidden
      ? "Only you can see this. Buyers reach you through in-app chat."
      : "Shown on your listings so buyers can text you directly.";
  }
  return hidden
    ? "Your verified badge still shows. The address itself stays private."
    : "Other students can see your full email address.";
}
