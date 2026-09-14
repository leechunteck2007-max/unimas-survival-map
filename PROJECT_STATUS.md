# UNIMAS Survival Map - Project Status

Last updated: 2026-09-14

## Current goal

Maintain a reliable, mobile-first campus utility with a scalable shared category pipeline, without removing working features or presenting unverified campus data as fact.

## Bus V1 checkpoint

- Bus is now a separate transportation layer with structured `BusStop`, `BusRoute`, `RouteStop`, `BusSchedule`, and generic `JourneyPlan` models.
- All 11 historical schedule-listed stops are represented. Dahlia Bus Stop uses the separate mapped coordinate `1.471740, 110.428720`; the other 10 coordinates remain `null`.
- Two loop orders and four structured weekday/weekend-public-holiday reference schedules live in `data/busTransit.ts`, outside UI components.
- Global search distinguishes CampusPlace and Bus Stop results; a Dahlia search returns both Kolej Dahlia and Dahlia Bus Stop.
- The map renders only coordinate-backed Bus stops and safely ignores null coordinates.
- The mobile Bus section reuses shared CampusPlace destinations, location, walking routing, and navigation.
- Generic journey logic shortlists coordinate-backed stops, respects route direction and loops, separates nearest from best boarding stop, and accepts future category strings without Bus-specific code.
- With only one mapped stop, the UI deliberately shows partial-data status, never invents a Bus route/ETA, and keeps Walk available.
- `BUS_DATA_STATUS.md` records source confidence, all missing data, and exact next field-data needs.
- Current local automated checkpoint: 8 test files and 45 tests pass.

## Repository state

- Project path: `C:\Users\user\OneDrive\codex\unimas map`
- Stack: Next.js 16.3.5, React 19.2.8, TypeScript 5, Tailwind CSS 4, Leaflet 1.9 / React Leaflet 5, OpenStreetMap
- Git is initialized on `main`; the stable baseline commit `03cda78` is pushed to `origin/main`.
- GitHub repository: connected at `https://github.com/leechunteck2007-max/unimas-survival-map` (public).
- Vercel project: connected to GitHub and deployed at `https://unimas-survival-map.vercel.app`.
- `AGENTS.md` now contains both the generated Next.js documentation rule and permanent project architecture, data-integrity, and verification rules.

## Development audit

### WORKING

- The production build renders the main explorer, 10 generated faculty pages, and the dynamic walking-route endpoint.
- The normalized data layer contains 10 sourced faculties and 10 sourced residential colleges with stable category-prefixed IDs.
- Unified search, All/Faculties/Kolej filters, one-click map focus, repeated selection, marker popups, approximate Near You ranking, Google Maps navigation, and the selected-place route display are implemented.
- Fourteen canonical categories now share one configuration and one CampusPlace pipeline: Fakulti, Kolej, Food, Bus Stop, Study, Printing, Store, ATM, Toilet, Parking, Health, Sports, Prayer, and Administration.
- The mobile selector exposes common categories in a compact 4-by-2 layout and the remaining categories in a More panel. Empty categories render an explicit no-verified-data state instead of crashing or disappearing.
- Category browsing is mobile-first and fully actionable: the first selection previews the category on the map and shows a persistent in-map `View all` action; selecting the original active category again remains an additional shortcut.
- Search labels/keywords, marker styling, filter matching, selected-place state, Nearby category filtering, distance eligibility, routing eligibility, and navigation all consume the shared category/place model.
- Shared explorer and location providers keep search, cards, map selection, geolocation, and routing on one state path.
- The search combobox has keyboard navigation and accessible listbox/option relationships.
- The automated suite passes all 37 tests across data, state, category browsing, distance, geolocation, client route behaviour, category extensibility, and the walking-route server boundary.

### PARTIALLY WORKING

- Walking routes are fetched through a validated server boundary and safely fall back on failure; availability still depends on the public FOSSGIS OSRM service.
- Geolocation has clear permission, unavailable, timeout, and unsupported states, but those flows still need real HTTPS/mobile-device verification.
- Faculty details have dedicated pages; residential colleges have sourced cards but no equivalent details view.
- Near You ranks verified mapped places by straight-line distance and supports every configured category through one selector; only the selected destination requests a real route.
- Automated coverage verifies pure helpers and shared state, but not rendered React/Leaflet/geolocation interactions.

### BROKEN

- No confirmed user-facing source or build failure was found in the current tree.
- The default incremental TypeScript cache can crash the Windows Node process; the new `pnpm typecheck` command avoids that cache and is the deterministic checkpoint command.

### MISSING

- Residential-college detail parity or a shared place-details panel.
- Automated rendered search, map-selection, and location interaction checks.
- Real-device verification of browser location permission and walking-route presentation.
- Optional install/PWA metadata and verified place records for the newly configured campus utility categories.

