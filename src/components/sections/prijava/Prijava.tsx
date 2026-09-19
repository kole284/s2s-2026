import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import "./Prijava.scss";

import type { NivoZnanja, PrijavaForma } from "./types";

import prijavaPaperMobile from "@/assets/prijava/decor/bela_pozadina_sa_reckama.svg";
import prijavaPaperDesktop from "@/assets/prijava/decor/Okvir-forme.svg";
import prijavaWorkshopPaper from "./components/workshop-paper.svg";
import prijavaStarLeft from "@/assets/prijava/decor/zvezda_levo.svg";
import prijavaStarRight from "@/assets/prijava/decor/zvezda_desno.svg";
import prijavaDesktopStar from "@/assets/prijava/decor/Vector-11.svg";
import rombImg from "@/assets/prijava/fields/romb.svg";
import prijavaButtonShell from "@/assets/prijava/fields/prijava-button-shell.svg";
import radionicaRequired from "@/assets/prijava/fields/radionica-required.svg";
import munjicaImg from "@/assets/prijava/icons/munjica.svg";
import prijavaCornerStars from "@/assets/prijava/decor/zvezde.svg";

const NASLOVI_KORAKA = ["PRIJAVI SE", "RADIONICE", "PANEL", "ISKUSTVA"];
const BROJEVI_GODINA = [
  { id: "1", label: "1." },
  { id: "2", label: "2." },
  { id: "3", label: "3." },
  { id: "4", label: "4." },
];
const OSTALE_GODINE = [
  { id: "Master", label: "Master studije" },
  { id: "Doktorske", label: "Doktorske studije" },
];
const RADIONICE = ["Radionica 1", "Radionica 2", "Radionica 3", "Radionica 4"];
const NIVOI_ZNANJA: NivoZnanja[] = ["Osnovni", "Srednji", "Napredni"];
const SMEROVI = ["ISIT", "Menadžment"];
// CONTENT GAP: partneri trenutno nemaju canonical data source za pokrovitelje.
const BROJ_POKROVITELJA = 1;

const RequiredStar = ({ className = "" }: { className?: string }) => (
  <img
    src={radionicaRequired}
    alt=""
    aria-hidden="true"
    className={`prijava-required-star ${className}`}
  />
);

type EraserScribbleVariant = "workshop" | "panel" | "experience";

const ERASER_SCRIBBLES = {
  workshop: {
    viewBox: "0 0 900 620",
    width: 900,
    height: 620,
    color: "#FFD720",
    strokeWidth: 7,
    opacity: 0.96,
    preserveAspectRatio: "xMidYMid meet",
    paths: [
      "M54 92 C176 38 358 40 510 80 C642 114 754 108 842 76 C758 128 630 148 500 140 C350 132 212 118 98 152 C58 164 44 182 66 194 C144 234 304 218 446 194 C604 166 734 176 838 214 C756 248 642 258 518 248 C376 238 244 230 132 258",
      "M86 286 C214 244 390 250 536 284 C666 314 770 306 840 276 C762 326 630 340 492 332 C352 324 214 320 106 352 C68 364 58 382 82 394 C174 430 332 410 474 388 C616 366 742 376 826 408",
      "M70 436 C198 398 370 404 520 440 C660 474 776 466 842 438 C768 492 632 508 492 496 C350 484 214 476 108 508 C66 520 54 540 78 552 C166 594 332 574 482 548 C628 524 754 534 834 570",
      "M146 58 C292 106 444 136 598 116 C716 100 794 110 836 138 C724 150 594 180 458 220 C326 258 206 270 118 248 C82 238 72 224 88 214 C130 188 252 198 374 228 C510 262 642 288 754 278 C804 274 830 288 836 308 C788 336 680 360 566 390 C430 426 302 456 194 474 C140 484 106 500 92 516",
      "M180 110 C286 82 398 88 494 118 C402 126 314 142 238 164 C318 154 420 162 518 184",
    ],
    eraserPath:
      "M35 42 C250 24 650 60 865 42 C882 62 882 92 865 112 C650 94 250 130 35 112 C18 132 18 162 35 182 C250 164 650 200 865 182 C882 202 882 232 865 252 C650 234 250 270 35 252 C18 272 18 302 35 322 C250 304 650 340 865 322 C882 342 882 372 865 392 C650 374 250 410 35 392 C18 412 18 442 35 462 C250 444 650 480 865 462 C882 482 882 512 865 532 C650 514 250 550 35 532 C18 552 18 582 35 598 C250 580 650 610 865 592",
    eraserStrokeWidth: 92,
  },
  panel: {
    viewBox: "0 0 900 300",
    width: 900,
    height: 300,
    color: "#2867D8",
    strokeWidth: 7,
    opacity: 0.96,
    preserveAspectRatio: "xMidYMid meet",
    paths: [
      "M54 72 C178 26 356 34 510 70 C646 102 762 96 842 66 C760 118 626 140 486 132 C344 124 208 116 102 150 C62 162 48 178 68 190 C150 228 310 212 456 188 C614 162 744 170 838 210 C754 246 622 260 480 250 C340 240 210 236 106 266",
      "M126 50 C266 88 420 106 570 88 C690 74 780 82 832 110 C724 126 598 150 466 182 C336 214 216 224 122 204 C88 196 76 184 90 174 C132 148 250 158 370 184 C506 214 638 234 750 226 C798 222 826 234 836 252",
      "M190 96 C284 70 386 76 470 104 C390 112 312 126 242 144",
      "M522 196 C620 176 706 182 770 206 C700 216 636 228 578 242",
    ],
    eraserPath:
      "M28 32 C240 16 660 48 872 32 C888 48 888 72 872 88 C660 72 240 104 28 88 C12 104 12 128 28 144 C240 128 660 160 872 144 C888 160 888 184 872 200 C660 184 240 216 28 200 C12 216 12 240 28 256 C240 240 660 272 872 256 C888 270 888 282 872 288 C660 278 240 294 28 280",
    eraserStrokeWidth: 72,
  },
  experience: {
    viewBox: "0 0 1200 280",
    width: 1200,
    height: 280,
    color: "#2F6FE4",
    strokeWidth: 7.5,
    opacity: 0.98,
    preserveAspectRatio: "none",
    paths: [
      "M38 58 C150 18 310 20 440 52 C580 86 720 96 850 76 C980 56 1090 46 1162 66 C1090 110 950 136 790 142 C620 148 450 130 300 126 C170 122 82 136 54 160 C32 180 76 198 166 206 C280 216 420 204 566 188 C724 170 870 168 994 184 C1094 196 1146 212 1162 230 C1092 254 964 260 822 250 C668 240 514 218 364 220 C224 222 112 238 54 252 C104 212 196 178 316 156 C462 130 624 122 778 108 C930 94 1068 78 1156 86 C1080 126 964 158 830 184 C682 212 530 232 388 244 C250 256 138 258 72 246 C142 220 248 198 374 184 C520 168 672 166 816 176 C958 186 1078 206 1148 232",
    ],
    eraserPath:
      "M28 28 C300 12 900 44 1172 28 C1188 44 1188 66 1172 82 C900 66 300 98 28 82 C12 98 12 120 28 136 C300 120 900 152 1172 136 C1188 152 1188 174 1172 190 C900 174 300 206 28 190 C12 206 12 228 28 244 C300 228 900 262 1172 244 C1188 258 1188 270 1172 274 C900 262 300 278 28 268",
    eraserStrokeWidth: 70,
  },
} as const;

