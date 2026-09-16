"use client";

// In-memory mock data store for the prototype. Mounted once in the root
// layout, so joins/saves/new listings persist across client-side navigation
// for the lifetime of the tab.
//
// The read functions below (getPublicListings, getGroup, etc.) are named to
// mirror the Supabase queries they'll become -- components call these, never
// the raw arrays, so swapping the backend in later is a matter of rewriting
// this file's internals, not the screens that use it.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User as SupabaseAuthUser } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";
import {
  buildSeedListings,
  seedGroups,
  seedUsers,
  CURRENT_USER_ID,
  type Category,
  type Group,
  type Handoff,
  type Listing,
  type User,
} from "@/lib/mock-data";

// Off = no fake seed data, not "real data" -- listings/groups queries are a
// separate future migration. currentUser is the one exception: it comes from
// the real Supabase session so the auth flow (proxy.ts + /login) can be
// tested without the hardcoded mock user masking who's actually signed in.
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false";

function toStoreUser(user: SupabaseAuthUser | null): User | null {
  if (!user) return null;
  const email = user.email ?? "";
  const namePart = email.split("@")[0] || user.id;
  return {
    id: user.id,
    displayName: email || user.id,
    initials: namePart.slice(0, 2).toUpperCase() || "?",
    verified: false,
    salesCount: 0,
  };
}

type NewListingDraft = {
  title: string;
  price: number;
  category: Category;
  description: string;
  location: string;
  groupId: string | null;
  handoff: Handoff;
};

type NewGroupDraft = {
  name: string;
  description: string;
  joinPolicy: Group["joinPolicy"];
  iconKey: Group["iconKey"];
};

type RedeemResult = { success: true; groupId: string } | { success: false; error: string };

type StoreState = {
  listings: Listing[];
  groups: Group[];
  currentUser: User | null;
  // True only while the real Supabase session is still resolving (mock mode
  // never sets this -- currentUser is available synchronously). Lets screens
  // tell "not signed in yet" apart from "still loading" instead of treating
  // a null currentUser as a permanent logged-out state.
  isAuthLoading: boolean;
  hasLoadedOnce: boolean;
  markLoaded: () => void;

  // reads
  getPublicListings: () => Listing[];
  getGroupListings: (groupId: string) => Listing[];
  getSavedListings: () => Listing[];
  getListing: (id: string) => Listing | undefined;
  getSeller: (id: string) => User | undefined;
  getGroup: (id: string) => Group | undefined;
  getMyGroups: () => Group[];
  getDiscoverGroups: () => Group[];
  isMember: (groupId: string) => boolean;
  isRequested: (groupId: string) => boolean;
  isSaved: (listingId: string) => boolean;
  getUnreadCount: (groupId: string) => number;
  savedCount: number;

  // mutations
  addListing: (draft: NewListingDraft) => Listing;
  toggleSave: (listingId: string) => void;
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  requestJoin: (groupId: string) => void;
  cancelRequest: (groupId: string) => void;
  redeemInviteCode: (code: string) => RedeemResult;
  createGroup: (draft: NewGroupDraft) => Group;
};

const StoreContext = createContext<StoreState | null>(null);

