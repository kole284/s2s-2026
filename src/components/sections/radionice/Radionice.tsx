import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type AnimationEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import graphIcon from "@/assets/radionice/icons/case.webp";
import csharpIcon from "@/assets/radionice/icons/csharp-development.webp";
import marketingIcon from "@/assets/radionice/icons/digital-marketing.webp";
import gameIcon from "@/assets/radionice/icons/game-development.webp";
import cIcon from "@/assets/radionice/icons/intro-to-c.webp";
import machineLearningIcon from "@/assets/radionice/icons/machine-learning.webp";
import startupIcon from "@/assets/radionice/icons/startup.webp";
import designIcon from "@/assets/radionice/icons/ui-ux-design.webp";
import aiIcon from "@/assets/radionice/icons/ai-llm.webp";
import cyberIcon from "@/assets/radionice/icons/cybersec.webp";
import { WORKSHOPS, type Workshop } from "@/data/workshops";

import Predavac from "../predavac/Predavac";
import "./Radionice.scss";

interface Radionica extends Workshop {
  icon: string;
  predavacId: number;
}

// Graph je privremena ikonica za radionice za koje ZIP ne sadrži poseban SVG.
const WORKSHOP_ICONS: Record<number, string> = {
  1: designIcon,
  2: csharpIcon,
  3: cyberIcon,
  4: graphIcon,
  5: marketingIcon,
  6: cIcon,
  7: gameIcon,
  8: aiIcon,
  9: startupIcon,
  10: machineLearningIcon,
};

const PREDAVAC_IDS: Record<number, number> = {
  1: 4,
  2: 2,
  3: 1,
  4: 4,
  5: 4,
  6: 2,
  7: 2,
  8: 3,
  9: 4,
  10: 3,
};

const RADIONICE: Radionica[] = WORKSHOPS.map((workshop) => ({
  ...workshop,
  icon: WORKSHOP_ICONS[workshop.id],
  predavacId: PREDAVAC_IDS[workshop.id],
}));

/*
 * Traka radionica radi po istom principu kao partnerski marquee:
 * tri identične grupe u nizu, pomeraj u pikselima i modulo širine grupe, pa je
 * kretanje beskonačno. Autoplay ide konstantnom brzinom, a prevlačenje ga
 * privremeno preuzima i vraća posle kratke pauze.
 */
const BROJ_GRUPA = 3;
const BRZINA_TRAKE_PX_PO_SEKUNDI = 52;
const NASTAVAK_AUTOPLAYA_MS = 450;
const MAX_KORAK_SEKUNDI = 0.1;

/*
 * Pokret postaje prevlačenje tek posle ovog praga i samo ako je pretežno
 * horizontalan: tap na radionicu ostaje čist klik, a vertikalni scroll
 * stranice ostaje netaknut.
 */
const PRAG_PREVLACENJA_PX = 6;

/* Klik prvo dovede radionicu u centar, pa tek onda kreće prelaz na predavača. */
const TRAJANJE_CENTRIRANJA_MS = 340;

/*
 * Koliko širine i visine svoje kutije zauzima zgužvani oblik
 * (`--rd-paper-crumpled-next` u Radionice.scss). Po ovome se računa Y faktor
 * lopte. Y je uzet nešto manji od pravog gabarita (0.94) jer oblik ima usece
 * gore i dole na sredini — oko čita telo oblika, ne krajnje tačke.
 */
const UDEO_OBLIKA_X = 0.96;
const UDEO_OBLIKA_Y = 0.88;

/*
 * Nagib lopte u zgužvanom stanju (rotate u .radionice-page--view-*-crumpling).
 * U transform listi rotacija ide PRE skaliranja, pa širina papira (cela sekcija)
 * ulazi i u visinu lopte — bez toga račun ispadne pogrešan.
 */
const UGAO_LOPTE_STEPENI = 2.4;

/*
 * Sitna rezerva na računatoj visini, da skew i zaokruživanje ne preteraju.
 */
const REZERVA_VISINE_LOPTE = 1;

type FazaPrikaza = "crumpling" | "exiting" | "entering" | "unfolding";

