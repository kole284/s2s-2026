import { useEffect, type RefObject } from "react";

/*
 * Tema panela stoji na gornjoj ivici plave trake (.panel-stage-band), pod
 * istim uglom. Traka ide do desne ivice ekrana a visina joj je stalna, pa
 * je na širim ekranima položenija; ugao i visinu ivice zato merimo ovde.
 * (CSS atan2/tan sa ovim jedinicama ne radi u svim browserima, pa je tema
 * u njima gubila položaj.)
 *
 * Gornja ivica trake ide od 41% visine trake (levo) do 0 (desno), kao u
 * clip-path-u trake u Panel.scss.
 */

const USPON_IVICE = 0.41;
// Razmak između donje ivice teme i trake, u delu širine canvasa.
const RAZMAK = 0.006;

export const usePanelTemaNaTraci = (
  canvasRef: RefObject<HTMLElement | null>,
  trakaRef: RefObject<HTMLElement | null>,
  temaRef: RefObject<HTMLElement | null>,
) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    const traka = trakaRef.current;
    const tema = temaRef.current;

    if (!canvas || !traka || !tema) return;

    let frame = 0;

    const postavi = () => {
      // Na telefonu traka nije prikazana; tamo temu postavlja CSS.
      if (!traka.offsetWidth) {
        tema.style.removeProperty("--panel-tema-ugao");
        tema.style.removeProperty("--panel-tema-top");
        return;
      }

      const uspon = traka.offsetHeight * USPON_IVICE;
      const ugao = Math.atan2(uspon, traka.offsetWidth);
      const x = tema.offsetLeft;
      const ivica =
        traka.offsetTop +
        uspon * (1 - (x - traka.offsetLeft) / traka.offsetWidth);
      const top = ivica - canvas.offsetWidth * RAZMAK - tema.offsetHeight;

      tema.style.setProperty("--panel-tema-ugao", `${(-ugao * 180) / Math.PI}deg`);
      tema.style.setProperty("--panel-tema-top", `${top}px`);
    };

    const zakazi = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(postavi);
    };

    postavi();

    const observer = new ResizeObserver(zakazi);
    observer.observe(canvas);
    observer.observe(tema);
    // Širina trake zavisi i od širine prozora (vw), ne samo od canvasa.
    window.addEventListener("resize", zakazi);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", zakazi);
    };
  }, [canvasRef, trakaRef, temaRef]);
};
