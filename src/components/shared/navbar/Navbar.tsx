import './Navbar.scss';
import { useCallback, useEffect, useState } from 'react';
import logoS2S from '@/assets/logo-s2s.svg';
import hamburgerIcon from '@/assets/icon-hamburger.svg';

type NavItem = {
  id: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'naslovna', label: 'Naslovna' },
  { id: 'o-projektu', label: 'Projekat' },
  { id: 'radionice', label: 'Radionice' },
  { id: 'panel', label: 'Panel' },
  { id: 'agenda', label: 'Agenda' },
  { id: 'pitanja', label: 'Pitanja' },
  { id: 'partneri', label: 'Partneri' },
  { id: 'tim', label: 'Tim' },
  { id: 'igrica', label: 'Igrica' },
];

const CTA_ITEM: NavItem = { id: 'prijava', label: 'Prijavi se' };

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>(NAV_ITEMS[0].id);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);

  const scrollToSection = useCallback(
    (id: string) => {
      const target = document.getElementById(id);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMenu();
    },
    [closeMenu],
  );

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Napomena: dok sekcije (Naslovna, Agenda, itd.) nisu ubačene u Main.tsx sa
  // odgovarajućim id="..." atributima, ovaj effect jednostavno neće naći
  // elemente i neće raditi ništa — to je očekivano ponašanje, ne greška.
  useEffect(() => {
    const elements = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => el !== null,
    );

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <header className="navbar">
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
        <button
  type="button"
  className={`navbar-logo ${isMenuOpen ? 'navbar-logo--hidden' : ''}`}
  onClick={() => scrollToSection('naslovna')}
  aria-label="Naslovna"
>
  <img src={logoS2S} alt="S2S" className="navbar-logo-img" />
</button>

<button
  type="button"
  className={`navbar-toggle ${isMenuOpen ? 'navbar-toggle--open' : ''}`}
  onClick={toggleMenu}
  aria-expanded={isMenuOpen}
  aria-controls="navbar-menu"
  aria-label={isMenuOpen ? 'Zatvori meni' : 'Otvori meni'}
>
  {isMenuOpen ? (
    <img src={logoS2S} alt="" className="navbar-toggle-logo" />
  ) : (
    <img src={hamburgerIcon} alt="" className="navbar-toggle-icon" />
  )}
</button>

        <nav id="navbar-menu" className={`navbar-menu ${isMenuOpen ? 'navbar-menu--open' : ''}`}>
  <ul className="navbar-links">
            {NAV_ITEMS.map((item) => (
              <li key={item.id} className="navbar-links-item">
                <button
                  type="button"
                  className={`navbar-link ${activeId === item.id ? 'navbar-link--active' : ''}`}
                  onClick={() => scrollToSection(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <button type="button" className="navbar-cta" onClick={() => scrollToSection(CTA_ITEM.id)}>
            {CTA_ITEM.label}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;