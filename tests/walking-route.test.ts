import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearWalkingRouteCache,
  getWalkingRoute,
  isWalkingRoute,
} from "@/utils/walking-route";

const origin = { latitude: 1.46596, longitude: 110.43408 };
const destination = { latitude: 1.468314, longitude: 110.4267126 };
const validRoute = {
  distanceMeters: 1_020,
  durationSeconds: 780,
  geometry: [
    [origin.latitude, origin.longitude],
    [destination.latitude, destination.longitude],
  ] as [number, number][],
};

describe("walking route client", () => {
  beforeEach(() => {
    clearWalkingRouteCache();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("validates the complete route payload", () => {
    expect(isWalkingRoute(validRoute)).toBe(true);
    expect(isWalkingRoute({ ...validRoute, distanceMeters: -1 })).toBe(false);
    expect(isWalkingRoute({ ...validRoute, geometry: [[Number.NaN, 110]] })).toBe(false);
    expect(isWalkingRoute({ ...validRoute, geometry: [[1, 2, 3], [1, 2]] })).toBe(false);
  });

  it("caches duplicate route requests in memory", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(validRoute), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const first = await getWalkingRoute(origin, destination);
    const second = await getWalkingRoute(origin, destination);

    expect(first).toEqual(validRoute);
    expect(second).toBe(first);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("deduplicates simultaneous requests", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(validRoute), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const [first, second] = await Promise.all([
      getWalkingRoute(origin, destination),
      getWalkingRoute(origin, destination),
    ]);

    expect(first).toEqual(second);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("rejects malformed provider responses without caching them", async () => {
    const fetchMock = vi.fn().mockImplementation(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({ ...validRoute, geometry: [[Number.NaN, 110]] }),
          { status: 200 },
        ),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(getWalkingRoute(origin, destination)).rejects.toThrow(
      "Malformed walking route response",
    );
    await expect(getWalkingRoute(origin, destination)).rejects.toThrow(
      "Malformed walking route response",
    );
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
