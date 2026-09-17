import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type AnimationEvent,
  type CSSProperties,
  type TouchEvent,
} from "react";

import graphIcon from "@/assets/lupa.svg";
import csharpIcon from "@/assets/workshops/csharp-development.svg";
import marketingIcon from "@/assets/workshops/digital-marketing.svg";
import gameIcon from "@/assets/workshops/game-development.svg";
import cIcon from "@/assets/workshops/intro-to-c.svg";
import machineLearningIcon from "@/assets/workshops/machine-learning.svg";
import startupIcon from "@/assets/workshops/startup.svg";
import designIcon from "@/assets/workshops/ui-ux-design.svg";

import Predavac from "../predavac/Predavac";
import "./Radionice.scss";

interface Radionica {
  id: number;
  shortTitle: string;
  fullTitle: string;
  icon: string;
  predavacId: number;
}

// Graph je privremena ikonica za radionice za koje ZIP ne sadrži poseban SVG.
// Predavački podaci su još demonstracioni; naslov i ikonica detalja uvek dolaze odavde.
const RADIONICE: Radionica[] = [
  {
    id: 1,
    shortTitle: "UI/UX dizajn",
    fullTitle: "Figma & Wonder: UI/UX dizajn",
    icon: designIcon,
    predavacId: 4,
  },
  {
    id: 2,
    shortTitle: "C# Dev",
    fullTitle: "C# Development",
    icon: csharpIcon,
    predavacId: 2,
  },
  {
    id: 3,
    shortTitle: "Cybersecurity",
    fullTitle: "Cybersecurity",
    icon: graphIcon,
    predavacId: 1,
  },
  {
    id: 4,
    shortTitle: "CASE",
    fullTitle: "Case Method & Case Cracking",
    icon: graphIcon,
    predavacId: 4,
  },
  {
    id: 5,
    shortTitle: "Digitalni marketing",
    fullTitle: "Digitalni marketing koji prodaje",
    icon: marketingIcon,
    predavacId: 4,
  },
  {
    id: 6,
    shortTitle: "Uvod u C",
    fullTitle: "Uvod u C",
    icon: cIcon,
    predavacId: 2,
  },
  {
    id: 7,
    shortTitle: "Game Dev",
    fullTitle: "Game development",
    icon: gameIcon,
    predavacId: 2,
  },
  {
    id: 8,
    shortTitle: "AI agenti",
    fullTitle: "AI agenti u akciji",
    icon: graphIcon,
    predavacId: 3,
  },
  {
    id: 9,
    shortTitle: "Startup",
    fullTitle: "Startup 101: Od ideje do MVP-a",
    icon: startupIcon,
    predavacId: 4,
  },
  {
    id: 10,
    shortTitle: "Mašinsko učenje",
    fullTitle: "Analitika Starter Pack: Uvod u mašinsko učenje",
    icon: machineLearningIcon,
    predavacId: 3,
  },
];

const INTERVAL_ROTACIJE_MS = 3000;

const VIDLJIVI_POMERAJI = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

/* Isti prelom kao `$mobile` u src/styles/_mediaqueries.scss. */
const UPIT_MOBILNI = "(max-width: 768px)";

/*
 * Na telefonu karusel vodi korisnik prstom.
 * Swipe se računa samo ako je pokret pretežno horizontalan, da vertikalni
 * scroll kroz sekciju ostane netaknut.
 */
const MIN_SWIPE_PX = 40;

type SmerRadionice = "next" | "previous";
type FazaPrikaza = "crumpling" | "swapping" | "unfolding";

type SmerPrikaza = "to-speaker" | "to-workshop";
type TranzicijaPrikaza = {
  faza: FazaPrikaza;
  smer: SmerPrikaza;
};

/*
 * Prelaz između dve radionice je samo horizontalni slide traka ikonica.
 * Mora da ostane sinhron sa `--rd-trajanje-slajda` u Radionice.scss.
 */
const TRAJANJE_SLAJDA_MS = 420;

const TRAJANJE_GUZVANJA_PRIKAZA_MS = 380;
const TRAJANJE_ZAMENE_PRIKAZA_MS = 300;
const TRAJANJE_OTVARANJA_PRIKAZA_MS = 430;

type RadionicePaperProps = {
  indeks: number;
  interaktivno: boolean;
  onOpen: (radionica: Radionica) => void;
};

const RadionicePaperSurface = () => (
  <div className="radionice-paper-surface" aria-hidden="true" />
);

