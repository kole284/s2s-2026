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

export type PartnerKind = "robni" | "naturalni";

export type Partner = {
  name: string;
  src: string;
  url: string;
  kind: PartnerKind;
  // CSS `inset(...)` that trims empty margin around the artwork, so the logo
  // fills the hexagon instead of floating in the middle of a padded image.
  crop?: string;
  // Extra enlargement of the logo inside its hexagon (1 = no change).
  scale?: number;
};

type PartnerFile = readonly [
  name: string,
  file: string,
  url: string,
  crop?: string,
  scale?: number,
];

// Linkovi iz tabele "Logoi za sajt" (bez utm/igsh/stkn parametara).
const ROBNI_FILES: readonly PartnerFile[] = [
  ["Board game pub", "board-game-pub-trim.png", "https://www.instagram.com/3dboardgamepub", undefined, 1.12],
  ["Album privezak", "album-privezak-trim.png", "https://www.instagram.com/album_privezak", undefined, 1.07],
  ["Anticafe", "anticafe-trim.png", "https://www.instagram.com/anticafe_beograd/", undefined, 1.07],
  ["Art & Fun club", "art-and-fun-club-trim.png", "https://www.instagram.com/artandfun.club", undefined, 1.2],
  ["Beoplast", "beoplast.png", "https://www.beoplast.rs"],
  ["Castellana škola španskog", "castellana-skola-spanskog.png", "https://skolaspanskogcastellana.com"],
  ["Crvena Panda pub quiz", "crvena-panda-pub-quiz.png", "https://www.instagram.com/pabkviz_crvenapanda", "inset(9% 11% 10% 11%)"],
  ["DechoTzar", "dechotzar.svg", "https://www.dechkotzar.com/"],
  ["Eden books", "eden-books.jpg", "https://edenbooks.rs", "inset(12% 4% 12% 4%)"],
  ["Escape game", "escape-game.png", "https://escapegame.rs/index_en.html"],
  ["Gadget 4 gift", "gadget-4-gift.png", "https://www.gadget4gift.com/"],
  ["Heartefact", "heartefact.png", "https://heartefact.org/en/", "inset(46% 4% 5% 4%)"],
  ["Kvizosfera", "kvizosfera-trim.png", "https://www.instagram.com/kvizosfera.bg", undefined, 1.4],
  ["Slagalica uživo", "slagalica-uzivo.svg", "https://www.instagram.com/slagalica.uzivo"],
  ["Moja malena", "moja-malena.png", "https://www.instagram.com/moja_malena_cegeri"],
  ["Pab kviz 8x8", "pab-kviz-8x8-trim.png", "https://www.instagram.com/pabkviz8x8", undefined, 1.25],
  ["Slatka poruka", "slatka-poruka-trim.png", "https://www.instagram.com/slatkaporuka", undefined, 1.4],
  ["Pinecone Bar & Theater", "pinecone-bar-and-theater-trim.svg", "https://pinecone.theater/en"],
];

const NATURALNI_FILES: readonly PartnerFile[] = [
  ["Domaće kiflice", "domace-kiflice-trim.png", "https://domacekiflice.rs/", undefined, 1.03],
  ["Magičan ukus ketering", "magican-ukus-ketering.png", "https://www.facebook.com/p/Magi%C4%8Dan-Ukus-Ketering-100065014081421/"],
  ["Mamikino", "mamkino.svg", "https://www.facebook.com/kolacikaokodbake/"],
  ["Milford", "milford.jpg", "https://balkanzone.rs/"],
  ["Jelena popsi", "jelena-popsi.png", "https://www.instagram.com/j.cake_pops"],
];

const toPartner = (
  modules: Record<string, string>,
  kind: PartnerKind,
  [name, file, url, crop, scale]: PartnerFile,
): Partner => ({
  name,
  src: resolveAsset(modules, file),
  url,
  kind,
  crop,
  scale,
});

// Robni and naturalni partners are shown together under the single "ROBNI" heading.
export const ROBNI_PARTNERS: Partner[] = [
  ...ROBNI_FILES.map((file) => toPartner(robniModules, "robni", file)),
  ...NATURALNI_FILES.map((file) => toPartner(naturalniModules, "naturalni", file)),
];

// Kratak, čitljiv naziv linka za karticu (sam URL se ne menja):
// sajt -> domen, Instagram -> "Instagram · @nalog", Facebook -> "Facebook · stranica".
export const formatPartnerLink = (url: string): string => {
  const { hostname, pathname } = new URL(url);
  const host = hostname.replace(/^www\./, "");
  const segments = decodeURI(pathname).split("/").filter(Boolean);

  if (host === "instagram.com" && segments[0]) {
    return `Instagram · @${segments[0]}`;
  }

  if (host === "facebook.com" && segments.length) {
    // /p/Ime-Stranice-100065014081421 -> "Ime Stranice"
    const page = segments[0] === "p" ? segments[1] : segments[0];
    const name = page.replace(/-\d+$/, "").replace(/-/g, " ");

    return `Facebook · ${name}`;
  }

  return host;
};
