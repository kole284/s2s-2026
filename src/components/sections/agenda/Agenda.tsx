import { useEffect, useRef, useState } from "react";
import "./Agenda.scss";

type AgendaDay = 1 | 2;

interface AgendaItem {
  id: string;
  time: string;
  title: string;
}

interface Position {
  x: number;
  y: number;
}

interface StarPosition extends Position {
  width: number;
  height: number;
}

interface DesktopLabelPosition extends Position {
  placement: "top" | "bottom";
  labelWidth?: number;
  textAlign?: "left" | "center" | "right";
}

interface DesktopConnectorPosition extends Position {
  height: number;
  dot: "top" | "bottom";
}

interface MobileLabelPosition extends Position {
  labelOffsetY?: number;
}

interface DesktopSlot {
  label: DesktopLabelPosition;
  connector: DesktopConnectorPosition;
  star: StarPosition;
  starAsset: string;
}

interface MobileSlot {
  label: MobileLabelPosition;
  connector: Position;
  star: StarPosition;
  starAsset: string;
  connectorAsset: string;
}

/* =========================================================
   DATA
   Za sada placeholder sadržaj iz Figme.
   Kasnije ovde samo menjamo stvarnu satnicu.
   ========================================================= */

const agendaByDay: Record<AgendaDay, AgendaItem[]> = {
  1: [
    {
      id: "day-1-event-1",
      time: "10:00-10:30",
      title: "Check in",
    },
    {
      id: "day-1-event-2",
      time: "10:30-11:00",
      title: "Otvaranje",
    },
    {
      id: "day-1-event-3",
      time: "11:00-12:30",
      title: "Panel",
    },
    {
      id: "day-1-event-4",
      time: "12:30-12:45",
      title: "Pauza 1",
    },
    {
      id: "day-1-event-5",
      time: "12:45-13:45",
      title: "Radionica 1",
    },
    {
      id: "day-1-event-6",
      time: "13:45-14:30",
      title: "Pauza 2 - Obrok",
    },
    {
      id: "day-1-event-7",
      time: "14:30-15:15",
      title: "Radionica 2",
    },
    {
      id: "day-1-event-8",
      time: "15:15-15:30",
      title: "Pauza 3",
    },
    {
      id: "day-1-event-9",
      time: "15:30-16:15",
      title: "Radionica 3",
    },
    {
      id: "day-1-event-10",
      time: "16:15-16:30",
      title: "Pauza 4",
    },
    {
      id: "day-1-event-11",
      time: "16:30-17:15",
      title: "Radionica 4",
    },
  ],

  2: [
    {
      id: "day-2-event-1",
      time: "12:00-12:30",
      title: "Check in",
    },
    {
      id: "day-2-event-2",
      time: "12:30-13:15",
      title: "Radionica 1",
    },
    {
      id: "day-2-event-3",
      time: "13:15-13:30",
      title: "Pauza 1",
    },
    {
      id: "day-2-event-4",
      time: "13:30-14:15",
      title: "Radionica 2",
    },
    {
      id: "day-2-event-5",
      time: "14:15-14:30",
      title: "Pauza 2",
    },
    {
      id: "day-2-event-6",
      time: "14:30-15:15",
      title: "Radionica 3",
    },
    {
      id: "day-2-event-7",
      time: "15:15-16:00",
      title: "Pauza 3 - obrok",
    },
    {
      id: "day-2-event-8",
      time: "16:00-17:00",
      title: "Radionica 4",
    },
    {
      id: "day-2-event-9",
      time: "17:00-17:15",
      title: "Pauza 4",
    },
    {
      id: "day-2-event-10",
      time: "17:15-18:15",
      title: "Zatvaranje + tombola",
    },
    {
      id: "day-2-event-11",
      time: "18:15-18:45",
      title: "Koktel",
    },
  ],
};

/* =========================================================
   DESKTOP EVENT LABELS
   Figma frame: 1440 x 1024
   ========================================================= */

const desktopLabelPositions: DesktopLabelPosition[] = [
  /*
   * Redosled mora da prati belu timeline liniju sleva nadesno:
   * donja zvezda -> gornja zvezda -> donja -> gornja...
   *
   * Tako agendaByDay[activeDay][index] ostaje hronološki vezan
   * za stvarnu sledeću tačku na liniji.
   */
  {
    x: 9.5139,
    y: 67.7734,
    placement: "bottom",
  },
  {
    x: 23.75,
    y: 23.6328,
    placement: "top",
  },
  {
    x: 20.9722,
    y: 80.2734,
    placement: "bottom",
  },
  {
    x: 35.625,
    y: 37.8906,
    placement: "top",
  },
  {
    x: 34.2361,
    y: 84.1797,
    placement: "bottom",
  },
  {
    x: 50.2778,
    y: 28.3203,
    placement: "top",
  },
  {
    x: 52.5,
    y: 78.8086,
    placement: "bottom",
  },
  {
    x: 63.2639,
    y: 23.7305,
    placement: "top",
  },
  {
    x: 70.7639,
    y: 77.5391,
    placement: "bottom",
  },
  {
    x: 79.2361,
    y: 21.9727,
    placement: "top",
  },
  {
    x: 85.2083,
    y: 68.0664,
    placement: "bottom",
  },
];

