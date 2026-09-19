import { useState } from "react";

import arrowDefault from "@/assets/Vector.svg";
import closeIcon from "@/assets/Layer_1.svg";
import petarSlika from "@/assets/petar.jpg";
import anaSlika from "@/assets/ana.jpg";
import markoSlika from "@/assets/marko.jpg";
import jelenaSlika from "@/assets/jelena.jpg";

import "./Predavac.scss";

type Tezina = "Lako" | "Srednje" | "Teško";

interface PredavacPodaci {
  id: number;
  ime: string;
  tezina: Tezina;
  opis: string[];
  slika?: string;
}

type PredavacProps = {
  predavacId?: number;
  workshopTitle?: string;
  workshopIcon?: string;
  lecturers?: string[];
  onClose?: () => void;
};
const PREDAVACI: PredavacPodaci[] = [
  {
    id: 1,
    ime: "Petar Nikolić",
    tezina: "Srednje",
    slika: petarSlika,
    opis: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce semper pretium quam, ac egestas magna varius a. Sed leo tellus, hendrerit eu neque non, maximus consectetur risus.",
      "Ut a odio nunc. Ut consectetur nisi laoreet eros tempor scelerisque. Phasellus pharetra auctor dapibus. Proin vel cursus est.",
    ],
  },
  {
    id: 2,
    ime: "Ana Jovanović",
    tezina: "Lako",
    slika: anaSlika,
    opis: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce semper pretium quam, ac egestas magna varius a.",
      "Ut a odio nunc. Ut consectetur nisi laoreet eros tempor scelerisque. Phasellus pharetra auctor dapibus.",
    ],
  },
  {
    id: 3,
    ime: "Marko Petrović",
    tezina: "Teško",
    slika: markoSlika,
    opis: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed leo tellus, hendrerit eu neque non, maximus consectetur risus.",
      "Phasellus pharetra auctor dapibus. Proin vel cursus est. Sed elementum venenatis orci, nec efficitur risus.",
    ],
  },
  {
    id: 4,
    ime: "Jelena Ilić",
    tezina: "Srednje",
    slika: jelenaSlika,
    opis: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce semper pretium quam, ac egestas magna varius a.",
      "Ut a odio nunc. Ut consectetur nisi laoreet eros tempor scelerisque. Proin vel cursus est.",
    ],
  },
];

const Predavac = ({
  predavacId,
  workshopTitle,
  workshopIcon,
  lecturers,
  onClose,
}: PredavacProps) => {
  const lecturerNames = lecturers?.length
    ? lecturers
    : PREDAVACI.map((predavac) => predavac.ime);
  const imaVisePredavaca = lecturerNames.length > 1;
  const pocetniIndeks = Math.max(
    0,
    lecturers?.length
      ? 0
      : PREDAVACI.findIndex((predavac) => predavac.id === predavacId),
  );

  const [aktivniIndeks, setAktivniIndeks] = useState(pocetniIndeks);
  const predavac = PREDAVACI[aktivniIndeks];
  const imePredavaca = lecturerNames[aktivniIndeks];

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
            <p className="predavac-tezina">
              TEŽINA: <span>{predavac.tezina}</span>
            </p>

            <div className="predavac-visual">
              <figure className="predavac-photo-block">
                {predavac.slika ? (
                  <img
                    src={predavac.slika}
                    alt={imePredavaca}
                    className="predavac-photo"
                  />
                ) : (
                  <div className="predavac-photo predavac-photo--placeholder" />
                )}

                <figcaption className="predavac-name">{imePredavaca}</figcaption>
              </figure>

              <img src={workshopIcon} alt="" className="predavac-shield" />
            </div>

            <div className="predavac-text">
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
