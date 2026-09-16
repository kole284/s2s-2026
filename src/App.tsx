import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from '@/components/-layout/Layout';
import Prijava from '@/components/sections/prijava/Prijava';
import Main from '@/pages/main/Main';
import Test from '@/components/Test';
import { SECTION_ROUTES } from '@/routes/sectionRoutes';
import './App.scss';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          {SECTION_ROUTES.filter(({ path }) => path !== '/prijava').map(
            ({ path }) => (
              <Route key={path} path={path} element={<Main />} />
            ),
          )}
          <Route path="/prijava" element={<Prijava />} />
          <Route path="/test" element={<Test />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
