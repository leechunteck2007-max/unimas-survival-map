import type { BaseCampusPlace } from "@/types/campus-place";

export interface Faculty extends BaseCampusPlace {
  category: "faculty";
  slug: string;
  shortName: string;
  description: string;
  address: string | null;
  openingHours: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  imageUrl: string | null;
  facilities: string[];
  tags: string[];
  verified: boolean;
  coordinateVerified: boolean;
  sourceUrl: string;
  coordinateSourceUrl: string | null;
  lastUpdated: string;
}