/* =========================================================
   DESKTOP YELLOW CONNECTORS
   ========================================================= */

const desktopConnectorPositions: DesktopConnectorPosition[] = [
  /*
   * Isti hronološki redosled kao desktopStarPositions:
   * low -> high -> low -> high...
   */
  {
    x: 13.88,
    y: 58.11,
    height: 8.451,
    dot: "bottom",
  },
  {
    x: 27.64,
    y: 29.82,
    height: 8.451,
    dot: "top",
  },
  {
    x: 25.44,
    y: 70.88,
    height: 8.451,
    dot: "bottom",
  },
  {
    x: 39.5,
    y: 43.66,
    height: 8.451,
    dot: "top",
  },
  {
    x: 38.43,
    y: 75.05,
    height: 8.451,
    dot: "bottom",
  },
  {
    x: 53.56,
    y: 35.14,
    height: 8.451,
    dot: "top",
  },
  {
    x: 56.52,
    y: 69.1,
    height: 8.451,
    dot: "bottom",
  },
  {
    x: 66.93,
    y: 30.18,
    height: 8.451,
    dot: "top",
  },
  {
    x: 75.15,
    y: 65.2,
    height: 8.868,
    dot: "bottom",
  },
  {
    x: 82.88,
    y: 28.94,
    height: 8.451,
    dot: "top",
  },
  {
    x: 89.48,
    y: 57.7,
    height: 8.451,
    dot: "bottom",
  },
];

/* =========================================================
   DESKTOP STARS
   ========================================================= */

const desktopStarPositions: StarPosition[] = [
  {
    x: 9.4834,
    y: 51.1729,
    width: 9.6257,
    height: 10.7517,
  },
  {
    x: 23.4188,
    y: 31.6653,
    width: 8.4487,
    height: 11.9147,
  },
  {
    x: 20.7701,
    y: 64.0312,
    width: 9.2904,
    height: 10.44,
  },
  {
    x: 35.0215,
    y: 45.5176,
    width: 10.0612,
    height: 13.4257,
  },
  {
    x: 34.6431,
    y: 69.3513,
    width: 9.0872,
    height: 12.7134,
  },
  {
    x: 50.5961,
    y: 40.9756,
    width: 6.5386,
    height: 8.7886,
  },
  {
    x: 51.9201,
    y: 62.3457,
    width: 9.5928,
    height: 11.7777,
  },
  {
    x: 64.1535,
    y: 34.1481,
    width: 6.5248,
    height: 9.5898,
  },
  {
    x: 69,
    y: 58.1787,

    width: 9.7206,
    height: 11.3211,
  },
  {
    x: 79.35,
    y: 33.7934,
    width: 7.479,
    height: 10.8518,
  },
  {
    x: 85.7812,
    y: 50.3057,
    width: 8.5551,
    height: 11.7347,
  },
];

const desktopStarAssets = [
  "/agenda/desktop/event-star-01.svg",
  "/agenda/desktop/event-star-02.svg",
  "/agenda/desktop/event-star-03.svg",
  "/agenda/desktop/event-star-04.svg",
  "/agenda/desktop/event-star-05.svg",
  "/agenda/desktop/event-star-06.svg",
  "/agenda/desktop/event-star-07.svg",
  "/agenda/desktop/event-star-08.svg",
  "/agenda/desktop/event-star-09.svg",

  // Originalna poslednja dva exporta su bila prazna.
  "/agenda/desktop/event-star-08.svg",
  "/agenda/desktop/event-star-02.svg",
];

const desktopSlots: DesktopSlot[] = desktopLabelPositions.map(
  (label, index) => ({
    label,
    connector: desktopConnectorPositions[index]!,
    star: desktopStarPositions[index]!,
    starAsset: desktopStarAssets[index]!,
  }),
);

/* =========================================================
   MOBILE
   ========================================================= */

const mobileLabelPositions: MobileLabelPosition[] = [
  { x: 41.02, y: 20.24 },
  { x: 27.43, y: 26.08 },
  { x: 61.02, y: 31.98 },
  { x: 26.67, y: 38.25 },
  { x: 43.84, y: 44.43 },
  { x: 29.23, y: 50.34 },
  { x: 63.84, y: 55.92, labelOffsetY: -1 },
  { x: 39.23, y: 61.28 },
  { x: 49.49, y: 69.03 },
  { x: 30, y: 74.93 },
  { x: 59.49, y: 80.98 },
];

