"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleCheckBig, Copy, X } from "lucide-react";
import { AppHeader } from "@/components/nav/app-header";
import { IconButton } from "@/components/ui/icon-button";
import { GroupIconTile } from "@/components/group/group-icon-tile";
import { EmptyState } from "@/components/empty-state";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function CopyRow({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be blocked -- fail silently, the value is
      // still visible and selectable on screen.
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-hairline px-3.5 py-3">
      <span className="flex-1 truncate text-sm text-foreground">{value}</span>
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          "flex min-h-9 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          copied ? "text-emerald-700" : "text-brand hover:bg-brand-tint"
        )}
      >
        <Copy className="size-3.5" />
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export function InviteScreen({ id }: { id: string }) {
  const router = useRouter();
  const { getGroup } = useStore();
  const group = getGroup(id);

  useEffect(() => {
    if (!group) router.replace("/groups");
  }, [group, router]);

  if (!group) {
    return (
      <div>
        <AppHeader title="Invite others" />
        <EmptyState icon={<X className="size-6" />} title="This group isn't around anymore" />
      </div>
    );
  }

  const link = `maroonmarket.app/join/${group.inviteCode}`;

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader
        title="Invite others"
        right={
          <IconButton aria-label="Close" onClick={() => router.push(`/groups/${group.id}`)}>
            <X className="size-[17px]" />
          </IconButton>
        }
      />

      <div className="flex flex-1 flex-col items-center gap-5 px-6 py-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <CircleCheckBig className="size-6" />
        </div>

        <div className="space-y-1">
          <p className="font-medium text-foreground">{group.name} is live</p>
          <p className="text-sm text-stone">
            An empty group doesn&apos;t go far -- share this so people can join.
          </p>
        </div>

        <GroupIconTile iconKey={group.iconKey} size="lg" />

        <div className="w-full space-y-3">
          <div className="space-y-1.5 text-left">
            <p className="text-sm font-medium text-foreground">Invite code</p>
            <CopyRow value={group.inviteCode} />
          </div>
          <div className="space-y-1.5 text-left">
            <p className="text-sm font-medium text-foreground">Invite link</p>
            <CopyRow value={link} />
          </div>
        </div>
      </div>

      <div
        className="border-t border-hairline px-4 py-3"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <button
          type="button"
          onClick={() => router.push(`/groups/${group.id}`)}
          className="h-12 w-full rounded-lg bg-brand text-sm font-medium text-white"
        >
          Done
        </button>
      </div>
    </div>
  );
}
