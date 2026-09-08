import { useEffect, useRef, useState, type CSSProperties } from "react";

import panelSparkDesktop from "@/assets/panel/panel-spark-desktop.svg";
import featuredPanelist from "@/assets/panel/featured-panelist.png";
import arrow from "@/assets/panel/arrow.svg";
import microphone from "@/assets/panel/microphone.svg";
import questionMark from "@/assets/panel/question-mark.svg";

import "./Panel.scss";

const PANELISTS = [
  "Charlie Kirk",
  "Miroljub Petrovic",
  "Moma Kovacevic",
  "Ivan Rados",
  "Gandi",
];

type TransitionPhase = "idle" | "exit" | "enter";
type TransitionDirection = "previous" | "next";

const EXIT_DURATION = 170;
const ENTER_DURATION = 230;

const transitionStyle = {
  "--panel-exit-duration": `${EXIT_DURATION}ms`,
  "--panel-enter-duration": `${ENTER_DURATION}ms`,
} as CSSProperties;

const Panel = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [phase, setPhase] = useState<TransitionPhase>("idle");

  const [direction, setDirection] = useState<TransitionDirection>("next");

  const transitionLocked = useRef(false);

  const isAnimating = phase !== "idle";

  useEffect(() => {
    if (phase === "idle") {
      return;
    }

    const timeout = window.setTimeout(
      () => {
        if (phase === "exit") {
          const step = direction === "next" ? 1 : -1;

          setSelectedIndex(
            (currentIndex) =>
              (currentIndex + step + PANELISTS.length) % PANELISTS.length,
          );

          setPhase("enter");

          return;
        }

        transitionLocked.current = false;

        setPhase("idle");
      },
      phase === "exit" ? EXIT_DURATION : ENTER_DURATION,
    );

    return () => {
      window.clearTimeout(timeout);
    };
  }, [phase, direction]);

  const selectedPanelist = PANELISTS[selectedIndex];

  const remainingPanelists = Array.from(
    {
      length: PANELISTS.length - 1,
    },
    (_, offset) => PANELISTS[(selectedIndex + offset + 1) % PANELISTS.length],
  );

  /*
   * MOBILE:
   *
   * Koristimo samo dva panelista:
   * jedan na levoj i jedan na desnoj strani.
   *
   * Svaki dobija sopstveni stage-side wrapper,
   * pa više ne zavisimo od jednog ogromnog
   * centralnog clip-path poligona.
   */
  const mobileLeftPanelist = remainingPanelists[0];

  const mobileRightPanelist = remainingPanelists[remainingPanelists.length - 1];

  const selectPanelist = (nextDirection: TransitionDirection) => {
    if (transitionLocked.current) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const step = nextDirection === "next" ? 1 : -1;

      setSelectedIndex(
        (currentIndex) =>
          (currentIndex + step + PANELISTS.length) % PANELISTS.length,
      );

      return;
    }

    transitionLocked.current = true;

    setDirection(nextDirection);

    setPhase("exit");
  };

  const selectPrevious = () => selectPanelist("previous");

  const selectNext = () => selectPanelist("next");

  return (
    <section className="panel-section">
      <div className="panel-canvas">
        {/* =================================================
            DESKTOP BLUE BAND
            ================================================= */}

        <div className="panel-stage-band" aria-hidden="true" />

        {/* =================================================
            MOBILE SPLIT STAGE
            ================================================= */}

        <div className="panel-mobile-stage" aria-hidden="true">
          {/* LEFT HALF */}
          <div className="panel-mobile-side panel-mobile-side--left">
            <div className="panel-mobile-band" />

            <div className="panel-mobile-panelist">
              <div className="panel-mobile-panelist-cutout">
                <img
                  className="panel-mobile-panelist-image"
                  src={featuredPanelist}
                  alt={mobileLeftPanelist}
                  draggable={false}
                />
              </div>
            </div>
          </div>

          {/* RIGHT HALF */}
          <div className="panel-mobile-side panel-mobile-side--right">
            <div className="panel-mobile-band" />

            <div className="panel-mobile-panelist">
              <div className="panel-mobile-panelist-cutout">
                <img
                  className="panel-mobile-panelist-image"
                  src={featuredPanelist}
                  alt={mobileRightPanelist}
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            FEATURED CLUSTER
            ================================================= */}

        <div className="panel-featured-cluster" style={transitionStyle}>
          {/* YELLOW SPARK */}

          <img
            className="panel-featured-spark"
            src={panelSparkDesktop}
            alt=""
            aria-hidden="true"
            draggable={false}
          />

          {/* YELLOW CIRCLE */}

          <div className="panel-featured-circle" aria-hidden="true" />

          {/* FEATURED PANELIST */}

          <div className="panel-featured-person">
            <div className="panel-featured-person-outline" aria-hidden="true" />

            <img
              className={`panel-featured-person-image panel-featured-person-image--${phase}-${direction}`}
              src={featuredPanelist}
              alt={selectedPanelist}
              draggable={false}
            />
          </div>

          {/* FEATURED CARD */}

          <div className="panel-featured-card">
            <div
              className={`panel-featured-card-name panel-featured-card-name--${phase}`}
            >
              {selectedPanelist.split(" ").map((part, index) => (
                <span key={`${part}-${index}`}>{part}</span>
              ))}
            </div>

            <div className="panel-featured-card-role">PANELISTA</div>
          </div>

          {/* MICROPHONE */}

          <img
            className="panel-microphone"
            src={microphone}
            alt=""
            aria-hidden="true"
            draggable={false}
          />

          {/* NAVIGATION */}

          <button
            className="panel-arrow panel-arrow--previous"
            type="button"
            aria-label="Prethodni panelista"
            onClick={selectPrevious}
            disabled={isAnimating}
          >
            <img src={arrow} alt="" aria-hidden="true" draggable={false} />
          </button>

          <button
            className="panel-arrow panel-arrow--next"
            type="button"
            aria-label="Sledeći panelista"
            onClick={selectNext}
            disabled={isAnimating}
          >
            <img src={arrow} alt="" aria-hidden="true" draggable={false} />
          </button>
        </div>

        {/* =================================================
            DESKTOP OTHER PANELISTS
            ================================================= */}

        <div className="panel-stage-panelists">
          {remainingPanelists.map((name) => (
            <div className="panel-stage-panelist" key={name}>
              <div className="panel-stage-panelist-visual">
                <div
                  className="panel-stage-panelist-cutout"
                  aria-hidden="true"
                />

                <img
                  className="panel-stage-panelist-image"
                  src={featuredPanelist}
                  alt={name}
                  draggable={false}
                />
              </div>

              <p className="panel-stage-panelist-name">
                {name.split(" ").map((part, index) => (
                  <span key={`${part}-${index}`}>{part}</span>
                ))}
              </p>
            </div>
          ))}
        </div>

        {/* =================================================
            QUESTION MARK
            ================================================= */}

        <img
          className="panel-question-mark"
          src={questionMark}
          alt=""
          aria-hidden="true"
          draggable={false}
        />

        {/* =================================================
            TITLE
            ================================================= */}

        <h2 className="panel-title">PANEL</h2>

        {/* =================================================
            QUESTION
            ================================================= */}

        <p className="panel-question">Da li zapravo nosimo plamen?</p>

        {/* =================================================
            DESCRIPTION
            ================================================= */}

        <p className="panel-description">
          They always said that Charlie Kirk was a Nazi, then they celebrated
          after they killed him
          <br />
          They tried to tell us that black lives matter, and that white people
          have always been villains
          <br />
          They burnin' flags in the streets, and they scream at police
          <span className="panel-description-mobile-ending" hidden>
            {" "}
            taking illegals to prison
          </span>
        </p>
      </div>
    </section>
  );
};

export default Panel;
