"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Users } from "lucide-react";
import { AppHeader } from "@/components/nav/app-header";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { GroupRow } from "@/components/group/group-row";
import { useStore } from "@/lib/store";

export default function GroupsPage() {
  const router = useRouter();
  const { getMyGroups, getDiscoverGroups, redeemInviteCode } = useStore();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const inviteRef = useRef<HTMLInputElement>(null);

  const myGroups = getMyGroups();
  const discoverGroups = getDiscoverGroups();

  useEffect(() => {
    if (window.location.hash === "#invite-code") {
      inviteRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      inviteRef.current?.focus();
    }
  }, []);

  function handleRedeem(e: React.FormEvent) {
    e.preventDefault();
    const result = redeemInviteCode(code);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setError("");
    setCode("");
    router.push(`/groups/${result.groupId}`);
  }

  return (
    <div className="pb-6">
      <AppHeader
        title="groups"
        right={
          <Link href="/groups/new">
            <IconButton aria-label="Create a group">
              <Plus className="size-[17px]" />
            </IconButton>
          </Link>
        }
      />

      <Link
        href="/groups/new"
        className="flex items-center gap-3 border-b border-hairline px-4 py-3.5"
      >
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand-ink">
          <Plus className="size-5" />
        </div>
        <div>
          <p className="font-medium text-foreground">create a group</p>
          <p className="text-sm text-stone">for your org, dorm, or club</p>
        </div>
      </Link>

      <section>
        <h2 className="px-4 pb-1 pt-4 text-sm font-medium text-stone">your groups</h2>
        {myGroups.length === 0 ? (
          <p className="px-4 pb-2 text-sm text-stone">you haven&apos;t joined any groups yet.</p>
        ) : (
          <div className="divide-y divide-hairline">
            {myGroups.map((group) => (
              <GroupRow key={group.id} group={group} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="px-4 pb-1 pt-5 text-sm font-medium text-stone">discover</h2>
        {discoverGroups.length === 0 ? (
          <p className="px-4 pb-2 text-sm text-stone">no more groups to discover right now.</p>
        ) : (
          <div className="divide-y divide-hairline">
            {discoverGroups.map((group) => (
              <GroupRow key={group.id} group={group} />
            ))}
          </div>
        )}
      </section>

      <section id="invite-code" className="mt-6 space-y-2 px-4">
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Users className="size-4 text-stone" />
          have an invite code?
        </div>
        <form onSubmit={handleRedeem} className="flex gap-2">
          <Input
            ref={inviteRef}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (error) setError("");
            }}
            placeholder="enter code"
            aria-invalid={error ? true : undefined}
            className="flex-1"
          />
          <button
            type="submit"
            className="h-11 shrink-0 rounded-lg bg-brand px-4 text-sm font-medium text-white"
          >
            join
          </button>
        </form>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </section>
    </div>
  );
}
