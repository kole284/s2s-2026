/*
 * Neki browseri (izmereno: Firefox 156 na Androidu) prijavljuju 100svh/100dvh
 * mnogo veće od dela ekrana koji se stvarno vidi (1006px umesto ~680px), pa su
 * sekcije visoke "ceo ekran" duže od ekrana i ostaje prazan prostor.
 *
 * CSS koristi --app-svh / --app-dvh / --app-vh (u index.scss su podrazumevano
 * pravi 1svh / 1dvh / 1vh). Samo kad je izmereni svh očigledno veći od vidljive
 * visine (visualViewport), sve tri se postave na stvarnu vidljivu visinu / 100.
 * U ispravnim browserima se ništa ne menja.
 */

const TOLERANCE = 1.15;

const measure = (value: string): number => {
  const probe = document.createElement("div");

  probe.style.cssText = `position:absolute;top:0;left:-9999px;width:1px;height:${value};visibility:hidden;pointer-events:none`;
  document.body.appendChild(probe);
  const height = probe.getBoundingClientRect().height;
  probe.remove();

  return height;
};

const VARIABLES = ["--app-svh", "--app-dvh", "--app-vh"];

const apply = () => {
  const root = document.documentElement.style;
  VARIABLES.forEach((name) => root.removeProperty(name));

  const viewport = window.visualViewport;

  // Samo bez pinch zooma, inače visualViewport nije visina ekrana.
  if (!viewport || Math.abs(viewport.scale - 1) > 0.01) return;

  const visible = Math.min(viewport.height, window.innerHeight);
  const svh = measure("100svh") || measure("100vh");

  if (!visible || svh <= visible * TOLERANCE) return;

  const unit = `${(visible / 100).toFixed(3)}px`;
  VARIABLES.forEach((name) => root.setProperty(name, unit));
};

export const fixViewportHeight = () => {
  apply();

  // Ponovo samo kad se promeni širina (okretanje telefona). Promena visine
  // zbog trake za adresu ili tastature ne sme da pomera sekcije dok se skroluje.
  let width = window.innerWidth;

  window.addEventListener("resize", () => {
    if (window.innerWidth === width) return;

    width = window.innerWidth;
    apply();
  });
};
