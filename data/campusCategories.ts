import type { IconName } from "@/components/icons";

type CampusCategoryDefinition = {
  id: string;
  label: string;
  shortLabel: string;
  icon: IconName;
  searchTerms: readonly string[];
  marker: { color: string; fillColor: string };
  primary: boolean;
};

export const campusCategories = [
  { id: "faculty", label: "Fakulti", shortLabel: "Fakulti", icon: "faculty", searchTerms: ["faculty", "faculties", "fakulti"], marker: { color: "#1d4ed8", fillColor: "#3b82f6" }, primary: true },
  { id: "college", label: "Kolej", shortLabel: "Kolej", icon: "college", searchTerms: ["college", "residential college", "hostel", "kolej"], marker: { color: "#047857", fillColor: "#10b981" }, primary: true },
  { id: "food", label: "Food", shortLabel: "Food", icon: "food", searchTerms: ["food", "cafe", "cafeteria", "restaurant", "makan"], marker: { color: "#b45309", fillColor: "#f59e0b" }, primary: true },
  { id: "bus_stop", label: "Bus Stop", shortLabel: "Bus", icon: "bus", searchTerms: ["bus", "bus stop", "shuttle", "transport"], marker: { color: "#0369a1", fillColor: "#38bdf8" }, primary: true },
  { id: "study", label: "Study Place", shortLabel: "Study", icon: "book", searchTerms: ["study", "library", "reading", "learning"], marker: { color: "#6d28d9", fillColor: "#8b5cf6" }, primary: true },
  { id: "printing", label: "Printing", shortLabel: "Printing", icon: "printer", searchTerms: ["printing", "printer", "photocopy", "copy"], marker: { color: "#475569", fillColor: "#94a3b8" }, primary: false },
  { id: "store", label: "Convenience Store", shortLabel: "Store", icon: "store", searchTerms: ["store", "shop", "convenience", "mart"], marker: { color: "#047857", fillColor: "#34d399" }, primary: false },
  { id: "atm", label: "ATM / Banking", shortLabel: "ATM", icon: "card", searchTerms: ["atm", "bank", "banking", "cash"], marker: { color: "#334155", fillColor: "#64748b" }, primary: false },
  { id: "toilet", label: "Toilet", shortLabel: "Toilet", icon: "toilet", searchTerms: ["toilet", "restroom", "washroom", "tandas"], marker: { color: "#0f766e", fillColor: "#2dd4bf" }, primary: true },
  { id: "parking", label: "Parking", shortLabel: "Parking", icon: "parking", searchTerms: ["parking", "car park", "motorcycle"], marker: { color: "#334155", fillColor: "#64748b" }, primary: false },
  { id: "health", label: "Health", shortLabel: "Health", icon: "health", searchTerms: ["health", "clinic", "medical", "pharmacy"], marker: { color: "#be123c", fillColor: "#fb7185" }, primary: false },
  { id: "sports", label: "Sports", shortLabel: "Sports", icon: "sports", searchTerms: ["sports", "gym", "stadium", "court", "recreation"], marker: { color: "#047857", fillColor: "#22c55e" }, primary: false },
  { id: "prayer", label: "Prayer / Religious", shortLabel: "Prayer", icon: "surau", searchTerms: ["prayer", "religious", "surau", "mosque", "masjid"], marker: { color: "#6d28d9", fillColor: "#a78bfa" }, primary: false },
  { id: "administration", label: "Administration", shortLabel: "Admin", icon: "services", searchTerms: ["administration", "admin", "office", "student services"], marker: { color: "#475569", fillColor: "#94a3b8" }, primary: false },
] as const satisfies readonly CampusCategoryDefinition[];

export type CampusCategoryId = (typeof campusCategories)[number]["id"];

const campusCategoryById = new Map(campusCategories.map((category) => [category.id, category]));

export function getCampusCategory(categoryId: CampusCategoryId) {
  return campusCategoryById.get(categoryId)!;
}
