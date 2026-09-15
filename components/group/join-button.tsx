"use client";

import { useRouter } from "next/navigation";
import type { Group } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// The three-state pill: open groups join instantly, approval groups request
// (and can un-request), invite groups never appear here -- the invite-code
// field is their only door in.
export function JoinButton({ group, className }: { group: Group; className?: string }) {
  const { isMember, isRequested, joinGroup, leaveGroup, requestJoin, cancelRequest } = useStore();
  const router = useRouter();

  const member = isMember(group.id);
  const requested = isRequested(group.id);

  if (member) {
    return (
      <button
        type="button"
        onClick={() => leaveGroup(group.id)}
        className={cn(
          "min-h-9 shrink-0 rounded-lg bg-brand-tint px-3.5 text-sm font-medium text-brand-ink outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          className
        )}
      >
        joined
      </button>
    );
  }

  if (group.joinPolicy === "invite") {
    return (
      <button
        type="button"
        onClick={() => router.push("/groups#invite-code")}
        className={cn(
          "min-h-9 shrink-0 rounded-lg border border-hairline px-3.5 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          className
        )}
      >
        enter code
      </button>
    );
  }

  if (group.joinPolicy === "approval") {
    if (requested) {
      return (
        <button
          type="button"
          onClick={() => cancelRequest(group.id)}
          className={cn(
            "min-h-9 shrink-0 rounded-lg bg-muted px-3.5 text-sm text-stone outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            className
          )}
        >
          requested
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={() => requestJoin(group.id)}
        className={cn(
          "min-h-9 shrink-0 rounded-lg border border-brand px-3.5 text-sm font-medium text-brand outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          className
        )}
      >
        join
      </button>
    );
  }

  // open
  return (
    <button
      type="button"
      onClick={() => joinGroup(group.id)}
      className={cn(
        "min-h-9 shrink-0 rounded-lg border border-brand px-3.5 text-sm font-medium text-brand outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      join
    </button>
  );
}
