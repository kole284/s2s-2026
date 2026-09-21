import './Navbar.scss';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import closeIcon from '@/assets/Layer_1.svg';
import hamburgerIcon from '@/assets/Group(2).svg';
import logoS2S from '@/assets/logo-s2s.svg';
import { SECTION_ROUTE_BY_PATH, SECTION_ROUTES } from '@/routes/sectionRoutes';

const NAV_ITEMS = SECTION_ROUTES.filter(({ path }) => path !== '/prijava');
const CTA_ITEM = SECTION_ROUTES.find(({ path }) => path === '/prijava')!;
const PRIJAVA_PATH = '/prijava';
const GAME_SECTION_ID = 'igrica';
const GAME_LABEL = 'Igrica';
const GAME_PATH = '/igrica';
const MENU_SCROLL_LOCK_CLASS = 'navbar-menu-scroll-locked';
const NAVBAR_SCROLL_THRESHOLD = 24;

const CloseIcon = () => (
  <svg viewBox="0 0 74 73" width="74" height="73" fill="none" focusable="false">
    <path
      d="M14 12C27 25 46 48 60 61M59 12C46 26 30 45 13 60"
      stroke="#134595"
      strokeWidth="12"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13 9C28 24 45 47 62 61M62 9C48 24 31 45 12 63"
      stroke="#2062D4"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type NavbarMenuContentProps = {
  activeId: string;
  pathname: string;
  onNavigate: (path: string, sectionId: string) => void;
  onNavigateToGame: () => void;
};

const NavbarMenuContent = ({
  activeId,
  pathname,
  onNavigate,
  onNavigateToGame,
}: NavbarMenuContentProps) => (
  <>
    <ul className="navbar-links">
      {NAV_ITEMS.map((item) => (
        <li key={item.path} className="navbar-links-item">
          <button
            type="button"
            className={`navbar-link ${activeId === item.sectionId ? 'navbar-link--active' : ''}`}
            onClick={() => onNavigate(item.path, item.sectionId)}
            aria-current={pathname === item.path ? 'page' : undefined}
          >
            {item.label}
          </button>
        </li>
      ))}
      <li className="navbar-links-item">
        <button
          type="button"
          className={`navbar-link ${activeId === GAME_SECTION_ID ? 'navbar-link--active' : ''}`}
          onClick={onNavigateToGame}
        >
          {GAME_LABEL}
        </button>
      </li>
    </ul>

    <button
      type="button"
      className={`navbar-cta ${activeId === CTA_ITEM.sectionId ? 'navbar-cta--active' : ''}`}
      onClick={() => onNavigate(CTA_ITEM.path, CTA_ITEM.sectionId)}
      aria-current={pathname === CTA_ITEM.path ? 'page' : undefined}
    >
      {CTA_ITEM.label}
    </button>
  </>
);

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleSection, setVisibleSection] = useState({
    pathname,
    sectionId: SECTION_ROUTE_BY_PATH.get(pathname) ?? NAV_ITEMS[0].sectionId,
  });
  const activeId =
    visibleSection.pathname === pathname
      ? visibleSection.sectionId
      : (SECTION_ROUTE_BY_PATH.get(pathname) ?? NAV_ITEMS[0].sectionId);

  const isPrijavaPage = pathname === PRIJAVA_PATH;

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > NAVBAR_SCROLL_THRESHOLD);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pageshow', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pageshow', handleScroll);
    };
  }, []);

  const navigateToSection = useCallback(
    (path: string, sectionId: string) => {
      if (pathname === path) {
        closeMenu();
        window.requestAnimationFrame(() => {
          document
            .getElementById(sectionId)
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      } else {
        navigate(path);
        closeMenu();
      }
    },
    [closeMenu, navigate, pathname],
  );

  const navigateToGame = useCallback(() => {
    closeMenu();
    navigate(GAME_PATH);
  }, [closeMenu, navigate]);

  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    if (!isMenuOpen) {
      body.classList.remove(MENU_SCROLL_LOCK_CLASS);
      html.classList.remove(MENU_SCROLL_LOCK_CLASS);
      return;
    }

    body.classList.add(MENU_SCROLL_LOCK_CLASS);
    html.classList.add(MENU_SCROLL_LOCK_CLASS);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      body.classList.remove(MENU_SCROLL_LOCK_CLASS);
      html.classList.remove(MENU_SCROLL_LOCK_CLASS);
    };
  }, [closeMenu, isMenuOpen]);

  useEffect(() => {
    if (isPrijavaPage) {
      closeMenu();
    }
  }, [closeMenu, isPrijavaPage]);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1025px)');
    const closeMenuOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        closeMenu();
      }
    };

    desktopQuery.addEventListener('change', closeMenuOnDesktop);
    return () => desktopQuery.removeEventListener('change', closeMenuOnDesktop);
  }, [closeMenu]);

  useEffect(() => {
    const elements = SECTION_ROUTES.map((item) =>
      document.getElementById(item.sectionId),
    ).filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setVisibleSection({ pathname, sectionId: visibleEntry.target.id });
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <>
      <header
        className={`navbar${isScrolled ? ' navbar--scrolled' : ''}${
          isPrijavaPage ? ' navbar--prijava' : ''
        }`}
      >
        <svg
          className="navbar-shape"
          viewBox="0 0 1440 107"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            className="navbar-shape__shadow"
            d="M0 82.3604L135.56 106.33L349.3 80.2502L650.71 106.33L943.16 91.2102L1223.02 100.26L1440 82.3604V32.8604H0V82.3604Z"
          />
          <path
            className="navbar-shape__fill"
            d="M1440 4.36035L1394.32 0C1371.08 3.23 1347.84 6.47 1324.61 9.7C1300.74 8.89 1276.88 8.08 1253.01 7.27C1226.72 9.29 1200.43 11.31 1174.13 13.34C1125.77 10.51 1077.42 7.68 1029.06 4.86C982.9 7.87 911.17 11.42 822.77 10.93C754.97 10.55 722.67 6.88 623.76 4.86C544.48 3.24 465.2 1.62 385.92 0.0100002H65.1601C39.2701 1.63 25.88 2.75035 0 4.36035V70.3604C34.87 74.4404 36.2201 76.12 71.0901 80.19C149.97 75.36 228.84 70.53 307.72 65.7C402.37 71.77 497.02 77.83 591.68 83.9C691.99 80.9 792.29 77.91 892.6 74.91C976.7 77.68 1060.79 80.45 1144.89 83.23C1216.94 80.22 1288.98 77.21 1361.03 74.19C1399.37 72.19 1401.66 72.3604 1440 70.3604V4.36035Z"
          />
        </svg>
        <div className="navbar-inner">
          <div className="navbar-content">
            <button
              type="button"
              className="navbar-logo"
              onClick={() => navigateToSection('/', 'naslovna')}
              aria-label="Naslovna"
            >
              <img src={logoS2S} alt="S2S" className="navbar-logo-img" />
            </button>

            {isPrijavaPage ? (
              <button
                type="button"
                className="mobile-menu-control mobile-menu-control--exit"
                onClick={() => navigateToSection('/', 'naslovna')}
                aria-label="Zatvori prijavu"
              >
                <span
                  className="mobile-menu-control__state mobile-menu-control__close"
                  aria-hidden="true"
                >
                  <img src={closeIcon} alt="" className="navbar-exit-icon" />
                </span>
              </button>
            ) : (
              <button
                type="button"
                className={`mobile-menu-control ${isMenuOpen ? 'is-open' : ''}`}
                onClick={toggleMenu}
                aria-expanded={isMenuOpen}
                aria-controls="navbar-mobile-menu"
                aria-label={isMenuOpen ? 'Zatvori meni' : 'Otvori meni'}
              >
                <span
                  className="mobile-menu-control__state mobile-menu-control__burger"
                  aria-hidden="true"
                >
                  <img src={hamburgerIcon} alt="" />
                </span>
                <span
                  className="mobile-menu-control__state mobile-menu-control__close"
                  aria-hidden="true"
                >
                  <CloseIcon />
                </span>
              </button>
            )}

            <nav id="navbar-menu" className="navbar-menu">
              <NavbarMenuContent
                activeId={activeId}
                pathname={pathname}
                onNavigate={navigateToSection}
                onNavigateToGame={navigateToGame}
              />
            </nav>
          </div>
        </div>

        {isMenuOpen
          ? createPortal(
              <div
                className="navbar-mobile-overlay"
                role="presentation"
                onClick={(event) => {
                  if (event.target === event.currentTarget) {
                    closeMenu();
                  }
                }}
              >
                <nav
                  id="navbar-mobile-menu"
                  className="navbar-mobile-menu"
                  aria-label="Glavna navigacija"
                >
                  <NavbarMenuContent
                    activeId={activeId}
                    pathname={pathname}
                    onNavigate={navigateToSection}
                    onNavigateToGame={navigateToGame}
                  />
                </nav>
              </div>,
              document.body,
            )
          : null}
      </header>
    </>
  );
};

export default Navbar;
