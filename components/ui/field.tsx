import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Wraps a label + control with an inline red error message, shared by every
// form in the app (sell, create group). The error is passed in rather than
// managed here -- each screen owns its own validation state.
export function Field({
  label,
  htmlFor,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
          {label}
        </label>
        {error ? <span className="text-xs text-destructive">{error}</span> : null}
      </div>
      {children}
    </div>
  );
}
