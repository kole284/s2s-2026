import { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from '@/components/-layout/Layout';
import Main from '@/pages/main/Main';
import Test from '@/components/Test';
import { SECTION_ROUTES } from '@/routes/sectionRoutes';
import './App.scss';

const Prijava = lazy(() => import('@/components/sections/prijava/Prijava'));

const Igra = () => (
  <iframe
    title="Igrica"
    src="/igrica/"
    style={{ display: 'block', width: '100%', height: '100dvh', border: 0 }}
  />
);

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/igrica" element={<Igra />} />
        <Route element={<Layout />}>
          {SECTION_ROUTES.filter(({ path }) => path !== '/prijava').map(
            ({ path }) => (
              <Route key={path} path={path} element={<Main />} />
            ),
          )}
          <Route
            path="/prijava"
            element={
              <Suspense fallback={null}>
                <Prijava />
              </Suspense>
            }
          />
          <Route path="/test" element={<Test />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
