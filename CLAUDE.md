# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start dev server (localhost:8080)
- `npm run build` — Production build
- `npm run lint` — ESLint on all files
- `npm run test` — Run Vitest (single run)
- `npm run test:watch` — Vitest in watch mode
- Run a single test file: `npx vitest run src/path/to/file.test.ts`

## Tech Stack

React 18 + TypeScript + Vite (SWC) with Tailwind CSS and shadcn/ui components. Fabric.js for canvas-based card editing. React Router v6 for routing, TanStack React Query for server state, React Hook Form + Zod for forms.

## Architecture

**Routing** (defined in `src/App.tsx`):
- `/` — Explore gallery (masonry grid of cards)
- `/inbox` — Received cards
- `/dashboard` — User's created cards
- `/card/:id` — Card detail viewer
- `/designer/:id` — Canvas-based card editor (Fabric.js)

**Key directories:**
- `src/pages/` — Route-level page components, each renders with `BottomNav`
- `src/components/ui/` — shadcn/ui primitives (50+ components, managed via shadcn CLI)
- `src/components/` — App-specific components (`CardTile`, `MasonryGrid`, `BottomNav`)
- `src/data/mockCards.ts` — Mock card data and `CardData` interface
- `src/hooks/` — Custom hooks (`use-toast`, `use-mobile`)
- `src/lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)

**Canvas editor** (`CardDesigner.tsx`): Uses Fabric.js with ref-based canvas management. Supports adding shapes, text, images with color palette and object manipulation.

## Styling

- Tailwind CSS with HSL CSS custom properties for theming (defined in `src/index.css`)
- Dark mode via class-based toggling
- Custom font: Nunito (loaded from Google Fonts)
- Path alias: `@/*` maps to `src/*`
- Mobile-first with safe area inset support

## Testing

- Vitest with jsdom environment, `@testing-library/react` and `@testing-library/jest-dom`
- Test files: `src/**/*.{test,spec}.{ts,tsx}`
- Setup file with `window.matchMedia` mock: `src/test/setup.ts`

## TypeScript

Lenient config: `noImplicitAny: false`, `strictNullChecks: false`, `skipLibCheck: true`.
