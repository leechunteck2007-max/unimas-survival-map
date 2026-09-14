import { hasValidCoordinates } from "@/utils/distance";
import { parseOsrmWalkingRoute } from "@/utils/osrm-walking-route";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const values = {
    originLat: params.get("originLat"),
    originLng: params.get("originLng"),
    destinationLat: params.get("destinationLat"),
    destinationLng: params.get("destinationLng"),
  };
  if (Object.values(values).some((value) => value === null || value.trim() === "")) {
    return Response.json({ error: "Missing coordinates" }, { status: 400 });
  }

  const origin = {
    latitude: Number(values.originLat),
    longitude: Number(values.originLng),
  };
  const destination = {
    latitude: Number(values.destinationLat),
    longitude: Number(values.destinationLng),
  };

  if (!hasValidCoordinates(origin) || !hasValidCoordinates(destination)) {
    return Response.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  const coordinates = `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`;
  const routeUrl = new URL(
    `https://routing.openstreetmap.de/routed-foot/route/v1/driving/${coordinates}`,
  );
  routeUrl.searchParams.set("overview", "full");
  routeUrl.searchParams.set("geometries", "geojson");
  routeUrl.searchParams.set("steps", "false");

  try {
    const response = await fetch(routeUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "User-Agent": "UNIMAS-Survival-Map/1.0",
      },
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) throw new Error(`Routing provider returned ${response.status}`);

    return Response.json(parseOsrmWalkingRoute(await response.json()));
  } catch {
    return Response.json({ error: "Walking route unavailable" }, { status: 503 });
  }
}
