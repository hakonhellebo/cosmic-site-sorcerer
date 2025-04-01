
interface Company {
  name: string;
  website: string;
}

interface JobOpportunity {
  title: string;
  description: string;
}

interface CareerField {
  educationProgram: string;
  jobs: JobOpportunity[];
  companies: Company[];
  match?: string;
}

const DEFAULT_CAREER_DATA: Record<string, CareerField> = {
  "Medisin": {
    educationProgram: "Medisin",
    jobs: [
      { title: "Fastlege", description: "Jobber med allmennmedisin og er pasientens første kontaktpunkt i helsevesenet." },
      { title: "Lege i akuttmottak", description: "Behandler akutte tilstander og skader som krever øyeblikkelig hjelp." },
      { title: "Folkehelselege", description: "Arbeider med forebyggende helsearbeid og folkehelse på samfunnsnivå." },
      { title: "Forsker eller medisinsk rådgiver", description: "Utfører medisinsk forskning eller gir ekspertrådgivning innen helsesektoren." },
      { title: "Patolog", description: "Spesialist i diagnostisering av sykdommer gjennom undersøkelse av vev og celler." }
    ],
    companies: [
      { name: "Oslo Universitetssykehus", website: "https://oslo-universitetssykehus.no" },
      { name: "Haukeland Universitetssjukehus", website: "https://helse-bergen.no" },
      { name: "Folkehelseinstituttet", website: "https://www.fhi.no" },
      { name: "Helsedirektoratet", website: "https://www.helsedirektoratet.no" },
      { name: "NTNU", website: "https://www.ntnu.no" }
    ],
    match: "Denne utdanningen passer til din interesse for helse og omsorg, samt dine analytiske evner."
  },
  "Psykologi": {
    educationProgram: "Psykologi (profesjonsstudium)",
    jobs: [
      { title: "Klinisk psykolog", description: "Jobber med utredning, diagnostisering og behandling av psykiske lidelser." },
      { title: "Barne- og ungdomspsykolog", description: "Spesialiserer seg på psykiske problemer hos barn og unge." },
      { title: "Organisasjonspsykolog", description: "Jobber med psykologiske prosesser i organisasjoner og arbeidsliv." },
      { title: "Forsker", description: "Utfører forskning innen psykologiske fagområder." },
      { title: "Skolepsykolog", description: "Arbeider med psykisk helse i skolesystemet og støtter barn i utdanningssituasjoner." }
    ],
    companies: [
      { name: "Akershus universitetssykehus", website: "https://www.ahus.no" },
      { name: "Oslo Universitetssykehus", website: "https://oslo-universitetssykehus.no" },
      { name: "Folkehelseinstituttet", website: "https://www.fhi.no" },
      { name: "NTNU", website: "https://www.ntnu.no" },
      { name: "Bufetat", website: "https://www.bufdir.no" }
    ],
    match: "Psykologistudiet passer godt med din interesse for mennesker og analytiske tilnærming til problemer."
  },
  "Økonomi og administrasjon": {
    educationProgram: "Økonomi og administrasjon - siviløkonom",
    jobs: [
      { title: "Økonomidirektør", description: "Har overordnet ansvar for en bedrifts økonomistyring og finansielle strategi." },
      { title: "Finansanalytiker", description: "Analyserer økonomiske data og markedstrender for å gi investeringsråd." },
      { title: "Strategikonsulent", description: "Gir strategiske råd til bedrifter for å forbedre deres markedsposisjon og lønnsomhet." },
      { title: "Revisor", description: "Kontrollerer at regnskap er korrekte og i samsvar med gjeldende lover og regler." },
      { title: "Controller", description: "Overvåker økonomiske prosesser og bidrar til bedre økonomistyring i en organisasjon." }
    ],
    companies: [
      { name: "Equinor", website: "https://www.equinor.com" },
      { name: "DNB", website: "https://www.dnb.no" },
      { name: "PwC", website: "https://www.pwc.no" },
      { name: "EY", website: "https://www.ey.com/no_no" },
      { name: "Deloitte", website: "https://www2.deloitte.com/no/" }
    ],
    match: "Denne utdanningen passer godt med dine analytiske evner og interesse for økonomisk styring."
  },
  "Informatikk": {
    educationProgram: "Informatikk",
    jobs: [
      { title: "Programvareutvikler", description: "Utvikler programvare og applikasjoner for ulike plattformer." },
      { title: "Systemutvikler", description: "Designer, implementerer og vedlikeholder større IT-systemer." },
      { title: "IT-konsulent", description: "Gir råd til bedrifter om teknologiske løsninger og implementerer disse." },
      { title: "Dataanalytiker", description: "Analyserer store datamengder for å finne mønstre og innsikt." },
      { title: "IT-prosjektleder", description: "Leder komplekse IT-prosjekter fra start til slutt." }
    ],
    companies: [
      { name: "TietoEVRY", website: "https://www.tietoevry.com" },
      { name: "Aker Solutions", website: "https://www.akersolutions.com" },
      { name: "DNV", website: "https://www.dnv.com" },
      { name: "Sopra Steria", website: "https://www.soprasteria.no" },
      { name: "Bouvet", website: "https://www.bouvet.no" }
    ],
    match: "Informatikk passer godt med din analytiske tilnærming og teknologiinteresse."
  },
  "Ingeniør": {
    educationProgram: "Ingeniørfag",
    jobs: [
      { title: "Byggingeniør", description: "Planlegger og gjennomfører byggeprosjekter av ulik størrelse." },
      { title: "Maskiningeniør", description: "Arbeider med utvikling, konstruksjon og vedlikehold av maskiner og mekaniske systemer." },
      { title: "Elektroingeniør", description: "Jobber med utvikling og vedlikehold av elektriske systemer og komponenter." },
      { title: "Prosessingeniør", description: "Optimaliserer industrielle prosesser og produksjonslinjer." },
      { title: "Prosjektingeniør", description: "Koordinerer tekniske prosjekter fra planlegging til gjennomføring." }
    ],
    companies: [
      { name: "Multiconsult", website: "https://www.multiconsult.no" },
      { name: "Norconsult", website: "https://www.norconsult.no" },
      { name: "Aker Solutions", website: "https://www.akersolutions.com" },
      { name: "Kongsberg Gruppen", website: "https://www.kongsberg.com" },
      { name: "Equinor", website: "https://www.equinor.com" }
    ],
    match: "Ingeniørstudier matcher din analytiske evne og interesse for praktisk problemløsning."
  },
  "Journalistikk": {
    educationProgram: "Journalistikk",
    jobs: [
      { title: "Journalist", description: "Undersøker og rapporterer nyheter for ulike medier." },
      { title: "Redaktør", description: "Har ansvar for innholdet i mediepublikasjoner." },
      { title: "Innholdsprodusent", description: "Skaper innhold for ulike kommunikasjonskanaler." },
      { title: "Kommunikasjonsrådgiver", description: "Gir råd om kommunikasjonsstrategier og mediekontakt." },
      { title: "Pressesekretær", description: "Håndterer mediekontakt for organisasjoner og offentlige personer." }
    ],
    companies: [
      { name: "NRK", website: "https://www.nrk.no" },
      { name: "TV 2", website: "https://www.tv2.no" },
      { name: "Aftenposten", website: "https://www.aftenposten.no" },
      { name: "VG", website: "https://www.vg.no" },
      { name: "Schibsted", website: "https://schibsted.com" }
    ],
    match: "Journalistikk passer godt med din kommunikasjonsevne og samfunnsinteresse."
  },
  "Fornybar energi": {
    educationProgram: "Fornybar energi, ingeniørutdanning",
    jobs: [
      { title: "Energiingeniør", description: "Jobber med utvikling og implementering av energiløsninger." },
      { title: "Prosjektleder i vind- eller solkraftutbygging", description: "Leder prosjekter for utbygging av fornybar energi." },
      { title: "Miljøingeniør", description: "Arbeider med miljøvennlige teknologiske løsninger." },
      { title: "Energianalytiker", description: "Analyserer energimarkedet og energiløsninger." },
      { title: "Rådgiver i energiforvaltning", description: "Gir råd om effektiv energibruk og energiløsninger." }
    ],
    companies: [
      { name: "Statkraft", website: "https://www.statkraft.no" },
      { name: "Equinor", website: "https://www.equinor.com" },
      { name: "Scatec", website: "https://scatec.com" },
      { name: "Aker Offshore Wind", website: "https://www.akeroffshorewind.com" },
      { name: "Siemens Gamesa", website: "https://www.siemensgamesa.com" }
    ],
    match: "Utdanning innen fornybar energi matcher din interesse for bærekraft og teknologisk innovasjon."
  },
  "Økonomi og ledelse": {
    educationProgram: "Økonomi og ledelse",
    jobs: [
      { title: "Økonomikonsulent", description: "Gir råd om økonomistyring og regnskapsmessige forhold." },
      { title: "Bedriftsrådgiver", description: "Hjelper bedrifter med å forbedre sine forretningsprosesser." },
      { title: "Regnskapsfører", description: "Fører og kontrollerer regnskap for bedrifter." },
      { title: "Controller", description: "Overvåker og kontrollerer økonomiske prosesser i en organisasjon." },
      { title: "HR-ansvarlig", description: "Har ansvar for personalpolitikk og ansettelser." }
    ],
    companies: [
      { name: "Deloitte", website: "https://www2.deloitte.com/no/" },
      { name: "EY", website: "https://www.ey.com/no_no" },
      { name: "PwC", website: "https://www.pwc.no" },
      { name: "KPMG", website: "https://home.kpmg/no/nb/home.html" },
      { name: "DNB", website: "https://www.dnb.no" }
    ],
    match: "Denne utdanningen passer godt med din organisatoriske evne og interesse for forretningsutvikling."
  },
  "Kunst og design": {
    educationProgram: "Kunst og design - mote og produksjon",
    jobs: [
      { title: "Klesdesigner", description: "Designer klær og tilbehør for mote- og tekstilindustrien." },
      { title: "Mønsterkonstruktør", description: "Utvikler mønstre og maler for produksjon av klesplagg." },
      { title: "Produksjonsleder i tekstilbransjen", description: "Leder produksjonsprosesser i tekstil- og moteindustrien." },
      { title: "Materialspesialist", description: "Arbeider med utvikling og testing av tekstiler og materialer." },
      { title: "Produktutvikler innen moteindustrien", description: "Utvikler nye produktlinjer og konsepter for motebransjen." }
    ],
    companies: [
      { name: "Høyer", website: "https://www.hoyer.no" },
      { name: "Holzweiler", website: "https://holzweiler.no" },
      { name: "Helly Hansen", website: "https://www.hellyhansen.com" },
      { name: "Varner-Gruppen", website: "https://varner.com" },
      { name: "Bergans", website: "https://www.bergans.com" }
    ],
    match: "Denne utdanningen passer godt med din kreative evne og interesse for design og estetikk."
  },
  "Fysioterapi": {
    educationProgram: "Fysioterapi",
    jobs: [
      { title: "Fysioterapeut i primærhelsetjenesten", description: "Behandler pasienter med muskel- og skjelettplager i kommunal helsetjeneste." },
      { title: "Fysioterapeut ved sykehus", description: "Jobber med rehabilitering og behandling av pasienter på sykehus." },
      { title: "Idrettsfysioterapeut", description: "Spesialiserer seg på behandling og forebygging av idrettsskader." },
      { title: "Barnefysioterapeut", description: "Arbeider med motorisk utvikling og behandling av barn." },
      { title: "Privatpraktiserende fysioterapeut", description: "Driver egen praksis og behandler ulike pasientgrupper." }
    ],
    companies: [
      { name: "Oslo kommune", website: "https://www.oslo.kommune.no" },
      { name: "Helse Bergen", website: "https://helse-bergen.no" },
      { name: "Oslo Universitetssykehus", website: "https://oslo-universitetssykehus.no" },
      { name: "Olympiatoppen", website: "https://www.olympiatoppen.no" },
      { name: "Friskis&Svettis", website: "https://www.friskissvettis.no" }
    ],
    match: "Fysioterapi passer godt med din interesse for helse og praktisk arbeid med mennesker."
  }
};

export function getCareerRecommendations(educationPrograms: string[]): CareerField[] {
  if (!educationPrograms || educationPrograms.length === 0) {
    return [];
  }

  return educationPrograms.map(program => {
    const matchingProgram = Object.keys(DEFAULT_CAREER_DATA).find(key => 
      program.toLowerCase().includes(key.toLowerCase())
    );

    if (matchingProgram) {
      return DEFAULT_CAREER_DATA[matchingProgram];
    }

    // If no exact match, return a generic recommendation
    return {
      educationProgram: program,
      jobs: [
        { title: "Fagspesialist", description: "Jobber som spesialist innen ditt fagfelt." },
        { title: "Prosjektleder", description: "Leder prosjekter relatert til din fagkompetanse." },
        { title: "Rådgiver", description: "Gir faglige råd og veiledning basert på din kompetanse." }
      ],
      companies: [
        { name: "FINN.no", website: "https://www.finn.no/job" },
        { name: "NAV", website: "https://www.nav.no" },
        { name: "Manpower", website: "https://www.manpower.no" }
      ],
      match: "Dette utdanningsprogrammet kan åpne for mange ulike karrieremuligheter."
    };
  });
}
