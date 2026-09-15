"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, PackagePlus } from "lucide-react";
import { AppHeader } from "@/components/nav/app-header";
import { IconButton } from "@/components/ui/icon-button";
import { GroupIconTile } from "@/components/group/group-icon-tile";
import { POLICY_LABEL } from "@/components/group/group-row";
import { JoinButton } from "@/components/group/join-button";
import { ListingGrid } from "@/components/listing/listing-grid";
import { EmptyState } from "@/components/empty-state";
import { useStore } from "@/lib/store";

export function GroupFeed({ id }: { id: string }) {
  const router = useRouter();
  const { getGroup, getGroupListings, isMember } = useStore();

  const group = getGroup(id);

  if (!group) {
    return (
      <div>
        <AppHeader
          left={
            <IconButton aria-label="Back" onClick={() => router.back()}>
              <ArrowLeft className="size-[17px]" />
            </IconButton>
          }
        />
        <EmptyState
          icon={<Lock className="size-6" />}
          title="This group isn't around anymore"
        />
      </div>
    );
  }

  const member = isMember(group.id);
  const listings = getGroupListings(group.id);

  return (
    <div>
      <AppHeader
        left={
          <IconButton aria-label="Back" onClick={() => router.back()}>
            <ArrowLeft className="size-[17px]" />
          </IconButton>
        }
      />

      <div className="bg-group-tint px-4 py-4">
        <div className="flex items-start gap-3">
          <GroupIconTile iconKey={group.iconKey} size="lg" />
          <div className="min-w-0 flex-1 pt-0.5">
            <h1 className="truncate font-medium text-group-ink">{group.name}</h1>
            <p className="text-sm text-group-ink/80">
              {group.memberCount} members · {POLICY_LABEL[group.joinPolicy]}
            </p>
          </div>
          <JoinButton group={group} className="mt-0.5" />
        </div>
      </div>

      <p className="border-b border-hairline px-4 py-2.5 text-xs text-stone">
        Listings here are visible only to members of this group and don&apos;t appear in the
        public feed.
      </p>

      {member && (
        <Link
          href={`/sell?group=${group.id}`}
          className="mx-4 mt-3 flex min-h-11 items-center justify-center gap-2 rounded-xl border border-dashed border-hairline text-sm font-medium text-stone"
        >
          <PackagePlus className="size-4" />
          post to this group
        </Link>
      )}

      {member ? (
        <ListingGrid
          listings={listings}
          emptyIcon={<PackagePlus className="size-6" />}
          emptyTitle="Nothing here yet"
          emptySubtitle="Be the first to post one"
        />
      ) : (
        <div className="m-4 rounded-xl bg-muted px-3.5 py-3 text-sm text-stone">
          Join {group.name} to see listings, message sellers, or post here.
        </div>
      )}
    </div>
  );
}
