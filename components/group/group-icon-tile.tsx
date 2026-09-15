import { Code2, Home, Shield, Mountain, Users, type LucideIcon } from "lucide-react";
import type { GroupIconKey } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<GroupIconKey, LucideIcon> = {
  code: Code2,
  home: Home,
  shield: Shield,
  mountain: Mountain,
  greek: Users,
};

export function GroupIconTile({
  iconKey,
  size = "md",
  className,
}: {
  iconKey: GroupIconKey;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const Icon = ICON_MAP[iconKey];
  const box = size === "lg" ? "size-14" : size === "sm" ? "size-9" : "size-11";
  const iconSize = size === "lg" ? "size-6" : size === "sm" ? "size-4" : "size-5";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl bg-group-tint text-group-ink",
        box,
        className
      )}
    >
      <Icon className={iconSize} strokeWidth={1.75} />
    </div>
  );
}
