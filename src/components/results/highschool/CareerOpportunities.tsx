
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CareerOpportunitiesProps {
  recommendations: {
    title: string;
    institution: string;
    match: string;
    description: string;
    careers: string[];
  }[];
  showAllOpportunities?: boolean;
}

const CareerOpportunities: React.FC<CareerOpportunitiesProps> = ({ recommendations, showAllOpportunities = false }) => {
  // Extract all career paths from recommendations, remove duplicates
  const allCareers = recommendations.flatMap(rec => rec.careers || [])
    // Filter out duplicate careers by comparing lowercased strings
    .filter((career, index, self) => 
      index === self.findIndex(c => c.toLowerCase() === career.toLowerCase())
    );
  
  // Limit to 6 careers unless showAllOpportunities is true
  const displayedCareers = showAllOpportunities ? allCareers : allCareers.slice(0, 6);
  
  return (
    <div className="animate-fade-up">
      <h3 className="text-2xl font-semibold mb-6">Karrieremuligheter</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {displayedCareers.map((career, idx) => (
          <div key={idx} className="bg-card border rounded-lg p-5 hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-lg">{career}</h4>
            <p className="text-sm text-muted-foreground mt-2">
              Basert på dine interesser og styrker
            </p>
          </div>
        ))}
      </div>
      
      {!showAllOpportunities && allCareers.length > 6 && (
        <div className="mt-4">
          <Button variant="outline">
            Se flere karrieremuligheter
          </Button>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-muted/30 rounded-lg">
        <p className="text-sm">
          <span className="font-medium">Tips:</span> Disse yrkene er basert på 
          utdanningene som matcher din profil. Du kan klikke på utdanningene over 
          for å lese mer om dem.
        </p>
      </div>
    </div>
  );
};

export default CareerOpportunities;
