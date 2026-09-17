// How long ago something happened, written the short way messaging uses.
//
// This is deliberately separate from `timeAgo` in lib/format.ts, which writes
// the longer "2h ago" style used on listing cards. Messaging needs a more
// compact form that sits inside a line of metadata ("MAYA · 2H"), and it needs
// two cases the marketplace never shows: "now" for something that just
// happened, and a calendar date once something is old enough that counting
// weeks stops being useful.
//
// Both the inbox rows and the labels above each message call this same
// function, so the two can never drift into saying different things about the
// same moment in time.

/** Milliseconds in each unit, so the maths below reads in plain units. */
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

/**
 * Turns a timestamp into a short "how long ago" label:
 *   under a minute  -> "now"
 *   under an hour   -> "12m"
 *   under a day     -> "2h"
 *   under a week    -> "3d"
 *   under a month   -> "2w"
 *   older than that -> "Mar 4"
 */
export function elapsedShort(iso: string): string {
  const then = new Date(iso).getTime();
  const elapsed = Date.now() - then;

  if (elapsed < MINUTE) return "now";
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m`;
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}h`;
  if (elapsed < WEEK) return `${Math.floor(elapsed / DAY)}d`;

  // Roughly a month. Past this point "5w" stops meaning much to anyone, so we
  // switch to an actual date instead.
  if (elapsed < 4 * WEEK) return `${Math.floor(elapsed / WEEK)}w`;

  return new Date(then).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * The heading above a group of messages sent on the same day: "Today",
 * "Yesterday", the weekday name for anything in the last week, and a full
 * date for anything older.
 */
export function dayLabel(iso: string): string {
  const date = new Date(iso);
  const today = new Date();

  // Compare calendar days, not raw elapsed time -- something sent at 11pm
  // last night is "Yesterday" even though it was only a couple of hours ago.
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const daysApart = Math.round((startOfDay(today) - startOfDay(date)) / DAY);

  if (daysApart === 0) return "Today";
  if (daysApart === 1) return "Yesterday";
  if (daysApart < 7) return date.toLocaleDateString("en-US", { weekday: "long" });
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Groups messages into calendar days so the thread can draw a divider between
 * them. Returns them in the order given, as a list of days, each holding the
 * messages sent on that day.
 */
export function groupByDay<T extends { sentAt: string }>(items: T[]): { label: string; items: T[] }[] {
  const days: { label: string; items: T[] }[] = [];

  for (const item of items) {
    const label = dayLabel(item.sentAt);
    const currentDay = days[days.length - 1];
    // Keep adding to the day we're already building until the label changes.
    if (currentDay && currentDay.label === label) {
      currentDay.items.push(item);
    } else {
      days.push({ label, items: [item] });
    }
  }

  return days;
}

/**
 * Spells a small number as a word, so the inbox can say "Two unread messages"
 * rather than "2 unread messages". Anything above ten stays as digits, because
 * "Seventeen unread messages" reads worse than "17".
 */
const NUMBER_WORDS = [
  "No",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
];

export function spellCount(count: number): string {
  return NUMBER_WORDS[count] ?? String(count);
}

/**
 * Spells out a count followed by the right form of a word -- singular for
 * exactly one, plural otherwise. Shared by every "X unread ___" sentence in
 * the app so the singular/plural rule only has to be gotten right once.
 */
function countSentence(count: number, singular: string, plural: string): string {
  return `${spellCount(count)} ${count === 1 ? singular : plural}`;
}

/**
 * The full sentence shown under the inbox heading, correctly singular,
 * plural, or zero: "No unread messages" / "One unread message" /
 * "Two unread messages".
 */
export function unreadSentence(count: number): string {
  return countSentence(count, "unread message", "unread messages");
}

/**
 * Same idea as unreadSentence, for the notifications screen: "No unread
 * notifications" / "One unread notification" / "Two unread notifications".
 */
export function unreadNotificationSentence(count: number): string {
  return countSentence(count, "unread notification", "unread notifications");
}
