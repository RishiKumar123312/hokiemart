"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { AppHeader } from "@/components/nav/app-header";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, type Category, type Handoff } from "@/lib/mock-data";
import { PillRow } from "@/components/feed/filter-sheet";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const EVERYONE = "everyone";

export function SellForm({ initialGroupId }: { initialGroupId: string | null }) {
  const router = useRouter();
  const { getMyGroups, addListing } = useStore();
  const myGroups = getMyGroups();

  const validInitialGroup =
    initialGroupId && myGroups.some((g) => g.id === initialGroupId) ? initialGroupId : EVERYONE;

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<Category>("Other");
  const [postTo, setPostTo] = useState<string>(validInitialGroup);
  const [description, setDescription] = useState("");
  const [meetupSpot, setMeetupSpot] = useState("");
  const [handoff, setHandoff] = useState<Handoff>("Both");

  const [titleError, setTitleError] = useState("");
  const [priceError, setPriceError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    let hasError = false;
    if (!title.trim()) {
      setTitleError("Give your listing a title");
      hasError = true;
    }
    const parsedPrice = Number(price);
    if (!price.trim() || Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setPriceError("Enter a valid price");
      hasError = true;
    }
    if (hasError) return;

    const groupId = postTo === EVERYONE ? null : postTo;

    addListing({
      title: title.trim(),
      price: parsedPrice,
      category,
      description: description.trim() || "No description added.",
      location: meetupSpot.trim(),
      groupId,
      handoff,
    });

    router.push(groupId ? `/groups/${groupId}` : "/");
  }

  return (
    <div className="pb-10">
      <AppHeader title="New listing" />

      <form onSubmit={handleSubmit} className="space-y-5 px-4 py-5">
        <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-hairline text-stone">
          <Camera className="size-6" />
          <span className="text-xs">Add photos</span>
        </div>

        <Field label="Title" htmlFor="listing-title" error={titleError}>
          <Input
            id="listing-title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (titleError) setTitleError("");
            }}
            placeholder="E.g. IKEA futon, grey"
            aria-invalid={titleError ? true : undefined}
          />
        </Field>

        <Field label="Price" htmlFor="listing-price" error={priceError}>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-stone">
              $
            </span>
            <Input
              id="listing-price"
              inputMode="decimal"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                if (priceError) setPriceError("");
              }}
              placeholder="0"
              className="pl-7"
              aria-invalid={priceError ? true : undefined}
            />
          </div>
        </Field>

        <Field label="Category" htmlFor="listing-category">
          <Select value={category} onValueChange={(v) => v && setCategory(v as Category)}>
            <SelectTrigger id="listing-category" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Pickup or delivery">
          <PillRow
            options={["Both", "Pickup only", "Delivery"]}
            active={handoff}
            onChange={(value) => setHandoff(value as Handoff)}
          />
        </Field>

        <Field label="Post to" htmlFor="listing-post-to">
          <Select value={postTo} onValueChange={(v) => v && setPostTo(v)}>
            <SelectTrigger id="listing-post-to" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={EVERYONE}>Everyone at VT</SelectItem>
              {myGroups.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.name} (members only)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <details className="group space-y-4 [&_summary::-webkit-details-marker]:hidden">
          <summary className="cursor-pointer text-sm font-medium text-brand outline-none">
            Add description and meetup spot
          </summary>

          <div className="space-y-4 pt-4">
            <Field label="Description" htmlFor="listing-description">
              <textarea
                id="listing-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Condition, details, anything a buyer should know"
                rows={4}
                className={cn(
                  "w-full resize-none rounded-lg border border-input bg-transparent px-3.5 py-2.5 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                )}
              />
            </Field>

            <Field label="Meetup spot" htmlFor="listing-location">
              <Input
                id="listing-location"
                value={meetupSpot}
                onChange={(e) => setMeetupSpot(e.target.value)}
                placeholder="E.g. Squires, Foxridge"
              />
            </Field>
          </div>
        </details>

        <button
          type="submit"
          className="h-12 w-full rounded-lg bg-brand text-sm font-medium text-white"
        >
          Post listing
        </button>
      </form>
    </div>
  );
}
