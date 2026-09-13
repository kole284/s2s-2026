import Naslovna from "./sections/naslovna/Naslovna";
import OProjektu from "./sections/o-projektu/OProjektu";
import Panel from "./sections/panel/Panel";
import Agenda from "./sections/agenda/Agenda";
import Pitanja from "./sections/pitanja/Pitanja";
import Partneri from "./sections/partneri/Partneri";
import Navbar from "./shared/navbar/Navbar";
const Test = () => {
  return (
    <>
      <Navbar />
      <Naslovna />
      <OProjektu />
      <Panel />
      <Agenda />
      <Pitanja />
      <Partneri />
    </>
  );
};

export default Test;
