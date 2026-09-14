# UNIMAS Bus Data Status

Last reviewed: 2026-09-14

## Scope and safety

Bus V1 contains 11 unique stopping points named by two historical/temporary UNIMAS campus shuttle schedule PDFs. This is not presented as a complete or confirmed 2026 bus-stop list. Schedule times are shown only as **reference route departures**; they are not stop-level arrival times. No live vehicle data or bus ride duration is available.

## Sources

- Loop A: [Historical UNIMAS campus shuttle schedule U1](https://www.cempaka.unimas.my/media/attachments/2022/09/29/shuttlebusschedule1-1.pdf)
- Loop B: [Historical UNIMAS campus shuttle schedule U2](https://sustainability.unimas.my/media/attachments/2023/10/21/shuttlebusschedule1-1.pdf)
- Dahlia coordinate: [OpenStreetMap mapped bus stop](https://www.openstreetmap.org/?mlat=1.471740&mlon=110.428720#map=19/1.471740/110.428720)

## Stops

| Stop | Coordinate | Route data | Schedule data | Verification | Source |
| --- | --- | --- | --- | --- | --- |
| Allamanda | Missing | Loop A | Historical reference | `schedule_source` | U1 PDF |
| Dahlia Bus Stop | 1.471740, 110.428720 | Loop A | Historical reference | `mapped_bus_stop` | OpenStreetMap + U1 PDF |
| Sakura | Missing | Loop A | Historical reference | `schedule_source` | U1 PDF |
| BHEP | Missing | Loops A, B | Historical reference | `schedule_source` | U1/U2 PDFs |
| Cempaka | Missing | Loops A, B | Historical reference | `schedule_source` | U1/U2 PDFs |
| Water Tower | Missing | Loops A, B | Historical reference | `schedule_source` | U1/U2 PDFs |
| Unijaya | Missing | Loop B | Historical reference | `schedule_source` | U2 PDF |
| CAIS | Missing | Loop B | Historical reference | `schedule_source` | U2 PDF |
| BRC | Missing | Loop B | Historical reference | `schedule_source` | U2 PDF |
| TAZ | Missing | Loop B | Historical reference | `schedule_source` | U2 PDF |
| Stadium | Missing | Loop B | Historical reference | `schedule_source` | U2 PDF |

Current schedule-listed unique campus stops: **11**  
Stops with usable coordinates: **1**  
Stops still needing coordinates: **10**

## Route order

- Historical campus loop A: Allamanda → Dahlia → Sakura → BHEP → Cempaka → Water Tower → Allamanda.
- Historical campus loop B: Unijaya → CAIS → BHEP → Cempaka → Water Tower → BRC → TAZ → Stadium → Unijaya.

Both routes are explicitly modelled as loops. Route order is stored in `data/busTransit.ts`, not in React components.

## Schedule interpretation

- Weekday and weekend/public-holiday time arrays are structured separately per route.
- Timezone is `Asia/Kuching`.
- The source does not provide verified stop-level arrival offsets, so the interface says “reference route departure”.
- Public holidays are not calculated automatically. The weekend schedule label also notes public holidays because that is how the source groups the service.
- The historical timetable is not claimed to be the current 2026 timetable.

## Current limitations

- Only Dahlia Bus Stop can be placed on the map or used in walking calculations.
- A precise Bus journey needs at least two useful mapped stops. With only one mapped stop, the planner deliberately returns partial-data status and keeps the direct Walk option available.
- Bus ride duration and total Bus ETA are unavailable.
- There is no real-time bus location, arrival prediction, ticketing, or service-alert feed.

## Next real-world data to collect

For each remaining stop, collect the coordinate of the **actual boarding point**, not the centre of a nearby building. Record the schedule-matching stop name, latitude/longitude to six decimal places, source or on-site verification date, evidence where permitted, and its currently served route(s).

Also obtain a current official timetable with an effective date and a clear definition of each time. If available, collect verified stop-to-stop travel durations separately.

To add a coordinate later, update only the matching `BusStop` record in `data/busTransit.ts`; map, search, nearby-stop, and journey-planning logic do not need to be rewritten.
