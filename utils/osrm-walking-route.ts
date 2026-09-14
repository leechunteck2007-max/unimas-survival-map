import type { WalkingRoute } from "@/types/walking-route";
import { isWalkingRoute } from "@/utils/walking-route-validation";

type OsrmRoute = {
  distance?: unknown;
  duration?: unknown;
  geometry?: {
    coordinates?: unknown;
    type?: unknown;
  };
};

type OsrmResponse = {
  code?: unknown;
  routes?: unknown;
};

export function parseOsrmWalkingRoute(value: unknown): WalkingRoute {
  if (!value || typeof value !== "object") {
    throw new Error("Malformed routing provider response");
  }

  const response = value as OsrmResponse;
  if (response.code !== "Ok" || !Array.isArray(response.routes) || response.routes.length === 0) {
    throw new Error("No walking route found");
  }

  const providerRoute = response.routes[0] as OsrmRoute | undefined;
  const providerCoordinates = providerRoute?.geometry?.coordinates;
  if (
    providerRoute?.geometry?.type !== "LineString" ||
    !Array.isArray(providerCoordinates)
  ) {
    throw new Error("Malformed walking route geometry");
  }

  const route: WalkingRoute = {
    distanceMeters: providerRoute.distance as number,
    durationSeconds: providerRoute.duration as number,
    geometry: providerCoordinates.map((point) => {
      if (!Array.isArray(point) || point.length !== 2) {
        return point as [number, number];
      }

      const [longitude, latitude] = point;
      return [latitude, longitude] as [number, number];
    }),
  };

  if (!isWalkingRoute(route)) {
    throw new Error("Malformed walking route data");
  }

  return route;
}
