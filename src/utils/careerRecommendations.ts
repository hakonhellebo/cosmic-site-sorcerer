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

// Complete database of career opportunities per education program
const CAREER_DATA: Record<string, CareerField> = {
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
  "Regnskap og revisjon": {
    educationProgram: "Regnskap og revisjon",
    jobs: [
      { title: "Revisor", description: "Kontrollerer og godkjenner regnskapene til bedrifter og organisasjoner." },
      { title: "Regnskapsrådgiver", description: "Gir råd om regnskapsføring og økonomistyring." },
      { title: "Regnskapssjef", description: "Leder regnskapsavdelingen i en bedrift." },
      { title: "Skatterådgiver", description: "Gir råd om skattemessige forhold for bedrifter og privatpersoner." },
      { title: "Compliance-ansvarlig", description: "Sikrer at bedriften overholder lover og regler innen regnskap og finans." }
    ],
    companies: [
      { name: "Deloitte", website: "https://www2.deloitte.com/no/" },
      { name: "EY", website: "https://www.ey.com/no_no" },
      { name: "PwC", website: "https://www.pwc.no" },
      { name: "KPMG", website: "https://home.kpmg/no/nb/home.html" },
      { name: "BDO", website: "https://www.bdo.no" }
    ],
    match: "Regnskap og revisjon passer for din nøyaktighet og analytiske tilnærming til tall og systemer."
  },
  "Bachelor i shipping management": {
    educationProgram: "Bachelor i shipping management",
    jobs: [
      { title: "Ship Broker", description: "Megler mellom rederier og befraktere for å leie eller selge skip." },
      { title: "Shipping Manager", description: "Ansvarlig for drift og ledelse av shipping-operasjoner." },
      { title: "Chartering Manager", description: "Håndterer avtaler om leie og befraktning av skip." },
      { title: "Maritime Analyst", description: "Analyserer markedstrender og risiko i shippingmarkedet." },
      { title: "Supply Chain Coordinator", description: "Koordinerer logistikk og forsyningskjeder innen sjøtransport." }
    ],
    companies: [
      { name: "DNB Shipping", website: "https://www.dnb.no/bedrift/bransjer/shipping-offshore-logistics" },
      { name: "Grieg Star", website: "https://griegstar.com/" },
      { name: "Klaveness", website: "https://www.klaveness.com/" },
      { name: "Wilhelmsen", website: "https://www.wilhelmsen.com/" },
      { name: "Wallenius Wilhelmsen", website: "https://www.walleniuswilhelmsen.com/" }
    ],
    match: "Bachelor i shipping management er ideell for deg som er interessert i maritim næring og internasjonal handel."
  },
  "Finans": {
    educationProgram: "Finans",
    jobs: [
      { title: "Finansanalytiker", description: "Analyserer økonomiske data og markedstrender for å gi investeringsråd." },
      { title: "Økonomikonsulent", description: "Gir råd om økonomiske spørsmål og finansiell planlegging." },
      { title: "Investeringsrådgiver", description: "Veileder kunder om investeringsmuligheter og risikostyring." },
      { title: "Fondsforvalter", description: "Forvalter investeringsfond og tar beslutninger om kjøp og salg av verdipapirer." },
      { title: "Risikokonsulent", description: "Analyserer finansiell risiko og utvikler strategier for risikostyring." }
    ],
    companies: [
      { name: "DNB", website: "https://www.dnb.no" },
      { name: "ABG Sundal Collier", website: "https://www.abgsc.com" },
      { name: "Pareto Securities", website: "https://www.paretosec.com" },
      { name: "Carnegie", website: "https://www.carnegie.no" },
      { name: "Nordea Asset Management", website: "https://www.nordea.no/asset-management" }
    ],
    match: "Finansutdanning er ideell for din interesse for økonomiske analyser og finansmarkeder."
  },
  "Bachelor i finans": {
    educationProgram: "Bachelor i finans",
    jobs: [
      { title: "Finansanalytiker", description: "Analyserer økonomiske data og markedstrender for å gi investeringsråd." },
      { title: "Økonomikonsulent", description: "Gir råd om økonomiske spørsmål og finansiell planlegging." },
      { title: "Investeringsrådgiver", description: "Veileder kunder om investeringsmuligheter og risikostyring." },
      { title: "Fondsforvalter", description: "Forvalter investeringsfond og tar beslutninger om kjøp og salg av verdipapirer." },
      { title: "Risikokonsulent", description: "Analyserer finansiell risiko og utvikler strategier for risikostyring." }
    ],
    companies: [
      { name: "DNB", website: "https://www.dnb.no" },
      { name: "ABG Sundal Collier", website: "https://www.abgsc.com" },
      { name: "Pareto Securities", website: "https://www.paretosec.com" },
      { name: "Carnegie", website: "https://www.carnegie.no" },
      { name: "Nordea Asset Management", website: "https://www.nordea.no/asset-management" }
    ],
    match: "Bachelor i finans gir deg muligheter innen finansanalyse, rådgivning og forvaltning."
  },
  "Master i finans": {
    educationProgram: "Master i finans",
    jobs: [
      { title: "Finansanalytiker", description: "Analyserer økonomiske data og markedstrender for å gi investeringsråd." },
      { title: "Økonomikonsulent", description: "Gir råd om økonomiske spørsmål og finansiell planlegging." },
      { title: "Investeringsrådgiver", description: "Veileder kunder om investeringsmuligheter og risikostyring." },
      { title: "Fondsforvalter", description: "Forvalter investeringsfond og tar beslutninger om kjøp og salg av verdipapirer." },
      { title: "Risikokonsulent", description: "Analyserer finansiell risiko og utvikler strategier for risikostyring." }
    ],
    companies: [
      { name: "DNB", website: "https://www.dnb.no" },
      { name: "ABG Sundal Collier", website: "https://www.abgsc.com" },
      { name: "Pareto Securities", website: "https://www.paretosec.com" },
      { name: "Carnegie", website: "https://www.carnegie.no" },
      { name: "Nordea Asset Management", website: "https://www.nordea.no/asset-management" }
    ],
    match: "En master i finans åpner for karrieremuligheter innen avansert finansanalyse og ledelse."
  },
  "Odontologi": {
    educationProgram: "Odontologi (tannlege)",
    jobs: [
      { title: "Allmennpraktiserende tannlege", description: "Utfører generell tannbehandling for pasienter i alle aldre." },
      { title: "Spesialist i kjeveortopedi", description: "Arbeider med tannregulering og behandling av bittfeil." },
      { title: "Oral kirurg", description: "Utfører kompliserte tannekstraksjoner og andre kirurgiske inngrep i munnhulen." },
      { title: "Tannlege i offentlig helseklinikk", description: "Jobber med forebyggende tannhelse i offentlig sektor." },
      { title: "Forsker innen odontologi", description: "Arbeider med forskningsprosjekter for å utvikle nye behandlingsmetoder." }
    ],
    companies: [
      { name: "Tannhelsetjenesten Oslo", website: "https://www.oslo.kommune.no/tannhelse/" },
      { name: "Unilabs Tannrøntgen", website: "https://unilabs.no" },
      { name: "Universitetet i Bergen", website: "https://www.uib.no" },
      { name: "Oslo Tannlegesenter", website: "https://oslotannlegesenter.no" },
      { name: "Tannlegeforeningen", website: "https://www.tannlegeforeningen.no" }
    ],
    match: "Odontologi er perfekt for deg som er interessert i kombinasjonen av helsearbeid og presisjonshåndverk."
  }
};

