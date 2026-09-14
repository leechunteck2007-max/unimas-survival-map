"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { SearchIcon } from "@/components/icons";
import { getCampusCategory } from "@/data/campusCategories";
import { searchCampusPlaces } from "@/data/campusPlaces";
import { useCampusExplorer } from "@/hooks/useCampusExplorer";
import { useUserLocation } from "@/hooks/useUserLocation";
import type { CampusPlace } from "@/types/campus-place";
import {
  distanceInMetres,
  formatStraightLineDistance,
} from "@/utils/distance";

export function SearchBar() {
  const { query, selectPlace, setQuery } = useCampusExplorer();
  const { location } = useUserLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const results = useMemo(() => searchCampusPlaces(query).slice(0, 12), [query]);
  const isSearching = query.trim().length > 0;
  const showResults = isSearching && isOpen;
  const activeResult = activeIndex >= 0 ? results[activeIndex] : undefined;

  function resultId(place: CampusPlace) {
    return `campus-search-result-${place.key.replace(":", "-")}`;
  }

  function updateQuery(value: string) {
    setQuery(value);
    setIsOpen(value.trim().length > 0);
    setActiveIndex(-1);
  }

  function showPlace(place: CampusPlace) {
    selectPlace(place);
    setIsOpen(false);
    setActiveIndex(-1);
    document.getElementById("map-heading")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (!isSearching || results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) => (index + 1) % results.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) =>
        index <= 0 ? results.length - 1 : index - 1,
      );
      return;
    }

    if (event.key === "Enter" && showResults && activeResult) {
      event.preventDefault();
      showPlace(activeResult);
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl"
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget)) {
          setIsOpen(false);
          setActiveIndex(-1);
        }
      }}
    >
      <div className="group flex h-14 items-center gap-3 rounded-2xl bg-white px-4 shadow-[0_8px_30px_rgba(15,23,42,0.07)] ring-1 ring-slate-200 transition focus-within:ring-2 focus-within:ring-emerald-600 sm:h-16 sm:px-5">
        <label htmlFor="campus-location-search" className="sr-only">
          Search campus locations
        </label>
        <SearchIcon className="size-5 shrink-0 text-slate-400 transition group-focus-within:text-emerald-700" />
        <input
          id="campus-location-search"
          type="search"
          name="location-search"
          value={query}
          onChange={(event) => updateQuery(event.target.value)}
          onFocus={() => setIsOpen(isSearching)}
          onClick={() => setIsOpen(isSearching)}
          onKeyDown={handleKeyDown}
          placeholder="Search campus places, e.g. FENG, Cempaka, food or ATM"
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showResults}
          aria-controls="campus-search-results"
          aria-activedescendant={activeResult ? resultId(activeResult) : undefined}
          className="min-w-0 flex-1 bg-transparent text-base text-slate-950 outline-none placeholder:text-slate-400"
        />
        {isSearching ? (
          <button
            type="button"
            onClick={() => updateQuery("")}
            className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            aria-label="Clear campus search"
          >
            Clear
          </button>
        ) : (
          <kbd className="hidden rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-400 sm:block">
            Search
          </kbd>
        )}
      </div>

      {showResults && (
        <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-[700] overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
          {results.length > 0 ? (
            <ul
              id="campus-search-results"
              role="listbox"
              aria-label="Campus search results"
              className="divide-y divide-slate-100"
            >
              {results.map((place, index) => (
                <li key={place.key} role="none">
                  <button
                    id={resultId(place)}
                    type="button"
                    role="option"
                    aria-selected={activeIndex === index}
                    onClick={() => showPlace(place)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-emerald-50 ${
                      activeIndex === index ? "bg-emerald-50" : ""
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-semibold text-slate-950">
                        {place.name}
                      </span>
                      <span className="mt-0.5 block text-xs font-medium text-emerald-700">
                        {place.shortName ? `${place.shortName} · ` : ""}
                        {getCampusCategory(place.category).label}
                      </span>
                    </span>
                    <span className="shrink-0 text-right text-xs font-semibold text-slate-500">
                      {location && place.latitude !== null && place.longitude !== null && (
                        <span className="mb-0.5 block font-medium text-slate-500">
                          {formatStraightLineDistance(
                            distanceInMetres(location, {
                              latitude: place.latitude,
                              longitude: place.longitude,
                            }),
                          )}
                        </span>
                      )}
                      <span className="block">Show on map</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-4 text-sm text-slate-600">No matching campus places found.</p>
          )}
        </div>
      )}
    </div>
  );
}
