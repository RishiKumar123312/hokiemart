"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Camera, Check } from "lucide-react";
import { BackHeader } from "@/components/nav/app-header";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Group } from "@/lib/mock-data";

const POLICIES: { value: Group["joinPolicy"]; label: string; hint: string }[] = [
  {
    value: "open",
    label: "open to @vt.edu",
    hint: "any verified student joins instantly",
  },
  {
    value: "approval",
    label: "approval required",
    hint: "you approve each request",
  },
  {
    value: "invite",
    label: "invite code",
    hint: "members join with a code you share",
  },
];

export default function CreateGroupPage() {
  const router = useRouter();
  const { createGroup } = useStore();
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [policy, setPolicy] = useState<Group["joinPolicy"]>("open");
  const [nameError, setNameError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setNameError("give your group a name");
      return;
    }
    const group = createGroup({
      name: name.trim(),
      description: purpose.trim(),
      joinPolicy: policy,
      iconKey: "greek",
    });
    router.push(`/groups/${group.id}/invite`);
  }

  return (
    <div>
      <BackHeader title="create a group" backHref="/groups" />

      <form onSubmit={handleSubmit} className="space-y-5 px-4 py-5">
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-20 items-center justify-center rounded-xl border border-dashed border-hairline text-stone">
            <Camera className="size-6" />
          </div>
          <p className="text-xs text-stone">group icon (optional)</p>
        </div>

        <Field label="Group name" htmlFor="group-name" error={nameError}>
          <Input
            id="group-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError("");
            }}
            placeholder="e.g. ACM at VT"
            aria-invalid={nameError ? true : undefined}
          />
        </Field>

        <Field label="One-line purpose" htmlFor="group-purpose">
          <Input
            id="group-purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="what's this group for?"
          />
        </Field>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Who can join</p>
          <div className="space-y-2">
            {POLICIES.map((option) => {
              const active = policy === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPolicy(option.value)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    active ? "border-brand bg-brand-tint" : "border-hairline"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                      active ? "border-brand bg-brand text-white" : "border-hairline"
                    )}
                  >
                    {active && <Check className="size-3.5" />}
                  </span>
                  <span>
                    <span
                      className={cn(
                        "block text-sm",
                        active ? "font-medium text-brand-ink" : "text-foreground"
                      )}
                    >
                      {option.label}
                    </span>
                    <span className="block text-xs text-stone">{option.hint}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="h-12 w-full rounded-lg bg-brand text-sm font-medium text-white"
        >
          create group
        </button>
      </form>
    </div>
  );
}
