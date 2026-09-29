import { useNavigate } from "react-router-dom";

import closeIcon from "@/assets/Layer_1.svg";

import "./PrijavaExit.scss";

// X za povratak na naslovnu. Stoji u sekciji (ne u fiksnom navbaru), pa na
// vrhu prijave ostaje na mestu i odlazi gore zajedno sa formom kad se skroluje.
const PrijavaExit = () => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="prijava-exit"
      onClick={() => navigate("/")}
      aria-label="Zatvori prijavu"
    >
      <img src={closeIcon} alt="" className="prijava-exit__icon" aria-hidden="true" />
    </button>
  );
};

export default PrijavaExit;
