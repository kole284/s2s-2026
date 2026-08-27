import './Naslovna.scss';

import ctaDesktop from '@/assets/naslovna/naslovna-cta-desktop.svg';
import ctaLightningMobile from '@/assets/naslovna/naslovna-cta-lightning-mobile.svg';
import ctaMobile from '@/assets/naslovna/naslovna-cta-mobile.svg';
import headlineBlob from '@/assets/naslovna/naslovna-headline-blob.svg';
import lightningBottomDesktop from '@/assets/naslovna/naslovna-lightning-bottom-desktop.svg';
import lightningBottomMobile from '@/assets/naslovna/naslovna-lightning-bottom-mobile.svg';
import lightningCenterDesktop from '@/assets/naslovna/naslovna-lightning-center-desktop.svg';
import lightningLogoDesktop from '@/assets/naslovna/naslovna-lightning-logo-desktop.svg';
import lightningRightDesktop from '@/assets/naslovna/naslovna-lightning-right-desktop.svg';
import lightningTopDesktop from '@/assets/naslovna/naslovna-lightning-top-desktop.svg';
import lightningUpperDesktop from '@/assets/naslovna/naslovna-lightning-upper-desktop.svg';
import logo from '@/assets/naslovna/naslovna-logo.png';
import logoOutlineMobile from '@/assets/naslovna/naslovna-logo-outline-mobile.svg';

import NaslovnaDesktopBand from './NaslovnaDesktopBand';
import NaslovnaMobileBand from './NaslovnaMobileBand';
import { useEffect, useState } from 'react';

const scrollToPrijava = () => {
  document.getElementById('prijava')?.scrollIntoView({
    behavior: 'smooth',
  });
};

const BAND_SPEED = 80; // pixels per second

const Naslovna = () => {
  const [animationOffset, setAnimationOffset] = useState(0)
  const [bandRepeatDistance, setBandRepeatDistance] = useState(0);

  useEffect(() => {
    let frameId: number;
    let lastTime: number | null = null;

    const animate = (currentTime: number) => {
      if (lastTime !== null) {
        const delta = (currentTime - lastTime) / 1000;

        setAnimationOffset(
          (previous) => previous + BAND_SPEED * delta
        );
      }

      lastTime = currentTime;

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  const visibleBandOffset =
  bandRepeatDistance > 0
    ? animationOffset % bandRepeatDistance
    : 0;

  return (
    <section className="naslovna-section">
      <div className="naslovna-stage">
        <NaslovnaDesktopBand offset={visibleBandOffset} onRepeatDistanceChange={setBandRepeatDistance}/>
        <NaslovnaMobileBand />

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

        <div className="naslovna-mobile-middle">
          <h1
            className="naslovna-headline-art"
            aria-label="Where learning begins"
          >
            <img
              className="naslovna-headline-blob"
              src={headlineBlob}
              alt=""
              aria-hidden="true"
              draggable={false}
            />
            <span className="naslovna-headline-word naslovna-headline-where">
              Where
            </span>
            <span className="naslovna-headline-word naslovna-headline-learning">
              Learning
            </span>
            <span className="naslovna-headline-word naslovna-headline-begins">
              Begins
            </span>
          </h1>

          <div className="naslovna-mobile-cta-composition">
            <img
              className="naslovna-cta-lightning-mobile"
              src={ctaLightningMobile}
              alt=""
              draggable={false}
            />

            <button
              className="naslovna-cta"
              onClick={scrollToPrijava}
              type="button"
            >
              <picture className="naslovna-cta-art" aria-hidden="true">
                <img src={ctaDesktop} alt="" draggable={false} />
              </picture>
              <img
                className="naslovna-cta-art-mobile"
                src={ctaMobile}
                alt=""
                draggable={false}
              />
              <span>Prijavi se</span>
            </button>
          </div>
        </div>

        <div className="naslovna-mobile-bottom">
          <p className="naslovna-date">
            <strong>17.</strong> <span>&amp;</span> <strong>18.</strong>{' '}
            <span>okt</span>
          </p>
          <img
            className="naslovna-lightning-bottom-mobile"
            src={lightningBottomMobile}
            alt=""
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
};

export default Naslovna;
