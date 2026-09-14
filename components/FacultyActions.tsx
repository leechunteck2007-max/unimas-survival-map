"use client";

import { MapPinIcon } from "@/components/icons";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useWalkingRoute } from "@/hooks/useWalkingRoute";
import type { Faculty } from "@/types/faculty";
import {
  formatDistance,
  formatDuration,
  formatStraightLineDistance,
} from "@/utils/distance";
import { getNavigationUrl } from "@/utils/navigation";
import { getLocationErrorMessage } from "@/utils/geolocation";

export function FacultyActions({ faculty }: { faculty: Faculty }) {
  const { location, requestLocation, status } = useUserLocation();
  const destination =
    faculty.latitude !== null && faculty.longitude !== null
      ? { latitude: faculty.latitude, longitude: faculty.longitude }
      : undefined;
  const { route, status: routeStatus, straightLineDistance } =
    useWalkingRoute(destination);
  const locationErrorMessage = getLocationErrorMessage(status);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {destination && (
        <a
          href={getNavigationUrl(destination)}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Navigate with Google Maps ↗
        </a>
      )}
      {destination && !location && (
        <button
          type="button"
          onClick={requestLocation}
          disabled={status === "loading"}
          className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
        >
          {status === "loading" ? "Finding you…" : "Show distance from me"}
        </button>
      )}
      {routeStatus === "loading" && (
        <span className="text-sm font-medium text-slate-300">
          Calculating walking route…
        </span>
      )}
      {routeStatus === "ready" && route && (
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-800">
          <MapPinIcon className="size-4" /> {formatDistance(route.distanceMeters)} walk · {formatDuration(route.durationSeconds)}
        </span>
      )}
      {routeStatus === "fallback" && straightLineDistance !== undefined && (
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-900">
          <MapPinIcon className="size-4" /> {formatStraightLineDistance(straightLineDistance)}
        </span>
      )}
      {locationErrorMessage && (
        <span role="status" className="text-sm text-amber-800">
          {locationErrorMessage}
        </span>
      )}
    </div>
  );
}
