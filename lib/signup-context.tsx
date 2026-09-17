"use client";

// Sign-up is spread across several screens (email, code, profile, password),
// but it is really one form. This file holds the answers in memory as the
// person moves from screen to screen, so arriving at step 3 doesn't forget
// what they typed on step 1.
//
// On purpose, nothing here is saved to the browser's storage or sent
// anywhere. If the page is reloaded partway through, the answers are lost and
// sign-up starts over from step 1 -- that's an accepted limitation for this
// prototype, not a bug.

import { createContext, useContext, useState, type ReactNode } from "react";

export type SignupDraft = {
  email: string;
  fullName: string;
  username: string;
  phone: string;
  phoneHidden: boolean; // Defaults to true: a new student's number is private until they choose otherwise.
  emailHidden: boolean; // Defaults to true: same idea, for their VT email address.
};

// What a brand-new, untouched sign-up looks like before anyone has typed
// anything.
const EMPTY_DRAFT: SignupDraft = {
  email: "",
  fullName: "",
  username: "",
  phone: "",
  phoneHidden: true,
  emailHidden: true,
};

type SignupContextValue = {
  draft: SignupDraft;
  // Merges a few fields into the draft without disturbing the rest -- for
  // example, changing just the phone number leaves the name and username
  // exactly as they were.
  updateDraft: (patch: Partial<SignupDraft>) => void;
  // Wipes the draft back to empty. Used once sign-up finishes, so a second
  // sign-up later doesn't start with leftover answers from the first one.
  resetDraft: () => void;
};

const SignupContext = createContext<SignupContextValue | null>(null);

export function SignupProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<SignupDraft>(EMPTY_DRAFT);

  function updateDraft(patch: Partial<SignupDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  function resetDraft() {
    setDraft(EMPTY_DRAFT);
  }

  return (
    <SignupContext.Provider value={{ draft, updateDraft, resetDraft }}>
      {children}
    </SignupContext.Provider>
  );
}

// Lets any sign-up screen read and update the shared draft. Throws a clear
// error if used outside the sign-up flow, rather than silently doing nothing.
export function useSignupDraft(): SignupContextValue {
  const ctx = useContext(SignupContext);
  if (!ctx) throw new Error("useSignupDraft must be used within a SignupProvider");
  return ctx;
}
