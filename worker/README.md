# Spotify Now Playing Worker

This Worker exchanges a Spotify refresh token for an access token and returns a sanitized now-playing payload for the portfolio island.

## Setup

1. Install Wrangler (one-time):
   - `bunx wrangler --version`
2. Set Worker secrets:
   - `bunx wrangler secret put SPOTIFY_CLIENT_ID`
   - `bunx wrangler secret put SPOTIFY_CLIENT_SECRET`
   - `bunx wrangler secret put SPOTIFY_REFRESH_TOKEN`
3. Update `ALLOWED_ORIGIN` in `wrangler.toml`.
4. Deploy:
   - `bunx wrangler deploy`

## Response shape

```json
{
  "isPlaying": true,
  "trackName": "...",
  "artists": "...",
  "albumName": "...",
  "albumImageUrl": "...",
  "trackUrl": "https://open.spotify.com/track/...",
  "lastUpdated": "2026-02-19T10:00:00.000Z"
}
```

If nothing is currently playing, the Worker returns the most recent track with `isPlaying: false`.
