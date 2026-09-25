import { useCallback, useEffect, useRef, useState } from "react";
import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";

import calendarIllustration from "@/assets/partneri/kalendar.svg";
import cameraIllustration from "@/assets/partneri/kamera.svg";
import canIllustration from "@/assets/partneri/konzerva.svg";
import crownIllustration from "@/assets/partneri/kruna.svg";
import wonderLogo from "@/assets/partneri/pokrovitelj/wonder-wordmark-gradient.webp";

import PartnerPreview from "./PartnerPreview";
import { isLeavingTowardPreview } from "./partnerPreviewLayout";
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
// Pomeranje manje od ovoga je klik/tap na logo, veće je prevlačenje trake.
const DRAG_THRESHOLD_PX = 6;
const HOVER_MEDIA_QUERY = "(hover: hover) and (pointer: fine)";
// Koliko kartica čeka kad miš sa loga krene ka njoj, da stigne do linka.
const PREVIEW_HIDE_DELAY_MS = 2000;

type PreviewState = { partner: Partner; anchor: DOMRect };

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
  const dragStartYRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const resumeAutoplayAtRef = useRef(0);
  const suppressClickRef = useRef(false);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const canHover = useMediaQuery(HOVER_MEDIA_QUERY);
  const hidePreviewTimerRef = useRef<number | null>(null);

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

  const cancelHidePreview = useCallback(() => {
    if (hidePreviewTimerRef.current !== null) {
      window.clearTimeout(hidePreviewTimerRef.current);
      hidePreviewTimerRef.current = null;
    }
  }, []);

  // Zatvara karticu odmah i pušta traku da nastavi.
  const hidePreview = useCallback(() => {
    cancelHidePreview();

    if (!draggingRef.current) {
      resumeAutoplayAtRef.current =
        performance.now() + AUTOPLAY_RESUME_DELAY_MS;
      previousFrameTimeRef.current = null;
    }

    setPreview(null);
  }, [cancelHidePreview]);

  useEffect(() => cancelHidePreview, [cancelHidePreview]);

  // Kartica se zatvara na scroll (logo se pomera, a kartica je fixed) i kad
  // prozor izgubi fokus (npr. link se otvorio u novom tabu).
  useEffect(() => {
    if (!preview) return;

    const close = () => hidePreview();

    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("blur", close);

    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("blur", close);
    };
  }, [preview, hidePreview]);

  // Pointer se ne hvata odmah, nego tek kad pomeranje pređe prag. Tako obican
  // klik/tap stigne do linka na logou, a prevlačenje i dalje pomera traku.
  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    suppressClickRef.current = false;
    activePointerIdRef.current = event.pointerId;
    dragStartXRef.current = event.clientX;
    dragStartYRef.current = event.clientY;
    dragStartOffsetRef.current = offsetRef.current;
  };

  // Prekida započeti gest (i prevlačenje, ako je počelo) i pušta traku da
  // nastavi. Poziva se i kad pointerup nikad ne stigne, npr. kad klik na logo
  // otvori novi tab pa se dugme pusti u tom tabu.
  const resetPointerGesture = useCallback(() => {
    const pointerId = activePointerIdRef.current;
    const viewport = viewportRef.current;

    activePointerIdRef.current = null;

    if (!draggingRef.current) return;

    draggingRef.current = false;
    resumeAutoplayAtRef.current =
      performance.now() + AUTOPLAY_RESUME_DELAY_MS;
    previousFrameTimeRef.current = null;

    if (
      pointerId !== null &&
      viewport?.hasPointerCapture(pointerId)
    ) {
      viewport.releasePointerCapture(pointerId);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("blur", resetPointerGesture);

    return () => window.removeEventListener("blur", resetPointerGesture);
  }, [resetPointerGesture]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== event.pointerId) return;

    // Miš bez pritisnutog levog dugmeta ne prevlači traku, čak i ako
    // pointerup nije stigao do ove stranice.
    if (event.pointerType === "mouse" && (event.buttons & 1) === 0) {
      resetPointerGesture();
      return;
    }

    const dragDistance = event.clientX - dragStartXRef.current;
    const verticalDistance = event.clientY - dragStartYRef.current;

    // Pokret u bilo kom smeru (i vertikalni skrol stranice prstom) nije tap,
    // pa click koji eventualno usledi ne sme da otvori link.
    if (
      Math.abs(dragDistance) >= DRAG_THRESHOLD_PX ||
      Math.abs(verticalDistance) >= DRAG_THRESHOLD_PX
    ) {
      suppressClickRef.current = true;
    }

    if (!draggingRef.current) {
      if (Math.abs(dragDistance) < DRAG_THRESHOLD_PX) return;

      event.currentTarget.setPointerCapture(event.pointerId);
      draggingRef.current = true;
      suppressClickRef.current = true;
      resumeAutoplayAtRef.current = Number.POSITIVE_INFINITY;
      cancelHidePreview();
      setPreview(null);
    }

    offsetRef.current = dragStartOffsetRef.current - dragDistance;
    applyTrackTransform();
  };

  const finishPointerDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== event.pointerId) return;

    // pointercancel znači da je browser preuzeo pokret (skrol stranice).
    if (event.type === "pointercancel") {
      suppressClickRef.current = true;
    }

    resetPointerGesture();
  };

  // Posle prevlačenja, klik koji browser pošalje ne sme da otvori link.
  const handleClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;

    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  // Dok je miš/fokus na logou ili kartici, traka stoji da kartica ostane uz logo.
  const openPreview = (partner: Partner, element: HTMLElement) => {
    if (draggingRef.current) return;

    cancelHidePreview();
    resumeAutoplayAtRef.current = Number.POSITIVE_INFINITY;

    if (canHover) {
      setPreview({ partner, anchor: element.getBoundingClientRect() });
    }
  };

  // Kartica ostaje samo ako miš sa loga krene ka njoj; inače nestaje odmah.
  const leaveLogo = (clientY: number) => {
    cancelHidePreview();

    if (!preview || !isLeavingTowardPreview(preview.anchor, clientY)) {
      hidePreview();
      return;
    }

    hidePreviewTimerRef.current = window.setTimeout(
      hidePreview,
      PREVIEW_HIDE_DELAY_MS,
    );
  };

  return (
    <div
      ref={viewportRef}
      className={`hexagon-marquee hexagon-marquee--${direction}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPointerDrag}
      onPointerCancel={finishPointerDrag}
      // Samo kad traka izgubi svoje hvatanje. Na dodir browser implicitno hvata
      // prst za dodirnuti link, a taj lostpointercapture ne sme da prekine drag.
      onLostPointerCapture={(event) => {
        if (event.target === event.currentTarget) finishPointerDrag(event);
      }}
      onClickCapture={handleClickCapture}
      // Fokus tastaturom može da skroluje overflow:hidden traku; položaj
      // trake određuje samo transform, pa scroll vraćamo na 0.
      onScroll={(event) => {
        event.currentTarget.scrollLeft = 0;
      }}
      aria-hidden={logos ? undefined : "true"}
    >
      <div ref={trackRef} className="hexagon-marquee-track">
        {Array.from({ length: MARQUEE_GROUP_COUNT }, (_, groupIndex) => (
          <div
            ref={groupIndex === 0 ? groupRef : undefined}
            className="hexagon-marquee-group"
            key={groupIndex}
            // Samo prva grupa je za čitače ekrana i Tab; ostale su kopije za petlju.
            aria-hidden={logos && groupIndex > 0 ? "true" : undefined}
          >
            {logos
              ? logos.map((partner) => {
                  return (
                    <a
                      key={`${groupIndex}-${partner.name}`}
                      className="hexagon-link"
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      draggable={false}
                      tabIndex={groupIndex > 0 ? -1 : undefined}
                      aria-label={`${partner.name} (otvara se u novom tabu)`}
                      onPointerEnter={(event) => {
                        if (event.pointerType === "mouse") {
                          openPreview(partner, event.currentTarget);
                        }
                      }}
                      onPointerLeave={(event) => {
                        if (event.pointerType === "mouse") {
                          leaveLogo(event.clientY);
                        }
                      }}
                      // Samo fokus sa tastature otvara karticu. Fokus posle klika
                      // mišem (i povratak na tab) ne sme da je vrati.
                      onFocus={(event) => {
                        if (event.currentTarget.matches(":focus-visible")) {
                          openPreview(partner, event.currentTarget);
                        }
                      }}
                      onBlur={hidePreview}
                      onClick={hidePreview}
                    >
                      <Hexagon
                        logoSrc={partner.src}
                        logoAlt=""
                        logoCrop={partner.crop}
                        logoScale={partner.scale}
                      />
                    </a>
                  );
                })
              : Array.from({ length: MARQUEE_HEXAGON_COUNT }, (_, index) => (
                  <Hexagon filled={filled} key={`${groupIndex}-${index}`} />
                ))}
          </div>
        ))}
      </div>

      {preview ? (
        <PartnerPreview
          partner={preview.partner}
          anchor={preview.anchor}
          onPointerEnter={cancelHidePreview}
          onPointerLeave={hidePreview}
          onOpen={hidePreview}
        />
      ) : null}
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
      className="media-section"
      title="MEDIJSKI"
      filled={false}
      direction="right"
      illustration={cameraIllustration}
      illustrationClassName="illustration-camera"
    />

    <PartnerRow
      className="goods-section"
      title="ROBNI"
      direction="left"
      illustration={canIllustration}
      illustrationClassName="illustration-can"
      logos={ROBNI_PARTNERS}
    />
  </section>
);

export default Partneri;
