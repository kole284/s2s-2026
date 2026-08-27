import { useLayoutEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

const bandText = 'S2'.repeat(12);

type NaslovnaDesktopBandProps = {
  offset: number;
  onRepeatDistanceChange: (distance: number) => void;
};

const NaslovnaDesktopBand = ({
  offset,
  onRepeatDistanceChange,
}: NaslovnaDesktopBandProps) => {
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const textElement = textRef.current;
    if (!textElement) return;

    const measureRepeatDistance = () => {
      const characters =
        textElement.querySelectorAll<HTMLElement>('span');

      if (characters.length < 3) return;

      const distance =
        characters[2].offsetLeft -
        characters[0].offsetLeft;

      if (distance > 0) {
        onRepeatDistanceChange(distance);
      }
    };

    measureRepeatDistance();

    const resizeObserver =
      new ResizeObserver(measureRepeatDistance);

    resizeObserver.observe(textElement);

    return () => resizeObserver.disconnect();
  }, [onRepeatDistanceChange]);

  const textOffset = {
    '--offset': `${offset}px`,
  } as CSSProperties;

  return (
    <div
      className="naslovna-side-band-desktop"
      aria-hidden="true"
    >
      <div className="naslovna-desktop-band-shape" />

      <div
        ref={textRef}
        className="naslovna-desktop-band-text"
        style={textOffset}
      >
        {[...bandText].map((character, index) => (
          <span key={`${character}-${index}`}>
            {character}
          </span>
        ))}
      </div>
    </div>
  );
};

export default NaslovnaDesktopBand;
