import { useState } from 'react';
import textareaSelektovanoImg from '@/assets/prijava/fields/textarea_selektovano.svg';
import textareaGreskaImg from '@/assets/prijava/fields/textarea_greska.svg';

interface Props {
  pozadinaSlika: string;
  value: string;
  onChange: (v: string) => void;
  ariaLabel: string;
  placeholder?: string;
  greska?: string;
  onFokus?: () => void; // poziva se pri fokusu — koristi se da očisti grešku
}

const PoljeTextareaSaSlikom = ({ pozadinaSlika, value, onChange, ariaLabel, placeholder, greska, onFokus }: Props) => {
  const [fokusirano, setFokusirano] = useState(false);

  const trenutnaSlika = fokusirano
    ? textareaSelektovanoImg
    : greska
    ? textareaGreskaImg
    : pozadinaSlika;

  return (
    <div className="prijava_polje-slika">
      <img src={trenutnaSlika} alt="" aria-hidden="true" className="prijava_polje-pozadina" />
      <textarea
        className="prijava_polje-textarea-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          setFokusirano(true);
          onFokus?.();
        }}
        onBlur={() => setFokusirano(false)}
        aria-label={ariaLabel}
        placeholder={placeholder}
      />
    </div>
  );
};

export default PoljeTextareaSaSlikom;