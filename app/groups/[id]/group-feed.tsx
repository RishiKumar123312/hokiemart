"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bell, Lock, PackagePlus } from "lucide-react";
import { AppHeader } from "@/components/nav/app-header";
import { IconButton } from "@/components/ui/icon-button";
import { GroupIconTile } from "@/components/group/group-icon-tile";
import { POLICY_LABEL } from "@/components/group/group-row";
import { JoinButton } from "@/components/group/join-button";
import { SearchBar } from "@/components/feed/search-bar";
import { ListingGrid } from "@/components/listing/listing-grid";
import { EmptyState } from "@/components/empty-state";
import { useStore } from "@/lib/store";
import { searchListings } from "@/lib/search";
import { cn } from "@/lib/utils";

export function GroupFeed({ id }: { id: string }) {
  const router = useRouter();
  const { getGroup, getGroupListings, isMember, isGroupNotifyOn, toggleGroupNotify } = useStore();
  // Hooks always run in the same order regardless of what's found below, so
  // everything here -- including the ones that only matter once a group is
  // actually found -- is declared before the "group not found" early
  // return rather than after it.
  const [search, setSearch] = useState("");
  const listings = getGroupListings(id);
  // Same smart search as the main feed (lib/search.ts): every word typed
  // has to show up somewhere -- title, description, category, or location
  // -- for a listing to match, and title matches rank above the rest. Here
  // it searches only this group's own listings rather than every public
  // one.
  const filteredListings = useMemo(
    () => (search.trim() === "" ? listings : searchListings(listings, search)),
    [listings, search]
  );

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
  const notifyOn = isGroupNotifyOn(group.id);

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
          <div className="mt-0.5 flex items-center gap-2">
            {/* Separate from membership on purpose -- joining a group gets
                you into its marketplace, but doesn't sign you up to hear
                about every new post. Only shown to members, since a
                non-member can't see this group's listings in the first
                place, let alone be notified about new ones. */}
            {member && (
              <IconButton
                aria-label={
                  notifyOn
                    ? `Turn off notifications for ${group.name}`
                    : `Get notified about new posts in ${group.name}`
                }
                onClick={() => toggleGroupNotify(group.id)}
                className={cn(
                  "border",
                  notifyOn ? "border-group bg-group-tint text-group-ink" : "border-hairline text-stone"
                )}
              >
                <Bell className={cn("size-4", notifyOn && "fill-current")} />
              </IconButton>
            )}
            <JoinButton group={group} />
          </div>
        </div>
      </div>

      <p className="border-b border-hairline px-4 py-2.5 text-xs text-stone">
        Listings here are visible only to members of this group and don&apos;t appear in the
        public feed.
      </p>

      {member && (
        <div className="sticky top-14 z-10 border-b border-hairline bg-white px-3 py-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search this group" />
        </div>
      )}

      {member && (
        <Link
          href={`/sell?group=${group.id}`}
          className="mx-4 mt-3 flex min-h-11 items-center justify-center gap-2 rounded-xl border border-dashed border-hairline text-sm font-medium text-stone"
        >
          <PackagePlus className="size-4" />
          Post to this group
        </Link>
      )}

      {member ? (
        <ListingGrid
          listings={filteredListings}
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