const RadionicePaper = ({ indeks, interaktivno, onOpen }: RadionicePaperProps) => (
  <div
    className="radionice-stage"
    style={{ "--rd-indeks": indeks } as CSSProperties}
  >
    {VIDLJIVI_POMERAJI.map((pomeraj) => {
      const virtuelniIndeks = indeks + pomeraj;
      const radionica =
        RADIONICE[
          ((virtuelniIndeks % RADIONICE.length) + RADIONICE.length) %
            RADIONICE.length
        ];
      const jeCentar = pomeraj === 0;

      return (
        <div
          key={virtuelniIndeks}
          className={`radionice-slot${jeCentar ? " radionice-slot--centar" : ""}`}
          style={{ "--rd-pozicija": virtuelniIndeks } as CSSProperties}
        >
          {jeCentar ? (
            <button
              type="button"
              className="radionice-icon-button"
              onClick={() => onOpen(radionica)}
              aria-label={`Otvori detalje radionice ${radionica.fullTitle}`}
              disabled={!interaktivno}
            >
              <img
                src={radionica.icon}
                alt=""
                className="radionice-ikonica"
                draggable={false}
              />
            </button>
          ) : (
            <img
              src={radionica.icon}
              alt=""
              className="radionice-ikonica"
              draggable={false}
            />
          )}

          <p className="radionice-naziv">{radionica.shortTitle}</p>
        </div>
      );
    })}
  </div>
);

