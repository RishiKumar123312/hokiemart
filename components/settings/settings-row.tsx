"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// One line in the settings list: a label on the left, and either a value +
// arrow on the right (for rows that open another screen) or some custom
// content (for the two privacy rows, which have their own Hidden/Visible
// pill instead of navigating anywhere).
//
// Every row is at least 44px tall, which is the smallest size a finger can
// reliably tap without missing -- the same rule used everywhere else in
// this app.
export function SettingsRow({
  label,
  value,
  href,
  right,
  // Styles the label in red for dangerous actions, like deleting the account.
  destructive,
}: {
  label: string;
  // The current value shown in grey before the arrow, e.g. "@maya_p28".
  value?: string;
  // If given, the whole row becomes a link to this address.
  href?: string;
  // Custom content on the right instead of value + arrow (used for the
  // privacy pills, which need to stay clickable on their own).
  right?: ReactNode;
  destructive?: boolean;
}) {
  const labelEl = (
    <span className={cn("text-[13px]", destructive ? "text-danger" : "text-foreground")}>
      {label}
    </span>
  );

  // The privacy rows pass their own `right` content and are not links --
  // the row itself doesn't go anywhere, only the pill inside it does
  // something.
  if (right) {
    return (
      <div className="flex min-h-11 items-center justify-between gap-3 px-4 py-3">
        {labelEl}
        {right}
      </div>
    );
  }

  const inner = (
    <>
      {labelEl}
      <span className="flex items-center gap-1 text-[13px] text-muted-text">
        {value}
        <ChevronRight className="size-4" />
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex min-h-11 cursor-pointer items-center justify-between gap-3 px-4 py-3 outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {inner}
      </Link>
    );
  }

  return <div className="flex min-h-11 items-center justify-between gap-3 px-4 py-3">{inner}</div>;
}
