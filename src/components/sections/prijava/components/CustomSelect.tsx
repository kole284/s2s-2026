import { useState, useRef, useEffect } from 'react';
import okvirBezTeksta from '@/assets/prijava/decor/izaberi_radionicu_combobox_bez_teksta.svg';
import stavkaPozadina from '@/assets/prijava/decor/combobox_item.svg';

interface CustomSelectProps {
  labela?: string;
  obavezno?: boolean;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  placeholder?: string;
  opcijaAsseti: Record<string, string>;
  placeholderAsset: string;
  bezIzboraAsset?: string; // ako je prosleđeno, dodaje se kao PRVA stavka u listi
}

const CustomSelect = ({
  labela,
  obavezno = false,
  value,
  options,
  onChange,
  placeholder = 'Izaberi radionicu',
  opcijaAsseti,
  placeholderAsset,
  bezIzboraAsset,
}: CustomSelectProps) => {
  const [otvoreno, setOtvoreno] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obradiKlikVan = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setOtvoreno(false);
      }
    };
    document.addEventListener('mousedown', obradiKlikVan);
    return () => document.removeEventListener('mousedown', obradiKlikVan);
  }, []);

  const trenutniTekstAsset = value ? opcijaAsseti[value] : placeholderAsset;

  return (
    <div className="prijava_polje" ref={selectRef}>
      {labela && (
        <label className="prijava_labela">
          {labela} {obavezno && <span className="prijava_zvezdica">*</span>}
        </label>
      )}

      <div className="prijava_combobox">
        <button
          type="button"
          className="prijava_combobox-okvir"
          onClick={() => setOtvoreno((prev) => !prev)}
        >
          <img src={okvirBezTeksta} alt="" className="prijava_combobox-okvir-img" />

          <span className="prijava_combobox-tekst-zona">
            <img src={trenutniTekstAsset} alt={value || placeholder} className="prijava_combobox-tekst-img" />
          </span>

          <span
            className={`prijava_combobox-strelica ${otvoreno ? 'prijava_combobox-strelica--otvoreno' : ''}`}
            aria-hidden="true"
          />
        </button>

        <div className="prijava_combobox-meni-wrap" data-otvoreno={otvoreno}>
          <div className="prijava_combobox-meni">
            {bezIzboraAsset && (
              <div
                className={`prijava_combobox-opcija ${value === '' ? 'prijava_combobox-opcija--izabrana' : ''}`}
                onClick={() => {
                  onChange('');
                  setOtvoreno(false);
                }}
              >
                <img src={stavkaPozadina} alt="" className="prijava_combobox-opcija-img" />
                <span className="prijava_combobox-opcija-tekst-zona">
                  <img src={bezIzboraAsset} alt="Bez druge želje" className="prijava_combobox-tekst-img" />
                </span>
              </div>
            )}

            {options.map((opt) => (
              <div
                key={opt}
                className={`prijava_combobox-opcija ${value === opt ? 'prijava_combobox-opcija--izabrana' : ''}`}
                onClick={() => {
                  onChange(opt);
                  setOtvoreno(false);
                }}
              >
                <img src={stavkaPozadina} alt="" className="prijava_combobox-opcija-img" />
                <span className="prijava_combobox-opcija-tekst-zona">
                  <img src={opcijaAsseti[opt]} alt={opt} className="prijava_combobox-tekst-img" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomSelect;