
import React from 'react';
import { ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { getCareerRecommendations } from '@/utils/careerRecommendations';

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

// Helper function to simplify education program titles
const simplifyProgramTitle = (title: string): string => {
  // Special cases
  if (title.includes("finans")) return "Finans";
  if (title.includes("shipping management")) return "Shipping";
  if (title.includes("økonomi og administrasjon") || title.includes("Økonomi og administrasjon")) return "Økonomi";
  if (title.includes("matematikk")) return "Matematikk";
  if (title.includes("ingeniør")) return "Ingeniør";
  if (title.includes("medisin")) return "Medisin";
  if (title.includes("informatikk")) return "Informatikk";
  if (title.includes("psykologi")) return "Psykologi";
  if (title.includes("jus") || title.includes("rettsvitenskap")) return "Jus";
  if (title.includes("fornybar energi")) return "Energi";
  if (title.includes("odontologi")) return "Odontologi";
  if (title.includes("regnskap og revisjon")) return "Regnskap";
  if (title.includes("kunstig intelligens")) return "AI";
  
  // Generic fallbacks
  if (title.includes("Bachelor i")) {
    return title.replace("Bachelor i", "").trim();
  }
  if (title.includes("Master i")) {
    return title.replace("Master i", "").trim();
  }
  
  // For other cases, take the first part of the title until a space or dash
  const firstWord = title.split(/[\s-]/)[0];
  if (firstWord.length > 3) {
    return firstWord;
  }
  
  // If all else fails, return first 10 chars of the title
  return title.length > 10 ? title.substring(0, 10) + "..." : title;
};

const CareerOpportunities: React.FC<CareerOpportunitiesProps> = ({ 
  recommendations, 
  showAllOpportunities = false 
}) => {
  // Get career fields from the utility function
  const careerFields = getCareerRecommendations(recommendations.map(rec => rec.name));
  
  // Limit to only 4 career fields
  const displayedCareerFields = careerFields.slice(0, 4);
  
  // Generate simplified IDs and titles for the tabs
  const tabData = displayedCareerFields.map(field => ({
    originalTitle: field.educationProgram,
    simplifiedTitle: simplifyProgramTitle(field.educationProgram),
    tabId: field.educationProgram.replace(/\s+/g, '-').toLowerCase(),
    field: field
  }));

  return (
    <div className="space-y-6 animate-fade-up">
      <h3 className="text-2xl font-semibold">Karrieremuligheter</h3>
      
      <Tabs defaultValue={tabData[0]?.tabId} className="w-full">
        <TabsList className="mb-6 flex flex-wrap h-auto gap-2">
          {tabData.map((tab) => (
            <TabsTrigger 
              key={tab.tabId} 
              value={tab.tabId}
              className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              {tab.simplifiedTitle}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {tabData.map((tab) => (
          <TabsContent 
            key={tab.tabId} 
            value={tab.tabId}
            className="border rounded-lg p-6"
          >
            <h4 className="text-lg font-semibold mb-2">{tab.originalTitle}</h4>
            
            {tab.field.match && (
              <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                <p className="italic">Disse karrieremulighetene passer godt for personer med {tab.originalTitle.toLowerCase()} og {tab.field.match.toLowerCase().replace("denne utdanningen passer godt med din", "").replace("denne utdanningen passer for din", "").trim()}. Se aktuelle stillinger og relevante bedrifter under.</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Stillinger</h4>
                <Accordion type="multiple" className="w-full">
                  {tab.field.jobs.slice(0, 5).map((job, idx) => (
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
                  {tab.field.companies.slice(0, 5).map((company, idx) => (
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
