# UNIMAS Survival Map

A mobile-first campus utility for Universiti Malaysia Sarawak (UNIMAS) students.

## About

UNIMAS Survival Map helps students find verified campus places, explore them on an interactive map, estimate distance, and open walking navigation. The project is under active development and currently focuses on a reliable Fakulti and Kolej experience.

## Current features

- Interactive Leaflet and OpenStreetMap campus map
- 10 sourced Fakulti locations and detail pages
- 10 sourced Kolej locations and information cards
- Shared search across names, abbreviations, aliases, tags, and categories
- One-click place selection and map focus
- Optional browser geolocation without permanent location storage
- Near You ranking with clearly labelled straight-line distance
- Selected-place walking route and ETA through a server-side routing endpoint
- Google Maps walking-navigation links
- Mobile-friendly selector for 14 campus categories
- Safe empty states for categories that do not yet have verified place data

Food, bus stops, study places, printing, stores, ATMs, toilets, parking, health, sports, prayer facilities, and administration are configured as categories but do not yet contain published place records.

## Tech stack

- Next.js 16 and React 19
- TypeScript
- Tailwind CSS 4
- Leaflet and React Leaflet
- OpenStreetMap map tiles
- FOSSGIS OSRM walking-route service
- Vitest
- pnpm

## Development

Install dependencies:

```bash
pnpm install
```

Start the local development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Run the complete quality checkpoint sequentially:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Do not run `pnpm typecheck` and `pnpm build` at the same time because both use Next.js generated type files.

## Environment variables

The current version does not require environment variables or private API keys. The walking-route provider is called from the server-side `/api/walking-route` endpoint.

If private credentials are added later, keep real values in `.env.local`, document variable names only in `.env.example`, and never commit the real environment file. Variables beginning with `NEXT_PUBLIC_` are visible in browser code and must not contain secrets.

## Data accuracy

Campus information can change. Existing place records retain source links and uncertainty notes where appropriate. New public records should include a reliable source, reviewed coordinates, and `verified: true`. Always confirm important operational information with UNIMAS.

## Routing and privacy

- Browser location is optional and kept only in the current browser session.
- Nearby cards use straight-line distance and label it accordingly.
- A selected destination requests a walking route through the app's server endpoint.
- If routing is unavailable, the interface falls back to a clearly labelled straight-line estimate.
- Routing availability depends on a public third-party service and is not guaranteed.

## Deployment

The project is designed for a standard Vercel deployment connected to GitHub. No custom build command or production environment variables are currently required. HTTPS deployment enables real-device geolocation testing.

## Project status

The project is actively developed. See [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) for completed work, verification results, current risks, and the next recommended task.
