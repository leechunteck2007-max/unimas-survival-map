"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { getCampusCategory } from "@/data/campusCategories";
import {
  getCampusPlace,
  hasValidPlaceCoordinates,
  mappableCampusPlaces,
  searchCampusPlaces,
} from "@/data/campusPlaces";
import { useCampusExplorer, type CampusCategory } from "@/hooks/useCampusExplorer";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useWalkingRoute } from "@/hooks/useWalkingRoute";
import type {
  CampusPlace,
  CampusPlaceCategory,
} from "@/types/campus-place";
import {
  formatDistance,
  formatDuration,
  formatStraightLineDistance,
} from "@/utils/distance";
import { getLocationErrorMessage } from "@/utils/geolocation";

const unimasArea: [number, number] = [1.46596, 110.43408];

type CampusMapProps = {
  facultyOnly?: boolean;
  initialFacultyId?: string;
};

function MapSelectionController({
  place,
  selectionVersion,
}: {
  place?: CampusPlace;
  selectionVersion: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (place && hasValidPlaceCoordinates(place)) {
      map.flyTo([place.latitude, place.longitude], 17, { duration: 0.65 });
    }
  }, [map, place, selectionVersion]);

  return null;
}

function MapLocationController({
  latitude,
  longitude,
}: {
  latitude?: number;
  longitude?: number;
}) {
  const map = useMap();
  const hasCentredOnUser = useRef(false);

  useEffect(() => {
    if (
      !hasCentredOnUser.current &&
      typeof latitude === "number" &&
      typeof longitude === "number"
    ) {
      hasCentredOnUser.current = true;
      map.flyTo([latitude, longitude], 16, { duration: 0.65 });
    }
  }, [latitude, longitude, map]);

  return null;
}

function categoryMatches(placeCategory: CampusPlaceCategory, uiCategory: CampusCategory) {
  return uiCategory === "all" || placeCategory === uiCategory;
}

