import type { BusRoute, BusSchedule, BusStop, TransitSource } from "@/types/transit";
import { hasValidCoordinates } from "@/utils/distance";

const routeASource: TransitSource = {
  label: "Historical UNIMAS campus shuttle schedule (U1)",
  url: "https://www.cempaka.unimas.my/media/attachments/2022/09/29/shuttlebusschedule1-1.pdf",
  accessedOn: "2026-09-14",
};

const routeBSource: TransitSource = {
  label: "Historical UNIMAS campus shuttle schedule (U2)",
  url: "https://sustainability.unimas.my/media/attachments/2023/10/21/shuttlebusschedule1-1.pdf",
  accessedOn: "2026-09-14",
};

const dahliaMapSource: TransitSource = {
  label: "OpenStreetMap mapped bus stop",
  url: "https://www.openstreetmap.org/?mlat=1.471740&mlon=110.428720#map=19/1.471740/110.428720",
  accessedOn: "2026-09-14",
};

function scheduleStop(id: string, name: string, source = routeASource): BusStop {
  return {
    id,
    name,
    latitude: null,
    longitude: null,
    aliases: [`${name} Bus Stop`],
    description: "Stopping point listed in the historical UNIMAS shuttle schedule.",
    source,
    verificationStatus: "schedule_source",
  };
}

export const busStops: BusStop[] = [
  scheduleStop("allamanda", "Allamanda"),
  {
    ...scheduleStop("dahlia", "Dahlia"),
    name: "Dahlia Bus Stop",
    latitude: 1.47174,
    longitude: 110.42872,
    aliases: ["Dahlia", "Dahlia shuttle stop"],
    description: "Mapped bus stop near Dahlia; distinct from the Kolej Dahlia building location.",
    source: dahliaMapSource,
    verificationStatus: "mapped_bus_stop",
    lastUpdated: "2026-09-14",
  },
  scheduleStop("sakura", "Sakura"),
  scheduleStop("bhep", "BHEP"),
  scheduleStop("cempaka", "Cempaka"),
  scheduleStop("water-tower", "Water Tower"),
  scheduleStop("unijaya", "Unijaya", routeBSource),
  scheduleStop("cais", "CAIS", routeBSource),
  scheduleStop("brc", "BRC", routeBSource),
  scheduleStop("taz", "TAZ", routeBSource),
  scheduleStop("stadium", "Stadium", routeBSource),
];

function routeStops(ids: string[]) {
  return ids.map((stopId, sequence) => ({ stopId, sequence }));
}

export const busRoutes: BusRoute[] = [
  {
    id: "historical-loop-a",
    name: "Historical campus loop A",
    direction: "Allamanda → Dahlia → Sakura → BHEP → Cempaka → Water Tower → Allamanda",
    isLoop: true,
    stops: routeStops(["allamanda", "dahlia", "sakura", "bhep", "cempaka", "water-tower"]),
    source: routeASource,
    verificationStatus: "schedule_source",
  },
  {
    id: "historical-loop-b",
    name: "Historical campus loop B",
    direction: "Unijaya → CAIS → BHEP → Cempaka → Water Tower → BRC → TAZ → Stadium → Unijaya",
    isLoop: true,
    stops: routeStops(["unijaya", "cais", "bhep", "cempaka", "water-tower", "brc", "taz", "stadium"]),
    source: routeBSource,
    verificationStatus: "schedule_source",
  },
];

const weekendTimes = [
  "07:30", "08:30", "09:30", "10:30", "11:30", "12:00", "13:00",
  "14:00", "15:00", "17:00", "18:00", "20:00", "21:00", "22:00",
];

export const busSchedules: BusSchedule[] = [
  {
    id: "loop-a-weekday",
    routeId: "historical-loop-a",
    serviceType: "weekday",
    departureTimes: ["07:15", "07:45", "08:15", "09:00", "10:00", "12:00", "13:00", "14:00", "16:00", "17:00", "18:00", "20:00", "21:00", "22:00"],
    timezone: "Asia/Kuching",
    timeMeaning: "route_departure_reference",
    source: routeASource,
    verificationStatus: "schedule_source",
  },
  {
    id: "loop-a-weekend",
    routeId: "historical-loop-a",
    serviceType: "weekend_public_holiday",
    departureTimes: weekendTimes,
    timezone: "Asia/Kuching",
    timeMeaning: "route_departure_reference",
    source: routeASource,
    verificationStatus: "schedule_source",
  },
  {
    id: "loop-b-weekday",
    routeId: "historical-loop-b",
    serviceType: "weekday",
    departureTimes: ["07:15", "07:45", "08:00", "09:00", "10:00", "12:00", "13:00", "14:00", "16:00", "17:00", "18:00", "20:00", "21:00", "22:00"],
    timezone: "Asia/Kuching",
    timeMeaning: "route_departure_reference",
    source: routeBSource,
    verificationStatus: "schedule_source",
  },
  {
    id: "loop-b-weekend",
    routeId: "historical-loop-b",
    serviceType: "weekend_public_holiday",
    departureTimes: weekendTimes,
    timezone: "Asia/Kuching",
    timeMeaning: "route_departure_reference",
    source: routeBSource,
    verificationStatus: "schedule_source",
  },
];

export function hasValidBusStopCoordinates(
  stop: BusStop,
): stop is BusStop & { latitude: number; longitude: number } {
  return hasValidCoordinates({ latitude: stop.latitude, longitude: stop.longitude });
}

export const mappableBusStops = busStops.filter(hasValidBusStopCoordinates);

export function getBusStop(stopId: string) {
  return busStops.find((stop) => stop.id === stopId);
}

export function routesServingStop(stopId: string) {
  return busRoutes.filter((route) => route.stops.some((stop) => stop.stopId === stopId));
}
