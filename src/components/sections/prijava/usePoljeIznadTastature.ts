import { useEffect, type RefObject } from "react";

/*
 * Kad se na telefonu otvori tastatura, fokusirano polje (textarea, input) se
 * podigne iznad nje. Browseri to rade sami samo delimično: na Androidu
 * tastatura obično prekriva stranicu (layout se ne smanjuje), pa polje pri dnu
 * forme ostaje ispod tastature.
 *
 * Visina tastature se upisuje u --prijava-tastatura na sekciji, da bi forma
 * dobila prostor ispod sebe i mogla da se skroluje dovoljno visoko.
 */

const RAZMAK = 16;

const jePoljeZaKucanje = (element: Element | null): element is HTMLElement =>
  element instanceof HTMLTextAreaElement ||
  (element instanceof HTMLInputElement &&
    !["checkbox", "radio", "button", "submit", "range", "hidden"].includes(
      element.type,
    ));

const skrolujeSe = (element: HTMLElement) => {
  const { overflowY } = getComputedStyle(element);

  return (
    (overflowY === "auto" || overflowY === "scroll") &&
    element.scrollHeight > element.clientHeight
  );
};

export const usePoljeIznadTastature = (
  sekcijaRef: RefObject<HTMLElement | null>,
) => {
  useEffect(() => {
    const sekcija = sekcijaRef.current;
    const viewport = window.visualViewport;

    if (!sekcija || !viewport) return;

    let frame = 0;
    let timeout = 0;

    const podigni = () => {
      const polje = document.activeElement;
      const tastatura = Math.max(
        0,
        Math.round(window.innerHeight - viewport.height - viewport.offsetTop),
      );

      sekcija.style.setProperty("--prijava-tastatura", `${tastatura}px`);

      if (!jePoljeZaKucanje(polje) || !sekcija.contains(polje)) return;

      const vrh = viewport.offsetTop + RAZMAK;
      const dno = viewport.offsetTop + viewport.height - RAZMAK;
      const pomeraj = () => {
        const okvir = polje.getBoundingClientRect();

        // Previsoko polje: poravnaj vrh, da se vidi gde se kuca.
        if (okvir.height > dno - vrh || okvir.top < vrh) return okvir.top - vrh;
        if (okvir.bottom > dno) return okvir.bottom - dno;
        return 0;
      };

      // Prvo unutrašnji skrol forme (telefon), pa ostatak stranica.
      const prvi = pomeraj();
      if (prvi !== 0 && skrolujeSe(sekcija)) sekcija.scrollTop += prvi;

      const ostatak = pomeraj();
      if (ostatak !== 0) window.scrollBy(0, ostatak);
    };

    const zakazi = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(podigni);
    };

    const naFokus = (event: FocusEvent) => {
      if (!jePoljeZaKucanje(event.target as Element)) return;

      zakazi();
      // Tastatura se otvara animirano; proveri još jednom kad se smiri.
      window.clearTimeout(timeout);
      timeout = window.setTimeout(zakazi, 350);
    };

    sekcija.addEventListener("focusin", naFokus);
    viewport.addEventListener("resize", zakazi);

    return () => {
      sekcija.removeEventListener("focusin", naFokus);
      viewport.removeEventListener("resize", zakazi);
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [sekcijaRef]);
};
