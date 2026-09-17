// All mock data for the Maroon Market prototype lives here. Shapes are
// designed so that swapping in Supabase later means replacing the fetch
// functions in store.tsx, not rewriting components or these types.

export type Category = "Furniture" | "Tickets" | "Textbooks" | "Clothes" | "Other";

export const CATEGORIES: Category[] = [
  "Furniture",
  "Tickets",
  "Textbooks",
  "Clothes",
  "Other",
];

// How a listing can change hands: pickup-only, delivery (seller can bring
// it to you), or both. A single boolean can't represent "both," so this is
// a real tri-state rather than a flag.
export type Handoff = "Pickup only" | "Delivery" | "Both";

// The words shown for each handoff option -- kept here, next to the type
// itself, so every screen that displays a listing's handoff (the listing
// detail page, and the messaging reference card) shows the exact same
// wording instead of each one writing its own slightly different version.
export const HANDOFF_LABEL: Record<Handoff, string> = {
  "Pickup only": "Pickup only",
  Delivery: "Delivery available",
  Both: "Pickup or delivery",
};

export type Listing = {
  id: string;
  title: string;
  price: number;
  category: Category;
  description: string;
  imageUrl: string | null; // always null in this prototype -- see ListingImage
  location: string; // e.g. "Foxridge", "Squires"
  createdAt: string; // ISO string, derived from minutesAgo at seed time
  sellerId: string;
  groupId: string | null; // null = public feed
  handoff: Handoff;
};

export type JoinPolicy = "open" | "approval" | "invite";

export type Group = {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  joinPolicy: JoinPolicy;
  iconKey: GroupIconKey;
  isMember: boolean; // seed input only -- the store owns membership truth
  inviteCode: string;
};

export type GroupIconKey =
  | "code"
  | "home"
  | "shield"
  | "mountain"
  | "greek";

export type User = {
  id: string;
  displayName: string;
  initials: string;
  verified: boolean;
  salesCount: number;
  // Everything below is optional. It's new -- added for sign-up and account
  // settings -- and the teammate's real-Supabase-user code path doesn't set
  // any of it yet, so making these required would break that code. A screen
  // that reads one of these should treat "not present" the same as "empty".
  email?: string; // The verified @vt.edu address.
  username?: string;
  phone?: string;
  phoneHidden?: boolean; // true = only the user themself can see their phone number.
  emailHidden?: boolean; // true = other students can't see the actual email address.
  hasPassword?: boolean; // Whether password sign-in is turned on for this account.
};

// ---------------------------------------------------------------------------
// Messaging
// ---------------------------------------------------------------------------

// One message inside a conversation between two people.
export type Message = {
  id: string;
  conversationId: string;
  senderId: string; // a user id -- the signed-in person is CURRENT_USER_ID
  body: string;
  sentAt: string; // ISO timestamp, derived from minutesAgo at seed time
  // Set only on the message where the conversation's subject changes to this
  // listing. That's what tells the thread screen where to draw a listing
  // reference card -- most messages have this as null.
  listingId: string | null;
};

// A conversation is between the signed-in person and exactly one other
// person -- not one conversation per listing. If that person messages about
// two different listings, both live in this same conversation's messages,
// each marked by its own message.listingId.
export type Conversation = {
  id: string;
  otherUserId: string;
  messages: Message[];
  unreadCount: number;
  // Set when a conversation is opened from a listing's "Message seller"
  // button before either person has typed anything -- it lets the thread
  // show that listing's reference card immediately. Cleared as soon as the
  // first real message is sent, since that message carries its own
  // listingId at that point. Always null for the seeded conversations
  // below, because they already start with messages.
  pendingListingId: string | null;
};

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

// What caused a notification to be created: either a new listing in a
// category the person follows, or a new listing in a group they've turned
// on notifications for.
export type NotificationKind = "category" | "group";

export type Notification = {
  id: string;
  kind: NotificationKind;
  // The category name, or the group id, depending on `kind`.
  sourceId: string;
  // What to actually print on screen for that source -- for a category
  // this is just the category name, but for a group it's the group's
  // display name, which sourceId (the group's id) isn't.
  sourceLabel: string;
  listingId: string;
  createdAt: string;
  read: boolean;
};

// ---------------------------------------------------------------------------
// Seed: users
// ---------------------------------------------------------------------------

export const CURRENT_USER_ID = "u1";

