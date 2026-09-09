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
              <p className="pitanja__answer-text">{item.answer}</p>
            </div>
          </div>
        </article>
      );
    });

  return (
    <section className="pitanja" id="pitanja">
      <div className="pitanja__left-zigzag" aria-hidden="true" />

      <div className="pitanja__bottom-paper--desktop" aria-hidden="true">
        {Array.from({ length: 40 }, (_, index) => (
          <span className="pitanja__bottom-segment" key={index} />
        ))}
      </div>

      <div className="pitanja__bottom-paper--mobile" aria-hidden="true" />

      {/* =====================================================
          DESKTOP
          ===================================================== */}

      <div className="pitanja__desktop">
        <div className="pitanja__desktop-canvas">
          <div className="pitanja__desktop-content">
            <h2 className="pitanja__desktop-title">PITANJA</h2>

            <div className="pitanja__desktop-faq">
              {renderQuestions(faqItems.slice(0, 3))}
            </div>
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