### NEEDS REAL DATA

- Food, study, toilet, ATM, printing, store, parking, bus stop, administration, sports, health, and prayer categories are configured but intentionally empty until reliable names, coordinates, and sources are collected.
- Empty categories are visible as architecture-ready filters with explicit no-verified-data messaging; no mock records are published.
- Some residential-college photos and capacity notes still need newer official sources before they can be presented more strongly.

### NEEDS UX IMPROVEMENT

- Mobile behaviour passed manual width checks at 375, 390, and 430 pixels; repeatable automated checks and tablet/desktop coverage at 768 and 1024 pixels are still needed.

## Prioritized backlog

### P0

- Keep the local site reachable after verification work; restore the development server if a build or stale process interrupts it.
- Fix any source, type, test, or production-build failure immediately if a baseline check reveals one. None is currently confirmed.

### P1

- Add college detail parity after the routing boundary is protected.
- Add rendered tests for search clearing, location states, and one-click map focus without coupling tests to Leaflet internals.

### P2

- Add rendered interaction coverage and repeatable responsive checks.
- Keep the project README aligned with architecture, data-integrity, verification, routing, and deployment changes.
- Reduce route-validation duplication and make small presentational extractions only where they improve testability.

### P3

- Add new campus categories only with verified source-backed data.
- Consider PWA/install support, community impressions, moderation, persistence, and other advanced features after the core utility is reliable.

## Completed features

- One normalized `CampusPlace` collection containing 10 faculties and 10 residential colleges with stable `category:id` keys.
- Unified search across names, abbreviations, aliases, tags, faculties, and Kolej.
- Functional All plus 14 canonical category filters driven by `data/campusCategories.ts`; categories without verified data show a safe empty state.
- One normalization function generates stable `category:id` keys, and only `verified: true` records enter the public shared collection.
- Category labels, icons, search terms, map colors, filter behavior, search result labels, map popups, and Nearby labels are centralized instead of using faculty/college conditionals.
- Near You includes one shared category selector, including safe empty results for categories that do not yet contain data.
- Client-only Leaflet map with separate faculty/Kolej marker styling, selected marker emphasis, focus animation, popup, and repeated-selection support.
- One-click selection from search results, map markers, faculty cards, Kolej cards, and Near You cards.
- Shared optional browser geolocation, a user marker, first-success map centring, refresh control, and nearest-place sorting.
- Mobile-first Near You section showing the five closest mapped places.
- Clearly labelled straight-line distances for ranking and fallback.
- Selected-place walking distance, ETA, and purple route polyline through the server-side walking-route proxy.
- In-memory and per-tab route caching with duplicate in-flight request suppression.
- Google Maps walking-navigation links for faculties, Kolej, and Near You cards.
- Faculty detail pages and sourced residential-college cards, including reserved photo and future impression-tag areas.
- Vitest regression coverage for shared selection state, normalized search, distance helpers, geolocation error mapping, and walking-route validation/caching.
- Accessible campus search combobox with listbox relationships, Arrow Up/Down navigation, Enter selection, Escape-to-close, pointer hover state, and click-to-reopen behaviour.
- Strict walking-route server parsing and handler tests covering valid conversion, invalid parameters, empty/malformed geometry, invalid metrics, provider errors, and network errors.
- Explicit search clearing, optional straight-line distance in search results after location is available, and a useful Near You location prompt instead of an empty section.
- A deterministic `pnpm typecheck` checkpoint command that bypasses stale incremental-cache crashes on Windows.

## Fixed bugs

- Fixed misleading distance copy that previously presented Haversine straight-line distance as travel distance.
- Fixed place selection sometimes requiring two clicks by replacing transient window events with `CampusExplorerProvider` state.
- Fixed repeated selection of the same place so a manually closed popup reopens on the next single click.
- Fixed selection/filter races by passing the complete normalized place through one shared selection path.
- Fixed missing map focus by tying `selectionVersion` directly to Leaflet `flyTo`.
- Fixed residential-college cards lacking navigation actions.
- Fixed misleading category buttons that opened empty map states despite having no data.
- Fixed three accidental patch-prefix characters left by an interrupted test-suite edit; they had made lint and compilation fail.
- Fixed the malformed-route test so every mocked fetch returns a fresh `Response`, matching real fetch behaviour.
- Replaced generic geolocation failure handling with distinct permission-denied, position-unavailable, timeout, and unsupported states and guidance.
- Fixed search results lacking complete keyboard and active-result semantics while preserving the existing one-click map focus path.
- Fixed the walking-route API accepting malformed or unsafe provider values before sending them to the browser.
- Fixed Near You disappearing before location permission was requested and added status-aware retry guidance.
- Fixed mobile category navigation without changing place selection: the map's existing status card now becomes a persistent, safe-area-aware `View all` action after a category preview, updates immediately on category switches, and clears when a specific place is selected or an overview opens.

