import type { SoftverRadionice as SoftverPodaci } from "@/data/workshopDetails";

type SoftverRadioniceProps = {
  softver: SoftverPodaci;
};

// Sadržaj kartice "Softver": osnovna lista, napomena i (za duže spiskove, npr.
// Cybersecurity) alati po kategorijama kao čipovi.
const SoftverRadionice = ({ softver }: SoftverRadioniceProps) => {
  const { stavke, napomena, grupe } = softver;

  if (!stavke.length && !grupe?.length) {
    return <p>Ova radionica nema specifičnih softverskih zahteva.</p>;
  }

  return (
    <>
      <p>Ukoliko želite da ponesete sopstveni laptop, potreban softver je:</p>

      <ul className="predavac-softver-lista">
        {stavke.map((stavka) => (
          <li key={stavka}>{stavka}</li>
        ))}
      </ul>

      {napomena && <p>{napomena}</p>}

      {grupe?.length ? (
        <>
          <p className="predavac-softver-uvod">
            Alati koji će se potencijalno koristiti:
          </p>

          {grupe.map((grupa) => (
            <section className="predavac-softver-grupa" key={grupa.naslov}>
              <h3 className="predavac-softver-grupa-naslov">{grupa.naslov}</h3>

              <ul className="predavac-softver-cipovi">
                {grupa.alati.map((alat) => (
                  <li className="predavac-softver-cip" key={alat}>
                    {alat}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </>
      ) : null}
    </>
  );
};

export default SoftverRadionice;
