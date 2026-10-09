import "./BrojacZnakova.scss";

/*
 * Brojač znakova ispod dugih polja forme ("123 / 5000"). Polje ionako ne
 * prima više od limita (maxLength), a backend i baza imaju iste limite;
 * brojač samo pokazuje koliko je mesta ostalo. Pri 90% limita postaje
 * crven. Polje ga vezuje preko aria-describedby (id). Za zaključano polje
 * ostaje nevidljiv, ali zadržava mesto, da raspored ne skače.
 */

const PRAG_UPOZORENJA = 0.9;

type BrojacZnakovaProps = {
  id: string;
  duzina: number;
  limit: number;
  sakriven?: boolean;
};

const BrojacZnakova = ({
  id,
  duzina,
  limit,
  sakriven = false,
}: BrojacZnakovaProps) => {
  const blizuLimita = duzina >= limit * PRAG_UPOZORENJA;

  return (
    <p
      id={id}
      className={`prijava-brojac${blizuLimita ? " prijava-brojac--blizu" : ""}${
        sakriven ? " prijava-brojac--sakriven" : ""
      }`}
      aria-hidden={sakriven || undefined}
    >
      {duzina} / {limit}
    </p>
  );
};

export default BrojacZnakova;
