import './Footer.scss';
import logoFonisWhite from '@/assets/logo-fonis-white.svg';

type SocialLink = {
  label: string;
  href: string;
};

const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'instagram',
    href: 'https://www.instagram.com/fonis_fon/',
  },
  {
    label: 'facebook',
    href: 'https://www.facebook.com/fonis.rs/',
  },
  {
    label: 'linkedin',
    href: 'https://www.linkedin.com/company/fonis',
  },
  {
    label: 'tiktok',
    href: 'https://www.tiktok.com/@fonis_fon',
  },
];


const Footer = () => {
  return (
      <footer className="footer">
        <span
          className="footer-zigzag"
          aria-hidden="true"
        />

        <div className="footer-inner">

          <div className="footer-address">
            <span className="footer-badge footer-badge--yellow">
              Adresa
            </span>

            <address className="footer-address-lines">
              <span>Fakultet organizacionih nauka</span>
              <span>Jove Ilića 154</span>
              <span>Beograd</span>
            </address>
          </div>

          <div className="footer-logo">
            <img
              src={logoFonisWhite}
              alt="FONIS"
              className="footer-logo-image"
            />
          </div>

          <div className="footer-social">
            <span className="footer-badge footer-badge--white">
              Pratite nas
            </span>

            <ul className="footer-social-list">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    className="footer-social-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </footer>
  );
};

export default Footer;