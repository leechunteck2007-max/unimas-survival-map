"use client";

import { useMemo, useState } from "react";
import { MapPinIcon } from "@/components/icons";
import { campusCategories, getCampusCategory } from "@/data/campusCategories";
import { mappableCampusPlaces } from "@/data/campusPlaces";
import { useCampusExplorer, type CampusCategory } from "@/hooks/useCampusExplorer";
import { useUserLocation } from "@/hooks/useUserLocation";
import { distanceInMetres, formatStraightLineDistance } from "@/utils/distance";
import { getLocationErrorMessage } from "@/utils/geolocation";
import { getNavigationUrl } from "@/utils/navigation";

export function NearbyPlaces() {
  const { selectPlace } = useCampusExplorer();
  const { location, requestLocation, status } = useUserLocation();
  const [nearbyCategory, setNearbyCategory] = useState<CampusCategory>("all");
  const nearby = useMemo(() => {
    if (!location) return [];

    return mappableCampusPlaces
      .filter(
        (place) => nearbyCategory === "all" || place.category === nearbyCategory,
      )
      .map((place) => ({
        place,
        distance: distanceInMetres(location, place),
      }))
      .sort((left, right) => left.distance - right.distance)
      .slice(0, 5);
  }, [location, nearbyCategory]);

  if (!location) {
    const errorMessage = getLocationErrorMessage(status);

    return (
      <section className="mt-8" aria-labelledby="nearby-heading">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <p className="text-sm font-medium text-emerald-700">Optional location</p>
            <h2 id="nearby-heading" className="mt-1 text-xl font-semibold tracking-tight">
              Find what is near you
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {errorMessage ??
                "Enable location to rank verified campus places by straight-line distance. Your precise location stays in this browser tab."}
            </p>
          </div>
          <button
            type="button"
            onClick={requestLocation}
            disabled={status === "loading" || status === "unsupported"}
            className="mt-4 w-full shrink-0 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300 sm:mt-0 sm:w-auto"
          >
            {status === "loading" ? "Finding your location…" : "Enable location"}
          </button>
        </div>
      </section>
    );
  }

  function showOnMap(place: (typeof mappableCampusPlaces)[number]) {
    selectPlace(place, { clearSearch: true });
    document.getElementById("map-heading")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <section className="mt-8" aria-labelledby="nearby-heading">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-emerald-700">Based on your current location</p>
          <h2 id="nearby-heading" className="mt-1 text-xl font-semibold tracking-tight">
            Near You
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Straight-line distance is shown here. Select a place for its walking route and ETA.
          </p>
        </div>
        <label className="text-sm font-semibold text-slate-700">
          Nearest category
          <select
            value={nearbyCategory}
            onChange={(event) => setNearbyCategory(event.target.value as CampusCategory)}
            className="mt-1 block w-full rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:outline-2 focus:outline-offset-2 focus:outline-emerald-600 sm:w-52"
          >
            <option value="all">All verified places</option>
            {campusCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {nearby.length > 0 ? (
      <div className="-mx-4 mt-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-5">
        {nearby.map(({ place, distance }) => (
          <article
            key={place.key}
            className="flex min-w-64 flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:min-w-0"
          >
            <span className="text-xs font-bold uppercase tracking-wide text-emerald-700">
              {getCampusCategory(place.category).label}
            </span>
            <button
              type="button"
              onClick={() => showOnMap(place)}
              className="mt-2 text-left font-semibold leading-5 text-slate-950 transition hover:text-emerald-700"
            >
              {place.name}
            </button>
            <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
              <MapPinIcon className="size-3.5" /> {formatStraightLineDistance(distance)}
            </p>
            <div className="mt-auto flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => showOnMap(place)}
                className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white"
              >
                Show on map
              </button>
              <a
                href={getNavigationUrl(place)}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-200"
              >
                Navigate ↗
              </a>
            </div>
          </article>
        ))}
      </div>
      ) : (
        <div className="mt-4 rounded-2xl bg-white px-5 py-8 text-center ring-1 ring-slate-200">
          <p className="font-semibold text-slate-950">
            No verified {nearbyCategory === "all" ? "campus" : getCampusCategory(nearbyCategory).label.toLowerCase()} locations have been added yet.
          </p>
          <p className="mt-1 text-sm text-slate-600">Choose another category to see nearby places.</p>
        </div>
      )}
    </section>
  );
}
