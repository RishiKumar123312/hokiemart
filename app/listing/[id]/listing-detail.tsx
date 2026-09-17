"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, MapPin } from "lucide-react";
import { AppHeader } from "@/components/nav/app-header";
import { IconButton } from "@/components/ui/icon-button";
import { ListingImage } from "@/components/listing/listing-image";
import { MembersOnlyBanner } from "@/components/group/members-only-banner";
import { Avatar } from "@/components/user/avatar";
import { VerifiedLine } from "@/components/user/verified-line";
import { EmptyState } from "@/components/empty-state";
import { formatPrice, timeAgo } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { HANDOFF_LABEL } from "@/lib/mock-data";

export function ListingDetail({ id }: { id: string }) {
  const router = useRouter();
  const { getListing, getSeller, getGroup, isSaved, toggleSave, openConversationAbout } =
    useStore();

  const listing = getListing(id);

  if (!listing) {
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
          icon={<MapPin className="size-6" />}
          title="This listing isn't around anymore"
          subtitle="It may have been removed."
        />
      </div>
    );
  }

  const seller = getSeller(listing.sellerId);
  const group = listing.groupId ? getGroup(listing.groupId) : undefined;
  const saved = isSaved(listing.id);

  return (
    <div className="pb-28">
      <AppHeader
        left={
          <IconButton aria-label="Back" onClick={() => router.back()}>
            <ArrowLeft className="size-[17px]" />
          </IconButton>
        }
      />

      {group && <MembersOnlyBanner groupId={group.id} groupName={group.name} />}

      {/* Single-slide track so a real photo carousel can drop in later
          without restructuring this section. */}
      <div className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="w-full shrink-0">
          <ListingImage category={listing.category} className="aspect-square" iconClassName="size-14" />
        </div>
      </div>

      <div className="space-y-4 px-4 py-4">
        <div className="space-y-1">
          <h1 className="text-lg font-medium text-foreground">{listing.title}</h1>
          <p className="text-2xl font-medium text-brand">{formatPrice(listing.price)}</p>
          <p className="text-sm text-stone">
            {listing.location} · {timeAgo(listing.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-lg bg-brand-tint px-3 py-1 text-sm text-brand-ink">
            {listing.category}
          </span>
          <span className="rounded-lg bg-brand-tint px-3 py-1 text-sm text-brand-ink">
            {HANDOFF_LABEL[listing.handoff]}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-foreground">{listing.description}</p>

        {seller && (
          <div className="flex items-center gap-3 border-t border-hairline pt-4">
            <Avatar initials={seller.initials} />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">{seller.displayName}</p>
              <VerifiedLine />
            </div>
            <p className="text-sm text-stone">{seller.salesCount} sales</p>
          </div>
        )}

        <div className="rounded-xl bg-muted px-3.5 py-3 text-sm text-stone">
          Meets near {listing.location}. Payment is handled in person between the two of you --
          Maroon Market never touches the money.
        </div>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-md items-center gap-2 border-t border-hairline bg-white/95 px-4 py-3 backdrop-blur-sm"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <button
          type="button"
          onClick={() => {
            // Opens (or starts) the conversation with this seller, making
            // sure this listing's reference card is ready to show, then
            // takes the person straight into that thread.
            openConversationAbout(listing.sellerId, listing.id);
            router.push(`/messages/${listing.sellerId}`);
          }}
          className="h-12 flex-1 rounded-lg bg-brand text-sm font-medium text-white outline-none transition-colors hover:bg-brand/90 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Message seller
        </button>
        <IconButton
          aria-label={saved ? "Remove from saved" : "Save listing"}
          onClick={() => toggleSave(listing.id)}
          className="size-12 border border-hairline"
        >
          <Heart className={cn("size-[19px]", saved ? "fill-brand text-brand" : "text-foreground")} />
        </IconButton>
      </div>
    </div>
  );
}
