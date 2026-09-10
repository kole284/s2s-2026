// FormStep3.tsx
import type { PrijavaForma } from '../types';
import CustomCheckbox from './CustomCheckbox';
import PoljeTextareaSaSlikom from './PoljeTextareaSaSlikom';
import textareaImg from '@/assets/prijava/fields/textarea.svg';

interface Props {
  forma: PrijavaForma;
  promeniPolje: <K extends keyof PrijavaForma>(
    polje: K,
    vrednost: PrijavaForma[K]
  ) => void;
  greske: Record<string, string>;
}

// TODO: zameniti pravim nazivom i opisom panela
const NAZIV_PANELA = '[naziv panel diskusije]';
const OPIS_PANELA = '[opis panela]';

const FormStep3 = ({ forma, promeniPolje, greske }: Props) => {
  return (
    <div className="form_step">
      <div className="prijava_polje">
        <label className="prijava_labela">
          Da li bi prisustvovao/la panel diskusiji „{NAZIV_PANELA}“? <span className="prijava_zvezdica">*</span>
        </label>
        <p className="prijava_opis">{OPIS_PANELA}</p>
        <div className="prijava_opcije">
          <CustomCheckbox
            label="Da"
            smer="horizontalno"
            izabrano={forma.prisustvoPanelu === true}
            onClick={() => promeniPolje('prisustvoPanelu', true)}
          />
          <CustomCheckbox
            label="Ne"
            smer="horizontalno"
            izabrano={forma.prisustvoPanelu === false}
            onClick={() => promeniPolje('prisustvoPanelu', false)}
          />
        </div>
        {greske.prisustvoPanelu && <p className="prijava_greska">{greske.prisustvoPanelu}</p>}
      </div>

      {forma.prisustvoPanelu === true && (
        <div className="prijava_polje">
          <label className="prijava_labela">
            Koje pitanje bi postavio/la predavačima? <span className="prijava_zvezdica">*</span>
          </label>
          <PoljeTextareaSaSlikom
            pozadinaSlika={textareaImg}
            value={forma.pitanjeZaPredavace}
            onChange={(v) => promeniPolje('pitanjeZaPredavace', v)}
            ariaLabel="Pitanje za predavače"
            placeholder="Upiši..."
            greska={greske.pitanjeZaPredavace}
          />
        </div>
      )}

      <div className="prijava_polje">
        <label className="prijava_labela">
          Navedi tri razloga zbog kojih želiš da budeš deo S2S-a ove godine <span className="prijava_zvezdica">*</span>
        </label>
        <PoljeTextareaSaSlikom
          pozadinaSlika={textareaImg}
          value={forma.razloziZaS2S}
          onChange={(v) => promeniPolje('razloziZaS2S', v)}
          ariaLabel="Razlozi za učešće na S2S-u"
          placeholder="Upiši..."
          greska={greske.razloziZaS2S}
        />
      </div>
    </div>
  );
};

export default FormStep3;