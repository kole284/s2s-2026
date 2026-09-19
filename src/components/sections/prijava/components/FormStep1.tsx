import { useState } from 'react';
import type { PrijavaForma } from '../types';

import imeIPrezimeImg from '@/assets/prijava/fields/ime_i_prezime.svg';
import imeIPrezimeSelektovanoImg from '@/assets/prijava/fields/ime_i_prezime_selektovano.svg';
import imeIPrezimeGreskaImg from '@/assets/prijava/fields/ime_i_prezime_greska.svg';

import emailImg from '@/assets/prijava/fields/email.svg';
import emailSelektovanoImg from '@/assets/prijava/fields/email_selektovano.svg';
import emailGreskaImg from '@/assets/prijava/fields/email_greska.svg';

import telefonImg from '@/assets/prijava/fields/broj_telefona.svg';
import telefonSelektovanoImg from '@/assets/prijava/fields/broj_telefona_selektovano.svg';
import telefonGreskaImg from '@/assets/prijava/fields/broj_telefona_greska.svg';

import fakultetImg from '@/assets/prijava/fields/fakultet.svg';
import fakultetSelektovanoImg from '@/assets/prijava/fields/fakultet_selektovano.svg';
import fakultetGreskaImg from '@/assets/prijava/fields/fakultet_greska.svg';

import godinaStudijaNaslovImg from '@/assets/prijava/fields/godina_studija_naslov_i_zvezdica.svg';
import rombImg from '@/assets/prijava/fields/romb.svg';
import munjicaImg from '@/assets/prijava/icons/munjica.svg';

import godinaStudijaNaslovGreskaImg from '@/assets/prijava/fields/godina_studija_naslov_i_zvezdica_greska.svg';

interface Props {
  forma: PrijavaForma;
  promeniPolje: <K extends keyof PrijavaForma>(
    polje: K,
    vrednost: PrijavaForma[K]
  ) => void;
  greske: Record<string, string>;
  ocistiGresku: (polje: string) => void;
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

type StanjePolja = 'default' | 'selektovano' | 'greska';

const slikaZaStanje = (
  podrazumevano: string,
  selektovano: string,
  greska: string,
  stanje: StanjePolja
) =>
  stanje === 'selektovano'
    ? selektovano
    : stanje === 'greska'
    ? greska
    : podrazumevano;

const odrediStanje = (
  ime: string,
  fokusirano: string | null,
  greske: Record<string, string>
): StanjePolja =>
  fokusirano === ime ? 'selektovano' : greske[ime] ? 'greska' : 'default';

const FormStep1 = ({ forma, promeniPolje, greske, ocistiGresku }: Props) => {
  const [fokusiranoPolje, setFokusiranoPolje] = useState<string | null>(null);

  const fokusirajPolje = (ime: string) => {
    setFokusiranoPolje(ime);
    ocistiGresku(ime);
  };

  const izaberiGodinu = (id: string) => {
    promeniPolje('godinaStudija', id);
    ocistiGresku('godinaStudija');
  };

  return (
    <div className="form_step">
      {/* Ime i Prezime */}
      <div className="prijava_polje-slika">
        <img
          src={slikaZaStanje(
            imeIPrezimeImg,
            imeIPrezimeSelektovanoImg,
            imeIPrezimeGreskaImg,
            odrediStanje('imePrezime', fokusiranoPolje, greske)
          )}
          alt=""
          aria-hidden="true"
          className="prijava_polje-pozadina"
        />
        <input
          className="prijava_polje-input"
          type="text"
          value={forma.imePrezime}
          onChange={(e) => promeniPolje('imePrezime', e.target.value)}
          onFocus={() => fokusirajPolje('imePrezime')}
          onBlur={() => setFokusiranoPolje(null)}
          aria-label="Ime i prezime"
        />
      </div>

      {/* Email */}
      <div className="prijava_polje-slika">
        <img
          src={slikaZaStanje(
            emailImg,
            emailSelektovanoImg,
            emailGreskaImg,
            odrediStanje('email', fokusiranoPolje, greske)
          )}
          alt=""
          aria-hidden="true"
          className="prijava_polje-pozadina"
        />
        <input
          className="prijava_polje-input"
          type="email"
          value={forma.email}
          onChange={(e) => promeniPolje('email', e.target.value)}
          onFocus={() => fokusirajPolje('email')}
          onBlur={() => setFokusiranoPolje(null)}
          aria-label="Email"
        />
      </div>

      {/* Telefon */}
      <div className="prijava_polje-slika">
        <img
          src={slikaZaStanje(
            telefonImg,
            telefonSelektovanoImg,
            telefonGreskaImg,
            odrediStanje('telefon', fokusiranoPolje, greske)
          )}
          alt=""
          aria-hidden="true"
          className="prijava_polje-pozadina"
        />
        <input
          className="prijava_polje-input"
          type="tel"
          value={forma.telefon}
          onChange={(e) => promeniPolje('telefon', e.target.value)}
          onFocus={() => fokusirajPolje('telefon')}
          onBlur={() => setFokusiranoPolje(null)}
          aria-label="Broj telefona"
        />
      </div>

      {/* Fakultet */}
      <div className="prijava_polje-slika">
        <img
          src={slikaZaStanje(
            fakultetImg,
            fakultetSelektovanoImg,
            fakultetGreskaImg,
            odrediStanje('fakultet', fokusiranoPolje, greske)
          )}
          alt=""
          aria-hidden="true"
          className="prijava_polje-pozadina"
        />
        <input
          className="prijava_polje-input"
          type="text"
          value={forma.fakultet}
          onChange={(e) => promeniPolje('fakultet', e.target.value)}
          onFocus={() => fokusirajPolje('fakultet')}
          onBlur={() => setFokusiranoPolje(null)}
          aria-label="Fakultet"
        />
      </div>

      {/* Godina studija */}
      <div
        className={`prijava_godina-sekcija ${
          greske.godinaStudija ? 'prijava_godina-sekcija--greska' : ''
        }`}
      >
        <img
          src={greske.godinaStudija ? godinaStudijaNaslovGreskaImg : godinaStudijaNaslovImg}
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
                onClick={() => izaberiGodinu(god.id)}
              >
                <div className="prijava_godina-box-wrapper">
                  <img
                    src={rombImg}
                    alt=""
                    className="prijava_godina-romb-img"
                  />
                  {forma.godinaStudija === god.id && (
                    <img
                      src={munjicaImg}
                      alt=""
                      className="prijava_godina-bolt"
                    />
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
                onClick={() => izaberiGodinu(god.id)}
              >
                <span className="prijava_godina-tekst">{god.label}</span>
                <div className="prijava_godina-box-wrapper">
                  <img
                    src={rombImg}
                    alt=""
                    className="prijava_godina-romb-img"
                  />
                  {forma.godinaStudija === god.id && (
                    <img
                      src={munjicaImg}
                      alt=""
                      className="prijava_godina-bolt"
                    />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormStep1;