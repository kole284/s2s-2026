import { HashRouter, Route, Routes } from 'react-router-dom';
import Main from '@/pages/main/Main';
import Radionice from '@/components/sections/radionice/Radionice';
import './App.scss';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Radionice />} />
      </Routes>
    </HashRouter>
  );
};

export default App;