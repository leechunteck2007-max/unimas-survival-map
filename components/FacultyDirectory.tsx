"use client";

import { useMemo } from "react";
import { FacultyCard } from "@/components/FacultyCard";
import { searchCampusPlaces } from "@/data/campusPlaces";
import { faculties } from "@/data/faculties";
import { useCampusExplorer } from "@/hooks/useCampusExplorer";
import { useUserLocation } from "@/hooks/useUserLocation";
import { distanceInMetres } from "@/utils/distance";
import { getLocationErrorMessage } from "@/utils/geolocation";

export function FacultyDirectory() {
  const { activeCategory, query } = useCampusExplorer();
  const { location, requestLocation, status } = useUserLocation();
  const locationErrorMessage = getLocationErrorMessage(status);

  const facultyRows = useMemo(() => {
    const matchingIds = new Set(
      searchCampusPlaces(query)
        .filter((place) => place.category === "faculty")
        .map((place) => place.id),
    );
    const matches = faculties.filter((faculty) => matchingIds.has(faculty.id)).map((faculty) => {
      const canMeasure =
        location && faculty.latitude !== null && faculty.longitude !== null;
      return {
        faculty,
        distance: canMeasure
          ? distanceInMetres(location, {
              latitude: faculty.latitude,
              longitude: faculty.longitude,
            })
          : undefined,
      };
    });

    if (location) {
      matches.sort(
        (left, right) =>
          (left.distance ?? Number.POSITIVE_INFINITY) -
          (right.distance ?? Number.POSITIVE_INFINITY),
      );
    }

    return matches;
  }, [location, query]);

  if (activeCategory !== "all" && activeCategory !== "faculty") return null;

  return (
    <section className="mt-12 scroll-mt-6" aria-labelledby="faculties-heading">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-blue-700">Study destinations</p>
          <h2 id="faculties-heading" className="mt-1 text-2xl font-semibold tracking-tight">
            UNIMAS Faculties
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Search by full name, abbreviation, or subject. Tap a name to locate it on the map.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800 ring-1 ring-inset ring-blue-200">
            {facultyRows.length} of {faculties.length} faculties
          </span>
          <button
            type="button"
            onClick={requestLocation}
            disabled={status === "loading"}
            className="rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60"
          >
            {status === "loading"
              ? "Finding you…"
              : location
                ? "Sorted by nearest"
                : "Use my location"}
          </button>
        </div>
      </div>

      {locationErrorMessage && (
        <p role="status" className="mt-3 text-sm text-amber-800">
          {locationErrorMessage}
        </p>
      )}

      {facultyRows.length > 0 ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {facultyRows.map(({ faculty, distance }) => (
            <FacultyCard key={faculty.id} faculty={faculty} distance={distance} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-3xl bg-white px-5 py-10 text-center ring-1 ring-slate-200">
          <p className="font-semibold text-slate-950">No faculties match “{query}”.</p>
          <p className="mt-1 text-sm text-slate-600">Try a name such as Engineering or FENG.</p>
        </div>
      )}
    </section>
  );
}
