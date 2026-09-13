import {
  type Dispatch,
  type SetStateAction,
  type TransitionEvent,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";

import "./OProjektu.scss";

import arrowBlue from "@/assets/o-projektu/o-projektu-arrow-blue.svg";
import arrowWhite from "@/assets/o-projektu/o-projektu-arrow-white.svg";
import computer from "@/assets/o-projektu/o-projektu-computer.svg";
import mobileComputer from "@/assets/o-projektu/o-projektu-mobile-computer.svg";
import mobileStudents from "@/assets/o-projektu/o-projektu-mobile-students.svg";
import mobileTeacher from "@/assets/o-projektu/o-projektu-mobile-teacher.svg";
import mobileZigzag from "@/assets/o-projektu/o-projektu-mobile-blue-zigzag.svg";
import students from "@/assets/o-projektu/o-projektu-students.svg";
import teacher from "@/assets/o-projektu/o-projektu-teacher.svg";
import titleFonis from "@/assets/o-projektu/o-projektu-title-fonis.svg";
import titleStudents from "@/assets/o-projektu/o-projektu-title-students.svg";
import zigzag from "@/assets/o-projektu/o-projektu-zigzag.svg";

const studentDescription =
  "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum.";

const fonisDescription =
  "Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.";

const toggleCopy = (
  copy: HTMLDivElement | null,
  expanded: boolean,
  setExpanded: Dispatch<SetStateAction<boolean>>,
  setAnimating: Dispatch<SetStateAction<boolean>>,
) => {
  if (!copy) return;

  const nextExpanded = !expanded;
  copy.style.height = `${copy.getBoundingClientRect().height}px`;
  setAnimating(true);
  flushSync(() => setExpanded(nextExpanded));

  void copy.offsetHeight;
  requestAnimationFrame(() => {
    copy.style.height = nextExpanded
      ? `${copy.scrollHeight}px`
      : "var(--o-projektu-copy-collapsed-height)";
  });
};

const OProjektu = () => {
  const [studentsExpanded, setStudentsExpanded] = useState(false);
  const [studentsAnimating, setStudentsAnimating] = useState(false);
  const [fonisExpanded, setFonisExpanded] = useState(false);
  const [fonisAnimating, setFonisAnimating] = useState(false);
  const studentsCopyRef = useRef<HTMLDivElement>(null);
  const fonisCopyRef = useRef<HTMLDivElement>(null);

  const finishTransition = (
    event: TransitionEvent<HTMLDivElement>,
    setAnimating: Dispatch<SetStateAction<boolean>>,
  ) => {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== "height"
    ) {
      return;
    }

    event.currentTarget.style.height = "";
    setAnimating(false);
  };

  return (
    <section className="o-projektu" id="o-projektu">
      <div
        className={`o-projektu-white-stage${studentsExpanded ? " is-expanded" : ""}${studentsAnimating ? " is-animating" : ""}`}
      >
        <div className="o-projektu-design-space o-projektu-white-design">
          <div className="o-projektu-students-content">
            <h2 className="o-projektu-title o-projektu-students-title">
              <span className="o-projektu-sr-only">Studenti studentima</span>
              <img
                src={titleStudents}
                alt=""
                aria-hidden="true"
                draggable={false}
              />
            </h2>

            <div
              ref={studentsCopyRef}
              id="o-projektu-students-copy"
              className="o-projektu-copy o-projektu-students-copy"
              onTransitionEnd={(event) =>
                finishTransition(event, setStudentsAnimating)
              }
            >
              <p>{studentDescription}</p>
              <p>{fonisDescription}</p>
            </div>
          </div>

          <div className="o-projektu-white-illustration" aria-hidden="true">
            <img
              className="o-projektu-teacher"
              src={teacher}
              alt=""
              draggable={false}
            />
            <img
              className="o-projektu-students"
              src={students}
              alt=""
              draggable={false}
            />

            <img
              className="o-projektu-mobile-teacher"
              src={mobileTeacher}
              alt=""
              draggable={false}
            />
            <img
              className="o-projektu-mobile-students"
              src={mobileStudents}
              alt=""
              draggable={false}
            />
          </div>

          <button
            className="o-projektu-arrow-button o-projektu-arrow-top"
            type="button"
            aria-expanded={studentsExpanded}
            aria-controls="o-projektu-students-copy"
            aria-label={
              studentsExpanded
                ? "Sakrij tekst o studentima"
                : "Prikaži ceo tekst o studentima"
            }
            onClick={() =>
              toggleCopy(
                studentsCopyRef.current,
                studentsExpanded,
                setStudentsExpanded,
                setStudentsAnimating,
              )
            }
          >
            <img src={arrowBlue} alt="" aria-hidden="true" draggable={false} />
          </button>
        </div>
      </div>

      <div
        className={`o-projektu-blue-stage${fonisExpanded ? " is-expanded" : ""}${fonisAnimating ? " is-animating" : ""}`}
      >
        <div className="o-projektu-zigzag" aria-hidden="true">
          <img
            className="o-projektu-zigzag-image o-projektu-zigzag-image--desktop"
            src={zigzag}
            alt=""
            draggable={false}
          />
          <img
            className="o-projektu-zigzag-image o-projektu-zigzag-image--mobile"
            src={mobileZigzag}
            alt=""
            draggable={false}
          />
        </div>

        <div className="o-projektu-design-space o-projektu-blue-design">
          <img
            className="o-projektu-computer"
            src={computer}
            alt=""
            aria-hidden="true"
            draggable={false}
          />
          <img
            className="o-projektu-mobile-computer"
            src={mobileComputer}
            alt=""
            aria-hidden="true"
            draggable={false}
          />

          <div className="o-projektu-fonis-content">
            <h2 className="o-projektu-title o-projektu-fonis-title">
              <span className="o-projektu-sr-only">FONIS</span>
              <img
                src={titleFonis}
                alt=""
                aria-hidden="true"
                draggable={false}
              />
            </h2>

            <div
              ref={fonisCopyRef}
              id="o-projektu-fonis-copy"
              className="o-projektu-copy o-projektu-fonis-copy"
              onTransitionEnd={(event) =>
                finishTransition(event, setFonisAnimating)
              }
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
            aria-label={
              fonisExpanded
                ? "Sakrij tekst o FONIS-u"
                : "Prikaži ceo tekst o FONIS-u"
            }
            onClick={() =>
              toggleCopy(
                fonisCopyRef.current,
                fonisExpanded,
                setFonisExpanded,
                setFonisAnimating,
              )
            }
          >
            <img src={arrowWhite} alt="" aria-hidden="true" draggable={false} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default OProjektu;
