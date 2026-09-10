import { useEffect } from 'react';
import type { PrijavaForma, NivoZnanja } from '../types';
import CustomSelect from './CustomSelect';
import CustomCheckbox from './CustomCheckbox';
import PoljeTextareaSaSlikom from './PoljeTextareaSaSlikom';
import textareaImg from '@/assets/prijava/fields/textarea.svg';
import tekstIzaberi from '@/assets/prijava/decor/combobox_tekst_izaberi_radionicu.svg';
import tekstRadionica1 from '@/assets/prijava/decor/combobox_tekst_radionica_1.svg';
import tekstRadionica2 from '@/assets/prijava/decor/combobox_tekst_radionica_2.svg';
import tekstRadionica3 from '@/assets/prijava/decor/combobox_tekst_radionica_3.svg';
import tekstRadionica4 from '@/assets/prijava/decor/combobox_tekst_radionica_4.svg';

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

const TEKST_RADIONICA: Record<string, string> = {
  'Radionica 1': tekstRadionica1,
  'Radionica 2': tekstRadionica2,
  'Radionica 3': tekstRadionica3,
  'Radionica 4': tekstRadionica4,
};

const FormStep2 = ({ forma, promeniPolje, greske }: Props) => {
  useEffect(() => {
    if (!forma.prvaZeljaRadionica) {
      if (forma.prvaZeljaNivoZnanja !== '') promeniPolje('prvaZeljaNivoZnanja', '' as NivoZnanja);
      if (forma.prvaZeljaPrimena !== '') promeniPolje('prvaZeljaPrimena', '');
    }
  }, [forma.prvaZeljaRadionica, forma.prvaZeljaNivoZnanja, forma.prvaZeljaPrimena, promeniPolje]);

  useEffect(() => {
    if (!forma.drugaZeljaRadionica) {
      if (forma.drugaZeljaNivoZnanja !== '') promeniPolje('drugaZeljaNivoZnanja', '' as NivoZnanja);
      if (forma.drugaZeljaPrimena !== '') promeniPolje('drugaZeljaPrimena', '');
    }
  }, [forma.drugaZeljaRadionica, forma.drugaZeljaNivoZnanja, forma.drugaZeljaPrimena, promeniPolje]);

  const radionicaZaPrvoZaBiranje = RADIONICE.filter((r) => r !== forma.drugaZeljaRadionica);
  const radionicaZaDrugoZaBiranje = RADIONICE.filter((r) => r !== forma.prvaZeljaRadionica);

  return (
    <div className="form_step form_step--2">
      <CustomSelect
        placeholder="Izaberi radionicu"
        placeholderAsset={tekstIzaberi}
        opcijaAsseti={TEKST_RADIONICA}
        obavezno
        value={forma.prvaZeljaRadionica}
        options={radionicaZaPrvoZaBiranje}
        onChange={(val) => promeniPolje('prvaZeljaRadionica', val)}
        greska={greske.prvaZeljaRadionica}
      />

      {!forma.prvaZeljaRadionica ? (
        <div className="prijava_prazno-tri-tacke">
          <span>•</span><span>•</span><span>•</span>
        </div>
      ) : (
        <>
          <div className="prijava_polje">
            <label className="prijava_labela">
              Nivo znanja iz ove oblasti <span className="prijava_zvezdica">*</span>
            </label>
            <div className="prijava_opcije">
              {NIVOI_ZNANJA.map((nivo) => (
                <CustomCheckbox
                  key={nivo}
                  label={nivo}
                  izabrano={forma.prvaZeljaNivoZnanja === nivo}
                  onClick={() => promeniPolje('prvaZeljaNivoZnanja', nivo)}
                />
              ))}
            </div>
            {greske.prvaZeljaNivoZnanja && <p className="prijava_greska">{greske.prvaZeljaNivoZnanja}</p>}
          </div>

          <div className="prijava_polje">
            <label className="prijava_labela">
              Šta bi želeo/la da naučiš i kako vidiš primenu? <span className="prijava_zvezdica">*</span>
            </label>
            <PoljeTextareaSaSlikom
              pozadinaSlika={textareaImg}
              value={forma.prvaZeljaPrimena}
              onChange={(v) => promeniPolje('prvaZeljaPrimena', v)}
              ariaLabel="Šta bi želeo/la da naučiš — prva želja"
              placeholder="Upiši..."
              greska={greske.prvaZeljaPrimena}
            />
          </div>

          <hr className="prijava_razdelnik" />

          <CustomSelect
            labela="Izaberi radionicu — druga želja"
            placeholder="Izaberi radionicu"
            placeholderAsset={tekstIzaberi}
            opcijaAsseti={TEKST_RADIONICA}
            value={forma.drugaZeljaRadionica}
            options={radionicaZaDrugoZaBiranje}
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
                    <CustomCheckbox
                      key={nivo}
                      label={nivo}
                      izabrano={forma.drugaZeljaNivoZnanja === nivo}
                      onClick={() => promeniPolje('drugaZeljaNivoZnanja', nivo)}
                    />
                  ))}
                </div>
                {greske.drugaZeljaNivoZnanja && <p className="prijava_greska">{greske.drugaZeljaNivoZnanja}</p>}
              </div>

              <div className="prijava_polje">
                <label className="prijava_labela">
                  Šta bi želeo/la da naučiš i kako vidiš primenu? <span className="prijava_zvezdica">*</span>
                </label>
                <PoljeTextareaSaSlikom
                  pozadinaSlika={textareaImg}
                  value={forma.drugaZeljaPrimena}
                  onChange={(v) => promeniPolje('drugaZeljaPrimena', v)}
                  ariaLabel="Šta bi želeo/la da naučiš — druga želja"
                  placeholder="Upiši..."
                  greska={greske.drugaZeljaPrimena}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default FormStep2;