const mobileConnectorPositions: Position[] = [
  { x: 14.36, y: 21.39 },
  { x: 61.02, y: 27.23 },
  { x: 32.05, y: 32.99 },
  { x: 55.64, y: 39.33 },
  { x: 14.1, y: 45.51 },
  { x: 57.95, y: 51.36 },
  { x: 36.67, y: 57 },
  { x: 68.97, y: 62.62 },
  { x: 21.54, y: 69.85 },
  { x: 59.49, y: 75.95 },
  { x: 34.1, y: 82.06 },
];

const mobileStarPositions: StarPosition[] = [
  {
    x: 2.76,
    y: 19.05,
    width: 22.95,
    height: 5.2,
  },
  {
    x: 70.77,
    y: 24.32,
    width: 23.31,
    height: 6.2,
  },
  {
    x: 16.36,
    y: 30.55,
    width: 23.05,
    height: 5.4,
  },
  {
    x: 1.28,
    y: 42.24,
    width: 23.31,
    height: 6.2,
  },
  {
    x: 64.13,
    y: 36.77,
    width: 24.51,
    height: 6.1,
  },
  {
    x: 72.56,
    y: 49.25,
    width: 17.16,
    height: 4.4,
  },
  {
    x: 21.54,
    y: 55.16,
    width: 24.22,
    height: 5.6,
  },
  {
    x: 82.05,
    y: 61.01,
    width: 16.59,
    height: 4.6,
  },
  {
    x: 7.89,
    y: 67.88,
    width: 23.6,
    height: 5.2,
  },
  {
    x: 73.07,
    y: 73.78,
    width: 19.1,
    height: 5.2,
  },
  {
    x: 26.15,
    y: 79.69,
    width: 20.88,
    height: 5.4,
  },
];

const getMobileAsset = (
  name: "event-star" | "event-connector",
  index: number,
) => {
  const number = String(index + 1).padStart(2, "0");

  return `/agenda/mobile/${name}-${number}.svg`;
};

const mobileSlots: MobileSlot[] = mobileLabelPositions.map((label, index) => ({
  label,
  connector: mobileConnectorPositions[index]!,
  star: mobileStarPositions[index]!,
  starAsset: getMobileAsset("event-star", index),
  connectorAsset: getMobileAsset("event-connector", index),
}));

const mobileDayBadges: Record<AgendaDay, string> = {
  1: "/agenda/mobile/day-1-badge.svg",
  2: "/agenda/mobile/day-2-badge.svg",
};

/* =========================================================
   COMPONENT
   ========================================================= */

