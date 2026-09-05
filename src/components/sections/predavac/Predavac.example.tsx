import Predavac, { Speaker } from './Predavac';

// Dummy podaci - zameniti pravim kada budu poznati (4 predavača za test,
// javićeš stvarni broj i sadržaj).
const mockSpeakers: Speaker[] = [
  {
    id: '1',
    name: 'Petar Nikolić',
    image: '/assets/speakers/petar-nikolic.jpg',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce semper pretium quam.',
    difficulty: 'Srednje',
  },
  {
    id: '2',
    name: 'Ana Jovanović',
    image: '/assets/speakers/ana-jovanovic.jpg',
    description:
      'Ut a odio nunc. Ut consectetur nisi laoreet eros tempor scelerisque.',
    difficulty: 'Lako',
  },
  {
    id: '3',
    name: 'Pavle Marković',
    image: '/assets/speakers/pavle-markovic.jpg',
    description:
      'Sed leo tellus, hendrerit eu neque non, maximus consectetur risus.',
    difficulty: 'Napredno',
  },
  {
    id: '4',
    name: 'Milica Stanković',
    image: '/assets/speakers/milica-stankovic.jpg',
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
