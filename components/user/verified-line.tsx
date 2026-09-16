import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerifiedLine({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1 text-sm text-emerald-700", className)}>
      <BadgeCheck className="size-4" />
      <span>Verified @vt.edu</span>
    </div>
  );
}
