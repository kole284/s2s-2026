import { useState } from "react";
import "./Agenda.scss";

type AgendaDay = 1 | 2;

interface AgendaEvent {
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

interface DesktopEventPosition extends Position {
  day: AgendaDay;
  eventIndex: number;
}

interface DesktopConnectorPosition extends Position {
  height: number;
  dot: "top" | "bottom";
}

/* =========================================================
   DATA
   Za sada placeholder sadržaj iz Figme.
   Kasnije ovde samo menjamo stvarnu satnicu.
   ========================================================= */

const agendaData: Record<AgendaDay, AgendaEvent[]> = {
  1: [
    {
      id: "day-1-event-1",
      time: "10:15-10:30",
      title: "Check-in",
    },
    {
      id: "day-1-event-2",
      time: "10:15-10:30",
      title: "Check-in",
    },
    {
      id: "day-1-event-3",
      time: "10:15-10:30",
      title: "Check-in",
    },
    {
      id: "day-1-event-4",
      time: "10:15-10:30",
      title: "Check-in",
    },
    {
      id: "day-1-event-5",
      time: "10:15-10:30",
      title: "Check-in",
    },
    {
      id: "day-1-event-6",
      time: "10:15-10:30",
      title: "Check-in",
    },
    {
      id: "day-1-event-7",
      time: "10:15-10:30",
      title: "Check-in",
    },
    {
      id: "day-1-event-8",
      time: "10:15-10:30",
      title: "Check-in",
    },
    {
      id: "day-1-event-9",
      time: "10:15-10:30",
      title: "Check-in",
    },
    {
      id: "day-1-event-10",
      time: "10:15-10:30",
      title: "Check-in",
    },
    {
      id: "day-1-event-11",
      time: "10:15-10:30",
      title: "Check-in",
    },
  ],

  2: [
    {
      id: "day-2-event-1",
      time: "10:15-10:30",
      title: "Check-in",
    },
    {
      id: "day-2-event-2",
      time: "10:15-10:30",
      title: "Check-in",
    },
    {
      id: "day-2-event-3",
      time: "10:15-10:30",
      title: "Check-in",
    },
    {
      id: "day-2-event-4",
      time: "10:15-10:30",
      title: "Check-in",
    },
    {
      id: "day-2-event-5",
      time: "10:15-10:30",
      title: "Check-in",
    },
    {
      id: "day-2-event-6",
      time: "10:15-10:30",
      title: "Check-in",
    },
    {
      id: "day-2-event-7",
      time: "10:15-10:30",
      title: "Check-in",
    },
    {
      id: "day-2-event-8",
      time: "10:15-10:30",
      title: "Check-in",
    },
    {
      id: "day-2-event-9",
      time: "10:15-10:30",
      title: "Check-in",
    },
    {
      id: "day-2-event-10",
      time: "10:15-10:30",
      title: "Check-in",
    },
    {
      id: "day-2-event-11",
      time: "10:15-10:30",
      title: "Check-in",
    },
  ],
};

/* =========================================================
   DESKTOP EVENT LABELS
   Figma frame: 1440 x 1024
   ========================================================= */

const desktopEventPositions: DesktopEventPosition[] = [
  // DAN 1 — donjih 6 događaja
  {
    day: 1,
    eventIndex: 0,
    x: 9.5139,
    y: 67.7734,
  },
  {
    day: 1,
    eventIndex: 1,
    x: 20.9722,
    y: 80.2734,
  },
  {
    day: 1,
    eventIndex: 2,
    x: 34.2361,
    y: 84.1797,
  },
  {
    day: 1,
    eventIndex: 3,
    x: 52.5,
    y: 78.8086,
  },
  {
    day: 1,
    eventIndex: 4,
    x: 70.7639,
    y: 77.5391,
  },
  {
    day: 1,
    eventIndex: 5,
    x: 85.2083,
    y: 68.0664,
  },

  // DAN 2 — gornjih 5 događaja
  {
    day: 2,
    eventIndex: 0,
    x: 79.2361,
    y: 21.9727,
  },
  {
    day: 2,
    eventIndex: 1,
    x: 63.2639,
    y: 23.7305,
  },
  {
    day: 2,
    eventIndex: 2,
    x: 50.2778,
    y: 28.3203,
  },
  {
    day: 2,
    eventIndex: 3,
    x: 35.625,
    y: 37.8906,
  },
  {
    day: 2,
    eventIndex: 4,
    x: 23.75,
    y: 23.6328,
  },
];

/* =========================================================
   DESKTOP YELLOW CONNECTORS
   ========================================================= */

const desktopConnectorPositions: DesktopConnectorPosition[] = [
  // DAN 1 — zvezda -> tekst ispod
  {
    x: 13.88,
    y: 58.11,
    height: 8.451,
    dot: "bottom",
  },
  {
    x: 25.44,
    y: 70.88,
    height: 8.451,
    dot: "bottom",
  },
  {
    x: 38.43,
    y: 75.05,
    height: 8.451,
    dot: "bottom",
  },
  {
    x: 56.52,
    y: 69.1,
    height: 8.451,
    dot: "bottom",
  },
  {
    x: 75.15,
    y: 65.2,
    height: 8.868,
    dot: "bottom",
  },
  {
    x: 89.48,
    y: 57.7,
    height: 8.451,
    dot: "bottom",
  },

  // DAN 2 — tekst iznad -> zvezda
  {
    x: 82.88,
    y: 28.94,
    height: 8.451,
    dot: "top",
  },
  {
    x: 66.93,
    y: 30.18,
    height: 8.451,
    dot: "top",
  },
  {
    x: 53.56,
    y: 35.14,
    height: 8.451,
    dot: "top",
  },
  {
    x: 39.5,
    y: 43.66,
    height: 8.451,
    dot: "top",
  },
  {
    x: 27.64,
    y: 29.82,
    height: 8.451,
    dot: "top",
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

/* =========================================================
   MOBILE
   ========================================================= */

const mobileEventPositions: Position[] = [
  { x: 41.02, y: 20.24 },
  { x: 27.43, y: 26.08 },
  { x: 61.02, y: 31.98 },
  { x: 26.67, y: 38.25 },
  { x: 43.84, y: 44.43 },
  { x: 29.23, y: 50.34 },
  { x: 63.84, y: 55.92 },
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

/* =========================================================
   COMPONENT
   ========================================================= */

const Agenda = () => {
  const [activeDay, setActiveDay] = useState<AgendaDay>(1);

  const nextDay: AgendaDay = activeDay === 1 ? 2 : 1;

  const currentBadge =
    activeDay === 1
      ? "/agenda/mobile/day-1-badge.svg"
      : "/agenda/mobile/day-2-badge.svg";

  const nextBadge =
    nextDay === 1
      ? "/agenda/mobile/day-1-badge.svg"
      : "/agenda/mobile/day-2-badge.svg";

  return (
    <section className="agenda" id="agenda">
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

          <div
            className="agenda__desktop-day agenda__desktop-day--one"
            aria-hidden="true"
          >
            <img src="/agenda/shared/day-1-badge.svg" alt="" />

            <span>DAN 1</span>
          </div>

          <div
            className="agenda__desktop-day agenda__desktop-day--two"
            aria-hidden="true"
          >
            <img src="/agenda/shared/day-2-marker.svg" alt="" />

            <span>DAN 2</span>
          </div>

          {desktopConnectorPositions.map((connector, index) => (
            <span
              key={`desktop-connector-${index}`}
              className={`
                                    agenda__desktop-connector
                                    agenda__desktop-connector--${connector.dot}
                                `}
              style={{
                left: `${connector.x}%`,
                top: `${connector.y}%`,
                height: `${connector.height}%`,
              }}
              aria-hidden="true"
            />
          ))}

          {desktopStarPositions.map((star, index) => (
            <img
              key={`desktop-star-${index}`}
              className="agenda__desktop-star"
              src={desktopStarAssets[index]}
              alt=""
              aria-hidden="true"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.width}%`,
                height: `${star.height}%`,
              }}
            />
          ))}

          {desktopEventPositions.map((slot, index) => {
            const event = agendaData[slot.day][slot.eventIndex];

            return (
              <article
                key={`desktop-event-${index}`}
                className="agenda__desktop-event"
                style={{
                  left: `${slot.x}%`,
                  top: `${slot.y}%`,
                }}
              >
                <time className="agenda__event-time">{event.time}</time>

                <p className="agenda__event-title">{event.title}</p>
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

          <div className="agenda__mobile-current-day" aria-hidden="true">
            <img src={currentBadge} alt="" />

            <span>DAN {activeDay}</span>
          </div>

          {mobileStarPositions.map((star, index) => (
            <img
              key={`mobile-star-${index}`}
              className="agenda__mobile-star"
              src={getMobileAsset("event-star", index)}
              alt=""
              aria-hidden="true"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.width}%`,
              }}
            />
          ))}

          {mobileConnectorPositions.map((connector, index) => (
            <img
              key={`mobile-connector-${index}`}
              className="agenda__mobile-connector"
              src={getMobileAsset("event-connector", index)}
              alt=""
              aria-hidden="true"
              style={{
                left: `${connector.x}%`,
                top: `${connector.y}%`,
              }}
            />
          ))}

          {agendaData[activeDay].map((event, index) => {
            const position = mobileEventPositions[index];

            return (
              <article
                key={event.id}
                className="agenda__mobile-event"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                }}
              >
                <time className="agenda__event-time">{event.time}</time>

                <p className="agenda__event-title">{event.title}</p>
              </article>
            );
          })}

          <button
            type="button"
            className="agenda__day-switch"
            onClick={() => setActiveDay(nextDay)}
            aria-label={`Prikaži dan ${nextDay}`}
          >
            <img src={nextBadge} alt="" aria-hidden="true" />

            <span>DAN {nextDay}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Agenda;