export default function CampusMap({ facultyOnly = false, initialFacultyId }: CampusMapProps) {
  const {
    activeCategory: sharedCategory,
    query,
    selectedPlace: sharedSelectedPlace,
    selectionVersion,
    selectPlace,
  } = useCampusExplorer();
  const { location, requestLocation, status: locationStatus } = useUserLocation();
  const initialPlace = useMemo(
    () => initialFacultyId ? getCampusPlace("faculty", initialFacultyId) : undefined,
    [initialFacultyId],
  );
  const selectedPlace = facultyOnly ? initialPlace : sharedSelectedPlace;
  const activeCategory: CampusCategory = facultyOnly ? "faculty" : sharedCategory;

  const visiblePlaces = useMemo(() => {
    const matchingKeys = new Set(searchCampusPlaces(query).map((place) => place.key));
    return mappableCampusPlaces.filter(
      (place) =>
        matchingKeys.has(place.key) &&
        (facultyOnly
          ? place.category === "faculty"
          : categoryMatches(place.category, activeCategory)),
    );
  }, [activeCategory, facultyOnly, query]);

  const destination = selectedPlace && hasValidPlaceCoordinates(selectedPlace)
    ? { latitude: selectedPlace.latitude, longitude: selectedPlace.longitude }
    : undefined;
  const { route, status: routeStatus, straightLineDistance } =
    useWalkingRoute(destination);
  const locationErrorMessage = getLocationErrorMessage(locationStatus);

  const visibleCategoryLabels = Array.from(
    new Set(visiblePlaces.map((place) => getCampusCategory(place.category).shortLabel)),
  );
  let mapStatus = visiblePlaces.length > 0
    ? `${visiblePlaces.length} mapped places${visibleCategoryLabels.length ? ` · ${visibleCategoryLabels.join(", ")}` : ""}.`
    : "No verified mapped places in this category yet.";
  if (selectedPlace) mapStatus = "Selected location.";
  if (routeStatus === "loading") mapStatus = "Calculating walking route…";
  if (routeStatus === "ready" && route) {
    mapStatus = `${formatDistance(route.distanceMeters)} walk · ${formatDuration(route.durationSeconds)}`;
  }
  if (routeStatus === "fallback" && straightLineDistance !== undefined) {
    mapStatus = `${formatStraightLineDistance(straightLineDistance)} · walking route unavailable`;
  }

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-sm ring-1 ring-slate-200">
      <MapContainer
        center={destination ? [destination.latitude, destination.longitude] : unimasArea}
        zoom={initialFacultyId ? 17 : 15}
        minZoom={13}
        maxZoom={19}
        scrollWheelZoom
        className="h-80 w-full sm:h-96"
        aria-label="Interactive OpenStreetMap view centred near UNIMAS"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <MapSelectionController place={selectedPlace} selectionVersion={selectionVersion} />
        <MapLocationController
          latitude={location?.latitude}
          longitude={location?.longitude}
        />

        {visiblePlaces.map((place) => {
          const isSelected = place.key === selectedPlace?.key;
          const category = getCampusCategory(place.category);

          return (
            <CircleMarker
              key={place.key}
              center={[place.latitude, place.longitude]}
              radius={isSelected ? 10 : place.category === "faculty" ? 7 : 6}
              eventHandlers={{ click: () => selectPlace(place) }}
              pathOptions={{
                color: isSelected ? "#5b21b6" : category.marker.color,
                fillColor: isSelected ? "#8b5cf6" : category.marker.fillColor,
                fillOpacity: 0.88,
                weight: isSelected ? 3 : 2,
              }}
            >
              <Tooltip permanent={isSelected} direction="top" offset={[0, -8]}>
                {place.shortName ?? place.name}
              </Tooltip>
            </CircleMarker>
          );
        })}

        {location && (
          <CircleMarker
            center={[location.latitude, location.longitude]}
            radius={6}
            pathOptions={{ color: "#0f172a", fillColor: "#ffffff", fillOpacity: 1, weight: 3 }}
          >
            <Tooltip direction="top">You are here</Tooltip>
          </CircleMarker>
        )}

        {route && (
          <Polyline
            positions={route.geometry}
            pathOptions={{ color: "#7c3aed", opacity: 0.85, weight: 5 }}
          />
        )}

        {destination && selectedPlace && (
          <Popup
            key={`${selectedPlace.key}:${selectionVersion}`}
            position={[destination.latitude, destination.longitude]}
          >
            <strong>{selectedPlace.name}</strong>
            <br />
            <span>
              {getCampusCategory(selectedPlace.category).label}
            </span>
            {route && (
              <>
                <br />
                <span>
                  {formatDistance(route.distanceMeters)} walk · {formatDuration(route.durationSeconds)}
                </span>
              </>
            )}
            <br />
            {route && (
              <>
                <a
                  href="https://routing.openstreetmap.de/about.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  Route estimate: OSRM / OpenStreetMap
                </a>
                <br />
              </>
            )}
            {selectedPlace.detailUrl ? (
              <a href={selectedPlace.detailUrl}>View details</a>
            ) : selectedPlace.sourceUrl ? (
              <a href={selectedPlace.sourceUrl} target="_blank" rel="noreferrer">
                Information source
              </a>
            ) : null}
          </Popup>
        )}
      </MapContainer>

      <button
        type="button"
        onClick={requestLocation}
        disabled={locationStatus === "loading"}
        className="absolute left-4 top-4 z-[500] rounded-xl bg-white/95 px-3 py-2 text-xs font-semibold text-slate-800 shadow-lg ring-1 ring-slate-200 backdrop-blur transition hover:bg-white disabled:cursor-wait disabled:opacity-70"
      >
        {locationStatus === "loading"
          ? "Finding you…"
          : location
            ? "Refresh location"
            : "Use my location"}
      </button>

      {locationErrorMessage && (
        <p
          role="status"
          className="absolute left-4 top-16 z-[500] max-w-[calc(100%-2rem)] rounded-xl bg-amber-50/95 px-3 py-2 text-xs font-medium text-amber-900 shadow ring-1 ring-amber-200"
        >
          {locationErrorMessage}
        </p>
      )}

      <div className="pointer-events-none absolute inset-x-4 bottom-4 z-[500] rounded-2xl bg-white/95 p-3 shadow-lg shadow-slate-900/10 backdrop-blur sm:inset-x-auto sm:right-4 sm:max-w-xs">
        <p className="text-sm font-semibold text-slate-950">
          {selectedPlace?.name ?? "UNIMAS area map"}
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-600">{mapStatus}</p>
      </div>
    </div>
  );
}
