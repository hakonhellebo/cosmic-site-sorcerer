
import React from 'react';

export interface CareerField {
  educationProgram: string;
  jobs: { title: string; description: string }[];
  companies: string[];
}

interface CareerOpportunitiesProps {
  careerFields?: CareerField[];
}

const CareerOpportunities: React.FC<CareerOpportunitiesProps> = ({ careerFields = [] }) => {
  return (
    <div className="animate-fade-up">
      <h3 className="text-2xl font-semibold mb-6">Karrieremuligheter</h3>
      
      {careerFields.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {careerFields.map((field, idx) => (
            <div key={idx} className="bg-card border rounded-lg p-5 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-lg mb-2">{field.educationProgram}</h4>
              <div className="space-y-4">
                {field.jobs.slice(0, 3).map((job, jobIdx) => (
                  <div key={jobIdx} className="bg-muted/40 p-3 rounded">
                    <p className="font-medium mb-1">{job.title}</p>
                    <p className="text-sm text-muted-foreground">{job.description}</p>
                    {field.companies.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-border/40">
                        <p className="text-xs text-muted-foreground">Eksempel på bedrifter: {field.companies.slice(0, 3).join(', ')}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 p-6 rounded-lg mb-6">
          <p>Vi har ikke nok informasjon til å vise karrieremuligheter ennå.</p>
        </div>
      )}
    </div>
  );
};

export default CareerOpportunities;
