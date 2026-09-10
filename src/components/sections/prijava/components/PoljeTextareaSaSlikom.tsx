interface Props {
  pozadinaSlika: string;
  value: string;
  onChange: (v: string) => void;
  ariaLabel: string;
  placeholder?: string;
  greska?: string;
}

const PoljeTextareaSaSlikom = ({ pozadinaSlika, value, onChange, ariaLabel, placeholder, greska }: Props) => (
  <div className={`prijava_polje-slika prijava_polje-slika--textarea ${greska ? 'prijava_polje-slika--greska' : ''}`}>
    <img src={pozadinaSlika} alt="" aria-hidden="true" className="prijava_polje-pozadina" />
    <textarea
      className="prijava_polje-textarea-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      placeholder={placeholder}
    />
    {greska && <p className="prijava_greska">{greska}</p>}
  </div>
);

export default PoljeTextareaSaSlikom;