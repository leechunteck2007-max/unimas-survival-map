import type { Coordinates } from "@/utils/distance";

export type TransitVerificationStatus =
  | "pending"
  | "schedule_source"
  | "mapped_bus_stop"
  | "location_verified"
  | "current_verified";

export type TransitSource = {
  label: string;
  url: string;
  accessedOn: string;
};

export interface BusStop {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  aliases?: string[];
  description?: string;
  source: TransitSource;
  verificationStatus: TransitVerificationStatus;
  lastUpdated?: string;
}

export interface RouteStop {
  stopId: string;
  sequence: number;
  estimatedTravelMinutes?: number | null;
}

export interface BusRoute {
  id: string;
  name: string;
  direction?: string;
  isLoop: boolean;
  stops: RouteStop[];
  source: TransitSource;
  verificationStatus: TransitVerificationStatus;
}

export type BusServiceType = "weekday" | "weekend_public_holiday";

export interface BusSchedule {
  id: string;
  routeId: string;
  serviceType: BusServiceType;
  departureTimes: string[];
  timezone: "Asia/Kuching";
  timeMeaning: "route_departure_reference";
  source: TransitSource;
  verificationStatus: TransitVerificationStatus;
}

// Structural on purpose: a future CampusPlace category is eligible without
// adding category-specific transit code.
export interface TransitDestination extends Coordinates {
  id: string;
  name: string;
  category: string;
}

export type JourneyCandidate = {
  routeId: string;
  boardingStopId: string;
  dropOffStopId: string;
  boardingSequence: number;
  dropOffSequence: number;
  accessStraightLineMetres: number;
  egressStraightLineMetres: number;
  scheduleAvailable: boolean;
  score: number;
};

export type JourneyPlan =
  | {
      status: "available";
      destination: TransitDestination;
      candidate: JourneyCandidate;
      nearestBoardingStopId: string;
    }
  | {
      status: "partial" | "unavailable";
      destination: TransitDestination;
      reason: "location_required" | "insufficient_stop_coordinates" | "no_suitable_route";
      nearestBoardingStopId?: string;
    };

// Reserved for a future verified live provider. No live records are created in V1.
export interface LiveTransitVehicle {
  vehicleId: string;
  routeId: string;
  tripId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  estimatedArrival?: string;
}
