"use client";

import { ChevronRight, Heart, Star, ShieldCheck, Settings, UserRound } from "lucide-react";
import Link from "next/link";
import { AppHeader } from "@/components/nav/app-header";
import { Avatar } from "@/components/user/avatar";
import { VerifiedLine } from "@/components/user/verified-line";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// The "href" on a row is where tapping it goes. Rows without one (Reviews,
// Verification status) are out of scope for this app so far and stay
// non-clickable placeholders.
const SETTINGS_ROWS: { icon: typeof Star; label: string; href?: string }[] = [
  // Saved moved here from the bottom nav -- it used to be its own tab, now
  // it's a row here instead, right above Reviews.
  { icon: Heart, label: "Saved items", href: "/saved" },
  { icon: Star, label: "Reviews" },
  { icon: ShieldCheck, label: "Verification status" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function ProfilePage() {
  const { currentUser, isAuthLoading, listings, getMyGroups, savedCount } = useStore();

  // isAuthLoading only ever true in real (non-mock) mode, for the brief
  // window before supabase.auth.getUser() resolves.
  if (isAuthLoading) {
    return (
      <div className="pb-6">
        <AppHeader title="You" />
        <div className="flex flex-col items-center gap-2 px-4 pb-5 pt-6">
          <Skeleton className="size-16 rounded-full" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>
      </div>
    );
  }

  // proxy.ts already keeps unauthenticated requests off this route, so this
  // is a defensive fallback (session expired mid-visit, etc.) rather than
  // the expected path.
  if (!currentUser) {
    return (
      <div className="pb-6">
        <AppHeader title="You" />
        <EmptyState
          icon={<UserRound className="size-6" />}
          title="You're not signed in"
          subtitle="Sign in to see your profile."
          action={
            <Link
              href="/login"
              className="flex min-h-11 items-center rounded-lg bg-brand px-4 text-sm font-medium text-white"
            >
              Go to sign in
            </Link>
          }
        />
      </div>
    );
  }

  const listingCount = listings.filter((l) => l.sellerId === currentUser.id).length;
  const groupCount = getMyGroups().length;

  return (
    <div className="pb-6">
      <AppHeader title="You" />

      <div className="flex flex-col items-center gap-2 px-4 pb-5 pt-6 text-center">
        <Avatar initials={currentUser.initials} size="lg" />
        <p className="font-medium text-foreground">{currentUser.displayName}</p>
        <VerifiedLine />
      </div>

      <div className="grid grid-cols-3 gap-2 px-4">
        {[
          { label: "Listings", value: listingCount, href: undefined },
          { label: "Groups", value: groupCount, href: undefined },
          { label: "Saved", value: savedCount, href: "/saved" },
        ].map((stat) => {
          const tileClassName =
            "flex flex-col items-center gap-0.5 rounded-xl border border-hairline py-3.5";
          const tileContent = (
            <>
              <span className="font-medium text-foreground">{stat.value}</span>
              <span className="text-xs text-stone">{stat.label}</span>
            </>
          );
          // Only the Saved tile links anywhere -- Listings and Groups stay
          // plain counts, since there's no single screen listing "all my
          // listings" or "all my groups" the way /saved already exists.
          return stat.href ? (
            <Link
              key={stat.label}
              href={stat.href}
              className={cn(tileClassName, "cursor-pointer outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50")}
            >
              {tileContent}
            </Link>
          ) : (
            <div key={stat.label} className={tileClassName}>
              {tileContent}
            </div>
          );
        })}
      </div>

      <div className="mt-5 divide-y divide-hairline border-y border-hairline">
        {SETTINGS_ROWS.map(({ icon: Icon, label, href }) => {
          const content = (
            <>
              <Icon className="size-4 text-stone" />
              <span className="flex-1 text-sm text-foreground">{label}</span>
              <ChevronRight className="size-4 text-stone" />
            </>
          );
          // Rows with a destination are real links; the others render the
          // exact same look as a plain (non-clickable) row.
          return href ? (
            <Link
              key={label}
              href={href}
              className="flex min-h-11 cursor-pointer items-center gap-3 px-4 py-3 outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {content}
            </Link>
          ) : (
            <div key={label} className="flex min-h-11 items-center gap-3 px-4 py-3">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
