import { useEffect, useState, type CSSProperties } from 'react';
import shieldIcon from '@/assets/Group.svg';
import brainIcon from '@/assets/brain.svg';
import lupaIcon from '@/assets/lupa.svg';
import './Radionice.scss';

interface Radionica {
  id: number;
  naziv: string;
  ikonica: string;
}

// TODO: proveri prave nazive radionica
const RADIONICE: Radionica[] = [
  { id: 1, naziv: 'Cyber Security', ikonica: shieldIcon },
  { id: 2, naziv: 'Web Development', ikonica: lupaIcon },
  { id: 3, naziv: 'Machine Learning', ikonica: brainIcon },
];

const INTERVAL_ROTACIJE_MS = 3000;

// Koliko ikonica renderujemo levo i desno od centralne.
// 5 sa svake strane pokriva i vrlo široke ekrane;
// višak seče overflow: hidden na traci.
const VIDLJIVI_POMERAJI = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

const Radionice = () => {
  // Namerno bez modula: indeks samo raste, a ikonica se računa
  // iz njega. Tako svaki slot ima stabilan key (virtuelni indeks),
  // pa CSS tranzicija "klizne" ceo red ulevo pri svakoj smeni.
  const [aktivniIndeks, setAktivniIndeks] = useState(0);

  useEffect(() => {
    const tajmer = setInterval(() => {
      setAktivniIndeks((indeks) => indeks + 1);
    }, INTERVAL_ROTACIJE_MS);

    // čišćenje intervala kad se komponenta ukloni
    return () => clearInterval(tajmer);
  }, []);

  return (
    <section className="radionice-page">
      {/* Na mobilnom je sakriven — naslov je tamo deo shared navbara */}
      <h1 className="radionice-title">Radionice</h1>

      {/* Traka: bela podloga + plavi sloj + providan_papir.svg preko */}
      <div className="radionice-band">
        <div className="radionice-stage">
          {VIDLJIVI_POMERAJI.map((pomeraj) => {
            const virtuelniIndeks = aktivniIndeks + pomeraj;
            const radionica =
              RADIONICE[
                ((virtuelniIndeks % RADIONICE.length) + RADIONICE.length) %
                  RADIONICE.length
              ];

            return (
              <div
                key={virtuelniIndeks}
                className={`radionice-slot${
                  pomeraj === 0 ? ' radionice-slot--centar' : ''
                }`}
                // --rd-pomeraj čita SCSS i iz njega računa poziciju slota
                style={{ '--rd-pomeraj': pomeraj } as CSSProperties}
              >
                <img
                  src={radionica.ikonica}
                  alt=""
                  className="radionice-ikonica"
                />
                <p className="radionice-naziv">{radionica.naziv}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Radionice;
