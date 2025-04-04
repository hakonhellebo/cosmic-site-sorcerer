
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

// Helper function to clean and normalize a program name for comparison
function normalizeProgram(program: string): string {
  return program
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\såøæéèêëíìîïóòôõúùûüÿýçñ]/g, '');
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
      { title: "Patolog", description: "Spesialist i diagnostisering av sykdommer gjennom undersøkelse av vev og celler." },
      { title: "Radiolog", description: "Spesialist i tolkning av medisinske bilder for diagnostisering av sykdommer." },
      { title: "Barnelege", description: "Spesialiserer seg på behandling av barn og ungdom." },
      { title: "Anestesiolog", description: "Administrerer bedøvelse og følger opp pasienter under og etter operasjoner." },
      { title: "Onkolog", description: "Spesialiserer seg på diagnostisering og behandling av kreft." }
    ],
    companies: [
      { name: "Kommunale fastlegekontorer", website: "https://www.oslo.kommune.no/helse/" },
      { name: "Oslo Universitetssykehus", website: "https://oslo-universitetssykehus.no" },
      { name: "Haukeland Universitetssjukehus", website: "https://helse-bergen.no" },
      { name: "Folkehelseinstituttet", website: "https://www.fhi.no" },
      { name: "Helsedirektoratet", website: "https://www.helsedirektoratet.no" },
      { name: "NTNU", website: "https://www.ntnu.no" },
      { name: "SINTEF", website: "https://www.sintef.no" },
      { name: "Unilabs", website: "https://unilabs.no" },
      { name: "Aleris", website: "https://www.aleris.no" },
      { name: "GE Healthcare", website: "https://www.gehealthcare.no" }
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
      { title: "Psykolog i spesialisthelsetjenesten", description: "Arbeider med psykisk helse i spesialisthelsetjenesten." },
      { title: "Veileder/coach", description: "Gir psykologisk veiledning og coaching til individer eller grupper." },
      { title: "Skolepsykolog", description: "Arbeider med psykisk helse i skolesystemet og støtter barn i utdanningssituasjoner." }
    ],
    companies: [
      { name: "Akershus universitetssykehus", website: "https://www.ahus.no" },
      { name: "Oslo Universitetssykehus", website: "https://oslo-universitetssykehus.no" },
      { name: "Folkehelseinstituttet", website: "https://www.fhi.no" },
      { name: "NTNU", website: "https://www.ntnu.no" },
      { name: "Bufetat", website: "https://www.bufdir.no" },
      { name: "St. Olavs hospital", website: "https://stolav.no" },
      { name: "Diakonhjemmet sykehus", website: "https://diakonhjemmetsykehus.no" },
      { name: "Lovisenberg Diakonale Sykehus", website: "https://www.lds.no" },
      { name: "Helse Bergen", website: "https://helse-bergen.no" },
      { name: "Vestre Viken HF", website: "https://vestreviken.no" }
    ],
    match: "Psykologistudiet passer godt med din interesse for mennesker og analytiske tilnærming til problemer."
  },
  "Odontologi": {
    educationProgram: "Odontologi (tannlege)",
    jobs: [
      { title: "Allmennpraktiserende tannlege", description: "Utfører generell tannbehandling for pasienter i alle aldre." },
      { title: "Spesialist i kjeveortopedi", description: "Arbeider med tannregulering og behandling av bittfeil." },
      { title: "Oral kirurg og oralmedisiner", description: "Utfører kompliserte tannekstraksjoner og andre kirurgiske inngrep i munnhulen." },
      { title: "Tannpleier (for videreutdannede)", description: "Fokuserer på forebyggende tannpleie og tannrens." },
      { title: "Forsker eller foreleser innen odontologi", description: "Arbeider med forskningsprosjekter eller underviser innen tannhelse." },
      { title: "Tannlege i offentlig helseklinikk", description: "Jobber med forebyggende tannhelse i offentlig sektor." },
      { title: "Implantatspesialist", description: "Spesialiserer seg på tannimplantater og protetikk." },
      { title: "Tannlege i humanitære organisasjoner", description: "Gir tannhelsetjenester til trengende grupper i Norge eller internasjonalt." }
    ],
    companies: [
      { name: "Tannhelsetjenesten Oslo", website: "https://www.oslo.kommune.no/tannhelse/" },
      { name: "Haukeland Universitetssjukehus", website: "https://helse-bergen.no" },
      { name: "Unilabs Tannrøntgen", website: "https://unilabs.no" },
      { name: "Universitetet i Bergen", website: "https://www.uib.no" },
      { name: "Nor Tannlegesenter", website: "https://nortannlegesenter.no" },
      { name: "Oslo Tannlegesenter", website: "https://oslotannlegesenter.no" },
      { name: "Tannlegeforeningen", website: "https://www.tannlegeforeningen.no" },
      { name: "Universitetet i Oslo", website: "https://www.uio.no" },
      { name: "Helse Nord RHF", website: "https://helse-nord.no" },
      { name: "MyDentist", website: "https://mydentist.no" }
    ],
    match: "Odontologi er perfekt for deg som er interessert i kombinasjonen av helsearbeid og presisjonshåndverk."
  },
  "Farmasi": {
    educationProgram: "Farmasi (bachelor)",
    jobs: [
      { title: "Reseptarfarmasøyt", description: "Håndterer reseptbelagte legemidler og gir råd om legemiddelbruk." },
      { title: "Farmasøyt i apotek", description: "Gir legemiddelrådgivning og veileder kunder om riktig legemiddelbruk." },
      { title: "Farmasøyt i sykehusapotek", description: "Spesialiserer seg på legemiddelbruk i sykehus og sykehusapotek." },
      { title: "Medisinsk rådgiver i farmasøytisk industri", description: "Gir faglige råd om legemidler til helsepersonell og myndigheter." },
      { title: "Forsker", description: "Arbeider med forskning på legemidler og farmakologi." },
      { title: "Klinisk farmasøyt", description: "Jobber med legemiddelgjennomganger og optimalisering av legemiddelbruk." },
      { title: "Salgskonsulent i legemiddelfirma", description: "Markedsfører legemidler til apotek og helsepersonell." },
      { title: "Faglig leder i apotek", description: "Har overordnet faglig ansvar for drift av apotek." }
    ],
    companies: [
      { name: "Boots Apotek", website: "https://www.boots.no" },
      { name: "Vitusapotek", website: "https://www.vitusapotek.no" },
      { name: "Sykehusapotekene HF", website: "https://sykehusapotekene.no" },
      { name: "Pfizer Norge", website: "https://www.pfizer.no" },
      { name: "Novartis Norge", website: "https://www.novartis.no" },
      { name: "Apotek 1", website: "https://www.apotek1.no" },
      { name: "MSD Norge", website: "https://www.msd.no" },
      { name: "Sandoz Norge", website: "https://www.sandoz.no" },
      { name: "AstraZeneca Norge", website: "https://www.astrazeneca.no" },
      { name: "Roche Norge", website: "https://www.roche.no" }
    ],
    match: "Farmasi passer godt med din strukturerte og analytiske tilnærming."
  },
  "Sykepleie": {
    educationProgram: "Sykepleie",
    jobs: [
      { title: "Allmennsykepleier", description: "Jobber med pleie og behandling av pasienter på sengeposter." },
      { title: "Intensivsykepleier", description: "Spesialiserer seg på behandling av kritisk syke pasienter." },
      { title: "Kreftsykepleier", description: "Jobber med pasienter med kreft og deres pårørende." },
      { title: "Anestesisykepleier", description: "Bistår ved anestesi og overvåker pasienter under operasjoner." },
      { title: "Psykiatrisk sykepleier", description: "Spesialiserer seg på pasienter med psykiske lidelser." },
      { title: "Hjemmesykepleier", description: "Gir sykepleie til pasienter i deres eget hjem." },
      { title: "Skolesykepleier", description: "Jobber med forebyggende helsearbeid i skolen." },
      { title: "Forsker", description: "Arbeider med forskning innen sykepleievitenskap." }
    ],
    companies: [
      { name: "Helse Bergen", website: "https://helse-bergen.no" },
      { name: "Helse Sør-Øst RHF", website: "https://www.helse-sorost.no" },
      { name: "Sykehuset Innlandet HF", website: "https://sykehuset-innlandet.no" },
      { name: "St. Olavs hospital", website: "https://stolav.no" },
      { name: "Oslo Universitetssykehus", website: "https://oslo-universitetssykehus.no" },
      { name: "Diakonhjemmet Sykehus", website: "https://diakonhjemmetsykehus.no" },
      { name: "Aleris", website: "https://www.aleris.no" },
      { name: "Lovisenberg Diakonale Sykehus", website: "https://www.lds.no" },
      { name: "Vestre Viken HF", website: "https://vestreviken.no" },
      { name: "UNN – Universitetssykehuset Nord-Norge", website: "https://unn.no" }
    ],
    match: "Sykepleie passer for deg som ønsker å kombinere omsorg for mennesker med faglig kunnskap."
  },
  "Økonomi og administrasjon": {
    educationProgram: "Økonomi og administrasjon - siviløkonom",
    jobs: [
      { title: "Økonomidirektør", description: "Har overordnet ansvar for en bedrifts økonomistyring og finansielle strategi." },
      { title: "Finansanalytiker", description: "Analyserer økonomiske data og markedstrender for å gi investeringsråd." },
      { title: "Strategikonsulent", description: "Gir strategiske råd til bedrifter for å forbedre deres markedsposisjon og lønnsomhet." },
      { title: "Revisor", description: "Kontrollerer at regnskap er korrekte og i samsvar med gjeldende lover og regler." },
      { title: "Controller", description: "Overvåker økonomiske prosesser og bidrar til bedre økonomistyring i en organisasjon." },
      { title: "Forretningsutvikler", description: "Identifiserer og utvikler nye forretningsmuligheter for bedrifter." },
      { title: "Leder innen bank og forsikring", description: "Leder avdelinger eller team innen finanssektoren." },
      { title: "Prosjektleder innen økonomi og finans", description: "Leder finansielle prosjekter fra start til slutt." }
    ],
    companies: [
      { name: "Equinor", website: "https://www.equinor.com" },
      { name: "Statkraft", website: "https://www.statkraft.no" },
      { name: "DNB", website: "https://www.dnb.no" },
      { name: "PwC", website: "https://www.pwc.no" },
      { name: "EY", website: "https://www.ey.com/no_no" },
      { name: "Deloitte", website: "https://www2.deloitte.com/no/" },
      { name: "Norges Bank", website: "https://www.norges-bank.no" },
      { name: "Nordea", website: "https://www.nordea.no" },
      { name: "Sparebank 1", website: "https://www.sparebank1.no" },
      { name: "Aker Solutions", website: "https://www.akersolutions.com" }
    ],
    match: "Denne utdanningen passer godt med dine analytiske evner og interesse for økonomisk styring."
  },
  "Informatikk": {
    educationProgram: "Informatikk - bachelor",
    jobs: [
      { title: "Programvareutvikler", description: "Utvikler programvare og applikasjoner for ulike plattformer." },
      { title: "Systemutvikler", description: "Designer, implementerer og vedlikeholder større IT-systemer." },
      { title: "IT-konsulent", description: "Gir råd til bedrifter om teknologiske løsninger og implementerer disse." },
      { title: "Dataanalytiker", description: "Analyserer store datamengder for å finne mønstre og innsikt." },
      { title: "IT-prosjektleder", description: "Leder komplekse IT-prosjekter fra start til slutt." },
      { title: "DevOps-ingeniør", description: "Jobber med automatisering og integrasjon av utviklings- og driftsprosesser." },
      { title: "Løsningsarkitekt", description: "Designer helhetlige IT-løsninger som tilfredsstiller bedriftens behov." },
      { title: "IT-sikkerhetskonsulent", description: "Spesialiserer seg på datasikkerhet og beskyttelse mot trusler." }
    ],
    companies: [
      { name: "TietoEVRY", website: "https://www.tietoevry.com" },
      { name: "Aker Solutions", website: "https://www.akersolutions.com" },
      { name: "DNV", website: "https://www.dnv.com" },
      { name: "Sopra Steria", website: "https://www.soprasteria.no" },
      { name: "Bouvet", website: "https://www.bouvet.no" },
      { name: "Capgemini", website: "https://www.capgemini.com/no-no/" },
      { name: "Computas", website: "https://www.computas.com" },
      { name: "Microsoft Norge", website: "https://www.microsoft.com/nb-no/" },
      { name: "Kongsberg Gruppen", website: "https://www.kongsberg.com" },
      { name: "Cisco Norge", website: "https://www.cisco.com/c/no_no/" }
    ],
    match: "Informatikk passer godt med din analytiske tilnærming og teknologiinteresse."
  },
  "Fornybar energi": {
    educationProgram: "Fornybar energi, ingeniørutdanning",
    jobs: [
      { title: "Energiingeniør", description: "Jobber med utvikling og implementering av energiløsninger." },
      { title: "Prosjektleder i vind- eller solkraftutbygging", description: "Leder prosjekter for utbygging av fornybar energi." },
      { title: "Miljøingeniør", description: "Arbeider med miljøvennlige teknologiske løsninger." },
      { title: "Energianalytiker", description: "Analyserer energimarkedet og energiløsninger." },
      { title: "Rådgiver i energiforvaltning", description: "Gir råd om effektiv energibruk og energiløsninger." },
      { title: "Bærekraftkonsulent", description: "Gir råd om bærekraftige energiløsninger for private og offentlige virksomheter." }
    ],
    companies: [
      { name: "Statkraft", website: "https://www.statkraft.no" },
      { name: "Fortum", website: "https://www.fortum.no" },
      { name: "Scatec", website: "https://scatec.com" },
      { name: "Aker Offshore Wind", website: "https://www.akeroffshorewind.com" },
      { name: "Equinor", website: "https://www.equinor.com" },
      { name: "Norwea", website: "https://www.norwea.no" },
      { name: "Siemens Gamesa", website: "https://www.siemensgamesa.com" },
      { name: "Vestas", website: "https://www.vestas.com" },
      { name: "Lyse", website: "https://www.lyse.no" },
      { name: "DNV", website: "https://www.dnv.com" }
    ],
    match: "Utdanning innen fornybar energi matcher din interesse for bærekraft og teknologisk innovasjon."
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
      { name: "Equinor", website: "https://www.equinor.com" },
      { name: "Rambøll", website: "https://www.ramboll.no" },
      { name: "Veidekke", website: "https://www.veidekke.no" },
      { name: "AF Gruppen", website: "https://afgruppen.no" },
      { name: "Sweco", website: "https://www.sweco.no" },
      { name: "COWI", website: "https://www.cowi.no" }
    ],
    match: "Ingeniørstudier matcher din analytiske evne og interesse for praktisk problemløsning."
  },
  "Bachelor i shipping management": {
    educationProgram: "Bachelor i shipping management",
    jobs: [
      { title: "Skipsmegler", description: "Megler mellom rederier og befraktere for å leie eller selge skip." },
      { title: "Rederiansatt", description: "Jobber med drift, ledelse eller operasjoner i rederier." },
      { title: "Shipping Manager", description: "Ansvarlig for drift og ledelse av shipping-operasjoner." },
      { title: "Chartering Manager", description: "Håndterer avtaler om leie og befraktning av skip." },
      { title: "Maritime Analyst", description: "Analyserer markedstrender og risiko i shippingmarkedet." },
      { title: "Supply Chain Coordinator", description: "Koordinerer logistikk og forsyningskjeder innen sjøtransport." }
    ],
    companies: [
      { name: "DNV", website: "https://www.dnv.com" },
      { name: "Wilhelmsen Ship Management", website: "https://wilhelmsen.com" },
      { name: "Torvald Klaveness", website: "https://www.klaveness.com/" },
      { name: "Wallenius Wilhelmsen", website: "https://www.walleniuswilhelmsen.com/" },
      { name: "Kongsberg Gruppen", website: "https://www.kongsberg.com" },
      { name: "Solstad Offshore", website: "https://www.solstad.com" },
      { name: "Höegh Autoliners", website: "https://www.hoegh.com" },
      { name: "Odfjell Drilling", website: "https://www.odfjelldrilling.com" },
      { name: "Grieg Group", website: "https://grieg.no" },
      { name: "Norwegian Hull Club", website: "https://www.norclub.com" }
    ],
    match: "Bachelor i shipping management er ideell for deg som er interessert i maritim næring og internasjonal handel."
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
      { name: "Arctic Securities", website: "https://www.arctic.com" },
      { name: "First Securities", website: "https://www.firstsec.no" },
      { name: "SEB", website: "https://seb.no" },
      { name: "Nordea Asset Management", website: "https://www.nordea.no/asset-management" },
      { name: "Storebrand Asset Management", website: "https://www.storebrand.no" },
      { name: "KLP Kapitalforvaltning", website: "https://www.klp.no" }
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
      { name: "Arctic Securities", website: "https://www.arctic.com" },
      { name: "First Securities", website: "https://www.firstsec.no" },
      { name: "SEB", website: "https://seb.no" },
      { name: "Nordea Asset Management", website: "https://www.nordea.no/asset-management" },
      { name: "Storebrand Asset Management", website: "https://www.storebrand.no" },
      { name: "KLP Kapitalforvaltning", website: "https://www.klp.no" }
    ],
    match: "En master i finans åpner for karrieremuligheter innen avansert finansanalyse og ledelse."
  },
  "Økonomi og ledelse": {
    educationProgram: "Økonomi og ledelse",
    jobs: [
      { title: "Økonomikonsulent", description: "Gir råd om økonomistyring og regnskapsmessige forhold." },
      { title: "Bedriftsrådgiver", description: "Hjelper bedrifter med å forbedre sine forretningsprosesser." },
      { title: "Regnskapsfører", description: "Fører og kontrollerer regnskap for bedrifter." },
      { title: "Controller", description: "Overvåker og kontrollerer økonomiske prosesser i en organisasjon." },
      { title: "HR-ansvarlig", description: "Har ansvar for personalpolitikk og ansettelser." },
      { title: "Revisormedarbeider", description: "Assisterer revisorer med kontroll av regnskaper." },
      { title: "Innkjøpsansvarlig", description: "Ansvarlig for anskaffelser og leverandørrelasjoner." },
      { title: "Markedsanalytiker", description: "Analyserer markedstrender og konkurransesituasjon." }
    ],
    companies: [
      { name: "Deloitte", website: "https://www2.deloitte.com/no/" },
      { name: "EY", website: "https://www.ey.com/no_no" },
      { name: "PwC", website: "https://www.pwc.no" },
      { name: "KPMG", website: "https://home.kpmg/no/nb/home.html" },
      { name: "DNB", website: "https://www.dnb.no" },
      { name: "Storebrand", website: "https://www.storebrand.no" },
      { name: "Equinor", website: "https://www.equinor.com" },
      { name: "Telenor", website: "https://www.telenor.no" },
      { name: "Aker Solutions", website: "https://www.akersolutions.com" },
      { name: "Yara", website: "https://www.yara.com" }
    ],
    match: "Denne utdanningen passer godt med din organisatoriske evne og interesse for forretningsutvikling."
  },
  "Bachelor økonomi og administrasjon": {
    educationProgram: "Bachelor i økonomi og administrasjon",
    jobs: [
      { title: "Økonomikonsulent", description: "Gir råd om økonomistyring og regnskapsmessige forhold." },
      { title: "Bedriftsrådgiver", description: "Hjelper bedrifter med å forbedre sine forretningsprosesser." },
      { title: "Regnskapsfører", description: "Fører og kontrollerer regnskap for bedrifter." },
      { title: "Controller", description: "Overvåker og kontrollerer økonomiske prosesser i en organisasjon." },
      { title: "HR-ansvarlig", description: "Har ansvar for personalpolitikk og ansettelser." },
      { title: "Revisormedarbeider", description: "Assisterer revisorer med kontroll av regnskaper." },
      { title: "Innkjøpsansvarlig", description: "Ansvarlig for anskaffelser og leverandørrelasjoner." },
      { title: "Markedsanalytiker", description: "Analyserer markedstrender og konkurransesituasjon." }
    ],
    companies: [
      { name: "Deloitte", website: "https://www2.deloitte.com/no/" },
      { name: "EY", website: "https://www.ey.com/no_no" },
      { name: "PwC", website: "https://www.pwc.no" },
      { name: "KPMG", website: "https://home.kpmg/no/nb/home.html" },
      { name: "DNB", website: "https://www.dnb.no" },
      { name: "Storebrand", website: "https://www.storebrand.no" },
      { name: "Equinor", website: "https://www.equinor.com" },
      { name: "Telenor", website: "https://www.telenor.no" },
      { name: "Aker Solutions", website: "https://www.akersolutions.com" },
      { name: "Yara", website: "https://www.yara.com" }
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
      { name: "BDO", website: "https://www.bdo.no" },
      { name: "Grant Thornton", website: "https://www.grantthornton.no" },
      { name: "RSM Norge", website: "https://www.rsm.no" },
      { name: "Nordea", website: "https://www.nordea.no" },
      { name: "Sparebank 1", website: "https://www.sparebank1.no" },
      { name: "Storebrand", website: "https://www.storebrand.no" }
    ],
    match: "Regnskap og revisjon passer for din nøyaktighet og analytiske tilnærming til tall og systemer."
  },
  // Add more education programs from the dataset provided by user
};

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
        return CAREER_DATA["Bachelor i finans"];
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

    console.log(`No specific career match found for: ${program}, using education-specific default career options`);
    
    // Default careers based on education field
    if (normalizedProgram.includes('design') || normalizedProgram.includes('kunst') || normalizedProgram.includes('arkitekt')) {
      return {
        educationProgram: program,
        jobs: [
          { title: "Designer", description: "Skaper visuelle løsninger og konsepter basert på klienters behov." },
          { title: "Konseptutvikler", description: "Utvikler kreative konsepter for produkter, tjenester eller kommunikasjon." },
          { title: "Kreativ leder", description: "Leder kreative prosesser og team i designprosjekter." },
          { title: "Art Director", description: "Ansvarlig for det visuelle uttrykket i markedsføring og kommunikasjon." },
          { title: "Interiørkonsulent", description: "Gir råd om romløsninger og interiørdesign for private og kommersielle kunder." }
        ],
        companies: [
          { name: "Snøhetta", website: "https://snohetta.com" },
          { name: "Designit", website: "https://www.designit.com" },
          { name: "EGGS Design", website: "https://eggsdesign.com" },
          { name: "Scandinavian Design Group", website: "https://sdg.no" },
          { name: "Bekk Consulting", website: "https://www.bekk.no" }
        ],
        match: "Dette utdanningsprogrammet passer godt med din kreative profil."
      };
    } 
    else if (normalizedProgram.includes('jus') || normalizedProgram.includes('rett')) {
      return {
        educationProgram: program,
        jobs: [
          { title: "Advokatfullmektig", description: "Jobber under opplæring hos erfaren advokat." },
          { title: "Juridisk rådgiver", description: "Gir juridiske råd til bedrifter eller privatpersoner." },
          { title: "Compliance Officer", description: "Sikrer at en virksomhet opererer i samsvar med lover og regler." },
          { title: "Jurist i offentlig forvaltning", description: "Arbeider med juridiske spørsmål i offentlig sektor." },
          { title: "Dommerfullmektig", description: "Arbeider under opplæring i domstolene." }
        ],
        companies: [
          { name: "Wikborg Rein", website: "https://www.wr.no" },
          { name: "Schjødt", website: "https://www.schjodt.no" },
          { name: "BAHR", website: "https://bahr.no" },
          { name: "Thommessen", website: "https://www.thommessen.no" },
          { name: "Domstolsadministrasjonen", website: "https://www.domstol.no" }
        ],
        match: "Dette juridiske programmet matcher din strukturerte og analytiske tilnærming."
      };
    }
    else if (normalizedProgram.includes('farmasi') || normalizedProgram.includes('apotek')) {
      return {
        educationProgram: program,
        jobs: [
          { title: "Farmasøyt", description: "Gir råd om og selger medisiner i apotek." },
          { title: "Klinisk farmasøyt", description: "Jobber med pasientsikkerhet og legemiddelbruk i helseinstitusjoner." },
          { title: "Produktspesialist i legemiddelindustrien", description: "Gir informasjon om legemidler til helsepersonell." },
          { title: "Regulatory Affairs-spesialist", description: "Sikrer at legemidler oppfyller myndighetskrav." },
          { title: "Forsker i legemiddelutvikling", description: "Arbeider med utvikling av nye medisiner." }
        ],
        companies: [
          { name: "Apotek 1", website: "https://www.apotek1.no" },
          { name: "Boots Apotek", website: "https://www.boots.no" },
          { name: "Vitus Apotek", website: "https://www.vitusapotek.no" },
          { name: "Pfizer", website: "https://www.pfizer.no" },
          { name: "Statens Legemiddelverk", website: "https://legemiddelverket.no" }
        ],
        match: "Farmasi passer godt med din strukturerte og analytiske tilnærming."
      };
    }
    else if (normalizedProgram.includes('statsvitenskap') || normalizedProgram.includes('politikk')) {
      return {
        educationProgram: program,
        jobs: [
          { title: "Politisk rådgiver", description: "Gir faglige råd til politikere eller politiske organisasjoner." },
          { title: "Utredningskonsulent", description: "Analyserer samfunnsspørsmål og utarbeider beslutningsgrunnlag." },
          { title: "Kommunikasjonsrådgiver", description: "Arbeider med kommunikasjon i offentlig eller privat sektor." },
          { title: "Organisasjonskonsulent", description: "Jobber med organisasjonsutvikling og -analyse." },
          { title: "Internasjonal koordinator", description: "Koordinerer internasjonale prosjekter eller samarbeid." }
        ],
        companies: [
          { name: "Departementene", website: "https://www.regjeringen.no" },
          { name: "Kommunesektorens organisasjon", website: "https://www.ks.no" },
          { name: "Norsk Utenrikspolitisk Institutt", website: "https://www.nupi.no" },
          { name: "Tankesmien Agenda", website: "https://www.tankesmienagenda.no" },
          { name: "FN-sambandet", website: "https://www.fn.no" }
        ],
        match: "Statsvitenskap passer godt med din analytiske og strukturerte tilnærming."
      };
    }
    else if (normalizedProgram.includes('regnskap') || normalizedProgram.includes('revisjon')) {
      return {
        educationProgram: program,
        jobs: [
          { title: "Revisormedarbeider", description: "Jobber med revisjon under opplæring." },
          { title: "Regnskapsfører", description: "Fører regnskap for bedrifter eller organisasjoner." },
          { title: "Financial Controller", description: "Kontrollerer økonomiske prosesser i en virksomhet." },
          { title: "Skatterevisor", description: "Kontrollerer skattemessige forhold for skattemyndighetene." },
          { title: "Økonomiansvarlig", description: "Har overordnet ansvar for økonomifunksjonen i en mindre virksomhet." }
        ],
        companies: [
          { name: "Deloitte", website: "https://www2.deloitte.com/no/" },
          { name: "EY", website: "https://www.ey.com/no_no" },
          { name: "PwC", website: "https://www.pwc.no" },
          { name: "KPMG", website: "https://home.kpmg/no/nb/home.html" },
          { name: "BDO", website: "https://www.bdo.no" }
        ],
        match: "Regnskap og revisjon matcher din struktur og analytiske evner."
      };
    }
    
    // Default generic field if no specific match found
    return {
      educationProgram: program,
      jobs: [
        { title: "Rådgiver", description: "Gir faglige råd og veiledning basert på din kompetanse." },
        { title: "Forsker", description: "Utfører forskningsarbeid innenfor relevante fagområder." },
        { title: "Faglærer", description: "Underviser andre i ditt spesialområde." },
        { title: "Bransjeanalytiker", description: "Analyserer trender og utvikling innen relevante bransjer." },
        { title: "Produktspesialist", description: "Utvikler, implementerer eller markedsfører spesialiserte produkter innen ditt fagfelt." }
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
