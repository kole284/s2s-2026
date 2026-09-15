import "./Partneri.scss";

type HexagonProps = {
  image: string;
  name: string;
  filled?: boolean;
  className?: string;
};

const Hexagon = ({
  image,
  name,
  filled = true,
  className = "",
}: HexagonProps) => {
  const classes = [
    "hexagon",
    filled ? "hexagon-filled" : "hexagon-outline",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <div className="hexagon-inner">
        <img className="partner-logo" src={image} alt={name} />
      </div>
    </div>
  );
};


const Partneri = () => {
  return (
    <section>
      <div className="partneri-page">
        {/* NASLOV */}
        <header className="partneri-header">
          <h1>PARTNERI</h1>
        </header>

        {/* POKROVITELJ PROJEKTA */}
        <section className="partner-section sponsor-section">
          <div className="section-content sponsor-content">
            <h2>POKROVITELJ</h2>

            <div className="sponsor-emblem">
              <img
                className="sponsor-mobile-crown"
                src="/crtezi/kruna.svg"
                alt=""
                aria-hidden="true"
              />

              <Hexagon  image="/gng.JPG" name="GNG" className="hexagon--animated hexagon--large" />
            </div>

            <h2>PROJEKTA</h2>
          </div>
          <div className="partner-illustration-window" aria-hidden="true">
            <div className="partner-illustration-position">
              <img
                src="/crtezi/kruna.svg"
                className="illustration illustration-project"
                alt=""
              />
            </div>
          </div>
        </section>

        {/* GODIŠNJI */}
        <section className="partner-section annual-section">
          <div className="section-content">
            <h2>GODIŠNJI</h2>

            <div className="partner-hexagon-list">
              <div className="hexagon-row left">
                <Hexagon  image="/gng.JPG" name="GNG" /> 
                <Hexagon  image="/gng.JPG" name="GNG" /> 
                <Hexagon   image="/gng.JPG" name="GNG" />
              </div>

              <div className="hexagon-row right">
                <Hexagon  image="/gng.JPG" name="GNG" />
                <Hexagon  image="/gng.JPG" name="GNG" />
                <Hexagon  image="/gng.JPG" name="GNG" />
              </div>
            </div>
          </div>
          <div className="partner-illustration-window" aria-hidden="true">
            <img
              src="/crtezi/kalendar.svg"
              className="illustration illustration-left"
              alt=""
            />
          </div>
        </section>

        {/* FINANSIJSKI */}
        <section className="partner-section financial-section">
          <div className="section-content">
            <h2>FINANSIJSKI</h2>

            <div className="partner-hexagon-list">
              <div className="hexagon-row left">
                <Hexagon  image="/gng.JPG" name="GNG"  filled={false} />
                <Hexagon  image="/gng.JPG" name="GNG"  filled={false} />
                <Hexagon  image="/gng.JPG" name="GNG"  filled={false} />
              </div>

              <div className="hexagon-row right">
                <Hexagon  image="/gng.JPG" name="GNG" filled={false} />
                <Hexagon  image="/gng.JPG" name="GNG" filled={false} />
                <Hexagon  image="/gng.JPG" name="GNG" filled={false} />
              </div>
            </div>
          </div>
          <div className="partner-illustration-window" aria-hidden="true">
            <div className="partner-illustration-position">
              <img
                src="/crtezi/rukovanje.svg"
                className="illustration illustration-handshake"
                alt=""
              />
            </div>
          </div>
        </section>

        {/* ROBNI */}
        <section className="partner-section goods-section">
          <div className="section-content">
            <h2>ROBNI</h2>

            <div className="partner-hexagon-list">
              <div className="hexagon-row left">
                <Hexagon image="/gng.JPG" name="GNG" />
                <Hexagon image="/gng.JPG" name="GNG"/>
                <Hexagon image="/gng.JPG" name="GNG"/>
              </div>

              <div className="hexagon-row right">
                <Hexagon image="/gng.JPG" name="GNG"/>
                <Hexagon image="/gng.JPG" name="GNG"/>
                <Hexagon image="/gng.JPG" name="GNG"/>
              </div>
            </div>
          </div>
          <div className="partner-illustration-window" aria-hidden="true">
            <img
              src="/crtezi/limenka.svg"
              className="illustration illustration-left"
              alt=""
            />
          </div>
        </section>

        {/* MEDIJSKI */}
        <section className="partner-section media-section">
          <div className="section-content">
            <h2>MEDIJSKI</h2>

            <div className="partner-hexagon-list">
              <div className="hexagon-row left">
                <Hexagon image="/gng.JPG" name="GNG" filled={false} />
                <Hexagon image="/gng.JPG" name="GNG" filled={false} />
                <Hexagon image="/gng.JPG" name="GNG" filled={false} />
              </div>

              <div className="hexagon-row right">
                <Hexagon image="/gng.JPG" name="GNG" filled={false} />
                <Hexagon image="/gng.JPG" name="GNG" filled={false} />
                <Hexagon image="/gng.JPG" name="GNG" filled={false} />
              </div>
            </div>
          </div>
          <div className="partner-illustration-window" aria-hidden="true">
            <div className="partner-illustration-position">
              <img
                src="/crtezi/kamera.svg"
                className="illustration illustration-right"
                alt=""
              />
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Partneri;
