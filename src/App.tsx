import { HashRouter, Route, Routes } from 'react-router-dom';
import Main from '@/pages/main/Main';
import './App.scss';
import Prijava from '@/components/sections/prijava/Prijava';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/prijava" element={<Prijava />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
