import wonderLogo from "@/assets/partneri/pokrovitelj/wonder-wordmark-gradient.webp";

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

const medijskiModules = import.meta.glob("@/assets/partneri/medijski/*", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const godisnjiModules = import.meta.glob("@/assets/partneri/godisnji/*", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const resolveAsset = (
  modules: Record<string, string>,
  filename: string,
): string => {
  const entry = Object.entries(modules).find(([path]) =>
    path.endsWith(`/${filename}`),
  );

  if (!entry) {
    throw new Error(`Missing partner logo asset: ${filename}`);
  }

  return entry[1];
};

export type PartnerKind =
  "pokrovitelj" | "godisnji" | "medijski" | "robni" | "naturalni";

export type Partner = {
  name: string;
  src: string;
  // Bez linka logo nije klikabilan, a kartica nema red sa linkom.
  url?: string;
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
  url: string | undefined,
  crop?: string,
  scale?: number,
];

// Logoi su originalni fajlovi partnera (samo drugi format ili manja rezolucija);
// crop samo seče prazan prostor oko logoa pri prikazu, fajl ostaje netaknut.
const GODISNJI_FILES: readonly PartnerFile[] = [
  [
    "Wargaming",
    "wargaming.webp",
    "https://wargaming.com",
    "inset(30% 5% 30% 5%)",
  ],
  ["Knjaz Miloš", "knjaz-milos.png", "https://knjaz.rs"],
  [
    "Fakultet organizacionih nauka",
    "fon.png",
    "https://fon.bg.ac.rs",
    "inset(17% 4% 21% 5%)",
  ],
  [
    "Rapsody Travel & Events",
    "rapsody.svg",
    "https://www.rapsodytravel.rs",
    "inset(20% 12% 32% 13%)",
  ],
];

// Linkovi iz tabele "Logoi za sajt" (bez utm/igsh/stkn parametara).
const ROBNI_FILES: readonly PartnerFile[] = [
  [
    "Board game pub",
    "board-game-pub-trim.png",
    "https://www.instagram.com/3dboardgamepub",
    undefined,
    1.12,
  ],
  [
    "Album privezak",
    "album-privezak-trim.png",
    "https://www.instagram.com/album_privezak",
    undefined,
    1.07,
  ],
  [
    "Anticafe",
    "anticafe-trim.png",
    "https://www.instagram.com/anticafe_beograd/",
    undefined,
    1.07,
  ],
  [
    "Art & Fun club",
    "art-and-fun-club-trim.png",
    "https://www.instagram.com/artandfun.club",
    undefined,
    1.2,
  ],
  ["Beoplast", "beoplast.png", "https://www.beoplast.rs"],
  [
    "Castellana škola španskog",
    "castellana-skola-spanskog.png",
    "https://skolaspanskogcastellana.com",
  ],
  [
    "Crvena Panda pub quiz",
    "crvena-panda-pub-quiz.png",
    "https://www.instagram.com/pabkviz_crvenapanda",
    "inset(9% 11% 10% 11%)",
  ],
  ["DechoTzar", "dechotzar.svg", "https://www.dechkotzar.com/"],
  [
    "Eden books",
    "eden-books.jpg",
    "https://edenbooks.rs",
    "inset(12% 4% 12% 4%)",
  ],
  ["Escape game", "escape-game.png", "https://escapegame.rs/index_en.html"],
  ["Gadget 4 gift", "gadget-4-gift.png", "https://www.gadget4gift.com/"],
  [
    "Heartefact",
    "heartefact.png",
    "https://heartefact.org/en/",
    "inset(46% 4% 5% 4%)",
  ],
  [
    "Kvizosfera",
    "kvizosfera-trim.png",
    "https://www.instagram.com/kvizosfera.bg",
    undefined,
    1.4,
  ],
  [
    "Slagalica uživo",
    "slagalica-uzivo.svg",
    "https://www.instagram.com/slagalica.uzivo",
  ],
  [
    "Moja malena",
    "moja-malena.png",
    "https://www.instagram.com/moja_malena_cegeri",
  ],
  [
    "Pab kviz 8x8",
    "pab-kviz-8x8-trim.png",
    "https://www.instagram.com/pabkviz8x8",
    undefined,
    1.25,
  ],
  [
    "Slatka poruka",
    "slatka-poruka-trim.png",
    "https://www.instagram.com/slatkaporuka",
    undefined,
    1.4,
  ],
  [
    "Pinecone Bar & Theater",
    "pinecone-bar-and-theater-trim.svg",
    "https://pinecone.theater/en",
  ],
  ["BeoGraf štamparija", "beograf.png", "https://stamparijabeograf.rs"],
  ["Napkinote", "napkinote.png", "https://www.instagram.com/napkinote/"],
  [
    "Krojačeva škola",
    "krojaceva-skola.png",
    "https://www.krojacevaskola.com/",
    undefined,
    1.1,
  ],
  // Okrugli logoi: krug staje po visini, pa se malo uvećaju.
  [
    "Minimemo",
    "minimemo.png",
    "https://www.instagram.com/minimemo_eventstation/",
    undefined,
    1.3,
  ],
  [
    "Samo nežno prema sebi",
    "samo-nezno-prema-sebi.webp",
    "https://www.instagram.com/samo_nezno_prema_sebi/",
    undefined,
    1.3,
  ],
  [
    "Unas Customs",
    "unas-customs.png",
    "https://www.instagram.com/unaas_customs/",
    undefined,
    1.3,
  ],
  [
    "Štampar Makarije",
    "stampar-makarije.png",
    "https://www.stamparmakarije.com/",
  ],
  [
    "Muzej grada Beograda",
    "muzej-grada-beograda.png",
    "https://www.mgb.org.rs/",
    undefined,
    1.1,
  ],
  ["Nikolas Wines", "nikolas-wines.png", "https://www.nikolas.co.rs/o-nama/"],
  ["Ex Libris pečati za knjige", "ex-libris.png", "https://pecatzaknjige.rs/"],
  [
    "Butik cveća Biljana",
    "butik-cveca-biljana.png",
    "https://www.instagram.com/cvecarabutikcvecabiljana/",
  ],
  [
    "Kviz kultura",
    "kviz-kultura.png",
    "https://www.instagram.com/kvizkultura_pub_quiz/",
    undefined,
    1.15,
  ],
  [
    "Kaži dragička",
    "kazi-dragicka.png",
    "https://www.instagram.com/kazi.dragicka/",
  ],
  // Uzak, visok crtež: staje po visini, pa se malo uveća.
  [
    "Lala u krigli",
    "lala-u-krigli.png",
    "https://www.instagram.com/lalaukrigli/",
    undefined,
    1.15,
  ],
  ["Wool mania", "wool-mania.webp", "https://www.instagram.com/wool__mania/"],
  // Baner (nije logo), bez odsjaja ispod; partner je poslao samo ovo.
  [
    "Pozorište na Terazijama",
    "pozoriste-na-terazijama.webp",
    "https://pozoristeterazije.com/",
  ],
  ["Cubes School", "cubes-school.png", "https://cubes.edu.rs/"],
  ["The Risotto Bar", "the-risotto-bar.webp", "https://therisottobar.rs/"],
  // Okrugao logo sa providnim uglovima; krug staje po visini.
  [
    "Love is Sweet decoration studio",
    "love-is-sweet.webp",
    "https://www.instagram.com/dekoracije_loveissweetbg/",
    undefined,
    1.3,
  ],
];

const NATURALNI_FILES: readonly PartnerFile[] = [
  [
    "Domaće kiflice",
    "domace-kiflice-trim.png",
    "https://domacekiflice.rs/",
    undefined,
    1.03,
  ],
  [
    "Magičan ukus ketering",
    "magican-ukus-ketering.png",
    "https://www.facebook.com/p/Magi%C4%8Dan-Ukus-Ketering-100065014081421/",
  ],
  ["Mamikino", "mamkino.svg", "https://www.facebook.com/kolacikaokodbake/"],
  ["Milford", "milford.jpg", "https://balkanzone.rs/"],
  ["Jelena popsi", "jelena-popsi.png", "https://www.instagram.com/j.cake_pops"],
  ["Boombox", "boombox.svg", "https://boombox.eu/sr/", undefined, 1.35],
  [
    "Choc Shock",
    "choc-shock.webp",
    "https://www.instagram.com/choc_shock/",
    "inset(15% 17% 12% 16%)",
    1.4,
  ],
  // Pizza Fabrika: isečak je u samom fajlu (object-view-box radi samo u Chrome-u).
  // Zeleni pravougaonik ne sme preko kosih ivica heksagona; na 1.03 uglovi
  // tačno dodiruju ivicu, pa 0.98 ostavlja mali razmak.
  [
    "Pizza Fabrika",
    "pizza-fabrika.webp",
    "https://www.pizza-fabrika.rs/",
    undefined,
    0.98,
  ],
  // Okrugao logo sa providnim uglovima (bez belog kvadrata koji bi virio iz
  // heksagona); krug je ~82% širine heksagona, bar 6px od kosih ivica.
  ["Veganluk", "veganluk.webp", "https://www.veganluk.com/", undefined, 1.35],
  ["Bocni ketering", "bocni-ketering.webp", "https://bocni.rs/"],
  ["Oat Bar", "oat-bar.png", "https://www.instagram.com/oatbar_rs/"],
  // Okrugao logo sa providnim uglovima; krug staje po visini.
  [
    "Njam njam za 10",
    "njam-njam-za-10.webp",
    "https://www.instagram.com/njamnjamza10/",
    undefined,
    1.3,
  ],
  [
    "Ketering Kovačević",
    "ketering-kovacevic.png",
    "https://keteringkovacevic.rs/",
  ],
  ["Patiserija", "patiserija.png", "https://patiserija.rs/"],
  [
    "Bokini kolači",
    "bokini-kolaci.png",
    "https://bokinikolaci.rs/",
    undefined,
    1.1,
  ],
];

// Za sada bez linkova; dodaju se kad stignu.
// Linkovi iz spiska "link od sajtova za partnere". Bez linka su oni čiji
// link ne radi ili ne vodi na samog partnera (dodaju se kad se provere).
const MEDIJSKI_FILES: readonly PartnerFile[] = [
  ["BEST Novi Sad", "best-novi-sad.png", "https://bestns.org.rs/"],
  // Fotografija nalepnice (partner nije poslao fajl logoa).
  ["Bum Bum radio", "bum-bum-radio.png", "https://bumbumradio.rs/"],
  ["Case Study Club", "case-study-club.png", "https://casestudyclub.org/en/"],
  ["Digitalizuj.me", "digitalizuj-me.png", "https://digitalizuj.me/"],
  ["EESTEC LC Novi Sad", "eestec.png", "https://eestec.net/"],
  ["H-Bridges", "h-bridges.png", "https://h-bridges.etf.bg.ac.rs/"],
  ["HeapSpace", "heapspace.png", "https://heapspace.rs/"],
  ["ICT", "ict.png", "https://ict.edu.rs/", undefined, 1.15],
  [
    "Istraživačko-razvojni centar FON",
    "istrazivacko-razvojni-centar.png",
    "https://irc.fon.bg.ac.rs/",
  ],
  ["ITNetwork", "itnetwork.png", "https://www.itnetwork.rs/"],
  [
    "Magazin Student",
    "magazin-student.png",
    "https://www.instagram.com/magazinstudent/",
  ],
  // Samo krug; natpis ispod je beo i ne vidi se na belom heksagonu.
  [
    "Marketing Workshop",
    "marketing-workshop.png",
    "https://www.instagram.com/marketingworkshop/",
    undefined,
    1.25,
  ],
  ["Portal SBU Poslovi", "portal-sbu-poslovi.webp", "https://sbu-poslovi.rs/"],
  [
    "PR Team FPN",
    "pr-team-fpn.png",
    "https://www.instagram.com/prteamfpn/",
    undefined,
    1.3,
  ],
  ["PRObjave.com", "probjave.webp", "https://probjave.com/"],
  ["Računarski fakultet", "raf.png", "https://raf.edu.rs/"],
  // Spisak ima samo sajt Ekonomskog fakulteta, ne SSEF-a.
  [
    "Savez studenata Ekonomskog fakulteta",
    "ssef.png",
    undefined,
    undefined,
    1.3,
  ],
  ["Znanje.rs", "znanje-rs.webp", "https://www.znanje.rs/"],
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

export const SPONSOR_PARTNER: Partner = {
  name: "Wonder",
  src: wonderLogo,
  url: "https://wonder.design/",
  kind: "pokrovitelj",
};

export const GODISNJI_PARTNERS: Partner[] = GODISNJI_FILES.map((file) =>
  toPartner(godisnjiModules, "godisnji", file),
);

export const MEDIJSKI_PARTNERS: Partner[] = MEDIJSKI_FILES.map((file) =>
  toPartner(medijskiModules, "medijski", file),
);

// Robni and naturalni partners are shown together under the single "ROBNI" heading.
export const ROBNI_PARTNERS: Partner[] = [
  ...ROBNI_FILES.map((file) => toPartner(robniModules, "robni", file)),
  ...NATURALNI_FILES.map((file) =>
    toPartner(naturalniModules, "naturalni", file),
  ),
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
