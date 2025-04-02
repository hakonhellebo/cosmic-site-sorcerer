
import React from 'react';
import { BookOpen } from "lucide-react";

interface HighSchoolIntroProps {
  dimensions: Array<{ name: string; description: string }>;
  interests: string;
  learningStyle: string;
  workPreference: string;
}

const HighSchoolIntro: React.FC<HighSchoolIntroProps> = ({ 
  dimensions, 
  interests, 
  learningStyle, 
  workPreference 
}) => {
  return (
    <div className="bg-card p-6 rounded-lg border animate-fade-up relative overflow-hidden">
      <div className="absolute top-0 left-0 h-full w-1 bg-primary"></div>
      <div className="relative">
        <div className="flex items-center mb-4">
          <BookOpen className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-xl font-semibold">Videregåendeskole-elev</h2>
        </div>
        <p className="text-lg mb-6">
          Basert på svarene dine har vi laget en personlig profil som viser dine styrker, interesser 
          og mulige utdanningsveier. Dette er ikke en fasit – men en start på reisen mot noe som passer deg.
        </p>
        
        {/* Dimensions section */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Dine topp dimensjoner</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {dimensions.slice(0, 3).map((dim, index) => (
              <div key={index} className="p-3 bg-primary/10 rounded-md">
                <h4 className="font-medium">{dim.name}</h4>
                <p className="text-sm">{dim.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-md">
            <h4 className="font-medium">Interesser</h4>
            <p className="text-sm">{interests || 'Ingen valgt'}</p>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-md">
            <h4 className="font-medium">Læringsstil</h4>
            <p className="text-sm">{learningStyle || 'Ikke spesifisert'}</p>
          </div>
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-md">
            <h4 className="font-medium">Arbeidspreferanser</h4>
            <p className="text-sm">{workPreference || 'Ikke spesifisert'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighSchoolIntro;
