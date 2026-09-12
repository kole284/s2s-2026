import "./Tim.scss";

const Tim = () => {
  return (
    <section className="team-section" id="tim" aria-label="Organizacioni tim">
      <div className="team-decorations" aria-hidden="true">
        <img
          className="team-circle-striped"
          src="/tim/circle-striped.svg"
          alt=""
        />

        <img className="team-circle-solid" src="/tim/circle-solid.svg" alt="" />
      </div>

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

      <img className="team-star team-star-top" src="/tim/star-03.svg" alt="" />

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
    </section>
  );
};

export default Tim;
