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

// Importi za labele iznad polja
import labelaPrvaZeljaImg from '@/assets/prijava/labels/labela_prva_zelja.svg';
import labelaDrugaZeljaImg from '@/assets/prijava/labels/labela_druga_zelja.svg';
import labelaNivoZnanjaImg from '@/assets/prijava/labels/labela_nivo_znanja.svg';
import labelaStaZelisDaNaucisImg from '@/assets/prijava/labels/labela_sta_zelis_da_naucis.svg';

import labelaNivoZnanjaGreskaImg from '@/assets/prijava/labels/labela_nivo_znanja_greska.svg';
import tekstBezDrugeZelje from '@/assets/prijava/decor/combobox_tekst_bez_druge_zelje.svg';

interface Props {
  forma: PrijavaForma;
  promeniPolje: <K extends keyof PrijavaForma>(
    polje: K,
    vrednost: PrijavaForma[K]
  ) => void;
  greske: Record<string, string>;
  ocistiGresku: (polje: string) => void;
  visinaTajla: number;
}

const RADIONICE = ['Radionica 1', 'Radionica 2', 'Radionica 3', 'Radionica 4'];
const NIVOI_ZNANJA: NivoZnanja[] = ['Osnovni', 'Srednji', 'Napredni'];
const PRAZNO_MIN_TAJLOVA = 8; // koliko "tajlova" visine da zauzme prostor sa tri tačke — ovde podešavaš

const TEKST_RADIONICA: Record<string, string> = {
  'Radionica 1': tekstRadionica1,
  'Radionica 2': tekstRadionica2,
  'Radionica 3': tekstRadionica3,
  'Radionica 4': tekstRadionica4,
};

const FormStep2 = ({ forma, promeniPolje, greske, ocistiGresku, visinaTajla }: Props) => {
  useEffect(() => {
    if (!forma.prvaZeljaRadionica) {
      if (forma.prvaZeljaNivoZnanja !== '') promeniPolje('prvaZeljaNivoZnanja', '' as NivoZnanja);
      if (forma.prvaZeljaPrimena !== '') promeniPolje('prvaZeljaPrimena', '');
    }
  }, [forma.prvaZeljaRadionica, forma.prvaZeljaNivoZnanja, forma.prvaZeljaPrimena, promeniPolje]);

  const izaberiNivo = (polje: 'prvaZeljaNivoZnanja' | 'drugaZeljaNivoZnanja', nivo: NivoZnanja) => {
    promeniPolje(polje, nivo);
    ocistiGresku(polje);
  };

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
      <div className="prijava_polje">
        <img src={labelaPrvaZeljaImg} alt="Prva želja *" className="prijava_labela-img" />
        <CustomSelect
          placeholder="Izaberi radionicu"
          placeholderAsset={tekstIzaberi}
          opcijaAsseti={TEKST_RADIONICA}
          obavezno
          value={forma.prvaZeljaRadionica}
          options={radionicaZaPrvoZaBiranje}
          onChange={(val) => promeniPolje('prvaZeljaRadionica', val)}
        />
      </div>

      {!forma.prvaZeljaRadionica ? (
        <div
          className="prijava_prazno-tri-tacke-wrap"
          style={visinaTajla ? { minHeight: visinaTajla * PRAZNO_MIN_TAJLOVA } : undefined}
        >
          <div className="prijava_prazno-tri-tacke">
            <span>•</span><span>•</span><span>•</span>
          </div>
        </div>
      ) : (
        <>
          <div className="prijava_polje">
            <img
              src={greske.prvaZeljaNivoZnanja ? labelaNivoZnanjaGreskaImg : labelaNivoZnanjaImg}
              alt="Nivo znanja iz ove oblasti *"
              className="prijava_labela-img"
            />
            <div className="prijava_opcije">
              {NIVOI_ZNANJA.map((nivo) => (
                <CustomCheckbox
                  key={nivo}
                  label={nivo}
                  izabrano={forma.prvaZeljaNivoZnanja === nivo}
                  onClick={() => izaberiNivo('prvaZeljaNivoZnanja', nivo)}
                />
              ))}
            </div>
          </div>

          <div className="prijava_polje">
            <img src={labelaStaZelisDaNaucisImg} alt="Šta bi želeo/la da naučiš i kako vidiš primenu? *" className="prijava_labela-img" />
            <PoljeTextareaSaSlikom
            pozadinaSlika={textareaImg}
            value={forma.prvaZeljaPrimena}
            onChange={(v) => promeniPolje('prvaZeljaPrimena', v)}
            onFokus={() => ocistiGresku('prvaZeljaPrimena')}
            ariaLabel="Šta bi želeo/la da naučiš — prva želja"
            placeholder="Upiši..."
            greska={greske.prvaZeljaPrimena}
          />
          </div>

          <hr className="prijava_razdelnik" />

          <div className="prijava_polje">
            <img src={labelaDrugaZeljaImg} alt="Izaberi radionicu — druga želja" className="prijava_labela-img" />
            <CustomSelect
              placeholder="Izaberi radionicu"
              placeholderAsset={tekstIzaberi}
              opcijaAsseti={TEKST_RADIONICA}
              bezIzboraAsset={tekstBezDrugeZelje}
              value={forma.drugaZeljaRadionica}
              options={radionicaZaDrugoZaBiranje}
              onChange={(val) => promeniPolje('drugaZeljaRadionica', val)}
            />
          </div>

          {forma.drugaZeljaRadionica && (
            <>
              <div className="prijava_polje">
                <img
                  src={greske.drugaZeljaNivoZnanja ? labelaNivoZnanjaGreskaImg : labelaNivoZnanjaImg}
                  alt="Nivo znanja iz ove oblasti *"
                  className="prijava_labela-img"
                />
                <div className="prijava_opcije">
                  {NIVOI_ZNANJA.map((nivo) => (
                    <CustomCheckbox
                      key={nivo}
                      label={nivo}
                      izabrano={forma.drugaZeljaNivoZnanja === nivo}
                      onClick={() => izaberiNivo('drugaZeljaNivoZnanja', nivo)}
                    />
                  ))}
                </div>
              </div>

              <div className="prijava_polje">
                <img src={labelaStaZelisDaNaucisImg} alt="Šta bi želeo/la da naučiš i kako vidiš primenu? *" className="prijava_labela-img" />
                  <PoljeTextareaSaSlikom
                    pozadinaSlika={textareaImg}
                    value={forma.drugaZeljaPrimena}
                    onChange={(v) => promeniPolje('drugaZeljaPrimena', v)}
                    onFokus={() => ocistiGresku('drugaZeljaPrimena')}
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