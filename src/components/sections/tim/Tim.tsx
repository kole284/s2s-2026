import { useId, useState } from "react";
import "./Tim.scss";
type Team = {
  id: string;
  label: string;
  titlePrefix: string;
  titleFirstLine: string;
  titleSecondLine: string;
  image: string;
  coordinator: {
    firstName: string;
    lastName: string;
    image: string;
  };
};

const TEAMS: Team[] = [
  {
    id: "koordinatori",
    label: "KT",
    titlePrefix: "Tim",
    titleFirstLine: "koordinatora",
    titleSecondLine: "",
    image: "/tim/koordinator-team.JPG",
    coordinator: {
      firstName: "Stefan",
      lastName: "Mrkela",
      image: "/tim/koordinator.png",
    },
  },
  {
    id: "dizajn",
    label: "DT",
    titlePrefix: "Tim za",
    titleFirstLine: "dizajn",
    titleSecondLine: "",
    image: "/tim/IT-team.jpg",
    coordinator: {
      firstName: "Stefan",
      lastName: "Petrović",
      image: "/tim/IT.png",
    },
  },
  {
    id: "it",
    label: "IT",
    titlePrefix: "Tim za",
    titleFirstLine: "informacione",
    titleSecondLine: "tehnologije",
    image: "/tim/IT-team.jpg",
    coordinator: {
      firstName: "Nikola",
      lastName: "Kostić",
      image: "/tim/IT.png",
    },
  },
  {
    id: "cr",
    label: "CR",
    titlePrefix: "Tim za",
    titleFirstLine: "odnose",
    titleSecondLine: "sa kompanijama",
    image: "/tim/IT-team.jpg",
    coordinator: {
      firstName: "Iva",
      lastName: "Vukoičić",
      image: "/tim/IT.png",
    },
  },
  {
    id: "hr",
    label: "HR",
    titlePrefix: "Tim za",
    titleFirstLine: "ljudske",
    titleSecondLine: "resurse",
    image: "/tim/IT-team.jpg",
    coordinator: {
      firstName: "Milena",
      lastName: "Rodić",
      image: "/tim/IT.png",
    },
  },
  {
    id: "pr",
    label: "PR",
    titlePrefix: "Tim za",
    titleFirstLine: "odnose",
    titleSecondLine: "s javnošću",
    image: "/tim/IT-team.jpg",
    coordinator: {
      firstName: "Damnjan",
      lastName: "Ilić",
      image: "/tim/IT.png",
    },
  },
  {
    id: "log",
    label: "LT",
    titlePrefix: "Tim za",
    titleFirstLine: "logistiku",
    titleSecondLine: "",
    image: "/tim/IT-team.jpg",
    coordinator: {
      firstName: "Angelina",
      lastName: "Spasić",
      image: "/tim/IT.png",
    },
  },
];
const COORDINATOR_FRAME_PATH = `
  M0 297.39
  L30.4236 260.882
  V206.88
  L44.8748 181.02
  L52.4807 149.836
  L94.3131 135.385
  L127.779 117.891
  L111.807 80.6225
  L104.201 54.7624
  L111.807 23.5783
  L127.779 7.60589
  L184.823 0
  L203.077 7.60589
  L225.134 47.9171
  L216.768 64.6501
  L225.134 117.891
  L238.064 135.385
  L272.291 141.47
  L283.7 167.33
  L308.039 191.669
  L301.954 216.768
  L292.827 241.107
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

  const [activeTeamIndex, setActiveTeamIndex] = useState(0);

  const activeTeam = TEAMS[activeTeamIndex]!;
  const hasMultipleTeams = TEAMS.length > 1;

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

      <div className="team-stage">
        <div className="team-ribbon" aria-hidden="true">
          <div className="team-ribbon-track">
            {[0, 1].map((copy) => (
              <div className="team-ribbon-group" key={copy}>
                <div className="team-ribbon-labels">
                  {Array.from({ length: 10 }, (_, index) => (
                    <span key={index}>{activeTeam.label}</span>
                  ))}
                </div>

                <img
                  className="team-ribbon-decoration"
                  src="/tim/decorative-text.svg"
                  alt=""
                />

                <img
                  className="team-ribbon-decoration team-ribbon-decoration-second"
                  src="/tim/decorative-text.svg"
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>

        <div className="team-lightnings" aria-hidden="true">
          <img
            className="team-circle-solid"
            src="/tim/circle-solid.svg"
            alt=""
          />

          <img
            className="team-lightning team-lightning-left"
            src="/tim/lightning-left.svg"
            alt=""
          />

          <img
            className="team-lightning team-lightning-between"
            src="/tim/lightning-between-cards.svg"
            alt=""
          />

          <img
            className="team-lightning team-lightning-right-small"
            src="/tim/lightning-right-small.svg"
            alt=""
          />

          <img
            className="team-lightning team-lightning-right-large"
            src="/tim/lightning-right-large.svg"
            alt=""
          />
        </div>
        <div className="team-content">
          <div className="team-coordinator">
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
              viewBox="0 0 485 298"
              role="img"
              aria-label={`Koordinator — ${activeTeam.coordinator.firstName} ${activeTeam.coordinator.lastName}`}
            >
              <defs>
                <clipPath id={coordinatorClipId} clipPathUnits="userSpaceOnUse">
                  <path
                    d={COORDINATOR_FRAME_PATH}
                    transform="translate(17.1893 14.8695) scale(0.9)"
                  />
                </clipPath>
              </defs>

              <path
                className="team-coordinator-frame"
                d={COORDINATOR_FRAME_PATH}
              />

              <image
                href={activeTeam.coordinator.image}
                x="36"
                y="15"
                width="257.749"
                height="257.749"
                preserveAspectRatio="xMidYMin meet"
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
