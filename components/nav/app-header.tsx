import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";

// Generic sticky header: a left slot, an optional title, and a right slot.
// Screens compose this instead of hand-rolling their own header bar.
export function AppHeader({
  left,
  title,
  right,
  className,
}: {
  left?: ReactNode;
  title?: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-14 items-center justify-between gap-2 border-b border-hairline bg-white/95 px-2 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex min-w-11 items-center">{left}</div>
      {title ? (
        <div className="flex-1 truncate text-center font-medium">{title}</div>
      ) : (
        <div className="flex-1" />
      )}
      <div className="flex min-w-11 items-center justify-end gap-1">{right}</div>
    </header>
  );
}

// Convenience wrapper for the back-arrow + title pattern used by task-flow
// screens (listing detail, create group, invite).
export function BackHeader({
  title,
  backHref,
  onBack,
  right,
}: {
  title: string;
  backHref?: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  const back = backHref ? (
    <Link href={backHref}>
      <IconButton aria-label="Back">
        <ArrowLeft className="size-[17px]" />
      </IconButton>
    </Link>
  ) : (
    <IconButton aria-label="Back" onClick={onBack}>
      <ArrowLeft className="size-[17px]" />
    </IconButton>
  );

  return <AppHeader left={back} title={title} right={right} />;
}
