import { useState } from "react";

import arrowDefault from "@/assets/Vector.svg";
import closeIcon from "@/assets/Layer_1.svg";
import { WORKSHOP_DETAILS } from "@/data/workshopDetails";

import PredavacInfo, { type PredavacTab } from "./components/PredavacInfo";
import { PREDAVACI, type PredavacPodaci } from "./predavaci";
import "./Predavac.scss";

type PredavacProps = {
  predavacId?: number;
  workshopId?: number;
  workshopTitle?: string;
  workshopIcon?: string;
  lecturers?: string[];
  onClose?: () => void;
};

const PROFILI_PO_IMENU = new Map(
  PREDAVACI.map((predavac) => [predavac.ime, predavac]),
);

const napraviPrazanProfil = (ime: string): PredavacPodaci => ({
  ime,
  bio: [],
});

const Predavac = ({
  workshopId,
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
  const [aktivniTab, setAktivniTab] = useState<PredavacTab>("radionica");
  const detalji =
    workshopId !== undefined ? WORKSHOP_DETAILS[workshopId] : undefined;
  const imePredavaca = lecturerNames[aktivniIndeks];
  const predavac = lecturers?.length
    ? (PROFILI_PO_IMENU.get(imePredavaca) ??
      napraviPrazanProfil(imePredavaca))
    : PREDAVACI[aktivniIndeks];

  // Strelice menjaju predavača, pa se prikazuje i njegova biografija.
  const prikaziPrethodnog = () => {
    setAktivniTab("predavac");
    setAktivniIndeks(
      (indeks) => (indeks - 1 + lecturerNames.length) % lecturerNames.length,
    );
  };

  const prikaziSledeceg = () => {
    setAktivniTab("predavac");
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

            <PredavacInfo
              detalji={detalji}
              bio={predavac.bio}
              imePredavaca={imePredavaca}
              visePredavaca={imaVisePredavaca}
              aktivniTab={aktivniTab}
              onTabChange={setAktivniTab}
            />
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
