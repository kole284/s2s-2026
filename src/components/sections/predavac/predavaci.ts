import aleksaKrstic from "@/assets/predavaci/aleksa-krstic.webp";
import aleksandarIlankovic from "@/assets/predavaci/aleksandar-ilankovic.webp";
import anaMilivojevic from "@/assets/predavaci/ana-milivojevic.webp";
import damirVelovic from "@/assets/predavaci/damir-velovic.webp";
import dorisSmulja from "@/assets/predavaci/doris-smulja.webp";
import kristinaJovanovic from "@/assets/predavaci/kristina-jovanovic.webp";
import lazarJocic from "@/assets/predavaci/lazar-jocic.webp";
import magdalenaBojanic from "@/assets/predavaci/magdalena-bojanic.webp";
import matijaVujic from "@/assets/predavaci/matija-vujic.webp";
import minaPopovic from "@/assets/predavaci/mina-popovic.webp";
import petarNikolic from "@/assets/predavaci/petar-nikolic.webp";
import tamaraKukic from "@/assets/predavaci/tamara-kukic.webp";
import taraMilojkovic from "@/assets/predavaci/tara-milojkovic.webp";

export interface PredavacPodaci {
  ime: string;
  bio: string[];
  slika?: string;
  pozicijaSlike?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Kadar je podešen po fotografiji (isto kao koordinatori u Tim sekciji): oči su
// na istoj visini, lice u centru i iste veličine, pa se vide glava i ramena.
export const PREDAVACI: PredavacPodaci[] = [
  {
    ime: "Lazar Jocić",
    slika: lazarJocic,
    pozicijaSlike: { x: -119.7, y: -37.6, width: 477.1, height: 596.3 },
    bio: [
      "Student Fakulteta organizacionih nauka sa iskustvom u programiranju u C#, C++ i C jeziku, kao i radu u AutoCAD-u. Kreator je i aktivni administrator veb stranice udruženja Loznički Trkači, gde razvija nove funkcionalnosti i unapređuje sadržaj. Posebno ga interesuju tehnologija i programiranje, uz kontinuiranu želju za učenjem i usavršavanjem.",
    ],
  },
  {
    ime: "Aleksandar Ilanković",
    slika: aleksandarIlankovic,
    pozicijaSlike: { x: -54.8, y: -57.6, width: 330.9, height: 413.6 },
    bio: [
      "Softverski programer specijalizovan za .NET i Unity, sa iskustvom u kreiranju i realizaciji nastavnog programa iz oblasti Unity-ja za kurs sa više od 400 studenata. Razvio je više različitih igara i prototipova u Unity-ju, često u veoma kratkim vremenskim rokovima.",
    ],
  },
  {
    ime: "Tara Milojković",
    slika: taraMilojkovic,
    pozicijaSlike: { x: -50.8, y: -84.0, width: 307.4, height: 384.2 },
    bio: [
      "Data Engineer sa praktičnim iskustvom u radu sa cloud tehnologijama, data pipeline-ovima i analitikom. U svom radu koristi Python, SQL, BigQuery, Spark, Databricks i Terraform, a posebno se ističe pristupom usmerenim na razvoj skalabilnih i kvalitetnih data rešenja.",
    ],
  },
  {
    ime: "Magdalena Bojanić",
    slika: magdalenaBojanic,
    pozicijaSlike: { x: -252.0, y: -212.1, width: 713.4, height: 891.7 },
    bio: [
      "Student FON-a sa iskustvom u vođenju IT studentske organizacije i radu na različitim tehnološkim projektima. Ima iskustvo u oblastima veštačke inteligencije, mašinskog učenja, analize podataka i razvoja softvera, uz praktičan rad sa Python-om, SQL-om, Power BI-jem, React-om i Javom. Pored tehničkog iskustva, poseduje razvijene veštine liderstva, organizacije i upravljanja projektima.",
    ],
  },
  {
    ime: "Doris Šmulja",
    slika: dorisSmulja,
    pozicijaSlike: { x: -86.9, y: -152.9, width: 480.0, height: 600.0 },
    bio: [
      "Student završne godine FON-a, smera Informaciono inženjerstvo, sa iskustvom u Pythonu, SQL-u, Javi, bazama podataka i analizi podataka. Posebno je interesuju veštačka inteligencija, mašinsko učenje i rad sa podacima, uz praktično iskustvo stečeno kroz akademske projekte i IT praksu.",
    ],
  },
  {
    ime: "Matija Vujić",
    slika: matijaVujic,
    pozicijaSlike: { x: -108.6, y: 32.9, width: 462.9, height: 578.6 },
    bio: [
      "Student FON-a, smera Informaciono inženjerstvo, sa iskustvom u programiranju, edukaciji i radu na IT projektima. Kao predavač i nastavnik programiranja radio je sa decom i mladima, a poseduje iskustvo u Pythonu, Javi, C#-u i ETL procesima. Aktivno je učestvovao u organizaciji IT projekata i studentskih takmičenja.",
    ],
  },
  {
    ime: "Kristina Jovanović",
    slika: kristinaJovanovic,
    pozicijaSlike: { x: -154.6, y: -5.7, width: 602.8, height: 753.5 },
    bio: [
      "Studentkinja sa velikim interesovanjem za IT i iskustvom u razvoju različitih softverskih projekata. Radila je na full-stack aplikacijama, desktop i web rešenjima, kao i razvoju aplikacija koristeći C#, .NET, ReactJS, PHP i MySQL. Odlikuju je odgovornost, prilagodljivost i spremnost za usvajanje novih znanja.",
    ],
  },
  {
    ime: "Tamara Kukić",
    slika: tamaraKukic,
    pozicijaSlike: { x: -299.8, y: -194.7, width: 827.2, height: 1034.0 },
    bio: [
      "Studentkinja FON-a, smera Informaciono inženjerstvo, sa iskustvom u rešavanju međunarodnih case study zadataka i radu na njihovoj analizi i prezentaciji. Dobitnica je drugog mesta na dva međunarodna takmičenja, a poseduje znanje iz oblasti Pythona, Jave, SQL-a, Power BI-ja i ETL-a, uz izraženu pažnju prema detaljima i dobre organizacione veštine.",
    ],
  },
  {
    ime: "Ana Milivojević",
    slika: anaMilivojevic,
    pozicijaSlike: { x: -223.6, y: -72.0, width: 713.4, height: 891.7 },
    bio: [
      "Studentkinja Fakulteta organizacionih nauka sa iskustvom u rešavanju poslovnih studija slučaja i učešću na međunarodnim takmičenjima. Kroz različite projekte razvila je veštine kritičkog razmišljanja, rešavanja problema, prezentovanja i timskog rada.",
    ],
  },
  {
    ime: "Mina Popović",
    slika: minaPopovic,
    pozicijaSlike: { x: -162.8, y: -88.9, width: 607.5, height: 759.4 },
    bio: [
      "Studentkinja Fakulteta organizacionih nauka sa iskustvom u organizaciji međunarodnih takmičenja, marketingu i radu sa studentima. Učestvovala je u projektima i aktivnostima vezanim za poslovne studije slučaja, studentske startape i organizaciju događaja, uz razvijene komunikacione i organizacione veštine.",
    ],
  },
  {
    ime: "Petar Nikolić",
    slika: petarNikolic,
    pozicijaSlike: { x: -170.7, y: -146.9, width: 602.8, height: 753.5 },
    bio: [
      "Student Fakulteta organizacionih nauka i pobednik Serbian Cybersecurity Challenge 2026, nacionalnog takmičenja u hakovanju. Na hakerskim takmičenjima bavi se kriptografijom - gde se šifre prave i razbijaju, digitalnom forenzikom - gde se iz tragova na uređaju rekonstruiše šta se zapravo dogodilo, i OSINT-om - pronalaženjem informacija koje su javno dostupne, ali dobro skrivene. Izvan takmičenja, najviše ga zanimaju primena mašinskog učenja na finansijskim tržištima i inženjering sistema.",
    ],
  },
  {
    ime: "Aleksa Krstić",
    slika: aleksaKrstic,
    pozicijaSlike: { x: -155.1, y: 11.6, width: 525.4, height: 656.8 },
    bio: [
      "Iskusni E-Commerce Operations Manager i suosnivač sa više od 5 godina iskustva u vođenju DTC i B2B digitalnih poslovanja. Specijalizovan je za Shopify ekosistem, integraciju marketplace platformi i koordinaciju lanca snabdevanja, uz iskustvo u vođenju timova i optimizaciji poslovnih procesa.",
    ],
  },
  {
    ime: "Damir Velović",
    slika: damirVelovic,
    pozicijaSlike: { x: -81.5, y: -14.8, width: 353.5, height: 441.8 },
    bio: [
      "Backend softverski inženjer sa fokusom na Java, Spring Boot i bezbedne distribuirane sisteme. Iskusan u razvoju full-stack aplikacija, REST API-ja, baza podataka i real-time sistema. Pored tehničkog iskustva, pokrenuo je startup od nule do MVP-a i osvojio prvo mesto na regionalnom takmičenju.",
    ],
  },
];
