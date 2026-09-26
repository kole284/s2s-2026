export type Nivo = "Osnovni" | "Srednji" | "Napredni";

export type WorkshopDetails = {
  nivo: Nivo;
  // null znači da se predznanje ne traži.
  predznanje: string | null;
  opis: string[];
};

// Ključ je Workshop.id iz workshops.ts.
export const WORKSHOP_DETAILS: Record<number, WorkshopDetails> = {
  1: {
    nivo: "Osnovni",
    predznanje: null,
    opis: [
      "U ovoj radionici prolazimo kroz osnove UI/UX dizajna. Kroz praktičan rad upoznajemo se sa teorijskim principima dobrog dizajna i od nule pravimo svoj prvi mockup, uz podršku savremenih alata i AI tehnologije.",
      "Poseban akcenat se stavlja na samostalan rad, gde se polaznicima daje sloboda da iskažu svoju kreativnost.",
      "Na kraju radionice, svaki polaznik izlazi sa jasnim razumevanjem kako dizajnerski proces izgleda u praksi, od prve ideje do gotovog rešenja.",
    ],
  },
  2: {
    nivo: "Osnovni",
    predznanje:
      "Osnovno znanje bilo kog objektno orijentisanog jezika (ne nužno C#).",
    opis: [
      "Radionica je namenjena svima koji žele da kroz praktičan primer nauče osnove softverskog inženjerstva, razvoja aplikacija i .NET platforme. Stečeno znanje će biti dobra osnova za dalje učenje i usavršavanje.",
      "Kroz izradu online multiplayer igrice proći ćemo kroz to kako pravilno treba da se radi sa bazom podataka, kako klijenti komuniciraju preko mreže, izradu interfejsa i logike same igrice. Na kraju radionice delegati će imati gotovu aplikaciju i osnovno razumevanje procesa razvoja aplikacija.",
    ],
  },
  3: {
    nivo: "Osnovni",
    predznanje: null,
    opis: [
      "Radionica je namenjena svim studentima koje interesuje sajber bezbednost, bez obzira na predznanje. Krećemo od nule: od osnovnih koncepata, preko slučajeva hakovanja u pravom životu, i na kraju simulacije hakerskih napada koje će učesnici sprovoditi uz pomoć predavača.",
      "Učesnici će takođe dobiti pregled karijernih puteva u okviru sajber bezbednosti, uz biblioteku materijala za dalji rad.",
    ],
  },
  4: {
    nivo: "Osnovni",
    predznanje: null,
    opis: [
      "Radionica je namenjena svima koji žele da se bolje upoznaju sa tehnikama i analizama koje se primenjuju pri rešavanju poslovnih studija slučaja.",
      "Kroz konkretne primere, učesnici će proći kroz proces rešavanja: od analize i definisanja strategije, do implementacije i sagledavanja efekata.",
      "Fokus će biti na razumevanju logike svakog koraka i praktičnim smernicama koje olakšavaju rešavanje složenih poslovnih izazova.",
    ],
  },
  5: {
    nivo: "Osnovni",
    predznanje: null,
    opis: [
      "Vidiš da je nešto lepo, ali ne znaš zašto?",
      "Pitaš se zašto neki video privuče pažnju za nekoliko sekundi, dok ga drugi ljudi samo preskoče?",
      "Ako si na početku puta u marketingu ili već imaš iskustva, ali ti nedostaju struktura i dublje razumevanje, ova radionica je za tebe.",
      "Tokom dva dana naučićeš da prepoznaš šta čini sadržaj vizuelno privlačnim, kako da privučeš i zadržiš pažnju i, najvažnije, kako da sve to pretvoriš u sistem koji donosi prodaje.",
    ],
  },
  6: {
    nivo: "Osnovni",
    predznanje: null,
    opis: [
      "Ova radionica namenjena je studentima koji se prvi put susreću sa programiranjem u programskom jeziku C.",
      "Za dva dana savladaćemo osnove sintakse jezika, rad sa podacima i promenljivama, kontrolu toka programa, jednostavne algoritme i nizove. Cilj je da polaznici steknu samopouzdanje da samostalno pišu i pokreću manje programe, kao i da razumeju logiku iza rešavanja problema.",
      "Ako vreme dozvoli, dotaći ćemo se i naprednijih tema - struktura, rada sa datotekama i povezanim listama - kao uvod u sve ono što vas čeka na fakultetu.",
    ],
  },
  7: {
    nivo: "Osnovni",
    predznanje: null,
    opis: [
      "Pravljenje 2D roguelike igrice od nule. Uče se osnove Unity skriptovanja i gameplay development-a.",
      "Na kraju radionice svi dodaju neki svoj element igrici. Rezultat je da svako ima svoj unikatan roguelike na kraju radionice.",
    ],
  },
  8: {
    nivo: "Osnovni",
    predznanje: null,
    opis: [
      "Radionica „AI agenti u akciji“ pruža praktičan uvod u razvoj AI agenata kroz DSPy okvir.",
      "Učesnici će kroz rad sa LLM-ovima i unapred pripremljen projekat naučiti kako agenti koriste alate, donose odluke i samostalno rešavaju zadatke. Kroz praktičan rad razviće jednostavnog ReAct agenta i pratiti njegov način rada na konkretnim primerima.",
    ],
  },
  9: {
    nivo: "Osnovni",
    predznanje: null,
    opis: [
      "Neki ljudi samo posmatraju kako se svijet mijenja i klimaju glavom, dok drugi uzmu stvari u svoje ruke jer ih nervira status quo. Ako si od ovih drugih, ovo su dva dana u kojima prestaješ da pričaš šta bi moglo biti i počinješ da praviš ono što mora postojati.",
      "Kroz intenzivan rad na sopstvenoj ideji, validaciju i testiranje na terenu, proći ćeš cijeli put od nule do gotovog koncepta.",
      "Cilj nije da naučiš šta je startup, cilj je da izađeš sa svojim sopstvenim startupom.",
    ],
  },
  10: {
    nivo: "Osnovni",
    predznanje: null,
    opis: [
      "Analitika Starter Pack radionica namenjena je studentima koji žele da naprave prve korake u svetu podataka i mašinskog učenja. Kroz praktičan rad u Pajtonu, polaznici će naučiti osnove programskog jezika, kako da vizualizuju podatke i kako funkcionišu neki od najpoznatijih algoritama mašinskog učenja.",
      "Fokus je na razumevanju kroz praksu: svaki koncept se odmah primenjuje na konkretnim primerima i podacima, tako da polaznici na kraju radionice imaju svoj prvi trenirani model i jasnu sliku kako izgleda rad analitičara/data scientista.",
    ],
  },
};
