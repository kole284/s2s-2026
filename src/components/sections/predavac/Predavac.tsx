import { useState } from "react";

import arrowDefault from "@/assets/Vector.svg";
import closeIcon from "@/assets/Layer_1.svg";
import aleksaKrstic from "@/assets/predavaci/aleksa-krstic.webp";
import aleksandarIlankovic from "@/assets/predavaci/aleksandar-ilankovic.webp";
import anaMilivojevic from "@/assets/predavaci/ana-milivojevic.webp";
import damirVelovic from "@/assets/predavaci/damir-velovic.webp";
import dorisSmulja from "@/assets/predavaci/doris-smulja.webp";
import kristinaJovanovic from "@/assets/predavaci/kristina-jovanovic.webp";
import lazarJocic from "@/assets/predavaci/lazar-jocic.webp";
import magdalenaBojanic from "@/assets/predavaci/magdalena-bojanic.webp";
import matijaVujic from "@/assets/predavaci/matija-vujic.webp";
import minaPopovic from "@/assets/predavaci/mina-popovic.webp";
import petarNikolic from "@/assets/predavaci/petar-nikolic.webp";
import tamaraKukic from "@/assets/predavaci/tamara-kukic.webp";
import taraMilojkovic from "@/assets/predavaci/tara-milojkovic.webp";

import "./Predavac.scss";

