"use client";

import { Heart } from "lucide-react";
import { AppHeader } from "@/components/nav/app-header";
import { ListingGrid } from "@/components/listing/listing-grid";
import { useStore } from "@/lib/store";

export default function SavedPage() {
  const { getSavedListings } = useStore();
  const saved = getSavedListings();

  return (
    <div>
      <AppHeader title="Saved" />
      <ListingGrid
        listings={saved}
        emptyIcon={<Heart className="size-6" />}
        emptyTitle="Nothing saved yet"
        emptySubtitle="Tap the heart on a listing to save it for later"
      />
    </div>
  );
}
