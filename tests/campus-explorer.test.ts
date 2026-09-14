import { describe, expect, it } from "vitest";
import { getCampusPlace } from "@/data/campusPlaces";
import {
  campusExplorerReducer,
  initialCampusExplorerState,
} from "@/hooks/useCampusExplorer";

describe("campus explorer selection state", () => {
  it("selects a place and switches to its category in one action", () => {
    const place = getCampusPlace("college", "cempaka");
    expect(place).toBeDefined();

    const state = campusExplorerReducer(initialCampusExplorerState, {
      type: "place-selected",
      place: place!,
    });

    expect(state.selectedPlace?.key).toBe("college:cempaka");
    expect(state.activeCategory).toBe("college");
    expect(state.selectionVersion).toBe(1);
  });

  it("increments selectionVersion when the same place is selected again", () => {
    const place = getCampusPlace("faculty", "feng");
    expect(place).toBeDefined();

    const first = campusExplorerReducer(initialCampusExplorerState, {
      type: "place-selected",
      place: place!,
    });
    const second = campusExplorerReducer(first, {
      type: "place-selected",
      place: place!,
    });

    expect(second.selectedPlace).toBe(place);
    expect(second.selectionVersion).toBe(2);
  });

  it("only clears search when the caller requests it", () => {
    const place = getCampusPlace("faculty", "fcsit");
    expect(place).toBeDefined();
    const queried = { ...initialCampusExplorerState, query: "software" };

    expect(campusExplorerReducer(queried, {
      type: "place-selected",
      place: place!,
    }).query).toBe("software");
    expect(campusExplorerReducer(queried, {
      type: "place-selected",
      place: place!,
      clearSearch: true,
    }).query).toBe("");
  });

  it("supports empty categories and clears an unrelated selected place", () => {
    const place = getCampusPlace("faculty", "feng")!;
    const selected = campusExplorerReducer(initialCampusExplorerState, {
      type: "place-selected",
      place,
    });
    const filtered = campusExplorerReducer(selected, {
      type: "category-selected",
      category: "food",
    });

    expect(filtered.activeCategory).toBe("food");
    expect(filtered.selectedPlace).toBeUndefined();
  });
});
