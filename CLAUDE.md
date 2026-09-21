# S2S 2026 - frontend

Landing site and registration form ("prijava") for the S2S 2026 event. React 19, TypeScript, Vite, Sass.
The backend is a separate repo (`s2s-email-backend`, Supabase Edge Functions).

## Commands
- `npm run dev` - dev server
- `npm run check` - lint + typecheck + production build. Run before finishing any task.
- `npm run lint` / `npm run typecheck` / `npm run build` / `npm run preview`
- There is no test runner. Do not claim tests passed. Verify with `npm run check` and say what to check manually in the browser.

## Stack notes
- Routing: react-router-dom v7 with `HashRouter`. Section paths live in `src/routes/sectionRoutes.ts`; `Main` scrolls to the matching section.
- Path alias: `@/` points to `src/`.
- Styling: plain Sass files next to each component, imported in the TSX (`import './X.scss'`). These are NOT CSS Modules, so class names are global. `vite.config.ts` injects `@use "@/styles/variables" as *;` and `@use "@/styles/mediaqueries" as *;` into every `.scss` file, so tokens and breakpoints are available everywhere without importing.
- TypeScript: `strict`, plus `noUnusedLocals` and `noUnusedParameters`, so unused imports or variables fail `npm run check`. `lib` is ES2022, so ES2023+ APIs (`toSorted`, `Object.groupBy`) do not typecheck.
- ESLint: flat config with typescript-eslint recommended, `react-hooks` recommended, and `react-refresh` (warns when a component file also exports non-components).
- `public/igrica/` is a standalone static page (the game) served at `/igrica/`; `vite.config.ts` has a dev middleware for it. It is not part of the React app.
- No Supabase client library here. The form sends `fetch` POST requests to the `submit-application` Edge Function (see `.claude/rules/api-contract.md`).

## Structure
- `src/components/sections/<kebab-name>/<PascalName>.tsx` + `.scss` - page sections (naslovna, o-projektu, radionice, panel, agenda, pitanja, partneri, tim, predavac, prijava)
- `src/components/shared/` - navbar, footer
- `src/components/-layout/Layout.tsx` - Navbar + Outlet
- `src/components/Example/` - reference for TSX + SCSS conventions; copy this pattern for new components
- `src/pages/home/Home.tsx` - composes all sections for the main page; `src/pages/main/Main.tsx` - wraps Home and scrolls to the section matching the route
- `src/data/workshops.ts` (WORKSHOPS list)
- `src/styles/_variables.scss`, `_mediaqueries.scss` - design tokens and breakpoints
- Config at repo root: `vite.config.ts`, `tsconfig.app.json` (src), `tsconfig.node.json` (vite.config.ts), `eslint.config.js`
- `src/assets/` - SVG/PNG artwork

## Working in this repo
- `Prijava.tsx` (~2000 lines) and `Prijava.scss` (~5600 lines) are huge. Never read them whole. Grep for the function or class, then read only that range. Put new logic in new files instead of growing them.
- Many SVGs in `src/assets/` are 100KB to 1MB of path data. Do not open them unless the task requires it.
- Do not read or edit `public/igrica/` unless the task is about the game.
- Keep changes inside the section being edited. Do not reformat unrelated code (quote style is mixed across files).
- Ask before adding a dependency.
- User-facing copy is Serbian (Latin script). Keep the existing tone and do not translate it.
- Match the naming already used in the folder you are editing (section names and form state are Serbian).

## Hard rules
- Every `VITE_*` variable ends up public in the built bundle. Only the Supabase URL and the publishable key belong there. Never add a secret key.
- Never read or edit `.env*` files. Ask the user for variable names or values instead.
- The registration payload must match the backend contract. If a form field, workshop `shortName`, or option list changes, tell the user the backend function needs the same change.
