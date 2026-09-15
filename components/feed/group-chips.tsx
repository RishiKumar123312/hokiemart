import Link from "next/link";
import type { Group } from "@/lib/mock-data";

export function GroupChips({
  groups,
  unreadFor,
}: {
  groups: Group[];
  unreadFor: (groupId: string) => number;
}) {
  if (groups.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto px-3 pb-3 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {groups.map((group) => {
        const unread = unreadFor(group.id);
        return (
          <Link
            key={group.id}
            href={`/groups/${group.id}`}
            className="relative flex min-h-9 shrink-0 items-center rounded-lg bg-group-tint px-3.5 text-sm font-medium text-group-ink outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {group.name}
            {unread > 0 && (
              <span className="ml-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-group px-1 text-[10px] font-medium text-white">
                {unread}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
