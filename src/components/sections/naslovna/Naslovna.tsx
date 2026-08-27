import './Naslovna.scss';

import ctaDesktop from '@/assets/naslovna/naslovna-cta-desktop.svg';
import headlineDesktop from '@/assets/naslovna/naslovna-headline-desktop.svg';
import lightningBottomDesktop from '@/assets/naslovna/naslovna-lightning-bottom-desktop.svg';
import lightningCenterDesktop from '@/assets/naslovna/naslovna-lightning-center-desktop.svg';
import lightningLogoDesktop from '@/assets/naslovna/naslovna-lightning-logo-desktop.svg';
import lightningRightDesktop from '@/assets/naslovna/naslovna-lightning-right-desktop.svg';
import lightningTopDesktop from '@/assets/naslovna/naslovna-lightning-top-desktop.svg';
import lightningUpperDesktop from '@/assets/naslovna/naslovna-lightning-upper-desktop.svg';
import logo from '@/assets/naslovna/naslovna-logo.png';
import logoOutlineMobile from '@/assets/naslovna/naslovna-logo-outline-mobile.svg';
import mobileArt from '@/assets/naslovna/naslovna-mobile-art.svg';
import sideBandDesktop from '@/assets/naslovna/naslovna-side-band-desktop.svg';

const scrollToPrijava = () => {
  document.getElementById('prijava')?.scrollIntoView({
    behavior: 'smooth',
  });
};

const Naslovna = () => {
  return (
    <section className="naslovna-section">
      <div className="naslovna-stage">
        <img
          className="naslovna-mobile-art"
          src={mobileArt}
          alt="Where learning begins"
          draggable={false}
        />

        <img
          className="naslovna-side-band-desktop"
          src={sideBandDesktop}
          alt=""
          draggable={false}
        />

        <div className="naslovna-mobile-band" aria-hidden="true">
          S2S2S2S2S2S2S2S
        </div>

        <div className="naslovna-desktop-lightning-cluster">
          <img
            className="naslovna-lightning naslovna-lightning-top-desktop"
            src={lightningTopDesktop}
            alt=""
            draggable={false}
          />
          <img
            className="naslovna-lightning naslovna-lightning-upper-desktop"
            src={lightningUpperDesktop}
            alt=""
            draggable={false}
          />
          <div className="naslovna-desktop-logo-group">
            <img
              className="naslovna-lightning naslovna-lightning-logo-desktop"
              src={lightningLogoDesktop}
              alt=""
              draggable={false}
            />
            <img
              className="naslovna-logo naslovna-logo-desktop"
              src={logo}
              alt="S2S"
              draggable={false}
            />
          </div>
        </div>
        <img
          className="naslovna-lightning naslovna-lightning-center-desktop"
          src={lightningCenterDesktop}
          alt=""
          draggable={false}
        />
        <img
          className="naslovna-lightning naslovna-lightning-right-desktop"
          src={lightningRightDesktop}
          alt=""
          draggable={false}
        />
        <img
          className="naslovna-lightning naslovna-lightning-bottom-desktop"
          src={lightningBottomDesktop}
          alt=""
          draggable={false}
        />
        <picture className="naslovna-headline-art">
          <img src={headlineDesktop} alt="Where learning begins" draggable={false} />
        </picture>

        <div className="naslovna-mobile-logo-group">
          <img
            className="naslovna-mobile-logo-outline"
            src={logoOutlineMobile}
            alt=""
            draggable={false}
          />
          <img
            className="naslovna-mobile-logo"
            src={logo}
            alt="S2S"
            draggable={false}
          />
        </div>

        <button className="naslovna-cta" onClick={scrollToPrijava} type='button'>
          <picture className="naslovna-cta-art" aria-hidden="true">
            <img src={ctaDesktop} alt="" draggable={false} />
          </picture>
          <span>Prijavi se</span>
        </button>

        <p className="naslovna-date">
          <strong>17.</strong> <span>&amp;</span> <strong>18.</strong>{' '}
          <span>okt</span>
        </p>
      </div>
    </section>
  );
};

export default Naslovna;
