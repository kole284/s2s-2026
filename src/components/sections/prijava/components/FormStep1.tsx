import type { PrijavaForma } from '../types';
import imeIPrezimeImg from '@/assets/prijava/fields/ime_i_prezime.svg';
import emailImg from '@/assets/prijava/fields/email.svg';
import telefonImg from '@/assets/prijava/fields/broj_telefona.svg';
import fakultetImg from '@/assets/prijava/fields/fakultet.svg';
import godinaStudijaNaslovImg from '@/assets/prijava/fields/godina_studija_naslov_i_zvezdica.svg';
import rombImg from '@/assets/prijava/fields/romb.svg';
import munjicaImg from '@/assets/prijava/icons/munjica.svg';

interface Props {
  forma: PrijavaForma;
  promeniPolje: <K extends keyof PrijavaForma>(
    polje: K,
    vrednost: PrijavaForma[K]
  ) => void;
  greske: Record<string, string>;
}

const BROJEVI_GODINA = [
  { id: '1', label: '1.' },
  { id: '2', label: '2.' },
  { id: '3', label: '3.' },
  { id: '4', label: '4.' },
];

const OSTALE_GODINE = [
  { id: 'Master', label: 'Master' },
  { id: 'Doktorske', label: 'Doktorske studije' },
];

const FormStep1 = ({ forma, promeniPolje, greske }: Props) => {
  return (
    <div className="form_step">
      {/* Ime i Prezime */}
      <div className={`prijava_polje-slika ${greske.imePrezime ? 'prijava_polje-slika--greska' : ''}`}>
        <img src={imeIPrezimeImg} alt="" aria-hidden="true" className="prijava_polje-pozadina" />
        <input
          className="prijava_polje-input"
          type="text"
          value={forma.imePrezime}
          onChange={(e) => promeniPolje('imePrezime', e.target.value)}
          aria-label="Ime i prezime"
        />
        {greske.imePrezime && <p className="prijava_greska">{greske.imePrezime}</p>}
      </div>

      {/* Email */}
      <div className={`prijava_polje-slika ${greske.email ? 'prijava_polje-slika--greska' : ''}`}>
        <img src={emailImg} alt="" aria-hidden="true" className="prijava_polje-pozadina" />
        <input
          className="prijava_polje-input"
          type="email"
          value={forma.email}
          onChange={(e) => promeniPolje('email', e.target.value)}
          aria-label="Email"
        />
        {greske.email && <p className="prijava_greska">{greske.email}</p>}
      </div>

      {/* Telefon */}
      <div className={`prijava_polje-slika ${greske.telefon ? 'prijava_polje-slika--greska' : ''}`}>
        <img src={telefonImg} alt="" aria-hidden="true" className="prijava_polje-pozadina" />
        <input
          className="prijava_polje-input"
          type="tel"
          value={forma.telefon}
          onChange={(e) => promeniPolje('telefon', e.target.value)}
          aria-label="Broj telefona"
        />
        {greske.telefon && <p className="prijava_greska">{greske.telefon}</p>}
      </div>

      {/* Fakultet */}
      <div className={`prijava_polje-slika ${greske.fakultet ? 'prijava_polje-slika--greska' : ''}`}>
        <img src={fakultetImg} alt="" aria-hidden="true" className="prijava_polje-pozadina" />
        <input
          className="prijava_polje-input"
          type="text"
          value={forma.fakultet}
          onChange={(e) => promeniPolje('fakultet', e.target.value)}
          aria-label="Fakultet"
        />
        {greske.fakultet && <p className="prijava_greska">{greske.fakultet}</p>}
      </div>

      {/* Godina studija */}
      <div className={`prijava_godina-sekcija ${greske.godinaStudija ? 'prijava_godina-sekcija--greska' : ''}`}>
        <img
          src={godinaStudijaNaslovImg}
          alt="Godina studija"
          className="prijava_godina-naslov-slika"
        />

        <div className="prijava_godina-kontejner">
          <div className="prijava_godina-mrezica-brojevi">
            {BROJEVI_GODINA.map((god) => (
              <button
                key={god.id}
                type="button"
                className="prijava_godina-polje-vertikalno"
                onClick={() => promeniPolje('godinaStudija', god.id)}
              >
                <div className="prijava_godina-box-wrapper">
                  <img src={rombImg} alt="" className="prijava_godina-romb-img" />
                  {forma.godinaStudija === god.id && (
                    <img src={munjicaImg} alt="" className="prijava_godina-bolt" />
                  )}
                </div>
                <span className="prijava_godina-tekst">{god.label}</span>
              </button>
            ))}
          </div>

          <div className="prijava_godina-mrezica-ostalo">
            {OSTALE_GODINE.map((god) => (
              <button
                key={god.id}
                type="button"
                className="prijava_godina-polje-horizontalno"
                onClick={() => promeniPolje('godinaStudija', god.id)}
              >
                <span className="prijava_godina-tekst">{god.label}</span>
                <div className="prijava_godina-box-wrapper">
                  <img src={rombImg} alt="" className="prijava_godina-romb-img" />
                  {forma.godinaStudija === god.id && (
                    <img src={munjicaImg} alt="" className="prijava_godina-bolt" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {greske.godinaStudija && <p className="prijava_greska">{greske.godinaStudija}</p>}
      </div>
    </div>
  );
};

export default FormStep1;