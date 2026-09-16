"use client";

import { ChevronRight, Star, ShieldCheck, Settings } from "lucide-react";
import { AppHeader } from "@/components/nav/app-header";
import { Avatar } from "@/components/user/avatar";
import { VerifiedLine } from "@/components/user/verified-line";
import { useStore } from "@/lib/store";

const SETTINGS_ROWS = [
  { icon: Star, label: "Reviews" },
  { icon: ShieldCheck, label: "Verification status" },
  { icon: Settings, label: "Settings" },
];

export default function ProfilePage() {
  const { currentUser, listings, getMyGroups, savedCount } = useStore();

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
          { label: "Listings", value: listingCount },
          { label: "Groups", value: groupCount },
          { label: "Saved", value: savedCount },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-0.5 rounded-xl border border-hairline py-3.5"
          >
            <span className="font-medium text-foreground">{stat.value}</span>
            <span className="text-xs text-stone">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 divide-y divide-hairline border-y border-hairline">
        {SETTINGS_ROWS.map(({ icon: Icon, label }) => (
          <div key={label} className="flex min-h-11 items-center gap-3 px-4 py-3">
            <Icon className="size-4 text-stone" />
            <span className="flex-1 text-sm text-foreground">{label}</span>
            <ChevronRight className="size-4 text-stone" />
          </div>
        ))}
      </div>
    </div>
  );
}
