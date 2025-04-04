
import React from 'react';
import { Dimension } from '@/utils/dimensions/types';

interface CareerOpportunitiesProps {
  dimensions?: Dimension[];
  careers?: any[];
}

const CareerOpportunities: React.FC<CareerOpportunitiesProps> = ({ 
  dimensions = [],
  careers = []
}) => {
  // Generate sample careers based on dimensions if none provided
  const defaultCareers = [
    {
      title: "Ingeniør",
      description: "Planlegger og utfører tekniske løsninger innen forskjellige felt.",
      fields: ["Bygg og anlegg", "IT", "Miljø", "Petroleum"]
    },
    {
      title: "Designer",
      description: "Skaper visuelle løsninger og brukeropplevelser for ulike medier.",
      fields: ["Grafisk design", "UX/UI design", "Produktdesign", "Spilldesign"]
    },
    {
      title: "Helsefagarbeider",
      description: "Jobber med pasientomsorg og behandling i helsevesenet.",
      fields: ["Eldreomsorg", "Sykehus", "Hjemmetjeneste", "Psykiatri"]
    },
    {
      title: "Lærer",
      description: "Underviser og veileder elever i ulike fag og på ulike nivåer.",
      fields: ["Barneskole", "Ungdomsskole", "Videregående", "Spesialpedagogikk"]
    }
  ];
  
  const careersList = careers.length > 0 ? careers : defaultCareers;
  
  return (
    <div className="bg-card p-6 rounded-lg border animate-fade-up">
      <h2 className="text-xl font-semibold mb-4">Mulige karriereveier</h2>
      <p className="text-muted-foreground mb-6">
        Disse karriereveiene kan være relevante basert på din profil. Dette er langsiktige muligheter 
        som krever videre utdanning etter videregående skole.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {careersList.map((career, index) => (
          <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg">{career.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{career.description}</p>
            {career.fields && career.fields.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Spesialiseringer:</h4>
                <div className="flex flex-wrap gap-1">
                  {career.fields.map((field: string, i: number) => (
                    <span 
                      key={i} 
                      className="inline-block bg-muted px-2 py-1 rounded text-xs"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-muted/40 rounded-md">
        <h3 className="font-medium mb-2">Tips for karriereplanlegging</h3>
        <ul className="space-y-2 text-sm">
          <li>• Utforsk utdanninger og yrker gjennom utdanning.no</li>
          <li>• Snakk med en karriereveileder om dine interesser og muligheter</li>
          <li>• Vurder å ta kontakt med aktuelle arbeidsplasser for å høre mer om yrket</li>
          <li>• Hold deg oppdatert på fremtidige jobbmuligheter og trender i arbeidsmarkedet</li>
        </ul>
      </div>
    </div>
  );
};

export default CareerOpportunities;
