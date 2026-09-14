import type { WalkingRoute } from "@/types/walking-route";
import { hasValidCoordinates } from "@/utils/distance";

export function isWalkingRoute(value: unknown): value is WalkingRoute {
  if (!value || typeof value !== "object") return false;

  const route = value as Partial<WalkingRoute>;
  return (
    typeof route.distanceMeters === "number" &&
    Number.isFinite(route.distanceMeters) &&
    route.distanceMeters >= 0 &&
    typeof route.durationSeconds === "number" &&
    Number.isFinite(route.durationSeconds) &&
    route.durationSeconds >= 0 &&
    Array.isArray(route.geometry) &&
    route.geometry.length >= 2 &&
    route.geometry.every(
      (point) =>
        Array.isArray(point) &&
        point.length === 2 &&
        hasValidCoordinates({ latitude: point[0], longitude: point[1] }),
    )
  );
}