const Agenda = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const [activeDay, setActiveDay] = useState<AgendaDay>(1);
  const [isInView, setIsInView] = useState(
    () =>
      typeof window !== "undefined" && !("IntersectionObserver" in window),
  );

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.2,
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  const selectDay = (day: AgendaDay) => {
    setActiveDay(day);
  };

  const alternateDay: AgendaDay = activeDay === 1 ? 2 : 1;

  return (
    <section
      ref={sectionRef}
      className={`agenda${isInView ? " agenda--revealed" : ""}`}
      id="agenda"
    >
      {/* =================================================
          DESKTOP
          ================================================= */}

      <div className="agenda__desktop">
        <div className="agenda__desktop-canvas">
          <h2 className="agenda__title">AGENDA</h2>

          <img
            className="agenda__desktop-path"
            src="/agenda/desktop/timeline-path.svg"
            alt=""
            aria-hidden="true"
          />

          <button
            type="button"
            className={`agenda__desktop-day agenda__desktop-day--active-slot agenda__desktop-day--${activeDay === 1 ? "yellow" : "blue"}`}
            onClick={() => selectDay(activeDay)}
            aria-pressed={true}
            aria-label={`Dan ${activeDay} je trenutno prikazan`}
          >
            <img
              src={
                activeDay === 1
                  ? "/agenda/shared/day-1-badge.svg"
                  : "/agenda/shared/day-2-marker.svg"
              }
              alt=""
              aria-hidden="true"
            />
            <span>DAN {activeDay}</span>
          </button>

          <button
            type="button"
            className={`agenda__desktop-day agenda__desktop-day--inactive-slot agenda__desktop-day--${alternateDay === 1 ? "yellow" : "blue"}`}
            onClick={() => selectDay(alternateDay)}
            aria-pressed={false}
            aria-label={`Prikaži agendu za dan ${alternateDay}`}
          >
            <img
              src={
                alternateDay === 1
                  ? "/agenda/shared/day-1-badge.svg"
                  : "/agenda/shared/day-2-marker.svg"
              }
              alt=""
              aria-hidden="true"
            />
            <span>DAN {alternateDay}</span>
          </button>

          {desktopSlots.map((slot, index) => {
            const { connector, label, star, starAsset } = slot;
            const item = agendaByDay[activeDay][index]!;
            const labelVerticalPosition =
              label.placement === "top"
                ? {
                    bottom: `calc(${100 - connector.y}% + var(--agenda-connector-label-gap))`,
                  }
                : {
                    top: `calc(${connector.y + connector.height}% + var(--agenda-connector-label-gap))`,
                  };

            return (
              <article
                key={`desktop-slot-${activeDay}-${item.id}`}
                className="agenda__desktop-slot"
              >
                <span
                  className={`agenda__desktop-connector agenda__desktop-connector--${connector.dot}`}
                  style={{
                    left: `${connector.x}%`,
                    top: `${connector.y}%`,
                    height: `${connector.height}%`,
                    animationDelay: `${index * 55}ms`,
                  }}
                  aria-hidden="true"
                />

                <img
                  className="agenda__desktop-star"
                  src={starAsset}
                  alt=""
                  aria-hidden="true"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: `${star.width}%`,
                    height: `${star.height}%`,
                  }}
                />

                <div
                  className={`agenda__desktop-event-label agenda__desktop-event-label--${label.placement}`}
                  style={{
                    left: `${label.x}%`,
                    width: `${label.labelWidth ?? 12.3}%`,
                    textAlign: label.textAlign ?? "left",
                    animationDelay: `${index * 55 + 125}ms`,
                    ...labelVerticalPosition,
                  }}
                >
                  <time className="agenda__event-time">{item.time}</time>
                  <p className="agenda__event-title">{item.title}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* =================================================
          MOBILE
          ================================================= */}

      <div className="agenda__mobile">
        <div className="agenda__mobile-canvas">
          <h2 className="agenda__title">AGENDA</h2>

          <img
            className="agenda__mobile-path"
            src="/agenda/mobile/timeline-path.svg"
            alt=""
            aria-hidden="true"
          />

          <button
            type="button"
            className="agenda__mobile-current-day"
            onClick={() => selectDay(activeDay)}
            aria-pressed={true}
            aria-label={`Dan ${activeDay} je trenutno prikazan`}
          >
            <img src={mobileDayBadges[activeDay]} alt="" aria-hidden="true" />
            <span>DAN {activeDay}</span>
          </button>

          {mobileSlots.map((slot, index) => {
            const {
              connector,
              connectorAsset,
              label: labelPosition,
              star,
              starAsset,
            } = slot;
            const item = agendaByDay[activeDay][index]!;
            const starCenterX = star.x + star.width / 2;
            const comesFromLeft = starCenterX <= labelPosition.x;

            return (
              <article
                key={`mobile-slot-${activeDay}-${item.id}`}
                className="agenda__mobile-slot"
              >
                <img
                  className="agenda__mobile-star"
                  src={starAsset}
                  alt=""
                  aria-hidden="true"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: `${star.width}%`,
                  }}
                />

                <img
                  className="agenda__mobile-connector"
                  src={connectorAsset}
                  alt=""
                  aria-hidden="true"
                  style={{
                    left: `${connector.x}%`,
                    top: `${connector.y}%`,
                    transformOrigin: comesFromLeft
                      ? "left center"
                      : "right center",
                    animationDelay: `${index * 55}ms`,
                  }}
                />

                <div
                  className={`agenda__mobile-event-label ${
                    comesFromLeft
                      ? "agenda__mobile-event-label--from-left"
                      : "agenda__mobile-event-label--from-right"
                  }`}
                  style={{
                    left: `${labelPosition.x}%`,
                    top: `calc(${labelPosition.y}% + ${labelPosition.labelOffsetY ?? 0}%)`,
                    animationDelay: `${index * 55 + 125}ms`,
                  }}
                >
                  <time className="agenda__event-time">{item.time}</time>
                  <p className="agenda__event-title">{item.title}</p>
                </div>
              </article>
            );
          })}

          <div
            className="agenda__mobile-next-day-marker"
            aria-hidden="true"
          >
            <img
              src={mobileDayBadges[alternateDay]}
              alt=""
              aria-hidden="true"
            />
            <span>DAN {alternateDay}</span>
          </div>

          <button
            type="button"
            className="agenda__day-switch"
            onClick={() => selectDay(alternateDay)}
            aria-pressed={false}
            aria-label={`Prikaži dan ${alternateDay}`}
          >
            <img
              src="/agenda/mobile/day-2-marker.svg"
              alt=""
              aria-hidden="true"
            />
            <span>DAN {alternateDay}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Agenda;
