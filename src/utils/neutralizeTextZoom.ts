/*
 * Android WebView (Instagram, Facebook, Messenger) uvećava sav tekst po
 * sistemskoj veličini fonta na telefonu, a layout ostaje isti, pa tekst
 * izlazi iz oblika. `text-size-adjust: 100%` to u starijim WebView-ovima ne
 * gasi: tamo se vrednost množi faktorom sistema. Zato izmerimo faktor i
 * postavimo `text-size-adjust` na 100% / faktor, što ga tačno poništava.
 *
 * Posle izmene se meri ponovo; ako tekst nije vraćen na normalnu veličinu
 * (drugačiji browser), vraća se na 100%. U običnom browseru je faktor 1 i
 * ništa se ne menja.
 */

const PROBE_SIZE = 100;
const TOLERANCE = 0.02;

const measureTextScale = (): number => {
  const probe = document.createElement("span");

  probe.textContent = "S";
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText = [
    "position: absolute",
    "top: 0",
    "left: -9999px",
    "display: block",
    "visibility: hidden",
    "pointer-events: none",
    `font-size: ${PROBE_SIZE}px`,
    "line-height: 1",
    "white-space: nowrap",
  ].join(";");

  document.body.appendChild(probe);
  const height = probe.getBoundingClientRect().height;
  probe.remove();

  return height > 0 ? height / PROBE_SIZE : 1;
};

export const neutralizeTextZoom = () => {
  const root = document.documentElement.style;

  const scale = measureTextScale();

  if (Math.abs(scale - 1) <= TOLERANCE) {
    return;
  }

  const adjust = `${(100 / scale).toFixed(2)}%`;

  root.setProperty("-webkit-text-size-adjust", adjust);
  root.setProperty("text-size-adjust", adjust);

  if (Math.abs(measureTextScale() - 1) > TOLERANCE) {
    root.removeProperty("-webkit-text-size-adjust");
    root.removeProperty("text-size-adjust");
  }
};
