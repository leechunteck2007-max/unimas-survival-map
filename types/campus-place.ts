import type { campusCategories } from "@/data/campusCategories";

export type CampusPlaceCategory = (typeof campusCategories)[number]["id"];

export interface BaseCampusPlace {
  id: string;
  name: string;
  category: CampusPlaceCategory;
  latitude: number | null;
  longitude: number | null;
}

export interface CampusPlace extends BaseCampusPlace {
  key: string;
  shortName?: string;
  description?: string;
  aliases: string[];
  tags: string[];
  address?: string;
  openingHours?: string;
  facilities?: string[];
  verified: boolean;
  lastUpdated?: string;
  sourceUrl?: string;
  detailUrl?: string;
}

export type CampusPlaceInput = Omit<CampusPlace, "key">;
