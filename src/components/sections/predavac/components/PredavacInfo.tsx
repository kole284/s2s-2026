import { useId, type KeyboardEvent } from "react";

import type { WorkshopDetails } from "@/data/workshopDetails";

export type PredavacTab = "radionica" | "predavac";

type PredavacInfoProps = {
  detalji?: WorkshopDetails;
  bio: string[];
  imePredavaca: string;
  visePredavaca: boolean;
  aktivniTab: PredavacTab;
  onTabChange: (tab: PredavacTab) => void;
};

const NIVO_TACKE = { Osnovni: 1, Srednji: 2, Napredni: 3 } as const;
const TABOVI: PredavacTab[] = ["radionica", "predavac"];

const PredavacInfo = ({
  detalji,
  bio,
  imePredavaca,
  visePredavaca,
  aktivniTab,
  onTabChange,
}: PredavacInfoProps) => {
  const id = useId();
  const tekst = aktivniTab === "radionica" ? (detalji?.opis ?? []) : bio;
  const naziviTabova: Record<PredavacTab, string> = {
    radionica: "O radionici",
    predavac: visePredavaca ? "O predavačima" : "O predavaču",
  };

  // Strelice levo/desno pomeraju fokus i izbor između tabova (ARIA tabs obrazac).
  const naTasterTaba = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const sledeci = aktivniTab === "radionica" ? "predavac" : "radionica";
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
        {TABOVI.map((tab) => (
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
        className={`predavac-text${
          tekst.join("").length > 700 ? " predavac-text--dugacak" : ""
        }`}
      >
        {aktivniTab === "predavac" && visePredavaca && (
          <p className="predavac-text-ime">{imePredavaca}</p>
        )}
        {tekst.map((pasus, indeks) => (
          <p key={indeks}>{pasus}</p>
        ))}
      </div>
    </div>
  );
};

export default PredavacInfo;
