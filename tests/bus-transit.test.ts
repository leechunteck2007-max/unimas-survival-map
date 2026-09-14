import { describe, expect, it } from "vitest";
import { busRoutes, busSchedules, busStops, mappableBusStops } from "@/data/busTransit";
import { searchCampusEntities } from "@/data/campusSearch";
import type { BusRoute, BusStop, TransitDestination } from "@/types/transit";
import { canTravelDirectly, nextReferenceDeparture, planJourney } from "@/utils/transit";

const source = { label: "test", url: "https://example.com", accessedOn: "2026-09-14" };
const stop = (id: string, latitude: number, longitude: number): BusStop => ({
  id, name: id, latitude, longitude, source, verificationStatus: "location_verified",
});

describe("Bus V1 transit data", () => {
  it("keeps all schedule-listed stops but maps only verified coordinates", () => {
    expect(busStops).toHaveLength(11);
    expect(mappableBusStops).toHaveLength(1);
    expect(mappableBusStops[0]).toMatchObject({ id: "dahlia", latitude: 1.47174, longitude: 110.42872 });
    expect(busStops.filter((item) => item.latitude === null)).toHaveLength(10);
  });

  it("stores both loop orders and structured schedule records", () => {
    expect(busRoutes).toHaveLength(2);
    expect(busRoutes[0].stops.map((item) => item.stopId)).toEqual(["allamanda", "dahlia", "sakura", "bhep", "cempaka", "water-tower"]);
    expect(busRoutes[1].stops.map((item) => item.stopId)).toEqual(["unijaya", "cais", "bhep", "cempaka", "water-tower", "brc", "taz", "stadium"]);
    expect(busSchedules).toHaveLength(4);
    expect(busSchedules.every((item) => item.timeMeaning === "route_departure_reference")).toBe(true);
  });

  it("distinguishes bus stops from places in global search", () => {
    const results = searchCampusEntities("Dahlia");
    expect(results.map((result) => result.kind)).toEqual(expect.arrayContaining(["place", "bus_stop"]));
    expect(results.find((result) => result.kind === "bus_stop" && result.stop.id === "dahlia")).toBeTruthy();
  });
});

describe("generic journey planning", () => {
  const nonLoop: BusRoute = {
    id: "test-route", name: "Test route", isLoop: false,
    stops: ["b", "d"].map((stopId, sequence) => ({ stopId, sequence })), source,
    verificationStatus: "location_verified",
  };
  const stops = [
    stop("a", 1, 110),
    stop("b", 1, 110.001),
    stop("c", 1, 110.01),
    stop("d", 1, 110.009),
  ];
  const destination: TransitDestination = { id: "future", name: "Future place", category: "future_test_category", latitude: 1, longitude: 110.01 };

  it("respects direction on non-loops and forward wrap on loops", () => {
    expect(canTravelDirectly(nonLoop, "b", "d")).toBe(true);
    expect(canTravelDirectly(nonLoop, "d", "b")).toBe(false);
    expect(canTravelDirectly({ ...nonLoop, isLoop: true }, "d", "b")).toBe(true);
  });

  it("chooses a useful boarding stop rather than the nearest unusable stop", () => {
    const plan = planJourney({ latitude: 1, longitude: 110 }, destination, stops, [nonLoop]);
    expect(plan.status).toBe("available");
    if (plan.status !== "available") return;
    expect(plan.nearestBoardingStopId).toBe("a");
    expect(plan.candidate.boardingStopId).toBe("b");
    expect(plan.candidate.dropOffStopId).toBe("d");
    expect(plan.candidate.scheduleAvailable).toBe(false);
  });

  it("accepts an unknown future category and reports no route safely", () => {
    const plan = planJourney({ latitude: 1, longitude: 110 }, destination, stops, []);
    expect(plan).toMatchObject({ status: "unavailable", reason: "no_suitable_route" });
  });

  it("handles missing stop coordinates and location without crashing", () => {
    expect(planJourney(undefined, destination, busStops, busRoutes)).toMatchObject({ reason: "location_required" });
    expect(planJourney({ latitude: 1.47, longitude: 110.43 }, destination, busStops, busRoutes)).toMatchObject({ status: "partial", reason: "insufficient_stop_coordinates" });
  });

  it("returns reference departures without inventing stop arrivals", () => {
    expect(nextReferenceDeparture(["08:00", "09:00"], "08:15")).toBe("09:00");
    expect(nextReferenceDeparture(["08:00"], "09:00")).toBeUndefined();
  });
});
