"use client";

import { useEffect, useMemo, useState } from "react";
import { useUserLocation } from "@/hooks/useUserLocation";
import {
  distanceInMetres,
  hasValidCoordinates,
  type Coordinates,
} from "@/utils/distance";
import { getWalkingRoute, type WalkingRoute } from "@/utils/walking-route";

type RouteStatus = "idle" | "loading" | "ready" | "fallback";

type RouteResult = {
  key: string;
  status: "ready" | "fallback";
  route?: WalkingRoute;
};

export function useWalkingRoute(destination?: Coordinates) {
  const { location } = useUserLocation();
  const [result, setResult] = useState<RouteResult>();
  const destinationLatitude = destination?.latitude;
  const destinationLongitude = destination?.longitude;
  const stableDestination = useMemo(() => {
    const candidate = {
      latitude: destinationLatitude,
      longitude: destinationLongitude,
    };
    return hasValidCoordinates(candidate) ? candidate : undefined;
  }, [destinationLatitude, destinationLongitude]);

  const straightLineDistance = useMemo(
    () =>
      location && stableDestination
        ? distanceInMetres(location, stableDestination)
        : undefined,
    [location, stableDestination],
  );
  const requestKey = location && stableDestination
    ? [
        location.latitude,
        location.longitude,
        stableDestination.latitude,
        stableDestination.longitude,
      ].join(":")
    : undefined;

  useEffect(() => {
    let active = true;

    if (!location || !stableDestination || !requestKey) return;

    getWalkingRoute(location, stableDestination)
      .then((result) => {
        if (!active) return;
        setResult({ key: requestKey, status: "ready", route: result });
      })
      .catch(() => {
        if (active) setResult({ key: requestKey, status: "fallback" });
      });

    return () => {
      active = false;
    };
  }, [location, requestKey, stableDestination]);

  let status: RouteStatus = requestKey ? "loading" : "idle";
  if (requestKey && result && result.key === requestKey) status = result.status;
  const route = result && result.key === requestKey ? result.route : undefined;

  return { location, route, status, straightLineDistance };
}
