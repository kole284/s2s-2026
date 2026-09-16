import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '@/components/shared/navbar/Navbar';

const Layout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === '/prijava') {
      window.scrollTo({ top: 0 });
    }
  }, [pathname]);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default Layout;
