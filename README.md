# S2S 2026 Frontend


## Dizajn

Figma dizajn:

[S2S 2026 Figma dizajn](https://www.figma.com/design/X0ZjGNSIdEIR0dKrJQLrjC/S2S-2026--Copy-?node-id=0-1)

## Pokretanje projekta

Repository URL iz lokalnog `git remote` podešavanja:

```bash
git clone https://github.com/kole284/s2s-2026.git
cd s2s-2026
npm install
npm run dev
```

Ako koristiš VS Code, opciono možeš otvoriti projekat komandom:

```bash
code .
```

```bash
npm run dev
```
Pokreće Vite development server.

## Struktura projekta

Relevantna trenutna struktura:

```text
s2s-2026/
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── App.scss
    ├── App.tsx
    ├── index.scss
    ├── main.tsx
    ├── vite-env.d.ts
    ├── assets/
    ├── components/
    │   ├── Test.tsx
    │   ├── -layout/
    │   │   └── Layout.tsx
    │   ├── sections/
    │   │   ├── agenda/
    │   │   │   ├── Agenda.scss
    │   │   │   └── Agenda.tsx
    │   │   ├── naslovna/
    │   │   │   ├── Naslovna.scss
    │   │   │   └── Naslovna.tsx
    │   │   ├── o-projektu/
    │   │   │   ├── OProjektu.scss
    │   │   │   └── OProjektu.tsx
    │   │   ├── panel/
    │   │   │   ├── Panel.scss
    │   │   │   └── Panel.tsx
    │   │   ├── partneri/
    │   │   │   ├── Partneri.scss
    │   │   │   └── Partneri.tsx
    │   │   ├── pitanja/
    │   │   │   ├── Pitanja.scss
    │   │   │   └── Pitanja.tsx
    │   │   ├── predavac/
    │   │   │   ├── Predavac.scss
    │   │   │   └── Predavac.tsx
    │   │   ├── prijava/
    │   │   │   ├── Prijava.scss
    │   │   │   └── Prijava.tsx
    │   │   ├── radionice/
    │   │   │   ├── Radionice.scss
    │   │   │   └── Radionice.tsx
    │   │   └── tim/
    │   │       ├── Tim.scss
    │   │       └── Tim.tsx
    │   └── shared/
    │       └── navbar/
    │           ├── Navbar.scss
    │           └── Navbar.tsx
    ├── pages/
    │   └── main/
    │       └── Main.tsx
    ├── styles/
    │   ├── _mediaqueries.scss
    │   └── _variables.scss
    ├── types/
    └── utils/
```

Napomene:

- `src/pages/` sadrži page komponente. Trenutno postoji `Main.tsx`.
- `src/components/sections/` sadrži glavne sekcije sajta.
- `src/components/shared/` sadrži reusable/shared komponente. 
- `src/styles/` sadrži globalne SCSS tokene.
- `src/assets/` će da sadrži slike organizacionog tima (ko radi ovo nek napravi folder) i sve potrebne assete svg-eve.
## Git i GitHub workflow

Glavne grane su:

```text
main
development
```

`main` predstavlja stabilnu/finalnu verziju.

Ne raditi direktne commitove na:

```text
main
development
```

Razvoj se radi preko zasebnih feature ili bugfix grana. Pull Request ide ka `development`, ne direktno ka `main`.

### Kreiranje feature grane

Pre početka zadatka:

```bash
git switch development
git pull origin development
git switch -c agenda
```

Ako si već na ažuriranoj `development` grani, možeš samo:

```bash
git switch -c navbar
```

Naziv feature grane treba da bude jednostavan i da odgovara komponenti ili zadatku.

Primeri:

```text
agenda
navbar
partneri
prijava
```

`git checkout` može da se koristi kao alternativa ako lokalna Git verzija ne podržava `git switch`, ali preferiramo `git switch`.

### Sinhronizacija sa development granom

Pre nego što push-uješ granu i otvoriš Pull Request, proveri da li je `development` dobio nove promene.

```bash
git switch development
git pull origin development
git switch agenda
git merge development
```

Ako postoje konflikti:

1. reši konflikte u fajlovima,
2. proveri da projekat radi,
3. commituj merge/conflict resolution ako Git to traži.

Zatim:

```bash
git push origin agenda
```

### Pull Request

Pull Request treba da bude:

```text
base: development
compare: tvoja feature/bugfix grana
```

Ne pravimo Pull Request direktno ka `main`.

Pre Pull Request-a proveri:

```bash
npm run check
```

## Rad na komponentama

Glavne S2S 2026 sekcije su već pripremljene u skeletonu:

- Naslovna
- O projektu
- Radionice
- Predavac
- Panel
- Agenda
- Pitanja
- Partneri
- Tim
- Prijava

Pored njih postoji i shared komponenta:

- Navbar

Obrazac za glavne sekcije:

```text
src/components/sections/<naziv-sekcije>/<Komponenta>.tsx
src/components/sections/<naziv-sekcije>/<Komponenta>.scss
```

Primer:

```text
src/components/sections/agenda/Agenda.tsx
src/components/sections/agenda/Agenda.scss
```

Za svoju sekciju prvenstveno menjaš samo:

```text
Component.tsx
Component.scss
```

u folderu te sekcije.

Cilj skeletona je da su folderi i fajlovi za sekcije unapred pripremljeni. Ako radiš npr. Agendu, ne treba da praviš novu `Agenda` komponentu na drugom mestu, nego implementiraš postojeće fajlove:

```text
src/components/sections/agenda/Agenda.tsx
src/components/sections/agenda/Agenda.scss
```


### Test komponenta

`src/components/Test.tsx` služi samo za proveru da React/Vite setup radi.

Važno:

- nije deo finalnog dizajna,
- nije stvarna sekcija sajta,
- ne koristi se kao mesto za implementaciju tvoje sekcije.

### Example komponenta

[`src/components/Example/`](src/components/Example/) služi samo kao mala referenca za strukturu React komponente i SCSS konvencije u ovom projektu. Ne renderuje se u finalnoj aplikaciji.

## Naming konvencije

Kod treba da bude na engleskom gde god je praktično:

- nazivi varijabli,
- funkcije,
- helper funkcije,
- konstante,
- CSS/SCSS klase.

Poštuj postojeće nazive komponenti i fajlova iz skeletona, čak i kada su na srpskom.

Konvencije:

```text
React components: PascalCase
functions/variables: camelCase
constants: UPPER_SNAKE_CASE
CSS/SCSS classes: kebab-case
SCSS file: isti naziv kao komponenta
```

Primer:

```tsx
const Agenda = () => {
  const activeItem = 0;

  return <section className="agenda-container"></section>;
};
```

```scss
.agenda-container {}
.agenda-card {}
```

Izbegavaj generičke klase ako postoji mogućnost konflikta:

```text
.container
.wrapper
.box
```

Preferiraj specifične klase:

```text
.agenda-container
.navbar-wrapper
.workshops-card
```

## TypeScript

Sav React kod piše se u:

```text
.tsx
```

Ostali TypeScript kod piše se u:

```text
.ts
```

Pravila:

- ne koristiti `any` osim ako je stvarno neophodno,
- ne komplikovati tipove bez potrebe,
- uklanjati neiskorišćene promenljive i importove,
- koristiti postojeći alias `@` za import iz `src`.

Primer alias importa:

```tsx
import Navbar from '@/components/shared/navbar/Navbar';

## SCSS

Projekat koristi Sass/SCSS.

Svaka glavna sekcija ima svoj `.tsx` i `.scss` fajl. SCSS fajl stoji uz komponentu.

Primer:

```text
Agenda.tsx
Agenda.scss
```

Komponenta treba da importuje svoj SCSS:

```tsx
import './Agenda.scss';
```

Ne koristi se Tailwind CSS. Styling se radi kroz SCSS.

### Globalne promenljive

Globalni SCSS tokeni nalaze se u:

```text
src/styles/_variables.scss
src/styles/_mediaqueries.scss
```

Vite konfiguracija u `vite.config.ts` ih automatski dodaje svakom SCSS fajlu:

```scss
@use "@/styles/variables" as *;
@use "@/styles/mediaqueries" as *;
```

Zbog toga ih u komponentnim SCSS fajlovima nije potrebno ručno importovati.

Trenutni color tokeni:

```scss
$color-yellow: #FFD720;
$color-blue: #2062D4;
$color-blue-dark: #134595;
$color-white: #FFFFFF;
$color-black: #000000;
```

Nemoj hardkodovati brand boje po komponentama ako već postoji odgovarajući token.

Koristi:

```scss
color: $color-blue;
background: $color-yellow;
```

umesto:

```scss
color: #2062d4;
```

Trenutni font tokeni:

```scss
$font-display: 'Jost', sans-serif;
$font-body: 'Figtree', sans-serif;
$font-accent: 'Mansalva', cursive;
```

Trenutni font weight tokeni:

```scss
$font-regular: 400;
$font-black: 900;
```

### Media queries

Breakpoint tokeni nalaze se u `src/styles/_mediaqueries.scss`.

Trenutno postoje:

```scss
$small-mobile: 'only screen and (max-width: 390px)';
$mobile: 'only screen and (max-width: 768px)';
$tablet: 'only screen and (min-width: 769px) and (max-width: 1024px)';
$desktop: 'only screen and (min-width: 1025px)';
```

Ne hardkodovati nasumične breakpoint vrednosti po sekcijama ako postoji odgovarajući token.

Primer:

```scss
.agenda-container {
  display: grid;
}

@media #{$mobile} {
  .agenda-container {
    display: block;
  }
}
```

## Responsive dizajn

Komponente treba razvijati tako da rade na mobile, tablet i desktop širinama, prednost imaju telefoni, pa desktop pa tableti.


Praktična pravila:

- prvo proveri kako se sekcija ponaša na desktop i mobile prikazu,
- koristi postojeće media query tokene,
- ne uvodi proizvoljne breakpointe ako postojeći pokrivaju slučaj,
- ne oslanjaj layout na fiksne širine ako sadržaj treba da se prilagođava.

## Assets

### `src/assets`

Koristi ga za slike, ikonice i druge assete koje importuješ direktno iz React/TypeScript koda.

Primer:

```tsx
import speakerImage from '@/assets/speaker.png';

const SpeakerCard = () => {
  return <img src={speakerImage} alt="Speaker" />;
};
```

### Alt tekst

Za slike:

- ako slika prenosi relevantan sadržaj, koristi smislen `alt`,
- ako je slika čisto dekorativna, koristi prazan alt.

Primer dekorativne slike:

```tsx
<img src={decoration} alt="" />
```

## Najvažnija pravila

- Ne commitovati direktno na `main`.
- Ne commitovati direktno na `development`.
- Novu granu praviti iz ažuriranog `development`.
- Pull Request ide ka `development`.
- Ne merge-ovati direktno u `main`.
- Ne hardkodovati globalne boje i breakpointove ako postoje SCSS tokeni.
- Koristi SCSS tokene iz `src/styles/`.
- Pisati TypeScript (`.tsx` za React komponente, `.ts` za ostalu TS logiku).
- Pre Pull Request-a proveriti:

```bash
npm run check
```
