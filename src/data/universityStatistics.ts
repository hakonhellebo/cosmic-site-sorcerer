
interface Program {
  linje: string;
  studiekode: string;
  snitt: number;
  sokereMottPerStudieplass: number;
  sokereMott: number;
  sokereTilbudJaSvar: number;
  sokereTilbud: number;
  sokereKvalifisert: number;
  sokere: number;
  planlagteStudieplasser: number;
  universitet: string;
  beskrivelse?: string;
  link?: string;
}

interface UniversityData {
  [key: string]: Program[];
}

export const universityData: UniversityData = {
  nhh: [
    {
      linje: "Business, economics and data science - siviløkonom",
      studiekode: "191 340",
      snitt: 59.6,
      sokereMottPerStudieplass: 0.642857143,
      sokereMott: 45,
      sokereTilbudJaSvar: 58,
      sokereTilbud: 98,
      sokereKvalifisert: 3515,
      sokere: 4119,
      planlagteStudieplasser: 70,
      universitet: "nhh",
      beskrivelse: "En siviløkonomutdanning som kombinerer økonomi, ledelse og dataanalyse",
      link: "https://www.nhh.no/studier/sivilokonom/"
    },
    {
      linje: "Økonomi og administrasjon - siviløkonom",
      studiekode: "191 345",
      snitt: 55.2,
      sokereMottPerStudieplass: 1.095348837,
      sokereMott: 471,
      sokereTilbudJaSvar: 604,
      sokereTilbud: 834,
      sokereKvalifisert: 4246,
      sokere: 4737,
      planlagteStudieplasser: 430,
      universitet: "nhh",
      beskrivelse: "En tradisjonell siviløkonomutdanning med fokus på økonomi og administrasjon",
      link: "https://www.nhh.no/studier/okonomi-og-administrasjon/"
    }
  ],
  ntnu: [
    {
      linje: "Industriell økonomi og teknologiledelse",
      studiekode: "194 767",
      snitt: 61.6,
      sokereMottPerStudieplass: 1.0,
      sokereMott: 77.0,
      sokereTilbudJaSvar: 86.0,
      sokereTilbud: 172.0,
      sokereKvalifisert: 635.0,
      sokere: 655.0,
      planlagteStudieplasser: 80.0,
      universitet: "ntnu",
      beskrivelse: "Kombinerer teknologi og økonomi for å utdanne fremtidens teknologiledere",
      link: "https://www.ntnu.no/studier/mtiot"
    },
    {
      linje: "Medisin, Trondheim",
      studiekode: "194 740",
      snitt: 61.6,
      sokereMottPerStudieplass: 1.1,
      sokereMott: 42.0,
      sokereTilbudJaSvar: 49.0,
      sokereTilbud: 74.0,
      sokereKvalifisert: 327.0,
      sokere: 347.0,
      planlagteStudieplasser: 40.0,
      universitet: "ntnu",
      beskrivelse: "Profesjonsstudiet i medisin ved NTNU i Trondheim",
      link: "https://www.ntnu.no/studier/cmed"
    },
    {
      linje: "Nanoteknologi",
      studiekode: "194 937",
      snitt: 59.7,
      sokereMottPerStudieplass: 1.0,
      sokereMott: 5.0,
      sokereTilbudJaSvar: 6.0,
      sokereTilbud: 15.0,
      sokereKvalifisert: 42.0,
      sokere: 49.0,
      planlagteStudieplasser: 5.0,
      universitet: "ntnu",
      beskrivelse: "Studium som utforsker teknologi på atomnivå",
      link: "https://www.ntnu.no/studier/mtnano"
    },
    {
      linje: "Medisin, Trondheim/Ålesund",
      studiekode: "194 499",
      snitt: 59.4,
      sokereMottPerStudieplass: 1.0,
      sokereMott: 95.0,
      sokereTilbudJaSvar: 117.0,
      sokereTilbud: 182.0,
      sokereKvalifisert: 703.0,
      sokere: 931.0,
      planlagteStudieplasser: 98.0,
      universitet: "ntnu",
      beskrivelse: "Profesjonsstudiet i medisin ved NTNU, med deler av utdanningen i Ålesund",
      link: "https://www.ntnu.no/studier/cmed"
    },
    {
      linje: "Medisin, Trondheim/Levanger",
      studiekode: "194 498",
      snitt: 59.3,
      sokereMottPerStudieplass: 1.1,
      sokereMott: 23.0,
      sokereTilbudJaSvar: 26.0,
      sokereTilbud: 56.0,
      sokereKvalifisert: 311.0,
      sokere: 330.0,
      planlagteStudieplasser: 21.0,
      universitet: "ntnu",
      beskrivelse: "Profesjonsstudiet i medisin ved NTNU, med deler av utdanningen i Levanger",
      link: "https://www.ntnu.no/studier/cmed"
    }
  ],
  uio: [
    {
      linje: "Honoursprogram, Realfag",
      studiekode: "185 747",
      snitt: 60.9,
      sokereMottPerStudieplass: 1.3,
      sokereMott: 26,
      sokereTilbudJaSvar: 28,
      sokereTilbud: 40,
      sokereKvalifisert: 327,
      sokere: 345,
      planlagteStudieplasser: 20,
      universitet: "uio",
      beskrivelse: "Et eliteprogram for spesielt motiverte og dyktige studenter innen realfag",
      link: "https://www.uio.no/studier/program/honour-realfag/"
    },
    {
      linje: "Medisin, Oslo, høst",
      studiekode: "185 740",
      snitt: 60.7,
      sokereMottPerStudieplass: 1.008695652,
      sokereMott: 116,
      sokereTilbudJaSvar: 128,
      sokereTilbud: 162,
      sokereKvalifisert: 1738,
      sokere: 2111,
      planlagteStudieplasser: 115,
      universitet: "uio",
      beskrivelse: "Profesjonsstudiet i medisin ved Universitetet i Oslo, høstopptak",
      link: "https://www.uio.no/studier/program/medisin/"
    },
    {
      linje: "Medisin, Oslo/Kristiansand, høst",
      studiekode: "185 498",
      snitt: 59,
      sokereMottPerStudieplass: 1,
      sokereMott: 15,
      sokereTilbudJaSvar: 17,
      sokereTilbud: 27,
      sokereKvalifisert: 1904,
      sokere: 2302,
      planlagteStudieplasser: 15,
      universitet: "uio",
      beskrivelse: "Profesjonsstudiet i medisin ved UiO, med deler av studiet i Kristiansand",
      link: "https://www.uio.no/studier/program/medisin/"
    },
    {
      linje: "Medisin, Oslo, vår",
      studiekode: "185 745",
      snitt: 59,
      sokereMottPerStudieplass: 0.991304348,
      sokereMott: 114,
      sokereTilbudJaSvar: 139,
      sokereTilbud: 180,
      sokereKvalifisert: 1586,
      sokere: 1876,
      planlagteStudieplasser: 115,
      universitet: "uio",
      beskrivelse: "Profesjonsstudiet i medisin ved Universitetet i Oslo, våropptak",
      link: "https://www.uio.no/studier/program/medisin/"
    },
    {
      linje: "Medisin, Oslo/Kristiansand, vår",
      studiekode: "185 499",
      snitt: 58.7,
      sokereMottPerStudieplass: 1.133333333,
      sokereMott: 17,
      sokereTilbudJaSvar: 24,
      sokereTilbud: 45,
      sokereKvalifisert: 1721,
      sokere: 2061,
      planlagteStudieplasser: 15,
      universitet: "uio",
      beskrivelse: "Profesjonsstudiet i medisin ved UiO, våropptak, med deler av studiet i Kristiansand",
      link: "https://www.uio.no/studier/program/medisin/"
    }
  ],
  uib: [
    {
      linje: "Medisin, Bergen",
      studiekode: "184 740",
      snitt: 59.4,
      sokereMottPerStudieplass: 1.121212121,
      sokereMott: 185,
      sokereTilbudJaSvar: 212,
      sokereTilbud: 266,
      sokereKvalifisert: 2245,
      sokere: 2584,
      planlagteStudieplasser: 165,
      universitet: "uib",
      beskrivelse: "Profesjonsstudiet i medisin ved Universitetet i Bergen",
      link: "https://www.uib.no/studier/PRMEDISIN"
    },
    {
      linje: "Informasjonsteknologi og økonomi (sivilingeniør)",
      studiekode: "184 803",
      snitt: 58.8,
      sokereMottPerStudieplass: 1.12,
      sokereMott: 28,
      sokereTilbudJaSvar: 39,
      sokereTilbud: 61,
      sokereKvalifisert: 726,
      sokere: 841,
      planlagteStudieplasser: 25,
      universitet: "uib",
      beskrivelse: "Sivilingeniørutdanning med fokus på informasjonsteknologi og økonomi",
      link: "https://www.uib.no/studier/MASV-INFOKT"
    },
    {
      linje: "Medisin, Bergen/Stavanger",
      studiekode: "184 499",
      snitt: 58.5,
      sokereMottPerStudieplass: 1.175,
      sokereMott: 47,
      sokereTilbudJaSvar: 56,
      sokereTilbud: 85,
      sokereKvalifisert: 2036,
      sokere: 2434,
      planlagteStudieplasser: 40,
      universitet: "uib",
      beskrivelse: "Profesjonsstudiet i medisin ved UiB, med deler av studiet i Stavanger",
      link: "https://www.uib.no/studier/PRMEDISIN"
    },
    {
      linje: "Medisinsk teknologi (sivilingeniør)",
      studiekode: "184 783",
      snitt: 57.5,
      sokereMottPerStudieplass: 0.96875,
      sokereMott: 31,
      sokereTilbudJaSvar: 39,
      sokereTilbud: 72,
      sokereKvalifisert: 621,
      sokere: 714,
      planlagteStudieplasser: 32,
      universitet: "uib",
      beskrivelse: "Sivilingeniørutdanning innen medisinsk teknologi",
      link: "https://www.uib.no/studier/MASV-MEDTEK"
    },
    {
      linje: "Psykologi, profesjonsstudium",
      studiekode: "184 941",
      snitt: 57.4,
      sokereMottPerStudieplass: 1.08045977,
      sokereMott: 94,
      sokereTilbudJaSvar: 107,
      sokereTilbud: 164,
      sokereKvalifisert: 2813,
      sokere: 2874,
      planlagteStudieplasser: 87,
      universitet: "uib",
      beskrivelse: "Profesjonsstudiet i psykologi, gir rett til å bruke tittelen psykolog",
      link: "https://www.uib.no/studier/PRPSYK"
    }
  ],
  oslomet: [
    {
      linje: "Kunst og design - mote og produksjon",
      studiekode: "215 472",
      snitt: 50.5,
      sokereMottPerStudieplass: 1.0,
      sokereMott: 24.0,
      sokereTilbudJaSvar: 28.0,
      sokereTilbud: 54.0,
      sokereKvalifisert: 737.0,
      sokere: 778.0,
      planlagteStudieplasser: 24.0,
      universitet: "oslomet",
      beskrivelse: "En kreativ utdanning innen motedesign og produksjon",
      link: "https://www.oslomet.no/studier/tk/estetiske-fag/kunst-og-design"
    },
    {
      linje: "Økonomi og administrasjon - siviløkonom",
      studiekode: "215 345",
      snitt: 49.0,
      sokereMottPerStudieplass: 1.1,
      sokereMott: 101.0,
      sokereTilbudJaSvar: 141.0,
      sokereTilbud: 270.0,
      sokereKvalifisert: 1365.0,
      sokere: 1757.0,
      planlagteStudieplasser: 95.0,
      universitet: "oslomet",
      beskrivelse: "En femårig siviløkonomutdanning ved OsloMet",
      link: "https://www.oslomet.no/studier/hv/siviloekonom"
    },
    {
      linje: "Journalistikk",
      studiekode: "215 454",
      snitt: 48.9,
      sokereMottPerStudieplass: 1.1,
      sokereMott: 93.0,
      sokereTilbudJaSvar: 107.0,
      sokereTilbud: 221.0,
      sokereKvalifisert: 1458.0,
      sokere: 1822.0,
      planlagteStudieplasser: 85.0,
      universitet: "oslomet",
      beskrivelse: "Norges eldste journalistutdanning",
      link: "https://www.oslomet.no/studier/sam/journalistikk"
    },
    {
      linje: "Fysioterapi",
      studiekode: "215 703",
      snitt: 48.0,
      sokereMottPerStudieplass: 1.0,
      sokereMott: 220.0,
      sokereTilbudJaSvar: 299.0,
      sokereTilbud: 564.0,
      sokereKvalifisert: 3729.0,
      sokere: 3904.0,
      planlagteStudieplasser: 230.0,
      universitet: "oslomet",
      beskrivelse: "Bachelorprogram i fysioterapi ved OsloMet",
      link: "https://www.oslomet.no/studier/hv/fysioterapi"
    },
    {
      linje: "Økonomi og administrasjon",
      studiekode: "215 369",
      snitt: 47.7,
      sokereMottPerStudieplass: 1.0,
      sokereMott: 292.0,
      sokereTilbudJaSvar: 352.0,
      sokereTilbud: 640.0,
      sokereKvalifisert: 4497.0,
      sokere: 4769.0,
      planlagteStudieplasser: 290.0,
      universitet: "oslomet",
      beskrivelse: "Bachelor i økonomi og administrasjon ved OsloMet",
      link: "https://www.oslomet.no/studier/sam/okonomi-administrasjon"
    }
  ]
};