const Radionice = () => {
  const radionicePageRef = useRef<HTMLElement>(null);
  const [aktivniIndeks, setAktivniIndeks] = useState(0);
  const [slajdUToku, setSlajdUToku] = useState(false);
  const [tranzicijaPrikaza, setTranzicijaPrikaza] =
    useState<TranzicijaPrikaza | null>(null);
  const tranzicijaPrikazaUToku = useRef(false);
  const [aktivniPredavacId, setAktivniPredavacId] = useState<number | null>(
    null,
  );
  const [otvorenaRadionica, setOtvorenaRadionica] = useState<Radionica | null>(null);
  const [pomerajCentraPrikaza, setPomerajCentraPrikaza] = useState(0);
  const [jeMobilni, setJeMobilni] = useState(
    () => typeof window !== "undefined" && window.matchMedia(UPIT_MOBILNI).matches,
  );
  const pocetakDodira = useRef<{ x: number; y: number } | null>(null);

  const predavacOtvoren = aktivniPredavacId !== null;
  const plavaPozadina = tranzicijaPrikaza
    ? tranzicijaPrikaza.smer === "to-speaker"
    : predavacOtvoren;

  const otvoriPredavaca = (radionica: Radionica) => {
    if (tranzicijaPrikazaUToku.current) return;
    setOtvorenaRadionica(radionica);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAktivniPredavacId(radionica.predavacId);
      return;
    }

    tranzicijaPrikazaUToku.current = true;
    setAktivniPredavacId(radionica.predavacId);
    setTranzicijaPrikaza({ faza: "crumpling", smer: "to-speaker" });
  };

  const zatvoriPredavaca = () => {
    if (aktivniPredavacId === null || tranzicijaPrikazaUToku.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAktivniPredavacId(null);
      setOtvorenaRadionica(null);
      return;
    }

    const radionicePapir = radionicePageRef.current?.querySelector<HTMLElement>(
      ".radionice-band",
    );
    const predavacPapir = radionicePageRef.current?.querySelector<HTMLElement>(
      ".predavac-content",
    );

    const radioniceRect = radionicePapir?.getBoundingClientRect();
    const predavacRect = predavacPapir?.getBoundingClientRect();
    setPomerajCentraPrikaza(
      radioniceRect && predavacRect
        ? predavacRect.top + predavacRect.height / 2 -
            radioniceRect.top - radioniceRect.height / 2
        : 0,
    );

    tranzicijaPrikazaUToku.current = true;
    setTranzicijaPrikaza({ faza: "crumpling", smer: "to-workshop" });
  };

  /*
   * Radionica -> radionica je čist horizontalni slide: samo se pomeri traka
   * ikonica. `slajdUToku` postoji da klik/auto-rotacija ne preskoče slide.
   */
  const promeniRadionicu = useCallback(
    (smer: SmerRadionice) => {
      if (slajdUToku || tranzicijaPrikazaUToku.current || predavacOtvoren) return;

      setAktivniIndeks((prethodni) => prethodni + (smer === "next" ? 1 : -1));

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      setSlajdUToku(true);
    },
    [predavacOtvoren, slajdUToku],
  );

  const zapocniDodir = (event: TouchEvent<HTMLDivElement>) => {
    const dodir = event.touches[0];
    pocetakDodira.current = dodir ? { x: dodir.clientX, y: dodir.clientY } : null;
  };

  const zavrsiDodir = (event: TouchEvent<HTMLDivElement>) => {
    const pocetak = pocetakDodira.current;
    pocetakDodira.current = null;

    const dodir = event.changedTouches[0];
    if (!pocetak || !dodir) return;

    const dx = dodir.clientX - pocetak.x;
    const dy = dodir.clientY - pocetak.y;
    if (Math.abs(dx) < MIN_SWIPE_PX || Math.abs(dx) <= Math.abs(dy)) return;

    promeniRadionicu(dx < 0 ? "next" : "previous");
  };

  useEffect(() => {
    const upit = window.matchMedia(UPIT_MOBILNI);
    const naPromenu = () => setJeMobilni(upit.matches);

    naPromenu();
    upit.addEventListener("change", naPromenu);

    return () => upit.removeEventListener("change", naPromenu);
  }, []);

  useEffect(() => {
    if (!slajdUToku) return;

    const tajmer = window.setTimeout(() => {
      setSlajdUToku(false);
    }, TRAJANJE_SLAJDA_MS);

    return () => window.clearTimeout(tajmer);
  }, [slajdUToku]);

  useEffect(() => {
    if (!tranzicijaPrikaza) return;
    if (
      tranzicijaPrikaza.smer === "to-workshop" &&
      tranzicijaPrikaza.faza === "unfolding"
    ) return;

    const trajanje =
      tranzicijaPrikaza.faza === "crumpling"
        ? TRAJANJE_GUZVANJA_PRIKAZA_MS
        : tranzicijaPrikaza.faza === "swapping"
          ? TRAJANJE_ZAMENE_PRIKAZA_MS
          : TRAJANJE_OTVARANJA_PRIKAZA_MS;

    const tajmer = window.setTimeout(() => {
      if (tranzicijaPrikaza.faza === "crumpling") {
        setTranzicijaPrikaza({ ...tranzicijaPrikaza, faza: "swapping" });
      } else if (tranzicijaPrikaza.faza === "swapping") {
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

  /* Auto-rotacija je samo desktop/tablet ponašanje; na telefonu vodi swipe. */
  useEffect(() => {
    if (jeMobilni || predavacOtvoren || slajdUToku || tranzicijaPrikaza) {
      return;
    }

    const tajmer = window.setInterval(() => {
      promeniRadionicu("next");
    }, INTERVAL_ROTACIJE_MS);

    return () => {
      window.clearInterval(tajmer);
    };
  }, [jeMobilni, predavacOtvoren, promeniRadionicu, slajdUToku, tranzicijaPrikaza]);

  return (
    <section
      ref={radionicePageRef}
      id="radionice"
      className={`radionice-page${
        predavacOtvoren ? " radionice-page--predavac-open" : ""
      }${
        tranzicijaPrikaza
          ? ` radionice-page--view-transition radionice-page--view-${tranzicijaPrikaza.smer}-${tranzicijaPrikaza.faza}`
          : ""
      }`}
      style={{ "--rd-view-center-offset-y": `${pomerajCentraPrikaza}px` } as CSSProperties}
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
      <div className="radionice-default-view" aria-hidden={predavacOtvoren && !tranzicijaPrikaza}>
        <h1 className="radionice-title">Radionice</h1>

        <div className="radionice-band">
          <div
            className="radionice-paper-viewport"
            id="radionice-carousel"
            onTouchStart={zapocniDodir}
            onTouchEnd={zavrsiDodir}
            onTouchCancel={() => {
              pocetakDodira.current = null;
            }}
          >
            <div className="radionice-paper">
              <div className="radionice-paper-sheet" onAnimationEnd={zavrsiOtvaranjePapira}>
                <div className="radionice-paper-shape">
                  <RadionicePaperSurface />
                  <div className="radionice-paper-content">
                    <RadionicePaper
                      indeks={aktivniIndeks}
                      interaktivno={!predavacOtvoren}
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
            workshopTitle={otvorenaRadionica.fullTitle}
            workshopIcon={otvorenaRadionica.icon}
            onClose={zatvoriPredavaca}
          />
        </div>
      )}
    </section>
  );
};

export default Radionice;
