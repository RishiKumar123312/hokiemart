// Smarter search for the feed. What "smarter" means here, concretely:
//
// 1. It looks at more than just the title -- the description, category, and
//    location all count too, so a word that only shows up in the description
//    still finds the listing.
// 2. It splits what someone typed into separate words and requires every
//    word to appear *somewhere*, rather than requiring the exact phrase to
//    appear in one spot. That's what lets "vt duke" find a listing titled
//    "2 tickets: VT vs Duke, section 5" even though "vt duke" is never
//    written together like that anywhere in the text.
// 3. Results are ranked: a listing whose TITLE contains the word you typed
//    is considered a better match than one where the word only shows up in
//    the description, so the most obviously-relevant listings float to the
//    top instead of appearing in whatever order they happened to be in.
//
// This is plain JavaScript string matching -- no outside search library is
// needed for this. A library like Fuse.js would only be worth adding later
// if we wanted to also tolerate typos (e.g. "dule" still finding "Duke").

import type { Listing } from "./mock-data";

// Extra points a match is worth depending on where it was found. Title
// matches count for more because the title is the first thing a person
// reads, so a match there is a stronger signal of relevance.
const TITLE_MATCH_SCORE = 3;
const OTHER_FIELD_MATCH_SCORE = 1;

/**
 * Filters and reorders a list of listings based on a free-text search.
 * Every word the person typed must show up somewhere in a listing's title,
 * description, category, or location for that listing to be included at
 * all; listings are then sorted so the closest matches (by title) come
 * first.
 *
 * An empty or blank query returns the listings unchanged, in their original
 * order.
 */
export function searchListings(listings: Listing[], query: string): Listing[] {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return listings;

  const scored: { listing: Listing; score: number }[] = [];

  for (const listing of listings) {
    const title = listing.title.toLowerCase();
    // Everything else searchable, combined into one string so we only have
    // to check it once per word instead of three separate checks.
    const otherFields = `${listing.description} ${listing.category} ${listing.location}`.toLowerCase();

    let score = 0;
    let matchesEveryWord = true;

    for (const word of words) {
      if (title.includes(word)) {
        score += TITLE_MATCH_SCORE;
      } else if (otherFields.includes(word)) {
        score += OTHER_FIELD_MATCH_SCORE;
      } else {
        // This word isn't anywhere in this listing at all -- disqualify it
        // rather than showing a listing that only half-matches what was typed.
        matchesEveryWord = false;
        break;
      }
    }

    if (matchesEveryWord) scored.push({ listing, score });
  }

  // Best matches first. Array.sort in JavaScript is stable, meaning two
  // listings with an equal score keep whatever order they were already in
  // (newest-first, since that's how the feed hands them to us) rather than
  // being shuffled arbitrarily.
  scored.sort((a, b) => b.score - a.score);
  return scored.map((entry) => entry.listing);
}
