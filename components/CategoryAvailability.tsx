"use client";

import { AppIcon } from "@/components/icons";
import { getCampusCategory } from "@/data/campusCategories";
import { campusPlacesInCategory } from "@/data/campusPlaces";
import { useCampusExplorer } from "@/hooks/useCampusExplorer";

export function CategoryAvailability() {
  const { activeCategory } = useCampusExplorer();
  if (activeCategory === "all" || activeCategory === "bus_stop") return null;

  const category = getCampusCategory(activeCategory);
  const count = campusPlacesInCategory(activeCategory).length;
  if (count > 0) return null;

  return (
    <div
      id="category-availability"
      role="status"
      className="mt-4 flex items-start gap-3 rounded-2xl bg-amber-50 px-4 py-3 text-amber-950 ring-1 ring-inset ring-amber-200"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-amber-800">
        <AppIcon name={category.icon} className="size-5" />
      </span>
      <div>
        <p className="text-sm font-semibold">No verified {category.label.toLowerCase()} locations have been added yet.</p>
        <p className="mt-1 text-xs leading-5 text-amber-800">
          The category is ready. It will automatically join search, the map, Nearby, distance and navigation when source-backed place data is added.
        </p>
      </div>
    </div>
  );
}