export const seedUsers: User[] = [
  {
    id: "u1",
    displayName: "Maya Patel",
    initials: "MP",
    verified: true,
    salesCount: 6,
    email: "mpatel28@vt.edu",
    username: "maya_p28",
    phone: "(540) 555-0142",
    phoneHidden: true,
    emailHidden: true,
    hasPassword: true,
  },
  { id: "u2", displayName: "Jordan Webb", initials: "JW", verified: true, salesCount: 14 },
  { id: "u3", displayName: "Caleb Nguyen", initials: "CN", verified: true, salesCount: 2 },
  { id: "u4", displayName: "Ava Thompson", initials: "AT", verified: true, salesCount: 9 },
  { id: "u5", displayName: "Ryan Osei", initials: "RO", verified: true, salesCount: 21 },
  // Only used in the messaging seed data below, as the person whose
  // conversation with Maya has gone quiet.
  { id: "u6", displayName: "Priya Shah", initials: "PS", verified: true, salesCount: 4 },
];

// ---------------------------------------------------------------------------
// Seed: groups
// ---------------------------------------------------------------------------

export const seedGroups: Group[] = [
  {
    id: "g1",
    name: "ACM at VT",
    description: "The ACM student chapter's marketplace for members.",
    memberCount: 214,
    joinPolicy: "open",
    iconKey: "code",
    isMember: true,
    inviteCode: "ACMVT24",
  },
  {
    id: "g2",
    name: "Foxridge apartments",
    description: "For residents of Foxridge only -- move-in/move-out deals.",
    memberCount: 89,
    joinPolicy: "approval",
    iconKey: "home",
    isMember: true,
    inviteCode: "FOX2026",
  },
  {
    id: "g3",
    name: "Corps of Cadets",
    description: "Corps members buying and selling gear and uniforms.",
    memberCount: 340,
    joinPolicy: "approval",
    iconKey: "shield",
    isMember: false,
    inviteCode: "CORPS26",
  },
  {
    id: "g4",
    name: "VT climbing club",
    description: "Gear swaps and trip logistics for club members.",
    memberCount: 156,
    joinPolicy: "open",
    iconKey: "mountain",
    isMember: false,
    inviteCode: "SENDIT26",
  },
  {
    id: "g5",
    name: "Pi Kappa Alpha",
    description: "Brothers only -- invite code required.",
    memberCount: 62,
    joinPolicy: "invite",
    iconKey: "greek",
    isMember: false,
    inviteCode: "PIKE2026",
  },
];

// ---------------------------------------------------------------------------
// Seed: listings
// minutesAgo is converted to a real createdAt ISO string at store init time,
// so "2h ago" stays accurate no matter when this prototype is actually run.
// ---------------------------------------------------------------------------

type SeedListing = Omit<Listing, "createdAt"> & { minutesAgo: number };

