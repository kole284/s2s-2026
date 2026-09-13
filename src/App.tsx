import { HashRouter, Route, Routes } from 'react-router-dom';
import Main from '@/pages/main/Main';
import Test from '@/components/Test';
import Prijava from '@/components/sections/prijava/Prijava';
import './App.scss';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/prijava" element={<Prijava />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
