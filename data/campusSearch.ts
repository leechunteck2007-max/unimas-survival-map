import { busStops } from "@/data/busTransit";
import { getCampusCategory } from "@/data/campusCategories";
import { allCampusPlaces } from "@/data/campusPlaces";
import type { BusStop } from "@/types/transit";
import type { CampusPlace } from "@/types/campus-place";

export type CampusSearchResult =
  | { kind: "place"; key: string; place: CampusPlace }
  | { kind: "bus_stop"; key: string; stop: BusStop };

export function searchCampusEntities(query: string): CampusSearchResult[] {
  const term = query.trim().toLocaleLowerCase();
  if (!term) return [];

  const places: CampusSearchResult[] = allCampusPlaces
    .filter((place) => [
      place.name,
      place.shortName ?? "",
      getCampusCategory(place.category).label,
      ...getCampusCategory(place.category).searchTerms,
      ...place.aliases,
      ...place.tags,
    ].some((value) => value.toLocaleLowerCase().includes(term)))
    .map((place) => ({ kind: "place", key: `place:${place.key}`, place }));

  const stops: CampusSearchResult[] = busStops
    .filter((stop) => [stop.name, ...(stop.aliases ?? []), "bus", "bus stop", "shuttle"]
      .some((value) => value.toLocaleLowerCase().includes(term)))
    .map((stop) => ({ kind: "bus_stop", key: `bus-stop:${stop.id}`, stop }));

  return [...places, ...stops];
}
