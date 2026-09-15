import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  subtitle,
  action,
  className,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-16 text-center",
        className
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-muted text-stone">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="font-medium text-foreground">{title}</p>
        {subtitle ? <p className="text-sm text-stone">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
