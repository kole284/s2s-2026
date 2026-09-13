import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import arrowDefault from '@/assets/Vector.svg';
import arrowHover from '@/assets/Group_58.svg';
import closeIcon from '@/assets/Layer_1.svg';
import shieldIcon from '@/assets/Group.svg';
import brainIcon from '@/assets/brain.svg';
import lupaIcon from '@/assets/lupa.svg';
import petarSlika from '@/assets/petar.jpg';
import anaSlika from '@/assets/ana.jpg';
import markoSlika from '@/assets/marko.jpg';
import jelenaSlika from '@/assets/jelena.jpg';
import './Predavac.scss';

type Tezina = 'Lako' | 'Srednje' | 'Teško';

interface Predavac {
  id: number;
  ime: string;
  tema: string;
  tezina: Tezina;
  ikonica: string; 
  opis: string[]; 
  slika?: string; 
}

const PREDAVACI: Predavac[] = [
  {
    id: 1,
    ime: 'Petar Nikolić',
    tema: 'Cyber Security',
    tezina: 'Srednje',
    ikonica: shieldIcon,
    slika: petarSlika,
    opis: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce semper pretium quam, ac egestas magna varius a. Sed leo tellus, hendrerit eu neque non, maximus consectetur risus.',
      'Ut a odio nunc. Ut consectetur nisi laoreet eros tempor scelerisque. Phasellus pharetra auctor dapibus. Proin vel cursus est.',
    ],
  },
  {
    id: 2,
    ime: 'Ana Jovanović',
    tema: 'Web Development',
    tezina: 'Lako',
    ikonica: lupaIcon,
    slika: anaSlika,
    opis: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce semper pretium quam, ac egestas magna varius a.',
      'Ut a odio nunc. Ut consectetur nisi laoreet eros tempor scelerisque. Phasellus pharetra auctor dapibus.',
    ],
  },
  {
    id: 3,
    ime: 'Marko Petrović',
    tema: 'Machine Learning',
    tezina: 'Teško',
    ikonica: brainIcon,
    slika: markoSlika,
    opis: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed leo tellus, hendrerit eu neque non, maximus consectetur risus.',
      'Phasellus pharetra auctor dapibus. Proin vel cursus est. Sed elementum venenatis orci, nec efficitur risus.',
    ],
  },
  {
    id: 4,
    ime: 'Jelena Ilić',
    tema: 'UX Dizajn',
    tezina: 'Srednje',
    ikonica: shieldIcon,
    slika: jelenaSlika,
    opis: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce semper pretium quam, ac egestas magna varius a.',
      'Ut a odio nunc. Ut consectetur nisi laoreet eros tempor scelerisque. Proin vel cursus est.',
    ],
  },
];

const Predavac = () => {
  const { predavacId } = useParams();
  const navigate = useNavigate();

  const pocetniIndeks = Math.max(
    0,
    PREDAVACI.findIndex((p) => p.id === Number(predavacId))
  );

  const [aktivniIndeks, setAktivniIndeks] = useState(pocetniIndeks);
  const [aktivnaStrelica, setAktivnaStrelica] = useState<
    'prev' | 'next' | null
  >(null);

  const predavac = PREDAVACI[aktivniIndeks];

  const prikaziPrethodnog = () => {
    setAktivniIndeks(
      (indeks) => (indeks - 1 + PREDAVACI.length) % PREDAVACI.length
    );
  };

  const prikaziSledeceg = () => {
    setAktivniIndeks((indeks) => (indeks + 1) % PREDAVACI.length);
  };

  return (
    <section className="predavac-page">
      <header className="predavac-header">
        <h1 className="predavac-title">{predavac.tema}</h1>
        <button
          type="button"
          className="predavac-close"
          aria-label="Zatvori"
          onClick={() => navigate('/')}
        >
          <img src={closeIcon} alt="" className="predavac-close-icon" />
        </button>
      </header>

      <div className="predavac-content">
        <button
          type="button"
          className="predavac-arrow predavac-arrow--prev"
          onClick={prikaziPrethodnog}
          onMouseEnter={() => setAktivnaStrelica('prev')}
          onMouseLeave={() => setAktivnaStrelica(null)}
          aria-label="Prethodni predavač"
        >
          <img
            src={aktivnaStrelica === 'prev' ? arrowHover : arrowDefault}
            alt=""
          />
        </button>

        <div className="predavac-card">
          <p className="predavac-tezina">
            TEŽINA: <span>{predavac.tezina}</span>
          </p>

          <div className="predavac-visual">
            <figure className="predavac-photo-block">
              {predavac.slika ? (
                <img
                  src={predavac.slika}
                  alt={predavac.ime}
                  className="predavac-photo"
                />
              ) : (
                <div className="predavac-photo predavac-photo--placeholder" />
              )}
              <figcaption className="predavac-name">
                {predavac.ime}
              </figcaption>
            </figure>

            <img src={predavac.ikonica} alt="" className="predavac-shield" />
          </div>

          <div className="predavac-text">
            {predavac.opis.map((pasus, indeks) => (
              <p key={indeks}>{pasus}</p>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="predavac-arrow predavac-arrow--next"
          onClick={prikaziSledeceg}
          onMouseEnter={() => setAktivnaStrelica('next')}
          onMouseLeave={() => setAktivnaStrelica(null)}
          aria-label="Sledeći predavač"
        >
          <img
            src={aktivnaStrelica === 'next' ? arrowHover : arrowDefault}
            alt=""
          />
        </button>
      </div>

      <footer className="predavac-footer" />
    </section>
  );
};

export default Predavac;
