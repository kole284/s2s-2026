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

const studentDescription = (
  <>
    <strong>Studenti studentima</strong> je tradicionalni projekat organizacije
    <strong> FONIS</strong>, namenjen svima koji žele da unaprede svoja znanja iz
    oblasti <strong>IT-a, menadžmenta i dizajna</strong>. Projekat već godinama
    okuplja studente koji žele da uče jedni od drugih kroz niz zanimljivih i
    interaktivnih <strong>radionica</strong> koje vode upravo njihove
    <strong> kolege sa viših godina</strong>. Kroz praktičan rad i primere iz
    stvarnog života, učesnici imaju priliku da nauče nešto novo, prošire vidike
    i inspirišu se za dalji razvoj. Osim <strong>radionica</strong>, deo projekta
    je i <strong>panel diskusija</strong> na kojoj
    <strong> stručnjaci iz industrije</strong> dele svoja iskustva, savete i put
    karijere, pružajući studentima uvid u realne izazove i prilike koje ih
    očekuju.
  </>
);

const fonisDescription = (
  <>
    Kao i svake godine, <strong>FONIS</strong> kroz ovaj projekat potvrđuje svoju
    misiju da povezuje studente i svet IT-a. Već dugi niz godina, organizacija
    okuplja ambiciozne studente Fakulteta organizacionih nauka koji žele da
    naprave svoje prve korake u oblasti informacionih tehnologija. Kroz
    <strong> radionice, seminare, hakatone i predavanja</strong>,
    <strong> FONIS</strong> članovima i učesnicima omogućava da razviju veštine,
    steknu iskustvo i izgrade mrežu kontakata koji su ključni za njihov
    <strong> lični i profesionalni napredak</strong>. Sa više od
    <strong> 100 aktivnih članova</strong> i širokom mrežom
    <strong> alumni zajednice</strong>, <strong>FONIS</strong> ostaje simbol
    inicijative, znanja i timskog duha među studentima Fakulteta organizacionih
    nauka.
  </>
);

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
