
import React from 'react';
import { Check } from "lucide-react";

interface EducationRecommendation {
  name: string;
  institution: string;
  match: string;
}

interface RecommendedEducationProps {
  recommendations: EducationRecommendation[];
  nextSteps: string[];
}

const RecommendedEducation: React.FC<RecommendedEducationProps> = ({ recommendations, nextSteps }) => {
  return (
    <div className="animate-fade-up">
      <h3 className="text-2xl font-semibold mb-6">Anbefalte utdanninger</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {recommendations.map((edu, idx) => (
          <div key={idx} className="bg-card border rounded-lg p-5 hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-lg mb-2">{edu.name}</h4>
            <p className="text-sm text-muted-foreground mb-3">{edu.institution}</p>
            <div className="bg-muted/40 p-3 rounded">
              <p className="text-sm">Passer deg: {edu.match}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Next steps */}
      <div className="bg-muted/10 p-6 rounded-lg border">
        <h3 className="text-xl font-semibold mb-4">Neste steg</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {nextSteps.map((step, idx) => (
            <li key={idx} className="flex items-start">
              <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecommendedEducation;
