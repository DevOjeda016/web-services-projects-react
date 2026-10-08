# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Lattice Systems** is the corporate/commercial site for the software studio behind SpaceIA. Single public-facing marketing page — no auth, no admin/client portals. A small Express backend (`Backend/`) serves the built site and two endpoints (`/api/proyectos`, `/api/contacto`).

This is the **React port** of the original Angular site. Same design, same behaviour, **no Service Worker** (no offline caching of assets; the offline queue for the contact form lives in `localStorage` and is retried on the `online` event).

## Tech Stack

- **Framework:** React 19 + Vite + TypeScript
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`). Color/radius tokens are mapped in `src/styles.css` (`@theme inline`), equivalent to the shadcn/spartan preset the Angular version used.
- **Fonts:** self-hosted variable fonts via `@fontsource-variable/bricolage-grotesque` (display + body) and `@fontsource-variable/geist-mono` (labels, nav, data), imported in `src/styles.css`. No external `<link>`.
- **Icons:** `lucide-react` (pinned to 0.x: the 1.x line dropped brand icons such as `Linkedin`)
- **UI primitives:** `src/components/ui/` (`button`, `input`, `textarea`) — cva-based, same classes as the vendored spartan/ui components of the Angular version
- **Motion:** no animation library. Scroll reveals use the `Reveal` component (`src/shared/Reveal.tsx`, IntersectionObserver + safety-net timer so content never ships hidden in headless renders). The hero/contacto/projects background is a live canvas mesh (`src/shared/lattice.ts` engine + `LatticeCanvas.tsx`), the brand's namesake — pauses offscreen/hidden, static frame under `prefers-reduced-motion`.

## Architecture

Single-page site, no router:

```
src/
├── App.tsx / main.tsx
├── layouts/                  # PublicLayout, Navbar, Footer
├── features/home/            # Hero, Nosotros, Servicios, Proyectos, Proceso, Contacto (assembled in Home.tsx)
├── components/ui/            # Button, Input, Textarea
└── shared/                   # theme, useOnline, contactMessages, proyectos, Reveal, lattice engine
```

## Design tokens

**Light + dark, one brand family, single locked accent per mode.** Palette is the company navy/slate ramp (`--navy-900 #173046 … --slate-100 #c1ced9`, sampled from the logo). The accent is one "signal" that runs through the lattice, CTAs, active nav and key markers: **navy on light, ice-blue (`#c1ced9`) on dark**. No second accent anywhere.

Tokens live on `:root` (light, default) and `.dark` (dark) in `src/styles.css`. `.dark` is a plain class so any subtree can opt into dark tokens — the SpaceAI panel carries `class="dark"` to stay a permanent navy island in both modes. Theme is owned by `ThemeProvider` (`src/shared/theme.tsx`): initial value from `localStorage['ls-theme']` then `prefers-color-scheme`, toggled from the navbar; an inline script in `index.html` sets the class pre-boot to avoid FOUC.

## Commands

```bash
npm install
npm run dev              # Vite dev server at localhost:4200 (proxies /api -> localhost:3004)
npm run build            # type-check + production build into dist/
npm run preview
cd Backend && npm start  # Express on :3004, serves dist/ and the API
```

## Contact form

`Contacto` posts to `/api/contacto`. If the request fails with a network error the message is queued in `localStorage` (`lattice-contacto-cola`) and re-sent automatically when the connection returns (`src/shared/contactMessages.ts`).

## Deployment

`vercel.json` builds with `npm run build` and serves `dist/` with an SPA rewrite.
