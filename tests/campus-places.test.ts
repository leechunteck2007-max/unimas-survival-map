import { describe, expect, it } from "vitest";
import {
  allCampusPlaces,
  getCampusPlace,
  hasValidPlaceCoordinates,
  normalizeCampusPlace,
  searchCampusPlaces,
} from "@/data/campusPlaces";
import { campusCategories } from "@/data/campusCategories";

describe("campus place normalization and search", () => {
  it("keeps stable, unique category:id keys", () => {
    const keys = allCampusPlaces.map((place) => place.key);

    expect(new Set(keys).size).toBe(keys.length);
    const categoryIds = campusCategories.map((category) => category.id).join("|");
    expect(keys.every((key) => new RegExp(`^(${categoryIds}):[^:]+$`).test(key))).toBe(true);
  });

  it("finds faculties by abbreviation and subject", () => {
    expect(searchCampusPlaces("FENG").map((place) => place.id)).toContain("feng");
    expect(searchCampusPlaces("software").map((place) => place.id)).toContain("fcsit");
  });

  it("finds Kolej by short name and hostel alias regardless of case", () => {
    expect(searchCampusPlaces("cEmPaKa").map((place) => place.id)).toEqual([
      "cempaka",
    ]);
    expect(searchCampusPlaces("hostel").filter((place) => place.category === "college"))
      .toHaveLength(10);
  });

  it("returns the normalized place for a category and id", () => {
    expect(getCampusPlace("faculty", "feng")?.key).toBe("faculty:feng");
    expect(getCampusPlace("college", "cempaka")?.key).toBe("college:cempaka");
  });

  it("defines all supported categories once with unique canonical ids", () => {
    expect(campusCategories).toHaveLength(14);
    expect(new Set(campusCategories.map((category) => category.id)).size).toBe(14);
    expect(campusCategories.map((category) => category.id)).toEqual(
      expect.arrayContaining(["food", "bus_stop", "study", "printing", "atm", "toilet"]),
    );
  });

  it("keeps unsupported categories empty instead of inventing campus data", () => {
    expect(allCampusPlaces.filter((place) => place.category === "food")).toEqual([]);
    expect(allCampusPlaces).toHaveLength(20);
  });

  it("puts a future place through shared normalization, search and mapping eligibility", () => {
    const cafe = normalizeCampusPlace({
      id: "future-cafe",
      name: "Future Campus Cafe",
      category: "food",
      latitude: 1.46,
      longitude: 110.43,
      aliases: [],
      tags: [],
      verified: true,
    });

    expect(cafe.key).toBe("food:future-cafe");
    expect(searchCampusPlaces("cafe", [cafe])).toEqual([cafe]);
    expect(hasValidPlaceCoordinates(cafe)).toBe(true);
  });
});
