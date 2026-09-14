# UNIMAS Walking Shortcut Candidates

Audit date: 2026-09-14  
Status: investigation only — no candidate is enabled in production

## Safety rule

This report identifies routing and map-data anomalies, not approved shortcuts. A visible line, missing OpenStreetMap access tag, or small geometry gap does not prove that a path is publicly accessible or safe. Do not change production routing or OSM data until a path is clearly supported by OSM access data or manually verified on campus.

Candidate statuses used here:

- `candidate`: suspicious geometry or distance requiring more evidence.
- `osm_supported`: OSM contains a walkable way and no restrictive access tag, but real-world access may still need checking.
- `manually_verified`: reserved; none yet.
- `rejected`: reserved; none yet.
- `restricted`: OSM explicitly disallows public walking; none found in the inspected candidate set.

## Routing-profile audit

The application calls the FOSSGIS endpoint `routing.openstreetmap.de/routed-foot`, so it is using the separately compiled foot-routing graph. The trailing OSRM API token is currently `driving`, but a controlled request with `foot` returned the same 844 m / 675 s result as `driving`. Returned route steps report `mode: walking`.

This is not a confirmed car-profile bug. FOSSGIS documents separate car, bike, and foot graphs, while OSRM profiles are selected when the routing graph is built. The deployed FOSSGIS foot profile explicitly handles `footway`, `path`, `pedestrian`, `steps`, `service`, and `living_street`; it favours footways/paths and rejects `access=no` and `access=private` unless a more specific permitted foot tag applies.

References:

