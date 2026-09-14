export type Coordinates = {
  latitude: number;
  longitude: number;
};

export function hasValidCoordinates(
  coordinates: Partial<Coordinates> | undefined,
): coordinates is Coordinates {
  return (
    typeof coordinates?.latitude === "number" &&
    Number.isFinite(coordinates.latitude) &&
    coordinates.latitude >= -90 &&
    coordinates.latitude <= 90 &&
    typeof coordinates.longitude === "number" &&
    Number.isFinite(coordinates.longitude) &&
    coordinates.longitude >= -180 &&
    coordinates.longitude <= 180
  );
}

const earthRadiusMetres = 6_371_000;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function distanceInMetres(from: Coordinates, to: Coordinates) {
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) *
      Math.cos(toLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 2 * earthRadiusMetres * Math.asin(Math.sqrt(haversine));
}

export function formatDistance(metres: number) {
  if (metres < 1_000) return `${Math.round(metres)} m`;
  return `${(metres / 1_000).toFixed(1)} km`;
}

export function formatStraightLineDistance(metres: number) {
  return `~${formatDistance(metres)} straight-line`;
}

export function formatDuration(seconds: number) {
  const totalMinutes = Math.max(1, Math.round(seconds / 60));
  if (totalMinutes < 60) return `${totalMinutes} min`;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes ? `${hours} hr ${minutes} min` : `${hours} hr`;
}
