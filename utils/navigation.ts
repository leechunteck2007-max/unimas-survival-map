import type { Coordinates } from "@/utils/distance";

export function getNavigationUrl(destination: Coordinates) {
  const params = new URLSearchParams({
    api: "1",
    destination: `${destination.latitude},${destination.longitude}`,
    travelmode: "walking",
  });

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
