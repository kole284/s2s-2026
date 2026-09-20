import { useId, useLayoutEffect, useRef, useState } from "react";
import "./Tim.scss";

type Team = {
  id: string;
  label: string;
  ribbonLabel: string;
  titlePrefix: string;
  titleFirstLine: string;
  titleSecondLine: string;
  image: string;
  coordinator: {
    firstName: string;
    lastName: string;
    image: string;
    imagePosition: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
};

// Kadar je podešen po fotografiji: teme ostaje na istoj visini i osoba u centru,
// dok je vidljiv deo tela usklađen sa Damnjanovim portretom.
const TEAMS: Team[] = [
  {
    id: "koordinatori",
    label: "KT",
    ribbonLabel: "CORE",
    titlePrefix: "Tim",
    titleFirstLine: "koordinatora",
    titleSecondLine: "",
    image: "/tim/ljudi/timovi/core.webp",
    coordinator: {
      firstName: "Stefan",
      lastName: "Mrkela",
      image: "/tim/ljudi/koordinatori/core.webp",
      imagePosition: { x: -256.4, y: -214.5, width: 874.4, height: 582.9 },
    },
  },
  {
    id: "dizajn",
    label: "DT",
    ribbonLabel: "DIZAJN",
    titlePrefix: "Tim za",
    titleFirstLine: "dizajn",
    titleSecondLine: "",
    image: "/tim/ljudi/timovi/Dizajn-team.webp",
    coordinator: {
      firstName: "Stefan",
      lastName: "Petrović",
      image: "/tim/ljudi/koordinatori/dizajn.webp",
      imagePosition: { x: -198.5, y: -168.6, width: 771.3, height: 514.2 },
    },
  },
  {
    id: "it",
    label: "IT",
    ribbonLabel: "IT",
    titlePrefix: "Tim za",
    titleFirstLine: "informacione",
    titleSecondLine: "tehnologije",
    image: "/tim/ljudi/timovi/IT-team.webp",
    coordinator: {
      firstName: "Nikola",
      lastName: "Kostić",
      image: "/tim/ljudi/koordinatori/IT.webp",
      imagePosition: { x: -157.5, y: -133.1, width: 658.9, height: 433.1 },
    },
  },
  {
    id: "cr",
    label: "CR",
    ribbonLabel: "CR",
    titlePrefix: "Tim za",
    titleFirstLine: "odnose",
    titleSecondLine: "sa kompanijama",
    image: "/tim/ljudi/timovi/CR-team.webp",
    coordinator: {
      firstName: "Iva",
      lastName: "Vukoičić",
      image: "/tim/ljudi/koordinatori/cr.webp",
      imagePosition: { x: -295.1, y: -244.5, width: 936.8, height: 624.3 },
    },
  },
  {
    id: "hr",
    label: "HR",
    ribbonLabel: "HR",
    titlePrefix: "Tim za",
    titleFirstLine: "ljudske",
    titleSecondLine: "resurse",
    image: "/tim/ljudi/timovi/HR-team.webp",
    coordinator: {
      firstName: "Milena",
      lastName: "Rodić",
      image: "/tim/ljudi/koordinatori/hr.webp",
      imagePosition: { x: -241.6, y: -174.0, width: 807.7, height: 531.0 },
    },
  },
  {
    id: "pr",
    label: "PR",
    ribbonLabel: "PR",
    titlePrefix: "Tim za",
    titleFirstLine: "odnose",
    titleSecondLine: "s javnošću",
    image: "/tim/ljudi/timovi/PR-team.webp",
    coordinator: {
      firstName: "Damnjan",
      lastName: "Ilić",
      image: "/tim/ljudi/koordinatori/PR.webp",
      imagePosition: { x: -172.8, y: -132.3, width: 657.7, height: 432.3 },
    },
  },
  {
    id: "log",
    label: "LT",
    ribbonLabel: "LOGISTIKA",
    titlePrefix: "Tim za",
    titleFirstLine: "logistiku",
    titleSecondLine: "",
    image: "/tim/ljudi/timovi/Logistika-team.webp",
    coordinator: {
      firstName: "Angelina",
      lastName: "Spasić",
      image: "/tim/ljudi/koordinatori/logistika.webp",
      imagePosition: { x: -300.4, y: -243.2, width: 951.6, height: 634.4 },
    },
  },
];

const DESKTOP_BAND_REPEAT_COUNT = 32;
const DESKTOP_BAND_SPEED_PX_PER_SECOND = 60;
const MOBILE_RIBBON_SPEED_PX_PER_SECOND = 60;

const COORDINATOR_FRAME_PATH = `
  M0 297.39
  L30.4236 260.882
  V206.88
  L44.8748 181.02
  L52.4807 149.836
  L39 135.385
  L66 117.891
  L52 80.6225
  L54 54.7624
  L69 23.5783
  L91 7.60589
  L211 0
  L240 7.60589
  L270 47.9171
  L262 64.6501
  L266 117.891
  L272 135.385
  L295 141.47
  L295.7 167.33
  L318.039 191.669
  L311.954 216.768
  L300.827 241.107
  L305.757 260.882
  L301.954 272.291
  L343.786 289.024
  H329.335
  H314.884
  L267.727 293.207
  L245.67 297.39
  L207.15 289.824
  L200.746 289.466
  L158.963 297.39
  L124.737 285.221
  L69.9742 297.39
  H47.917
  H21.296
  H11.409
  H0
  Z
`;

const TEAM_PHOTO_CLIP_PATH = `
  M27.27 65.2179
  L69.4282 33.9605
  L137.183 47.9499
  L171.479 65.2179
  L208.285 47.9499
  L265.166 61.8995
  L312.009 38.478
  L366.38 43.4969
  L409.041 27.4321
  L440.978 47.9499
  L488.507 29.2753
  L519.801 33.9605
  L526.933 59.1193
  L534.513 99.5413
  L531.624 124.636
  L519.801 143.078
  L543.715 163.951
  L526.933 197.41
  L534.513 233.379
  L547.061 286.529
  L534.513 315.354
  L516.111 327.902
  L465.085 315.354
  L395.657 345.458
  L360.525 336.132
  L332.084 358.515
  L279.386 353.833
  L254.291 345.458
  L227.524 336.132
  L190.718 336.132
  L179.008 358.515
  L123.8 370.562
  L103.024 345.458
  L78.6296 336.132
  L41.8243 345.458
  L30.7083 301.134
  L38.4783 254.291
  L30.7083 204.102
  L48.5162 148.057
  L30.7083 124.636
  Z
`;

const TEAM_FRAME_PATH = `
  M5.61951 52.6934
  L49.4516 20.7176
  L141.612 20.7176
  L158.47 35.6397
  L219.161 28.1787
  L248.382 38.8372
  L307.949 12.1908
  L339.418 28.1787
  L369.763 12.1908
  L462.57 20.7176
  L515.543 0
  L567.57 38.8372
  L554.083 136.896
  L567.57 240.285
  L548.181 347
  L432.702 344.739
  L330.427 368.188
  L219.161 353.266
  L150.603 383.11
  L78.6731 368.188
  L25.8497 357.529
  L0 263.734
  L25.8497 133.699
  Z
`;

const Tim = () => {
  const teamPhotoClipId = useId();
  const coordinatorClipId = useId();
  const desktopBandTrackRef = useRef<HTMLDivElement>(null);
  const desktopBandGroupRef = useRef<HTMLDivElement>(null);
  const mobileRibbonRefs = useRef<Array<HTMLDivElement | null>>([]);
  const mobileRibbonTrackRefs = useRef<Array<HTMLDivElement | null>>([]);
  const mobileRibbonGroupRefs = useRef<Array<HTMLDivElement | null>>([]);

  const [activeTeamIndex, setActiveTeamIndex] = useState(0);

  const activeTeam = TEAMS[activeTeamIndex]!;
  const hasMultipleTeams = TEAMS.length > 1;
  const mobileRibbonItems = Array.from({
    length: Math.max(5, 14 - activeTeam.ribbonLabel.length),
  });
  const desktopBandItems = Array.from({
    length: DESKTOP_BAND_REPEAT_COUNT,
  });

  useLayoutEffect(() => {
    const track = desktopBandTrackRef.current;
    const group = desktopBandGroupRef.current;

    if (!track || !group) return;

    let isActive = true;
    const updateDuration = () => {
      const groupWidth = group.scrollWidth;

      if (groupWidth > 0) {
        const duration = groupWidth / DESKTOP_BAND_SPEED_PX_PER_SECOND;
        track.style.setProperty("--team-band-duration", `${duration}s`);
      }
    };

    updateDuration();

    const resizeObserver = new ResizeObserver(updateDuration);
    resizeObserver.observe(group);

    document.fonts.ready.then(() => {
      if (isActive) updateDuration();
    });

    return () => {
      isActive = false;
      resizeObserver.disconnect();
    };
  }, [activeTeam.ribbonLabel]);

  useLayoutEffect(() => {
    const resizeObservers: ResizeObserver[] = [];
    let isActive = true;

    const updateDuration = (index: number) => {
      const ribbon = mobileRibbonRefs.current[index];
      const track = mobileRibbonTrackRefs.current[index];
      const group = mobileRibbonGroupRefs.current[index];

      if (!ribbon || !track || !group) return;

      const transform = getComputedStyle(ribbon).transform;
      const matrix =
        transform === "none"
          ? new DOMMatrixReadOnly()
          : new DOMMatrixReadOnly(transform);
      const renderedScale = Math.hypot(matrix.a, matrix.b);
      const renderedGroupWidth = group.scrollWidth * renderedScale;

      if (renderedGroupWidth > 0) {
        const duration = renderedGroupWidth / MOBILE_RIBBON_SPEED_PX_PER_SECOND;
        track.style.setProperty(
          "--team-mobile-ribbon-duration",
          `${duration}s`,
        );
      }
    };

    mobileRibbonTrackRefs.current.forEach((_, index) => {
      updateDuration(index);

      const ribbon = mobileRibbonRefs.current[index];
      const group = mobileRibbonGroupRefs.current[index];
      if (!ribbon || !group) return;

      const resizeObserver = new ResizeObserver(() => updateDuration(index));
      resizeObserver.observe(ribbon);
      resizeObserver.observe(group);
      resizeObservers.push(resizeObserver);
    });

    document.fonts.ready.then(() => {
      if (!isActive) return;
      mobileRibbonTrackRefs.current.forEach((_, index) =>
        updateDuration(index),
      );
    });

    return () => {
      isActive = false;
      resizeObservers.forEach((observer) => observer.disconnect());
    };
  }, [activeTeam.ribbonLabel]);

  const showPreviousTeam = () => {
    setActiveTeamIndex((index) => (index - 1 + TEAMS.length) % TEAMS.length);
  };

  const showNextTeam = () => {
    setActiveTeamIndex((index) => (index + 1) % TEAMS.length);
  };

  return (
    <section className="team-section" id="tim" aria-label="Organizacioni tim">
      <h2 className="team-mobile-heading">Naš tim</h2>
      <div className="team-decorations" aria-hidden="true">
        <img
          className="team-circle-striped"
          src="/tim/circle-striped.svg"
          alt=""
        />

        <img
          className="team-star team-star-small"
          src="/tim/star-01.svg"
          alt=""
        />

        <img
          className="team-star team-star-large"
          src="/tim/star-02.svg"
          alt=""
        />

        <img
          className="team-star team-star-top"
          src="/tim/star-03.svg"
          alt=""
        />
      </div>

      <div className="team-lightnings" aria-hidden="true">
        <svg
          className="team-lightning team-lightning-left-large"
          viewBox="0 0 292 232"
          overflow="visible"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="white"
            d="M111.5 144.5L-1.5 177.5V231.5L123.5 182L171.5 218L222 170.5L242 136.5L268.5 91.5L292 28.5H256L261.5 65.5L242 96L212 136.5L171.5 182L138.5 139.5L131 91.5L162.5 77L168.5 46.5L199 22.5L201.5 0L141.5 21L131 52.5L87.5 91.5L111.5 144.5Z"
          />
        </svg>

        {/*
         * Donja munja ispod koordinatora.
         * Cela grana koristi istu debljinu kao njen nastavak sa leve strane.
         */}
        <svg
          className="team-lightning team-lightning-left-inner"
          viewBox="0 0 188 113"
          overflow="visible"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="white"
            d="M101 85L16.5 78.5L12.5 74.5L0 96L107 112.5L139.5 50L187.5 26L178 14.5L187.5 0L165 3L155.5 22.5L115.5 50L101 85Z"
          />
        </svg>

        {/*
         * Munja koordinator -> tim.
         * Originalni Vector 219 u prirodnim proporcijama.
         */}
        <svg
          className="team-lightning team-lightning-between"
          viewBox="0 0 209 113"
          overflow="visible"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="white"
            d="M44.5 59
               L0 96.5
               V112.5
               L44.5 82
               L69.5 93.5
               L91.5 65.5
               L166 70
               L209 25.5
               L200 0
               L166 55
               L91.5 46.5
               L63 74.5
               L44.5 59
               Z"
          />
        </svg>

        {/*
         * Munja tim -> desna ivica, gornja grana.
         * Originalni levi vrh se naslanja na team frame bez dodatnog
         * podvlačenja ispod belog oblika.
         */}
        <svg
          className="team-lightning team-lightning-right-upper"
          viewBox="0 0 199 60"
          overflow="visible"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="white"
            d="M124.5 0L198.5 5V21.5H160L146 30L132 20L120 48L103 31L88 60L68 38L50 51L28 32L0 54.5V35.5L28 18L49 36L70 22L86 43L101 9L117 27L124.5 0Z"
          />
        </svg>

        <svg
          className="team-lightning team-lightning-right-lower"
          viewBox="0 0 223 238"
          overflow="visible"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="white"
            d="M184 83.5L225 125V151L184 116.5L168 126L154 145L160 163L149 178L156 190L132 198L120 220L104 214L89.5 225L70 233.5L24.5 238L39 225L72 214L96 207L88 190L112 178L103 160L118 143L108 127L91 139L73 124L55 136L36 119L0 125L10.5 116.5L29 105L47 116L65 101L82 115L99 101L110.5 92.5L103 49.5L75.5 70.5L46 37.5L24.5 29V0L46 4.5L82 49.5L103 19L133 83.5L157 109L184 83.5Z"
          />
        </svg>

        {/*
         * Ovi spanovi NISU nove munje. Oni samo produžavaju krajnji beli
         * segment originalnih Figma munja kroz "side-space" koji postoji kada
         * je viewport širi od 1440:1024 design frame-a.
         */}
        <svg
          className="team-lightning-edge team-lightning-edge--left"
          viewBox="0 0 100 92"
          preserveAspectRatio="none"
          focusable="false"
        >
          <path
            d="M0 60
               L16 30
               L33 60
               L50 25
               L67 58
               L84 55
               L100 15"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span className="team-lightning-edge team-lightning-edge--right-upper" />
        <span className="team-lightning-edge team-lightning-edge--right-lower" />
      </div>

      <div className="team-band" aria-hidden="true">
        <div className="team-band-text-lane">
          <div className="team-band-track" ref={desktopBandTrackRef}>
            {[0, 1].map((copy) => (
              <div
                className="team-band-group"
                aria-hidden={copy === 1 ? "true" : undefined}
                key={copy}
                ref={copy === 0 ? desktopBandGroupRef : undefined}
              >
                <div className="team-band-labels">
                  {desktopBandItems.map((_, index) => (
                    <span key={index}>{activeTeam.ribbonLabel}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="team-stage">
        <div className="team-circle-solid" aria-hidden="true" />

        {["top", "bottom"].map((position, ribbonIndex) => (
          <div
            className={`team-mobile-ribbon team-mobile-ribbon-${position}`}
            aria-hidden="true"
            key={position}
            ref={(element) => {
              mobileRibbonRefs.current[ribbonIndex] = element;
            }}
          >
            <div
              className="team-ribbon-track"
              ref={(element) => {
                mobileRibbonTrackRefs.current[ribbonIndex] = element;
              }}
            >
              {[0, 1].map((copy) => (
                <div
                  className="team-ribbon-group"
                  key={copy}
                  ref={(element) => {
                    if (copy === 0) {
                      mobileRibbonGroupRefs.current[ribbonIndex] = element;
                    }
                  }}
                >
                  <div className="team-ribbon-labels">
                    {mobileRibbonItems.map((_, index) => (
                      <span key={index}>{activeTeam.ribbonLabel}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="team-content">
          <div className="team-coordinator">
            <img
              className="team-mobile-lightning team-mobile-lightning-top"
              src="/tim/lightning-mobile-top.svg"
              alt=""
              aria-hidden="true"
            />
            <button
              className="team-arrow team-arrow-left"
              type="button"
              aria-label="Prethodni tim"
              onClick={showPreviousTeam}
              disabled={!hasMultipleTeams}
            >
              <img
                className="team-arrow-icon-desktop"
                src="/tim/arrow-left.svg"
                alt=""
              />

              <img
                className="team-arrow-icon-mobile"
                src="/tim/arrow-left-mobile.svg"
                alt=""
              />
            </button>

            <button
              className="team-arrow team-arrow-right"
              type="button"
              aria-label="Sledeći tim"
              onClick={showNextTeam}
              disabled={!hasMultipleTeams}
            >
              <img
                className="team-arrow-icon-desktop"
                src="/tim/arrow-left.svg"
                alt=""
              />

              <img
                className="team-arrow-icon-mobile"
                src="/tim/arrow-left-mobile.svg"
                alt=""
              />
            </button>
            <svg
              className="team-coordinator-photo"
              viewBox="-70.607 0 485 298"
              role="img"
              aria-label={`Koordinator — ${activeTeam.coordinator.firstName} ${activeTeam.coordinator.lastName}`}
            >
              <defs>
                <clipPath id={coordinatorClipId} clipPathUnits="userSpaceOnUse">
                  <path
                    d={COORDINATOR_FRAME_PATH}
                    transform="translate(5.157 4.461) scale(0.97)"
                  />
                </clipPath>
              </defs>

              <path
                className="team-coordinator-frame"
                d={COORDINATOR_FRAME_PATH}
              />

              <image
                href={activeTeam.coordinator.image}
                x={activeTeam.coordinator.imagePosition.x}
                y={activeTeam.coordinator.imagePosition.y}
                width={activeTeam.coordinator.imagePosition.width}
                height={activeTeam.coordinator.imagePosition.height}
                preserveAspectRatio="xMidYMid meet"
                clipPath={`url(#${coordinatorClipId})`}
              />
            </svg>

            <div className="team-coordinator-caption">
              <img
                className="team-coordinator-label"
                src="/tim/coordinator-label.svg"
                alt="Koordinator"
              />

              <p className="team-coordinator-name">
                {activeTeam.coordinator.firstName}
                <br />
                {activeTeam.coordinator.lastName}
              </p>
            </div>
          </div>

          <div className="team-group">
            <img
              className="team-mobile-lightning team-mobile-lightning-bottom"
              src="/tim/lightning-mobile-bottom.svg"
              alt=""
              aria-hidden="true"
            />
            <svg
              className="team-group-photo"
              viewBox="0 0 568 384"
              role="img"
              aria-label={`Članovi tima — ${activeTeam.label}`}
            >
              <defs>
                <clipPath id={teamPhotoClipId} clipPathUnits="userSpaceOnUse">
                  <path d={TEAM_PHOTO_CLIP_PATH} />
                </clipPath>
              </defs>

              <path className="team-group-frame" d={TEAM_FRAME_PATH} />

              <image
                href={activeTeam.image}
                x="27.27"
                y="27.4321"
                width="519.791"
                height="343.1299"
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#${teamPhotoClipId})`}
              />
            </svg>

            <div className="team-group-caption">
              <h2
                className="team-group-title"
                aria-live="polite"
                aria-atomic="true"
              >
                <span>{activeTeam.titlePrefix} </span>
                {activeTeam.titleFirstLine}

                {activeTeam.titleSecondLine && (
                  <>
                    <br />
                    {activeTeam.titleSecondLine}
                  </>
                )}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tim;
