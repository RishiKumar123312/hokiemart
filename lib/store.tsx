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
import { initialsFromName } from "@/lib/format";
import {
  buildSeedListings,
  buildSeedConversations,
  seedGroups,
  seedUsers,
  CURRENT_USER_ID,
  type Category,
  type Conversation,
  type Group,
  type Handoff,
  type Listing,
  type Message,
  type Notification,
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

// What the finished sign-up flow hands off to the store. Field names match
// SignupDraft in lib/signup-context.tsx.
type SignupHandoff = {
  email: string;
  fullName: string;
  username: string;
  phone: string;
  phoneHidden: boolean;
  emailHidden: boolean;
};

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

  // messaging reads
  // Every conversation the signed-in person is part of, newest activity
  // first (whichever conversation has the most recent message sorts to the
  // top -- same idea as the feed always showing newest listings first).
  getConversations: () => Conversation[];
  getConversation: (otherUserId: string) => Conversation | undefined;
  // Looks up any user by id -- named separately from getSeller even though
  // it does the same lookup, because "who is this listing's seller" and
  // "who am I talking to" are different questions that happen to share an
  // implementation.
  getOtherUser: (id: string) => User | undefined;
  // How many messages are unread across every conversation, added together
  // -- what the inbox header sentence and the little dots on the Messages
  // tab and the feed's message icon all read from.
  totalUnreadCount: number;

  // notification reads
  // Every notification, newest first.
  getNotifications: () => Notification[];
  isCategoryFollowed: (category: Category) => boolean;
  isGroupNotifyOn: (groupId: string) => boolean;
  // How many notifications haven't been opened yet -- feeds the bell icon's
  // dot and the notifications screen's own heading sentence.
  unreadNotificationCount: number;

  // mutations
  addListing: (draft: NewListingDraft) => Listing;
  toggleSave: (listingId: string) => void;
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  requestJoin: (groupId: string) => void;
  cancelRequest: (groupId: string) => void;
  redeemInviteCode: (code: string) => RedeemResult;
  createGroup: (draft: NewGroupDraft) => Group;
  // Takes everything gathered during sign-up and makes it the signed-in
  // person's profile. Only actually changes anything while running on
  // pretend data -- see the comment on the function itself for why.
  applySignup: (handoff: SignupHandoff) => void;
  // Changes one or more fields on the signed-in person's profile -- used by
  // every "edit" screen in account settings (name, username, the privacy
  // pills, and so on) so there is a single place that does this update.
  updateProfile: (patch: Partial<User>) => void;

  // messaging mutations
  // Adds a message to the conversation with this person (creating the
  // conversation first if it doesn't exist yet), sent from the signed-in
  // person. Blank messages are silently ignored.
  sendMessage: (otherUserId: string, body: string) => void;
  // Clears the unread count on a conversation. Called the moment its thread
  // screen opens.
  markConversationRead: (otherUserId: string) => void;
  // What "Message seller" on a listing actually does: opens (or starts) the
  // conversation with that seller, and makes sure a reference card for this
  // listing will show up -- but only if the conversation isn't already on
  // this exact listing, so tapping the button twice in a row doesn't insert
  // two identical cards.
  openConversationAbout: (sellerId: string, listingId: string) => void;

  // notification mutations
  // Turns following a category on or off. A followed category creates a
  // notification the next time any new listing lands in it.
  toggleCategoryFollow: (category: Category) => void;
  // Turns notifications for a specific group's new listings on or off --
  // separate from being a member, so joining a group doesn't automatically
  // sign you up for its notifications.
  toggleGroupNotify: (groupId: string) => void;
  // Marks every notification as read. Called the moment the notifications
  // screen opens, the same way a message thread clears its own unread
  // count on open.
  markNotificationsRead: () => void;
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

// Works out what a conversation is "currently about," by looking at the most
// recent message that mentioned a listing (or, if nobody has said anything
// yet, whatever listing the conversation was opened about). Used to decide
// whether "Message seller" needs to insert a new reference card or whether
// the conversation is already on that subject.
function currentSubjectOf(conversation: Conversation): string | null {
  for (let i = conversation.messages.length - 1; i >= 0; i--) {
    const listingId = conversation.messages[i].listingId;
    if (listingId) return listingId;
  }
  return conversation.pendingListingId;
}

// Works out which notifications (zero, one, or both) a brand-new listing
// should trigger: one if its category is followed, another if it landed in
// a group whose notifications are turned on. There's only one real account
// in this prototype, so this checks the current person's own follows/group
// settings -- posting something that matches your own subscription is how
// you see the feature actually work, standing in for "someone else who
// follows this would get notified."
function notificationsForNewListing(
  listing: Listing,
  followedCategories: Set<Category>,
  groupNotifyIds: Set<string>,
  groups: Group[]
): Notification[] {
  const created: Notification[] = [];

  if (followedCategories.has(listing.category)) {
    created.push({
      id: makeId("n"),
      kind: "category",
      sourceId: listing.category,
      sourceLabel: listing.category,
      listingId: listing.id,
      createdAt: new Date().toISOString(),
      read: false,
    });
  }

  if (listing.groupId && groupNotifyIds.has(listing.groupId)) {
    const group = groups.find((g) => g.id === listing.groupId);
    created.push({
      id: makeId("n"),
      kind: "group",
      sourceId: listing.groupId,
      sourceLabel: group?.name ?? "your group",
      listingId: listing.id,
      createdAt: new Date().toISOString(),
      read: false,
    });
  }

  return created;
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
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    USE_MOCK_DATA ? buildSeedConversations() : []
  );

  // Notifications start completely empty and opt-in, on purpose -- nobody
  // follows a category or has a group's notifications turned on until they
  // actually flip one of those switches themselves. See addListing below
  // for where a notification actually gets created.
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [followedCategories, setFollowedCategories] = useState<Set<Category>>(() => new Set());
  const [groupNotifyIds, setGroupNotifyIds] = useState<Set<string>>(() => new Set());

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

  const getConversations = useCallback(() => {
    // Sort by whichever conversation's most recent message is newest --
    // same "newest activity first" idea used for the listings feed, just
    // keyed off the last message instead of when the item was created.
    return [...conversations].sort((a, b) => {
      const aLast = a.messages[a.messages.length - 1]?.sentAt;
      const bLast = b.messages[b.messages.length - 1]?.sentAt;
      const aTime = aLast ? new Date(aLast).getTime() : 0;
      const bTime = bLast ? new Date(bLast).getTime() : 0;
      return bTime - aTime;
    });
  }, [conversations]);

  const getConversation = useCallback(
    (otherUserId: string) => conversations.find((c) => c.otherUserId === otherUserId),
    [conversations]
  );

  // Same underlying lookup as getSeller -- kept as a separate name because,
  // from a messaging screen, "who is this person" reads more clearly than
  // "who is this listing's seller."
  const getOtherUser = useCallback((id: string) => getSeller(id), [getSeller]);

  const getNotifications = useCallback(
    () => [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [notifications]
  );

  const isCategoryFollowed = useCallback(
    (category: Category) => followedCategories.has(category),
    [followedCategories]
  );

  const isGroupNotifyOn = useCallback(
    (groupId: string) => groupNotifyIds.has(groupId),
    [groupNotifyIds]
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

      const created = notificationsForNewListing(listing, followedCategories, groupNotifyIds, groups);
      if (created.length > 0) setNotifications((prev) => [...created, ...prev]);

      return listing;
    },
    [currentUser, followedCategories, groupNotifyIds, groups]
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

  const applySignup = useCallback((handoff: SignupHandoff) => {
    // In real mode, Supabase is the source of truth for who is signed in --
    // overwriting currentUser here would fight the real session, so this
    // deliberately does nothing outside of demo mode.
    if (!USE_MOCK_DATA) return;
    setCurrentUser((prev) => ({
      // Keep the existing id, verified flag and sales count -- sign-up
      // shouldn't reset someone's history, just fill in who they are.
      ...(prev ?? { id: CURRENT_USER_ID, verified: true, salesCount: 0 }),
      displayName: handoff.fullName,
      initials: initialsFromName(handoff.fullName),
      email: handoff.email,
      username: handoff.username,
      phone: handoff.phone,
      phoneHidden: handoff.phoneHidden,
      emailHidden: handoff.emailHidden,
      hasPassword: true,
    }));
  }, []);

  const updateProfile = useCallback((patch: Partial<User>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const sendMessage = useCallback(
    (otherUserId: string, body: string) => {
      const trimmed = body.trim();
      if (!trimmed) return; // Nothing to send -- the composer should never call this with empty text anyway.

      setConversations((prev) => {
        const existing = prev.find((c) => c.otherUserId === otherUserId);
        const base: Conversation =
          existing ?? {
            id: makeId("c"),
            otherUserId,
            messages: [],
            unreadCount: 0,
            pendingListingId: null,
          };

        const message: Message = {
          id: makeId("m"),
          conversationId: base.id,
          senderId: currentUser?.id ?? CURRENT_USER_ID,
          body: trimmed,
          sentAt: new Date().toISOString(),
          // If this conversation was just opened from a listing's "Message
          // seller" button, that listing is waiting right here -- this new
          // message is the first thing said, so it's what the reference
          // card attaches to.
          listingId: base.pendingListingId,
        };

        const updated: Conversation = {
          ...base,
          messages: [...base.messages, message],
          pendingListingId: null,
        };

        if (existing) return prev.map((c) => (c.id === existing.id ? updated : c));
        return [updated, ...prev];
      });
    },
    [currentUser]
  );

  const markConversationRead = useCallback((otherUserId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.otherUserId === otherUserId ? { ...c, unreadCount: 0 } : c))
    );
  }, []);

  const openConversationAbout = useCallback((sellerId: string, listingId: string) => {
    setConversations((prev) => {
      const existing = prev.find((c) => c.otherUserId === sellerId);

      if (!existing) {
        const conversation: Conversation = {
          id: makeId("c"),
          otherUserId: sellerId,
          messages: [],
          unreadCount: 0,
          // Nothing has been said yet, so there's no message for the
          // reference card to attach to -- it waits here until the first
          // message is actually sent.
          pendingListingId: listingId,
        };
        return [conversation, ...prev];
      }

      // Already mid-conversation about this exact listing -- leave it
      // alone rather than queuing up a second, identical card.
      if (currentSubjectOf(existing) === listingId) return prev;

      return prev.map((c) => (c.id === existing.id ? { ...c, pendingListingId: listingId } : c));
    });
  }, []);

  const toggleCategoryFollow = useCallback((category: Category) => {
    setFollowedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }, []);

  const toggleGroupNotify = useCallback((groupId: string) => {
    setGroupNotifyIds((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  }, []);

  const markNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => (n.read ? n : { ...n, read: true })));
  }, []);

  const savedCount = savedIds.size;
  // Added together across every conversation, so one number can feed the
  // inbox heading, the Messages tab dot, and the feed header dot without
  // any of them being able to disagree with the others.
  const totalUnreadCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

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
      getConversations,
      getConversation,
      getOtherUser,
      totalUnreadCount,
      getNotifications,
      isCategoryFollowed,
      isGroupNotifyOn,
      unreadNotificationCount,
      addListing,
      toggleSave,
      joinGroup,
      leaveGroup,
      requestJoin,
      cancelRequest,
      redeemInviteCode,
      createGroup,
      applySignup,
      updateProfile,
      sendMessage,
      markConversationRead,
      openConversationAbout,
      toggleCategoryFollow,
      toggleGroupNotify,
      markNotificationsRead,
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
      getConversations,
      getConversation,
      getOtherUser,
      totalUnreadCount,
      getNotifications,
      isCategoryFollowed,
      isGroupNotifyOn,
      unreadNotificationCount,
      addListing,
      toggleSave,
      joinGroup,
      leaveGroup,
      requestJoin,
      cancelRequest,
      redeemInviteCode,
      createGroup,
      applySignup,
      updateProfile,
      sendMessage,
      markConversationRead,
      openConversationAbout,
      toggleCategoryFollow,
      toggleGroupNotify,
      markNotificationsRead,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreState {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within a StoreProvider");
  return ctx;
}
