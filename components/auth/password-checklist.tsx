"use client";

import { Check, Circle } from "lucide-react";
import { checkPasswordRules, PASSWORD_RULE_LABELS } from "@/lib/validation";
import { cn } from "@/lib/utils";

// The live list of password requirements that sits under the password box and
// updates on every keystroke, so people can see themselves getting closer to a
// valid password instead of being told "no" only after pressing the button.
//
// Used both when creating an account and when changing the password later, so
// the requirements can never disagree between those two screens.
export function PasswordChecklist({
  password,
  // True once the person has started typing. Before that, unmet rules are shown
  // in plain grey -- nobody should be shown red errors for a box they have not
  // touched yet.
  touched,
  className,
}: {
  password: string;
  touched: boolean;
  className?: string;
}) {
  const results = checkPasswordRules(password);

  return (
    <ul className={cn("space-y-1", className)}>
      {PASSWORD_RULE_LABELS.map(({ key, label }) => {
        const satisfied = results[key];
        return (
          <li key={key} className="flex items-center gap-1.5 text-[11px]">
            {satisfied ? (
              // A filled circle with a tick, once this rule is met.
              <span className="flex size-3.5 shrink-0 items-center justify-center rounded-full bg-success">
                <Check className="size-2.5 text-white" strokeWidth={3} />
              </span>
            ) : (
              <Circle
                className={cn("size-3.5 shrink-0", touched ? "text-danger" : "text-muted")}
                strokeWidth={1.5}
              />
            )}
            <span
              className={cn(
                satisfied ? "text-success" : touched ? "text-danger" : "text-muted"
              )}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
