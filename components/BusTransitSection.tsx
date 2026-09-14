"use client";

import { useEffect, useMemo, useState } from "react";
import { AppIcon, SearchIcon } from "@/components/icons";
import { busRoutes, busSchedules, busStops, getBusStop, mappableBusStops, routesServingStop } from "@/data/busTransit";
import { hasValidPlaceCoordinates, searchCampusPlaces } from "@/data/campusPlaces";
import { useCampusExplorer } from "@/hooks/useCampusExplorer";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useWalkingRoute } from "@/hooks/useWalkingRoute";
import type { CampusPlace } from "@/types/campus-place";
import { distanceInMetres, formatDistance, formatDuration, formatStraightLineDistance } from "@/utils/distance";
import { getNavigationUrl } from "@/utils/navigation";
import { kuchingServiceType, nextReferenceDeparture, planJourney } from "@/utils/transit";

function WalkingSummary({ place }: { place?: CampusPlace }) {
  const destination = place?.latitude !== null && place?.longitude !== null && place
    ? { latitude: place.latitude, longitude: place.longitude }
    : undefined;
  const { route, status, straightLineDistance } = useWalkingRoute(destination);

  if (!place) return <p className="mt-2 text-sm text-slate-600">Select a destination to compare walking with Bus.</p>;
  if (!destination) return <p className="mt-2 text-sm text-slate-600">This destination does not have verified coordinates.</p>;
  return <div className="mt-3">
    <p className="text-lg font-semibold text-slate-950">
      {status === "loading" && "Calculating walking route…"}
      {status === "ready" && route && `${formatDistance(route.distanceMeters)} · ${formatDuration(route.durationSeconds)}`}
      {status === "fallback" && straightLineDistance !== undefined && `${formatStraightLineDistance(straightLineDistance)} · route unavailable`}
      {status === "idle" && "Enable location for distance and ETA"}
    </p>
    <a href={getNavigationUrl(destination)} target="_blank" rel="noreferrer"
      className="mt-3 inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
      Walk with Google Maps
    </a>
  </div>;
}

function NearbyBusStop() {
  const { location, requestLocation, status: locationStatus } = useUserLocation();
  const nearest = useMemo(() => {
    if (!location) return mappableBusStops[0];
    return [...mappableBusStops].sort(
      (a, b) => distanceInMetres(location, a) - distanceInMetres(location, b),
    )[0];
  }, [location]);
  const destination = nearest ? { latitude: nearest.latitude, longitude: nearest.longitude } : undefined;
  const { route, status, straightLineDistance } = useWalkingRoute(destination);

  if (!location) return <button type="button" onClick={requestLocation} disabled={locationStatus === "loading"}
    className="mt-3 min-h-11 rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
    {locationStatus === "loading" ? "Finding your location…" : "Enable location to find nearby stops"}
  </button>;
  if (!nearest) return <p className="mt-3 text-sm text-slate-600">No stops have verified coordinates yet.</p>;

  return <div className="mt-3 rounded-2xl bg-white p-4 ring-1 ring-sky-100">
    <div className="flex items-start justify-between gap-3">
      <div><p className="font-semibold text-slate-950">{nearest.name}</p><p className="mt-1 text-xs text-sky-700">Nearest mapped stop · not automatically the best boarding stop</p></div>
      <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800">Mapped</span>
    </div>
    <p className="mt-3 text-sm font-semibold text-slate-700">
      {status === "loading" && "Calculating walk…"}
      {status === "ready" && route && `${formatDistance(route.distanceMeters)} walk · ${formatDuration(route.durationSeconds)}`}
      {status === "fallback" && straightLineDistance !== undefined && `${formatStraightLineDistance(straightLineDistance)} · walking route unavailable`}
    </p>
    <a href={getNavigationUrl(destination!)} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-semibold text-sky-800 underline">Walk to this stop</a>
  </div>;
}

