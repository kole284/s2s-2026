// usePapirTajlovi.ts
import { useEffect, useState, type RefObject } from 'react';

const MIN_TAJLOVA = 3;

export function usePapirTajlovi(
  spoljniRef: RefObject<HTMLElement | null>,   // .prijava_card__sadrzaj (dobija min-height)
  sadrzajRef: RefObject<HTMLElement | null>,   // unutrašnji wrapper sa pravim sadržajem (samo za merenje)
  tajlSrc: string,
): { brojTajlova: number; visinaTajla: number } {
  const [visinaTajla, setVisinaTajla] = useState(0);
  const [brojTajlova, setBrojTajlova] = useState(MIN_TAJLOVA);

  useEffect(() => {
    const spoljni = spoljniRef.current;
    if (!spoljni) return;

    const img = new Image();
    img.src = tajlSrc;
    img.onload = () => {
      const sirina = spoljni.offsetWidth;
      setVisinaTajla((img.naturalHeight / img.naturalWidth) * sirina);
    };
  }, [spoljniRef, tajlSrc]);

  useEffect(() => {
    const spoljni = spoljniRef.current;
    const sadrzaj = sadrzajRef.current;
    if (!spoljni || !sadrzaj || visinaTajla === 0) return;

    const izracunaj = () => {
      // sadrzaj se meri nezavisno od min-height koji stavljamo na spoljni,
      // pa nema petlje: menjamo spoljni, a posmatramo sadrzaj.
      const stvarnaVisina = sadrzaj.offsetHeight;
      const potrebno = Math.max(MIN_TAJLOVA, Math.ceil(stvarnaVisina / visinaTajla));
      const zaokruzenaVisina = potrebno * visinaTajla;

      spoljni.style.minHeight = `${zaokruzenaVisina}px`;
      setBrojTajlova((prev) => (prev === potrebno ? prev : potrebno));
    };

    izracunaj();
    const posmatrac = new ResizeObserver(izracunaj);
    posmatrac.observe(sadrzaj);
    return () => posmatrac.disconnect();
  }, [spoljniRef, sadrzajRef, visinaTajla]);

  return { brojTajlova, visinaTajla };
}