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