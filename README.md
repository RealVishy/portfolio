# Astro Starter Kit: Basics

```sh
bun create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Installs dependencies                            |
| `bun dev`             | Starts local dev server at `localhost:4321`      |
| `bun build`           | Build your production site to `./dist/`          |
| `bun preview`         | Preview your build locally, before deploying     |
| `bun astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Spotify Now Playing Tile

This portfolio includes a Spotify now-playing Astro island that polls a Cloudflare Worker endpoint.

### Frontend env

Copy `.env.example` to `.env` and set:

```sh
PUBLIC_SPOTIFY_NOW_PLAYING_URL="https://spotify-now-playing.<your-subdomain>.workers.dev"
```

### Worker

Worker source is in `worker/`.

1. Set Worker secrets:
   - `bunx wrangler secret put SPOTIFY_CLIENT_ID`
   - `bunx wrangler secret put SPOTIFY_CLIENT_SECRET`
   - `bunx wrangler secret put SPOTIFY_REFRESH_TOKEN`
2. Set `ALLOWED_ORIGIN` in `worker/wrangler.toml`.
3. Deploy:
   - `bunx wrangler deploy`

## CI Deploys (GitHub Actions)

This repo includes CI-controlled deploy workflows:

- `.github/workflows/deploy-pages.yml` deploys Astro `dist/` to Cloudflare Pages on PRs and `main`.
- `.github/workflows/deploy-worker.yml` deploys the Spotify Worker on `main` when `worker/**` changes.

Configure these repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Configure this repository variable:

- `CLOUDFLARE_PAGES_PROJECT_NAME` (exact Cloudflare Pages project name)
