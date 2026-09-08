import Predavac, { Speaker } from './Predavac';
import petarImg from '../../../assets/speakers/petar-nikolic.jpg';
import anaImg from '../../../assets/speakers/ana-jovanovic.jpg';
import pavleImg from '../../../assets/speakers/pavle-markovic.jpg';
import milicaImg from '../../../assets/speakers/milica-stankovic.jpg';

// NAPOMENA: pavle-markovic.jpg import ce pucati dok se ne ispravi ime
// fajla u projektu - trenutno stoji kao "pavle-markovic.jpg'.jpg"
// (slucajno dodat apostrof). Preimenuj fajl u src/assets/speakers/
// pre nego sto ovo pokrenes.

const mockSpeakers: Speaker[] = [
  {
    id: '1',
    name: 'Petar Nikolić',
    image: petarImg,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce semper pretium quam.',
    difficulty: 'Srednje',
  },
  {
    id: '2',
    name: 'Ana Jovanović',
    image: anaImg,
    description:
      'Ut a odio nunc. Ut consectetur nisi laoreet eros tempor scelerisque.',
    difficulty: 'Lako',
  },
  {
    id: '3',
    name: 'Pavle Marković',
    image: pavleImg,
    description:
      'Sed leo tellus, hendrerit eu neque non, maximus consectetur risus.',
    difficulty: 'Napredno',
  },
  {
    id: '4',
    name: 'Milica Stanković',
    image: milicaImg,
    description:
      'Phasellus pharetra auctor dapibus. Proin vel cursus est.',
    difficulty: 'Srednje',
  },
];

const PredavacExample = () => {
  return (
    <Predavac
      workshopTitle="Cyber Security"
      speakers={mockSpeakers}
      onClose={() => console.log('zatvoreno')}
    />
  );
};

export default PredavacExample;
