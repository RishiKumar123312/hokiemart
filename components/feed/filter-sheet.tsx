"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CATEGORIES, type Category, type Handoff } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export type CategoryFilter = "All" | Category;
// Reuses the listing's own tri-state -- "Both" here just also means "no
// restriction," since a listing offering both trivially passes any filter.
export type HandoffFilter = Handoff;

export type Filters = {
  category: CategoryFilter;
  handoff: HandoffFilter;
  minPrice: string;
  maxPrice: string;
};

export const DEFAULT_FILTERS: Filters = {
  category: "All",
  handoff: "Both",
  minPrice: "",
  maxPrice: "",
};

export function activeFilterCount(filters: Filters): number {
  let count = 0;
  if (filters.category !== "All") count += 1;
  if (filters.handoff !== "Both") count += 1;
  if (filters.minPrice.trim() !== "") count += 1;
  if (filters.maxPrice.trim() !== "") count += 1;
  return count;
}

export function PillRow({
  options,
  active,
  onChange,
}: {
  options: string[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option === active;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "min-h-9 rounded-lg px-3.5 text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
              isActive
                ? "bg-brand font-medium text-white"
                : "border border-hairline bg-white text-foreground hover:bg-muted"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

// Live-filtering bottom sheet: every control here writes straight through to
// the parent's filter state (same optimistic-update feel as the rest of the
// app), so the grid updates as you tap rather than waiting on an Apply step.
export function FilterSheet({
  open,
  onClose,
  filters,
  onChange,
}: {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const count = activeFilterCount(filters);

  return (
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-md">
        <div
          className="max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-hairline bg-white"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <div className="flex items-center justify-between border-b border-hairline px-4 py-3.5">
            <p className="font-medium text-foreground">Filters</p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-lg hover:bg-muted"
            >
              <X className="size-[17px]" />
            </button>
          </div>

          <div className="space-y-6 px-4 py-5">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Category</p>
              <PillRow
                options={["All", ...CATEGORIES]}
                active={filters.category}
                onChange={(value) => onChange({ ...filters, category: value as CategoryFilter })}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Pickup or delivery</p>
              <PillRow
                options={["Both", "Pickup only", "Delivery"]}
                active={filters.handoff}
                onChange={(value) => onChange({ ...filters, handoff: value as HandoffFilter })}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Price</p>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-stone">
                    $
                  </span>
                  <Input
                    inputMode="decimal"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
                    className="pl-7"
                  />
                </div>
                <span className="text-stone">–</span>
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-stone">
                    $
                  </span>
                  <Input
                    inputMode="decimal"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
                    className="pl-7"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-hairline px-4 py-3">
            <button
              type="button"
              onClick={() => onChange(DEFAULT_FILTERS)}
              disabled={count === 0}
              className="h-11 flex-1 rounded-lg border border-hairline text-sm font-medium text-foreground disabled:opacity-40"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-11 flex-1 rounded-lg bg-brand text-sm font-medium text-white"
            >
              Show results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
