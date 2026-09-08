import type { CSSProperties } from "react";

import calendarIllustration from "@/assets/partneri/kalendar.svg";
import cameraIllustration from "@/assets/partneri/kamera.svg";
import canIllustration from "@/assets/partneri/konzerva.svg";
import crownIllustration from "@/assets/partneri/kruna.svg";
import handshakeIllustration from "@/assets/partneri/komunizam.svg";

import "./Partneri.scss";

type HexagonProps = {
  filled?: boolean;
  className?: string;
};

type MarqueeDirection = "left" | "right";

type HexagonMarqueeProps = {
  filled?: boolean;
  direction: MarqueeDirection;
  duration: number;
};

const DESKTOP_HEXAGON_COUNT = 3;
const MARQUEE_HEXAGON_COUNT = 6;

const Hexagon = ({ filled = true, className = "" }: HexagonProps) => {
  const isSponsor = className.includes("hexagon--sponsor");
  const classes = [
    "hexagon",
    filled ? "hexagon-filled" : "hexagon-outline",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} aria-hidden="true">
      <svg
        className="hexagon-svg"
        viewBox={isSponsor ? "0 0 115.47 100" : "0 0 100 115.47"}
        preserveAspectRatio="none"
        focusable="false"
      >
        <polygon
          className="hexagon-svg-polygon"
          points={
            isSponsor
              ? "28.867,0 86.603,0 115.47,50 86.603,100 28.867,100 0,50"
              : "50,0 100,28.867 100,86.603 50,115.47 0,86.603 0,28.867"
          }
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {!filled && <span className="hexagon-inner" />}
    </span>
  );
};

const HexagonRow = ({
  filled = true,
  side,
}: Pick<HexagonProps, "filled"> & { side: "left" | "right" }) => (
  <div className={`hexagon-row hexagon-row--${side}`} aria-hidden="true">
    {Array.from({ length: DESKTOP_HEXAGON_COUNT }, (_, index) => (
      <Hexagon filled={filled} key={index} />
    ))}
  </div>
);

const HexagonMarquee = ({
  filled = true,
  direction,
  duration,
}: HexagonMarqueeProps) => {
  const marqueeStyle = {
    "--marquee-duration": `${duration}s`,
  } as CSSProperties;

  return (
    <div
      className={`hexagon-marquee hexagon-marquee--${direction}`}
      style={marqueeStyle}
      aria-hidden="true"
    >
      <div className="hexagon-marquee-track">
        {[0, 1].map((groupIndex) => (
          <div className="hexagon-marquee-group" key={groupIndex}>
            {Array.from({ length: MARQUEE_HEXAGON_COUNT }, (_, index) => (
              <Hexagon filled={filled} key={`${groupIndex}-${index}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

type PartnerRowProps = {
  className: string;
  title: string;
  filled?: boolean;
  direction: MarqueeDirection;
  duration: number;
  illustration: string;
  illustrationClassName: string;
};

const PartnerRow = ({
  className,
  title,
  filled = true,
  direction,
  duration,
  illustration,
  illustrationClassName,
}: PartnerRowProps) => (
  <section className={`partner-section ${className}`}>
    <div className="section-content">
      <HexagonRow filled={filled} side="left" />
      <h2>{title}</h2>
      <HexagonRow filled={filled} side="right" />
      <HexagonMarquee
        filled={filled}
        direction={direction}
        duration={duration}
      />
    </div>

    <img
      src={illustration}
      className={`illustration ${illustrationClassName}`}
      alt=""
      aria-hidden="true"
      draggable="false"
    />
  </section>
);

const Partneri = () => (
  <section className="partneri-page" aria-labelledby="partneri-title">
    <header className="partneri-header">
      <h1 id="partneri-title">PARTNERI</h1>
    </header>

    <section className="partner-section sponsor-section">
      <div className="section-content sponsor-content">
        <div className="sponsor-label">
          <span>POKROVITELJ</span>
          <span>PROJEKTA</span>
        </div>
        <div className="sponsor-visual">
          <Hexagon className="hexagon--sponsor" />
          <img
            src={crownIllustration}
            className="illustration illustration-project"
            alt=""
            aria-hidden="true"
            draggable="false"
          />
        </div>
      </div>
    </section>

    <PartnerRow
      className="annual-section"
      title="GODIŠNJI"
      direction="left"
      duration={22}
      illustration={calendarIllustration}
      illustrationClassName="illustration-calendar"
    />

    <PartnerRow
      className="financial-section"
      title="FINANSIJSKI"
      filled={false}
      direction="right"
      duration={26}
      illustration={handshakeIllustration}
      illustrationClassName="illustration-handshake"
    />

    <PartnerRow
      className="goods-section"
      title="ROBNI"
      direction="left"
      duration={24}
      illustration={canIllustration}
      illustrationClassName="illustration-can"
    />

    <PartnerRow
      className="media-section"
      title="MEDIJSKI"
      filled={false}
      direction="right"
      duration={28}
      illustration={cameraIllustration}
      illustrationClassName="illustration-camera"
    />
  </section>
);

export default Partneri;
