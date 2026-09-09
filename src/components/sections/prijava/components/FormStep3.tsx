import type { PrijavaForma } from '../types';

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
          <button
            type="button"
            className={`prijava_opcija ${forma.prisustvoPanelu === true ? 'prijava_opcija-aktivna' : ''}`}
            onClick={() => promeniPolje('prisustvoPanelu', true)}
          >
            Da
          </button>
          <button
            type="button"
            className={`prijava_opcija ${forma.prisustvoPanelu === false ? 'prijava_opcija-aktivna' : ''}`}
            onClick={() => promeniPolje('prisustvoPanelu', false)}
          >
            Ne
          </button>
        </div>
        {greske.prisustvoPanelu && <p className="prijava_greska">{greske.prisustvoPanelu}</p>}
      </div>

      {forma.prisustvoPanelu === true && (
        <div className="prijava_polje">
          <label className="prijava_labela">
            Koje pitanje bi postavio/la predavačima? <span className="prijava_zvezdica">*</span>
          </label>
          <textarea
            className="prijava_textarea"
            rows={3}
            value={forma.pitanjeZaPredavace}
            onChange={(e) => promeniPolje('pitanjeZaPredavace', e.target.value)}
            placeholder="Upiši..."
          />
          {greske.pitanjeZaPredavace && <p className="prijava_greska">{greske.pitanjeZaPredavace}</p>}
        </div>
      )}

      <div className="prijava_polje">
        <label className="prijava_labela">
          Navedi tri razloga zbog kojih želiš da budeš deo S2S-a ove godine <span className="prijava_zvezdica">*</span>
        </label>
        <textarea
          className="prijava_textarea"
          rows={6}
          value={forma.razloziZaS2S}
          onChange={(e) => promeniPolje('razloziZaS2S', e.target.value)}
          placeholder="Upiši..."
        />
        {greske.razloziZaS2S && <p className="prijava_greska">{greske.razloziZaS2S}</p>}
      </div>
    </div>
  );
};

export default FormStep3;