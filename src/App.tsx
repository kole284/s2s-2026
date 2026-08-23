import { HashRouter, Route, Routes } from 'react-router-dom';
import Main from '@/pages/main/Main';
import Prijava from '@/pages/prijava/Prijava';
import './App.scss';

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
