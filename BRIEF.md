# NYC in Motion (2020-2024)

Create a Spotify Wrapped-inspired interactive experience that transforms years of MTA ridership data into an engaging story about how New York City moved, changed, and recovered between 2020 and 2024. The experience should highlight major trends, recovery milestones, commuting patterns, station rankings, payment method shifts, and surprising facts through a fun, shareable, and visually immersive journey. The goal is to make complex transportation data approachable, memorable, and entertaining while encouraging exploration. The dataset includes hourly ridership data by station, borough, transit mode, and payment method.

## Technology
– Front-end framework: React 19
– TypeScript
– Vite as the build tool/dev server
– Data visualization library: Recharts
– API-driven data source: fetched client-side directly from the NY Open Data Socrata API on page load (no backend server)
– Responsive web experience optimized for desktop and mobile
–Hosting via Vercel (not yet deployed/configured; currently runs via `npm run dev` locally)

## Data
Use MTA Subway Hourly Ridership: 2020-2024 API which includes hourly ridership estimates by station complex, borough, transit mode, and payment method. Potential insights include ridership recovery over time, busiest stations, peak travel hours, borough trends, weekday versus weekend patterns, and the transition from MetroCard to OMNY. All figures shown are fetched live from the API on load; no mock or placeholder data is used. Note: the live dataset only reports `omny` and `metrocard` payment methods — a separate single-ride fare category is not collected, so the payment breakdown only compares those two methods.

## Layout
The experience should feel like a guided story rather than a traditional dashboard. Users move through a series of full-screen sections that reveal:
– NYC ridership at a glance
– The pandemic impact and recovery
– How commuting habits changed
– Borough comparisons
– Station superlatives and rankings, with tabs to switch between the all-time total and each individual year (2020-2024)
– MetroCard vs. OMNY evolution
– Fun facts and surprising insights, combined with a closing "NYC Wrapped" recap into a single takeaways section
– A footer crediting the Metropolitan Transportation Authority as the data source, linking to the NY Open Data dataset (opens in a new tab)

## Design
– Inspired by Spotify Wrapped, Apple Replay, and Year in Search
– Bold typography and high-impact statistics
– Dark mode with vibrant accent colors, smooth, blended gradients.
– Motion and storytelling first
– Data visualizations designed for clarity and delight
– Social-sharing aesthetic with card-based summaries

## Interactions
– Scroll-driven storytelling, with each section fading and sliding into view as it enters the viewport
– Animated transitions and counters
– Interactive timelines
– Hover/tap exploration of stations and boroughs
– Dynamic ranking cards with year-by-year filtering
– Expandable insights and fun facts
– Inline info icons that reveal methodology/caveat notes for each chart on hover
– Shareable summary cards
– Smooth hover states

## Nice to Haves
– Interactive subway map
– Personalized "Transit Persona" generator (Night Owl, Weekend Wanderer, Rush Hour Warrior, etc.)
– AI-generated recap summaries
– Lo-fi effects or ambient subway audio
– Year-to-year comparison mode