export const seedListingsRaw: SeedListing[] = [
  {
    id: "l1",
    title: "2 tickets: VT vs Miami, section 5",
    price: 140,
    category: "Tickets",
    description:
      "Two tickets together in section 5, upper. Can't make the game anymore -- mobile transfer through the Hokies app.",
    imageUrl: null,
    location: "Lane Stadium",
    minutesAgo: 25,
    sellerId: "u2",
    groupId: null,
    handoff: "Delivery",
  },
  {
    id: "l2",
    title: "IKEA futon, grey",
    price: 60,
    category: "Furniture",
    description:
      "Moving out of Pheasant Run and it won't fit in the car. Minor wear on the arms, frame is solid. You'll need a truck or a big trunk.",
    imageUrl: null,
    location: "Pheasant Run",
    minutesAgo: 95,
    sellerId: "u4",
    groupId: null,
    handoff: "Pickup only",
  },
  {
    id: "l3",
    title: "CS 2114 textbook + notes",
    price: 35,
    category: "Textbooks",
    description:
      "Object-Oriented Design textbook, 5th edition, plus a full semester of handwritten notes and old exams (Dr. Shaffer's section).",
    imageUrl: null,
    location: "Torgersen",
    minutesAgo: 180,
    sellerId: "u3",
    groupId: null,
    handoff: "Both",
  },
  {
    id: "l4",
    title: "North Face puffer, women's M",
    price: 45,
    category: "Clothes",
    description: "Black, worn one winter, no rips or stains. Warm for the walk up the drillfield.",
    imageUrl: null,
    location: "Terrace View",
    minutesAgo: 240,
    sellerId: "u1",
    groupId: null,
    handoff: "Both",
  },
  {
    id: "l5",
    title: "Mini fridge, 3.2 cu ft",
    price: 50,
    category: "Furniture",
    description: "Worked fine all year in my dorm. Cleaned out and ready to go. Freezer compartment included.",
    imageUrl: null,
    location: "Pritchard Hall",
    minutesAgo: 320,
    sellerId: "u5",
    groupId: null,
    handoff: "Pickup only",
  },
  {
    id: "l6",
    title: "Basketball season ticket, single game vs UNC",
    price: 30,
    category: "Tickets",
    description: "Lower level, can't go anymore because of a lab conflict. First come first served.",
    imageUrl: null,
    location: "Cassell Coliseum",
    minutesAgo: 400,
    sellerId: "u2",
    groupId: null,
    handoff: "Delivery",
  },
  {
    id: "l7",
    title: "MATH 1226 textbook, like new",
    price: 25,
    category: "Textbooks",
    description: "Calc 2 textbook, barely opened. No writing inside. Bought new, switched sections and didn't need it.",
    imageUrl: null,
    location: "McBryde",
    minutesAgo: 500,
    sellerId: "u4",
    groupId: null,
    handoff: "Delivery",
  },
  {
    id: "l8",
    title: "Desk lamp + storage bins bundle",
    price: 15,
    category: "Other",
    description: "Clearing out my room before summer. Lamp works great, three matching storage bins.",
    imageUrl: null,
    location: "Squires",
    minutesAgo: 610,
    sellerId: "u3",
    groupId: null,
    handoff: "Pickup only",
  },
  // Group-scoped listings
  {
    id: "l9",
    title: "Mechanical keyboard, barely used",
    price: 55,
    category: "Other",
    description: "Picked up at a chapter build night and never used it. Hot-swappable switches, comes with the box.",
    imageUrl: null,
    location: "Squires",
    minutesAgo: 60,
    sellerId: "u3",
    groupId: "g1",
    handoff: "Both",
  },
  {
    id: "l10",
    title: "CS 3114 course pack + old exams",
    price: 20,
    category: "Textbooks",
    description: "Everything from last semester's section, organized by unit. Helped me a ton for the final.",
    imageUrl: null,
    location: "Torgersen",
    minutesAgo: 140,
    sellerId: "u1",
    groupId: "g1",
    handoff: "Delivery",
  },
  {
    id: "l11",
    title: "Moving out: dresser + mirror",
    price: 80,
    category: "Furniture",
    description: "Six-drawer dresser with attached mirror. Lease ends in two weeks, needs to go. Foxridge residents get first pick.",
    imageUrl: null,
    location: "Foxridge",
    minutesAgo: 45,
    sellerId: "u4",
    groupId: "g2",
    handoff: "Pickup only",
  },
  {
    id: "l12",
    title: "Patio furniture set, 4 pieces",
    price: 70,
    category: "Furniture",
    description: "Two chairs, a side table, and a loveseat. Been on my Foxridge balcony all year, still in good shape.",
    imageUrl: null,
    location: "Foxridge",
    minutesAgo: 300,
    sellerId: "u2",
    groupId: "g2",
    handoff: "Pickup only",
  },
  {
    id: "l13",
    title: "Formal wear, worn once",
    price: 40,
    category: "Clothes",
    description: "Navy suit, altered to fit, worn once for formal. Dry cleaned and ready for the next brother who needs it.",
    imageUrl: null,
    location: "Off campus",
    minutesAgo: 200,
    sellerId: "u5",
    groupId: "g5",
    handoff: "Delivery",
  },
  {
    id: "l14",
    title: "2 tickets: VT vs Duke, section 12",
    price: 55,
    category: "Tickets",
    description:
      "Basketball tickets for the Duke game, together in section 12. Can't make it -- exam conflict.",
    imageUrl: null,
    location: "Cassell Coliseum",
    minutesAgo: 30,
    sellerId: "u3",
    groupId: null,
    handoff: "Delivery",
  },
];

