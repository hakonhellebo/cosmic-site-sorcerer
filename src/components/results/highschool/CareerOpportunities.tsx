
import React from 'react';
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

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

interface CareerOpportunitiesProps {
  recommendations: any[];
  showAllOpportunities?: boolean;
}

const CareerOpportunities: React.FC<CareerOpportunitiesProps> = ({ 
  recommendations, 
  showAllOpportunities = false 
}) => {
  // Mapping av utdanningsprogram til karrieremuligheter
  const careerFields: CareerField[] = recommendations.map(recommendation => {
    // Default verdier hvis data mangler
    let careers: CareerField = {
      educationProgram: recommendation.name,
      jobs: [],
      companies: []
    };
    
    // Karrieremuligheter basert på studieprogram
    switch(recommendation.name) {
      case 'Medisin':
        careers.jobs = [
          { title: 'Fastlege', description: 'Arbeider i primærhelsetjenesten med generell medisinsk behandling.' },
          { title: 'Lege i akuttmottak', description: 'Håndterer akutte medisinske situasjoner på sykehus.' },
          { title: 'Folkehelselege', description: 'Arbeider med forebyggende helsearbeid på samfunnsnivå.' },
          { title: 'Medisinsk forsker', description: 'Utfører forskning for å utvikle nye behandlingsmetoder.' },
        ];
        careers.companies = [
          { name: 'Oslo Universitetssykehus', website: 'https://oslo-universitetssykehus.no/' },
          { name: 'Haukeland Universitetssjukehus', website: 'https://helse-bergen.no/' },
          { name: 'Folkehelseinstituttet', website: 'https://www.fhi.no/' },
        ];
        careers.match = 'Passer for personer med analytiske evner og helseinteresse';
        break;
        
      case 'Psykologi (profesjonsstudium)':
        careers.jobs = [
          { title: 'Klinisk psykolog', description: 'Diagnostiserer og behandler psykiske lidelser.' },
          { title: 'Barne- og ungdomspsykolog', description: 'Spesialiserer seg på behandling av barn og unge.' },
          { title: 'Organisasjonspsykolog', description: 'Arbeider med psykologiske aspekter i organisasjoner.' },
        ];
        careers.companies = [
          { name: 'Akershus universitetssykehus', website: 'https://www.ahus.no/' },
          { name: 'Oslo Universitetssykehus', website: 'https://oslo-universitetssykehus.no/' },
          { name: 'Folkehelseinstituttet', website: 'https://www.fhi.no/' },
        ];
        careers.match = 'Passer for personer med analytiske evner og interesse for mennesker';
        break;
        
      case 'Informatikk':
        careers.jobs = [
          { title: 'Programvareutvikler', description: 'Utvikler programvare og applikasjoner.' },
          { title: 'Systemutvikler', description: 'Designer og implementerer større IT-systemer.' },
          { title: 'IT-konsulent', description: 'Gir råd og implementerer IT-løsninger for bedrifter.' },
          { title: 'Dataanalytiker', description: 'Analyserer store mengder data for å finne mønstre og trender.' },
        ];
        careers.companies = [
          { name: 'TietoEVRY', website: 'https://www.tietoevry.com/' },
          { name: 'Aker Solutions', website: 'https://www.akersolutions.com/' },
          { name: 'Microsoft Norge', website: 'https://www.microsoft.com/nb-no/' },
        ];
        careers.match = 'Passer for personer med teknologiinteresse og analytiske evner';
        break;
        
      case 'Økonomi og administrasjon':
        careers.jobs = [
          { title: 'Økonomikonsulent', description: 'Arbeider med økonomistyring i bedrifter.' },
          { title: 'Bedriftsrådgiver', description: 'Gir råd til bedrifter innen strategi og utvikling.' },
          { title: 'Regnskapsfører', description: 'Fører regnskap for bedrifter.' },
          { title: 'Revisor', description: 'Utfører revisjon av regnskaper.' },
        ];
        careers.companies = [
          { name: 'Deloitte', website: 'https://www2.deloitte.com/no/no.html' },
          { name: 'PwC', website: 'https://www.pwc.no/' },
          { name: 'DNB', website: 'https://www.dnb.no/' },
        ];
        careers.match = 'Passer for personer med analytiske evner og økonomisk interesse';
        break;
        
      case 'Rettsvitenskap (jus)':
        careers.jobs = [
          { title: 'Advokat', description: 'Gir juridisk rådgivning og representerer klienter i retten.' },
          { title: 'Dommer', description: 'Leder rettssaker og avsier dommer.' },
          { title: 'Juridisk rådgiver', description: 'Gir juridisk rådgivning til bedrifter og organisasjoner.' },
        ];
        careers.companies = [
          { name: 'Wiersholm', website: 'https://www.wiersholm.no/' },
          { name: 'Thommessen', website: 'https://www.thommessen.no/' },
          { name: 'Domstolene', website: 'https://www.domstol.no/' },
        ];
        careers.match = 'Passer for personer med analytiske evner og interesse for rettferdighet';
        break;
        
      case 'Ingeniørfag':
        careers.jobs = [
          { title: 'Bygningsingeniør', description: 'Planlegger og leder byggeprosjekter.' },
          { title: 'Maskiningeniør', description: 'Utvikler og forbedrer maskiner og produksjonsutstyr.' },
          { title: 'Elektroingeniør', description: 'Arbeider med elektriske systemer og komponenter.' },
        ];
        careers.companies = [
          { name: 'Multiconsult', website: 'https://www.multiconsult.no/' },
          { name: 'Norconsult', website: 'https://www.norconsult.no/' },
          { name: 'Veidekke', website: 'https://www.veidekke.no/' },
        ];
        careers.match = 'Passer for personer med teknologiinteresse og praktiske ferdigheter';
        break;
        
      // Fallback for andre studieprogrammer
      default:
        careers.jobs = [
          { title: 'Fagspesialist', description: 'Spesialiserer seg innen et spesifikt fagområde.' },
          { title: 'Konsulent', description: 'Gir råd til bedrifter og organisasjoner innen fagfeltet.' },
          { title: 'Forsker', description: 'Utfører forskningsarbeid for å utvikle ny kunnskap.' },
        ];
        careers.companies = [
          { name: 'Relevante bedrifter', website: 'https://www.nav.no/no/bedrift' },
          { name: 'Forskningsinstitusjoner', website: 'https://www.forskningsradet.no/' },
          { name: 'Konsulentselskaper', website: 'https://www.finn.no/job/browse.html' },
        ];
        careers.match = 'Arbeidsmulighetene varierer basert på fagfelt og spesialisering';
        break;
    }
    
    return careers;
  });
  
  // Vis bare de første 3 utdanningsprogrammene med mindre showAllOpportunities er true
  const displayedCareerFields = showAllOpportunities ? careerFields : careerFields.slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-up">
      <h3 className="text-2xl font-semibold">Karrieremuligheter</h3>
      
      <Tabs defaultValue={displayedCareerFields[0]?.educationProgram.replace(/\s+/g, '-').toLowerCase()} className="w-full">
        <TabsList className="mb-6 flex flex-wrap h-auto gap-2">
          {displayedCareerFields.map((field) => (
            <TabsTrigger 
              key={field.educationProgram} 
              value={field.educationProgram.replace(/\s+/g, '-').toLowerCase()}
              className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              {field.educationProgram}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {displayedCareerFields.map((field) => (
          <TabsContent 
            key={field.educationProgram} 
            value={field.educationProgram.replace(/\s+/g, '-').toLowerCase()}
            className="border rounded-lg p-6"
          >
            {field.match && (
              <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                <p className="italic">{field.match}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Stillinger</h4>
                <Accordion type="multiple" className="w-full">
                  {field.jobs.map((job, idx) => (
                    <AccordionItem key={idx} value={`job-${idx}`}>
                      <AccordionTrigger className="text-base font-medium hover:no-underline">
                        {job.title}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        {job.description}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Relevante bedrifter</h4>
                <ul className="space-y-3">
                  {field.companies.map((company, idx) => (
                    <li key={idx} className="flex items-center justify-between border-b pb-2">
                      <span>{company.name}</span>
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm"
                      >
                        <span>Besøk</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Dette er en oversikt over mulige karriereveier basert på din profil og valgt utdanning. 
                Faktiske jobbtilbud vil avhenge av flere faktorer som erfaring, kompetanse og arbeidsmarkedet.
              </p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CareerOpportunities;
