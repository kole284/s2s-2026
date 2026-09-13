import { useEffect, useState } from "react";
import "./Prijava.scss";

import CustomSelect from "./components/CustomSelect";
import type { NivoZnanja, PrijavaForma } from "./types";

import prijavaPaperMobile from "@/assets/prijava/decor/bela_pozadina_sa_reckama.svg";
import prijavaPaperDesktop from "@/assets/prijava/decor/Okvir-forme.svg";
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
  { id: "Master", label: "Master" },
  { id: "Doktorske", label: "Doktorske studije" },
];
const RADIONICE = ["Radionica 1", "Radionica 2", "Radionica 3", "Radionica 4"];
const NIVOI_ZNANJA: NivoZnanja[] = ["Osnovni", "Srednji", "Napredni"];
const SMEROVI = ["ISIT", "Menadžment"];
const NAZIV_PANELA = "[naziv panel diskusije]";
const OPIS_PANELA = "[opis panela]";
// CONTENT GAP: partneri trenutno nemaju canonical data source za pokrovitelje.
const BROJ_POKROVITELJA = 1;


type WorkshopSelectVisualProps = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  greska?: string;
  placeholder?: string;
};

const WorkshopSelectVisual = ({
  value,
  options,
  onChange,
  greska,
  placeholder = "Izaberi radionicu",
}: WorkshopSelectVisualProps) => (
  <div className="prijava-workshop-select">
    <div className="prijava-workshop-select__visual">
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

      <img
        src={radionicaRequired}
        alt=""
        className="prijava-workshop-select__required"
        aria-hidden="true"
      />

      <span
        className={`prijava-workshop-select__value${
          value ? "" : " prijava-workshop-select__value--placeholder"
        }`}
        aria-hidden="true"
      >
        {value || placeholder}
      </span>

      <span className="prijava-workshop-select__chevron" aria-hidden="true" />

      <CustomSelect
        value={value}
        options={options}
        placeholder={placeholder}
        obavezno
        onChange={onChange}
        greska={greska}
      />
    </div>
  </div>
);

const jeFakultetFON = (fakultet: string) => {
  const normalizovanFakultet = fakultet.trim().toLocaleLowerCase("sr-Latn");

  return (
    normalizovanFakultet === "fon" ||
    normalizovanFakultet === "fakultet organizacionih nauka"
  );
};

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

type DuplicatePrompt = {
  applicationId: number;
  message: string;
};

