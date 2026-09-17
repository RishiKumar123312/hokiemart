import { Search } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search listings",
}: {
  value: string;
  onChange: (value: string) => void;
  // Lets a screen searching a narrower set of listings say so (e.g. a
  // group feed uses "Search this group") without changing the default
  // wording anywhere that doesn't pass one in.
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-hairline bg-muted/50 pl-9 pr-3.5 text-base outline-none placeholder:text-stone focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
    </div>
  );
}
