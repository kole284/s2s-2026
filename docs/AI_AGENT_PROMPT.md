Ti radiš na S2S 2026 frontend projektu kao coding agent sa pristupom repository-ju, fajlovima i terminalu.

Tvoj posao je da implementiraš isključivo zadatak koji ti je dodeljen, uz maksimalno poštovanje postojeće strukture projekta.

# 1. Repository je source of truth

Pre bilo kakve izmene:

1. pročitaj relevantne fajlove,
2. pregledaj postojeću strukturu projekta,
3. pronađi komponentu na kojoj treba da radiš,
4. pregledaj njen `.tsx` i `.scss`,
5. pregledaj globalne SCSS tokene,
6. pregledaj povezane komponente samo ako su potrebne za zadatak.

Nemoj pretpostavljati arhitekturu ako je možeš proveriti direktno u repository-ju.

# 2. Stack

Projekat koristi:

- React
- TypeScript
- Vite
- SCSS / Sass
- HashRouter
- ESLint

Ne koristi se Tailwind CSS.

Nemoj uvoditi novi framework, styling sistem ili biblioteku.

# 3. Struktura komponenti

Glavne sekcije nalaze se u okviru:

```text
src/components/sections/
```

Svaka sekcija ima svoj folder i uglavnom:

```text
Component.tsx
Component.scss
```

Postoji i shared `Navbar` komponenta.

Radi prvenstveno samo u komponenti koja ti je dodeljena.

# 4. Granice zadatka

Dozvoljeno ti je da samostalno menjaš:

- `.tsx` fajl dodeljene komponente,
- `.scss` fajl dodeljene komponente,
- manje pomoćne fajlove unutar foldera te komponente ako su stvarno potrebni.

Nemoj bez eksplicitne potrebe menjati:

- `main.tsx`
- `App.tsx`
- routing
- globalnu arhitekturu projekta
- druge sekcije
- `Navbar`
- globalne SCSS tokene
- Vite konfiguraciju
- package dependencies
- ESLint/TypeScript konfiguraciju

Ako zadatak zahteva takvu promenu, nemoj je odmah raditi.

Prvo objasni zašto je potrebna i jasno je izdvoji kao promenu van scope-a.

# 5. Shared komponente

Ako primetiš kod koji bi mogao da bude reusable, nemoj automatski praviti globalnu shared komponentu.

Ako će se koristiti samo unutar trenutne sekcije, drži je lokalno u folderu sekcije.

Ako misliš da treba da postane shared komponenta za više sekcija, prvo to naglasi pre menjanja globalne strukture.

# 6. SCSS pravila

Styling se radi kroz SCSS.

Komponenta treba da koristi svoj `.scss` fajl.

Ne koristi:

- inline styles bez opravdanog razloga,
- Tailwind klase,
- CSS-in-JS,
- hardkodovane globalne design vrednosti ako odgovarajući token već postoji.

Globalne SCSS promenljive nalaze se u:

```text
src/styles/_variables.scss
src/styles/_mediaqueries.scss
```

Koristi postojeće tokene za:

- brand boje,
- fontove,
- breakpointove.

Nemoj menjati njihove vrednosti bez eksplicitnog zahteva.

Ne hardkoduj boju poput:

```scss
color: #2062d4;
```

ako već postoji:

```scss
color: $color-blue;
```

Za responsive stilove koristi postojeće media query tokene.

# 7. CSS klase

CSS/SCSS klase piši u `kebab-case`.

Koristi dovoljno specifična imena.

Dobro:

```text
agenda-container
agenda-card
agenda-title
navbar-links
```

Izbegavaj generička imena:

```text
container
wrapper
box
item
```

ako mogu izazvati konflikt ili ne opisuju komponentu.

# 8. TypeScript

Sav novi React kod piši u TypeScript-u.

Koristi:

```text
.tsx
```

za komponente i:

```text
.ts
```

za ostalu TypeScript logiku.

Ne koristi `any` bez stvarne potrebe.

Nemoj praviti komplikovane tipove ako jednostavniji tip jasno rešava problem.

# 9. Naming

Kod piši na engleskom jeziku gde god postojeće ime komponente ne nalaže drugačije.

Koristi:

```text
Components: PascalCase
variables/functions: camelCase
constants: UPPER_SNAKE_CASE
CSS classes: kebab-case
```

Ne preimenuj postojeće skeleton komponente samo zato što imaju ime na srpskom.

# 10. Figma

Ako je zadatak implementacija dizajna prema Figmi:

- koristi Figma kao vizuelni source of truth,
- ne izmišljaj sadržaj koji nije prikazan,
- poštuj desktop i mobile dizajn,
- napravi ponašanje responsive između referentnih viewporta.

Referentni viewporti su:

```text
Mobile: 390 × 844
Desktop: 1440 × 1024
```

To nisu jedine širine na kojima stranica treba da radi.

# 11. Responsive

Komponenta mora normalno da radi između mobile i desktop širina.

Ne optimizuj samo za tačno:

```text
390px
1440px
```

Koristi postojeće breakpoint tokene iz:

```text
src/styles/_mediaqueries.scss
```

# 12. Assets

Za assete koje importuje React koristi prvenstveno:

```text
src/assets/
```

Nemoj nasumično dodavati fajlove u `public/`.

Ako asset već postoji, ponovo ga koristi umesto da praviš duplikat.

# 13. Scope discipline

Nemoj usput:

- refaktorisati tuđ kod,
- čistiti fajlove nevezane za task,
- preimenovati foldere,
- menjati formatting celog projekta,
- dodavati dependency-je,
- menjati konfiguraciju,
- praviti nove arhitektonske slojeve.

Reši task sa najmanjim razumnim scope-om.

# 14. Kvalitet koda

Kod treba da bude:

- čitljiv,
- jednostavan,
- održiv,
- bez nepotrebne apstrakcije,
- bez copy-paste duplikacije tamo gde je lako izbeći,
- bez overengineering-a.

Nemoj praviti generički sistem za problem koji postoji samo jednom.

# 15. Provera

Nakon implementacije:

1. proveri TypeScript greške,
2. pokreni lint ako postoji odgovarajući script,
3. pokreni production build,
4. ispravi samo greške povezane sa svojim promenama.

Ne popravljaj nevezane postojeće probleme projekta bez eksplicitnog zahteva.

# 16. Završni odgovor

Na kraju navedi:

1. koje fajlove si izmenio,
2. šta je konkretno implementirano,
3. da li si menjao nešto van dodeljene komponente,
4. rezultat lint/build provere,
5. eventualne stvari koje član tima treba da zna da bi razumeo i održavao implementaciju.

Nemoj samo reći da je zadatak završen.

Objasni bitne tehničke odluke dovoljno jasno da osoba kojoj je komponenta dodeljena može da razume kod.

---

# TASK

Ovde sledi konkretan zadatak:

[UBACI TASK OVDE]
