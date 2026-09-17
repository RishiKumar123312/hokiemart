"use client";

import { useRef } from "react";
import { digitsOnly } from "@/lib/validation";
import { cn } from "@/lib/utils";

// Six little boxes for typing a one-time verification code, one digit each.
//
// Behavior people expect from a code entry like this, all handled here so no
// other screen has to reimplement it:
//   - typing a digit jumps the cursor to the next empty box
//   - pressing backspace on an empty box jumps back to the previous one
//   - anything that isn't a digit is thrown away
//   - pasting a whole 6-digit code fills every box at once
export function OtpInput({
  value,
  onChange,
  error,
}: {
  // The six digits typed so far. Empty string in a slot means that box is blank.
  value: string[];
  onChange: (next: string[]) => void;
  error?: string;
}) {
  // Keeps a handle to each of the six boxes so we can move focus between them
  // in code (React doesn't do this automatically -- we have to ask for it).
  const boxRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(index: number, raw: string) {
    const digits = digitsOnly(raw);

    // A paste can land many digits into one box at once. If that happens,
    // spread them across this box and the ones after it.
    if (digits.length > 1) {
      const next = [...value];
      for (let i = 0; i < digits.length && index + i < 6; i++) {
        next[index + i] = digits[i];
      }
      onChange(next);
      const lastFilled = Math.min(index + digits.length, 5);
      boxRefs.current[lastFilled]?.focus();
      return;
    }

    const next = [...value];
    next[index] = digits;
    onChange(next);

    // Move ahead to the next box automatically once this one has a digit.
    if (digits !== "" && index < 5) {
      boxRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    // Backspace on an already-empty box should hop back to the previous box,
    // the way it does when editing a normal line of text.
    if (e.key === "Backspace" && value[index] === "" && index > 0) {
      boxRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(index: number, e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = digitsOnly(e.clipboardData.getData("text"));
    if (pasted.length === 0) return;
    e.preventDefault();
    handleChange(index, pasted);
  }

  return (
    <div>
      <div className="flex justify-between gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              boxRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6} // allows a full paste to land in one box before we redistribute it
            value={value[index] ?? ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={(e) => handlePaste(index, e)}
            aria-label={`Digit ${index + 1} of 6`}
            className={cn(
              "h-[46px] w-[38px] rounded-lg border text-center text-lg outline-none transition-colors",
              error ? "border-danger" : "border-input-border focus:border-brand"
            )}
          />
        ))}
      </div>
      {error && <p className="mt-2 text-[11px] text-danger">{error}</p>}
    </div>
  );
}