interface PredavacPodaci {
  ime: string;
  opis: string[];
  slika?: string;
  pozicijaSlike?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

type PredavacProps = {
  predavacId?: number;
  workshopTitle?: string;
  workshopIcon?: string;
  lecturers?: string[];
  onClose?: () => void;
};
const OPISI = {
  figmaWonder:
    "U ovoj radionici prolazimo kroz osnove UI/UX dizajna. Kroz praktičan rad upoznajemo se sa teorijskim principima dobrog dizajna i od nule pravimo svoj prvi mockup, uz podršku savremenih alata i AI tehnologije. Poseban akcenat se stavlja na samostalan rad, gde se polaznicima daje sloboda da iskažu svoju kreativnost. Na kraju radionice, svaki polaznik izlazi sa jasnim razumevanjem kako dizajnerski proces izgleda u praksi, od prve ideje do gotovog rešenja.",
  gameDevelopment:
    "Pravljenje 2D rougelike igrice od nule. Uče se osnove Unity skriptovanja i gameplay development-a. Na kraju radionice svi dodaju neki svoj element igrici. Rezultat je da svako ima svoj unikatan rougelike na kraju radionice.",
  aiAgenti:
    'Radionica ,,AI agenti u akciji" predstavlja praktično i interaktivno upoznavanje sa osnovnim principima razvoja AI agenata kroz DSPy okvir. Polazeći od rada sa LLM-ovima, strukturisanim ulazima i izlazima i modularnim LLM programima, učesnici će upoznati agente koji mogu da koriste alate i samostalno biraju sledeći korak u rešavanju zadatka. Kroz unapred pripremljen projekat studenti će zajednički razviti jednostavnog ReAct agenta, pratiti njegov tok izvršavanja i ispitati njegovo ponašanje na praktičnim zadacima.',
  analitika:
    "Analitika Starter Pack radionica namenjena je studentima koji žele da naprave prve korake u svetu podataka i mašinskog učenja. Kroz praktičan rad u Pajtonu, polaznici će naučiti osnove programskog jezika, kako da vizualizuju podatke i kako funkcionišu neki od najpoznatijih algoritama mašinskog učenja. Fokus je na razumevanju kroz praksu: svaki koncept se odmah primenjuje na konkretnim primerima i podacima, tako da polaznici na kraju radionice imaju svoj prvi trenirani model i jasnu sliku kako izgleda rad analitičara/data scientista.",
  csharp:
    "Radionica je namenjena svima koji žele da kroz praktičan primer nauče osnove softverskog inženjerstva. Delegati će kroz ovu radionicu steći osnovno znanje o razvoju aplikacija korišćenjem C# programskog jezika i .NET platforme. Stečeno znanje će biti dobra osnova za dalje učenje i usavršavanje. Kroz izradu online multiplayer igrice proći ćemo kroz to kako pravilno treba da se radi sa bazom podataka, kako klijenti komuniciraju preko mreže, način implementacije real-time komunikacije i izrada interfejsa i logike same igrice. Upoznaćemo se sa Blazor tehnologijom koja omogućava izradu web interfejsa u potpunosti u C#-u, naučiti kako se kod pravilno organizuje u slojeve i kako se upravlja stanjem koje se deli između više korisnika. Na kraju radionice delegati će imati gotovu aplikaciju i osnovno razumevanje procesa razvoja aplikacija",
  uvodUC:
    "Ova radionica namenjena je studentima koji se prvi put susreću sa programiranjem u programskom jeziku C. Za dva dana savladaćemo osnove sintakse jezika, rad sa podacima i promenljivama, kontrolu toka programa, jednostavne algoritme i nizove. Cilj je da polaznici steknu samopouzdanje da samostalno pišu i pokreću manje programe, kao i da razumeju logiku iza rešavanja problema. Ako vreme dozvoli, dotaći ćemo se i naprednijih tema - struktura, rada sa datotekama i povezanim listama - kao uvod u sve ono što ih čeka na fakultetu.",
  caseMethod:
    "Radionica je namenjena svima koji žele da se bolje upoznaju sa tehnikama i analizama koje se primenjuju pri rešavanju poslovnih studija slučaja. Kroz konkretne primere, učesnici će proći kroz proces rešavanja:od analize i definisanja strategije, do implementacije i sagledavanja efekata. Fokus će biti na razumevanju logike svakog koraka i praktičnim smernicama koje olakšavaju rešavanje složenih poslovnih izazova",
  cybersecurity:
    "Radionica je namenjena svim studentima koje interesuje sajber bezbednost, bez obzira na predznanje. Krećemo od nule: od osnovnih koncepata, preko slučajeva hakovanja u pravom životu, i na kraju simulacije hakerskih napada koje će učesnici sprovoditi uz pomoć predavača. Učesnici će takođe dobiti pregled karijernih puteva u okviru sajber bezbednosti, uz biblioteku materijala za dalji rad.",
  digitalniMarketing: [
    "Vidiš da je nešto lepo, ali ne znaš zašto?",
    "Pitaš se zašto neki video privuče pažnju za nekoliko sekundi, dok drugi ljudi samo preskoče?",
    "Ako si na početku puta u marketingu ili već imaš iskustva, ali ti nedostaju struktura i dublje razumevanje, ova radionica je za tebe.",
    "Tokom dva dana naučićeš da prepoznaš šta čini sadržaj vizuelno privlačnim, kako da privučeš i zadržiš pažnju i, najvažnije, kako da sve to pretvoriš u sistem koji donosi prodaje.",
  ],
  startup:
    "Neki ljudi samo posmatraju kako se svijet mijenja i klimaju glavom, dok drugi uzmu stvari u svoje ruke jer ih nervira status quo. Ako si od ovih drugih, ovo su dva dana u kojima prestaješ da pričaš šta bi moglo biti i počinješ da praviš ono što mora postojati. Kroz intenzivan rad na sopstvenoj ideji, validaciju i testiranje na terenu, proći ćeš cijeli put od nule do gotovog koncepta. Cilj nije da naučiš šta je startup — cilj je da izađeš sa svojim",
} as const;

// Kadar je podešen po fotografiji (isto kao koordinatori u Tim sekciji): oči su
// na istoj visini, lice u centru i iste veličine, pa se vide glava i ramena.
const PREDAVACI: PredavacPodaci[] = [
  {
    ime: "Lazar Jocić",
    slika: lazarJocic,
    pozicijaSlike: { x: -119.7, y: -37.6, width: 477.1, height: 596.3 },
    opis: [OPISI.figmaWonder],
  },
  {
    ime: "Aleksandar Ilanković",
    slika: aleksandarIlankovic,
    pozicijaSlike: { x: -54.8, y: -57.6, width: 330.9, height: 413.6 },
    opis: [OPISI.gameDevelopment],
  },
  {
    ime: "Tara Milojković",
    slika: taraMilojkovic,
    pozicijaSlike: { x: -50.8, y: -84.0, width: 307.4, height: 384.2 },
    opis: [OPISI.aiAgenti],
  },
  {
    ime: "Magdalena Bojanić",
    slika: magdalenaBojanic,
    pozicijaSlike: { x: -252.0, y: -212.1, width: 713.4, height: 891.7 },
    opis: [OPISI.analitika],
  },
  {
    ime: "Doris Šmulja",
    slika: dorisSmulja,
    pozicijaSlike: { x: -86.9, y: -152.9, width: 480.0, height: 600.0 },
    opis: [OPISI.analitika],
  },
  {
    ime: "Matija Vujić",
    slika: matijaVujic,
    pozicijaSlike: { x: -108.6, y: 32.9, width: 462.9, height: 578.6 },
    opis: [OPISI.csharp],
  },
  {
    ime: "Kristina Jovanović",
    slika: kristinaJovanovic,
    pozicijaSlike: { x: -154.6, y: -5.7, width: 602.8, height: 753.5 },
    opis: [OPISI.uvodUC],
  },
  {
    ime: "Tamara Kukić",
    slika: tamaraKukic,
    pozicijaSlike: { x: -299.8, y: -194.7, width: 827.2, height: 1034.0 },
    opis: [OPISI.caseMethod],
  },
  {
    ime: "Ana Milivojević",
    slika: anaMilivojevic,
    pozicijaSlike: { x: -223.6, y: -72.0, width: 713.4, height: 891.7 },
    opis: [OPISI.caseMethod],
  },
  {
    ime: "Mina Popović",
    slika: minaPopovic,
    pozicijaSlike: { x: -162.8, y: -88.9, width: 607.5, height: 759.4 },
    opis: [OPISI.caseMethod],
  },
  {
    ime: "Petar Nikolić",
    slika: petarNikolic,
    pozicijaSlike: { x: -170.7, y: -146.9, width: 602.8, height: 753.5 },
    opis: [OPISI.cybersecurity],
  },
  {
    ime: "Aleksa Krstić",
    slika: aleksaKrstic,
    pozicijaSlike: { x: -155.1, y: 11.6, width: 525.4, height: 656.8 },
    opis: [...OPISI.digitalniMarketing],
  },
  {
    ime: "Damir Velović",
    slika: damirVelovic,
    pozicijaSlike: { x: -81.5, y: -14.8, width: 353.5, height: 441.8 },
    opis: [OPISI.startup],
  },
];

const PROFILI_PO_IMENU = new Map(
  PREDAVACI.map((predavac) => [predavac.ime, predavac]),
);

const napraviPrazanProfil = (ime: string): PredavacPodaci => ({
  ime,
  opis: [],
});

const Predavac = ({
  workshopTitle,
  workshopIcon,
  lecturers,
  onClose,
}: PredavacProps) => {
  const lecturerNames = lecturers?.length
    ? lecturers
    : PREDAVACI.map((predavac) => predavac.ime);
  const imaVisePredavaca = lecturerNames.length > 1;
  const [aktivniIndeks, setAktivniIndeks] = useState(0);
  const imePredavaca = lecturerNames[aktivniIndeks];
  const predavac = lecturers?.length
    ? (PROFILI_PO_IMENU.get(imePredavaca) ??
      napraviPrazanProfil(imePredavaca))
    : PREDAVACI[aktivniIndeks];

  const prikaziPrethodnog = () => {
    setAktivniIndeks(
      (indeks) => (indeks - 1 + lecturerNames.length) % lecturerNames.length,
    );
  };

  const prikaziSledeceg = () => {
    setAktivniIndeks((indeks) => (indeks + 1) % lecturerNames.length);
  };

  return (
    <section className="predavac-page">
      <header className="predavac-header">
        <h1
          className={`predavac-title${
            (workshopTitle?.length ?? 0) > 24 ? " predavac-title--long" : ""
          }`}
        >
          {workshopTitle}
        </h1>

        <button
          type="button"
          className="predavac-close"
          aria-label="Zatvori"
          onClick={onClose}
        >
          <img src={closeIcon} alt="" className="predavac-close-icon" />
        </button>
      </header>

      <div className="predavac-band">
        <div className="predavac-content">
          <div className="predavac-card">
            <div className="predavac-visual">
              <figure
                className={`predavac-photo-block${
                  predavac.slika ? "" : " predavac-photo-block--without-photo"
                }`}
              >
                {predavac.slika && (
                  <svg
                    className="predavac-photo"
                    viewBox="0 0 220 300"
                    preserveAspectRatio="xMidYMin slice"
                    role="img"
                    aria-label={imePredavaca}
                  >
                    <image
                      href={predavac.slika}
                      x={predavac.pozicijaSlike?.x ?? 0}
                      y={predavac.pozicijaSlike?.y ?? 0}
                      width={predavac.pozicijaSlike?.width ?? 220}
                      height={predavac.pozicijaSlike?.height ?? 300}
                      preserveAspectRatio="xMidYMid meet"
                    />
                  </svg>
                )}

                <figcaption className="predavac-name">{imePredavaca}</figcaption>
              </figure>

              {workshopIcon && (
                <img
                  src={workshopIcon}
                  alt=""
                  className="predavac-shield"
                  loading="lazy"
                  decoding="async"
                />
              )}
            </div>

            <div
              className={`predavac-text${
                predavac.opis.join("").length > 700
                  ? " predavac-text--dugacak"
                  : ""
              }`}
            >
              {predavac.opis.map((pasus, indeks) => (
                <p key={indeks}>{pasus}</p>
              ))}
            </div>
          </div>
        </div>

        {imaVisePredavaca && (
          <>
            <button
              type="button"
              className="predavac-arrow predavac-arrow--prev"
              onClick={prikaziPrethodnog}
              aria-label="Prethodni predavač"
            >
              <img src={arrowDefault} alt="" />
            </button>

            <button
              type="button"
              className="predavac-arrow predavac-arrow--next"
              onClick={prikaziSledeceg}
              aria-label="Sledeći predavač"
            >
              <img src={arrowDefault} alt="" />
            </button>
          </>
        )}
      </div>

      <footer className="predavac-footer" />
    </section>
  );
};

export default Predavac;
