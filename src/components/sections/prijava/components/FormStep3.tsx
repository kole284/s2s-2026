import type { PrijavaForma } from '../types';
import CustomCheckbox from './CustomCheckbox';
import PoljeTextareaSaSlikom from './PoljeTextareaSaSlikom';

import textareaImg from '@/assets/prijava/fields/textarea.svg';
import labelaPrisustvoPaneluImg from '@/assets/prijava/labels/labela_prisustvo_panelu.svg';
import labelaPrisustvoPaneluGreskaImg from '@/assets/prijava/labels/labela_prisustvo_panelu_greska.svg';
import labelaPitanjeZaPredavaceImg from '@/assets/prijava/labels/labela_pitanje_za_predavace.svg';
import labelaRazloziZaS2sImg from '@/assets/prijava/labels/labela_razlozi_za_s2s.svg';

interface Props {
  forma: PrijavaForma;
  promeniPolje: <K extends keyof PrijavaForma>(
    polje: K,
    vrednost: PrijavaForma[K]
  ) => void;
  greske: Record<string, string>;
  ocistiGresku: (polje: string) => void;
}

const OPIS_PANELA = '[opis panela]';

const FormStep3 = ({ forma, promeniPolje, greske, ocistiGresku }: Props) => {
  const izaberiPrisustvo = (vrednost: boolean) => {
    promeniPolje('prisustvoPanelu', vrednost);
    ocistiGresku('prisustvoPanelu');
  };

  return (
    <div className="form_step">
      <div className="prijava_polje">
        <img
          src={greske.prisustvoPanelu ? labelaPrisustvoPaneluGreskaImg : labelaPrisustvoPaneluImg}
          alt="Da li bi prisustvovao/la panel diskusiji *"
          className="prijava_labela-img"
        />
        <p className="prijava_opis">{OPIS_PANELA}</p>
        <div className="prijava_opcije">
          <CustomCheckbox
            label="Da"
            smer="horizontalno"
            izabrano={forma.prisustvoPanelu === true}
            onClick={() => izaberiPrisustvo(true)}
          />
          <CustomCheckbox
            label="Ne"
            smer="horizontalno"
            izabrano={forma.prisustvoPanelu === false}
            onClick={() => izaberiPrisustvo(false)}
          />
        </div>
      </div>

      {forma.prisustvoPanelu === true && (
        <div className="prijava_polje">
          <img src={labelaPitanjeZaPredavaceImg} alt="Koje pitanje bi postavio/la predavačima? *" className="prijava_labela-img" />
          <PoljeTextareaSaSlikom
            pozadinaSlika={textareaImg}
            value={forma.pitanjeZaPredavace}
            onChange={(v) => promeniPolje('pitanjeZaPredavace', v)}
            onFokus={() => ocistiGresku('pitanjeZaPredavace')}
            ariaLabel="Pitanje za predavače"
            placeholder="Upiši..."
            greska={greske.pitanjeZaPredavace}
          />
        </div>
      )}

      <div className="prijava_polje">
        <img src={labelaRazloziZaS2sImg} alt="Navedi tri razloga zbog kojih želiš da budeš deo S2S-a ove godine *" className="prijava_labela-img" />
        <PoljeTextareaSaSlikom
          pozadinaSlika={textareaImg}
          value={forma.razloziZaS2S}
          onChange={(v) => promeniPolje('razloziZaS2S', v)}
          onFokus={() => ocistiGresku('razloziZaS2S')}
          ariaLabel="Razlozi za učešće na S2S-u"
          placeholder="Upiši..."
          greska={greske.razloziZaS2S}
        />
      </div>
    </div>
  );
};

export default FormStep3;