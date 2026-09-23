const robniModules = import.meta.glob("@/assets/partneri/robni/*", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const naturalniModules = import.meta.glob("@/assets/partneri/naturalni/*", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const resolveAsset = (modules: Record<string, string>, filename: string): string => {
  const entry = Object.entries(modules).find(([path]) => path.endsWith(`/${filename}`));

  if (!entry) {
    throw new Error(`Missing partner logo asset: ${filename}`);
  }

  return entry[1];
};

export type Partner = {
  name: string;
  src: string;
  // CSS `inset(...)` that trims empty margin around the artwork, so the logo
  // fills the hexagon instead of floating in the middle of a padded image.
  crop?: string;
  // Extra enlargement of the logo inside its hexagon (1 = no change).
  scale?: number;
};

type PartnerFile = readonly [name: string, file: string, crop?: string, scale?: number];

const ROBNI_FILES: readonly PartnerFile[] = [
  ["Board game pub", "board-game-pub-trim.png", undefined, 1.12],
  ["Album privezak", "album-privezak-trim.png", undefined, 1.07],
  ["Anticafe", "anticafe-trim.png", undefined, 1.07],
  ["Art & Fun club", "art-and-fun-club-trim.png", undefined, 1.2],
  ["Beoplast", "beoplast.png"],
  ["Castellana škola španskog", "castellana-skola-spanskog.png"],
  ["Crvena Panda pub quiz", "crvena-panda-pub-quiz.png", "inset(9% 11% 10% 11%)"],
  ["DechoTzar", "dechotzar.svg"],
  ["Eden books", "eden-books.jpg", "inset(12% 4% 12% 4%)"],
  ["Escape game", "escape-game.png"],
  ["Gadget 4 gift", "gadget-4-gift.png"],
  ["Heartefact", "heartefact.png", "inset(46% 4% 5% 4%)"],
  ["Kvizosfera", "kvizosfera-trim.png", undefined, 1.4],
  ["Slagalica uživo", "slagalica-uzivo.svg"],
  ["Moja malena", "moja-malena.png"],
  ["Pab kviz 8x8", "pab-kviz-8x8-trim.png", undefined, 1.25],
  ["Slatka poruka", "slatka-poruka-trim.png", undefined, 1.4],
  ["Pinecone Bar & Theater", "pinecone-bar-and-theater-trim.svg"],
];

const NATURALNI_FILES: readonly PartnerFile[] = [
  ["Domaće kiflice", "domace-kiflice-trim.png", undefined, 1.03],
  ["Magičan ukus ketering", "magican-ukus-ketering.png"],
  ["Mamkino", "mamkino.svg"],
  ["Milford", "milford.jpg"],
  ["Jelena popsi", "jelena-popsi.png"],
];

// Robni and naturalni partners are shown together under the single "ROBNI" heading.
export const ROBNI_PARTNERS: Partner[] = [
  ...ROBNI_FILES.map(([name, file, crop, scale]) => ({
    name,
    src: resolveAsset(robniModules, file),
    crop,
    scale,
  })),
  ...NATURALNI_FILES.map(([name, file, crop, scale]) => ({
    name,
    src: resolveAsset(naturalniModules, file),
    crop,
    scale,
  })),
];