function makeId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function makeInviteCode(name: string): string {
  const letters = name.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 5) || "GROUP";
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${letters}${suffix}`;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(() =>
    USE_MOCK_DATA ? buildSeedListings() : []
  );
  const [groups, setGroups] = useState<Group[]>(() => (USE_MOCK_DATA ? seedGroups : []));
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());
  const [joinedIds, setJoinedIds] = useState<Set<string>>(() =>
    USE_MOCK_DATA ? new Set(seedGroups.filter((g) => g.isMember).map((g) => g.id)) : new Set()
  );
  const [requestedIds, setRequestedIds] = useState<Set<string>>(() => new Set());
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    USE_MOCK_DATA ? seedUsers.find((u) => u.id === CURRENT_USER_ID)! : null
  );
  const [isAuthLoading, setIsAuthLoading] = useState(!USE_MOCK_DATA);

  useEffect(() => {
    if (USE_MOCK_DATA) return;
    const supabase = createClient();
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setCurrentUser(toStoreUser(data.user));
      setIsAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(toStoreUser(session?.user ?? null));
      setIsAuthLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const markLoaded = useCallback(() => setHasLoadedOnce(true), []);

  const getPublicListings = useCallback(
    () => listings.filter((l) => l.groupId === null),
    [listings]
  );

  const getGroupListings = useCallback(
    (groupId: string) => listings.filter((l) => l.groupId === groupId),
    [listings]
  );

  const getSavedListings = useCallback(
    () => listings.filter((l) => savedIds.has(l.id)),
    [listings, savedIds]
  );

  const getListing = useCallback(
    (id: string) => listings.find((l) => l.id === id),
    [listings]
  );

  const getSeller = useCallback(
    (id: string): User | undefined => {
      if (!USE_MOCK_DATA) return currentUser && currentUser.id === id ? currentUser : undefined;
      return seedUsers.find((u) => u.id === id);
    },
    [currentUser]
  );

  const getGroup = useCallback((id: string) => groups.find((g) => g.id === id), [groups]);

  const getMyGroups = useCallback(
    () => groups.filter((g) => joinedIds.has(g.id)),
    [groups, joinedIds]
  );

  const getDiscoverGroups = useCallback(
    // Requested (approval-pending) groups stay visible here with a
    // "Requested" pill instead of disappearing -- only joining or an
    // invite-only policy removes a group from Discover.
    () => groups.filter((g) => g.joinPolicy !== "invite" && !joinedIds.has(g.id)),
    [groups, joinedIds]
  );

  const isMember = useCallback((groupId: string) => joinedIds.has(groupId), [joinedIds]);
  const isRequested = useCallback((groupId: string) => requestedIds.has(groupId), [requestedIds]);
  const isSaved = useCallback((listingId: string) => savedIds.has(listingId), [savedIds]);

  const getUnreadCount = useCallback(
    (groupId: string) => listings.filter((l) => l.groupId === groupId).length,
    [listings]
  );

  const addListing = useCallback(
    (draft: NewListingDraft): Listing => {
      const listing: Listing = {
        id: makeId("l"),
        title: draft.title,
        price: draft.price,
        category: draft.category,
        description: draft.description,
        imageUrl: null,
        location: draft.location || "Blacksburg",
        createdAt: new Date().toISOString(),
        sellerId: currentUser?.id ?? CURRENT_USER_ID,
        groupId: draft.groupId,
        handoff: draft.handoff,
      };
      setListings((prev) => [listing, ...prev]);
      return listing;
    },
    [currentUser]
  );

  const toggleSave = useCallback((listingId: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(listingId)) next.delete(listingId);
      else next.add(listingId);
      return next;
    });
  }, []);

  const joinGroup = useCallback((groupId: string) => {
    setJoinedIds((prev) => {
      if (prev.has(groupId)) return prev;
      const next = new Set(prev);
      next.add(groupId);
      return next;
    });
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, memberCount: g.memberCount + 1 } : g))
    );
  }, []);

  const leaveGroup = useCallback((groupId: string) => {
    setJoinedIds((prev) => {
      if (!prev.has(groupId)) return prev;
      const next = new Set(prev);
      next.delete(groupId);
      return next;
    });
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, memberCount: Math.max(0, g.memberCount - 1) } : g
      )
    );
  }, []);

  const requestJoin = useCallback((groupId: string) => {
    setRequestedIds((prev) => {
      if (prev.has(groupId)) return prev;
      const next = new Set(prev);
      next.add(groupId);
      return next;
    });
  }, []);

  const cancelRequest = useCallback((groupId: string) => {
    setRequestedIds((prev) => {
      if (!prev.has(groupId)) return prev;
      const next = new Set(prev);
      next.delete(groupId);
      return next;
    });
  }, []);

  const redeemInviteCode = useCallback(
    (code: string): RedeemResult => {
      const trimmed = code.trim().toUpperCase();
      if (!trimmed) return { success: false, error: "Enter a code first." };
      const group = groups.find((g) => g.inviteCode.toUpperCase() === trimmed);
      if (!group) return { success: false, error: "That code doesn't match a group." };
      if (!joinedIds.has(group.id)) {
        setJoinedIds((prev) => new Set(prev).add(group.id));
        setGroups((prev) =>
          prev.map((g) => (g.id === group.id ? { ...g, memberCount: g.memberCount + 1 } : g))
        );
      }
      return { success: true, groupId: group.id };
    },
    [groups, joinedIds]
  );

  const createGroup = useCallback((draft: NewGroupDraft): Group => {
    const group: Group = {
      id: makeId("g"),
      name: draft.name,
      description: draft.description,
      memberCount: 1,
      joinPolicy: draft.joinPolicy,
      iconKey: draft.iconKey,
      isMember: true,
      inviteCode: makeInviteCode(draft.name),
    };
    setGroups((prev) => [group, ...prev]);
    setJoinedIds((prev) => new Set(prev).add(group.id));
    return group;
  }, []);

  const savedCount = savedIds.size;

  const value = useMemo<StoreState>(
    () => ({
      listings,
      groups,
      currentUser,
      isAuthLoading,
      hasLoadedOnce,
      markLoaded,
      getPublicListings,
      getGroupListings,
      getSavedListings,
      getListing,
      getSeller,
      getGroup,
      getMyGroups,
      getDiscoverGroups,
      isMember,
      isRequested,
      isSaved,
      getUnreadCount,
      savedCount,
      addListing,
      toggleSave,
      joinGroup,
      leaveGroup,
      requestJoin,
      cancelRequest,
      redeemInviteCode,
      createGroup,
    }),
    [
      listings,
      groups,
      currentUser,
      isAuthLoading,
      hasLoadedOnce,
      markLoaded,
      getPublicListings,
      getGroupListings,
      getSavedListings,
      getListing,
      getSeller,
      getGroup,
      getMyGroups,
      getDiscoverGroups,
      isMember,
      isRequested,
      isSaved,
      getUnreadCount,
      savedCount,
      addListing,
      toggleSave,
      joinGroup,
      leaveGroup,
      requestJoin,
      cancelRequest,
      redeemInviteCode,
      createGroup,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreState {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within a StoreProvider");
  return ctx;
}
