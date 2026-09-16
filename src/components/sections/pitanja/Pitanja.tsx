import { useState } from "react";
import "@fontsource/figtree/400.css";
import "@fontsource/figtree/700.css";
import "./Pitanja.scss";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    id: 1,
    question: "Ko može učestvovati na S2S-u?",
    answer:
      "Studenti sa bilo kog fakulteta u Srbiji, zainteresovani za sticanje novih znanja i veština, mogu se prijaviti za učešće na S2S-u.",
  },
  {
    id: 2,
    question: "Da li je obavezno poneti laptop za radionice?",
    answer:
      'Laptop nije potreban za sve radionice, jer se neke održavaju u računarskim salama. Za one koje se održavaju van tih sala, laptop je potreban. Detaljnije informacije možete naći u sekciji "radionice" na sajtu.',
  },
  {
    id: 3,
    question: "Može li se prisustvovati na više radionica?",
    answer:
      "U prijavi za S2S, studenti biraju dve radionice, od kojih će biti primljeni samo na jednu. Učešće u više radionica nije moguće zbog njihovog preklapanja u rasporedu.",
  },
  {
    id: 4,
    question: "Kako se prijavljuje za učešće na S2S-u?",
    answer: "Prijava se vrši putem forme dostupne na sajtu.",
  },
  {
    id: 5,
    question:
      "Da li je potrebno imati prethodno znanje za učešće u radionicama?",
    answer:
      'Za neke radionice je potrebno osnovno predznanje, dok su druge namenjene početnicima. Detaljnije informacije o potrebnom predznanju možete naći u sekciji "radionice" na sajtu.',
  },
  {
    id: 6,
    question: "Može li se prisustvovati i panel diskusijama i radionicama?",
    answer: "Da, moguće je prisustvovati na oba događaja.",
  },
  {
    id: 7,
    question: "Da li je za prijavu na projekat neophodno poslati CV?",
    answer:
      "Slanje CV-a nije obavezno, ali studenti koji žele mogu da ga prilože.",
  },
];

const Pitanja = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex((currentIndex) => (currentIndex === index ? null : index));
  };

  const renderQuestions = (items: FaqItem[]) =>
    items.map((item, index) => {
      const isOpen = openIndex === index;
      const questionId = `pitanja-question-${item.id}`;
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
            id={questionId}
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
            aria-labelledby={questionId}
            role="region"
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
              {renderQuestions(faqItems)}
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
