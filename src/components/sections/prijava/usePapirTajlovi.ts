import { useEffect, useState, useRef, type RefObject } from 'react';

const MIN_TAJLOVA = 10;
const EXTRA_TAJLOVA = 1;

export function usePapirTajlovi(
  spoljniRef: RefObject<HTMLElement | null>,
  sadrzajRef: RefObject<HTMLElement | null>,
  tajlSrc: string,
): { visinaTajla: number } {
  const [visinaTajla, setVisinaTajla] = useState(0);
  const prirodneDimenzijeRef = useRef<{ sirina: number; visina: number } | null>(null);

  // 1. Učitavanje slike i čuvanje prirodnih dimenzija + inicijalni proračun
  useEffect(() => {
    const spoljni = spoljniRef.current;
    if (!spoljni) return;

    const img = new Image();
    img.src = tajlSrc;
    img.onload = () => {
      prirodneDimenzijeRef.current = { sirina: img.naturalWidth, visina: img.naturalHeight };
      setVisinaTajla((img.naturalHeight / img.naturalWidth) * spoljni.offsetWidth);
    };
  }, [spoljniRef, tajlSrc]);

  // 2. Reagovanje na promenu širine spoljnog kontejnera (window resize / responsive)
  useEffect(() => {
    const spoljni = spoljniRef.current;
    if (!spoljni) return;

    const posmatracSirine = new ResizeObserver(() => {
      const dim = prirodneDimenzijeRef.current;
      if (!dim || dim.sirina === 0) return;
      setVisinaTajla((dim.visina / dim.sirina) * spoljni.offsetWidth);
    });

    posmatracSirine.observe(spoljni);
    return () => posmatracSirine.disconnect();
  }, [spoljniRef]);

  // 3. Proračun minimalne visine na osnovu visine unutrašnjeg sadržaja
  useEffect(() => {
    const spoljni = spoljniRef.current;
    const sadrzaj = sadrzajRef.current;
    if (!spoljni || !sadrzaj || visinaTajla === 0) return;

    const izracunaj = () => {
      const potrebnaVisina = sadrzaj.offsetHeight;
      const potrebno =
        Math.max(MIN_TAJLOVA, Math.ceil(potrebnaVisina / visinaTajla)) +
        EXTRA_TAJLOVA;

      spoljni.style.minHeight = `${potrebno * visinaTajla}px`;
    };

    izracunaj();
    const posmatrac = new ResizeObserver(izracunaj);
    posmatrac.observe(sadrzaj);
    return () => posmatrac.disconnect();
  }, [spoljniRef, sadrzajRef, visinaTajla]);

  return { visinaTajla };
}