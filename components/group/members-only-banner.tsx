import Link from "next/link";
import { Lock, ChevronRight } from "lucide-react";

export function MembersOnlyBanner({ groupId, groupName }: { groupId: string; groupName: string }) {
  return (
    <Link
      href={`/groups/${groupId}`}
      className="flex min-h-11 items-center justify-between gap-2 bg-group-tint px-4 py-2.5 text-sm text-group-ink outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="flex items-center gap-1.5">
        <Lock className="size-3.5" />
        Members only · {groupName}
      </span>
      <ChevronRight className="size-4 shrink-0" />
    </Link>
  );
}
