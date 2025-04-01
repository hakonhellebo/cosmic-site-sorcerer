
import React from 'react';
import ResultCard from './ResultCard';
import { getFormattedValue } from '@/utils/resultFormatters';
import { Badge } from "@/components/ui/badge";
import { Check, Briefcase } from "lucide-react";

interface WorkerResultsViewProps {
  userData: any;
}

export const WorkerResultsView: React.FC<WorkerResultsViewProps> = ({ userData }) => {
  const workerData = userData?.questionnaire?.worker;
  
  if (!workerData) {
    return <div>Ingen arbeidstakerdata funnet</div>;
  }
  
  // Extract strengths and skills
  const strengths = Object.keys(workerData.strengths || {})
    .filter(key => workerData.strengths[key]);
  
  const skills = Object.keys(workerData.skills || {})
    .filter(key => workerData.skills[key]);
  
  // Create worker info cards
  const workerInfoCards = [
    {
      title: "Din jobb og erfaring",
      icon: "work",
      items: [
        { label: "Nåværende stilling", value: workerData.currentRole },
        { label: "Bransje", value: workerData.industry },
        { label: "Erfaring", value: workerData.experience + " år" }
      ]
    },
    {
      title: "Dine styrker og ferdigheter",
      icon: "award",
      items: [
        { 
          label: "Styrker", 
          value: strengths.join(', ') || "Ingen oppgitt"
        },
        { 
          label: "Ferdigheter", 
          value: skills.join(', ') || "Ingen oppgitt"
        }
      ]
    }
  ];
  
  // Define development opportunities
  const developmentOpportunities = [
    { title: "Lederstilling", company: "Større bedrifter i samme bransje", match: "Bygger videre på din erfaring og lederegenskaper" },
    { title: "Spesialisering", company: "Fagmiljøer", match: "Fordyper deg i ditt ekspertiseområde" },
    { title: "Rådgivning", company: "Konsulentvirksomheter", match: "Deler din kompetanse med andre" }
  ];
  
  // Define next steps
  const nextSteps = [
    "Utforsk videreutdanningsmuligheter innen ditt felt",
    "Bygg nettverk med bransjeeksperter",
    "Delta på kurs for å styrke dine ferdigheter",
    "Vurder mentorordninger for karriereveiledning"
  ];
  
  return (
    <div className="space-y-10">
      {/* Personalized intro for workers */}
      <div className="bg-card p-6 rounded-lg border animate-fade-up relative overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-1 bg-primary"></div>
        <div className="relative">
          <div className="flex items-center mb-4">
            <Briefcase className="h-6 w-6 mr-2 text-primary" />
            <h2 className="text-xl font-semibold">Arbeidstaker</h2>
          </div>
          <p className="text-lg mb-6">
            Basert på svarene dine har vi laget en personlig profil som viser dine styrker, ferdigheter og 
            potensielle karrieremuligheter. Dette er ment som et utgangspunkt for videre karriereutvikling.
          </p>
          
          {/* Worker dimensions */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Badge className="px-3 py-1.5 text-base bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-300">
              Ekspertise
            </Badge>
            <Badge className="px-3 py-1.5 text-base bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300">
              Lederskap
            </Badge>
            <Badge className="px-3 py-1.5 text-base bg-green-100 hover:bg-green-200 text-green-800 border-green-300">
              Tilpasningsdyktighet
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border rounded-md">
              <h4 className="font-medium text-purple-800">Ekspertise</h4>
              <p className="text-sm">Du har opparbeidet verdifull fagkompetanse i din bransje.</p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium text-blue-800">Lederskap</h4>
              <p className="text-sm">Du viser evne til å ta ansvar og lede andre.</p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium text-green-800">Tilpasningsdyktighet</h4>
              <p className="text-sm">Du er god til å tilpasse deg nye situasjoner og utfordringer.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Worker info cards */}
      {workerInfoCards.map((card, index) => (
        <ResultCard 
          key={index} 
          title={card.title} 
          icon={card.icon} 
          items={card.items} 
        />
      ))}
      
      {/* Career goal card */}
      <ResultCard 
        title="Karrieremål" 
        icon="target" 
        items={[
          { 
            label: "Karrieremål", 
            value: workerData.careerGoal || "Ikke angitt"
          },
          { 
            label: "Utviklingsmuligheter", 
            value: getFormattedValue(workerData.developmentImportance)
          }
        ]}
      />
      
      {/* Development opportunities */}
      <div className="animate-fade-up">
        <h3 className="text-2xl font-semibold mb-6">Karriereutvikling</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {developmentOpportunities.map((opp, idx) => (
            <div key={idx} className="bg-card border rounded-lg p-5 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-lg mb-2">{opp.title}</h4>
              <p className="text-sm text-muted-foreground mb-3">{opp.company}</p>
              <div className="bg-muted/40 p-3 rounded">
                <p>{opp.match}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Next steps */}
        <div className="bg-gradient-to-r from-muted/20 to-muted/5 p-6 rounded-lg border">
          <h3 className="text-xl font-semibold mb-4">Anbefalte tiltak</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {nextSteps.map((step, idx) => (
              <li key={idx} className="flex items-start">
                <div className="mr-2 mt-1 bg-primary/20 rounded-full p-0.5">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
