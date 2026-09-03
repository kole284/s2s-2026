import {
  type Dispatch,
  type SetStateAction,
  type TransitionEvent,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { flushSync } from 'react-dom';

import './OProjektu.scss';

import arrow from '@/assets/o-projektu/o-projektu-arrow.svg';
import classroom from '@/assets/o-projektu/o-projektu-class.svg';
import computer from '@/assets/o-projektu/o-projektu-computer.svg';

const studentDescription =
  'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum.';

const fonisDescription =
  'Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.';

const OProjektu = () => {
  const [studentsExpanded, setStudentsExpanded] = useState(false);
  const [fonisExpanded, setFonisExpanded] = useState(false);
  const [studentsCollapsing, setStudentsCollapsing] = useState(false);
  const [fonisCollapsing, setFonisCollapsing] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const studentsCopyRef = useRef<HTMLDivElement>(null);
  const fonisCopyRef = useRef<HTMLDivElement>(null);
  const studentsStageRef = useRef<HTMLDivElement>(null);
  const fonisStageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const content = contentRef.current;
    const section = sectionRef.current;

    if (!content || !section) return;

    let heightFrame = 0;
    const applyHeight = () => {
      section.style.setProperty('--o-projektu-content-height', `${content.getBoundingClientRect().height}px`);
      heightFrame = 0;
    };
    const updateHeight = () => {
      if (!heightFrame) heightFrame = requestAnimationFrame(applyHeight);
    };
    const observer = new ResizeObserver(updateHeight);

    observer.observe(content);
    window.addEventListener('resize', updateHeight);
    updateHeight();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeight);
      if (heightFrame) cancelAnimationFrame(heightFrame);
    };
  }, []);

  const isExpanded = studentsExpanded || fonisExpanded || studentsCollapsing || fonisCollapsing;

  const getLayoutHeight = (element: HTMLElement) => parseFloat(getComputedStyle(element).height);

  const measureCollapsedHeight = (stage: HTMLDivElement, copyClassName: string) => {
    const clone = stage.cloneNode(true) as HTMLDivElement;
    clone.classList.remove('is-expanded', 'is-collapsing');
    clone.style.position = 'fixed';
    clone.style.visibility = 'hidden';
    clone.style.pointerEvents = 'none';
    clone.style.width = getComputedStyle(stage).width;
    clone.style.inset = '0 auto auto 0';
    contentRef.current?.appendChild(clone);

    const collapsedCopy = clone.querySelector<HTMLElement>(copyClassName);
    if (collapsedCopy) {
      collapsedCopy.style.height = '';
      collapsedCopy.style.transition = '';
    }
    const height = collapsedCopy ? getLayoutHeight(collapsedCopy) : 0;
    clone.remove();
    return height;
  };

  const toggleCopy = (
    expanded: boolean,
    setExpanded: Dispatch<SetStateAction<boolean>>,
    setCollapsing: Dispatch<SetStateAction<boolean>>,
    copy: HTMLDivElement | null,
    stage: HTMLDivElement | null,
    copyClassName: string,
  ) => {
    if (!copy || !stage) return;

    const currentHeight = getLayoutHeight(copy);
    copy.style.transition = 'none';
    copy.style.height = `${currentHeight}px`;

    let targetHeight: number;

    if (expanded) {
      targetHeight = measureCollapsedHeight(stage, copyClassName);
      flushSync(() => {
        setExpanded(false);
        setCollapsing(true);
      });
    } else {
      flushSync(() => setExpanded(true));
      targetHeight = copy.scrollHeight;
    }

    void copy.offsetHeight;
    copy.style.transition = '';
    requestAnimationFrame(() => {
      copy.style.height = `${targetHeight}px`;
    });
  };

  const finishCopyTransition = (
    event: TransitionEvent<HTMLDivElement>,
    collapsing: boolean,
    setCollapsing: Dispatch<SetStateAction<boolean>>,
  ) => {
    if (event.propertyName !== 'height') return;

    if (collapsing) flushSync(() => setCollapsing(false));
    event.currentTarget.style.height = '';
  };

  return (
    <section ref={sectionRef} className={`o-projektu${isExpanded ? ' o-projektu-expanded' : ''}`}>
      <div ref={contentRef} className="o-projektu-content">
        <div
          ref={studentsStageRef}
          className={`o-projektu-white-stage${studentsExpanded || studentsCollapsing ? ' is-expanded' : ''}${studentsCollapsing ? ' is-collapsing' : ''}`}
        >
          <div className="o-projektu-students">
            <h2 className="o-projektu-students-title">
              <span>STUDENTI</span>
              <span>
                STUDENTI<span>MA</span>
              </span>
            </h2>
            <div
              ref={studentsCopyRef}
              id="o-projektu-students-copy"
              className="o-projektu-copy o-projektu-students-copy"
              onTransitionEnd={(event) => finishCopyTransition(event, studentsCollapsing, setStudentsCollapsing)}
            >
              <p>{studentDescription}</p>
              <p>{fonisDescription}</p>
            </div>
          </div>

          <img
            className="o-projektu-classroom"
            src={classroom}
            alt=""
            aria-hidden="true"
            draggable={false}
          />

          <button
            className="o-projektu-arrow-button o-projektu-arrow-top"
            type="button"
            aria-expanded={studentsExpanded}
            aria-controls="o-projektu-students-copy"
            aria-label={studentsExpanded ? 'Sakrij tekst o studentima' : 'Prikaži ceo tekst o studentima'}
            onClick={() =>
              toggleCopy(
                studentsExpanded,
                setStudentsExpanded,
                setStudentsCollapsing,
                studentsCopyRef.current,
                studentsStageRef.current,
                '.o-projektu-students-copy',
              )
            }
          >
            <img className="o-projektu-arrow" src={arrow} alt="" aria-hidden="true" draggable={false} />
          </button>
        </div>

        <div
          ref={fonisStageRef}
          className={`o-projektu-blue-stage${fonisExpanded || fonisCollapsing ? ' is-expanded' : ''}${fonisCollapsing ? ' is-collapsing' : ''}`}
        >
          <div className="o-projektu-background" aria-hidden="true" />
          <img
            className="o-projektu-computer"
            src={computer}
            alt=""
            aria-hidden="true"
            draggable={false}
          />

          <div className="o-projektu-fonis">
            <h2>FONIS</h2>
            <div
              ref={fonisCopyRef}
              id="o-projektu-fonis-copy"
              className="o-projektu-copy o-projektu-fonis-copy"
              onTransitionEnd={(event) => finishCopyTransition(event, fonisCollapsing, setFonisCollapsing)}
            >
              <p>{studentDescription}</p>
              <p>{fonisDescription}</p>
            </div>
          </div>

          <button
            className="o-projektu-arrow-button o-projektu-arrow-bottom"
            type="button"
            aria-expanded={fonisExpanded}
            aria-controls="o-projektu-fonis-copy"
            aria-label={fonisExpanded ? 'Sakrij tekst o FONIS-u' : 'Prikaži ceo tekst o FONIS-u'}
            onClick={() =>
              toggleCopy(
                fonisExpanded,
                setFonisExpanded,
                setFonisCollapsing,
                fonisCopyRef.current,
                fonisStageRef.current,
                '.o-projektu-fonis-copy',
              )
            }
          >
            <img className="o-projektu-arrow" src={arrow} alt="" aria-hidden="true" draggable={false} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default OProjektu;
