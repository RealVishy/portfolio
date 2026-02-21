# Repository Guidelines

## Project Structure & Module Organization
This repository is an Astro site.
- `src/pages/`: route-based pages (for example, `src/pages/index.astro`).
- `src/layouts/`: shared page shells such as `Layout.astro`.
- `src/components/`: reusable UI pieces.
- `src/assets/`: source assets imported by Astro components.
- `public/`: static files served as-is (favicons, images, downloadable files).
- Root config: `astro.config.mjs`, `tsconfig.json`, and `package.json`.

Keep feature code close together: page in `src/pages/`, supporting component in `src/components/`, and related media in `src/assets/`.

## Build, Test, and Development Commands
- `bun run dev`: start local dev server with hot reload.
- `bun run build`: create a production build in `dist/`.
- `bun run preview`: serve the production build locally.
- `bun run astro -- check`: run Astro diagnostics/type checks.

Run `bun run build` before opening a PR to catch compile-time issues.

## Coding Style & Naming Conventions
- Use 2-space indentation in `.astro`, JS/TS, and config files.
- Prefer clear, small components over large monolithic pages.
- Component and layout files: PascalCase (e.g., `HeroCard.astro`).
- Route files: lowercase and path-oriented (e.g., `about.astro`).
- Keep CSS scoped inside components when practical; extract only when reuse is clear.

No formatter/linter is currently configured; keep style consistent with existing files.

## Testing Guidelines
There is no dedicated test framework configured yet. For now:
- Treat `bun run build` and `bun run astro -- check` as required validation.
- Manually verify key pages in `bun run dev` and `bun run preview`.

If you add tests, place them near the feature (`Component.test.ts`) or under a top-level `tests/` directory.

## Commit & Pull Request Guidelines
Current history is minimal (`Initial commit`), so use a simple convention:
- Use Conventional Commits for commit messages (e.g., `feat: add responsive hero tiles`, `fix: tighten Spotify origin checks`).
- Keep commits focused and logically grouped.

For pull requests, include:
- What changed and why.
- Screenshots/GIFs for UI updates.
- Manual verification steps (commands run, pages checked).
- Linked issue/ticket when available.