type ExistingApplication = {
  id: number;
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
    phone_number: forma.telefon.trim(),
    faculty: forma.fakultet.trim(),
    ...(jeFakultetFON(forma.fakultet) ? { major: forma.smer.trim() } : {}),

    study_year: forma.godinaStudija.trim(),
    previously_participated: forma.ranijeUcestvovao ?? false,
    s2s_experience: forma.s2sIskustvo.trim(),
    dream_workshop_topic: forma.predlogRadionice.trim(),
    receive_fonis_updates: forma.zeliObavestenja,
    motivation: forma.razloziZaS2S.trim(),
    attend_panel_discussion: forma.prisustvoPanelu ?? false,
    question_for_lecturers: emptyToNull(forma.pitanjeZaPredavace),
    first_workshop_choice: emptyToNull(forma.prvaZeljaRadionica),
    first_choice_reason: emptyToNull(forma.prvaZeljaPrimena),
    second_workshop_choice: emptyToNull(forma.drugaZeljaRadionica),
    second_choice_reason: emptyToNull(forma.drugaZeljaPrimena),
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

  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");

  const [errorMessage, setErrorMessage] = useState("");
  const [duplicatePrompt, setDuplicatePrompt] =
    useState<DuplicatePrompt | null>(null);

  const promeniPolje = <K extends keyof PrijavaForma>(
    polje: K,
    vrednost: PrijavaForma[K],
  ) => {
    setForma((prev) => ({ ...prev, [polje]: vrednost }));
  };

  const promeniFakultet = (fakultet: string) => {
    setForma((prev) => ({
      ...prev,
      fakultet,
      smer: jeFakultetFON(fakultet) ? prev.smer : "",
    }));
  };

  const promeniRanijeUcestvovao = (vrednost: boolean) => {
    setForma((prev) => ({
      ...prev,
      ranijeUcestvovao: vrednost,
      s2sIskustvo: vrednost ? prev.s2sIskustvo : "",
    }));
  };

  const promeniPrisustvoPanelu = (vrednost: boolean) => {
    setForma((prev) => ({
      ...prev,
      prisustvoPanelu: vrednost,
      pitanjeZaPredavace: vrednost ? prev.pitanjeZaPredavace : "",
    }));
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
  };

  /* eslint-disable react-hooks/set-state-in-effect --
     Preserves the existing FormStep2 reset behavior during structural inlining. */
  useEffect(() => {
    if (!forma.prvaZeljaRadionica) {
      promeniPolje("prvaZeljaNivoZnanja", "" as NivoZnanja);
      promeniPolje("prvaZeljaPrimena", "");
    }
  }, [forma.prvaZeljaRadionica]);

  useEffect(() => {
    if (!forma.drugaZeljaRadionica) {
      promeniPolje("drugaZeljaNivoZnanja", "" as NivoZnanja);
      promeniPolje("drugaZeljaPrimena", "");
    }
  }, [forma.drugaZeljaRadionica]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const radioniceZaPrvuZelju = RADIONICE.filter(
    (radionica) => radionica !== forma.drugaZeljaRadionica,
  );
  const radioniceZaDruguZelju = RADIONICE.filter(
    (radionica) => radionica !== forma.prvaZeljaRadionica,
  );

  const validirajKorak = (): boolean => {
    const greskeKorak: Record<string, string> = {};

    if (korak === 1) {
      if (!forma.imePrezime.trim()) {
        greskeKorak.imePrezime = "Ime i prezime je obavezno.";
      }

      if (!forma.email.trim()) {
        greskeKorak.email = "Email je obavezan.";
      }

      if (!forma.telefon.trim()) {
        greskeKorak.telefon = "Broj telefona je obavezan.";
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
    } else if (korak === 2) {
      if (!forma.prvaZeljaRadionica) {
        greskeKorak.prvaZeljaRadionica = "Izaberi glavnu radionicu.";
      } else {
        if (!forma.prvaZeljaNivoZnanja) {
          greskeKorak.prvaZeljaNivoZnanja = "Izaberi nivo znanja.";
        }

        if (!forma.prvaZeljaPrimena.trim()) {
          greskeKorak.prvaZeljaPrimena = "Ovo polje je obavezno.";
        }
      }

      if (!forma.drugaZeljaRadionica) {
        greskeKorak.drugaZeljaRadionica = "Izaberi alternativnu radionicu.";
      } else if (forma.drugaZeljaRadionica === forma.prvaZeljaRadionica) {
        greskeKorak.drugaZeljaRadionica =
          "Druga radionica mora biti različita od prve.";
      } else {
        if (!forma.drugaZeljaNivoZnanja) {
          greskeKorak.drugaZeljaNivoZnanja = "Izaberi nivo znanja.";
        }

        if (!forma.drugaZeljaPrimena.trim()) {
          greskeKorak.drugaZeljaPrimena = "Ovo polje je obavezno.";
        }
      }
    } else if (korak === 3) {
      if (forma.prisustvoPanelu === null) {
        greskeKorak.prisustvoPanelu =
          "Odgovori da li bi prisustvovao/la panelu.";
      }

      if (!forma.razloziZaS2S.trim()) {
        greskeKorak.razloziZaS2S = "Ovo polje je obavezno.";
      }
    } else if (korak === 4) {
      if (forma.ranijeUcestvovao === null) {
        greskeKorak.ranijeUcestvovao = "Odgovori da li si ranije učestvovao.";
      }

    }

    setGreske(greskeKorak);

    return Object.keys(greskeKorak).length === 0;
  };

  const sledeciKorak = () => {
    if (validirajKorak()) {
      setKorak((k) => Math.min(k + 1, 4));
    }
  };

  const prethodniKorak = () => {
    setKorak((k) => Math.max(k - 1, 1));
  };

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
      select: "id,email,phone_number",
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

    const emailMatches = rows.filter(
      (row) => row.email.toLowerCase() === email.toLowerCase(),
    );

    const phoneMatches = rows.filter((row) => row.phone_number === phoneNumber);

    const emailMatch = emailMatches.at(-1);
    const phoneMatch = phoneMatches.at(-1);

    if (emailMatch && phoneMatch && emailMatch.id !== phoneMatch.id) {
      throw new Error("Email i broj telefona pripadaju različitim prijavama.");
    }

    if (emailMatch) {
      return {
        applicationId: emailMatch.id,
        message:
          "Email koji ste uneli već postoji, da li želite da ažurirate podatke?",
      };
    }

    if (phoneMatch) {
      return {
        applicationId: phoneMatch.id,
        message:
          "Broj telefona koji ste uneli već postoji, da li želite da ažurirate podatke?",
      };
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

  const updateApplicationAndResendCode = async (
    supabaseUrl: string,
    supabasePublishableKey: string,
    applicationId: number,
    payload: ApplicationPayload,
  ) => {
    const updatePayload = {
      name_surname: payload.name_surname,
      email: payload.email,
      phone_number: payload.phone_number,
      faculty: payload.faculty,
      ...(payload.major !== undefined ? { major: payload.major } : {}),
      study_year: payload.study_year,
      previously_participated: payload.previously_participated,
      s2s_experience: payload.s2s_experience,
      dream_workshop_topic: payload.dream_workshop_topic,
      receive_fonis_updates: payload.receive_fonis_updates,
      motivation: payload.motivation,
      attend_panel_discussion: payload.attend_panel_discussion,
      question_for_lecturers: payload.question_for_lecturers,
      first_workshop_choice: payload.first_workshop_choice,
      first_choice_reason: payload.first_choice_reason,
      second_workshop_choice: payload.second_workshop_choice,
      second_choice_reason: payload.second_choice_reason,
      cv_drive_link: payload.cv_drive_link,
    };

    const updateResponse = await fetch(
      `${supabaseUrl}/rest/v1/Application?id=eq.${applicationId}`,
      {
        method: "PATCH",
        headers: {
          ...supabaseHeaders(supabasePublishableKey),
          Prefer: "return=minimal",
        },
        body: JSON.stringify(updatePayload),
      },
    );

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();

      throw new Error(
        errorText || `Request failed with ${updateResponse.status}`,
      );
    }

    const resendResponse = await fetch(
      `${supabaseUrl}/rest/v1/rpc/resend_existing_access_code`,
      {
        method: "POST",
        headers: supabaseHeaders(supabasePublishableKey),
        body: JSON.stringify({
          p_application_id: applicationId,
        }),
      },
    );

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();

      throw new Error(
        errorText || `Request failed with ${resendResponse.status}`,
      );
    }
  };

  const posaljiPrijavu = async () => {
    if (!validirajKorak()) {
      return;
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

        setDuplicatePrompt({
          applicationId: existing.applicationId,
          message: existing.message,
        });

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

  const handleDeclineUpdate = () => {
    setDuplicatePrompt(null);
    setStatus("idle");
  };

  const handleConfirmUpdate = async () => {
    if (!duplicatePrompt) {
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const { supabaseUrl, supabasePublishableKey } = getSupabaseConfig();

      const payload = buildPayload(forma);

      await updateApplicationAndResendCode(
        supabaseUrl,
        supabasePublishableKey,
        duplicatePrompt.applicationId,
        payload,
      );

      setDuplicatePrompt(null);
      setStatus("idle");
      setPoslato(true);
      setForma(praznaForma);
      setGreske({});
      setKorak(1);
    } catch (error) {
      setDuplicatePrompt(null);
      setStatus("error");

      setErrorMessage(
        error instanceof Error ? error.message : "Prijava nije ažurirana.",
      );
    }
  };

  if (poslato) {
    return (
      <section className="prijava">
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
                Tvoja prijava je zabeležena. Proveri svoj email – tamo ćeš dobiti
                jedinstveni kod za pristup igrici.
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
    <section className="prijava">
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
            src={prijavaPaperDesktop}
            alt=""
            className="prijava__paper prijava__paper--desktop"
            aria-hidden="true"
          />

          <header className="prijava__header">
            <span className="prijava__header-yellow" aria-hidden="true" />

            <h1 className="prijava__title">
              {NASLOVI_KORAKA[korak - 1]}
            </h1>

            <span className="prijava__header-line" aria-hidden="true" />
          </header>

          <div className="prijava__form-area">
            <div className="prijava_sadrzaj">
              {korak === 1 ? (
                <div className="form_step form_step--1">
                  <div className="prijava-step1__fields">
                    {[
                      ["prijava-ime-prezime", "Ime i prezime", "text", "imePrezime"],
                      ["prijava-email", "Email", "email", "email"],
                      ["prijava-telefon", "Broj telefona", "tel", "telefon"],
                      ["prijava-fakultet", "Fakultet", "text", "fakultet"],
                    ].map(([id, label, type, field]) => {
                      const key = field as "imePrezime" | "email" | "telefon" | "fakultet";
                      const error = greske[key];
                      const errorId = `${id}-greska`;

                      return (
                        <div
                          key={id}
                          className={`prijava-field${error ? " prijava-field--error" : ""}`}
                        >
                          <label className="prijava-field__label" htmlFor={id}>
                            {label}
                          </label>
                          <div className="prijava-field__control">
                            <input
                              id={id}
                              className="prijava-field__input"
                              type={type}
                              value={forma[key]}
                              onChange={(event) =>
                                key === "fakultet"
                                  ? promeniFakultet(event.target.value)
                                  : promeniPolje(key, event.target.value)
                              }
                              aria-describedby={error ? errorId : undefined}
                              aria-invalid={Boolean(error)}
                            />
                          </div>
                          <span className="prijava-field__required" aria-hidden="true">*</span>
                          {error ? (
                            <p id={errorId} className="prijava-field__error" role="alert">
                              {error}
                            </p>
                          ) : null}
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
                        <span className="prijava_required-marker" aria-hidden="true">*</span>
                      </div>
                      <div className="prijava_opcije" role="group" aria-label="Smer">
                        {SMEROVI.map((smer) => (
                          <button
                            key={smer}
                            type="button"
                            className={`prijava_opcija ${forma.smer === smer ? "prijava_opcija-aktivna" : ""}`}
                            onClick={() => promeniPolje("smer", smer)}
                            aria-pressed={forma.smer === smer}
                          >
                            {smer}
                          </button>
                        ))}
                      </div>
                      {greske.smer ? <p className="prijava_greska" role="alert">{greske.smer}</p> : null}
                    </div>
                  ) : null}

                  <div
                    className={`prijava_godina-sekcija${
                      greske.godinaStudija ? " prijava_godina-sekcija--greska" : ""
                    }`}
                  >
                    <div className="prijava_godina-heading">
                      <p className="prijava_labela">Godina studija</p>
                      <span className="prijava_required-marker" aria-hidden="true">*</span>
                    </div>
                    <div className="prijava_godina-kontejner" role="group" aria-label="Godina studija">
                      <div className="prijava_godina-mrezica-brojevi">
                        {BROJEVI_GODINA.map((godina) => (
                          <button
                            key={godina.id}
                            type="button"
                            className="prijava_godina-polje-vertikalno"
                            onClick={() => promeniPolje("godinaStudija", godina.id)}
                            aria-pressed={forma.godinaStudija === godina.id}
                          >
                            <span className="prijava_godina-box-wrapper" aria-hidden="true">
                              <img src={rombImg} alt="" className="prijava_godina-romb-img" />
                              {forma.godinaStudija === godina.id ? (
                                <img src={munjicaImg} alt="" className="prijava_godina-bolt" />
                              ) : null}
                            </span>
                            <span className="prijava_godina-tekst">{godina.label}</span>
                          </button>
                        ))}
                      </div>
                      <div className="prijava_godina-mrezica-ostalo">
                        {OSTALE_GODINE.map((godina) => (
                          <button
                            key={godina.id}
                            type="button"
                            className="prijava_godina-polje-horizontalno"
                            onClick={() => promeniPolje("godinaStudija", godina.id)}
                            aria-pressed={forma.godinaStudija === godina.id}
                          >
                            <span className="prijava_godina-tekst">{godina.label}</span>
                            <span className="prijava_godina-box-wrapper" aria-hidden="true">
                              <img src={rombImg} alt="" className="prijava_godina-romb-img" />
                              {forma.godinaStudija === godina.id ? (
                                <img src={munjicaImg} alt="" className="prijava_godina-bolt" />
                              ) : null}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    {greske.godinaStudija ? (
                      <p className="prijava_greska" role="alert">{greske.godinaStudija}</p>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {korak === 2 ? (
                <div className="form_step form_step--2">
                  <div
                    className={`prijava-workshops${
                      forma.prvaZeljaRadionica ? " prijava-workshops--configured" : ""
                    }`}
                  >
                    <section className="prijava-workshop-card prijava-workshop-card--primary">
                      <div className="prijava-workshop-card__heading">
                        <span className="prijava-workshop-card__number" aria-hidden="true">01</span>
                        <h2 className="prijava-workshop-card__title">PRVA ŽELJA</h2>
                        <span className="prijava-workshop-card__badge">OBAVEZNO</span>
                      </div>

                      <WorkshopSelectVisual
                        value={forma.prvaZeljaRadionica}
                        options={radioniceZaPrvuZelju}
                        onChange={promeniPrvuZelju}
                        greska={greske.prvaZeljaRadionica}
                      />

                      {!forma.prvaZeljaRadionica ? (
                        <div className="prijava-workshop-empty" aria-hidden="true">
                          <span>•</span>
                          <span>•</span>
                          <span>•</span>
                        </div>
                      ) : (
                        <div className="prijava-workshop-details">
                          <div className="prijava-workshop-field">
                            <div className="prijava-workshop-label">
                              <span>Nivo znanja iz ove oblasti</span>
                            </div>

                            <div
                              className="prijava-workshop-levels"
                              role="group"
                              aria-label="Nivo znanja za prvu želju"
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
                                  aria-pressed={forma.prvaZeljaNivoZnanja === nivo}
                                >
                                  {nivo}
                                </button>
                              ))}
                            </div>

                            {greske.prvaZeljaNivoZnanja ? (
                              <p
                                className="prijava_greska prijava-workshop-error"
                                role="alert"
                              >
                                {greske.prvaZeljaNivoZnanja}
                              </p>
                            ) : null}
                          </div>

                          <div className="prijava-workshop-field">
                            <label
                              className="prijava-workshop-label"
                              htmlFor="prijava-prva-primena"
                            >
                              <span>Šta bi želeo/la da naučiš i kako vidiš primenu?</span>
                            </label>

                            <div className="prijava-workshop-textarea-shell">
                              <textarea
                                id="prijava-prva-primena"
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

                            {greske.prvaZeljaPrimena ? (
                              <p
                                className="prijava_greska prijava-workshop-error"
                                role="alert"
                              >
                                {greske.prvaZeljaPrimena}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </section>

                    {forma.prvaZeljaRadionica ? (
                      <section className="prijava-workshop-card prijava-workshop-card--secondary">
                        <div className="prijava-workshop-card__heading">
                          <span className="prijava-workshop-card__number" aria-hidden="true">02</span>
                          <h2 className="prijava-workshop-card__title">DRUGA ŽELJA</h2>
                          <span className="prijava-workshop-card__badge">
                            OBAVEZNO
                          </span>
                        </div>

                        <WorkshopSelectVisual
                          value={forma.drugaZeljaRadionica}
                          options={radioniceZaDruguZelju}
                          onChange={(value) =>
                            promeniPolje("drugaZeljaRadionica", value)
                          }
                          greska={greske.drugaZeljaRadionica}
                        />

                        {!forma.drugaZeljaRadionica ? (
                          <p className="prijava-workshop-hint">
                            Alternativa mora biti različita od prve radionice.
                          </p>
                        ) : (
                          <div className="prijava-workshop-details">
                            <div className="prijava-workshop-field">
                              <div className="prijava-workshop-label">
                                <span>Nivo znanja iz ove oblasti</span>
                              </div>

                              <div
                                className="prijava-workshop-levels"
                                role="group"
                                aria-label="Nivo znanja za drugu želju"
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
                                    aria-pressed={forma.drugaZeljaNivoZnanja === nivo}
                                  >
                                    {nivo}
                                  </button>
                                ))}
                              </div>

                              {greske.drugaZeljaNivoZnanja ? (
                                <p
                                  className="prijava_greska prijava-workshop-error"
                                  role="alert"
                                >
                                  {greske.drugaZeljaNivoZnanja}
                                </p>
                              ) : null}
                            </div>

                            <div className="prijava-workshop-field">
                              <label
                                className="prijava-workshop-label"
                                htmlFor="prijava-druga-primena"
                              >
                                <span>Šta bi želeo/la da naučiš i kako vidiš primenu?</span>
                              </label>

                              <div className="prijava-workshop-textarea-shell">
                                <textarea
                                  id="prijava-druga-primena"
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
                                  aria-invalid={Boolean(greske.drugaZeljaPrimena)}
                                />
                              </div>

                              {greske.drugaZeljaPrimena ? (
                                <p
                                  className="prijava_greska prijava-workshop-error"
                                  role="alert"
                                >
                                  {greske.drugaZeljaPrimena}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        )}
                      </section>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {korak === 3 ? (
                <div className="form_step">
                  <div className="prijava_polje">
                    <label className="prijava_labela">Da li bi prisustvovao/la panel diskusiji „{NAZIV_PANELA}“? <span className="prijava_zvezdica">*</span></label>
                    <p className="prijava_opis">{OPIS_PANELA}</p>
                    <div className="prijava_opcije">
                      <button type="button" className={`prijava_opcija ${forma.prisustvoPanelu === true ? "prijava_opcija-aktivna" : ""}`} onClick={() => promeniPrisustvoPanelu(true)} aria-pressed={forma.prisustvoPanelu === true}>Da</button>
                      <button type="button" className={`prijava_opcija ${forma.prisustvoPanelu === false ? "prijava_opcija-aktivna" : ""}`} onClick={() => promeniPrisustvoPanelu(false)} aria-pressed={forma.prisustvoPanelu === false}>Ne</button>
                    </div>
                    {greske.prisustvoPanelu ? <p className="prijava_greska">{greske.prisustvoPanelu}</p> : null}
                  </div>
                  {forma.prisustvoPanelu === true ? (
                    <div className="prijava_polje">
                      <label className="prijava_labela" htmlFor="prijava-pitanje-predavaci">Koje pitanje bi postavio/la predavačima?</label>
                      <textarea id="prijava-pitanje-predavaci" className="prijava_textarea" rows={3} value={forma.pitanjeZaPredavace} onChange={(event) => promeniPolje("pitanjeZaPredavace", event.target.value)} placeholder="Upiši..." />
                      {greske.pitanjeZaPredavace ? <p className="prijava_greska">{greske.pitanjeZaPredavace}</p> : null}
                    </div>
                  ) : null}
                  <div className="prijava_polje">
                    <label className="prijava_labela">Navedi tri razloga zbog kojih želiš da budeš deo S2S-a ove godine <span className="prijava_zvezdica">*</span></label>
                    <textarea className="prijava_textarea" rows={6} value={forma.razloziZaS2S} onChange={(event) => promeniPolje("razloziZaS2S", event.target.value)} placeholder="Upiši..." />
                    {greske.razloziZaS2S ? <p className="prijava_greska">{greske.razloziZaS2S}</p> : null}
                  </div>
                </div>
              ) : null}

              {korak === 4 ? (
                <div className="form_step">
                  <div className="prijava_polje">
                    <label className="prijava_labela">Da li si ranije učestvovao/la na S2S-u? <span className="prijava_zvezdica">*</span></label>
                    <div className="prijava_opcije">
                      <button type="button" className={`prijava_opcija ${forma.ranijeUcestvovao === true ? "prijava_opcija-aktivna" : ""}`} onClick={() => promeniRanijeUcestvovao(true)} aria-pressed={forma.ranijeUcestvovao === true}>Da</button>
                      <button type="button" className={`prijava_opcija ${forma.ranijeUcestvovao === false ? "prijava_opcija-aktivna" : ""}`} onClick={() => promeniRanijeUcestvovao(false)} aria-pressed={forma.ranijeUcestvovao === false}>Ne</button>
                    </div>
                    {greske.ranijeUcestvovao ? <p className="prijava_greska">{greske.ranijeUcestvovao}</p> : null}
                  </div>
                  {forma.ranijeUcestvovao === true ? (
                    <div className="prijava_polje">
                      <label className="prijava_labela" htmlFor="prijava-s2s-iskustvo">Šta ti se posebno dopalo, a šta bi voleo/la da bude drugačije ove godine?</label>
                      <textarea id="prijava-s2s-iskustvo" className="prijava_textarea" rows={4} value={forma.s2sIskustvo} onChange={(event) => promeniPolje("s2sIskustvo", event.target.value)} placeholder="Upiši..." />
                      {greske.s2sIskustvo ? <p className="prijava_greska">{greske.s2sIskustvo}</p> : null}
                    </div>
                  ) : null}
                  <div className="prijava_polje">
                    <label className="prijava_labela">Da li imaš predlog za radionicu koja do sad nije bila održana?</label>
                    <textarea className="prijava_textarea" rows={3} value={forma.predlogRadionice} onChange={(event) => promeniPolje("predlogRadionice", event.target.value)} placeholder="Upiši..." />
                  </div>
                  <div className="prijava_polje">
                    <label className="prijava_labela">Link ka CV-ju (Google Drive)</label>
                    <p className="prijava_opis">{tekstZaCV} Uveri se da je dokument dostupan svima koji imaju link.</p>
                    <input className="prijava_input" type="url" value={forma.cvDriveLink} onChange={(event) => promeniPolje("cvDriveLink", event.target.value)} placeholder="https://drive.google.com/..." />
                  </div>
                  <div className="prijava_polje prijava_polje--checkbox">
                    <label className="prijava_checkbox_labela">
                      <input type="checkbox" checked={forma.zeliObavestenja} onChange={(event) => promeniPolje("zeliObavestenja", event.target.checked)} />
                      Želim da primam obaveštenja o budućim događajima koje organizuje FONIS
                    </label>
                  </div>
                </div>
              ) : null}

              {status === "error" && errorMessage ? (
                <p className="prijava__submit-error" role="alert">
                  {errorMessage}
                </p>
              ) : null}
            </div>

            <div className="prijava_navigacija">
              {korak > 1 ? (
                <button type="button" className="prijava_dugme prijava_dugme--nazad" onClick={prethodniKorak}>
                  <img src={prijavaButtonShell} alt="" aria-hidden="true" className="prijava_dugme-shell" />
                  <span className="prijava_dugme-text">NAZAD</span>
                </button>
              ) : null}
              {korak < 4 ? (
                <button type="button" className="prijava_dugme prijava_dugme--napred" onClick={sledeciKorak}>
                  <img src={prijavaButtonShell} alt="" aria-hidden="true" className="prijava_dugme-shell" />
                  <span className="prijava_dugme-text">NAREDNA</span>
                </button>
              ) : (
                <button type="button" className="prijava_dugme prijava_dugme--posalji" onClick={posaljiPrijavu}>
                  <img src={prijavaButtonShell} alt="" aria-hidden="true" className="prijava_dugme-shell" />
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
              <p id="prijava-duplicate-title">{duplicatePrompt.message}</p>

              <div className="prijava-dialog-actions">
                <button
                  type="button"
                  onClick={handleConfirmUpdate}
                  disabled={status === "submitting"}
                >
                  Da
                </button>

                <button
                  type="button"
                  onClick={handleDeclineUpdate}
                  disabled={status === "submitting"}
                >
                  Ne
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
