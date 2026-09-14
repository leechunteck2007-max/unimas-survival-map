<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Permanent project rules

## Scope and product integrity

- Keep the site mobile-first, accessible, and usable without geolocation.
- Do not present unverified campus facts, coordinates, capacities, facilities, or photos as confirmed. Preserve source links and uncertainty notes.
- Empty configured categories may appear in filters only with an explicit no-verified-data state. Never add unverified records merely to populate a category.
- Do not replace or remove working features unless the task explicitly requires it.

## Architecture

- Use `CampusPlace` and `data/campusPlaces.ts` as the shared model and normalization layer for all mapped places.
- Keep search, category, selected-place, and repeated-selection state in `CampusExplorerProvider`; do not reintroduce transient window custom events.
- Keep browser location in `UserLocationProvider`. The app must still work when permission is denied or geolocation is unavailable.
- Use Haversine distance only for clearly labelled straight-line sorting or fallback. Selected-place walking distance and ETA come through `/api/walking-route`.
- Request a walking route only for the selected/detail place. Preserve route caching and graceful straight-line fallback; do not route every visible marker.
- Keep Leaflet client-only through `CampusMapSection` unless a verified Next.js-supported replacement is deliberately introduced.

## Development workflow

- Use pnpm; do not mix package managers or regenerate the lockfile unnecessarily.
- Before changing Next.js APIs or conventions, read the relevant local guide in `node_modules/next/dist/docs/` as required above.
- Preserve user changes and inspect the current tree before editing. This directory may not have Git history.
- For a normal checkpoint, run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` sequentially. `pnpm typecheck` intentionally disables the incremental cache because a stale Windows `.tsbuildinfo` file can crash the Node process. Do not run the TypeScript check concurrently with `next build` because both touch generated `.next/types` files.
- Update `PROJECT_STATUS.md` at the end of a development checkpoint with verification results, remaining work, and one exact recommended next task.
