import type { ReactNode } from "react";
import type { Listing } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { ListingCard } from "./listing-card";

function CardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      <Skeleton className="h-4 w-4/5 rounded-md" />
      <Skeleton className="h-4 w-1/3 rounded-md" />
      <Skeleton className="h-3 w-2/3 rounded-md" />
    </div>
  );
}

export function ListingGrid({
  listings,
  loading,
  emptyIcon,
  emptyTitle,
  emptySubtitle,
  emptyAction,
  className,
}: {
  listings: Listing[];
  loading?: boolean;
  emptyIcon: ReactNode;
  emptyTitle: string;
  emptySubtitle?: string;
  emptyAction?: ReactNode;
  className?: string;
}) {
  if (loading) {
    return (
      <div className={className ?? "grid grid-cols-2 gap-x-3 gap-y-5 p-3"}>
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <EmptyState icon={emptyIcon} title={emptyTitle} subtitle={emptySubtitle} action={emptyAction} />
    );
  }

  return (
    <div className={className ?? "grid grid-cols-2 gap-x-3 gap-y-5 p-3"}>
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
