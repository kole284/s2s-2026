import { useState } from 'react';
import arrow from '@/assets/panel/arrow.svg';
import microphone from '@/assets/panel/microphone.svg';
import panelPlaqueDesktop from '@/assets/panel/panel-plaque-desktop.svg';
import panelPlaqueMobile from '@/assets/panel/panel-plaque-mobile.svg';
import panelSparkDesktop from '@/assets/panel/panel-spark-desktop.svg';
import panelSparkMobile from '@/assets/panel/panel-spark-mobile.svg';
import placeholderOutline from '@/assets/panel/placeholder-panelist-outline.svg';
import placeholderPanelist from '@/assets/panel/placeholder-panelist.png';
import questionMark from '@/assets/panel/question-mark.svg';
import './Panel.scss';

type Panelist = {
  name: string;
  picture: string;
  outline: string;
};

type SelectedPanelistCardProps = {
  panelist: Panelist;
  previousPanelist: Panelist;
  nextPanelist: Panelist;
  onPrevious: () => void;
  onNext: () => void;
};

type PanelStageProps = Omit<SelectedPanelistCardProps, 'previousPanelist' | 'nextPanelist'> & {
  remainingPanelists: Panelist[];
};

const PANELISTS: Panelist[] = [
  { name: 'Charlie Kirk', picture: placeholderPanelist, outline: placeholderOutline },
  { name: 'Miroljub Petrovic', picture: placeholderPanelist, outline: placeholderOutline },
  { name: 'Moma Kovacevic', picture: placeholderPanelist, outline: placeholderOutline },
  { name: 'Ivan Rados', picture: placeholderPanelist, outline: placeholderOutline },
  { name: 'Gandi', picture: placeholderPanelist, outline: placeholderOutline },
];

const PANEL_DESCRIPTION =
  'They always said that Charlie Kirk was a Nazi, then they celebrated after they killed him.\nThey tried to tell us that black lives matter, and that white people have always been villains.\nThey burnin\' flags in the streets, and they scream at police taking illegals to prison.';

const PanelistVisual = ({ panelist, featured = false, className = '' }: { panelist: Panelist; featured?: boolean; className?: string }) => (
  <div className={`panel-panelist-visual${featured ? ' panel-panelist-visual--featured' : ''}${className ? ` ${className}` : ''}`}>
    <img className="panel-panelist-picture" src={panelist.picture} alt="" />
    <img className="panel-panelist-outline" src={panelist.outline} alt="" />
  </div>
);

const SelectedPanelistCard = ({ panelist, previousPanelist, nextPanelist, onPrevious, onNext }: SelectedPanelistCardProps) => (
  <div className="panel-featured">
    <div className="panel-adjacent-panelists" aria-hidden="true">
      <PanelistVisual panelist={previousPanelist} className="panel-adjacent-panelist panel-adjacent-panelist--left" />
      <PanelistVisual panelist={nextPanelist} className="panel-adjacent-panelist panel-adjacent-panelist--right" />
    </div>
    <div className="panel-flame-circle" />
    <img className="panel-spark panel-spark--desktop" src={panelSparkDesktop} alt="" />
    <img className="panel-spark panel-spark--mobile" src={panelSparkMobile} alt="" />
    <PanelistVisual panelist={panelist} featured />
    <div className="panel-featured-separator" />
    <div className="panel-featured-plaque-composition">
      <img className="panel-featured-plaque panel-featured-plaque--desktop" src={panelPlaqueDesktop} alt="" />
      <img className="panel-featured-plaque panel-featured-plaque--mobile" src={panelPlaqueMobile} alt="" />
      <div className="panel-featured-name-area">
        <h3 className="panel-featured-name">{panelist.name}</h3>
      </div>
      <div className="panel-featured-role-area">
        <span className="panel-featured-role">Panelista</span>
      </div>
    </div>
    <img className="panel-microphone" src={microphone} alt="" />

    <button className="panel-arrow panel-arrow--previous" type="button" onClick={onPrevious} aria-label="Previous panelist">
      <img src={arrow} alt="" />
    </button>
    <button className="panel-arrow panel-arrow--next" type="button" onClick={onNext} aria-label="Next panelist">
      <img src={arrow} alt="" />
    </button>
  </div>
);

const PanelStage = ({ panelist, remainingPanelists, onPrevious, onNext }: PanelStageProps) => (
  <div className="panel-stage">
    <div className="panel-stage-blue" aria-hidden="true" />

    <SelectedPanelistCard
      panelist={panelist}
      previousPanelist={remainingPanelists[remainingPanelists.length - 1]}
      nextPanelist={remainingPanelists[0]}
      onPrevious={onPrevious}
      onNext={onNext}
    />

    <div className="panel-stage-panelists">
      {remainingPanelists.map((remainingPanelist) => (
        <div className="panel-stage-panelist" key={remainingPanelist.name}>
          <PanelistVisual panelist={remainingPanelist} />
          <p className="panel-stage-panelist-name">{remainingPanelist.name}</p>
        </div>
      ))}
    </div>
  </div>
);

const Panel = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectPrevious = () => {
    setSelectedIndex((currentIndex) => (currentIndex + 1) % PANELISTS.length);
  };

  const selectNext = () => {
    setSelectedIndex((currentIndex) => (currentIndex - 1 + PANELISTS.length) % PANELISTS.length);
  };

  const remainingPanelists = PANELISTS.map((_, offset) => PANELISTS[(selectedIndex + offset + 1) % PANELISTS.length]).slice(0, 4);

  return (
    <section className="panel-section" aria-labelledby="panel-title">
      <div className="panel-content">
        <div className="panel-top">
          <h2 className="panel-title" id="panel-title">Panel</h2>
          <p className="panel-question">Da li zapravo nosimo plamen?</p>
        </div>

        <div className="panel-middle">
          <PanelStage panelist={PANELISTS[selectedIndex]} remainingPanelists={remainingPanelists} onPrevious={selectPrevious} onNext={selectNext} />
        </div>

        <div className="panel-bottom">
          <p className="panel-description">
            {PANEL_DESCRIPTION.split("\n").map((line) => <span key={line}>{line}<br /></span>)}
          </p>
        </div>
        <img className="panel-question-mark" src={questionMark} alt="" />
      </div>
    </section>
  );
};

export default Panel;
