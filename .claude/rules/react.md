---
paths:
  - "src/**/*.{ts,tsx}"
---

# React and TypeScript rules

- Function components written as `const Name = () => { ... }` with `export default Name`, as in `components/Example/Example.tsx`.
- Import through the `@/` alias for anything outside the current folder. Relative imports only for siblings.
- No `any`. Put shared types in a `types.ts` next to the section (see `sections/prijava/types.ts`).
- Clean up effects: cancel animation frames, remove listeners and timers (see `pages/main/Main.tsx`).
- Fix lint errors at the cause. Do not add `eslint-disable` to silence `react-hooks` rules. The installed `react-hooks` v7 preset can also flag things like setting state synchronously inside an effect or touching refs during render; if lint reports that, restructure the code.
- Component files export only components (`react-refresh/only-export-components` warns otherwise). Put constants, types, and helpers in a sibling file such as `types.ts`.
- Unused imports, variables, and parameters are compile errors (`noUnusedLocals`, `noUnusedParameters`). Delete them; prefix an intentionally unused parameter with `_`.
- Use `import type` (or inline `type`) for type-only imports. `isolatedModules` is on.
- `lib` is ES2022. Avoid ES2023+ APIs such as `toSorted`, `toReversed`, `findLast` on arrays, and `Object.groupBy`.
- Async actions need explicit states (`idle | submitting | error`) and must guard against double submit, like `posaljiPrijavu` does.
- Do not use `useEffect` to compute derived values. Compute them during render.
- When a component grows past ~200 lines, extract a sibling component into the section's `components/` folder (see `prijava/components/CustomSelect.tsx`) or a hook file.
- Custom controls (selects, dropdowns) must be keyboard accessible and expose correct ARIA roles. Images need meaningful `alt`, decorative ones `alt=""`.
- Assets are imported from `@/assets/...` so Vite fingerprints them. No hard-coded asset URLs.
- Do not touch `HashRouter` or route paths without checking `src/routes/sectionRoutes.ts` and `Navbar.tsx`.
