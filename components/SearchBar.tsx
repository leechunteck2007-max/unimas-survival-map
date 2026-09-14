"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { SearchIcon } from "@/components/icons";
import { getCampusCategory } from "@/data/campusCategories";
import { searchCampusEntities, type CampusSearchResult } from "@/data/campusSearch";
import { useCampusExplorer } from "@/hooks/useCampusExplorer";
import { useUserLocation } from "@/hooks/useUserLocation";
import { distanceInMetres, formatStraightLineDistance, hasValidCoordinates } from "@/utils/distance";

export function SearchBar() {
  const { query, selectBusStop, selectPlace, setQuery } = useCampusExplorer();
  const { location } = useUserLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const results = useMemo(() => searchCampusEntities(query).slice(0, 12), [query]);
  const isSearching = query.trim().length > 0;
  const showResults = isSearching && isOpen;
  const activeResult = activeIndex >= 0 ? results[activeIndex] : undefined;

  function updateQuery(value: string) {
    setQuery(value);
    setIsOpen(value.trim().length > 0);
    setActiveIndex(-1);
  }

  function showResult(result: CampusSearchResult) {
    setIsOpen(false);
    setActiveIndex(-1);
    if (result.kind === "place") {
      selectPlace(result.place);
      document.getElementById("map-heading")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    selectBusStop(result.stop.id);
    const targetId = hasValidCoordinates(result.stop) ? "map-heading" : "bus-heading";
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (!isSearching || results.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault(); setIsOpen(true);
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault(); setIsOpen(true);
      setActiveIndex((index) => index <= 0 ? results.length - 1 : index - 1);
    } else if (event.key === "Enter" && showResults && activeResult) {
      event.preventDefault(); showResult(activeResult);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl" onBlur={(event) => {
      if (!containerRef.current?.contains(event.relatedTarget)) { setIsOpen(false); setActiveIndex(-1); }
    }}>
      <div className="group flex h-14 items-center gap-3 rounded-2xl bg-white px-4 shadow-[0_8px_30px_rgba(15,23,42,0.07)] ring-1 ring-slate-200 transition focus-within:ring-2 focus-within:ring-emerald-600 sm:h-16 sm:px-5">
        <label htmlFor="campus-location-search" className="sr-only">Search campus places and bus stops</label>
        <SearchIcon className="size-5 shrink-0 text-slate-400 group-focus-within:text-emerald-700" />
        <input id="campus-location-search" type="search" value={query}
          onChange={(event) => updateQuery(event.target.value)} onFocus={() => setIsOpen(isSearching)}
          onClick={() => setIsOpen(isSearching)} onKeyDown={handleKeyDown}
          placeholder="Search places or bus stops, e.g. FENG or Dahlia" autoComplete="off"
          role="combobox" aria-autocomplete="list" aria-expanded={showResults}
          aria-controls="campus-search-results"
          aria-activedescendant={activeResult ? `campus-search-${activeResult.key.replaceAll(":", "-")}` : undefined}
          className="min-w-0 flex-1 bg-transparent text-base text-slate-950 outline-none placeholder:text-slate-400" />
        {isSearching ? <button type="button" onClick={() => updateQuery("")} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100">Clear</button>
          : <kbd className="hidden rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-400 sm:block">Search</kbd>}
      </div>

      {showResults && <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-[700] overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
        {results.length ? <ul id="campus-search-results" role="listbox" className="divide-y divide-slate-100">
          {results.map((result, index) => {
            const item = result.kind === "place" ? result.place : result.stop;
            const coordinates = hasValidCoordinates(item) ? item : undefined;
            const label = result.kind === "place" ? getCampusCategory(result.place.category).label : "Bus Stop";
            return <li key={result.key} role="none"><button
              id={`campus-search-${result.key.replaceAll(":", "-")}`} type="button" role="option"
              aria-selected={activeIndex === index} onClick={() => showResult(result)} onMouseEnter={() => setActiveIndex(index)}
              className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left hover:bg-emerald-50 ${activeIndex === index ? "bg-emerald-50" : ""}`}>
              <span><span className="block text-sm font-semibold text-slate-950">{item.name}</span>
                <span className={`mt-0.5 block text-xs font-semibold ${result.kind === "bus_stop" ? "text-sky-700" : "text-emerald-700"}`}>{label}</span></span>
              <span className="shrink-0 text-right text-xs font-semibold text-slate-500">
                {location && coordinates && <span className="block font-medium">{formatStraightLineDistance(distanceInMetres(location, coordinates))}</span>}
                <span className="block">{coordinates ? "Show on map" : "View transit details"}</span>
              </span>
            </button></li>;
          })}
        </ul> : <p className="px-4 py-4 text-sm text-slate-600">No matching campus places or bus stops found.</p>}
      </div>}
    </div>
  );
}
