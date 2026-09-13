import { HashRouter, Route, Routes } from 'react-router-dom';
import Main from '@/pages/main/Main';
import Radionice from '@/components/sections/radionice/Radionice';
import Predavaci from '@/components/sections/predavac/Predavac';
import './App.scss';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Radionice />} />
        <Route path="/predavac/:predavacId" element={<Predavaci />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
