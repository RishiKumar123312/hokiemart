import Link from "next/link";
import { timeAgo, formatPrice } from "@/lib/format";
import { GroupIconTile } from "@/components/group/group-icon-tile";
import { CATEGORY_ICON } from "@/components/listing/listing-image";
import type { Category, Group, Listing, Notification } from "@/lib/mock-data";

// One row on the notifications screen: what kind of thing triggered it (a
// followed category, or a group with notifications turned on), which
// listing it's about, and when. Laid out the same way as a message inbox
// row (icon, title line with an unread dot, timestamp, one-line preview),
// just in the app's normal white/sans-serif style rather than messaging's
// paper-and-serif look -- a system notification about a new listing isn't
// personal correspondence, so it doesn't get that same treatment.
export function NotificationRow({
  notification,
  listing,
  group,
}: {
  notification: Notification;
  listing: Listing | undefined;
  // Only meaningful (and only passed) when notification.kind is "group".
  group?: Group;
}) {
  const CategoryIcon = CATEGORY_ICON[notification.sourceId as Category];

  return (
    <Link
      href={listing ? `/listing/${listing.id}` : "/notifications"}
      className="flex min-h-11 cursor-pointer items-center gap-3 px-4 py-3 outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {notification.kind === "group" && group ? (
        <GroupIconTile iconKey={group.iconKey} size="sm" />
      ) : (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-stone">
          <CategoryIcon className="size-4" strokeWidth={1.5} />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="flex items-center gap-1.5 truncate text-sm font-medium text-foreground">
            New in {notification.sourceLabel}
            {!notification.read && (
              <span aria-label="Unread" className="inline-block size-1.5 shrink-0 rounded-full bg-brand" />
            )}
          </span>
          <span className="shrink-0 text-xs text-stone">{timeAgo(notification.createdAt)}</span>
        </div>
        {listing && (
          <p className="mt-0.5 truncate text-xs text-stone">
            {listing.title} · {formatPrice(listing.price)}
          </p>
        )}
      </div>
    </Link>
  );
}
