import "./Tim.scss";

const Tim = () => {
  return (
    <section className="team-section" id="tim" aria-label="Organizacioni tim">
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
