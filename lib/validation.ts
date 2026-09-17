// Every rule about what counts as "valid input" in this app lives in this one
// file. The sign-up screens, the settings screens, and eventually the real
// backend all import from here, so a rule can never accidentally mean one
// thing on one screen and something different on another.
//
// House style for this file: each check returns the error message to show the
// user, or `null` when the input is fine. Keeping the wording here (not on the
// screens) means the same problem always gets described the same way.

/** A Virginia Tech email: some characters, then "@vt.edu". Capital letters are fine. */
const VT_EMAIL_PATTERN = /^[^@\s]+@vt\.edu$/i;

/** A username: letters, numbers and underscores only, between 3 and 20 characters. */
const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

/**
 * Checks the email someone typed when signing up. Only VT students can join,
 * so anything that isn't a @vt.edu address is turned away here.
 */
export function validateVTEmail(email: string): string | null {
  const trimmed = email.trim();
  if (trimmed === "") return "Enter your VT email";
  if (!VT_EMAIL_PATTERN.test(trimmed)) return "That needs to be a valid @vt.edu address";
  return null;
}

/**
 * Checks a username. Other students see this on listings, and it ends up in
 * web links, which is why spaces and punctuation aren't allowed.
 */
export function validateUsername(username: string): string | null {
  const trimmed = username.trim();
  if (trimmed === "") return "Enter a username";
  if (!USERNAME_PATTERN.test(trimmed)) {
    return "Username must be 3 to 20 letters, numbers or underscores";
  }
  return null;
}

/** Checks the person's real name, which is shown next to everything they list. */
export function validateFullName(name: string): string | null {
  if (name.trim() === "") return "Enter your full name";
  return null;
}

/** Checks the first box on the sign-in screen, which accepts either an email or a username. */
export function validateSignInEmailOrUsername(value: string): string | null {
  if (value.trim() === "") return "Enter your email or username";
  return null;
}

/** Checks the password box on the sign-in screen. We only check it isn't blank. */
export function validateSignInPassword(password: string): string | null {
  if (password === "") return "Enter your password";
  return null;
}

/**
 * The four things a new password has to satisfy, each reported separately so
 * the screen can show a live checklist that ticks off one rule at a time as
 * the person types.
 */
export type PasswordRuleResults = {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
};

/** The label shown next to each rule in the checklist, in the order they appear. */
export const PASSWORD_RULE_LABELS: { key: keyof PasswordRuleResults; label: string }[] = [
  { key: "minLength", label: "At least 8 characters" },
  { key: "hasUpper", label: "One uppercase letter" },
  { key: "hasLower", label: "One lowercase letter" },
  { key: "hasNumber", label: "One number" },
];

/** Works out which of the four password rules the given text currently satisfies. */
export function checkPasswordRules(password: string): PasswordRuleResults {
  return {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };
}

/** True only when a password satisfies all four rules at once. */
export function isPasswordValid(password: string): boolean {
  const results = checkPasswordRules(password);
  return results.minLength && results.hasUpper && results.hasLower && results.hasNumber;
}

/** True when the password and the "confirm password" box contain the same thing. */
export function passwordsMatch(password: string, confirmation: string): boolean {
  return password !== "" && password === confirmation;
}

/**
 * Checks the six-digit code from the verification email. In this prototype any
 * six digits are accepted -- we only insist that none of the boxes are empty,
 * because there is no real code to compare against yet.
 */
export function validateOtpCode(digits: string[]): string | null {
  const allFilled = digits.length === 6 && digits.every((d) => d !== "");
  if (!allFilled) return "Enter all six digits";
  return null;
}

/**
 * Keeps only the digits out of whatever was typed or pasted, so letters and
 * symbols can never end up in the code boxes.
 */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}
