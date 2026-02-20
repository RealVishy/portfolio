# Vishwas Portfolio

Astro portfolio site with a bento-style layout and small interactive islands.

## Commands

- `bun install`: install dependencies.
- `bun run dev`: start local development server.
- `bun run build`: build production assets into `dist/`.
- `bun run preview`: preview the production build.
- `bun run astro -- check`: run Astro diagnostics and type checks.

## Structure

- `src/pages/index.astro`: main page layout and tile markup.
- `src/components/`: interactive controllers (time, terminal, spotify, etc.).
- `src/layouts/Layout.astro`: page shell and global metadata.
- `functions/api/spotify-now-playing.ts`: Cloudflare Pages Function for Spotify data.
- `public/`: static assets.

## Spotify Now Playing

The Spotify tile fetches from a same-origin endpoint:

- `GET /api/spotify-now-playing`

This endpoint is implemented in `functions/api/spotify-now-playing.ts` and runs on Cloudflare Pages Functions.

Set these **Cloudflare Pages** production secrets:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`

Optional:

- `ALLOWED_ORIGIN` (comma-separated allowlist, defaults to permissive behavior)

No public frontend env var is required for Spotify anymore.
