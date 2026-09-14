import { additionalCampusPlaces } from "@/data/additionalCampusPlaces";
import { getCampusCategory } from "@/data/campusCategories";
import { residentialColleges } from "@/data/colleges";
import { faculties } from "@/data/faculties";
import type {
  CampusPlace,
  CampusPlaceCategory,
  CampusPlaceInput,
} from "@/types/campus-place";

function placeKey(category: CampusPlaceCategory, id: string) {
  return `${category}:${id}`;
}

export function normalizeCampusPlace(place: CampusPlaceInput): CampusPlace {
  return { ...place, key: placeKey(place.category, place.id) };
}

export const facultyPlaces: CampusPlace[] = faculties.map((faculty) => normalizeCampusPlace({
  id: faculty.id,
  name: faculty.name,
  shortName: faculty.shortName,
  category: "faculty",
  description: faculty.description,
  latitude: faculty.latitude,
  longitude: faculty.longitude,
  aliases: [],
  tags: faculty.tags,
  sourceUrl: faculty.sourceUrl,
  verified: true,
  detailUrl: `/faculties/${faculty.slug}`,
}));

export const collegePlaces: CampusPlace[] = residentialColleges.map((college) => {
  const shortName = college.name.replace(/^Kolej\s+/i, "");

  return normalizeCampusPlace({
    id: college.id,
    name: college.name,
    category: "college",
    description: college.highlights[0] ?? "UNIMAS residential college.",
    latitude: college.mapPosition[0],
    longitude: college.mapPosition[1],
    aliases: [shortName, `Kolej Kediaman ${shortName}`],
    tags: ["kolej", "college", "residential college", "hostel", shortName],
    sourceUrl: college.sourceUrl,
    verified: true,
  });
});

export const allCampusPlaces: CampusPlace[] = [
  ...facultyPlaces,
  ...collegePlaces,
  ...additionalCampusPlaces.map(normalizeCampusPlace),
].filter((place) => place.verified);

export function getCampusPlace(category: CampusPlaceCategory, id: string) {
  return allCampusPlaces.find(
    (place) => place.category === category && place.id === id,
  );
}

export function searchCampusPlaces(
  query: string,
  places: readonly CampusPlace[] = allCampusPlaces,
) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return [...places];

  return places.filter((place) =>
    [
      place.name,
      place.shortName ?? "",
      place.category,
      getCampusCategory(place.category).label,
      ...getCampusCategory(place.category).searchTerms,
      ...place.aliases,
      ...place.tags,
    ].some((value) => value.toLocaleLowerCase().includes(normalizedQuery)),
  );
}

export function hasValidPlaceCoordinates(
  place: CampusPlace,
): place is CampusPlace & { latitude: number; longitude: number } {
  return (
    typeof place.latitude === "number" &&
    Number.isFinite(place.latitude) &&
    place.latitude >= -90 &&
    place.latitude <= 90 &&
    typeof place.longitude === "number" &&
    Number.isFinite(place.longitude) &&
    place.longitude >= -180 &&
    place.longitude <= 180
  );
}

export const mappableCampusPlaces = allCampusPlaces.filter(
  hasValidPlaceCoordinates,
);

export function campusPlacesInCategory(
  category: CampusPlaceCategory,
  places: readonly CampusPlace[] = allCampusPlaces,
) {
  return places.filter((place) => place.category === category);
}
