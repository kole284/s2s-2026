import './Partneri.scss';

type HexagonProps = {
  filled?: boolean;
  className?: string;
};

const Hexagon = ({ filled = true, className = '' }: HexagonProps) => {
  const classes = ['hexagon', filled ? 'hexagon-filled' : 'hexagon-outline', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <div className="hexagon-inner" />
    </div>
  );
};

const Partneri = () => {
  return <section>
     <div className="partneri-page">

      {/* NASLOV */}
      <header className="partneri-header">
        <h1>PARTNERI</h1>
      </header>


      {/* POKROVITELJ PROJEKTA */}
      <section className="partner-section sponsor-section">
        <div className="section-content sponsor-content">

          <h2>POKROVITELJ</h2>

          <Hexagon className="hexagon--animated hexagon--large" />

          <h2>PROJEKTA</h2>

        </div>

        <img
          src="/crtezi/kruna.svg"
          className="illustration illustration-project"
          alt=""
        />
      </section>


      {/* GODIŠNJI */}
      <section className="partner-section annual-section">
        <div className="section-content">

          <div className="hexagon-row left">
            <Hexagon />
            <Hexagon />
            <Hexagon />
          </div>

          <h2>GODIŠNJI</h2>

          <div className="hexagon-row right">
            <Hexagon />
            <Hexagon />
            <Hexagon />
          </div>

        </div>

        <img
          src="/crtezi/kalendar.svg"
          className="illustration illustration-left"
          alt=""
        />
      </section>


      {/* FINANSIJSKI */}
      <section className="partner-section financial-section">
        <div className="section-content">

          <div className="hexagon-row left">
            <Hexagon filled={false} />
            <Hexagon filled={false} />
            <Hexagon filled={false} />
          </div>

          <h2>FINANSIJSKI</h2>

          <div className="hexagon-row right">
            <Hexagon filled={false} />
            <Hexagon filled={false} />
            <Hexagon filled={false} />
          </div>

        </div>
      </section>


      {/* ROBNI */}
      <section className="partner-section goods-section">
        <div className="section-content">

          <div className="hexagon-row left">
            <Hexagon />
            <Hexagon />
            <Hexagon />
          </div>

          <h2>ROBNI</h2>

          <div className="hexagon-row right">
            <Hexagon />
            <Hexagon />
            <Hexagon />
          </div>

        </div>

        <img
          src="/crtezi/limenka.svg"
          className="illustration illustration-left"
          alt=""
        />
      </section>


      {/* MEDIJSKI */}
      <section className="partner-section media-section">
        <div className="section-content">

          <div className="hexagon-row left">
            <Hexagon filled={false} />
            <Hexagon filled={false} />
            <Hexagon filled={false} />
          </div>

          <h2>MEDIJSKI</h2>

          <div className="hexagon-row right">
            <Hexagon filled={false} />
            <Hexagon filled={false} />
            <Hexagon filled={false} />
          </div>

        </div>

        <img
          src="/crtezi/kamera.svg"
          className="illustration illustration-right"
          alt=""
        />
      </section>

    </div>
  </section>;
};

export default Partneri;
