import { useCallback, useEffect, useRef } from "react";
import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
} from "react";

import calendarIllustration from "@/assets/partneri/kalendar.svg";
import cameraIllustration from "@/assets/partneri/kamera.svg";
import canIllustration from "@/assets/partneri/konzerva.svg";
import crownIllustration from "@/assets/partneri/kruna.svg";
import handshakeIllustration from "@/assets/partneri/komunizam.svg";
import wonderLogo from "@/assets/partneri/pokrovitelj/wonder-wordmark-gradient.webp";

import { ROBNI_PARTNERS } from "./partners";
import type { Partner } from "./partners";

import "./Partneri.scss";

type HexagonProps = {
  filled?: boolean;
  className?: string;
  logoSrc?: string;
  logoAlt?: string;
  logoCrop?: string;
  logoScale?: number;
};

type MarqueeDirection = "left" | "right";

type HexagonMarqueeProps = {
  filled?: boolean;
  direction: MarqueeDirection;
  logos?: Partner[];
};

const DESKTOP_HEXAGON_COUNT = 3;
// Keep each repeated group wider than a desktop viewport so the seamless
// loop never reveals an empty edge.
const MARQUEE_HEXAGON_COUNT = 14;
const MARQUEE_GROUP_COUNT = 3;
const MARQUEE_SPEED_PX_PER_SECOND = 24;
const AUTOPLAY_RESUME_DELAY_MS = 450;
const MAX_FRAME_DELTA_SECONDS = 0.1;

