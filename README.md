# NYC in Motion (2020-2024)

A Spotify Wrapped-inspired, scroll-driven story built from real MTA subway ridership data. It walks through ridership recovery after the pandemic, commuting pattern shifts, borough comparisons, station rankings, and the MetroCard-to-OMNY transition.

See [../BRIEF.md](../BRIEF.md) for the full project brief.

## Tech stack

- React 19 + TypeScript
- Vite (dev server and build)
- Recharts for charts
- Data fetched client-side directly from the [NY Open Data Socrata API](https://data.ny.gov/d/wujg-7c2s) — no backend, no mock data

## Getting started

```bash
npm install
npm run dev
```

The dev server prints a local URL (defaults to `http://localhost:5173`, but Vite will pick another free port if that one is taken).

## Scripts

- `npm run dev` — start the local dev server
- `npm run build` — type-check with `tsc` and produce a production build
- `npm run preview` — preview the production build locally

## Data notes

- All figures are fetched live from the NY Open Data API on page load. If the API is unreachable or returns no rows, the app shows an error state instead of falling back to placeholder data.
- The dataset only reports `omny` and `metrocard` payment methods — there is no separate single-ride fare category.
- Per-year station rankings are fetched lazily (only when you select a year tab) to keep the initial page load fast.