- [FOSSGIS routing server and profile description](https://routing.openstreetmap.de/about.html)
- [FOSSGIS foot profile source](https://github.com/fossgis-routing-server/cbf-routing-profiles/blob/master/foot.lua)
- [OSRM HTTP API profile behaviour](https://project-osrm.org/docs/v26.4.0/http)

Conclusion: **no production routing-profile change is justified by this audit**. The strongest evidence points to OSM graph connectivity and endpoint data.

## Audit method

- Inputs: the 10 current Kolej coordinates, 10 current Fakulti coordinates, and Dahlia Bus Stop.
- Provider: the same FOSSGIS OSRM foot graph used by production.
- Matrix: 100 Kolej → Fakulti and 10 Dahlia Bus Stop → Fakulti combinations.
- Straight line: the project's Haversine calculation.
- Suspicious: route/straight-line ratio greater than 1.8.
- Highly suspicious: ratio greater than 2.5.
- Result: 52 of 110 routes exceeded 1.8; 27 exceeded 2.5.
- Detailed route responses were then inspected for snapping distance, geometry bounds, named road segments, and walking mode.
- OSM main-campus extract: 22 pedestrian ways in the inspected bounding box — 20 `footway`, 2 `path`, no `steps` or `pedestrian` ways. Most have no explicit access tag. No `access=private`, `access=no`, `foot=private`, or `foot=no` was found in the inspected footway/path/service/living-street set.
- The same extract returned zero mapped `entrance=*` nodes in the inspected area. This does not prove entrances are absent on the ground; it means the routing graph cannot use mapped entrance nodes there.

## Prioritized candidate areas

### P0 — Cempaka / Bunga Raya east-side campus connection

Classification: **C. OSM CONNECTIVITY ISSUE**  
Candidate status: `osm_supported` pending access verification  
Confidence: High that a graph gap exists; Medium that connecting it represents a valid public route

Representative routes:

| Route | Straight line | Routed | Ratio | Routed time |
| --- | ---: | ---: | ---: | ---: |
| Kolej Cempaka → FEB | 335 m | 2,422 m | 7.23 | 32 min |
| Kolej Cempaka → FSSH | 419 m | 2,375 m | 5.67 | 32 min |
| Kolej Cempaka → FELC | 483 m | 2,266 m | 4.69 | 30 min |
| Kolej Cempaka → FCSIT | 536 m | 2,150 m | 4.01 | 29 min |
| Kolej Cempaka → FRST | 685 m | 2,510 m | 3.66 | 33 min |
| Kolej Cempaka → FENG | 731 m | 2,260 m | 3.09 | 30 min |
| Kolej Bunga Raya → FEB | 769 m | 2,915 m | 3.79 | 39 min |
| Kolej Bunga Raya → FCSIT | 737 m | 2,643 m | 3.59 | 35 min |

OSM evidence:

- [Way 1292796676](https://www.openstreetmap.org/way/1292796676) is tagged `highway=footway`, `surface=concrete`, `bicycle=yes`, and `motor_vehicle=yes`.
- Its endpoint at `1.4659101, 110.4341641` is about 13.6 m from a node at `1.4658017, 110.4342205` on [way 1351155277](https://www.openstreetmap.org/way/1351155277).
- Way 1351155277 is `highway=residential`, `surface=paved`, and `motor_vehicle=no`.
- The ways do not share a node, so the routing graph cannot cross the visible gap.
- Cempaka → FEB currently detours through Jalan Kapur, Jalan Jati, Jalan Belian, and Jalan Ensurai; endpoint snapping is only 19 m / 21 m, so the 2 km excess is not explained by start/end snapping alone.

Manual check needed:

1. Visit both coordinates around the apparent 13.6 m gap.
2. Verify whether there is a continuous physical path/crossing.
3. Check gates, fences, drains, level differences, construction, hours, and public access.
4. If public and continuous, document photos/GPS and correct OSM topology through normal OSM review — not automatically from this project.

### P1 — Dahlia footway to Jalan Kolej Dahlia

Classification: **E. SHORTCUT CANDIDATE / possible C. OSM CONNECTIVITY ISSUE**  
Candidate status: `candidate`  
Confidence: Medium

Representative routes:

| Route | Straight line | Routed | Ratio | Routed time |
| --- | ---: | ---: | ---: | ---: |
| Kolej Dahlia → FENG | 566 m | 1,424 m | 2.52 | 19 min |
| Kolej Dahlia → FRST | 357 m | 793 m | 2.22 | 11 min |
| Dahlia Bus Stop → FENG | 441 m | 844 m | 1.91 | 11 min |
| Dahlia Bus Stop → FMHS | 954 m | 2,431 m | 2.55 | 32 min |

OSM evidence:

- [Way 658517509](https://www.openstreetmap.org/way/658517509) is a `highway=footway` with no restrictive access tag.
- Its endpoint at `1.4722634, 110.4295492` is about 16.0 m from the end of [Jalan Kolej Dahlia way 652706590](https://www.openstreetmap.org/way/652706590) at `1.4723900, 110.4296184`.
- The two ways do not share a node.
- Kolej Dahlia currently snaps 39 m to Jalan Kolej Dahlia; Dahlia Bus Stop snaps only 8 m to the foot graph. This also confirms that the Kolej centre and Bus Stop are meaningfully different routing points.

Manual check needed: inspect the 16 m interval for an actual continuous public walkway, gate, kerb, drain, fence, or elevation change. Confirm whether it connects in both walking directions.

### P1 — Central west footway duplicate-node junction

Classification: **C. OSM CONNECTIVITY ISSUE**  
Candidate status: `osm_supported` pending topology correction and access check  
Confidence: High that the topology is disconnected; Medium for route impact

Relevant routes:

| Route | Straight line | Routed | Ratio | Routed time |
| --- | ---: | ---: | ---: | ---: |
| Kolej Cempaka → FACA | 540 m | 1,334 m | 2.47 | 18 min |
| Kolej Cempaka → FCSHD | 469 m | 1,066 m | 2.27 | 14 min |
| Kolej Cempaka → FELC | 483 m | 2,266 m | 4.69 | 30 min |

OSM evidence:

- [Way 658754389](https://www.openstreetmap.org/way/658754389) is an asphalt `highway=footway` ending at `1.4650614, 110.4276122`.
- [Way 836182115](https://www.openstreetmap.org/way/836182115) is also an asphalt `highway=footway` and contains the identical coordinate.
- The coordinate is represented by different OSM node IDs, so the two ways visually meet but are not graph-connected.
- A second endpoint of way 836182115 is only about 5.9 m away from way 658754389.

Manual/OSM check needed: confirm the two paths physically connect at grade and are open to pedestrians. If confirmed, merge/connect the correct OSM nodes without changing the path's real geometry or access tags.

### P2 — Sakura toward FENG / FMHS

Classification: **E. SHORTCUT CANDIDATE**  
Candidate status: `candidate`  
Confidence: Low to Medium

| Route | Straight line | Routed | Ratio | Routed time |
| --- | ---: | ---: | ---: | ---: |
| Kolej Sakura → FENG | 364 m | 991 m | 2.72 | 13 min |
| Kolej Sakura → FMHS | 665 m | 2,282 m | 3.43 | 30 min |

OSM observations:

- [Sakura Path way 728238429](https://www.openstreetmap.org/way/728238429) is present, and the walking route already uses Jalan Kolej Sakura plus unnamed walking segments.
- The automated endpoint scan did not find another unconnected pedestrian endpoint within 30 m that clearly explains this detour.
- The apparent direct corridor may be blocked by buildings, landscaping, water, level changes, or an unmapped path. No shortcut is confirmed.

Manual check needed: start from the actual Sakura pedestrian exit, not the building centre, and verify whether a continuous public path heads south/south-west toward FENG and FMHS.

### P2 — Tun Ahmad Zaidi toward the central faculties

Classification: **E. SHORTCUT CANDIDATE**  
Candidate status: `candidate`  
Confidence: Low

| Route | Straight line | Routed | Ratio | Routed time |
| --- | ---: | ---: | ---: | ---: |
| Kolej Tun Ahmad Zaidi → FELC | 855 m | 2,005 m | 2.34 | 27 min |
| Kolej Tun Ahmad Zaidi → FEB | 690 m | 1,538 m | 2.23 | 21 min |
| Kolej Tun Ahmad Zaidi → FSSH | 782 m | 1,658 m | 2.12 | 22 min |

The current route uses Jalan Kolej Tun Ahmad Zaidi, Jalan Jati, Jalan Belian, Jalan Ensurai, Jambatan Cinta, and internal campus ways. No specific sub-30 m pedestrian gap was detected here. The long ratio may reflect real lake/road/building barriers.

Manual check needed: verify any commonly used pedestrian exit from TAZ toward the central campus before treating this as a map problem.

### P3 — Destination entrance coordinates

Classification: **D. DESTINATION COORDINATE ISSUE**  
Candidate status: `candidate`  
Confidence: Medium

Current coordinates are generally sourced from OSM building ways/relations rather than verified entrance nodes. FOSSGIS snap distances from those coordinates include:

| Destination | Snap distance to foot graph |
| --- | ---: |
| FACA | 61 m |
| FENG | 41 m |
| FRST | 41 m |
| FCSHD | 41 m |
| FCSIT | 39 m |
| FELC | 31 m |
| FMHS | 24 m |
| FEB | 21 m |
| FSSH | 20 m |

The OSM extract returned no `entrance=*` nodes in the main-campus audit box. For FENG, FRST, FCSHD, FCSIT, FACA, and FELC, a verified public entrance or walkway-access coordinate could improve routing. It must be stored separately from a building-centre coordinate or changed only after verification.

FEB and FSSH snap within about 20 m, so their very large Cempaka detours are unlikely to be caused only by destination centroids.

Manual check needed: record the public entrance students normally use and the connected walkway node. Do not move place markers merely to make a route shorter.

### P3 — Kolej Kasturi coordinate identity / cross-campus route

Classification: **D. DESTINATION COORDINATE ISSUE requiring identity confirmation**, not a campus shortcut  
Candidate status: `candidate`  
Confidence: High that it should be excluded from ordinary walking-shortcut priority

Kolej Kasturi → main-campus Fakulti routes show ratios around 4 and routed distances around 51–54 km versus 12.5–14.4 km straight line. Reverse OSM lookup places the current coordinate at the UNIMAS Faculty of Medicine and Health Sciences site in Kuching, far from the Kota Samarahan main campus.

This may be a legitimate remote-campus residential location, or the current public-directory coordinate may identify the wrong feature. Either way, it is not evidence of a small campus walkway. Confirm the exact Kolej Kasturi building and intended campus before further route analysis. Do not recommend this as a walking journey.

## Routes classified as correct by this audit

These control routes did not cross the 1.8 threshold and showed no specific shortcut evidence in this audit:

| Route | Straight line | Routed | Ratio | Classification |
| --- | ---: | ---: | ---: | --- |
| Kolej Kenanga → FBE | 1,414 m | 1,746 m | 1.23 | A. ROUTING IS CORRECT |
| Kolej Rafflesia → FBE | 2,278 m | 3,334 m | 1.46 | A. ROUTING IS CORRECT |
| Kolej Seroja → FBE | 911 m | 1,444 m | 1.58 | A. ROUTING IS CORRECT |
| Kolej Allamanda → FRST | 328 m | 496 m | 1.51 | A. ROUTING IS CORRECT |
| Kolej Tun Ahmad Zaidi → FBE | 1,290 m | 1,774 m | 1.37 | A. ROUTING IS CORRECT |
| Dahlia Bus Stop → FCSIT | 364 m | 490 m | 1.35 | A. ROUTING IS CORRECT |
| Dahlia Bus Stop → FELC | 842 m | 958 m | 1.14 | A. ROUTING IS CORRECT |

“Correct” here means no anomaly was detected by the ratio/connectivity audit. It is not a guarantee that every on-ground path or access condition is current.

## Access findings

- No inspected candidate way was tagged `access=private`, `access=no`, `foot=private`, or `foot=no`.
- Missing access tags are not proof of public access.
- Covered ways exist in the area, including [Jambatan Cinta way 658482512](https://www.openstreetmap.org/way/658482512), and are accepted by the foot profile.
- No evidence was found that the provider systematically rejects covered ways, bridges, footways, paths, or steps.
- No candidate is classified F. ACCESS RESTRICTED from current OSM tags; on-site restrictions may still exist.

## Recommended on-campus verification order

1. Cempaka east-side 13.6 m gap: `1.4659101, 110.4341641` ↔ `1.4658017, 110.4342205`.
2. Dahlia 16 m gap: `1.4722634, 110.4295492` ↔ `1.4723900, 110.4296184`.
3. Central duplicate-node junction around `1.4650614, 110.4276122`.
4. Actual student entrance coordinates for FACA, FENG, FRST, FCSHD, FCSIT, and FELC.
5. Sakura pedestrian exit toward FENG/FMHS.
6. TAZ pedestrian exit toward central campus.
7. Confirm Kolej Kasturi's exact building/campus identity before treating it as a walking destination.

For each check, record GPS coordinates, date/time, directionality, surface, stairs, cover, gates, opening hours, disability access, and whether the public is permitted to walk through. A rejected or restricted candidate should remain documented rather than silently deleted.

## Development overlay decision

No overlay was added in this checkpoint. The audit already isolated exact gap coordinates and OSM way IDs, while a nearby-way overlay would require additional OSM fetching, caching, attribution, and development-only gating. Adding it now would increase code and provider load without making speculative paths safer. Reconsider a local-only overlay after the three highest-priority gaps are physically checked.
