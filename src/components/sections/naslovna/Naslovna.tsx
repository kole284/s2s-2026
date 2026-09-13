import "./Naslovna.scss";
import { useNavigate } from "react-router-dom";

import crackLogoCta from "@/assets/naslovna/desktop/crack-logo-cta.svg";
import crackLowerRight from "@/assets/naslovna/desktop/crack-lower-right.svg";
import crackTop from "@/assets/naslovna/desktop/crack-top.svg";
import crackUpperRight from "@/assets/naslovna/desktop/crack-upper-right.svg";
import logoBackdrop from "@/assets/naslovna/desktop/logo-backdrop.svg";
import crackCtaSide from "@/assets/naslovna/mobile/crack-cta-side.svg";
import logoOutline from "@/assets/naslovna/mobile/logo-outline.svg";
import ctaPaper from "@/assets/naslovna/shared/cta-paper.svg";
import dateZigzag from "@/assets/naslovna/shared/date-zigzag.svg";
import date from "@/assets/naslovna/shared/date.svg";
import headline from "@/assets/naslovna/shared/headline.svg";
import s2sLogo from "@/assets/naslovna/shared/s2s-logo.svg";

const S2S_GLYPHS = Array.from({ length: 8 }, (_, index) =>
  index % 2 === 0 ? "S" : "2",
);

const MOBILE_S2S_SEQUENCE = "S2".repeat(10);

const Naslovna = () => {
  const navigate = useNavigate();

  return (
    <section className="naslovna" aria-labelledby="naslovna-title">
      <div className="naslovna__mobile-top-logo" aria-hidden="true">
        <img
          className="naslovna__mobile-logo-outline"
          src={logoOutline}
          alt=""
          draggable={false}
        />

        <img
          className="naslovna__mobile-logo"
          src={s2sLogo}
          alt=""
          draggable={false}
        />
      </div>

      <div
        className="naslovna__mobile-fullbleed-decoration"
        aria-hidden="true"
      >
        <div className="naslovna__mobile-s2s-marquee">
          <div className="naslovna__mobile-s2s-track">
            <span className="naslovna__mobile-s2s-sequence">
              {MOBILE_S2S_SEQUENCE}
            </span>

            <span
              className="naslovna__mobile-s2s-sequence"
              aria-hidden="true"
            >
              {MOBILE_S2S_SEQUENCE}
            </span>
          </div>
        </div>

        <div className="naslovna__mobile-band" />
      </div>

      <div className="naslovna__canvas">
        {/* DESKTOP LEFT DECORATION */}
        <div className="naslovna__left-decoration" aria-hidden="true">
          <div className="naslovna__s2s-marquee">
            <div className="naslovna__s2s-path">
              <div className="naslovna__s2s-track">
                {[0, 1].map((cycleIndex) => (
                  <div className="naslovna__s2s-cycle" key={cycleIndex}>
                    {S2S_GLYPHS.map((glyph, glyphIndex) => (
                      <span
                        className="naslovna__s2s-item"
                        key={`${cycleIndex}-${glyphIndex}`}
                      >
                        <span className="naslovna__s2s-glyph">{glyph}</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="naslovna__left-band" />
        </div>

        {/* MOBILE DECORATION */}
        <div className="naslovna__mobile-decoration" aria-hidden="true">
          <img
            className="
              naslovna__mobile-cta-crack
              naslovna__mobile-cta-crack--left
            "
            src={crackCtaSide}
            alt=""
            draggable={false}
          />

          <img
            className="
              naslovna__mobile-cta-crack
              naslovna__mobile-cta-crack--right
            "
            src={crackCtaSide}
            alt=""
            draggable={false}
          />
        </div>

        {/* DESKTOP RIGHT DECORATION */}
        <div className="naslovna__right-decoration" aria-hidden="true">
          <img
            className="naslovna__crack-upper-right"
            src={crackUpperRight}
            alt=""
            draggable={false}
          />

          <img
            className="naslovna__crack-lower-right"
            src={crackLowerRight}
            alt=""
            draggable={false}
          />
        </div>

        {/* SEMANTIC TITLE */}
        <h1 className="naslovna__title" id="naslovna-title">
          Where Learning Begins
        </h1>

        {/* HEADLINE */}
        <img
          className="naslovna__headline"
          src={headline}
          alt=""
          aria-hidden="true"
          draggable={false}
        />

        {/* DESKTOP LOGO COMPOSITION */}
        <div className="naslovna__logo-composition" aria-hidden="true">
          <img
            className="naslovna__crack-top-start"
            src={crackTop}
            alt=""
            draggable={false}
          />

          <img
            className="naslovna__logo-cta-crack"
            src={crackLogoCta}
            alt=""
            draggable={false}
          />

          <img
            className="naslovna__logo-backdrop"
            src={logoBackdrop}
            alt=""
            draggable={false}
          />

          <img
            className="naslovna__large-logo"
            src={s2sLogo}
            alt=""
            draggable={false}
          />
        </div>

        {/* CTA */}
        <button
          className="naslovna__cta"
          onClick={() => navigate("/prijava")}
          type="button"
        >
          <img
            className="naslovna__cta-paper"
            src={ctaPaper}
            alt=""
            aria-hidden="true"
            draggable={false}
          />

          <span>PRIJAVI SE</span>
        </button>

        {/* DATE */}
        <div className="naslovna__date-composition">
          <span className="naslovna__date-text">17. &amp; 18. OKT</span>

          <img
            className="naslovna__date"
            src={date}
            alt=""
            aria-hidden="true"
            draggable={false}
          />

          <img
            className="naslovna__date-zigzag"
            src={dateZigzag}
            alt=""
            aria-hidden="true"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
};

export default Naslovna;