// Helper function to clean and normalize a program name for comparison
function normalizeProgram(program: string): string {
  return program
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\såøæéèêëíìîïóòôõúùûüÿýçñ]/g, '');
}

// Enhanced mapping function to better match education programs to career opportunities
export function getCareerRecommendations(educationPrograms: string[]): CareerField[] {
  if (!educationPrograms || educationPrograms.length === 0) {
    return [];
  }

  return educationPrograms.map(program => {
    const normalizedProgram = normalizeProgram(program);
    console.log(`Looking for career matches for: "${program}" (normalized: "${normalizedProgram}")`);
    
    // Direct match with program name
    for (const key of Object.keys(CAREER_DATA)) {
      if (normalizeProgram(key) === normalizedProgram) {
        console.log(`Found direct match: ${key}`);
        return CAREER_DATA[key];
      }
    }
    
    // Check for specific keywords in the program name
    if (normalizedProgram.includes("medisin") || normalizedProgram.includes("lege")) {
      console.log("Matched with Medicine based on keywords");
      return CAREER_DATA["Medisin"];
    }
    
    if (normalizedProgram.includes("psykologi") || normalizedProgram.includes("terapi")) {
      console.log("Matched with Psychology based on keywords");
      return CAREER_DATA["Psykologi"];
    }
    
    if (normalizedProgram.includes("odontologi") || normalizedProgram.includes("tann")) {
      console.log("Matched with Odontology based on keywords");
      return CAREER_DATA["Odontologi"];
    }
    
    if (normalizedProgram.includes("økonomi") && (normalizedProgram.includes("administrasjon") || normalizedProgram.includes("admin"))) {
      console.log("Matched with Business Administration based on keywords");
      return CAREER_DATA["Økonomi og administrasjon"];
    }
    
    if (normalizedProgram.includes("informatikk") || normalizedProgram.includes("data") || 
        normalizedProgram.includes("it") || normalizedProgram.includes("programmering")) {
      console.log("Matched with Computer Science based on keywords");
      return CAREER_DATA["Informatikk"];
    }
    
    if (normalizedProgram.includes("ingeniør") && !normalizedProgram.includes("energi")) {
      console.log("Matched with Engineering based on keywords");
      return CAREER_DATA["Ingeniør"];
    }
    
    if ((normalizedProgram.includes("fornybar") && normalizedProgram.includes("energi")) || 
        (normalizedProgram.includes("energi") && normalizedProgram.includes("ingeniør"))) {
      console.log("Matched with Renewable Energy based on keywords");
      return CAREER_DATA["Fornybar energi"];
    }
    
    if (normalizedProgram.includes("finans")) {
      console.log("Matched with Finance based on keywords");
      if (normalizedProgram.includes("bachelor")) {
        return CAREER_DATA["Bachelor i finans"];
      } else if (normalizedProgram.includes("master")) {
        return CAREER_DATA["Master i finans"];
      } else {
        return CAREER_DATA["Finans"];
      }
    }
    
    if (normalizedProgram.includes("shipping") || normalizedProgram.includes("maritim")) {
      console.log("Matched with Shipping Management based on keywords");
      return CAREER_DATA["Bachelor i shipping management"];
    }
    
    if ((normalizedProgram.includes("regnskap") && normalizedProgram.includes("revisjon")) || 
        normalizedProgram.includes("revisor")) {
      console.log("Matched with Accounting based on keywords");
      return CAREER_DATA["Regnskap og revisjon"];
    }
    
    // Partial matches if no exact match found
    for (const key of Object.keys(CAREER_DATA)) {
      const normalizedKey = normalizeProgram(key);
      if (normalizedProgram.includes(normalizedKey) || normalizedKey.includes(normalizedProgram)) {
        console.log(`Found partial match: ${key}`);
        return CAREER_DATA[key];
      }
    }

    console.log(`No specific career match found for: ${program}, using default career options`);
    
    // Default generic field if no match found
    return {
      educationProgram: program,
      jobs: [
        { title: "Fagspesialist", description: "Jobber som spesialist innen ditt fagfelt." },
        { title: "Prosjektleder", description: "Leder prosjekter relatert til din fagkompetanse." },
        { title: "Rådgiver", description: "Gir faglige råd og veiledning basert på din kompetanse." },
        { title: "Forsker", description: "Utfører forskningsarbeid innenfor relevante fagområder." },
        { title: "Faglærer", description: "Underviser andre i ditt spesialområde." }
      ],
      companies: [
        { name: "Universiteter og høyskoler", website: "https://www.samordnaopptak.no" },
        { name: "Forskningsinstitusjoner", website: "https://www.forskningsradet.no" },
        { name: "Offentlige virksomheter", website: "https://www.nav.no" },
        { name: "Konsulentselskaper", website: "https://www.finn.no/job" },
        { name: "Bransjeorganisasjoner", website: "https://www.nho.no" }
      ],
      match: "Dette utdanningsprogrammet kan åpne for mange ulike karrieremuligheter."
    };
  });
}
