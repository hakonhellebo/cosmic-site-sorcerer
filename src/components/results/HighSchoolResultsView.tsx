
import React from 'react';
import ResultCard from './ResultCard';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink } from "lucide-react";

interface HighSchoolResultsViewProps {
  userData: any;
}

export const HighSchoolResultsView: React.FC<HighSchoolResultsViewProps> = ({ userData }) => {
  const highSchoolData = userData?.questionnaire?.highSchool;
  
  if (!highSchoolData) {
    return <div>Ingen elevdata funnet</div>;
  }
  
  // Get interests, strengths and subjects as arrays
  const interests = Object.keys(highSchoolData.interests || {})
    .filter(key => highSchoolData.interests[key]);
  
  const strengths = Object.keys(highSchoolData.strengths || {})
    .filter(key => highSchoolData.strengths[key]);
  
  const subjects = Object.keys(highSchoolData.favoriteSubjects || {})
    .filter(key => highSchoolData.favoriteSubjects[key]);
  
  // Define dimensions based on strengths
  const dimensions = [
    { 
      name: "Struktur", 
      description: "Du liker orden, system og klar retning.",
      active: strengths.includes('analytisk')
    },
    { 
      name: "Sosialitet", 
      description: "Du trives med å jobbe sammen med andre mennesker.",
      active: strengths.includes('samarbeidsvillig')
    },
    { 
      name: "Kreativitet", 
      description: "Du har evne til å tenke utenfor boksen og finne nye løsninger.",
      active: strengths.includes('kreativ')
    }
  ].filter(d => d.active).slice(0, 3);
  
  // If no dimensions match, use default ones
  if (dimensions.length === 0) {
    dimensions.push(
      { name: "Struktur", description: "Du liker orden, system og klar retning.", active: true },
      { name: "Sosialitet", description: "Du trives med å jobbe sammen med andre mennesker.", active: true },
      { name: "Kreativitet", description: "Du har evne til å tenke utenfor boksen og finne nye løsninger.", active: true }
    );
  }
  
  // Define recommended education options based on interests and strengths
  const educationRecommendations = [
    { 
      title: "Psykologi", 
      location: "UiO, UiB", 
      match: "Du scorer høyt på Helse og Struktur",
      link: "https://www.uio.no/studier/program/psykologi/"
    },
    { 
      title: "HR og ledelse", 
      location: "OsloMet", 
      match: "Du er både sosial og strukturert",
      link: "https://www.oslomet.no/studier/sam/hrm"
    },
    { 
      title: "Ergoterapi", 
      location: "UiT", 
      match: "Praktisk, men med fokus på mennesker",
      link: "https://www.uit.no/utdanning/program/565246/ergoterapi_-_bachelor"
    }
  ];
  
  // Define potential jobs based on interests
  const jobs = [
    { title: "Karriereveileder", description: "Hjelper unge med å ta gode valg" },
    { title: "Prosjektleder HR", description: "Jobber med mennesker og systemer" },
    { title: "Spesialpedagog", description: "Kombinerer omsorg og struktur" }
  ];
  
  // Define next steps
  const nextSteps = [
    "Snakk med rådgiver",
    "Utforsk utdanning.no",
    "Book møte med noen i bransjen",
    "Gjør en praksis der du får testet interessene dine"
  ];
  
  return (
    <div className="space-y-10">
      {/* 1. Introduksjonstekst */}
      <div className="bg-muted/30 p-6 rounded-lg animate-fade-up">
        <p className="text-lg mb-6">
          Basert på svarene dine, har vi laget en personlig profil som viser dine styrker, 
          interesser og mulige veier videre. Dette er ikke en fasit – men en start på reisen 
          mot noe som passer deg.
        </p>
        
        {/* 2. Dine toppdimensjoner */}
        <h3 className="text-xl font-semibold mb-4">Dine toppdimensjoner</h3>
        <div className="flex flex-wrap gap-3 mb-6">
          {dimensions.map((dim, idx) => (
            <Badge key={idx} variant="outline" className="px-3 py-1 text-base bg-primary/10 hover:bg-primary/20">
              {dim.name}
            </Badge>
          ))}
        </div>
        <div className="space-y-2">
          {dimensions.map((dim, idx) => (
            <p key={idx} className="text-muted-foreground">
              <span className="font-medium">{dim.name}:</span> {dim.description}
            </p>
          ))}
        </div>
      </div>
      
      {/* 3. Anbefalte utdanninger */}
      <div className="animate-fade-up">
        <h3 className="text-2xl font-semibold mb-6">Anbefalte utdanninger</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Utdanning</th>
                <th className="text-left py-3">Lærested</th>
                <th className="text-left py-3">Hvorfor passer det deg?</th>
                <th className="text-left py-3"></th>
              </tr>
            </thead>
            <tbody>
              {educationRecommendations.map((rec, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/30">
                  <td className="py-3 font-medium">{rec.title}</td>
                  <td className="py-3">{rec.location}</td>
                  <td className="py-3">{rec.match}</td>
                  <td className="py-3 text-right">
                    {rec.link && (
                      <a 
                        href={rec.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center text-primary hover:underline"
                      >
                        <span className="mr-1">Les mer</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <Button variant="outline" className="flex items-center gap-2">
            <span>Se flere utdanningsmuligheter</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* 4. Mulige jobber */}
      <div className="animate-fade-up">
        <h3 className="text-2xl font-semibold mb-6">Mulige jobber</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {jobs.map((job, idx) => (
            <div key={idx} className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-lg mb-2">{job.title}</h4>
              <p className="text-muted-foreground">{job.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* 5. Neste steg */}
      <div className="bg-muted/10 p-6 rounded-lg border animate-fade-up">
        <h3 className="text-xl font-semibold mb-4">Neste steg</h3>
        <ul className="space-y-2 mb-6">
          {nextSteps.map((step, idx) => (
            <li key={idx} className="flex items-start">
              <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
              <span>{step}</span>
            </li>
          ))}
        </ul>
        
        {/* 6. Læringsstil */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-semibold mb-2">Din læringsstil</h4>
          <p>Du lærer best gjennom å gjøre praktiske oppgaver og diskutere med andre. Tenk på dette når du velger utdanning.</p>
        </div>
      </div>
    </div>
  );
};