export function BusTransitSection() {
  const [destinationQuery, setDestinationQuery] = useState("");
  const [destination, setDestination] = useState<CampusPlace>();
  const [now, setNow] = useState<Date>();
  const { selectedBusStopId, selectBusStop } = useCampusExplorer();
  const { location, requestLocation } = useUserLocation();
  const destinationResults = useMemo(() => destinationQuery.trim() ? searchCampusPlaces(destinationQuery).slice(0, 6) : [], [destinationQuery]);
  const plan = destination && hasValidPlaceCoordinates(destination)
    ? planJourney(location, destination, busStops, busRoutes, busSchedules)
    : undefined;
  const selectedStop = selectedBusStopId ? getBusStop(selectedBusStopId) : undefined;

  useEffect(() => {
    const initialTimer = window.setTimeout(() => setNow(new Date()), 0);
    const refreshTimer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(refreshTimer);
    };
  }, []);
  const serviceType = now ? kuchingServiceType(now) : "weekday";
  const localTime = now ? new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kuching", hour: "2-digit", minute: "2-digit", hour12: false }).format(now) : "00:00";

  return <section className="mt-12 scroll-mt-6" aria-labelledby="bus-heading">
    <div className="rounded-3xl bg-sky-950 px-5 py-6 text-white shadow-sm sm:px-7 sm:py-8">
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sky-400/20 text-sky-100"><AppIcon name="bus" className="size-7" /></span>
        <div><p className="text-sm font-semibold text-sky-200">WALK OR BUS?</p><h2 id="bus-heading" className="mt-1 text-2xl font-semibold">Plan a campus journey</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-sky-100">Choose any verified campus place. Bus guidance stays cautious while stop locations are incomplete.</p></div>
      </div>

      <div className="relative mt-6 max-w-2xl">
        <label htmlFor="bus-destination" className="mb-2 block text-sm font-semibold">Where do you want to go?</label>
        <div className="flex min-h-12 items-center gap-3 rounded-2xl bg-white px-4 text-slate-950"><SearchIcon className="size-5 text-slate-400" />
          <input id="bus-destination" value={destinationQuery} onChange={(event) => { setDestinationQuery(event.target.value); setDestination(undefined); }}
            placeholder="Search Fakulti, Kolej or any campus place" className="min-w-0 flex-1 bg-transparent py-3 outline-none" autoComplete="off" />
        </div>
        {destinationResults.length > 0 && !destination && <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl bg-white text-slate-950 shadow-xl ring-1 ring-slate-200">
          {destinationResults.map((place) => <button key={place.key} type="button" onClick={() => { setDestination(place); setDestinationQuery(place.name); }}
            className="flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left last:border-0 hover:bg-sky-50">
            <span className="font-semibold">{place.name}</span><span className="text-xs text-slate-500">{place.category}</span>
          </button>)}
        </div>}
      </div>

      {destination && <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl bg-white p-5 text-slate-950"><p className="text-sm font-bold text-emerald-700">🚶 WALK</p><h3 className="mt-1 font-semibold">Direct to {destination.name}</h3><WalkingSummary place={destination} /></article>
        <article className="rounded-2xl bg-white p-5 text-slate-950"><p className="text-sm font-bold text-sky-700">🚌 BUS</p><h3 className="mt-1 font-semibold">Best boarding route</h3>
          {!location ? <><p className="mt-2 text-sm text-slate-600">Enable location to find the best boarding stop.</p><button type="button" onClick={requestLocation} className="mt-3 min-h-11 rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white">Use my location</button></>
          : plan?.status === "available" ? <p className="mt-2 text-sm text-slate-600">A direct candidate is available. Walking routes are verified only for finalist segments.</p>
          : <div className="mt-2 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-950"><strong>Partial transit data.</strong><br />No suitable campus bus route can be recommended with verified boarding and drop-off coordinates yet. Walk remains available.</div>}
        </article>
      </div>}
    </div>

    <div className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <article className="rounded-3xl bg-sky-50 p-5 ring-1 ring-sky-100 sm:p-6"><h3 className="text-lg font-semibold text-slate-950">Nearby Bus Stops</h3><p className="mt-1 text-sm leading-6 text-slate-600">Only stops with verified coordinates can be ranked and routed.</p><NearbyBusStop /></article>
      <article className="rounded-3xl bg-white p-5 ring-1 ring-slate-200 sm:p-6"><h3 className="text-lg font-semibold text-slate-950">Routes / reference schedule</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">Historical schedule reference — not confirmed as the complete current 2026 service. Times are route departures, not stop arrivals.</p>
        <div className="mt-4 space-y-3">{busRoutes.map((route) => {
          const schedule = busSchedules.find((item) => item.routeId === route.id && item.serviceType === serviceType);
          const next = schedule && now ? nextReferenceDeparture(schedule.departureTimes, localTime) : undefined;
          return <details key={route.id} className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200"><summary className="cursor-pointer font-semibold text-slate-950">{route.name}</summary>
            <p className="mt-3 text-sm leading-6 text-slate-700">{route.stops.map((item) => getBusStop(item.stopId)?.name).join(" → ")} → {getBusStop(route.stops[0].stopId)?.name}</p>
            <p className="mt-3 text-sm font-semibold text-sky-800">{next ? `Next reference route departure: ${next}` : "No later reference departure today"}</p>
            <p className="mt-1 text-xs text-slate-500">Asia/Kuching · {serviceType === "weekday" ? "weekday" : "weekend/public-holiday"} reference</p>
            <p className="mt-3 text-xs leading-5 text-slate-600">{schedule?.departureTimes.join(" · ") ?? "Schedule unavailable"}</p>
            <a href={route.source.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs font-semibold text-sky-800 underline">View historical source PDF</a>
          </details>;
        })}</div>
      </article>
    </div>

    <article className="mt-5 rounded-3xl bg-white p-5 ring-1 ring-slate-200 sm:p-6"><div className="flex flex-wrap items-end justify-between gap-3"><div><h3 className="text-lg font-semibold text-slate-950">Schedule-listed stops</h3><p className="mt-1 text-sm text-slate-600">11 total · 1 mapped · 10 coordinates pending</p></div><span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900">Partial data</span></div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{busStops.map((stop) => <button key={stop.id} type="button" onClick={() => selectBusStop(stop.id)}
        className={`rounded-2xl p-4 text-left ring-1 ring-inset ${selectedStop?.id === stop.id ? "bg-sky-50 ring-sky-400" : "bg-stone-50 ring-slate-200"}`}>
        <span className="block font-semibold text-slate-950">{stop.name}</span><span className="mt-1 block text-xs text-slate-600">{stop.latitude === null ? "Coordinate pending" : "Mapped bus stop"} · {routesServingStop(stop.id).length} route{routesServingStop(stop.id).length === 1 ? "" : "s"}</span>
      </button>)}</div>
      {selectedStop && <div className="mt-4 rounded-2xl bg-sky-50 p-4 text-sm leading-6 text-slate-700"><strong>{selectedStop.name}</strong><br />Routes: {routesServingStop(selectedStop.id).map((route) => route.name).join(", ") || "None"}<br />Verification: {selectedStop.verificationStatus.replaceAll("_", " ")}{selectedStop.lastUpdated ? ` · Updated ${selectedStop.lastUpdated}` : ""}</div>}
    </article>
  </section>;
}
