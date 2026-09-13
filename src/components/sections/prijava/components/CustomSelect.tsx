import { useState, useRef, useEffect } from 'react';
import radioniceSelectShell from '@/assets/prijava/fields/radionice-select-shell.svg';

interface CustomSelectProps {
  labela?: string;
  obavezno?: boolean;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  placeholder?: string;
  greska?: string;
}

const CustomSelect = ({
  labela,
  obavezno = false,
  value,
  options,
  onChange,
  placeholder = 'Izaberi radionicu',
  greska,
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

  return (
    <div className={`prijava_polje prijava_polje--select${greska ? " prijava_polje--select-error" : ""}`} ref={selectRef}>
      {labela && (
        <label className="prijava_labela">
          {labela} {obavezno && <span className="prijava_zvezdica">*</span>}
        </label>
      )}

      <div className={`prijava_combobox${obavezno ? " prijava_combobox--required" : ""}`}>
        <img
          src={radioniceSelectShell}
          alt=""
          className="prijava_combobox-shell"
          aria-hidden="true"
        />

        {obavezno ? (
          <span className="prijava_combobox-required" aria-hidden="true">*</span>
        ) : null}

        <button
          type="button"
          className={`prijava_combobox-okvir ${otvoreno ? 'prijava_combobox-okvir--otvoreno' : ''}`}
          onClick={() => setOtvoreno((prev) => !prev)}
          aria-expanded={otvoreno}
          aria-haspopup="listbox"
          aria-label={labela || placeholder}
          aria-invalid={Boolean(greska)}
        >
          <span className="prijava_combobox-tekst">
            {value || placeholder}
          </span>
          <span className={`prijava_combobox-strelica ${otvoreno ? 'prijava_combobox-strelica--otvoreno' : ''}`}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </span>
        </button>

        <div className="prijava_combobox-meni-wrap" data-otvoreno={otvoreno}>
          <div className="prijava_combobox-meni" role="listbox" aria-label={labela || placeholder}>
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                role="option"
                aria-selected={value === opt}
                className={`prijava_combobox-opcija ${value === opt ? 'prijava_combobox-opcija--izabrana' : ''}`}
                onClick={() => {
                  onChange(opt);
                  setOtvoreno(false);
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {greska && <p className="prijava_greska">{greska}</p>}
    </div>
  );
};

export default CustomSelect;
