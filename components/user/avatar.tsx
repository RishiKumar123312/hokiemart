import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "size-8 text-xs",
  md: "size-11 text-sm",
  lg: "size-16 text-lg",
} as const;

export function Avatar({
  initials,
  size = "md",
  className,
}: {
  initials: string;
  size?: keyof typeof sizeClasses;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-brand-tint font-medium text-brand-ink",
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
