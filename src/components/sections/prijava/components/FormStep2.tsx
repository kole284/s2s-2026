import { useEffect } from 'react';
import type { PrijavaForma, NivoZnanja } from '../types';
import CustomSelect from './CustomSelect';

interface Props {
  forma: PrijavaForma;
  promeniPolje: <K extends keyof PrijavaForma>(
    polje: K,
    vrednost: PrijavaForma[K]
  ) => void;
  greske: Record<string, string>;
}

const RADIONICE = ['Radionica 1', 'Radionica 2', 'Radionica 3', 'Radionica 4'];
const NIVOI_ZNANJA: NivoZnanja[] = ['Osnovni', 'Srednji', 'Napredni'];

const FormStep2 = ({ forma, promeniPolje, greske }: Props) => {
  // Automatski reset polja prve želje ako se odustane od radionice
  useEffect(() => {
    if (!forma.prvaZeljaRadionica) {
      promeniPolje('prvaZeljaNivoZnanja', '' as NivoZnanja);
      promeniPolje('prvaZeljaPrimena', '');
    }
  }, [forma.prvaZeljaRadionica, promeniPolje]);

  // Automatski reset polja druge želje ako se odustane od radionice
  useEffect(() => {
    if (!forma.drugaZeljaRadionica) {
      promeniPolje('drugaZeljaNivoZnanja', '' as NivoZnanja);
      promeniPolje('drugaZeljaPrimena', '');
    }
  }, [forma.drugaZeljaRadionica, promeniPolje]);

  const radionicaZaPrvoZaBiranje = RADIONICE.filter(
    (r) => r !== forma.drugaZeljaRadionica
  );
  const radionicaZaDrugoZaBiranje = RADIONICE.filter(
    (r) => r !== forma.prvaZeljaRadionica
  );

  return (
    <div className="form_step form_step--2">
      {/* Glavni dropdown za prvu želju */}
      <CustomSelect
        placeholder="Izaberi radionicu"
        obavezno
        value={forma.prvaZeljaRadionica}
        options={radionicaZaPrvoZaBiranje}
        onChange={(val) => promeniPolje('prvaZeljaRadionica', val)}
        greska={greske.prvaZeljaRadionica}
      />

      {/* Kada nije izabrana radionica: prikaz tri tačke u centru papira */}
      {!forma.prvaZeljaRadionica ? (
        <div className="prijava_prazno-tri-tacke">
          <span>•</span>
          <span>•</span>
          <span>•</span>
        </div>
      ) : (
        <>
          <div className="prijava_polje">
            <label className="prijava_labela">
              Nivo znanja iz ove oblasti <span className="prijava_zvezdica">*</span>
            </label>
            <div className="prijava_opcije">
              {NIVOI_ZNANJA.map((nivo) => (
                <button
                  key={nivo}
                  type="button"
                  className={`prijava_opcija ${
                    forma.prvaZeljaNivoZnanja === nivo ? 'prijava_opcija-aktivna' : ''
                  }`}
                  onClick={() => promeniPolje('prvaZeljaNivoZnanja', nivo)}
                >
                  {nivo}
                </button>
              ))}
            </div>
            {greske.prvaZeljaNivoZnanja && (
              <p className="prijava_greska">{greske.prvaZeljaNivoZnanja}</p>
            )}
          </div>

          <div className="prijava_polje">
            <label className="prijava_labela">
              Šta bi želeo/la da naučiš i kako vidiš primenu?{' '}
              <span className="prijava_zvezdica">*</span>
            </label>
            <textarea
              className="prijava_textarea"
              rows={4}
              value={forma.prvaZeljaPrimena}
              onChange={(e) => promeniPolje('prvaZeljaPrimena', e.target.value)}
              placeholder="Upiši..."
            />
            {greske.prvaZeljaPrimena && (
              <p className="prijava_greska">{greske.prvaZeljaPrimena}</p>
            )}
          </div>

          <hr className="prijava_razdelnik" />

          <CustomSelect
            labela="Izaberi radionicu — druga želja"
            value={forma.drugaZeljaRadionica}
            options={radionicaZaDrugoZaBiranje}
            placeholder="-- opciono --"
            onChange={(val) => promeniPolje('drugaZeljaRadionica', val)}
          />

          {forma.drugaZeljaRadionica && (
            <>
              <div className="prijava_polje">
                <label className="prijava_labela">
                  Nivo znanja iz ove oblasti <span className="prijava_zvezdica">*</span>
                </label>
                <div className="prijava_opcije">
                  {NIVOI_ZNANJA.map((nivo) => (
                    <button
                      key={nivo}
                      type="button"
                      className={`prijava_opcija ${
                        forma.drugaZeljaNivoZnanja === nivo
                          ? 'prijava_opcija-aktivna'
                          : ''
                      }`}
                      onClick={() => promeniPolje('drugaZeljaNivoZnanja', nivo)}
                    >
                      {nivo}
                    </button>
                  ))}
                </div>
                {greske.drugaZeljaNivoZnanja && (
                  <p className="prijava_greska">{greske.drugaZeljaNivoZnanja}</p>
                )}
              </div>

              <div className="prijava_polje">
                <label className="prijava_labela">
                  Šta bi želeo/la da naučiš i kako vidiš primenu?{' '}
                  <span className="prijava_zvezdica">*</span>
                </label>
                <textarea
                  className="prijava_textarea"
                  rows={4}
                  value={forma.drugaZeljaPrimena}
                  onChange={(e) => promeniPolje('drugaZeljaPrimena', e.target.value)}
                  placeholder="Upiši..."
                />
                {greske.drugaZeljaPrimena && (
                  <p className="prijava_greska">{greske.drugaZeljaPrimena}</p>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default FormStep2;