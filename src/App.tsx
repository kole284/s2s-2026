import { HashRouter, Route, Routes } from 'react-router-dom';
import Main from '@/pages/main/Main';
import Test from '@/components/Test';
import { SECTION_ROUTES } from '@/routes/sectionRoutes';
import './App.scss';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        {SECTION_ROUTES.map(({ path }) => (
          <Route key={path} path={path} element={<Main />} />
        ))}
        <Route path="/test" element={<Test />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