## Known remaining bugs and risks

- No confirmed compile-time or production-build errors remain at this checkpoint.
- Accepted, denied, unavailable, and timeout location flows have not been verified on a real phone served over HTTPS.
- Walking routing depends on the public FOSSGIS OSRM service. Timeout or rate limiting falls back safely to straight-line distance, but no self-hosted routing backend exists.
- Component-level browser interaction is still manual; the automated suite currently targets pure state/data/routing helpers rather than rendered React/Leaflet interactions.

## Unfinished work

- Expand automated coverage to rendered search/location/map interactions.
- Verify all geolocation outcomes on HTTPS/mobile hardware; the status mapping and copy are now implemented and unit-tested.
- Add verified source-backed data for new categories; the category and interaction architecture is ready and should not be duplicated per category.
- Add a residential-college detail page or shared place-details panel.
- Replace older/unverified Kolej imagery as better official recent sources become available.
- Implement editable community impression tags only after deciding storage, moderation, privacy, and attribution rules.
- Verify the remaining real-device geolocation permission flows without storing precise coordinates.

## Exact recommended next task

Collect and verify the actual boarding coordinates for a second useful stop on each historical loop, then add them to `data/busTransit.ts`. Prefer a current official timetable with an effective date and clarified time meaning. Separately verify geolocation on a real HTTPS/mobile browser only when the user grants permission.

## Latest development checkpoint

- Last completed task: implemented the generic Bus V1 foundation, structured 11 stops/two loops/four reference schedules, mapped only Dahlia, integrated search/map/location/walking/navigation, and added a partial-data-safe mobile journey UI.
- Current unfinished task: 10 stop coordinates, current-service confirmation, stop-level timings, and ride durations remain unavailable and were not fabricated. Precise Bus journey recommendations remain intentionally disabled with only one mapped stop.
- Files involved in this checkpoint: `types/transit.ts`, `data/busTransit.ts`, `data/campusSearch.ts`, `utils/transit.ts`, `components/BusTransitSection.tsx`, `components/SearchBar.tsx`, `components/CampusMap.tsx`, explorer/category integration, tests, README, `BUS_DATA_STATUS.md`, and this file.
- Next exact step: add verified actual boarding coordinates for useful stops on both loops and re-run the full Bus journey flow.

## GitHub and deployment preparation

- Security audit: no `.env` files, API keys, access tokens, passwords, Supabase credentials, database credentials, or private routing keys were found.
- Environment variables required: none for the current version.
- `.gitignore` excludes dependencies, Next.js output, environment files, logs, coverage, Vercel local metadata, PEM files, and TypeScript build caches. `.env.example` is explicitly allowed.
- `README.md` now documents the actual features, pnpm workflow, data-accuracy policy, privacy model, routing dependency, and Vercel compatibility.
- Git: initialized locally on branch `main`; baseline commit `03cda78` is pushed and tracks `origin/main`.
- GitHub: connected at `https://github.com/leechunteck2007-max/unimas-survival-map`.
- Vercel: connected to GitHub; production URL is `https://unimas-survival-map.vercel.app`.
- Production deployment: passed on 2026-09-14 with Next.js automatically detected, default build settings, and no environment variables.
- Automatic deployment: verified when GitHub push `8ca0e14` produced a new Ready production deployment in Vercel.
- Production compatibility: no runtime localhost or Windows-path dependency found. Leaflet is client-only, geolocation is client-only and requires HTTPS, and routing is behind `/api/walking-route`.

## Technical debt

- `README.md` documents the current architecture and workflow; keep it synchronized as features and deployment requirements change.
- `CampusMap.tsx` and `CollegeDirectory.tsx` are approaching sizes where small presentational extractions would improve maintainability, but no broad refactor is currently justified.
- Client and server route validation now share one `WalkingRoute` shape and validator; provider-specific conversion remains isolated in `utils/osrm-walking-route.ts`.
- Rendered React/Leaflet/geolocation interaction tests are not automated yet.
- Rendered interaction coverage remains manual, although Git history now provides a stable baseline for diffs and recovery.

## Important architecture decisions

- `data/campusPlaces.ts` is the single normalization layer; features must consume `CampusPlace` instead of maintaining separate faculty/Kolej selection systems.
- `CampusExplorerProvider` owns category, query, selected place, and `selectionVersion`; transient `window` custom events must not be reintroduced.
- `UserLocationProvider` owns location for the whole client tree and keeps it in memory rather than persisting precise coordinates.
- Haversine distance is only for ranking or clearly labelled straight-line fallback. Walking distance and ETA are never inferred from it.
- `/api/walking-route` is the server-side boundary for the external foot-routing provider. Only a selected/detail destination is routed, with an 8-second timeout and client caching.
- Leaflet remains dynamically imported with SSR disabled because it depends on browser APIs.
- Campus facts and photos retain source URLs and caution notes; uncertainty must remain visible instead of being converted into unsupported claims.

