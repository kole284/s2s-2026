import Naslovna from "@/components/sections/naslovna/Naslovna";
import OProjektu from "@/components/sections/o-projektu/OProjektu";
import Radionice from "@/components/sections/radionice/Radionice";
import Panel from "@/components/sections/panel/Panel";
import Agenda from "@/components/sections/agenda/Agenda";
import Pitanja from "@/components/sections/pitanja/Pitanja";
import Partneri from "@/components/sections/partneri/Partneri";
import Tim from "@/components/sections/tim/Tim";
import Footer from "@/components/shared/footer/Footer";
const Home = () => {
  return (
    <>
      <Naslovna />
      <OProjektu />
      <Radionice />
      <Panel />
      <Agenda />
      <Pitanja />
      <Partneri />
      <Tim />
      <Footer />
    </>
  );
};

export default Home;
