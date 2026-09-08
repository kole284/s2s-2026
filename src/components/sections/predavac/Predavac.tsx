import { useState } from 'react';
import './Predavac.scss';
import shieldIcon from '../../../assets/predavac/shield-icon.png';

export interface Speaker {
  id: string;
  name: string;
  image: string;
  description: string;
  difficulty: string;
}

interface PredavacProps {
  workshopTitle: string;
  speakers: Speaker[];
  initialIndex?: number;
  onClose?: () => void;
}

// Napomena: `initialIndex` i `onClose` su opcioni jer ne znamo još
// kako Radionice.tsx kontroliše ovaj deo (koja radionica je aktivna,
// kako se otvara/zatvara). Kada pošalješ taj kod, uskladiću props.
const Predavac = ({
  workshopTitle,
  speakers,
  initialIndex = 0,
  onClose,
}: PredavacProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (speakers.length === 0) {
    return null;
  }

  const currentSpeaker = speakers[currentIndex];

  const goToPrevSpeaker = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? speakers.length - 1 : prevIndex - 1
    );
  };

  const goToNextSpeaker = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === speakers.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="predavac">
      <div className="predavac-header">
        <h2 className="predavac-title">{workshopTitle}</h2>
        {onClose && (
          <button
            className="predavac-close"
            onClick={onClose}
            aria-label="Zatvori"
            type="button"
          >
            ✕
          </button>
        )}
      </div>

      <div className="predavac-body">
        {speakers.length > 1 && (
          <button
            className="predavac-nav predavac-nav-prev"
            onClick={goToPrevSpeaker}
            aria-label="Prethodni predavač"
            type="button"
          >
            ‹
          </button>
        )}

        <div className="predavac-content">
          <div className="predavac-speaker">
            <img
              className="predavac-image"
              src={currentSpeaker.image}
              alt={currentSpeaker.name}
            />
            <span className="predavac-name">{currentSpeaker.name}</span>
          </div>

          <p className="predavac-description">{currentSpeaker.description}</p>

          <p className="predavac-difficulty-label">
            TEŽINA: <strong>{currentSpeaker.difficulty}</strong>
          </p>

          <img
            className="predavac-icon"
            src={shieldIcon}
            alt=""
            aria-hidden="true"
          />
        </div>

        {speakers.length > 1 && (
          <button
            className="predavac-nav predavac-nav-next"
            onClick={goToNextSpeaker}
            aria-label="Sledeći predavač"
            type="button"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
};

export default Predavac;
