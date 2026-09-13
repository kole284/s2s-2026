import { useEffect, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import shieldIcon from '@/assets/Group.svg';
import brainIcon from '@/assets/brain.svg';
import lupaIcon from '@/assets/lupa.svg';
import './Radionice.scss';

interface Radionica {
  id: number;
  naziv: string;
  ikonica: string;
  predavacId: number; 
}


const RADIONICE: Radionica[] = [
  { id: 1, naziv: 'Cyber Security', ikonica: shieldIcon, predavacId: 1 }, // Petar Nikolić
  { id: 2, naziv: 'Web Development', ikonica: lupaIcon, predavacId: 2 }, // Ana Jovanović
  { id: 3, naziv: 'Machine Learning', ikonica: brainIcon, predavacId: 3 }, // Marko Petrović
];

const INTERVAL_ROTACIJE_MS = 3000;


const VIDLJIVI_POMERAJI = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

const Radionice = () => {

  const [aktivniIndeks, setAktivniIndeks] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const tajmer = setInterval(() => {
      setAktivniIndeks((indeks) => indeks + 1);
    }, INTERVAL_ROTACIJE_MS);


    return () => clearInterval(tajmer);
  }, []);

  return (
    <section className="radionice-page">
      
      <h1 className="radionice-title">Radionice</h1>

      
      <div className="radionice-band">
        <div className="radionice-stage">
          {VIDLJIVI_POMERAJI.map((pomeraj) => {
            const virtuelniIndeks = aktivniIndeks + pomeraj;
            const radionica =
              RADIONICE[
                ((virtuelniIndeks % RADIONICE.length) + RADIONICE.length) %
                  RADIONICE.length
              ];

            
            const jeCentar = pomeraj === 0;

            const otvoriPredavaca = () =>
              navigate(`/predavac/${radionica.predavacId}`);

            return (
              <div
                key={virtuelniIndeks}
                className={`radionice-slot${
                  jeCentar ? ' radionice-slot--centar' : ''
                }`}
                
                style={{ '--rd-pomeraj': pomeraj } as CSSProperties}
                onClick={jeCentar ? otvoriPredavaca : undefined}
                role={jeCentar ? 'button' : undefined}
                tabIndex={jeCentar ? 0 : undefined}
                onKeyDown={
                  jeCentar
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          otvoriPredavaca();
                        }
                      }
                    : undefined
                }
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
