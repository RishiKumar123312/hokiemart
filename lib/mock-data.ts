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
