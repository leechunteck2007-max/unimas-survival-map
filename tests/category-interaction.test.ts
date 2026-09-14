import { describe, expect, it } from "vitest";
import {
  getCategoryClickIntent,
  getCategoryOverviewTargetId,
} from "@/utils/category-interaction";

describe("category option interaction", () => {
  it("previews a category that is not active yet", () => {
    expect(getCategoryClickIntent("all", "faculty")).toBe("preview");
    expect(getCategoryClickIntent("faculty", "college")).toBe("preview");
  });

  it("opens the overview when the active category is selected again", () => {
    expect(getCategoryClickIntent("faculty", "faculty")).toBe("overview");
    expect(getCategoryClickIntent("college", "college")).toBe("overview");
    expect(getCategoryClickIntent("food", "food")).toBe("overview");
  });

  it("keeps All as a direct map preview instead of inventing an overview", () => {
    expect(getCategoryClickIntent("all", "all")).toBe("preview");
    expect(getCategoryOverviewTargetId("all")).toBe("map-heading");
  });

  it("uses existing category browse targets", () => {
    expect(getCategoryOverviewTargetId("faculty")).toBe("faculties-heading");
    expect(getCategoryOverviewTargetId("college")).toBe("colleges-heading");
    expect(getCategoryOverviewTargetId("food")).toBe("category-availability");
  });
});
