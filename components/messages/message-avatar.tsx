import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

// The small round picture that stands in for a person in messaging -- a
// circle, like the avatar used elsewhere in the app
// (components/user/avatar.tsx), even though the rest of messaging's
// structural elements (the reference card's thumbnail, for one) stay
// square. A person's photo is the one thing here that gets the rounder,
// friendlier treatment.
//
// There are three things this can show, and all three render at the exact
// same 38x38 size so a row's height never jumps depending on which one a
// particular person happens to have:
//   1. a real photo, if one is ever set (not possible in this prototype yet)
//   2. that person's initials, in serif maroon, if we at least know their name
//   3. a plain person outline, if we don't know anything about them at all
export function MessageAvatar({
  initials,
  photoUrl,
  className,
}: {
  initials?: string;
  photoUrl?: string | null;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex size-[38px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-rule bg-tile",
        className
      )}
    >
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- a plain <img> is fine here; this is mock data, not a Next-optimized asset pipeline.
        <img src={photoUrl} alt="" className="size-full object-cover" />
      ) : initials ? (
        <span className="font-editorial text-[13px] text-brand">{initials}</span>
      ) : (
        <UserRound className="size-4 text-[#C2BAB2]" strokeWidth={1.5} />
      )}
    </div>
  );
}
