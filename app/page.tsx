"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, MessageCircle, PackageSearch, Plus } from "lucide-react";
import { AppHeader } from "@/components/nav/app-header";
import { IconButton } from "@/components/ui/icon-button";
import { SearchBar } from "@/components/feed/search-bar";
import { CategoryPills, type CategoryFilter } from "@/components/feed/category-pills";
import { GroupChips } from "@/components/feed/group-chips";
import { ListingGrid } from "@/components/listing/listing-grid";
import { useStore } from "@/lib/store";
import Link from "next/link";

export default function FeedPage() {
  const { getPublicListings, getMyGroups, getUnreadCount, hasLoadedOnce, markLoaded } = useStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");

  useEffect(() => {
    if (hasLoadedOnce) return;
    const t = setTimeout(markLoaded, 500);
    return () => clearTimeout(t);
  }, [hasLoadedOnce, markLoaded]);

  const listings = getPublicListings();
  const myGroups = getMyGroups();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return listings.filter((l) => {
      const matchesQuery = q === "" || l.title.toLowerCase().includes(q);
      const matchesCategory = category === "All" || l.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [listings, search, category]);

  return (
    <div>
      <AppHeader
        left={<span className="pl-2 font-medium text-brand">Maroon Market</span>}
        right={
          <>
            <IconButton aria-label="Notifications">
              <Bell className="size-[17px]" />
            </IconButton>
            <IconButton aria-label="Messages">
              <MessageCircle className="size-[17px]" />
            </IconButton>
          </>
        }
      />

      <div className="sticky top-14 z-10 space-y-3 border-b border-hairline bg-white pt-3">
        <div className="px-3">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <CategoryPills active={category} onChange={setCategory} />
      </div>

      <GroupChips groups={myGroups} unreadFor={getUnreadCount} />

      <ListingGrid
        listings={filtered}
        loading={!hasLoadedOnce}
        emptyIcon={<PackageSearch className="size-6" />}
        emptyTitle="Nothing here yet"
        emptySubtitle="Be the first to post one"
        emptyAction={
          <Link
            href="/sell"
            className="flex min-h-11 items-center gap-1.5 rounded-lg bg-brand px-4 text-sm font-medium text-white"
          >
            <Plus className="size-4" />
            post a listing
          </Link>
        }
      />
    </div>
  );
}
