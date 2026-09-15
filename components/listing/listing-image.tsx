import { Sofa, Ticket, BookOpen, Shirt, Package, type LucideIcon } from "lucide-react";
import type { Category } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const CATEGORY_ICON: Record<Category, LucideIcon> = {
  Furniture: Sofa,
  Tickets: Ticket,
  Textbooks: BookOpen,
  Clothes: Shirt,
  Other: Package,
};

// Solid neutral placeholder block with a centered category icon, standing
// in for a real photo. Fixed 4:3 so grid rows stay aligned; a future photo
// slots in with the same aspect-[4/3] object-cover wrapper.
export function ListingImage({
  category,
  className,
  iconClassName,
}: {
  category: Category;
  className?: string;
  iconClassName?: string;
}) {
  const Icon = CATEGORY_ICON[category];
  return (
    <div
      className={cn(
        "flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-muted",
        className
      )}
    >
      <Icon className={cn("size-8 text-stone", iconClassName)} strokeWidth={1.5} />
    </div>
  );
}