export function buildSeedListings(): Listing[] {
  const now = Date.now();
  return seedListingsRaw
    .map(({ minutesAgo, ...rest }) => ({
      ...rest,
      createdAt: new Date(now - minutesAgo * 60_000).toISOString(),
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ---------------------------------------------------------------------------
// Seed: conversations
// Same minutesAgo-at-seed-time pattern as listings above, so these stay
// "a few hours ago" / "9 days ago" no matter when the prototype is actually
// run, instead of drifting into the past.
//
// Five conversations, one per other person, each demonstrating something the
// messaging screens need to handle: negotiating a price, agreeing a meetup,
// a sale that's already finished, a conversation that covers two different
// listings (so the listing reference card has to switch mid-thread), and one
// old enough that its timestamps fall back to an actual calendar date
// instead of "3w ago".
// ---------------------------------------------------------------------------

type SeedMessage = {
  senderId: string;
  body: string;
  minutesAgo: number;
  listingId: string | null;
};

type SeedConversation = {
  id: string;
  otherUserId: string;
  unreadCount: number;
  messages: SeedMessage[];
};

export const seedConversationsRaw: SeedConversation[] = [
  // Negotiating a price over the Miami tickets. Ends with Maya's message, so
  // nothing is left unread here.
  {
    id: "c1",
    otherUserId: "u2",
    unreadCount: 0,
    messages: [
      { senderId: "u1", body: "Hey, are the Miami tickets still up?", minutesAgo: 130, listingId: "l1" },
      { senderId: "u2", body: "Yep! $140 for the pair, section 5 upper.", minutesAgo: 125, listingId: null },
      { senderId: "u1", body: "Would you do $120? I can grab them today.", minutesAgo: 120, listingId: null },
      { senderId: "u2", body: "I can do $125 if you pick up by tonight.", minutesAgo: 115, listingId: null },
      { senderId: "u1", body: "Deal, $125 works. Where should we meet?", minutesAgo: 110, listingId: null },
    ],
  },
  // Covers two different listings from the same seller -- the textbook
  // first, a couple of days later the Duke tickets. This is the thread that
  // proves the reference card switches when the subject does. Ends with
  // Caleb's message, so it's unread.
  {
    id: "c2",
    otherUserId: "u3",
    unreadCount: 1,
    messages: [
      { senderId: "u1", body: "Hi! Is the CS 2114 textbook + notes still available?", minutesAgo: 4300, listingId: "l3" },
      { senderId: "u3", body: "Yeah, still have it. $35, includes all my notes too.", minutesAgo: 4290, listingId: null },
      { senderId: "u1", body: "Perfect, I'll take it.", minutesAgo: 4280, listingId: null },
      { senderId: "u1", body: "Also saw you're selling Duke tickets?", minutesAgo: 70, listingId: "l14" },
      { senderId: "u3", body: "Yep -- $55 for the pair, section 12.", minutesAgo: 60, listingId: null },
      { senderId: "u3", body: "Want me to bring both to Squires tomorrow around 2?", minutesAgo: 50, listingId: null },
    ],
  },
  // Agreeing a meetup spot for the futon. Ends with Maya's message, read.
  {
    id: "c3",
    otherUserId: "u4",
    unreadCount: 0,
    messages: [
      { senderId: "u1", body: "Hey, is the futon still up for grabs?", minutesAgo: 500, listingId: "l2" },
      { senderId: "u4", body: "Yes! Still have it.", minutesAgo: 490, listingId: null },
      { senderId: "u1", body: "Awesome. Does Pheasant Run work, or could you meet closer to Owens?", minutesAgo: 480, listingId: null },
      { senderId: "u4", body: "I can bring it to the Owens loading dock around 5 if that's easier.", minutesAgo: 470, listingId: null },
      { senderId: "u1", body: "That's perfect, see you at 5.", minutesAgo: 460, listingId: null },
    ],
  },
  // A sale that already happened, over a week ago -- old enough that the
  // two message groups land on different calendar days, exercising the
  // weekday-name and full-date branches of the day divider. Ends with
  // Ryan's message, unread.
  {
    id: "c4",
    otherUserId: "u5",
    unreadCount: 1,
    messages: [
      { senderId: "u1", body: "Hi, grabbing the mini fridge -- is it still available?", minutesAgo: 14400, listingId: "l5" },
      { senderId: "u5", body: "Yep, all yours.", minutesAgo: 14390, listingId: null },
      { senderId: "u1", body: "Picked it up, thanks again -- works great!", minutesAgo: 12950, listingId: null },
      { senderId: "u5", body: "Glad to hear it! Thanks for buying.", minutesAgo: 12940, listingId: null },
    ],
  },
  // Gone quiet over a month ago -- old enough that elapsedShort falls back
  // to an actual date ("Mar 4" style) instead of counting weeks. Nothing is
  // unread; Maya answered once and it just never continued.
  {
    id: "c5",
    otherUserId: "u6",
    unreadCount: 0,
    messages: [
      { senderId: "u6", body: "Hey, is the puffer jacket still available? What size is it exactly?", minutesAgo: 50000, listingId: "l4" },
      { senderId: "u1", body: "Hi! Yes it's still up, it's a women's M.", minutesAgo: 49995, listingId: null },
    ],
  },
];

export function buildSeedConversations(): Conversation[] {
  const now = Date.now();
  return seedConversationsRaw.map((c) => ({
    id: c.id,
    otherUserId: c.otherUserId,
    unreadCount: c.unreadCount,
    pendingListingId: null,
    messages: c.messages.map((m, index) => ({
      id: `${c.id}-m${index + 1}`,
      conversationId: c.id,
      senderId: m.senderId,
      body: m.body,
      sentAt: new Date(now - m.minutesAgo * 60_000).toISOString(),
      listingId: m.listingId,
    })),
  }));
}
