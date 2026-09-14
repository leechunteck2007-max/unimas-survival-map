"use client";

import type { WalkingRoute } from "@/types/walking-route";
import { hasValidCoordinates, type Coordinates } from "@/utils/distance";
import { isWalkingRoute } from "@/utils/walking-route-validation";

export type { WalkingRoute } from "@/types/walking-route";
export { isWalkingRoute } from "@/utils/walking-route-validation";

const memoryCache = new Map<string, WalkingRoute>();
const pendingRoutes = new Map<string, Promise<WalkingRoute>>();

function routeKey(origin: Coordinates, destination: Coordinates) {
  return [
    origin.latitude,
    origin.longitude,
    destination.latitude,
    destination.longitude,
  ]
    .map((value) => value.toFixed(5))
    .join(":");
}

function readSessionRoute(key: string) {
  try {
    const value = sessionStorage.getItem(`unimas-walk:${key}`);
    if (!value) return undefined;

    const parsed: unknown = JSON.parse(value);
    if (isWalkingRoute(parsed)) return parsed;

    sessionStorage.removeItem(`unimas-walk:${key}`);
    return undefined;
  } catch {
    return undefined;
  }
}

function saveSessionRoute(key: string, route: WalkingRoute) {
  try {
    sessionStorage.setItem(`unimas-walk:${key}`, JSON.stringify(route));
  } catch {
    // Memory caching still works if session storage is unavailable.
  }
}

export async function getWalkingRoute(
  origin: Coordinates,
  destination: Coordinates,
): Promise<WalkingRoute> {
  if (!hasValidCoordinates(origin) || !hasValidCoordinates(destination)) {
    throw new Error("Invalid route coordinates");
  }

  const key = routeKey(origin, destination);
  const cached = memoryCache.get(key) ?? readSessionRoute(key);
  if (cached) {
    memoryCache.set(key, cached);
    return cached;
  }

  const pending = pendingRoutes.get(key);
  if (pending) return pending;

  const request = (async () => {
    const params = new URLSearchParams({
      originLat: String(origin.latitude),
      originLng: String(origin.longitude),
      destinationLat: String(destination.latitude),
      destinationLng: String(destination.longitude),
    });
    const response = await fetch(`/api/walking-route?${params.toString()}`);
    if (!response.ok) throw new Error("Walking route is unavailable");

    const route: unknown = await response.json();
    if (!isWalkingRoute(route)) {
      throw new Error("Malformed walking route response");
    }

    memoryCache.set(key, route);
    saveSessionRoute(key, route);
    return route;
  })().finally(() => pendingRoutes.delete(key));

  pendingRoutes.set(key, request);
  return request;
}

export function clearWalkingRouteCache() {
  memoryCache.clear();
  pendingRoutes.clear();
}
