"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bell, MessageCircle, PackageSearch, Plus, SlidersHorizontal } from "lucide-react";
import { AppHeader } from "@/components/nav/app-header";
import { IconButton } from "@/components/ui/icon-button";
import { SearchBar } from "@/components/feed/search-bar";
import { GroupChips } from "@/components/feed/group-chips";
import { FilterSheet, DEFAULT_FILTERS, activeFilterCount, type Filters } from "@/components/feed/filter-sheet";
import { ListingGrid } from "@/components/listing/listing-grid";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function FeedPage() {
  const { getPublicListings, getMyGroups, getUnreadCount, hasLoadedOnce, markLoaded } = useStore();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (hasLoadedOnce) return;
    const t = setTimeout(markLoaded, 500);
    return () => clearTimeout(t);
  }, [hasLoadedOnce, markLoaded]);

  const listings = getPublicListings();
  const myGroups = getMyGroups();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const min = filters.minPrice.trim() === "" ? null : Number(filters.minPrice);
    const max = filters.maxPrice.trim() === "" ? null : Number(filters.maxPrice);

    return listings.filter((l) => {
      const matchesQuery = q === "" || l.title.toLowerCase().includes(q);
      const matchesCategory = filters.category === "All" || l.category === filters.category;
      // "Both" on either side is permissive: an unfiltered search shows
      // everything, and a listing offering both handoff methods satisfies
      // any specific filter choice.
      const matchesHandoff =
        filters.handoff === "Both" || l.handoff === "Both" || l.handoff === filters.handoff;
      const matchesMin = min === null || Number.isNaN(min) || l.price >= min;
      const matchesMax = max === null || Number.isNaN(max) || l.price <= max;
      return matchesQuery && matchesCategory && matchesHandoff && matchesMin && matchesMax;
    });
  }, [listings, search, filters]);

  const filterCount = activeFilterCount(filters);

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

      <div className="sticky top-14 z-10 border-b border-hairline bg-white px-3 py-3">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className={cn(
              "relative flex h-11 shrink-0 items-center gap-1.5 rounded-lg border px-3.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              filterCount > 0
                ? "border-brand bg-brand-tint text-brand-ink"
                : "border-hairline text-foreground hover:bg-muted"
            )}
          >
            <SlidersHorizontal className="size-4" />
            Filters
            {filterCount > 0 && (
              <span className="flex size-4 items-center justify-center rounded-full bg-brand text-[10px] font-medium text-white">
                {filterCount}
              </span>
            )}
          </button>
        </div>
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
            Post a listing
          </Link>
        }
      />

      <FilterSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onChange={setFilters}
      />
    </div>
  );
}
