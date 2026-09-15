import Link from "next/link";
import type { Listing } from "@/lib/mock-data";
import { formatPrice, timeAgo } from "@/lib/format";
import { ListingImage } from "./listing-image";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listing/${listing.id}`}
      className="block overflow-hidden rounded-xl border border-hairline outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <ListingImage category={listing.category} />
      <div className="space-y-0.5 p-2.5">
        <p className="truncate text-sm text-foreground">{listing.title}</p>
        <p className="font-medium text-brand">{formatPrice(listing.price)}</p>
        <p className="truncate text-xs text-stone">
          {listing.location} · {timeAgo(listing.createdAt)}
        </p>
      </div>
    </Link>
  );
}
