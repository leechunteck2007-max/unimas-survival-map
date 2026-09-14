import type { CampusPlaceCategory } from "@/types/campus-place";

export type SelectableCampusCategory = "all" | CampusPlaceCategory;
export type CategoryClickIntent = "preview" | "overview";

export function getCategoryClickIntent(
  activeCategory: SelectableCampusCategory,
  clickedCategory: SelectableCampusCategory,
): CategoryClickIntent {
  if (clickedCategory === "all" || clickedCategory !== activeCategory) {
    return "preview";
  }

  return "overview";
}

export function getCategoryOverviewTargetId(
  category: SelectableCampusCategory,
) {
  if (category === "faculty") return "faculties-heading";
  if (category === "college") return "colleges-heading";
  if (category === "all") return "map-heading";
  return "category-availability";
}