## Verification at this checkpoint

- `pnpm lint`: passed on 2026-09-14.
- `pnpm typecheck`: passed on 2026-09-14 with incremental caching disabled.
- `pnpm test`: 8 files and 45 tests passed on 2026-09-14 after Bus V1.
- `pnpm build`: passed on 2026-09-14; generated 15 static/generated pages and the dynamic walking-route API.
- Bus V1 local browser check: passed. Dahlia global search showed distinct Kolej and Bus Stop results; selecting the Bus Stop focused its mapped marker and popup; the Bus destination search accepted FENG and rendered separate Walk/Bus cards.
- Bus V1 responsive check: passed at a 390-pixel requested viewport (375-pixel content viewport) without horizontal overflow. The destination search, Walk/Bus cards, Nearby Bus Stops, routes, and stop list remained usable.
- Bus V1 browser console check: zero new errors or warnings after a clean reload. A stale development-only hot-reload message from the temporary file replacement was excluded by timestamp and did not recur.
- Walking-route smoke test: passed with distance, ETA, and 87 geometry points for a UNIMAS sample route.
- Browser interaction checks: Faculty of Engineering and Kolej Cempaka opened on the first click; repeated Faculty of Engineering selection reopened its popup.
- Search keyboard interaction: Arrow Down selected the second result, Enter selected FMHS and opened its popup, Escape closed the list, and clicking the focused input reopened it.
- Browser check after this checkpoint: the homepage returned HTTP 200, search for Cempaka produced one correct result, the explicit Clear action restored all 20 mapped places, and the no-location Near You prompt rendered with its enable button.
- Responsive interaction check: passed at a 390 x 844 viewport. The 4-by-2 primary category grid, More panel, empty Food state, zero-marker map state, and one-click Cempaka search selection were verified.
- Browser console during the tested local and production flows: zero errors.
- Production HTTPS smoke test: homepage returned HTTP 200; FENG and Cempaka searches selected and focused the correct map markers on one click; the empty Food category remained stable; Google Maps navigation links were coordinate-targeted.
- Production route API smoke test: a campus route returned 2,380 metres, 32 minutes, and 87 geometry points through the server boundary.
- Production responsive checks: passed at 375, 390, and 430 pixel widths without horizontal overflow or oversized map/category controls.
- Production geolocation: not yet exercised because sharing the user's precise location requires explicit permission; the site remains fully usable without it.
- Local category-hint regression check: Fakulti and Kolej showed the correct first-click hint and second-click overview; switching categories replaced the hint; Food auto-dismissed after 2.8 seconds while remaining active; FENG search still focused its marker and popup in one click.
- Local category-hint mobile/console check: passed at 390 x 844 with a compact safe-area-aware toast and zero console errors or warnings.
- Production category-hint deployment: commit `9aef8a4` reached Vercel Production with Ready status on 2026-09-14.
- Production category-hint regression check: passed at 390 x 844. Fakulti previewed the map on the first click and opened its overview on the second; switching through Kolej to Food replaced the single hint; Food auto-dismissed while staying active; FENG search still opened the correct marker popup in one click; console errors and warnings remained at zero.
- Persistent category action local check: passed at 375, 390, and 430 pixel widths plus 1024-pixel desktop. The action remained visible inside the map viewport, used a 44-pixel tap target, showed verified counts, updated from Fakulti/Kolej to Food without stale context, opened the correct overview, and produced no horizontal overflow.
- Specific-place regression after the persistent action change: FENG search still opened the Faculty of Engineering marker popup in one click and did not show a category-browsing action.
- Persistent category action production check: commit `7e1a585` reached Vercel Production with Ready status. At 375 pixels, `View all Fakulti` remained visible inside the map, opened the full faculty overview, and cleared the prior search; a fresh FENG search still selected the place in one click, with zero console errors or warnings.

Do not run `pnpm typecheck` concurrently with `pnpm build`; Next.js can rebuild `.next/types` while TypeScript is reading it and produce a transient missing-generated-module error.

## Resume instructions

1. Read `AGENTS.md` and this file completely.
2. Check whether Git has since been initialized before assuming history exists.
3. Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` sequentially before and after substantive work.
4. Start with the exact recommended next task above.
5. Preserve the shared place, explorer, location, routing, and navigation architecture.
6. Update this file before ending the next development checkpoint.
