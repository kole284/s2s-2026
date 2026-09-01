import './OProjektu.scss';

import arrow from '@/assets/o-projektu/o-projektu-arrow.svg';
import classroom from '@/assets/o-projektu/o-projektu-class.svg';
import computer from '@/assets/o-projektu/o-projektu-computer.svg';

const studentDescription =
  'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum.';

const fonisDescription =
  'Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.';

const OProjektu = () => {
  return (
    <section className="o-projektu">
      <div className="o-projektu-content">
        <div className="o-projektu-white-stage">
          <div className="o-projektu-students">
            <h2 className="o-projektu-students-title">
              <span>STUDENTI</span>
              <span>
                STUDENTI<span>MA</span>
              </span>
            </h2>
            <div className="o-projektu-copy o-projektu-students-copy">
              <p>{studentDescription}</p>
              <p>{fonisDescription}</p>
            </div>
          </div>

          <img
            className="o-projektu-classroom"
            src={classroom}
            alt=""
            aria-hidden="true"
          />

          <img
            className="o-projektu-arrow o-projektu-arrow-top"
            src={arrow}
            alt=""
            aria-hidden="true"
          />
        </div>

        <div className="o-projektu-background" aria-hidden="true" />

        <div className="o-projektu-blue-stage">
          <img
            className="o-projektu-computer"
            src={computer}
            alt=""
            aria-hidden="true"
          />

          <div className="o-projektu-fonis">
            <h2>FONIS</h2>
            <div className="o-projektu-copy o-projektu-fonis-copy">
              <p>{studentDescription}</p>
              <p>{fonisDescription}</p>
            </div>
          </div>

          <img
            className="o-projektu-arrow o-projektu-arrow-bottom"
            src={arrow}
            alt=""
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
};

export default OProjektu;
