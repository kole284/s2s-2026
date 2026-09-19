import type { PrijavaForma } from '../types';
import CustomCheckbox from './CustomCheckbox';
import PoljeTextareaSaSlikom from './PoljeTextareaSaSlikom';
import PoljeInputSaSlikom from './PoljeInputSaSlikom';

import textareaImg from '@/assets/prijava/fields/textarea.svg';
import cvLinkImg from '@/assets/prijava/fields/cv_link.svg';
import cvLinkSelektovanoImg from '@/assets/prijava/fields/cv_link_selektovano.svg';
import rombVeciImg from '@/assets/prijava/fields/romb_veci.svg';
import munjicaJednostavnaImg from '@/assets/prijava/icons/munjica_jednostavna.svg';
import labelaRanijeUcestvovaoImg from '@/assets/prijava/labels/labela_ranije_ucestvovao.svg';
import labelaRanijeUcestvovaoGreskaImg from '@/assets/prijava/labels/labela_ranije_ucestvovao_greska.svg';
import labelaS2sIskustvoImg from '@/assets/prijava/labels/labela_s2s_iskustvo.svg';
import labelaPredlogRadioniceImg from '@/assets/prijava/labels/labela_predlog_radionice.svg';
import labelaCvLinkImg from '@/assets/prijava/labels/labela_cv_link.svg';

interface Props {
  forma: PrijavaForma;
  promeniPolje: <K extends keyof PrijavaForma>(
    polje: K,
    vrednost: PrijavaForma[K]
  ) => void;
  greske: Record<string, string>;
  ocistiGresku: (polje: string) => void;
}

const FormStep4 = ({ forma, promeniPolje, greske, ocistiGresku }: Props) => {
  const izaberiUcestvovao = (vrednost: boolean) => {
    promeniPolje('ranijeUcestvovao', vrednost);
    ocistiGresku('ranijeUcestvovao');
  };

  return (
    <div className="form_step">
      <div className="prijava_polje">
        <img
          src={greske.ranijeUcestvovao ? labelaRanijeUcestvovaoGreskaImg : labelaRanijeUcestvovaoImg}
          alt="Da li si ranije učestvovao/la na S2S-u? *"
          className="prijava_labela-img"
        />
        <div className="prijava_opcije">
          <CustomCheckbox
            label="Da"
            smer="horizontalno"
            izabrano={forma.ranijeUcestvovao === true}
            onClick={() => izaberiUcestvovao(true)}
          />
          <CustomCheckbox
            label="Ne"
            smer="horizontalno"
            izabrano={forma.ranijeUcestvovao === false}
            onClick={() => izaberiUcestvovao(false)}
          />
        </div>
      </div>

      {forma.ranijeUcestvovao === true && (
        <div className="prijava_polje">
          <img src={labelaS2sIskustvoImg} alt="Šta ti se posebno dopalo, a šta bi voleo/la da bude drugačije ove godine? *" className="prijava_labela-img" />
          <PoljeTextareaSaSlikom
            pozadinaSlika={textareaImg}
            value={forma.s2sIskustvo}
            onChange={(v) => promeniPolje('s2sIskustvo', v)}
            onFokus={() => ocistiGresku('s2sIskustvo')}
            ariaLabel="Iskustvo sa prethodnog S2S-a"
            placeholder="Upiši..."
            greska={greske.s2sIskustvo}
          />
        </div>
      )}

      <div className="prijava_polje">
        <img src={labelaPredlogRadioniceImg} alt="Da li imaš predlog za radionicu koja do sad nije bila održana?" className="prijava_labela-img" />
        <PoljeTextareaSaSlikom
          pozadinaSlika={textareaImg}
          value={forma.predlogRadionice}
          onChange={(v) => promeniPolje('predlogRadionice', v)}
          ariaLabel="Predlog radionice"
          placeholder="Upiši..."
        />
      </div>

      <div className="prijava_polje">
        <img src={labelaCvLinkImg} alt="Link ka CV-ju (Google Drive)" className="prijava_labela-img" />
        <p className="prijava_opis">
          Ukoliko želiš da pokrovitelj(i) projekta dobiju tvoje kontakt podatke,
          priloži link. Uveri se da je dokument dostupan svima koji imaju link.
        </p>
        <PoljeInputSaSlikom
          pozadinaSlika={cvLinkImg}
          pozadinaSlikaSelektovano={cvLinkSelektovanoImg}
          value={forma.cvDriveLink}
          onChange={(v) => promeniPolje('cvDriveLink', v)}
          ariaLabel="Link ka CV-ju"
          placeholder="https://drive.google.com/..."
          type="url"
        />
      </div>

      <div className="prijava_polje prijava_polje--checkbox">
        <CustomCheckbox
          label="Želim da primam obaveštenja o budućim događajima koje organizuje FONIS"
          smer="horizontalno"
          izabrano={forma.zeliObavestenja}
          onClick={() => promeniPolje('zeliObavestenja', !forma.zeliObavestenja)}
          rombSrc={rombVeciImg}
          munjicaSrc={munjicaJednostavnaImg}
        />
      </div>
    </div>
  );
};

export default FormStep4;