type SmerPrikaza = "to-speaker" | "to-workshop";
type TranzicijaPrikaza = {
  faza: FazaPrikaza;
  smer: SmerPrikaza;
};

/*
 * Jedna lopta kroz četiri beata:
 * 1) papir se skupča u sredinu i stara pozadina se uvuče u njega,
 * 2) lopta ode udesno iz kadra,
 * 3) nova lopta uđe sa leve strane u sredinu,
 * 4) iz nje izlazi nova pozadina i širi se dok se papir odgužva.
 * Trajanja moraju da prate iste vrednosti u Radionice.scss.
 */
const TRAJANJE_GUZVANJA_PRIKAZA_MS = 270;
const TRAJANJE_IZLASKA_PRIKAZA_MS = 225;
const TRAJANJE_ULASKA_PRIKAZA_MS = 255;
const TRAJANJE_OTVARANJA_PRIKAZA_MS = 338;

type RadioniceTrakaProps = {
  pauza: boolean;
  interaktivno: boolean;
  onOpen: (radionica: Radionica) => void;
};

const RadionicePaperSurface = () => (
  <div className="radionice-paper-surface" aria-hidden="true" />
);

const RadioniceTraka = ({
  pauza,
  interaktivno,
  onOpen,
}: RadioniceTrakaProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trakaRef = useRef<HTMLDivElement>(null);
  const grupaRef = useRef<HTMLDivElement>(null);

  const pomerajRef = useRef(0);
  const sirinaGrupeRef = useRef(0);
  const korakRef = useRef(0);
  const sirinaStavkeRef = useRef(0);

  /* Preostalo vreme pauze posle prevlačenja, u sekundama; petlja ga odbrojava. */
  const cekanjeAutoplayaRef = useRef(0);

  const prevlacenjeRef = useRef(false);
  const pokazivacIdRef = useRef<number | null>(null);
  const pocetakXRef = useRef(0);
  const pocetakYRef = useRef(0);
  const pocetniPomerajRef = useRef(0);
  const pomerioSeRef = useRef(false);

  const centriranjeRef = useRef<{
    od: number;
    cilj: number;
    proteklo: number;
    radionica: Radionica;
  } | null>(null);

  const pauzaRef = useRef(pauza);
  const smanjenPokretRef = useRef(false);
  const uViewportuRef = useRef(false);
  const onOpenRef = useRef(onOpen);

  /* Petlja živi u efektu, pa je handleri pokreću/zaustavljaju preko ovih komandi. */
  const komandeRef = useRef<{
    pokreni: () => void;
    zaustavi: () => void;
  } | null>(null);

  const [centarKljuc, setCentarKljuc] = useState(-1);

  useEffect(() => {
    onOpenRef.current = onOpen;
  }, [onOpen]);

  const normalizovanPomeraj = useCallback(() => {
    const sirina = sirinaGrupeRef.current;

    if (sirina <= 0) return 0;

    return ((pomerajRef.current % sirina) + sirina) % sirina;
  }, []);

  /*
   * Naziv se ispisuje ispod one stavke koja je najbliža centru kadra.
   * Račun je čisto aritmetički (pomeraj + korak), pa ne košta ništa po frejmu.
   */
  const primeniTransform = useCallback(() => {
    const traka = trakaRef.current;
    const viewport = viewportRef.current;

    if (!traka || !viewport) return;

    const renderPomeraj = sirinaGrupeRef.current + normalizovanPomeraj();

    traka.style.transform = `translate3d(${-renderPomeraj}px, 0, 0)`;

    const korak = korakRef.current;

    if (korak <= 0) return;

    const kljuc = Math.round(
      (viewport.clientWidth / 2 + renderPomeraj - sirinaStavkeRef.current / 2) /
        korak,
    );

    setCentarKljuc((prethodni) => (prethodni === kljuc ? prethodni : kljuc));
  }, [normalizovanPomeraj]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const grupa = grupaRef.current;

    if (!viewport || !grupa) return;

    const smanjenPokret = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame: number | null = null;
    let prethodniFrame: number | null = null;

    const trebaPetlja = () =>
      uViewportuRef.current &&
      (centriranjeRef.current !== null ||
        (!pauzaRef.current &&
          !smanjenPokretRef.current &&
          !prevlacenjeRef.current));

    const zaustavi = () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
        frame = null;
      }

      prethodniFrame = null;
    };

    const korakAnimacije = (vreme: number) => {
      frame = null;

      const delta =
        prethodniFrame === null
          ? 0
          : Math.min((vreme - prethodniFrame) / 1000, MAX_KORAK_SEKUNDI);

      prethodniFrame = vreme;

      const centriranje = centriranjeRef.current;

      if (centriranje) {
        centriranje.proteklo += delta * 1000;

        const napredak = Math.min(
          1,
          centriranje.proteklo / TRAJANJE_CENTRIRANJA_MS,
        );
        const ublazeno = 1 - (1 - napredak) ** 3;

        pomerajRef.current =
          centriranje.od + (centriranje.cilj - centriranje.od) * ublazeno;
        primeniTransform();

        if (napredak >= 1) {
          centriranjeRef.current = null;
          onOpenRef.current(centriranje.radionica);
        }
      } else if (cekanjeAutoplayaRef.current > 0) {
        cekanjeAutoplayaRef.current -= delta;
      } else if (
        !pauzaRef.current &&
        !smanjenPokretRef.current &&
        !prevlacenjeRef.current
      ) {
        pomerajRef.current += BRZINA_TRAKE_PX_PO_SEKUNDI * delta;
        primeniTransform();
      }

      if (trebaPetlja()) {
        frame = window.requestAnimationFrame(korakAnimacije);
      } else {
        prethodniFrame = null;
      }
    };

    const pokreni = () => {
      if (frame !== null || !trebaPetlja()) return;

      prethodniFrame = null;
      frame = window.requestAnimationFrame(korakAnimacije);
    };

    const izmeri = () => {
      const stavke = grupa.querySelectorAll<HTMLElement>(".radionice-stavka");

      if (stavke.length < 2) return;

      const novaSirina = grupa.getBoundingClientRect().width;

      if (novaSirina <= 0) return;

      const prethodnaSirina = sirinaGrupeRef.current;

      /*
       * Korak se meri iz rect-ova, ne iz offsetLeft: offsetLeft je zaokružen na
       * ceo piksel, pa bi se greška sabirala kroz grupu i klik bi centrirao
       * radionicu nekoliko piksela pored sredine.
       */
      const prviRect = stavke[0].getBoundingClientRect();

      korakRef.current = stavke[1].getBoundingClientRect().left - prviRect.left;
      sirinaStavkeRef.current = prviRect.width;

      if (prethodnaSirina > 0) {
        const normalizovano =
          ((pomerajRef.current % prethodnaSirina) + prethodnaSirina) %
          prethodnaSirina;

        pomerajRef.current = (normalizovano / prethodnaSirina) * novaSirina;
      } else {
        // Prvi kadar zatiče prvu radionicu tačno u centru, sa ispisanim nazivom.
        pomerajRef.current =
          sirinaStavkeRef.current / 2 - viewport.clientWidth / 2;
      }

      sirinaGrupeRef.current = novaSirina;
      primeniTransform();
    };

    const naPromenuPokreta = () => {
      smanjenPokretRef.current = smanjenPokret.matches;

      if (smanjenPokretRef.current) {
        zaustavi();
      } else {
        pokreni();
      }
    };

    komandeRef.current = { pokreni, zaustavi };

    const resizeObserver = new ResizeObserver(izmeri);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      uViewportuRef.current = entry.isIntersecting;

      if (entry.isIntersecting) {
        pokreni();
      } else {
        zaustavi();
      }
    });

    resizeObserver.observe(viewport);
    resizeObserver.observe(grupa);
    intersectionObserver.observe(viewport);
    smanjenPokret.addEventListener("change", naPromenuPokreta);

    izmeri();
    naPromenuPokreta();

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      smanjenPokret.removeEventListener("change", naPromenuPokreta);
      zaustavi();
      komandeRef.current = null;
    };
  }, [primeniTransform]);

  /* Dok je predavač otvoren traka miruje: niko je ne vidi. */
  useEffect(() => {
    pauzaRef.current = pauza;

    if (pauza) {
      komandeRef.current?.zaustavi();
    } else {
      komandeRef.current?.pokreni();
    }
  }, [pauza]);

  const naPokazivacDole = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (centriranjeRef.current) return;

    pokazivacIdRef.current = event.pointerId;
    pocetakXRef.current = event.clientX;
    pocetakYRef.current = event.clientY;
    pocetniPomerajRef.current = pomerajRef.current;
    pomerioSeRef.current = false;
  };

  const naPokazivacPomeraj = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pokazivacIdRef.current !== event.pointerId) return;

    const pomerajX = event.clientX - pocetakXRef.current;
    const pomerajY = event.clientY - pocetakYRef.current;

    if (!prevlacenjeRef.current) {
      if (
        Math.abs(pomerajX) < PRAG_PREVLACENJA_PX ||
        Math.abs(pomerajX) <= Math.abs(pomerajY)
      ) {
        return;
      }

      prevlacenjeRef.current = true;
      pomerioSeRef.current = true;
      cekanjeAutoplayaRef.current = 0;
      komandeRef.current?.zaustavi();
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    pomerajRef.current = pocetniPomerajRef.current - pomerajX;
    primeniTransform();
  };

  const zavrsiPrevlacenje = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pokazivacIdRef.current !== event.pointerId) return;

    pokazivacIdRef.current = null;

    if (!prevlacenjeRef.current) return;

    prevlacenjeRef.current = false;
    cekanjeAutoplayaRef.current = NASTAVAK_AUTOPLAYA_MS / 1000;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    komandeRef.current?.pokreni();
  };

  /*
   * Klik na bilo koju radionicu: prvo je dovedemo u centar kadra, pa tek onda
   * puštamo prelaz na predavača. Tako lopta uvek nastaje na istom mestu i
   * animacija ostaje nepromenjena.
   */
  const naKlikStavke = (radionica: Radionica, globalniIndeks: number) => {
    if (pomerioSeRef.current) {
      pomerioSeRef.current = false;
      return;
    }

    if (!interaktivno || centriranjeRef.current) return;

    const korak = korakRef.current;
    const viewport = viewportRef.current;

    if (korak <= 0 || !viewport) {
      onOpen(radionica);
      return;
    }

    const renderPomeraj = sirinaGrupeRef.current + normalizovanPomeraj();
    const centarStavke =
      globalniIndeks * korak + sirinaStavkeRef.current / 2 - renderPomeraj;
    const razlika = centarStavke - viewport.clientWidth / 2;

    if (Math.abs(razlika) < 1 || smanjenPokretRef.current) {
      onOpen(radionica);
      return;
    }

    centriranjeRef.current = {
      od: pomerajRef.current,
      cilj: pomerajRef.current + razlika,
      proteklo: 0,
      radionica,
    };
    cekanjeAutoplayaRef.current = 0;
    komandeRef.current?.pokreni();
  };

  return (
    <div
      ref={viewportRef}
      className="radionice-traka"
      onPointerDown={naPokazivacDole}
      onPointerMove={naPokazivacPomeraj}
      onPointerUp={zavrsiPrevlacenje}
      onPointerCancel={zavrsiPrevlacenje}
    >
      <div ref={trakaRef} className="radionice-traka-niz">
        {Array.from({ length: BROJ_GRUPA }, (_, grupa) => (
          <div
            ref={grupa === 0 ? grupaRef : undefined}
            className="radionice-traka-grupa"
            key={grupa}
            aria-hidden={grupa === 0 ? undefined : true}
          >
            {RADIONICE.map((radionica, indeks) => {
              const globalniIndeks = grupa * RADIONICE.length + indeks;

              return (
                <button
                  type="button"
                  className={`radionice-stavka${
                    globalniIndeks === centarKljuc
                      ? " radionice-stavka--centar"
                      : ""
                  }`}
                  key={radionica.id}
                  onClick={() => naKlikStavke(radionica, globalniIndeks)}
                  aria-label={`Otvori detalje radionice ${radionica.fullName}`}
                  tabIndex={grupa === 0 ? undefined : -1}
                  disabled={!interaktivno}
                >
                  <img
                    src={radionica.icon}
                    alt=""
                    className="radionice-ikonica"
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                  />

                  <span className="radionice-naziv">{radionica.shortName}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

const Radionice = () => {
  const sekcijaRef = useRef<HTMLElement>(null);
  const [tranzicijaPrikaza, setTranzicijaPrikaza] =
    useState<TranzicijaPrikaza | null>(null);
  const tranzicijaPrikazaUToku = useRef(false);
  const [aktivniPredavacId, setAktivniPredavacId] = useState<number | null>(
    null,
  );
  const [otvorenaRadionica, setOtvorenaRadionica] = useState<Radionica | null>(
    null,
  );

  const predavacOtvoren = aktivniPredavacId !== null;
  /*
   * Tokom prelaza baza već drži NOVU boju pozadine. Stara pozadina stoji
   * preko nje i uvlači se u loptu, pa se time otkriva nova — novi papir posle
   * ulazi na već otkrivenu pozadinu.
   */
  const plavaPozadina = tranzicijaPrikaza
    ? tranzicijaPrikaza.smer === "to-speaker"
    : predavacOtvoren;

  /*
   * Y faktor lopte se računa iz stvarnih dimenzija papira. Oba papira (traka
   * radionica i list predavača) visoka su tačno koliko `--rd-stage-height`, a
   * široka koliko sekcija — odnos tih stranica se menja sa prozorom, pa fiksan
   * broj negde daje pljosnatu loptu. Cilj: zgužvani oblik otprilike kvadratan,
   * nikako viši nego širi.
   */
  const izracunajRazmereLopte = useCallback(() => {
    const sekcija = sekcijaRef.current;

    if (!sekcija) return;

    const traka = sekcija.querySelector<HTMLElement>(".radionice-band");

    if (!traka) return;

    const faktorX = Number.parseFloat(
      getComputedStyle(sekcija).getPropertyValue("--rd-view-ball-scale-x"),
    );

    if (!Number.isFinite(faktorX)) return;

    const sekcijaRect = sekcija.getBoundingClientRect();
    const trakaRect = traka.getBoundingClientRect();

    if (trakaRect.height <= 0) return;

    const ugao = (UGAO_LOPTE_STEPENI * Math.PI) / 180;
    const kutijaX = sekcijaRect.width;
    const kutijaY = trakaRect.height;
    const sirinaLopte =
      (kutijaX * Math.cos(ugao) + kutijaY * Math.sin(ugao)) * UDEO_OBLIKA_X;
    const visinaLopte =
      (kutijaX * Math.sin(ugao) + kutijaY * Math.cos(ugao)) * UDEO_OBLIKA_Y;

    sekcija.style.setProperty(
      "--rd-view-ball-scale-y",
      `${(faktorX * sirinaLopte * REZERVA_VISINE_LOPTE) / visinaLopte}`,
    );
  }, []);

  useEffect(() => {
    const sekcija = sekcijaRef.current;

    if (!sekcija) return;

    const resizeObserver = new ResizeObserver(izracunajRazmereLopte);

    resizeObserver.observe(sekcija);
    izracunajRazmereLopte();

    return () => resizeObserver.disconnect();
  }, [izracunajRazmereLopte]);

  const otvoriPredavaca = useCallback(
    (radionica: Radionica) => {
      if (tranzicijaPrikazaUToku.current) return;

      // Faktor mora da bude svez: prozor je mogao da se promeni od poslednjeg racuna.
      izracunajRazmereLopte();
      setOtvorenaRadionica(radionica);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setAktivniPredavacId(radionica.predavacId);
        return;
      }

      tranzicijaPrikazaUToku.current = true;
      setAktivniPredavacId(radionica.predavacId);
      setTranzicijaPrikaza({ faza: "crumpling", smer: "to-speaker" });
    },
    [izracunajRazmereLopte],
  );

  const zatvoriPredavaca = () => {
    if (aktivniPredavacId === null || tranzicijaPrikazaUToku.current) return;

    izracunajRazmereLopte();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAktivniPredavacId(null);
      setOtvorenaRadionica(null);
      return;
    }

    tranzicijaPrikazaUToku.current = true;
    setTranzicijaPrikaza({ faza: "crumpling", smer: "to-workshop" });
  };

  useEffect(() => {
    if (!tranzicijaPrikaza) return;
    if (
      tranzicijaPrikaza.smer === "to-workshop" &&
      tranzicijaPrikaza.faza === "unfolding"
    )
      return;

    const trajanje =
      tranzicijaPrikaza.faza === "crumpling"
        ? TRAJANJE_GUZVANJA_PRIKAZA_MS
        : tranzicijaPrikaza.faza === "exiting"
          ? TRAJANJE_IZLASKA_PRIKAZA_MS
          : tranzicijaPrikaza.faza === "entering"
            ? TRAJANJE_ULASKA_PRIKAZA_MS
            : TRAJANJE_OTVARANJA_PRIKAZA_MS;

    const tajmer = window.setTimeout(() => {
      if (tranzicijaPrikaza.faza === "crumpling") {
        // 1) Papir se skupčao u loptu i povukao staru pozadinu u sebe.
        setTranzicijaPrikaza({ ...tranzicijaPrikaza, faza: "exiting" });
      } else if (tranzicijaPrikaza.faza === "exiting") {
        // 2) Lopta je otišla udesno iz kadra.
        setTranzicijaPrikaza({ ...tranzicijaPrikaza, faza: "entering" });
      } else if (tranzicijaPrikaza.faza === "entering") {
        // 3) Nova lopta je stigla sa leve strane u centar.
        setTranzicijaPrikaza({ ...tranzicijaPrikaza, faza: "unfolding" });
      } else {
        setTranzicijaPrikaza(null);
        tranzicijaPrikazaUToku.current = false;
      }
    }, trajanje);

    return () => window.clearTimeout(tajmer);
  }, [tranzicijaPrikaza]);

  const zavrsiOtvaranjePapira = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;

    if (
      tranzicijaPrikaza?.smer === "to-workshop" &&
      tranzicijaPrikaza.faza === "unfolding" &&
      event.animationName === "rd-view-workshop-shape-unfold"
    ) {
      setAktivniPredavacId(null);
      setOtvorenaRadionica(null);
      setTranzicijaPrikaza(null);
      tranzicijaPrikazaUToku.current = false;
    }
  };

  return (
    <section
      ref={sekcijaRef}
      id="radionice"
      className={`radionice-page${
        predavacOtvoren ? " radionice-page--predavac-open" : ""
      }${
        tranzicijaPrikaza
          ? ` radionice-page--view-transition radionice-page--view-${tranzicijaPrikaza.smer}-${tranzicijaPrikaza.faza}`
          : ""
      }`}
    >
      <div
        className={`radionice-background-base${plavaPozadina ? " radionice-background-base--blue" : ""}`}
        aria-hidden="true"
      />
      {tranzicijaPrikaza && (
        <div
          className={`radionice-background-transition radionice-background-transition--${tranzicijaPrikaza.smer}`}
          aria-hidden="true"
        />
      )}
      <div
        className="radionice-default-view"
        aria-hidden={predavacOtvoren && !tranzicijaPrikaza}
      >
        <h1 className="radionice-title">Radionice</h1>

        <div className="radionice-band">
          <div className="radionice-paper-viewport" id="radionice-carousel">
            <div className="radionice-paper">
              <div
                className="radionice-paper-sheet"
                onAnimationEnd={zavrsiOtvaranjePapira}
              >
                <div className="radionice-paper-shape">
                  <RadionicePaperSurface />
                  <div className="radionice-paper-content">
                    <RadioniceTraka
                      pauza={predavacOtvoren || tranzicijaPrikaza !== null}
                      interaktivno={
                        !predavacOtvoren && tranzicijaPrikaza === null
                      }
                      onOpen={otvoriPredavaca}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {aktivniPredavacId !== null && otvorenaRadionica !== null && (
        <div className="radionice-predavac-view">
          <Predavac
            predavacId={aktivniPredavacId}
            workshopTitle={otvorenaRadionica.fullName}
            workshopIcon={otvorenaRadionica.icon}
            lecturers={otvorenaRadionica.lecturers}
            onClose={zatvoriPredavaca}
          />
        </div>
      )}
    </section>
  );
};

export default Radionice;
