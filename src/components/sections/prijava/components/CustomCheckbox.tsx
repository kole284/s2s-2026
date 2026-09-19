import rombImg from '@/assets/prijava/fields/romb.svg';
import munjicaImg from '@/assets/prijava/icons/munjica.svg';

interface Props {
  label: string;
  izabrano: boolean;
  onClick: () => void;
  smer?: 'vertikalno' | 'horizontalno';
  rombSrc?: string;
  munjicaSrc?: string;
}

const CustomCheckbox = ({
  label,
  izabrano,
  onClick,
  smer = 'vertikalno',
  rombSrc = rombImg,
  munjicaSrc = munjicaImg,
}: Props) => (
  <button
    type="button"
    className={`prijava_checkbox prijava_checkbox--${smer} ${izabrano ? 'prijava_checkbox--aktivan' : ''}`}
    onClick={onClick}
    aria-pressed={izabrano}
  >
    <span className="prijava_checkbox-box">
      <img src={rombSrc} alt="" className="prijava_checkbox-romb" />
      {izabrano && <img src={munjicaSrc} alt="" className="prijava_checkbox-munjica" />}
    </span>
    <span className="prijava_checkbox-tekst">{label}</span>
  </button>
);

export default CustomCheckbox;