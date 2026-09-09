import './Prijava.scss';
import { useState } from 'react';
import FormStep1 from './components/FormStep1';
import FormStep2 from './components/FormStep2';
import FormStep3 from './components/FormStep3';
import FormStep4 from './components/FormStep4';
import FormNavigacija from './components/FormNavigacija';
import type { PrijavaForma } from './types';

import zvezdaLevo from '@/assets/prijava/decor/zvezda_levo.svg';
import zvezdaDesno from '@/assets/prijava/decor/zvezda_desno.svg';
import tamnoPlaviLevi from '@/assets/prijava/decor/tamno_plavi_levi_detalj.svg';
import tamnoPlaviDesni from '@/assets/prijava/decor/tamno_plavi_desni_detalj.svg';
import zutiLevi from '@/assets/prijava/decor/zuti_levi_detalj.svg';
import zutiDesni from '@/assets/prijava/decor/zuti_desni_detalj.svg';
import naslovPrijaviSe from '@/assets/prijava/decor/prijavi_se_tekst_i_zuta_pozadina.svg';
import napomenaObavezna from '@/assets/prijava/decor/pitanja_sa_zvezdicom_su_obavezna.svg';

const praznaForma: PrijavaForma = {
  imePrezime: '',
  email: '',
  telefon: '',
  fakultet: '',
  godinaStudija: '',
  prvaZeljaRadionica: '',
  prvaZeljaNivoZnanja: '',
  prvaZeljaPrimena: '',
  drugaZeljaRadionica: '',
  drugaZeljaNivoZnanja: '',
  drugaZeljaPrimena: '',
  prisustvoPanelu: null,
  pitanjeZaPredavace: '',
  razloziZaS2S: '',
  ranijeUcestvovao: null,
  s2sIskustvo: '',
  predlogRadionice: '',
  cvDriveLink: '',
  zeliObavestenja: false,
};

const Prijava = () => {
  const [forma, setForma] = useState<PrijavaForma>(praznaForma);
  const [korak, setKorak] = useState(1);
  const [poslato, setPoslato] = useState(false);
  const [greske, setGreske] = useState<Record<string, string>>({});

  const promeniPolje = <K extends keyof PrijavaForma>(
    polje: K,
    vrednost: PrijavaForma[K]
  ) => {
    setForma((prev) => ({ ...prev, [polje]: vrednost }));
  };

  const validirajKorak = (): boolean => {
    const greskeKorak: Record<string, string> = {};

    if (korak === 1) {
      if (!forma.imePrezime.trim()) greskeKorak.imePrezime = 'Ime i prezime je obavezno.';
      if (!forma.email.trim()) greskeKorak.email = 'Email je obavezan.';
      if (!forma.telefon.trim()) greskeKorak.telefon = 'Broj telefona je obavezan.';
      if (!forma.fakultet.trim()) greskeKorak.fakultet = 'Fakultet je obavezan.';
      if (!forma.godinaStudija) greskeKorak.godinaStudija = 'Godina studija je obavezna.';
    } else if (korak === 2) {
      if (!forma.prvaZeljaRadionica) greskeKorak.prvaZeljaRadionica = 'Izaberi radionicu.';
      if (!forma.prvaZeljaNivoZnanja) greskeKorak.prvaZeljaNivoZnanja = 'Izaberi nivo znanja.';
      if (!forma.prvaZeljaPrimena.trim()) greskeKorak.prvaZeljaPrimena = 'Ovo polje je obavezno.';
      if (forma.drugaZeljaRadionica) {
        if (!forma.drugaZeljaNivoZnanja) greskeKorak.drugaZeljaNivoZnanja = 'Izaberi nivo znanja.';
        if (!forma.drugaZeljaPrimena.trim()) greskeKorak.drugaZeljaPrimena = 'Ovo polje je obavezno.';
      }
    } else if (korak === 3) {
      if (forma.prisustvoPanelu === null) greskeKorak.prisustvoPanelu = 'Odgovori da li bi prisustvovao/la panelu.';
      if (forma.prisustvoPanelu === true && !forma.pitanjeZaPredavace.trim()) {
        greskeKorak.pitanjeZaPredavace = 'Upiši pitanje za predavače.';
      }
      if (!forma.razloziZaS2S.trim()) greskeKorak.razloziZaS2S = 'Ovo polje je obavezno.';
    } else if (korak === 4) {
      if (forma.ranijeUcestvovao === null) greskeKorak.ranijeUcestvovao = 'Odgovori da li si ranije učestvovao.';
      if (forma.ranijeUcestvovao === true && !forma.s2sIskustvo.trim()) {
        greskeKorak.s2sIskustvo = 'Opiši svoje iskustvo.';
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

  const posaljiPrijavu = async () => {
    if (validirajKorak()) {
      console.log('Forma spremna za slanje:', forma);
      setPoslato(true);
    }
  };

  if (poslato) {
    return (
      <section className="prijava">
        <div className="prijava_stage">
          <div className="prijava_card prijava_card--uspeh">
            <h1 className="prijava_naslov">USPEŠNO!</h1>
            <p className="prijava_uspeh_tekst">
              Tvoja prijava je zabeležena. Proveri svoj email – tamo ćeš dobiti
              jedinstveni kod za pristup igrici.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="prijava">
      <div className="prijava_stage">
        
        {/* ZAGLAVLJE SA OBLICIMA I TEKSTOM VAN PAPIRA */}
        <div className="prijava_zaglavlje">
          <img src={tamnoPlaviLevi} alt="" aria-hidden="true" className="prijava_dekor prijava_dekor--plavi-levo" />
          <img src={tamnoPlaviDesni} alt="" aria-hidden="true" className="prijava_dekor prijava_dekor--plavi-desno" />

          <img src={zutiLevi} alt="" aria-hidden="true" className="prijava_dekor prijava_dekor--zuti-levo" />
          <img src={zutiDesni} alt="" aria-hidden="true" className="prijava_dekor prijava_dekor--zuti-desno" />

          <img src={zvezdaLevo} alt="" className="prijava_zvezda prijava_zvezda--levo" />
          <img src={zvezdaDesno} alt="" className="prijava_zvezda prijava_zvezda--desno" />

          {korak === 1 ? (
            <img src={naslovPrijaviSe} alt="Prijavi se" className="prijava_naslov-img" />
          ) : (
            <h1 className="prijava_naslov">
              {korak === 2 && 'RADIONICE'}
              {korak === 3 && 'PANEL'}
              {korak === 4 && 'ISKUSTVA'}
            </h1>
          )}

          <img src={napomenaObavezna} alt="Pitanja sa * su obavezna" className="prijava_napomena-img" />
        </div>

        {/* BELI RECKAVI PAPIR */}
        <div className="prijava_card">
          <div className="prijava_sadrzaj">
            {korak === 1 && <FormStep1 forma={forma} promeniPolje={promeniPolje} greske={greske} />}
            {korak === 2 && <FormStep2 forma={forma} promeniPolje={promeniPolje} greske={greske} />}
            {korak === 3 && <FormStep3 forma={forma} promeniPolje={promeniPolje} greske={greske} />}
            {korak === 4 && <FormStep4 forma={forma} promeniPolje={promeniPolje} greske={greske} />}
          </div>

          <FormNavigacija
            korak={korak}
            onPrethodni={prethodniKorak}
            onSledeci={sledeciKorak}
            onPosalji={posaljiPrijavu}
          />
        </div>

      </div>
    </section>
  );
};

export default Prijava;