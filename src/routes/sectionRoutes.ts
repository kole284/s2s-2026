export const SECTION_ROUTES = [
  { path: '/', sectionId: 'naslovna', label: 'Naslovna' },
  { path: '/projekat', sectionId: 'o-projektu', label: 'Projekat' },
  { path: '/radionice', sectionId: 'radionice', label: 'Radionice' },
  { path: '/panel', sectionId: 'panel', label: 'Panel' },
  { path: '/agenda', sectionId: 'agenda', label: 'Agenda' },
  { path: '/pitanja', sectionId: 'pitanja', label: 'Pitanja' },
  { path: '/partneri', sectionId: 'partneri', label: 'Partneri' },
  { path: '/tim', sectionId: 'tim', label: 'Tim' },
  { path: '/prijava', sectionId: 'prijava', label: 'Prijavi se' },
] as const;

export const SECTION_ROUTE_BY_PATH: ReadonlyMap<string, string> = new Map(
  SECTION_ROUTES.map(({ path, sectionId }) => [path, sectionId]),
);
