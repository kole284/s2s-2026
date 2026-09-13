import Naslovna from "./sections/naslovna/Naslovna";
import OProjektu from "./sections/o-projektu/OProjektu";
import Radionice from "./sections/radionice/Radionice";
import Panel from "./sections/panel/Panel";
import Agenda from "./sections/agenda/Agenda";
import Pitanja from "./sections/pitanja/Pitanja";
import Partneri from "./sections/partneri/Partneri";
import Tim from "./sections/tim/Tim";
import Prijava from "./sections/prijava/Prijava";
import Navbar from "./shared/navbar/Navbar";
const Test = () => {
  return (
    <>
      <Navbar />
      <Naslovna />
      <OProjektu />
      <Radionice />
      <Panel />
      <Agenda />
      <Pitanja />
      <Partneri />
      <Tim />
      <Prijava />
    </>
  );
};

export default Test;
