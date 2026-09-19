// PoljeInputSaSlikom.tsx
import { useState } from 'react';

interface Props {
  pozadinaSlika: string;
  pozadinaSlikaSelektovano: string;
  value: string;
  onChange: (v: string) => void;
  ariaLabel: string;
  placeholder?: string;
  type?: string;
}

const PoljeInputSaSlikom = ({
  pozadinaSlika,
  pozadinaSlikaSelektovano,
  value,
  onChange,
  ariaLabel,
  placeholder,
  type = 'text',
}: Props) => {
  const [fokusirano, setFokusirano] = useState(false);

  return (
    <div className="prijava_polje-slika">
      <img
        src={fokusirano ? pozadinaSlikaSelektovano : pozadinaSlika}
        alt=""
        aria-hidden="true"
        className="prijava_polje-pozadina"
      />
      <input
        className="prijava_polje-input"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFokusirano(true)}
        onBlur={() => setFokusirano(false)}
        aria-label={ariaLabel}
        placeholder={placeholder}
      />
    </div>
  );
};

export default PoljeInputSaSlikom;