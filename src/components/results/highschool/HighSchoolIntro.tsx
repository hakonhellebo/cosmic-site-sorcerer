
import React from 'react';
import { BookOpen } from "lucide-react";
import { Dimension } from '@/utils/dimensions/types';
import { formatLearningStyle } from '@/utils/highschoolDataFormatters';

interface HighSchoolIntroProps {
  dimensions?: Array<{ name: string; description: string }>;
  interests?: string;
  learningStyle?: string | Record<string, boolean>;
  workPreference?: string;
}

const HighSchoolIntro: React.FC<HighSchoolIntroProps> = ({ 
  dimensions = [], 
  interests = 'Ikke spesifisert', 
  learningStyle = 'Ikke spesifisert', 
  workPreference = 'Ikke spesifisert' 
}) => {
  // Format learning style if it's an object
  const formattedLearningStyle = typeof learningStyle === 'object'
    ? formatLearningStyle(learningStyle)
    : learningStyle;

  return (
    <div className="bg-card p-6 rounded-lg border animate-fade-up relative overflow-hidden">
      <div className="absolute top-0 left-0 h-full w-1 bg-primary"></div>
      <div className="relative">
        <div className="flex items-center mb-4">
          <BookOpen className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-xl font-semibold">Din personlige profil</h2>
        </div>
        <p className="text-lg mb-6">
          Basert på svarene dine har vi laget en personlig profil som viser dine styrker, interesser 
          og mulige utdanningsveier. Dette er et utgangspunkt for å utforske muligheter som passer deg.
        </p>
        
        {dimensions && dimensions.length > 0 && (
          <div className="bg-muted/50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Dine topp dimensjoner</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {dimensions.map((dim, index) => (
                <div 
                  key={index} 
                  className="p-3 bg-primary/10 rounded-md border border-primary/20"
                >
                  <h4 className="font-medium">{dim.name}</h4>
                  <p className="text-sm text-muted-foreground">{dim.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-md">
            <h4 className="font-medium">Interesser</h4>
            <p className="text-sm">{interests}</p>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-md">
            <h4 className="font-medium">Læringsstil</h4>
            <p className="text-sm">{formattedLearningStyle}</p>
          </div>
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-md">
            <h4 className="font-medium">Arbeidspreferanser</h4>
            <p className="text-sm">{workPreference}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighSchoolIntro;
