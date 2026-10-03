import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

import "./WorkshopPicker.scss";

/*
 * Izbor radionice na telefonu: meni na sredini ekrana preko zamućene
 * pozadine, sa svim radionicama odjednom. Padajući meni ispod polja je na
 * telefonu pokazivao samo 3 od 10 radionica (bez vidljivog skrola) i
 * prekrivao polja ispod. Na desktopu ostaje padajući meni.
 */

type WorkshopPickerProps = {
  naslov: string;
  druga?: boolean;
  value: string;
  options: string[];
  pickerRef: RefObject<HTMLDivElement | null>;
  onIzaberi: (opcija: string) => void;
  onZatvori: () => void;
};

const WorkshopPicker = ({
  naslov,
  druga = false,
  value,
  options,
  pickerRef,
  onIzaberi,
  onZatvori,
}: WorkshopPickerProps) => {
  const naslovId = useId();
  const listaRef = useRef<HTMLDivElement>(null);
  // Izbor u trenutku otvaranja; fokus se postavlja samo tada.
  const [pocetnaOpcija] = useState(() => Math.max(0, options.indexOf(value)));

  // Fokus na izabranu (ili prvu) opciju; po zatvaranju nazad na polje.
  useEffect(() => {
    const prethodni = document.activeElement as HTMLElement | null;
    const opcija = listaRef.current?.querySelectorAll<HTMLButtonElement>(
      '[role="option"]',
    )[pocetnaOpcija];

    opcija?.focus({ preventScroll: true });
    opcija?.scrollIntoView({ block: "nearest" });

    return () => prethodni?.focus({ preventScroll: true });
  }, [pocetnaOpcija]);

  // Forma iza menija se na telefonu skroluje unutar #prijava; ne sme da se
  // pomera dok je meni otvoren.
  useEffect(() => {
    const sekcija = document.getElementById("prijava");

    if (!sekcija) return;

    const prethodni = sekcija.style.overflowY;
    sekcija.style.overflowY = "hidden";

    return () => {
      sekcija.style.overflowY = prethodni;
    };
  }, []);

  const naTaster = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onZatvori();
      return;
    }

    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

    event.preventDefault();

    const opcije = Array.from(
      listaRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="option"]',
      ) ?? [],
    );
    const trenutna = opcije.indexOf(
      document.activeElement as HTMLButtonElement,
    );
    const sledeca =
      event.key === "ArrowDown"
        ? Math.min(trenutna + 1, opcije.length - 1)
        : Math.max(trenutna - 1, 0);

    opcije[sledeca]?.focus();
  };

  return createPortal(
    <div
      ref={pickerRef}
      className={`prijava-workshop-picker${druga ? " prijava-workshop-picker--druga" : ""}`}
      onKeyDown={naTaster}
    >
      <div
        className="prijava-workshop-picker__pozadina"
        aria-hidden="true"
        onClick={onZatvori}
      />

      <div
        className="prijava-workshop-picker__kartica"
        role="dialog"
        aria-modal="true"
        aria-labelledby={naslovId}
      >
        <div className="prijava-workshop-picker__zaglavlje">
          <h3 id={naslovId} className="prijava-workshop-picker__naslov">
            {naslov}
          </h3>
          <button
            type="button"
            className="prijava-workshop-picker__zatvori"
            aria-label="Zatvori izbor radionice"
            onClick={onZatvori}
          >
            <span aria-hidden="true" />
          </button>
        </div>

        <div
          ref={listaRef}
          className="prijava-workshop-picker__lista"
          role="listbox"
          aria-labelledby={naslovId}
        >
          {options.map((opcija) => (
            <button
              key={opcija}
              type="button"
              role="option"
              aria-selected={value === opcija}
              className={`prijava-workshop-picker__opcija${
                value === opcija ? " prijava-workshop-picker__opcija--izabrana" : ""
              }`}
              onClick={() => onIzaberi(opcija)}
            >
              <span>{opcija || "Bez druge želje"}</span>
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default WorkshopPicker;
