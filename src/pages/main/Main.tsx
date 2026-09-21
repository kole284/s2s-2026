import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Home from '@/pages/home/Home';
import { SECTION_ROUTE_BY_PATH } from '@/routes/sectionRoutes';

const Main = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const sectionId = SECTION_ROUTE_BY_PATH.get(pathname);

    if (!sectionId) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [pathname]);

  return <Home />;
};

export default Main;
