import type { Category } from "@/lib/mock-data";
import { CATEGORIES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export type CategoryFilter = "All" | Category;

const FILTERS: CategoryFilter[] = ["All", ...CATEGORIES];

export function CategoryPills({
  active,
  onChange,
}: {
  active: CategoryFilter;
  onChange: (value: CategoryFilter) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {FILTERS.map((filter) => {
        const isActive = filter === active;
        return (
          <button
            key={filter}
            type="button"
            onClick={() => onChange(filter)}
            className={cn(
              "min-h-9 shrink-0 rounded-lg px-3.5 text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
              isActive
                ? "bg-brand font-medium text-white"
                : "border border-hairline bg-white text-foreground hover:bg-muted"
            )}
          >
            {filter === "All" ? "all" : filter.toLowerCase()}
          </button>
        );
      })}
    </div>
  );
}
