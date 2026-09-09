import type { PrijavaForma } from '../types';

interface Props {
  forma: PrijavaForma;
  promeniPolje: <K extends keyof PrijavaForma>(
    polje: K,
    vrednost: PrijavaForma[K]
  ) => void;
  greske: Record<string, string>;
}

const FormStep4 = ({ forma, promeniPolje, greske }: Props) => {
  return (
    <div className="form_step">
      <div className="prijava_polje">
        <label className="prijava_labela">
          Da li si ranije učestvovao/la na S2S-u? <span className="prijava_zvezdica">*</span>
        </label>
        <div className="prijava_opcije">
          <button
            type="button"
            className={`prijava_opcija ${forma.ranijeUcestvovao === true ? 'prijava_opcija-aktivna' : ''}`}
            onClick={() => promeniPolje('ranijeUcestvovao', true)}
          >
            Da
          </button>
          <button
            type="button"
            className={`prijava_opcija ${forma.ranijeUcestvovao === false ? 'prijava_opcija-aktivna' : ''}`}
            onClick={() => promeniPolje('ranijeUcestvovao', false)}
          >
            Ne
          </button>
        </div>
        {greske.ranijeUcestvovao && <p className="prijava_greska">{greske.ranijeUcestvovao}</p>}
      </div>

      {forma.ranijeUcestvovao === true && (
        <div className="prijava_polje">
          <label className="prijava_labela">
            Šta ti se posebno dopalo, a šta bi voleo/la da bude drugačije ove godine?{' '}
            <span className="prijava_zvezdica">*</span>
          </label>
          <textarea
            className="prijava_textarea"
            rows={4}
            value={forma.s2sIskustvo}
            onChange={(e) => promeniPolje('s2sIskustvo', e.target.value)}
            placeholder="Upiši..."
          />
          {greske.s2sIskustvo && <p className="prijava_greska">{greske.s2sIskustvo}</p>}
        </div>
      )}

      <div className="prijava_polje">
        <label className="prijava_labela">
          Da li imaš predlog za radionicu koja do sad nije bila održana?
        </label>
        <textarea
          className="prijava_textarea"
          rows={3}
          value={forma.predlogRadionice}
          onChange={(e) => promeniPolje('predlogRadionice', e.target.value)}
          placeholder="Upiši..."
        />
      </div>

      <div className="prijava_polje">
        <label className="prijava_labela">Link ka CV-ju (Google Drive)</label>
        <p className="prijava_opis">
          Ukoliko želiš da pokrovitelj(i) projekta dobiju tvoje kontakt podatke,
          priloži link. Uveri se da je dokument dostupan svima koji imaju link.
        </p>
        <input
          className="prijava_input"
          type="url"
          value={forma.cvDriveLink}
          onChange={(e) => promeniPolje('cvDriveLink', e.target.value)}
          placeholder="https://drive.google.com/..."
        />
      </div>

      <div className="prijava_polje prijava_polje--checkbox">
        <label className="prijava_checkbox_labela">
          <input
            type="checkbox"
            checked={forma.zeliObavestenja}
            onChange={(e) => promeniPolje('zeliObavestenja', e.target.checked)}
          />
          Želim da primam obaveštenja o budućim događajima koje organizuje FONIS
        </label>
      </div>
    </div>
  );
};

export default FormStep4;