type EraserScribbleProps = {
  variant: EraserScribbleVariant;
  locked: boolean;
  className: string;
};

const EraserScribble = ({
  variant,
  locked,
  className,
}: EraserScribbleProps) => {
  const maskId = `prijava-eraser-${useId().replace(/:/g, "")}`;
  const config = ERASER_SCRIBBLES[variant];

  return (
    <svg
      viewBox={config.viewBox}
      preserveAspectRatio={config.preserveAspectRatio}
      aria-hidden="true"
      focusable="false"
      className={`${className} prijava-eraser-scribble prijava-eraser-scribble--${variant} prijava-eraser-scribble--${locked ? "locked" : "unlocked"}`}
    >
      <defs>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width={config.width}
          height={config.height}
        >
          <rect
            width={config.width}
            height={config.height}
            fill="white"
          />
          <path
            className="prijava-eraser-scribble__eraser-path"
            d={config.eraserPath}
            pathLength="1"
            fill="none"
            stroke="black"
            strokeWidth={config.eraserStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </mask>
      </defs>

      <g
        mask={`url(#${maskId})`}
        fill="none"
        stroke={config.color}
        strokeWidth={config.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={config.opacity}
      >
        {config.paths.map((path, index) => (
          <path key={index} d={path} />
        ))}
      </g>
    </svg>
  );
};

type WorkshopSelectVisualProps = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  greska?: string;
  placeholder?: string;
  required?: boolean;
};

const WorkshopSelectVisual = ({
  value,
  options,
  onChange,
  greska,
  placeholder = "Izaberi radionicu",
  required = false,
}: WorkshopSelectVisualProps) => {
  const [otvoreno, setOtvoreno] = useState(false);
  const [aktivnaOpcija, setAktivnaOpcija] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const indeksIzabrane = Math.max(0, options.indexOf(value));

  const otvori = () => {
    setAktivnaOpcija(indeksIzabrane);
    setOtvoreno(true);
  };

  const zatvori = () => {
    setOtvoreno(false);
  };

  const toggle = () => {
    if (otvoreno) {
      zatvori();
    } else {
      otvori();
    }
  };

  const izaberi = (opcija: string) => {
    onChange(opcija);
    zatvori();
  };

  useEffect(() => {
    if (!otvoreno) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        zatvori();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [otvoreno]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      zatvori();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!otvoreno) {
        otvori();
        return;
      }

      setAktivnaOpcija((index) => Math.min(index + 1, options.length - 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!otvoreno) {
        otvori();
        return;
      }

      setAktivnaOpcija((index) => Math.max(index - 1, 0));
      return;
    }

    if (
      otvoreno &&
      (event.key === "Enter" || event.key === " ") &&
      document.activeElement?.classList.contains(
        "prijava-workshop-select__trigger",
      )
    ) {
      event.preventDefault();

      const opcija = options[aktivnaOpcija];

      if (opcija) {
        izaberi(opcija);
      }
    }
  };

  return (
    <div
      ref={rootRef}
      className="prijava-workshop-select"
      data-open={otvoreno}
      data-invalid={greska ? "true" : "false"}
      onKeyDown={handleKeyDown}
    >
      <div className="prijava-workshop-select__closed" aria-hidden={otvoreno}>
        <svg
          className="prijava-workshop-select__shadow"
          viewBox="0 0 287 58"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M5.53015 4.97252L277.122 0L286.339 10.5666L280.809 52.2114L10.4458 57.8055L0 46.6173L5.53015 4.97252Z"
            fill="#FFD720"
          />
        </svg>

        <svg
          className="prijava-workshop-select__frame"
          viewBox="0 0 291 57"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M11.0852 1H279.888L289.114 12.131L279.888 56H14.7587L1.11426 45.2504L11.0852 1Z"
            fill="white"
            stroke="black"
            strokeWidth="2"
          />
        </svg>

        {required && (
          <RequiredStar className="prijava-workshop-select__required prijava-field__required" />
        )}

        <span
          className={`prijava-workshop-select__value${
            value ? "" : " prijava-workshop-select__value--placeholder"
          }`}
        >
          {value || placeholder}
        </span>

        <span className="prijava-workshop-select__chevron" aria-hidden="true" />
      </div>

      {otvoreno ? (
        <div className="prijava-workshop-select__open" aria-hidden="false">
          <div className="prijava-workshop-select__menu-shell">
            <div
              id={listboxId}
              className="prijava-workshop-select__menu"
              role="listbox"
              aria-required={required}
              aria-label="Radionice"
            >
              {options.map((opcija, index) => (
                <button
                  key={opcija}
                  type="button"
                  role="option"
                  aria-selected={value === opcija}
                  className={`prijava-workshop-select__option${
                    value === opcija
                      ? " prijava-workshop-select__option--selected"
                      : ""
                  }${
                    aktivnaOpcija === index
                      ? " prijava-workshop-select__option--active"
                      : ""
                  }`}
                  onMouseEnter={() => setAktivnaOpcija(index)}
                  onFocus={() => setAktivnaOpcija(index)}
                  onClick={() => izaberi(opcija)}
                >
                  {opcija || "Bez druge želje"}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className="prijava-workshop-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={otvoreno}
        aria-controls={listboxId}
        aria-invalid={Boolean(greska)}
        aria-label={
          otvoreno
            ? "Zatvori izbor radionice"
            : `${placeholder}. Trenutno: ${value || "nije izabrano"}`
        }
        onClick={toggle}
      />
    </div>
  );
};

const jeFakultetFON = (fakultet: string) => {
  const normalizovanFakultet = fakultet.trim().toLocaleLowerCase("sr-Latn");

  return (
    normalizovanFakultet === "fon" ||
    normalizovanFakultet === "fakultet organizacionih nauka"
  );
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

const jeValidanEmail = (email: string) => EMAIL_REGEX.test(email.trim());

// Skladišti se bez razmaka, da ista osoba ne završi kao dve prijave.
const normalizujTelefon = (telefon: string) =>
  telefon.replace(/[\s()\-./]/g, "");

// Prihvata samo međunarodni format: + pozivni broj pa 7-14 cifara.
const jeValidanTelefon = (telefon: string) =>
  /^\+[1-9]\d{7,14}$/.test(normalizujTelefon(telefon));

const PRIMER_TELEFONA = "+381 60 123 4567";

type OsnovnoPolje = {
  id: string;
  label: string;
  type: "text" | "email" | "tel";
  field: "imePrezime" | "email" | "telefon" | "fakultet";
  autoComplete: string;
  placeholder?: string;
  inputMode?: "email" | "tel";
};

const OSNOVNA_POLJA: OsnovnoPolje[] = [
  {
    id: "prijava-ime-prezime",
    label: "Ime i prezime",
    type: "text",
    field: "imePrezime",
    autoComplete: "name",
  },
  {
    id: "prijava-email",
    label: "Mejl adresa",
    type: "email",
    field: "email",
    autoComplete: "email",
    placeholder: "ime@primer.com",
    inputMode: "email",
  },
  {
    id: "prijava-telefon",
    label: "Broj telefona",
    type: "tel",
    field: "telefon",
    autoComplete: "tel",
    placeholder: PRIMER_TELEFONA,
    inputMode: "tel",
  },
  {
    id: "prijava-fakultet",
    label: "Fakultet",
    type: "text",
    field: "fakultet",
    autoComplete: "organization",
  },
];

const tekstZaCV =
  BROJ_POKROVITELJA === 1
    ? "Ukoliko želiš da pokrovitelj projekta dobije tvoje kontakt podatke, priloži link ka svom CV-ju."
    : "Ukoliko želiš da pokrovitelji projekta dobiju tvoje kontakt podatke, priloži link ka svom CV-ju.";

const praznaForma: PrijavaForma = {
  imePrezime: "",
  email: "",
  telefon: "",
  fakultet: "",
  smer: "",
  godinaStudija: "",
  prvaZeljaRadionica: "",
  prvaZeljaNivoZnanja: "",
  prvaZeljaPrimena: "",
  drugaZeljaRadionica: "",
  drugaZeljaNivoZnanja: "",
  drugaZeljaPrimena: "",
  prisustvoPanelu: null,
  pitanjeZaPredavace: "",
  razloziZaS2S: "",
  ranijeUcestvovao: null,
  s2sIskustvo: "",
  predlogRadionice: "",
  cvDriveLink: "",
  zeliObavestenja: false,
};

type ApplicationPayload = {
  name_surname: string;
  email: string;
  phone_number: string;
  faculty: string;
  major?: string;
  study_year: string;
  previously_participated: boolean;
  s2s_experience: string;
  dream_workshop_topic: string;
  receive_fonis_updates: boolean;
  motivation: string;
  attend_panel_discussion: boolean;
  question_for_lecturers: string | null;
  first_workshop_choice: string | null;
  first_choice_reason: string | null;
  second_workshop_choice: string | null;
  second_choice_reason: string | null;
  cv_drive_link: string;
  accepted_workshop: null;
  accepted_choice: null;
};

type ExistingApplication = {
  email: string;
  phone_number: string;
};

const emptyToNull = (value: string) => {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

const supabaseHeaders = (publishableKey: string) => ({
  apikey: publishableKey,
  Authorization: `Bearer ${publishableKey}`,
  "Content-Type": "application/json",
});

const quoteFilterValue = (value: string) => {
  return `"${value.replaceAll('"', "")}"`;
};

const isGoogleDriveLink = (value: string) => {
  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }

    const host = url.hostname.toLowerCase().replace(/^www\./, "");

    return host === "drive.google.com" || host === "docs.google.com";
  } catch {
    return false;
  }
};

const buildPayload = (forma: PrijavaForma): ApplicationPayload => {
  return {
    name_surname: forma.imePrezime.trim(),
    email: forma.email.trim(),
    phone_number: normalizujTelefon(forma.telefon),
    faculty: forma.fakultet.trim(),
    ...(jeFakultetFON(forma.fakultet) ? { major: forma.smer.trim() } : {}),

    study_year: forma.godinaStudija.trim(),
    previously_participated: forma.ranijeUcestvovao ?? false,
    s2s_experience: forma.ranijeUcestvovao ? forma.s2sIskustvo.trim() : "",
    dream_workshop_topic: forma.predlogRadionice.trim(),
    receive_fonis_updates: forma.zeliObavestenja,
    motivation: forma.razloziZaS2S.trim(),
    attend_panel_discussion: forma.prisustvoPanelu ?? false,
    question_for_lecturers: forma.prisustvoPanelu
      ? emptyToNull(forma.pitanjeZaPredavace)
      : null,
    first_workshop_choice: emptyToNull(forma.prvaZeljaRadionica),
    first_choice_reason: emptyToNull(forma.prvaZeljaPrimena),
    second_workshop_choice: emptyToNull(forma.drugaZeljaRadionica),
    second_choice_reason: forma.drugaZeljaRadionica
      ? emptyToNull(forma.drugaZeljaPrimena)
      : null,
    cv_drive_link: forma.cvDriveLink.trim(),
    accepted_workshop: null,
    accepted_choice: null,
  };
};

const Prijava = () => {
  const [forma, setForma] = useState<PrijavaForma>(praznaForma);
  const [korak, setKorak] = useState(1);
  const [poslato, setPoslato] = useState(false);
  const [greske, setGreske] = useState<Record<string, string>>({});
  const [prikaziValidaciju, setPrikaziValidaciju] = useState(false);

  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");

  const [errorMessage, setErrorMessage] = useState("");
  const [duplicatePrompt, setDuplicatePrompt] = useState<string | null>(null);

  const ocistiGreske = (...polja: Array<keyof PrijavaForma>) => {
    setGreske((prev) => {
      const sledece = { ...prev };
      let promenjeno = false;

      polja.forEach((polje) => {
        const kljuc = String(polje);

        if (sledece[kljuc]) {
          delete sledece[kljuc];
          promenjeno = true;
        }
      });

      return promenjeno ? sledece : prev;
    });
  };

  const promeniPolje = <K extends keyof PrijavaForma>(
    polje: K,
    vrednost: PrijavaForma[K],
  ) => {
    setForma((prev) => ({ ...prev, [polje]: vrednost }));
    ocistiGreske(polje);
  };

  const promeniFakultet = (fakultet: string) => {
    setForma((prev) => ({
      ...prev,
      fakultet,
      smer: jeFakultetFON(fakultet) ? prev.smer : "",
    }));
    ocistiGreske("fakultet", "smer");
  };

  const promeniRanijeUcestvovao = (vrednost: boolean) => {
    setForma((prev) => ({
      ...prev,
      ranijeUcestvovao: vrednost,
      s2sIskustvo: vrednost ? prev.s2sIskustvo : "",
    }));
    ocistiGreske("ranijeUcestvovao", "s2sIskustvo");
  };

  const promeniPrisustvoPanelu = (vrednost: boolean) => {
    setForma((prev) => ({
      ...prev,
      prisustvoPanelu: vrednost,
      pitanjeZaPredavace: vrednost ? prev.pitanjeZaPredavace : "",
    }));
    ocistiGreske("prisustvoPanelu", "pitanjeZaPredavace");
  };

  const promeniPrvuZelju = (vrednost: string) => {
    setForma((prev) => ({
      ...prev,
      prvaZeljaRadionica: vrednost,
      ...(prev.drugaZeljaRadionica === vrednost
        ? {
            drugaZeljaRadionica: "",
            drugaZeljaNivoZnanja: "",
            drugaZeljaPrimena: "",
          }
        : {}),
    }));

    ocistiGreske(
      "prvaZeljaRadionica",
      "drugaZeljaRadionica",
      "drugaZeljaNivoZnanja",
      "drugaZeljaPrimena",
    );
  };

  const promeniDruguZelju = (vrednost: string) => {
    setForma((prev) => ({
      ...prev,
      drugaZeljaRadionica: vrednost,
      drugaZeljaNivoZnanja: "",
      drugaZeljaPrimena: "",
    }));
    ocistiGreske(
      "drugaZeljaRadionica",
      "drugaZeljaNivoZnanja",
      "drugaZeljaPrimena",
    );
  };

  const imaDruguRadionicu = Boolean(forma.drugaZeljaRadionica);
  const radioniceZaPrvuZelju = RADIONICE;
  const radioniceZaDruguZelju = [
    "",
    ...RADIONICE.filter((radionica) => radionica !== forma.prvaZeljaRadionica),
  ];

  const naziviPoljaZaGreske: Record<string, string> = {
    imePrezime: "Ime i prezime",
    email: "Email",
    telefon: "Broj telefona",
    fakultet: "Fakultet",
    smer: "Smer",
    godinaStudija: "Godina studija",
    prvaZeljaRadionica: "Prva želja — radionica",
    prvaZeljaNivoZnanja: "Prva želja — nivo znanja",
    prvaZeljaPrimena: "Prva želja — primena",
    drugaZeljaRadionica: "Druga želja — radionica",
    drugaZeljaNivoZnanja: "Druga želja — nivo znanja",
    drugaZeljaPrimena: "Druga želja — primena",
    prisustvoPanelu: "Panel diskusija",
    pitanjeZaPredavace: "Pitanje za predavače",
    razloziZaS2S: "Razlozi za S2S",
    ranijeUcestvovao: "Prethodno učešće",
    s2sIskustvo: "S2S iskustvo",
  };

  const greskeZaPopup = Object.entries(greske).map(([polje, poruka]) => ({
    polje,
    naslov: naziviPoljaZaGreske[polje] ?? polje,
    poruka,
  }));

  const validirajKorak = (proveriKorak = korak): boolean => {
    const greskeKorak: Record<string, string> = {};

    if (proveriKorak === 1) {
      if (!forma.imePrezime.trim()) {
        greskeKorak.imePrezime = "Ime i prezime je obavezno.";
      }

      if (!forma.email.trim()) {
        greskeKorak.email = "Email je obavezan.";
      } else if (!jeValidanEmail(forma.email)) {
        greskeKorak.email = "Unesi validnu mejl adresu (npr. ime@primer.com).";
      }

      if (!forma.telefon.trim()) {
        greskeKorak.telefon = "Broj telefona je obavezan.";
      } else if (!jeValidanTelefon(forma.telefon)) {
        greskeKorak.telefon = `Unesi broj u međunarodnom formatu, sa + i pozivnim brojem (npr. ${PRIMER_TELEFONA}).`;
      }

      if (!forma.fakultet.trim()) {
        greskeKorak.fakultet = "Fakultet je obavezan.";
      }

      if (jeFakultetFON(forma.fakultet) && !forma.smer) {
        greskeKorak.smer = "Smer je obavezan.";
      }

      if (!forma.godinaStudija) {
        greskeKorak.godinaStudija = "Godina studija je obavezna.";
      }
    } else if (proveriKorak === 2) {
      if (!forma.prvaZeljaRadionica) {
        greskeKorak.prvaZeljaRadionica = "Izaberi glavnu radionicu.";
      }
      if (!forma.prvaZeljaNivoZnanja) {
        greskeKorak.prvaZeljaNivoZnanja = "Izaberi nivo znanja.";
      }

      if (!forma.prvaZeljaPrimena.trim()) {
        greskeKorak.prvaZeljaPrimena = "Ovo polje je obavezno.";
      }

      if (
        imaDruguRadionicu &&
        forma.drugaZeljaRadionica === forma.prvaZeljaRadionica
      ) {
        greskeKorak.drugaZeljaRadionica =
          "Druga radionica mora biti različita od prve.";
      } else if (imaDruguRadionicu) {
        if (!forma.drugaZeljaNivoZnanja) {
          greskeKorak.drugaZeljaNivoZnanja = "Izaberi nivo znanja.";
        }

        if (!forma.drugaZeljaPrimena.trim()) {
          greskeKorak.drugaZeljaPrimena = "Ovo polje je obavezno.";
        }
      }
    } else if (proveriKorak === 3) {
      if (forma.prisustvoPanelu === null) {
        greskeKorak.prisustvoPanelu =
          "Odgovori da li bi prisustvovao/la panelu.";
      }

      if (!forma.razloziZaS2S.trim()) {
        greskeKorak.razloziZaS2S = "Ovo polje je obavezno.";
      }
    } else if (proveriKorak === 4) {
      if (forma.ranijeUcestvovao === null) {
        greskeKorak.ranijeUcestvovao = "Odgovori da li si ranije učestvovao.";
      }
    }

    setGreske(greskeKorak);

    const imaGresaka = Object.keys(greskeKorak).length > 0;
    setPrikaziValidaciju(imaGresaka);

    return !imaGresaka;
  };

  const sledeciKorak = () => {
    if (validirajKorak()) {
      setKorak((k) => Math.min(k + 1, 4));
    }
  };

  const prethodniKorak = () => {
    setPrikaziValidaciju(false);
    setKorak((k) => Math.max(k - 1, 1));
  };

  useEffect(() => {
    if (!prikaziValidaciju) {
      return;
    }

    const zatvoriNaEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setPrikaziValidaciju(false);
      }
    };

    document.addEventListener("keydown", zatvoriNaEscape);

    return () => {
      document.removeEventListener("keydown", zatvoriNaEscape);
    };
  }, [prikaziValidaciju]);

  const getSupabaseConfig = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabasePublishableKey = import.meta.env
      .VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabasePublishableKey) {
      throw new Error(
        "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY.",
      );
    }

    return {
      supabaseUrl,
      supabasePublishableKey,
    };
  };

  const findExistingApplication = async (
    supabaseUrl: string,
    supabasePublishableKey: string,
    email: string,
    phoneNumber: string,
  ) => {
    const params = new URLSearchParams({
      or: `(email.ilike.${quoteFilterValue(
        email,
      )},phone_number.eq.${quoteFilterValue(phoneNumber)})`,
      select: "email,phone_number",
    });

    const response = await fetch(
      `${supabaseUrl}/rest/v1/Application?${params.toString()}`,
      {
        headers: supabaseHeaders(supabasePublishableKey),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(errorText || `Request failed with ${response.status}`);
    }

    const rows = (await response.json()) as ExistingApplication[];

    const zauzetEmail = rows.some(
      (row) => row.email.toLowerCase() === email.toLowerCase(),
    );

    const zauzetTelefon = rows.some((row) => row.phone_number === phoneNumber);

    if (zauzetEmail && zauzetTelefon) {
      return "Već postoji prijava sa ovom mejl adresom i ovim brojem telefona.";
    }

    if (zauzetEmail) {
      return "Već postoji prijava sa ovom mejl adresom.";
    }

    if (zauzetTelefon) {
      return "Već postoji prijava sa ovim brojem telefona.";
    }

    return null;
  };

  const createApplication = async (
    supabaseUrl: string,
    supabasePublishableKey: string,
    payload: ApplicationPayload,
  ) => {
    const response = await fetch(`${supabaseUrl}/rest/v1/Application`, {
      method: "POST",
      headers: {
        ...supabaseHeaders(supabasePublishableKey),
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(errorText || `Request failed with ${response.status}`);
    }
  };

  const posaljiPrijavu = async () => {
    for (let proveriKorak = 1; proveriKorak <= 4; proveriKorak++) {
      if (!validirajKorak(proveriKorak)) {
        setKorak(proveriKorak);
        return;
      }
    }

    setStatus("submitting");
    setErrorMessage("");
    setDuplicatePrompt(null);

    const payload = buildPayload(forma);

    // CV je opcion, ali ako je unet mora biti Google Drive link.
    if (payload.cv_drive_link && !isGoogleDriveLink(payload.cv_drive_link)) {
      setStatus("error");
      setErrorMessage("Unesite validan Google Drive link.");
      return;
    }

    try {
      const { supabaseUrl, supabasePublishableKey } = getSupabaseConfig();

      const existing = await findExistingApplication(
        supabaseUrl,
        supabasePublishableKey,
        payload.email,
        payload.phone_number,
      );

      if (existing) {
        setStatus("idle");
        setDuplicatePrompt(existing);

        return;
      }

      await createApplication(supabaseUrl, supabasePublishableKey, payload);

      setStatus("idle");
      setPoslato(true);
      setForma(praznaForma);
      setGreske({});
      setKorak(1);
    } catch (error) {
      setStatus("error");

      setErrorMessage(
        error instanceof Error ? error.message : "Prijava nije poslata.",
      );
    }
  };

  const zatvoriObavestenjeODuplikatu = () => {
    setDuplicatePrompt(null);
    setStatus("idle");
  };

  if (poslato) {
    return (
      <section className="prijava" id="prijava">
        <div className="prijava__scroll-content">
          <div className="prijava__canvas">
            <div className="prijava__mobile-s2s-band" aria-hidden="true">
              <div className="prijava__mobile-s2s-ribbon">
                <div className="prijava__mobile-s2s-track">
                  <span className="prijava__mobile-s2s-sequence">
                    S2S2S2S2S2S2S2S2S
                  </span>
                  <span className="prijava__mobile-s2s-sequence">
                    S2S2S2S2S2S2S2S2S
                  </span>
                </div>
              </div>
            </div>
            <div className="prijava__side-shapes" aria-hidden="true">
              <span className="prijava__side-shape prijava__side-shape--blue-left" />
              <span className="prijava__side-shape prijava__side-shape--yellow-left" />
              <span className="prijava__side-shape prijava__side-shape--blue-right" />
              <span className="prijava__side-shape prijava__side-shape--yellow-right" />
            </div>

            <img
              src={prijavaStarLeft}
              alt=""
              className="prijava__star prijava__star--left"
              aria-hidden="true"
            />

            <img
              src={prijavaStarRight}
              alt=""
              className="prijava__star prijava__star--right"
              aria-hidden="true"
            />

            <img
              src={prijavaDesktopStar}
              alt=""
              className="prijava__star prijava__star--desktop prijava__star--left"
              aria-hidden="true"
            />

            <img
              src={prijavaDesktopStar}
              alt=""
              className="prijava__star prijava__star--desktop prijava__star--right"
              aria-hidden="true"
            />

            <div className="prijava__paper-shell prijava__paper-shell--success">
              <img
                src={prijavaPaperMobile}
                alt=""
                className="prijava__paper prijava__paper--mobile"
                aria-hidden="true"
              />
              <img
                src={prijavaPaperDesktop}
                alt=""
                className="prijava__paper prijava__paper--desktop"
                aria-hidden="true"
              />

              <div className="prijava__header" aria-hidden="true">
                <span className="prijava__header-yellow" />
                <span className="prijava__header-line" />
              </div>

              <div className="prijava__success">
                <h1 className="prijava__title">USPEŠNO!</h1>
                <p className="prijava_uspeh_tekst">
                  Tvoja prijava je zabeležena. Proveri svoj email – tamo ćeš
                  dobiti jedinstveni kod za pristup igrici.
                </p>
              </div>
            </div>

            <img
              src={prijavaCornerStars}
              alt=""
              className="prijava__mobile-corner-stars"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="prijava" id="prijava">
      <div className="prijava__scroll-content">
        <div className="prijava__canvas">
          <div className="prijava__mobile-s2s-band" aria-hidden="true">
            <div className="prijava__mobile-s2s-ribbon">
              <div className="prijava__mobile-s2s-track">
                <span className="prijava__mobile-s2s-sequence">
                  S2S2S2S2S2S2S2S2S
                </span>
                <span className="prijava__mobile-s2s-sequence">
                  S2S2S2S2S2S2S2S2S
                </span>
              </div>
            </div>
          </div>
          <div className="prijava__side-shapes" aria-hidden="true">
            <span className="prijava__side-shape prijava__side-shape--blue-left" />
            <span className="prijava__side-shape prijava__side-shape--yellow-left" />
            <span className="prijava__side-shape prijava__side-shape--blue-right" />
            <span className="prijava__side-shape prijava__side-shape--yellow-right" />
          </div>

          <img
            src={prijavaStarLeft}
            alt=""
            className="prijava__star prijava__star--left"
            aria-hidden="true"
          />

          <img
            src={prijavaStarRight}
            alt=""
            className="prijava__star prijava__star--right"
            aria-hidden="true"
          />

          <img
            src={prijavaDesktopStar}
            alt=""
            className="prijava__star prijava__star--desktop prijava__star--left"
            aria-hidden="true"
          />

          <img
            src={prijavaDesktopStar}
            alt=""
            className="prijava__star prijava__star--desktop prijava__star--right"
            aria-hidden="true"
          />

          <div className="prijava__paper-shell">
            <img
              src={prijavaPaperMobile}
              alt=""
              className="prijava__paper prijava__paper--mobile"
              aria-hidden="true"
            />
            <img
              src={korak === 2 ? prijavaWorkshopPaper : prijavaPaperDesktop}
              alt=""
              className="prijava__paper prijava__paper--desktop"
              aria-hidden="true"
            />

            <header className="prijava__header">
              <span className="prijava__header-yellow" aria-hidden="true" />

              <h1 className="prijava__title">{NASLOVI_KORAKA[korak - 1]}</h1>

              <span className="prijava__header-line" aria-hidden="true" />
            </header>

            <div className="prijava__form-area">
              <div className="prijava_sadrzaj">
                {korak === 1 ? (
                  <div className="form_step form_step--1">
                    <div className="prijava-step1__fields">
                      {OSNOVNA_POLJA.map(({
                        id,
                        label,
                        type,
                        field,
                        autoComplete,
                        placeholder,
                        inputMode,
                      }) => {
                        const key = field;
                        const error = greske[key];

                        return (
                          <div
                            key={id}
                            className={`prijava-field${
                              forma[key].trim() ? " prijava-field--filled" : ""
                            }${error ? " prijava-field--error" : ""}`}
                          >
                            <label
                              className="prijava-field__label"
                              htmlFor={id}
                            >
                              {label}
                            </label>
                            <div className="prijava-field__control">
                              <input
                                id={id}
                                className="prijava-field__input"
                                type={type}
                                required
                                autoComplete={autoComplete}
                                placeholder={placeholder}
                                inputMode={inputMode}
                                value={forma[key]}
                                onChange={(event) =>
                                  key === "fakultet"
                                    ? promeniFakultet(event.target.value)
                                    : promeniPolje(key, event.target.value)
                                }
                                aria-invalid={Boolean(error)}
                              />
                            </div>
                            <RequiredStar className="prijava-field__required" />
                          </div>
                        );
                      })}
                    </div>

                    {jeFakultetFON(forma.fakultet) ? (
                      <div
                        className={`prijava_smer-sekcija${
                          greske.smer ? " prijava_smer-sekcija--greska" : ""
                        }`}
                      >
                        <div className="prijava_smer-heading">
                          <p className="prijava_labela">Smer</p>
                          <RequiredStar className="prijava_required-marker" />
                        </div>
                        <div
                          className="prijava_opcije"
                          role="radiogroup"
                          aria-label="Smer"
                          aria-required="true"
                          aria-invalid={Boolean(greske.smer)}
                        >
                          {SMEROVI.map((smer) => (
                            <button
                              key={smer}
                              type="button"
                              className={`prijava_opcija ${forma.smer === smer ? "prijava_opcija-aktivna" : ""}`}
                              onClick={() => promeniPolje("smer", smer)}
                              role="radio"
                              aria-checked={forma.smer === smer}
                            >
                              {smer}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div
                      className={`prijava_godina-sekcija${
                        greske.godinaStudija
                          ? " prijava_godina-sekcija--greska"
                          : ""
                      }`}
                    >
                      <div className="prijava_godina-heading">
                        <p className="prijava_labela">Godina studija</p>
                        <RequiredStar className="prijava_required-marker" />
                      </div>
                      <div
                        className="prijava_godina-kontejner"
                        role="radiogroup"
                        aria-label="Godina studija"
                        aria-required="true"
                        aria-invalid={Boolean(greske.godinaStudija)}
                      >
                        <div className="prijava_godina-mrezica-brojevi">
                          {BROJEVI_GODINA.map((godina) => (
                            <button
                              key={godina.id}
                              type="button"
                              className="prijava_godina-polje-vertikalno"
                              onClick={() =>
                                promeniPolje("godinaStudija", godina.id)
                              }
                              role="radio"
                              aria-checked={forma.godinaStudija === godina.id}
                            >
                              <span
                                className="prijava_godina-box-wrapper"
                                aria-hidden="true"
                              >
                                <img
                                  src={rombImg}
                                  alt=""
                                  className="prijava_godina-romb-img"
                                />
                                {forma.godinaStudija === godina.id ? (
                                  <img
                                    src={munjicaImg}
                                    alt=""
                                    className="prijava_godina-bolt"
                                  />
                                ) : null}
                              </span>
                              <span className="prijava_godina-tekst">
                                {godina.label}
                              </span>
                            </button>
                          ))}
                        </div>
                        <div className="prijava_godina-mrezica-ostalo">
                          {OSTALE_GODINE.map((godina) => (
                            <button
                              key={godina.id}
                              type="button"
                              className="prijava_godina-polje-horizontalno"
                              onClick={() =>
                                promeniPolje("godinaStudija", godina.id)
                              }
                              role="radio"
                              aria-checked={forma.godinaStudija === godina.id}
                            >
                              <span className="prijava_godina-tekst">
                                {godina.label}
                              </span>
                              <span
                                className="prijava_godina-box-wrapper"
                                aria-hidden="true"
                              >
                                <img
                                  src={rombImg}
                                  alt=""
                                  className="prijava_godina-romb-img"
                                />
                                {forma.godinaStudija === godina.id ? (
                                  <img
                                    src={munjicaImg}
                                    alt=""
                                    className="prijava_godina-bolt"
                                  />
                                ) : null}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {korak === 2 ? (
                  <div className="form_step form_step--2">
                    <div className="prijava-workshops">
                      <section className="prijava-workshop-card prijava-workshop-card--primary">
                        <div className="prijava-workshop-card__heading">
                          <span
                            className="prijava-workshop-card__number"
                            aria-hidden="true"
                          >
                            01
                          </span>
                          <h2 className="prijava-workshop-card__title">
                            PRVA ŽELJA
                          </h2>
                        </div>

                        <WorkshopSelectVisual
                          required
                          value={forma.prvaZeljaRadionica}
                          options={radioniceZaPrvuZelju}
                          onChange={promeniPrvuZelju}
                          greska={greske.prvaZeljaRadionica}
                        />

                        <div className="prijava-workshop-details">
                          <div className="prijava-workshop-field">
                            <div className="prijava-workshop-label prijava-workshop-label--level">
                              <span>Nivo znanja iz ove oblasti</span>
                              <RequiredStar className="prijava-field__required prijava-required-star--edge" />
                            </div>

                            <div
                              className="prijava-workshop-levels"
                              role="radiogroup"
                              aria-label="Nivo znanja za prvu želju"
                              aria-required="true"
                              aria-invalid={Boolean(greske.prvaZeljaNivoZnanja)}
                            >
                              {NIVOI_ZNANJA.map((nivo) => (
                                <button
                                  key={nivo}
                                  type="button"
                                  className={`prijava_opcija prijava-workshop-level ${
                                    forma.prvaZeljaNivoZnanja === nivo
                                      ? "prijava_opcija-aktivna"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    promeniPolje("prvaZeljaNivoZnanja", nivo)
                                  }
                                  role="radio"
                                  aria-checked={
                                    forma.prvaZeljaNivoZnanja === nivo
                                  }
                                >
                                  {nivo}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="prijava-workshop-field">
                            <label
                              className="prijava-workshop-label prijava-workshop-label--question"
                              htmlFor="prijava-prva-primena"
                            >
                              <span>
                                Šta bi želeo/la da naučiš na radionici i kako
                                vidiš primenu stečenog znanja?
                              </span>
                              <RequiredStar className="prijava-field__required prijava-required-star--edge" />
                            </label>

                            <div
                              className={`prijava-workshop-textarea-shell${
                                greske.prvaZeljaPrimena
                                  ? " prijava-workshop-textarea-shell--error"
                                  : ""
                              }`}
                            >
                              <textarea
                                id="prijava-prva-primena"
                                required
                                className="prijava_textarea prijava-workshop-textarea"
                                rows={4}
                                value={forma.prvaZeljaPrimena}
                                onChange={(event) =>
                                  promeniPolje(
                                    "prvaZeljaPrimena",
                                    event.target.value,
                                  )
                                }
                                placeholder="Upiši..."
                                aria-invalid={Boolean(greske.prvaZeljaPrimena)}
                              />
                            </div>
                          </div>
                        </div>
                      </section>

                      <section className="prijava-workshop-card prijava-workshop-card--secondary">
                        <div className="prijava-workshop-card__heading">
                          <span
                            className="prijava-workshop-card__number"
                            aria-hidden="true"
                          >
                            02
                          </span>
                          <h2 className="prijava-workshop-card__title">
                            DRUGA ŽELJA
                          </h2>
                        </div>

                        <WorkshopSelectVisual
                          value={forma.drugaZeljaRadionica}
                          options={radioniceZaDruguZelju}
                          onChange={promeniDruguZelju}
                          greska={greske.drugaZeljaRadionica}
                        />

                        <div
                          className={`prijava-workshop-details prijava-workshop-details--conditional${
                            imaDruguRadionicu
                              ? ""
                              : " prijava-workshop-details--locked prijava-workshop-conditional--locked"
                          }`}
                          aria-disabled={!imaDruguRadionicu}
                        >
                          <div className="prijava-workshop-field">
                            <div className="prijava-workshop-label prijava-workshop-label--level">
                              <span>Nivo znanja iz ove oblasti</span>
                              {imaDruguRadionicu && (
                                <RequiredStar className="prijava-field__required prijava-required-star--edge" />
                              )}
                            </div>

                            <div
                              className="prijava-workshop-levels"
                              role="radiogroup"
                              aria-label="Nivo znanja za drugu želju"
                              aria-required={imaDruguRadionicu}
                              aria-invalid={Boolean(
                                greske.drugaZeljaNivoZnanja,
                              )}
                            >
                              {NIVOI_ZNANJA.map((nivo) => (
                                <button
                                  key={nivo}
                                  type="button"
                                  className={`prijava_opcija prijava-workshop-level ${
                                    forma.drugaZeljaNivoZnanja === nivo
                                      ? "prijava_opcija-aktivna"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    promeniPolje("drugaZeljaNivoZnanja", nivo)
                                  }
                                  disabled={!imaDruguRadionicu}
                                  role="radio"
                                  aria-checked={
                                    forma.drugaZeljaNivoZnanja === nivo
                                  }
                                >
                                  {nivo}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="prijava-workshop-field">
                            <label
                              className="prijava-workshop-label prijava-workshop-label--question"
                              htmlFor="prijava-druga-primena"
                            >
                              <span>
                                Šta bi želeo/la da naučiš na radionici i kako
                                vidiš primenu stečenog znanja?
                              </span>
                              {imaDruguRadionicu && (
                                <RequiredStar className="prijava-field__required prijava-required-star--edge" />
                              )}
                            </label>

                            <div
                              className={`prijava-workshop-textarea-shell${
                                greske.drugaZeljaPrimena
                                  ? " prijava-workshop-textarea-shell--error"
                                  : ""
                              }`}
                            >
                              <textarea
                                id="prijava-druga-primena"
                                required={imaDruguRadionicu}
                                className="prijava_textarea prijava-workshop-textarea"
                                rows={4}
                                value={forma.drugaZeljaPrimena}
                                onChange={(event) =>
                                  promeniPolje(
                                    "drugaZeljaPrimena",
                                    event.target.value,
                                  )
                                }
                                placeholder="Upiši..."
                                disabled={!imaDruguRadionicu}
                                aria-invalid={Boolean(greske.drugaZeljaPrimena)}
                              />
                            </div>
                          </div>
                          <EraserScribble
                            variant="workshop"
                            locked={!imaDruguRadionicu}
                            className="prijava-workshop-scribble"
                          />
                        </div>
                      </section>
                    </div>
                  </div>
                ) : null}

                {korak === 3 ? (
                  <div className="form_step form_step--3">
                    <div className="prijava-panel-layout">
                      <div className="prijava-panel-main">
                        <section
                          className={`prijava-panel-attendance${
                            greske.prisustvoPanelu
                              ? " prijava-panel-attendance--error"
                              : ""
                          }`}
                        >
                          <div className="prijava-panel-attendance__content">
                            <h2 className="prijava-panel-attendance__title prijava-panel-attendance__title--ribbon">
                              Da li bi prisustvovao/la panel diskusiji?
                              <RequiredStar className="prijava-field__required prijava-required-star--edge" />
                            </h2>
                          </div>

                          <div
                            className="prijava-panel-choice"
                            role="radiogroup"
                            aria-label="Prisustvo panel diskusiji"
                            aria-required="true"
                            aria-invalid={Boolean(greske.prisustvoPanelu)}
                          >
                            <button
                              type="button"
                              className={`prijava-panel-choice__button${
                                forma.prisustvoPanelu === true
                                  ? " prijava-panel-choice__button--active"
                                  : ""
                              }`}
                              onClick={() => promeniPrisustvoPanelu(true)}
                              role="radio"
                              aria-checked={forma.prisustvoPanelu === true}
                            >
                              DA
                            </button>

                            <button
                              type="button"
                              className={`prijava-panel-choice__button${
                                forma.prisustvoPanelu === false
                                  ? " prijava-panel-choice__button--active"
                                  : ""
                              }`}
                              onClick={() => promeniPrisustvoPanelu(false)}
                              role="radio"
                              aria-checked={forma.prisustvoPanelu === false}
                            >
                              NE
                            </button>
                          </div>
                        </section>

                        <section
                          className={`prijava-panel-block prijava-panel-block--question prijava-panel-block--panel-question${
                            forma.prisustvoPanelu === true
                              ? ""
                              : " prijava-panel-block--inactive"
                          }`}
                          aria-disabled={forma.prisustvoPanelu !== true}
                        >
                          <label
                            id="prijava-pitanje-predavaci-label"
                            className="prijava-panel-block__description prijava-panel-block__description--reasons-question prijava-panel-block__description--panel-question-ribbon"
                            htmlFor="prijava-pitanje-predavaci"
                          >
                            Koje pitanje bi postavio/la predavačima?
                          </label>

                          <div className="prijava-panel-textarea-shell prijava-panel-textarea-shell--question">
                            <textarea
                              id="prijava-pitanje-predavaci"
                              aria-labelledby="prijava-pitanje-predavaci-label"
                              className="prijava-panel-textarea prijava-panel-textarea--question"
                              rows={6}
                              value={forma.pitanjeZaPredavace}
                              onChange={(event) =>
                                promeniPolje(
                                  "pitanjeZaPredavace",
                                  event.target.value,
                                )
                              }
                              placeholder={
                                forma.prisustvoPanelu === true
                                  ? "Upiši pitanje..."
                                  : "Izaberi DA ako želiš da postaviš pitanje predavačima."
                              }
                              disabled={forma.prisustvoPanelu !== true}
                            />
                            <EraserScribble
                              variant="panel"
                              locked={forma.prisustvoPanelu !== true}
                              className="prijava-scribble-overlay prijava-scribble-overlay--panel"
                            />
                          </div>
                        </section>
                      </div>

                      <section
                        className={`prijava-panel-block prijava-panel-block--reasons${
                          greske.razloziZaS2S
                            ? " prijava-panel-block--error"
                            : ""
                        }`}
                      >
                        <label
                          className="prijava-panel-block__description prijava-panel-block__description--reasons-question"
                          htmlFor="prijava-razlozi-s2s"
                        >
                          Navedi tri razloga zbog kojih želiš da budeš deo S2S-a
                          ove godine.
                          <RequiredStar className="prijava-field__required prijava-required-star--edge" />
                        </label>

                        <div
                          className={`prijava-panel-textarea-shell prijava-panel-textarea-shell--reasons${
                            greske.razloziZaS2S
                              ? " prijava-panel-textarea-shell--error"
                              : ""
                          }`}
                        >
                          <textarea
                            id="prijava-razlozi-s2s"
                            required
                            className="prijava-panel-textarea prijava-panel-textarea--reasons"
                            rows={4}
                            value={forma.razloziZaS2S}
                            onChange={(event) =>
                              promeniPolje("razloziZaS2S", event.target.value)
                            }
                            placeholder={"1. ...\n2. ...\n3. ..."}
                            aria-invalid={Boolean(greske.razloziZaS2S)}
                          />
                        </div>
                      </section>
                    </div>
                  </div>
                ) : null}

                {korak === 4 ? (
                  <div className="form_step form_step--4">
                    <div className="prijava-experience-layout">
                      <div className="prijava-experience-left">
                        <section
                          className={`prijava-experience-card prijava-experience-card--participation${
                            greske.ranijeUcestvovao
                              ? " prijava-experience-card--error"
                              : ""
                          }`}
                        >
                          <p className="prijava-experience-ribbon">
                            Da li si ranije učestvovao/la na S2S-u?
                            <RequiredStar className="prijava-field__required prijava-required-star--edge" />
                          </p>

                          <div
                            className="prijava-experience-choice"
                            role="radiogroup"
                            aria-label="Prethodno učešće na S2S-u"
                            aria-required="true"
                            aria-invalid={Boolean(greske.ranijeUcestvovao)}
                          >
                            <button
                              type="button"
                              className={`prijava-experience-choice__button${
                                forma.ranijeUcestvovao === true
                                  ? " prijava-experience-choice__button--active"
                                  : ""
                              }`}
                              onClick={() => promeniRanijeUcestvovao(true)}
                              role="radio"
                              aria-checked={forma.ranijeUcestvovao === true}
                            >
                              DA
                            </button>

                            <button
                              type="button"
                              className={`prijava-experience-choice__button${
                                forma.ranijeUcestvovao === false
                                  ? " prijava-experience-choice__button--active"
                                  : ""
                              }`}
                              onClick={() => promeniRanijeUcestvovao(false)}
                              role="radio"
                              aria-checked={forma.ranijeUcestvovao === false}
                            >
                              NE
                            </button>
                          </div>
                        </section>

                        <section className="prijava-experience-card prijava-experience-card--text prijava-experience-card--proposal">
                          <div className="prijava-experience-field">
                            <label
                              className="prijava-experience-ribbon"
                              htmlFor="prijava-predlog-radionice"
                            >
                              Da li imaš predlog za radionicu koja do sada nije
                              bila održana?
                            </label>
                            <div className="prijava-experience-control-shell">
                              <textarea
                                id="prijava-predlog-radionice"
                                className="prijava-experience-textarea"
                                rows={5}
                                value={forma.predlogRadionice}
                                onChange={(event) =>
                                  promeniPolje(
                                    "predlogRadionice",
                                    event.target.value,
                                  )
                                }
                                placeholder="Upiši..."
                              />
                            </div>
                          </div>
                        </section>
                      </div>

                      <div className="prijava-experience-right">
                        <section className="prijava-experience-card prijava-experience-card--cv">
                          <label
                            className="prijava-experience-ribbon"
                            htmlFor="prijava-cv-link"
                          >
                            Link ka CV-ju (Google Drive)
                          </label>
                          <p className="prijava-experience-description">
                            {tekstZaCV} Uveri se da je dokument dostupan svima
                            koji imaju link.
                          </p>
                          <div className="prijava-experience-control-shell prijava-experience-control-shell--input">
                            <input
                              id="prijava-cv-link"
                              className="prijava-experience-input"
                              type="url"
                              value={forma.cvDriveLink}
                              onChange={(event) =>
                                promeniPolje("cvDriveLink", event.target.value)
                              }
                              placeholder="https://drive.google.com/..."
                            />
                          </div>
                        </section>

                        <section
                          className={`prijava-experience-card prijava-experience-card--text prijava-experience-card--previous${
                            forma.ranijeUcestvovao === true
                              ? ""
                              : " prijava-experience-card--inactive"
                          }`}
                          aria-disabled={forma.ranijeUcestvovao !== true}
                        >
                          <div className="prijava-experience-field">
                            <label
                              className="prijava-experience-ribbon"
                              htmlFor="prijava-s2s-iskustvo"
                            >
                              Šta ti se posebno dopalo, a šta bi voleo/la da
                              bude drugačije ove godine?
                            </label>
                            <div className="prijava-experience-control-shell prijava-experience-control-shell--scribble">
                              <textarea
                                id="prijava-s2s-iskustvo"
                                className="prijava-experience-textarea"
                                rows={4}
                                value={forma.s2sIskustvo}
                                onChange={(event) =>
                                  promeniPolje(
                                    "s2sIskustvo",
                                    event.target.value,
                                  )
                                }
                                placeholder="Upiši..."
                                disabled={forma.ranijeUcestvovao !== true}
                              />
                              <EraserScribble
                                variant="experience"
                                locked={forma.ranijeUcestvovao !== true}
                                className="prijava-scribble-overlay prijava-scribble-overlay--experience"
                              />
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                ) : null}

                {prikaziValidaciju && greskeZaPopup.length > 0
                  ? createPortal(
                      <div
                        className="prijava-workshop-validation-backdrop"
                        role="presentation"
                        onMouseDown={(event) => {
                          if (event.target === event.currentTarget) {
                            setPrikaziValidaciju(false);
                          }
                        }}
                      >
                        <div
                          className="prijava-workshop-validation-popup"
                          role="alertdialog"
                          aria-modal="true"
                          aria-live="assertive"
                          aria-labelledby="prijava-validation-title"
                        >
                          <strong
                            id="prijava-validation-title"
                            className="prijava-workshop-validation-popup__title"
                          >
                            Proveri obavezna polja
                          </strong>

                          <p className="prijava-workshop-validation-popup__intro">
                            Nedostaje još nekoliko odgovora pre nego što
                            nastaviš.
                          </p>

                          <ul className="prijava-workshop-validation-popup__list">
                            {greskeZaPopup.map((greska) => (
                              <li
                                key={greska.polje}
                                className="prijava-workshop-validation-popup__item"
                              >
                                <span className="prijava-workshop-validation-popup__card">
                                  {greska.naslov}
                                </span>
                                <span className="prijava-workshop-validation-popup__message">
                                  {greska.poruka}
                                </span>
                              </li>
                            ))}
                          </ul>

                          <button
                            type="button"
                            className="prijava-workshop-validation-popup__button"
                            onClick={() => setPrikaziValidaciju(false)}
                            autoFocus
                          >
                            ISPRAVI
                          </button>
                        </div>
                      </div>,
                      document.body,
                    )
                  : null}

                {status === "error" && errorMessage ? (
                  <p className="prijava__submit-error" role="alert">
                    {errorMessage}
                  </p>
                ) : null}
              </div>

              <div className="prijava_navigacija">
                {korak > 1 ? (
                  <button
                    type="button"
                    className="prijava_dugme prijava_dugme--nazad"
                    onClick={prethodniKorak}
                  >
                    <img
                      src={prijavaButtonShell}
                      alt=""
                      aria-hidden="true"
                      className="prijava_dugme-shell"
                    />
                    <span className="prijava_dugme-text">NAZAD</span>
                  </button>
                ) : null}
                {korak < 4 ? (
                  <button
                    type="button"
                    className="prijava_dugme prijava_dugme--napred"
                    onClick={sledeciKorak}
                  >
                    <img
                      src={prijavaButtonShell}
                      alt=""
                      aria-hidden="true"
                      className="prijava_dugme-shell"
                    />
                    <span className="prijava_dugme-text">NAREDNA</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="prijava_dugme prijava_dugme--posalji"
                    onClick={posaljiPrijavu}
                  >
                    <img
                      src={prijavaButtonShell}
                      alt=""
                      aria-hidden="true"
                      className="prijava_dugme-shell"
                    />
                    <span className="prijava_dugme-text">POŠALJI</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <img
            src={prijavaCornerStars}
            alt=""
            className="prijava__mobile-corner-stars"
            aria-hidden="true"
          />

          {duplicatePrompt ? (
            <div className="prijava-dialog-backdrop" role="presentation">
              <div
                className="prijava-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="prijava-duplicate-title"
              >
                <p id="prijava-duplicate-title">{duplicatePrompt}</p>

                <div className="prijava-dialog-actions">
                  <button type="button" onClick={zatvoriObavestenjeODuplikatu}>
                    U redu
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Prijava;
