export type NivoZnanja = 'Osnovni' | 'Srednji' | 'Napredni';

export interface PrijavaForma {
  imePrezime: string;
  email: string;
  telefon: string;
  fakultet: string;
  godinaStudija: string;

  prvaZeljaRadionica: string;
  prvaZeljaNivoZnanja: NivoZnanja | '';
  prvaZeljaPrimena: string;

  drugaZeljaRadionica: string;
  drugaZeljaNivoZnanja: NivoZnanja | '';
  drugaZeljaPrimena: string;

  prisustvoPanelu: boolean | null;
  pitanjeZaPredavace: string;
  razloziZaS2S: string;

  ranijeUcestvovao: boolean | null;
  s2sIskustvo: string;
  predlogRadionice: string;

  cvDriveLink: string;
  zeliObavestenja: boolean;
}