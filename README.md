# Vishwas Portfolio

Personal portfolio site built with Astro, using small Preact islands for live widgets and a Cloudflare Pages Function for Spotify data.

## Highlights

- Bento-style homepage with:
  - Hero, social links, and profile image
  - Engineering snapshot with core stack chips
  - Current conditions panel (Sydney clock + weather)
  - Spotify now playing card
  - Animated terminal-style command tile
- Live Sydney conditions powered by Open-Meteo:
  - Temperature and weather icon
  - Feels-like temperature, humidity, and wind speed
  - "Updated just now / Xm ago" freshness indicator
- Motion and interaction:
  - Staggered tile intro animation
  - Subtle 3D hover tilt on large pointer-based screens
  - Typewriter terminal command loop
  - `prefers-reduced-motion` safeguards

## Commands

- `bun install`: install dependencies.
- `bun run dev`: start local development server.
- `bun run build`: build production assets into `dist/`.
- `bun run preview`: preview the production build.
- `bun run astro -- check`: run Astro diagnostics and type checks.

## Project Structure

- `src/pages/index.astro`: homepage markup, layout grid, and inline UI behavior.
- `src/components/CurrentConditionsController.tsx`: Sydney time/weather fetch + live DOM updates.
- `src/components/SpotifyNowPlayingController.tsx`: Spotify polling and animated UI state transitions.
- `src/layouts/Layout.astro`: global shell, metadata, typography, and color tokens.
- `functions/api/spotify-now-playing.ts`: Cloudflare Pages Function backing the Spotify tile.
- `public/`: static assets.

## Spotify API Endpoint

- Route: `GET /api/spotify-now-playing`
- Runtime: Cloudflare Pages Functions
- Behavior:
  - Returns currently playing track when available.
  - Falls back to the most recently played track.
  - Returns a friendly idle payload when no recent track exists.
- Response shape:
  - `isPlaying`
  - `trackName`
  - `artists`
  - `albumName`
  - `albumImageUrl`
  - `trackUrl`
  - `lastUpdated`

### Required Cloudflare Pages Secrets

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`

Optional:

- `ALLOWED_ORIGIN` (comma-separated allowlist; defaults to permissive behavior)

No public frontend environment variables are required.
