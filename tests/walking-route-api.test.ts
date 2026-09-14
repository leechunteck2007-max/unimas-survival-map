import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/walking-route/route";

const validProviderRoute = {
  code: "Ok",
  routes: [
    {
      distance: 1_020,
      duration: 780,
      geometry: {
        type: "LineString",
        coordinates: [
          [110.43408, 1.46596],
          [110.4267126, 1.468314],
        ],
      },
    },
  ],
};

function routeRequest(overrides: Record<string, string> = {}) {
  const params = new URLSearchParams({
    originLat: "1.46596",
    originLng: "110.43408",
    destinationLat: "1.468314",
    destinationLng: "110.4267126",
    ...overrides,
  });
  return new Request(`http://localhost/api/walking-route?${params}`);
}

function providerResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("walking route API", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("rejects missing and invalid coordinates without contacting the provider", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const missing = await GET(
      new Request(
        "http://localhost/api/walking-route?originLat=1&originLng=110&destinationLat=1",
      ),
    );
    const invalid = await GET(routeRequest({ destinationLat: "91" }));

    expect(missing.status).toBe(400);
    await expect(missing.json()).resolves.toEqual({ error: "Missing coordinates" });
    expect(invalid.status).toBe(400);
    await expect(invalid.json()).resolves.toEqual({ error: "Invalid coordinates" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns a validated route with latitude-longitude geometry", async () => {
    const fetchMock = vi.fn().mockResolvedValue(providerResponse(validProviderRoute));
    vi.stubGlobal("fetch", fetchMock);

    const response = await GET(routeRequest());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      distanceMeters: 1_020,
      durationSeconds: 780,
      geometry: [
        [1.46596, 110.43408],
        [1.468314, 110.4267126],
      ],
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain(
      "routing.openstreetmap.de/routed-foot/route/v1/driving/110.43408,1.46596;110.4267126,1.468314",
    );
  });

  it.each([
    ["empty routes", { code: "Ok", routes: [] }],
    ["wrong geometry type", {
      ...validProviderRoute,
      routes: [{ ...validProviderRoute.routes[0], geometry: { type: "Point", coordinates: [[110, 1], [111, 2]] } }],
    }],
    ["short geometry", {
      ...validProviderRoute,
      routes: [{ ...validProviderRoute.routes[0], geometry: { type: "LineString", coordinates: [[110, 1]] } }],
    }],
    ["invalid coordinate tuple", {
      ...validProviderRoute,
      routes: [{ ...validProviderRoute.routes[0], geometry: { type: "LineString", coordinates: [[110, 1, 9], [111, 2]] } }],
    }],
    ["out-of-range coordinate", {
      ...validProviderRoute,
      routes: [{ ...validProviderRoute.routes[0], geometry: { type: "LineString", coordinates: [[110, 91], [111, 2]] } }],
    }],
    ["negative distance", {
      ...validProviderRoute,
      routes: [{ ...validProviderRoute.routes[0], distance: -1 }],
    }],
    ["negative duration", {
      ...validProviderRoute,
      routes: [{ ...validProviderRoute.routes[0], duration: -1 }],
    }],
    ["non-finite metric", {
      ...validProviderRoute,
      routes: [{ ...validProviderRoute.routes[0], duration: "NaN" }],
    }],
  ])("rejects %s from the routing provider", async (_label, body) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(providerResponse(body)));

    const response = await GET(routeRequest());

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: "Walking route unavailable",
    });
  });

  it("normalizes provider and network failures to the public 503 response", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(providerResponse({ error: "rate limit" }, 429))
      .mockRejectedValueOnce(new Error("network down"));
    vi.stubGlobal("fetch", fetchMock);

    const providerFailure = await GET(routeRequest());
    const networkFailure = await GET(routeRequest());

    expect(providerFailure.status).toBe(503);
    expect(networkFailure.status).toBe(503);
    await expect(providerFailure.json()).resolves.toEqual({
      error: "Walking route unavailable",
    });
    await expect(networkFailure.json()).resolves.toEqual({
      error: "Walking route unavailable",
    });
  });
});
