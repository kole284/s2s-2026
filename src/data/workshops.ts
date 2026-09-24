export type Workshop = {
  id: number;
  shortName: string;
  fullName: string;
  lecturers: string[];
};

export const WORKSHOPS: Workshop[] = [
  {
    id: 1,
    shortName: "UI/UX dizajn",
    fullName: "Figma & Wonder: UI/UX dizajn",
    lecturers: ["Lazar Jocić"],
  },
  {
    id: 2,
    shortName: "C# Dev",
    fullName: "C# Development",
    lecturers: ["Matija Vujić"],
  },
  {
    id: 3,
    shortName: "Cybersecurity",
    fullName: "Cybersecurity",
    lecturers: ["Petar Nikolić"],
  },
  {
    id: 4,
    shortName: "CASE",
    fullName: "Case Method & Case Cracking",
    lecturers: ["Mina Popović", "Tamara Kukić", "Ana Milivojević"],
  },
  {
    id: 5,
    shortName: "Digitalni marketing",
    fullName: "Digitalni marketing koji prodaje",
    lecturers: ["Aleksa Krstić"],
  },
  {
    id: 6,
    shortName: "Uvod u C",
    fullName: "Uvod u C",
    lecturers: ["Kristina Jovanović"],
  },
  {
    id: 7,
    shortName: "Game Dev",
    fullName: "Game development",
    lecturers: ["Aleksandar Ilanković"],
  },
  {
    id: 8,
    shortName: "AI agenti",
    fullName: "AI agenti u akciji",
    lecturers: ["Tara Milojković"],
  },
  {
    id: 9,
    shortName: "Startup",
    fullName: "Startup 101: Od ideje do MVP-a",
    lecturers: ["Damir Velović"],
  },
  {
    id: 10,
    shortName: "Mašinsko učenje",
    fullName: "Analitika Starter Pack: Uvod u mašinsko učenje",
    lecturers: ["Magdalena Bojanić", "Doris Šmulja"],
  },
];
