"use client";

import { useMemo } from "react";
import { CollegePhoto } from "@/components/CollegePhoto";
import {
  getCampusPlace,
  hasValidPlaceCoordinates,
  searchCampusPlaces,
} from "@/data/campusPlaces";
import { residentialColleges } from "@/data/colleges";
import { BuildingIcon, MapPinIcon, TagIcon } from "@/components/icons";
import { useCampusExplorer } from "@/hooks/useCampusExplorer";
import { useUserLocation } from "@/hooks/useUserLocation";
import { distanceInMetres, formatStraightLineDistance } from "@/utils/distance";
import { getNavigationUrl } from "@/utils/navigation";
import { getLocationErrorMessage } from "@/utils/geolocation";

export function CollegeDirectory() {
  const { activeCategory, query, selectPlace } = useCampusExplorer();
  const { location, requestLocation, status } = useUserLocation();
  const locationErrorMessage = getLocationErrorMessage(status);

  function showCollegeOnMap(id: string) {
    const place = getCampusPlace("college", id);
    if (place) selectPlace(place);
    document.getElementById("map-heading")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  const collegeRows = useMemo(() => {
    const matchingIds = new Set(
      searchCampusPlaces(query)
        .filter((place) => place.category === "college")
        .map((place) => place.id),
    );
    const rows = residentialColleges
      .filter((college) => matchingIds.has(college.id))
      .map((college) => {
        const place = getCampusPlace("college", college.id);
        const destination =
          place && hasValidPlaceCoordinates(place)
            ? { latitude: place.latitude, longitude: place.longitude }
            : undefined;

        return {
          college,
          destination,
          distance: location && destination
            ? distanceInMetres(location, destination)
            : undefined,
        };
      });

    if (location) {
      rows.sort(
        (left, right) =>
          (left.distance ?? Number.POSITIVE_INFINITY) -
          (right.distance ?? Number.POSITIVE_INFINITY),
      );
    }

    return rows;
  }, [location, query]);

  if (activeCategory !== "all" && activeCategory !== "college") return null;

  return (
    <section className="mt-10 scroll-mt-6" aria-labelledby="colleges-heading">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-slate-500">Stay on campus</p>
          <h2 id="colleges-heading" className="mt-1 text-2xl font-semibold tracking-tight">
            UNIMAS Kolej Kediaman
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Tap a college name to locate it on the map. Only college information is included here.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-200">
            {collegeRows.length} of {residentialColleges.length} colleges
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

      {collegeRows.length > 0 ? (
      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {collegeRows.map(({ college, destination, distance }) => (
          <article key={college.id} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
            <CollegePhoto photo={college.photo} />

            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-emerald-700">
                    <BuildingIcon className="size-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">Residential college</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => showCollegeOnMap(college.id)}
                    className="mt-2 text-left text-lg font-semibold tracking-tight text-slate-950 underline decoration-emerald-200 decoration-2 underline-offset-4 transition hover:text-emerald-700 hover:decoration-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
                  >
                    {college.name}
                  </button>
                </div>
                {college.capacity && (
                  <span className="shrink-0 rounded-xl bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                    {college.capacity.toLocaleString()} capacity*
                  </span>
                )}
              </div>

              <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                {college.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-600" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              {distance !== undefined && (
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                  <MapPinIcon className="size-4" /> {formatStraightLineDistance(distance)}
                </p>
              )}

              <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900 ring-1 ring-inset ring-amber-100">
                {college.researchNote}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <TagIcon className="size-4" /> Your impression tags: coming next
                </span>
                <span className="flex items-center gap-3">
                  {destination && (
                    <a
                      href={getNavigationUrl(destination)}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-200 hover:bg-emerald-100"
                    >
                      Navigate ↗
                    </a>
                  )}
                  <a
                    href={college.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                  >
                    Research source ↗
                  </a>
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
      ) : (
        <div className="mt-5 rounded-3xl bg-white px-5 py-10 text-center ring-1 ring-slate-200">
          <p className="font-semibold text-slate-950">No Kolej match “{query}”.</p>
          <p className="mt-1 text-sm text-slate-600">Try a name such as Cempaka or Bunga Raya.</p>
        </div>
      )}

      <p className="mt-4 text-xs leading-5 text-slate-500">
        * Capacity figures are from UNIMAS institutional material and may change. Community impressions are deliberately not collected or displayed yet.
      </p>
    </section>
  );
}
