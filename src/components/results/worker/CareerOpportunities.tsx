
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
  careerFields: CareerField[];
}

const CareerOpportunities: React.FC<CareerOpportunitiesProps> = ({ careerFields }) => {
  if (!careerFields || careerFields.length === 0) {
    return (
      <div className="p-6 bg-muted/30 rounded-lg">
        <p>Ingen karrieremuligheter funnet for din profil.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <h3 className="text-2xl font-semibold">Karrieremuligheter</h3>
      
      <Tabs defaultValue={careerFields[0].educationProgram.replace(/\s+/g, '-').toLowerCase()} className="w-full">
        <TabsList className="mb-6 flex flex-wrap h-auto gap-2">
          {careerFields.map((field) => (
            <TabsTrigger 
              key={field.educationProgram} 
              value={field.educationProgram.replace(/\s+/g, '-').toLowerCase()}
              className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              {field.educationProgram}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {careerFields.map((field) => (
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
