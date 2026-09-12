import "./Tim.scss";
const TEAM_LABEL = "CR";

const Tim = () => {
  return (
    <section className="team-section" id="tim" aria-label="Organizacioni tim">
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
                    <span key={index}>{TEAM_LABEL}</span>
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
              disabled
            >
              <img src="/tim/arrow-left.svg" alt="" />
            </button>

            <button
              className="team-arrow team-arrow-right"
              type="button"
              aria-label="Sledeći tim"
              disabled
            >
              <img src="/tim/arrow-left.svg" alt="" />
            </button>
            <img
              className="team-coordinator-photo"
              src="/tim/coordinator.png"
              alt="Koordinator tima za odnose sa kompanijama"
            />

            <div className="team-coordinator-caption">
              <p className="team-coordinator-role">Koordinator</p>
            </div>
          </div>

          <div className="team-group">
            <img
              className="team-group-photo"
              src="/tim/team-photo.png"
              alt="Članovi tima za odnose sa kompanijama"
            />

            <div className="team-group-caption">
              <h2 className="team-group-title">
                <span>Tim za </span>
                odnose sa
                <br />
                kompanijama
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tim;
