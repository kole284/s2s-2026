import { useEffect, useState } from "react";

// Prati da li media query trenutno važi (npr. desktop breakpoint iz
// _mediaqueries.scss) i osvežava se kad se prozor pomeri preko granice.
export const useMediaQuery = (query: string) => {
  const [odgovara, setOdgovara] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const promeni = (event: MediaQueryListEvent) => setOdgovara(event.matches);

    mql.addEventListener("change", promeni);

    return () => mql.removeEventListener("change", promeni);
  }, [query]);

  return odgovara;
};
