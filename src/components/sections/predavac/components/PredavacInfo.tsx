import { useId, type KeyboardEvent } from "react";

import type { WorkshopDetails } from "@/data/workshopDetails";

import SoftverRadionice from "./SoftverRadionice";

export type PredavacTab = "radionica" | "predavac" | "softver";

type PredavacInfoProps = {
  detalji?: WorkshopDetails;
  bio: string[];
  imePredavaca: string;
  visePredavaca: boolean;
  aktivniTab: PredavacTab;
  onTabChange: (tab: PredavacTab) => void;
};

const NIVO_TACKE = { Osnovni: 1, Srednji: 2, Napredni: 3 } as const;
const SVI_TABOVI: PredavacTab[] = ["radionica", "predavac", "softver"];

const PredavacInfo = ({
  detalji,
  bio,
  imePredavaca,
  visePredavaca,
  aktivniTab,
  onTabChange,
}: PredavacInfoProps) => {
  const id = useId();
  // Kartica "Softver" postoji samo kad radionica ima detalje.
  const tabovi = detalji ? SVI_TABOVI : SVI_TABOVI.filter((tab) => tab !== "softver");
  const softver = aktivniTab === "softver" ? detalji?.softver : undefined;
  const tekst = softver
    ? []
    : aktivniTab === "radionica"
      ? (detalji?.opis ?? [])
      : bio;
  // Spisak softvera se ne smanjuje kao dug opis (čipovi bi bili nečitljivi),
  // nego se panel skroluje.
  const dugacak = tekst.join("").length > 700;
  const naziviTabova: Record<PredavacTab, string> = {
    radionica: "O radionici",
    predavac: visePredavaca ? "O predavačima" : "O predavaču",
    softver: "Softver",
  };

  // Strelice levo/desno pomeraju fokus i izbor između tabova (ARIA tabs obrazac).
  const naTasterTaba = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const pomak = event.key === "ArrowRight" ? 1 : -1;
    const indeks = Math.max(0, tabovi.indexOf(aktivniTab));
    const sledeci = tabovi[(indeks + pomak + tabovi.length) % tabovi.length];
    onTabChange(sledeci);
    document.getElementById(`${id}-tab-${sledeci}`)?.focus();
  };

  return (
    <div className="predavac-info">
      {detalji && (
        <dl className="predavac-meta">
          <div className="predavac-meta-item">
            <dt>Nivo</dt>
            <dd>
              <span
                className="predavac-nivo"
                aria-hidden="true"
                data-nivo={NIVO_TACKE[detalji.nivo]}
              >
                <span />
                <span />
                <span />
              </span>
              {detalji.nivo}
            </dd>
          </div>
          <div className="predavac-meta-item">
            <dt>Predznanje</dt>
            <dd>{detalji.predznanje ?? "Ne traži se"}</dd>
          </div>
        </dl>
      )}

      <div className="predavac-tabs" role="tablist" aria-label="Opis">
        {tabovi.map((tab) => (
          <button
            key={tab}
            id={`${id}-tab-${tab}`}
            type="button"
            role="tab"
            aria-selected={aktivniTab === tab}
            aria-controls={`${id}-panel`}
            tabIndex={aktivniTab === tab ? 0 : -1}
            className={`predavac-tab${
              aktivniTab === tab ? " predavac-tab--active" : ""
            }`}
            onClick={() => onTabChange(tab)}
            onKeyDown={naTasterTaba}
          >
            {naziviTabova[tab]}
          </button>
        ))}
      </div>

      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${aktivniTab}`}
        tabIndex={0}
        className={`predavac-text${dugacak ? " predavac-text--dugacak" : ""}${
          softver ? " predavac-text--softver" : ""
        }`}
      >
        {aktivniTab === "predavac" && visePredavaca && (
          <p className="predavac-text-ime">{imePredavaca}</p>
        )}
        {tekst.map((pasus, indeks) => (
          <p key={indeks}>{pasus}</p>
        ))}
        {softver && <SoftverRadionice softver={softver} />}
      </div>
    </div>
  );
};

export default PredavacInfo;
