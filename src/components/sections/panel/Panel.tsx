import { useLayoutEffect, useRef, useState } from 'react';
import arrow from '@/assets/panel/arrow.svg';
import microphone from '@/assets/panel/microphone.svg';
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

const PANEL_CANVAS_WIDTH = 1440;
const PANEL_CANVAS_HEIGHT = 1024;
const MIN_PANEL_COMPRESSION = 0.52;

const updatePanelViewportVariables = (section: HTMLElement) => {
  const effectiveHeight = Math.max(window.innerHeight, PANEL_CANVAS_HEIGHT);
  const scale = effectiveHeight / PANEL_CANVAS_HEIGHT;
  const visibleWidth = window.innerWidth / scale;
  const compression = Math.min(1, Math.max(MIN_PANEL_COMPRESSION, visibleWidth / PANEL_CANVAS_WIDTH));
  const crop = Math.max(0, (PANEL_CANVAS_WIDTH - visibleWidth) / 2);
  const stageBlueWidth = visibleWidth + PANEL_CANVAS_WIDTH;

  const variables: Record<string, string> = {
    '--panel-scale': `${scale}`,
    '--panel-canvas-half-width': `${PANEL_CANVAS_WIDTH * scale / 2}px`,
    '--panel-visible-width': `${visibleWidth}px`,
    '--panel-compression': `${compression}`,
    '--panel-crop': `${crop}px`,
    '--panel-featured-top': `${430 * (1 - compression)}px`,
    '--panel-panelists-top': `${532 - 149 * compression}px`,
    '--panel-panelists-left': `${crop + visibleWidth * 0.429}px`,
    '--panel-title-left': `${PANEL_CANVAS_WIDTH / 2 + 72 * compression}px`,
    '--panel-title-size': `${48 + 24 * compression}px`,
    '--panel-question-left': `${PANEL_CANVAS_WIDTH / 2 - 157 * compression}px`,
    '--panel-question-width': `${visibleWidth * 0.57}px`,
    '--panel-question-size': `${48 * compression}px`,
    '--panel-description-left': `${PANEL_CANVAS_WIDTH / 2 - 74.88 * compression}px`,
    '--panel-description-width': `${596 * compression}px`,
    '--panel-description-size': `${16 + 6 * compression}px`,
    '--panel-question-mark-left': `${crop + visibleWidth - 236 * compression}px`,
    '--panel-question-mark-width': `${236 * compression}px`,
    '--panel-question-mark-height': `${274 * compression}px`,
    '--panel-stage-blue-left': `${crop + visibleWidth * 0.429 - 142.56 * compression}px`,
    '--panel-stage-blue-width': `${stageBlueWidth}px`,
    '--panel-stage-blue-top-right': `${388.41 - 0.1060829 * stageBlueWidth}px`,
  };

  Object.entries(variables).forEach(([name, value]) => section.style.setProperty(name, value));
  section.toggleAttribute('data-panel-compressed', visibleWidth <= PANEL_CANVAS_WIDTH);
  section.toggleAttribute('data-panel-blue-compressed', visibleWidth <= 1439);
};

const PanelistVisual = ({ panelist, featured = false, className = '' }: { panelist: Panelist; featured?: boolean; className?: string }) => (
  <div className={`panel-panelist-visual${featured ? ' panel-panelist-visual--featured' : ''}${className ? ` ${className}` : ''}`}>
    <img className="panel-panelist-picture" src={panelist.picture} alt={panelist.name} draggable={false} />
    <img className="panel-panelist-outline" src={panelist.outline} alt="" draggable={false} />
  </div>
);

const SelectedPanelistCard = ({ panelist, previousPanelist, nextPanelist, onPrevious, onNext }: SelectedPanelistCardProps) => (
  <div className="panel-featured">
    <div className="panel-adjacent-panelists" aria-hidden="true">
      <PanelistVisual panelist={previousPanelist} className="panel-adjacent-panelist panel-adjacent-panelist--left" />
      <PanelistVisual panelist={nextPanelist} className="panel-adjacent-panelist panel-adjacent-panelist--right" />
    </div>
    <div className="panel-flame-circle" />
    <img className="panel-spark panel-spark--desktop" src={panelSparkDesktop} alt="" draggable={false} />
    <img className="panel-spark panel-spark--mobile" src={panelSparkMobile} alt="" draggable={false} />
    <PanelistVisual panelist={panelist} featured />
    <div className="panel-featured-separator" />
    <div className="panel-featured-plaque-composition">
      <div className="panel-featured-name-area">
        <h3 className="panel-featured-name">{panelist.name}</h3>
      </div>
      <div className="panel-featured-role-area">
        <span className="panel-featured-role">Panelista</span>
      </div>
    </div>
    <img className="panel-microphone" src={microphone} alt="" draggable={false} />

    <button className="panel-arrow panel-arrow--previous" type="button" onClick={onPrevious} aria-label="Previous panelist">
      <img src={arrow} alt="" draggable={false} />
    </button>
    <button className="panel-arrow panel-arrow--next" type="button" onClick={onNext} aria-label="Next panelist">
      <img src={arrow} alt="" draggable={false} />
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
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const update = () => updatePanelViewportVariables(section);

    update();
    window.addEventListener('resize', update);
    window.visualViewport?.addEventListener('resize', update);

    return () => {
      window.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('resize', update);
    };
  }, []);

  const selectPrevious = () => {
    setSelectedIndex((currentIndex) => (currentIndex + 1) % PANELISTS.length);
  };

  const selectNext = () => {
    setSelectedIndex((currentIndex) => (currentIndex - 1 + PANELISTS.length) % PANELISTS.length);
  };

  const remainingPanelists = PANELISTS.map((_, offset) => PANELISTS[(selectedIndex + offset + 1) % PANELISTS.length]).slice(0, 4);

  return (
    <section className="panel-section" ref={sectionRef} aria-labelledby="panel-title">
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
        <img className="panel-question-mark" src={questionMark} alt="" draggable={false} />
      </div>
    </section>
  );
};

export default Panel;
