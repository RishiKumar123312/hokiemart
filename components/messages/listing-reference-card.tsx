import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { HANDOFF_LABEL, type Listing } from "@/lib/mock-data";
import { CATEGORY_ICON } from "@/components/listing/listing-image";

// Because one conversation can cover several different listings (this app
// threads by person, not by listing -- see the Conversation type in
// lib/mock-data.ts), something has to mark, right there in the middle of the
// messages, which listing is being talked about at that point. This card is
// that marker: it gets inserted into the timeline every time the subject
// changes, including changing back to something discussed earlier, so the
// messages under it are never left ambiguous about what they're referring
// to. Tapping it opens that listing.
export function ListingReferenceCard({ listing }: { listing: Listing }) {
  const Icon = CATEGORY_ICON[listing.category];

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="flex min-h-11 cursor-pointer items-center gap-3 border-y border-rule bg-paper px-5 py-3 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="flex size-10 shrink-0 items-center justify-center bg-tile">
        <Icon className="size-4 text-ink-muted" strokeWidth={1.5} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] text-ink">{listing.title}</p>
        <p className="label-caps mt-0.5">
          {listing.category} · {HANDOFF_LABEL[listing.handoff]}
        </p>
      </div>
      <p className="shrink-0 text-[15px] text-brand">{formatPrice(listing.price)}</p>
    </Link>
  );
}
