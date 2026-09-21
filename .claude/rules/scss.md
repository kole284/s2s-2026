---
paths:
  - "**/*.scss"
---

# SCSS rules

- Never use `@import`. Use `@use`.
- Tokens come from `src/styles/_variables.scss` (`$color-*`, `$font-*`, weights). Do not hard-code brand hex values.
- Breakpoints come from `src/styles/_mediaqueries.scss` and are interpolated strings: `@media #{$mobile} { ... }`.
- `vite.config.ts` injects `@use "@/styles/variables" as *;` and `@use "@/styles/mediaqueries" as *;` into every `.scss` file (`additionalData`). Do NOT add these `@use` lines to new files. A few older files (`Predavac`, `Prijava`, `Radionice`) repeat them; that is redundant but compiles, so only remove them when you are already editing that file.
- Other `@use` lines (`sass:math`, `sass:color`) are fine. Put them at the top of the file, as `@use` must come before other rules.
- Because of the injected header, line numbers in Sass error messages are shifted by a few lines.
- Class names are global. Prefix every class with its section (`team-`, `prijava-`, `navbar`) and use BEM-style `__element` / `--modifier` inside a section root. Never write bare element selectors like `h2 { }` or generic names like `.title`.
- Sections scale from the 1440px design using `--section-design-width` (for example `min(100vw, 140.625dvh)`) and `calc(var(--section-design-width) * N / 1440)`. Follow this pattern for section artwork and headings. Use `$section-heading-font-size` for section headings.
- The codebase uses `px` and design-width `calc()`, not `rem`. Stay consistent and do not introduce `rem`.
- Avoid new `!important`. Fix specificity instead.
- Do not grow `Prijava.scss` (~5600 lines). New form pieces get their own `.scss` next to their component.
- Fonts: `Jost` is declared in `index.scss`, `Figtree` comes from `@fontsource`. Do not add font CDNs.
