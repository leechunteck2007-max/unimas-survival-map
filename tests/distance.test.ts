import { describe, expect, it } from "vitest";
import {
  distanceInMetres,
  formatDistance,
  formatDuration,
  formatStraightLineDistance,
  hasValidCoordinates,
} from "@/utils/distance";

describe("distance helpers", () => {
  it("calculates a symmetric Haversine distance", () => {
    const a = { latitude: 1.46596, longitude: 110.43408 };
    const b = { latitude: 1.468314, longitude: 110.4267126 };

    expect(distanceInMetres(a, a)).toBe(0);
    expect(distanceInMetres(a, b)).toBeCloseTo(distanceInMetres(b, a), 8);
    expect(distanceInMetres(a, b)).toBeGreaterThan(800);
    expect(distanceInMetres(a, b)).toBeLessThan(900);
  });

  it("labels straight-line distance without implying a walking route", () => {
    expect(formatDistance(350)).toBe("350 m");
    expect(formatDistance(1_420)).toBe("1.4 km");
    expect(formatStraightLineDistance(350)).toBe("~350 m straight-line");
  });

  it("formats walking durations and rejects invalid coordinates", () => {
    expect(formatDuration(1)).toBe("1 min");
    expect(formatDuration(3_900)).toBe("1 hr 5 min");
    expect(hasValidCoordinates({ latitude: 91, longitude: 0 })).toBe(false);
    expect(hasValidCoordinates({ latitude: 1, longitude: Number.NaN })).toBe(false);
  });
});
