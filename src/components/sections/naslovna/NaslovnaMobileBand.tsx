const bandText = 'S2'.repeat(12);

const NaslovnaMobileBand = () => {
  return (
    <div className="naslovna-mobile-band" aria-hidden="true">
      <div className="naslovna-mobile-band-shape" />
      <div className="naslovna-mobile-band-text">{bandText}</div>
    </div>
  );
};

export default NaslovnaMobileBand;