const Hexagon = ({
  filled = true,
  className = "",
  logoSrc,
  logoAlt,
  logoCrop,
  logoScale,
}: HexagonProps) => {
  const isSponsor = className.includes("hexagon--sponsor");
  const isLogoSlot = Boolean(logoSrc);
  const classes = [
    "hexagon",
    filled ? "hexagon-filled" : "hexagon-outline",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} aria-hidden={isLogoSlot ? undefined : "true"}>
      <svg
        className="hexagon-svg"
        viewBox={isSponsor ? "0 0 200 173.2050807569" : "0 0 100 115.47"}
        preserveAspectRatio={isSponsor ? "xMidYMid meet" : "none"}
        focusable="false"
      >
        <polygon
          className="hexagon-svg-polygon"
          points={
            isSponsor
              ? "50,0 150,0 200,86.6025403784 150,173.2050807569 50,173.2050807569 0,86.6025403784"
              : "50,0 100,28.867 100,86.603 50,115.47 0,86.603 0,28.867"
          }
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {!filled && <span className="hexagon-inner" />}

      {logoSrc && (
        <img
          src={logoSrc}
          alt={logoAlt ?? ""}
          className="hexagon-logo"
          style={
            logoCrop || logoScale
              ? ({
                  "--logo-crop": logoCrop,
                  "--logo-scale": logoScale,
                } as CSSProperties)
              : undefined
          }
          loading="lazy"
          decoding="async"
        />
      )}
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
  logos,
}: HexagonMarqueeProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const groupWidthRef = useRef(0);
  const offsetRef = useRef(0);
  const previousFrameTimeRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const activePointerIdRef = useRef<number | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const resumeAutoplayAtRef = useRef(0);

  const getNormalizedOffset = useCallback(() => {
    const groupWidth = groupWidthRef.current;

    if (groupWidth <= 0) return 0;

    return ((offsetRef.current % groupWidth) + groupWidth) % groupWidth;
  }, []);

  const applyTrackTransform = useCallback(() => {
    if (!trackRef.current) return;

    const renderOffset = groupWidthRef.current + getNormalizedOffset();

    trackRef.current.style.transform = `translate3d(${-renderOffset}px, 0, 0)`;
  }, [getNormalizedOffset]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const group = groupRef.current;

    if (!viewport || !track || !group) return;

    const reducedMotionMedia = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let isInViewport = false;

    const measureGroup = () => {
      const previousGroupWidth = groupWidthRef.current;
      const nextGroupWidth = group.getBoundingClientRect().width;

      if (nextGroupWidth <= 0) return;

      if (previousGroupWidth > 0) {
        const normalizedOffset =
          ((offsetRef.current % previousGroupWidth) + previousGroupWidth) %
          previousGroupWidth;

        offsetRef.current =
          (normalizedOffset / previousGroupWidth) * nextGroupWidth;
      } else {
        const hexagons = group.querySelectorAll<HTMLElement>(".hexagon");
        const itemPitch = hexagons[1].offsetLeft - hexagons[0].offsetLeft;
        const gap = itemPitch - hexagons[0].offsetWidth;

        offsetRef.current = nextGroupWidth - gap / 2;
      }

      groupWidthRef.current = nextGroupWidth;
      applyTrackTransform();
    };

    const stopAnimation = () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      previousFrameTimeRef.current = null;
    };

    const animate = (time: number) => {
      const previousTime = previousFrameTimeRef.current;
      const deltaSeconds =
        previousTime === null
          ? 0
          : Math.min(
              (time - previousTime) / 1000,
              MAX_FRAME_DELTA_SECONDS,
            );

      previousFrameTimeRef.current = time;

      if (!draggingRef.current && time >= resumeAutoplayAtRef.current) {
        const directionMultiplier = direction === "left" ? 1 : -1;

        offsetRef.current +=
          directionMultiplier * MARQUEE_SPEED_PX_PER_SECOND * deltaSeconds;
        applyTrackTransform();
      }

      if (isInViewport) {
        animationFrameRef.current = window.requestAnimationFrame(animate);
      }
    };

    const updateAnimationState = () => {
      stopAnimation();
      measureGroup();

      if (!reducedMotionMedia.matches && isInViewport) {
        animationFrameRef.current = window.requestAnimationFrame(animate);
      }
    };

    const resizeObserver = new ResizeObserver(measureGroup);
    resizeObserver.observe(viewport);
    resizeObserver.observe(group);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isInViewport = entry.isIntersecting;
      updateAnimationState();
    });
    intersectionObserver.observe(viewport);

    reducedMotionMedia.addEventListener("change", updateAnimationState);
    updateAnimationState();

    return () => {
      stopAnimation();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      reducedMotionMedia.removeEventListener("change", updateAnimationState);
    };
  }, [applyTrackTransform, direction]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    draggingRef.current = true;
    activePointerIdRef.current = event.pointerId;
    dragStartXRef.current = event.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    resumeAutoplayAtRef.current = Number.POSITIVE_INFINITY;
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      !draggingRef.current ||
      activePointerIdRef.current !== event.pointerId
    ) {
      return;
    }

    const dragDistance = event.clientX - dragStartXRef.current;

    offsetRef.current = dragStartOffsetRef.current - dragDistance;
    applyTrackTransform();
  };

  const finishPointerDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== event.pointerId) return;

    draggingRef.current = false;
    activePointerIdRef.current = null;
    resumeAutoplayAtRef.current =
      performance.now() + AUTOPLAY_RESUME_DELAY_MS;
    previousFrameTimeRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      ref={viewportRef}
      className={`hexagon-marquee hexagon-marquee--${direction}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPointerDrag}
      onPointerCancel={finishPointerDrag}
      aria-hidden="true"
    >
      <div ref={trackRef} className="hexagon-marquee-track">
        {Array.from({ length: MARQUEE_GROUP_COUNT }, (_, groupIndex) => (
          <div
            ref={groupIndex === 0 ? groupRef : undefined}
            className="hexagon-marquee-group"
            key={groupIndex}
          >
            {logos
              ? logos.map((partner) => (
                  <Hexagon
                    key={`${groupIndex}-${partner.name}`}
                    logoSrc={partner.src}
                    logoAlt={partner.name}
                    logoCrop={partner.crop}
                    logoScale={partner.scale}
                  />
                ))
              : Array.from({ length: MARQUEE_HEXAGON_COUNT }, (_, index) => (
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
  illustration: string;
  illustrationClassName: string;
  logos?: Partner[];
};

const PartnerRow = ({
  className,
  title,
  filled = true,
  direction,
  illustration,
  illustrationClassName,
  logos,
}: PartnerRowProps) => (
  <section className={`partner-section ${className}`}>
    <div className="section-content">
      <HexagonRow filled={filled} side="left" />
      <h2>{title}</h2>
      <HexagonRow filled={filled} side="right" />
      <HexagonMarquee filled={filled} direction={direction} logos={logos} />
    </div>

    <img
      src={illustration}
      className={`illustration ${illustrationClassName}`}
      alt=""
      aria-hidden="true"
      draggable="false"
      loading="lazy"
      decoding="async"
    />
  </section>
);

const Partneri = () => (
  <section
    className="partneri-page"
    id="partneri"
    aria-labelledby="partneri-title"
  >
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
          <Hexagon
            className="hexagon--sponsor"
            logoSrc={wonderLogo}
            logoAlt="Wonder"
            logoScale={0.92}
          />

          <img
            src={crownIllustration}
            className="illustration illustration-project"
            alt=""
            aria-hidden="true"
            draggable="false"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>

    <PartnerRow
      className="annual-section"
      title="GODIŠNJI"
      direction="left"
      illustration={calendarIllustration}
      illustrationClassName="illustration-calendar"
    />

    <PartnerRow
      className="financial-section"
      title="FINANSIJSKI"
      filled={false}
      direction="right"
      illustration={handshakeIllustration}
      illustrationClassName="illustration-handshake"
    />

    <PartnerRow
      className="goods-section"
      title="ROBNI"
      direction="left"
      illustration={canIllustration}
      illustrationClassName="illustration-can"
      logos={ROBNI_PARTNERS}
    />

    <PartnerRow
      className="media-section"
      title="MEDIJSKI"
      filled={false}
      direction="right"
      illustration={cameraIllustration}
      illustrationClassName="illustration-camera"
    />
  </section>
);

export default Partneri;
