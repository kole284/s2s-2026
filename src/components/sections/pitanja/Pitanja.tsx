import { useState } from "react";
import "./Pitanja.scss";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    id: 1,
    question: "Da li je Stefanov tata stvarno iz Rumunije?",
    answer: "da.",
  },
  {
    id: 2,
    question: "Da li je Stefanov tata stvarno iz Rumunije?",
    answer: "da.",
  },
  {
    id: 3,
    question: "Da li je Stefanov tata stvarno iz Rumunije?",
    answer: "da.",
  },
  {
    id: 4,
    question: "Da li je Stefanov tata stvarno iz Rumunije?",
    answer: "da.",
  },
  {
    id: 5,
    question: "Da li je Stefanov tata stvarno iz Rumunije?",
    answer: "da.",
  },
];

const getInitialOpenIndex = () => {
  if (typeof window === "undefined") {
    return 2;
  }

  return window.matchMedia("(max-width: 768px)").matches ? 3 : 2;
};

const Pitanja = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(
    getInitialOpenIndex,
  );

  const toggleQuestion = (index: number) => {
    setOpenIndex((currentIndex) => (currentIndex === index ? null : index));
  };

  const renderQuestions = (items: FaqItem[]) =>
    items.map((item, index) => {
      const isOpen = openIndex === index;
      const answerId = `pitanja-answer-${item.id}`;

      return (
        <article
          key={item.id}
          className={`pitanja__faq-item${
            isOpen ? " pitanja__faq-item--open" : ""
          }`}
        >
          <button
            type="button"
            className="pitanja__question"
            onClick={() => toggleQuestion(index)}
            aria-expanded={isOpen}
            aria-controls={answerId}
          >
            <img
              className="pitanja__question-outline"
              src="/pitanja/question-outline.svg"
              alt=""
              aria-hidden="true"
            />

            <span className="pitanja__question-text">{item.question}</span>

            <img
              className="pitanja__arrow"
              src="/pitanja/accordion-arrow.svg"
              alt=""
              aria-hidden="true"
            />
          </button>

          <div
            id={answerId}
            className={`pitanja__answer-wrapper${
              isOpen ? " pitanja__answer-wrapper--open" : ""
            }`}
            aria-hidden={!isOpen}
          >
            <div className="pitanja__answer">
              <img
                className="pitanja__answer-outline"
                src="/pitanja/answer-outline.svg"
                alt=""
                aria-hidden="true"
              />

              <p className="pitanja__answer-text">{item.answer}</p>
            </div>
          </div>
        </article>
      );
    });

  return (
    <section className="pitanja" id="pitanja">
      <img
        className="pitanja__left-zigzag"
        src="/pitanja/left-zigzag.svg"
        alt=""
        aria-hidden="true"
      />

      <img
        className="pitanja__bottom-paper--desktop"
        src="/pitanja/bottom-paper.svg"
        alt=""
        aria-hidden="true"
      />

      <img
        className="pitanja__bottom-paper--mobile"
        src="/pitanja/bottom-mobile-combined.svg"
        alt=""
        aria-hidden="true"
      />

      {/* =====================================================
          DESKTOP
          ===================================================== */}

      <div className="pitanja__desktop">
        <div className="pitanja__desktop-canvas">
          <h2 className="pitanja__desktop-title">PITANJA</h2>

          <div className="pitanja__desktop-faq">
            {renderQuestions(faqItems.slice(0, 3))}
          </div>
        </div>

        <img
          className="pitanja__question-mark"
          src="/pitanja/question-mark.svg"
          alt=""
          aria-hidden="true"
        />
      </div>

      {/* =====================================================
          MOBILE
          ===================================================== */}

      <div className="pitanja__mobile">
        <div className="pitanja__mobile-canvas">
          <div className="pitanja__mobile-title-wrapper">
            <h2 className="pitanja__mobile-title">PITANJA</h2>
          </div>

          <div className="pitanja__mobile-faq">{renderQuestions(faqItems)}</div>
        </div>
      </div>
    </section>
  );
};

export default Pitanja;
