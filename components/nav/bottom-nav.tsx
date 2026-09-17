"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, Plus, LayoutGrid, User } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/messages",
    label: "Messages",
    icon: MessageCircle,
    match: (p: string) => p.startsWith("/messages"),
  },
  { href: "/sell", label: "Post", icon: Plus, match: (p: string) => p === "/sell" },
  {
    href: "/groups",
    label: "Groups",
    icon: LayoutGrid,
    match: (p: string) => p.startsWith("/groups") && p !== "/groups/new" && !p.endsWith("/invite"),
  },
  { href: "/profile", label: "Profile", icon: User, match: (p: string) => p === "/profile" },
] as const;

// Hidden on task-flow screens that own the thumb zone with their own
// sticky action bar or submit CTA.
function isHidden(pathname: string): boolean {
  if (pathname.startsWith("/listing/")) return true;
  if (pathname === "/groups/new") return true;
  if (pathname.endsWith("/invite")) return true;
  // Sign-in/sign-up and account settings are their own full-screen flows,
  // not part of the five-tab browsing experience, so the tab bar stays off
  // the whole time someone is in either of them.
  if (pathname.startsWith("/auth")) return true;
  if (pathname.startsWith("/settings")) return true;
  // The inbox (/messages) is a tab destination and keeps the bar, but a
  // specific conversation (/messages/someone) hides it -- same reasoning as
  // listing detail above: the message composer needs the thumb zone.
  if (pathname.startsWith("/messages/")) return true;
  return false;
}

export function BottomNav() {
  const pathname = usePathname();
  const { totalUnreadCount } = useStore();
  if (isHidden(pathname)) return null;

  return (
    <nav
      className="sticky bottom-0 z-20 flex items-stretch border-t border-hairline bg-white/95 backdrop-blur-sm"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {TABS.map(({ href, label, icon: Icon, match }) => {
        const active = match(pathname);
        const isSell = href === "/sell";
        const isMessages = href === "/messages";
        return (
          <Link
            key={href}
            href={href}
            className="flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 py-2 outline-none"
          >
            <span className="relative flex items-center justify-center">
              <Icon
                className={cn(
                  isSell ? "size-6" : "size-[19px]",
                  active ? "text-brand" : "text-stone"
                )}
                strokeWidth={isSell ? 2.25 : 2}
              />
              {/* A small dot rather than a number -- matches the unread dot
                  used on inbox rows, so "something's unread" looks the same
                  everywhere in the app rather than two different styles of
                  badge. */}
              {isMessages && totalUnreadCount > 0 && (
                <span
                  aria-label="Unread messages"
                  className="absolute -right-1 -top-1 size-2 rounded-full bg-brand"
                />
              )}
            </span>
            <span
              className={cn(
                "text-[11px]",
                active ? "font-medium text-brand" : "text-stone"
              )}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
