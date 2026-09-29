export type Nivo = "Osnovni" | "Srednji" | "Napredni";

export type WorkshopDetails = {
  nivo: Nivo;
  // null znači da se predznanje ne traži.
  predznanje: string | null;
  opis: string[];
  softver: SoftverRadionice;
};

export type SoftverRadionice = {
  // Prazan niz (i bez grupa) znači da radionica nema softverskih zahteva.
  stavke: string[];
  napomena?: string;
  // Duži spiskovi alata po kategorijama (za sada samo Cybersecurity).
  grupe?: { naslov: string; alati: string[] }[];
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
    softver: {
      stavke: ["Figma i Wonder desktop aplikacije (opciono)"],
    },
  },
  2: {
    nivo: "Osnovni",
    predznanje:
      "Osnovno znanje bilo kog objektno orijentisanog jezika (ne nužno C#).",
    opis: [
      "Radionica je namenjena svima koji žele da kroz praktičan primer nauče osnove softverskog inženjerstva, razvoja aplikacija i .NET platforme. Stečeno znanje će biti dobra osnova za dalje učenje i usavršavanje.",
      "Kroz izradu online multiplayer igrice proći ćemo kroz to kako pravilno treba da se radi sa bazom podataka, kako klijenti komuniciraju preko mreže, izradu interfejsa i logike same igrice. Na kraju radionice delegati će imati gotovu aplikaciju i osnovno razumevanje procesa razvoja aplikacija.",
    ],
    softver: {
      stavke: ["Visual Studio", "SQL Server Management Studio"],
    },
  },
  3: {
    nivo: "Osnovni",
    predznanje: null,
    opis: [
      "Radionica je namenjena svim studentima koje interesuje sajber bezbednost, bez obzira na predznanje. Krećemo od nule: od osnovnih koncepata, preko slučajeva hakovanja u pravom životu, i na kraju simulacije hakerskih napada koje će učesnici sprovoditi uz pomoć predavača.",
      "Učesnici će takođe dobiti pregled karijernih puteva u okviru sajber bezbednosti, uz biblioteku materijala za dalji rad.",
    ],
    softver: {
      stavke: [
        "Kali Linux",
        "VirtualBox ili VMware Workstation",
        "Python 3",
        "Visual Studio Code",
      ],
      grupe: [
        {
          naslov: "Opšti alati",
          alati: ["CyberChef", "netcat", "curl", "file", "strings", "xxd"],
        },
        {
          naslov: "Kriptografija",
          alati: [
            "dCode",
            "quipqiup",
            "RsaCtfTool",
            "SageMath",
            "pycryptodome",
            "gmpy2",
            "factordb",
            "xortool",
            "OpenSSL",
            "hashid",
            "John the Ripper",
            "Hashcat",
            "CrackStation",
          ],
        },
        {
          naslov: "Forenzika fajlova i steganografija",
          alati: [
            "binwalk",
            "foremost",
            "steghide",
            "stegseek",
            "zsteg",
            "StegSolve",
            "Aperi'Solve",
            "pngcheck",
            "Audacity",
            "Sonic Visualiser",
          ],
        },
        {
          naslov: "Forenzika memorije i diskova",
          alati: [
            "Volatility 3",
            "Volatility 2",
            "Autopsy",
            "The Sleuth Kit",
            "FTK Imager",
            "PhotoRec",
          ],
        },
        {
          naslov: "Mrežna forenzika",
          alati: ["Wireshark", "tshark", "tcpdump", "NetworkMiner"],
        },
        {
          naslov: "Analiza dokumenata i malvera",
          alati: ["oletools", "objdump", "pdfid", "pdf-parser"],
        },
        // OSINT: spisak u dokumentu je presečen, dodati kad stigne ceo.
      ],
    },
  },
  4: {
    nivo: "Osnovni",
    predznanje: null,
    opis: [
      "Radionica je namenjena svima koji žele da se bolje upoznaju sa tehnikama i analizama koje se primenjuju pri rešavanju poslovnih studija slučaja.",
      "Kroz konkretne primere, učesnici će proći kroz proces rešavanja: od analize i definisanja strategije, do implementacije i sagledavanja efekata.",
      "Fokus će biti na razumevanju logike svakog koraka i praktičnim smernicama koje olakšavaju rešavanje složenih poslovnih izazova.",
    ],
    softver: { stavke: [] },
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
    softver: { stavke: [] },
  },
  6: {
    nivo: "Osnovni",
    predznanje: null,
    opis: [
      "Ova radionica namenjena je studentima koji se prvi put susreću sa programiranjem u programskom jeziku C.",
      "Za dva dana savladaćemo osnove sintakse jezika, rad sa podacima i promenljivama, kontrolu toka programa, jednostavne algoritme i nizove. Cilj je da polaznici steknu samopouzdanje da samostalno pišu i pokreću manje programe, kao i da razumeju logiku iza rešavanja problema.",
      "Ako vreme dozvoli, dotaći ćemo se i naprednijih tema - struktura, rada sa datotekama i povezanim listama - kao uvod u sve ono što vas čeka na fakultetu.",
    ],
    softver: {
      stavke: ["Visual Studio 2026 (C++ desktop development paket)"],
    },
  },
  7: {
    nivo: "Osnovni",
    predznanje: null,
    opis: [
      "Pravljenje 2D roguelike igrice od nule. Uče se osnove Unity skriptovanja i gameplay development-a.",
      "Na kraju radionice svi dodaju neki svoj element igrici. Rezultat je da svako ima svoj unikatan roguelike na kraju radionice.",
    ],
    softver: {
      stavke: [
        "Visual Studio Code sa Unity game development workload-om",
        "Unity Hub i Unity nalog",
        "Unity Editor verzija 6000.6.2f1",
      ],
    },
  },
  8: {
    nivo: "Osnovni",
    predznanje: null,
    opis: [
      "Radionica „AI agenti u akciji“ pruža praktičan uvod u razvoj AI agenata kroz DSPy okvir.",
      "Učesnici će kroz rad sa LLM-ovima i unapred pripremljen projekat naučiti kako agenti koriste alate, donose odluke i samostalno rešavaju zadatke. Kroz praktičan rad razviće jednostavnog ReAct agenta i pratiti njegov način rada na konkretnim primerima.",
    ],
    softver: {
      stavke: [
        "Python 3.11 ili 3.12",
        "Visual Studio Code sa Python ekstenzijom",
        "GitHub nalog",
        "OpenRouter nalog i besplatan API ključ",
      ],
      napomena:
        "Python biblioteke biće navedene u requirements.txt fajlu i instaliraće se na početku radionice.",
    },
  },
  9: {
    nivo: "Osnovni",
    predznanje: null,
    opis: [
      "Neki ljudi samo posmatraju kako se svijet mijenja i klimaju glavom, dok drugi uzmu stvari u svoje ruke jer ih nervira status quo. Ako si od ovih drugih, ovo su dva dana u kojima prestaješ da pričaš šta bi moglo biti i počinješ da praviš ono što mora postojati.",
      "Kroz intenzivan rad na sopstvenoj ideji, validaciju i testiranje na terenu, proći ćeš cijeli put od nule do gotovog koncepta.",
      "Cilj nije da naučiš šta je startup, cilj je da izađeš sa svojim sopstvenim startupom.",
    ],
    softver: {
      stavke: ["Google Chrome", "Claude", "Microsoft PowerPoint"],
    },
  },
  10: {
    nivo: "Osnovni",
    predznanje: null,
    opis: [
      "Analitika Starter Pack radionica namenjena je studentima koji žele da naprave prve korake u svetu podataka i mašinskog učenja. Kroz praktičan rad u Pajtonu, polaznici će naučiti osnove programskog jezika, kako da vizualizuju podatke i kako funkcionišu neki od najpoznatijih algoritama mašinskog učenja.",
      "Fokus je na razumevanju kroz praksu: svaki koncept se odmah primenjuje na konkretnim primerima i podacima, tako da polaznici na kraju radionice imaju svoj prvi trenirani model i jasnu sliku kako izgleda rad analitičara/data scientista.",
    ],
    softver: {
      stavke: ["Python", "Jupyter Notebook"],
    },
  },
};
