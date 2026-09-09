interface Props {
  korak: number;
  onPrethodni: () => void;
  onSledeci: () => void;
  onPosalji: () => void;
}

const FormNavigacija = ({ korak, onPrethodni, onSledeci, onPosalji }: Props) => {
  return (
    <div className="prijava_navigacija">
      {korak > 1 && (
        <button
          type="button"
          className="prijava_dugme prijava_dugme--nazad"
          onClick={onPrethodni}
        >
          NAZAD
        </button>
      )}
      {korak < 4 ? (
        <button
          type="button"
          className="prijava_dugme prijava_dugme--napred"
          onClick={onSledeci}
        >
          NAREDNA
        </button>
      ) : (
        <button
          type="button"
          className="prijava_dugme prijava_dugme--posalji"
          onClick={onPosalji}
        >
          POŠALJI
        </button>
      )}
    </div>
  );
};

export default FormNavigacija;