import type { BusRoute, BusSchedule, BusStop, JourneyCandidate, JourneyPlan, TransitDestination } from "@/types/transit";
import { distanceInMetres, hasValidCoordinates, type Coordinates } from "@/utils/distance";

const candidateLimit = 4;

export function nextReferenceDeparture(departureTimes: readonly string[], localTime: string) {
  return departureTimes.find((time) => time >= localTime);
}

export function kuchingServiceType(date: Date): "weekday" | "weekend_public_holiday" {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kuching",
    weekday: "short",
  }).format(date);
  return weekday === "Sat" || weekday === "Sun" ? "weekend_public_holiday" : "weekday";
}

export function canTravelDirectly(route: BusRoute, boardingStopId: string, dropOffStopId: string) {
  const boardingIndex = route.stops.findIndex((stop) => stop.stopId === boardingStopId);
  const dropOffIndex = route.stops.findIndex((stop) => stop.stopId === dropOffStopId);
  if (boardingIndex < 0 || dropOffIndex < 0 || boardingIndex === dropOffIndex) return false;
  return route.isLoop || dropOffIndex > boardingIndex;
}

export function routeLegSequences(route: BusRoute, boardingStopId: string, dropOffStopId: string) {
  if (!canTravelDirectly(route, boardingStopId, dropOffStopId)) return undefined;
  const boarding = route.stops.find((stop) => stop.stopId === boardingStopId)!;
  const dropOff = route.stops.find((stop) => stop.stopId === dropOffStopId)!;
  return { boardingSequence: boarding.sequence, dropOffSequence: dropOff.sequence };
}

function mappedStopsByDistance(point: Coordinates, stops: readonly BusStop[]) {
  return stops
    .filter((stop): stop is BusStop & Coordinates =>
      hasValidCoordinates({ latitude: stop.latitude, longitude: stop.longitude }),
    )
    .map((stop) => ({
      stop,
      distance: distanceInMetres(point, stop),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, candidateLimit);
}

export function planJourney(
  origin: Coordinates | undefined,
  destination: TransitDestination,
  stops: readonly BusStop[],
  routes: readonly BusRoute[],
  schedules: readonly BusSchedule[] = [],
): JourneyPlan {
  if (!origin) return { status: "unavailable", destination, reason: "location_required" };

  const boardingCandidates = mappedStopsByDistance(origin, stops);
  const dropOffCandidates = mappedStopsByDistance(destination, stops);
  const nearestBoardingStopId = boardingCandidates[0]?.stop.id;

  if (boardingCandidates.length < 2 || dropOffCandidates.length < 2) {
    return {
      status: "partial",
      destination,
      reason: "insufficient_stop_coordinates",
      nearestBoardingStopId,
    };
  }

  const candidates: JourneyCandidate[] = [];
  for (const boarding of boardingCandidates) {
    for (const dropOff of dropOffCandidates) {
      for (const route of routes) {
        const leg = routeLegSequences(route, boarding.stop.id, dropOff.stop.id);
        if (!leg) continue;
        const scheduleAvailable = schedules.some((schedule) => schedule.routeId === route.id && schedule.departureTimes.length > 0);
        candidates.push({
          routeId: route.id,
          boardingStopId: boarding.stop.id,
          dropOffStopId: dropOff.stop.id,
          ...leg,
          accessStraightLineMetres: boarding.distance,
          egressStraightLineMetres: dropOff.distance,
          scheduleAvailable,
          score: boarding.distance + dropOff.distance + (scheduleAvailable ? 0 : 100_000),
        });
      }
    }
  }

  candidates.sort((a, b) => a.score - b.score);
  if (!candidates[0]) {
    return { status: "unavailable", destination, reason: "no_suitable_route", nearestBoardingStopId };
  }

  return { status: "available", destination, candidate: candidates[0], nearestBoardingStopId: nearestBoardingStopId! };
}
