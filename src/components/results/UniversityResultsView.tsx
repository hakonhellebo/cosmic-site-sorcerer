
import React from 'react';
import ResultCard from './ResultCard';
import { getFormattedValue } from '@/utils/resultFormatters';
import { Badge } from "@/components/ui/badge";
import { Check, GraduationCap, ExternalLink } from "lucide-react";
import DimensionRanking from './DimensionRanking';
import { matchEducationPrograms } from '@/utils/educationData';

interface UniversityResultsViewProps {
  userData: any;
}

export const UniversityResultsView: React.FC<UniversityResultsViewProps> = ({ userData }) => {
  const universityData = userData?.questionnaire?.university;
  
  if (!universityData) {
    return <div>Ingen data funnet</div>;
  }
  
  // Extract interests and strengths
  const interests = Object.keys(universityData.interests || {})
    .filter(key => universityData.interests[key]);
  
  const strengths = Object.keys(universityData.strengths || {})
    .filter(key => universityData.strengths[key]);
  
  // Determine if bachelor or master student
  const isBachelorStudent = universityData.level?.toLowerCase().includes('bachelor');
  
  // Extract top dimensions from answers for education recommendations
  // This would be populated based on the actual dimensions data
  const topDimensions = ["Analytisk", "Teknologi", "Kreativitet"]; 

  // Create basic info cards
  const basicInfo = [
    {
      title: "Din utdanningsprofil",
      icon: "education",
      items: [
        { label: "Studiefelt", value: universityData.studyField },
        { label: "Institusjon", value: universityData.institution === 'other' ? 
          universityData.otherInstitution : universityData.institution },
        { label: "Utdanningsnivå", value: universityData.level },
        { label: "Sikkerhetsnivå på karrierevalg", value: getFormattedValue(universityData.certaintylevel) }
      ]
    },
    {
      title: "Dine styrker og interesser",
      icon: "award",
      items: [
        { 
          label: "Interesser", 
          value: interests.join(', ') || "Ingen oppgitt"
        },
        { 
          label: "Styrker", 
          value: strengths.join(', ') || "Ingen oppgitt"
        }
      ]
    },
    {
      title: "Karriere og fremtid",
      icon: "target",
      items: [
        { 
          label: "Foretrukket rolle", 
          value: getFormattedValue(universityData.futureRole)
        },
        { 
          label: "Ønsket arbeidsform", 
          value: getFormattedValue(universityData.workEnvironment)
        },
        { 
          label: "Drømmejobb", 
          value: universityData.dreamJob || "Ikke angitt"
        }
      ]
    }
  ];
  
  // Get master program recommendations (for bachelor students)
  const masterRecommendations = isBachelorStudent ? matchEducationPrograms(topDimensions, 3) : [];
  
  // Define career recommendations
  const careerRecommendations = [
    { title: "Prosjektleder", location: "Teknologibedrifter", match: "Passer med dine organisatoriske evner" },
    { title: "Forsker", location: "Forskningsinstitusjoner", match: "Utnytter dine analytiske ferdigheter" },
    { title: "Konsulent", location: "Konsulentfirmaer", match: "Kombinerer dine sosiale og analytiske evner" }
  ];
  
  // Define next steps based on student level
  const nextStepsBachelor = [
    "Utforsk masterprogrammer innenfor ditt fagfelt",
    "Delta på bedriftspresentasjoner på campus",
    "Søk praksisplasser innen interessante bransjer",
    "Knytt kontakter med alumni fra ditt studieprogram"
  ];
  
  const nextStepsMaster = [
    "Bygg et profesjonelt nettverk i din bransje",
    "Oppdater LinkedIn-profilen med relevante ferdigheter",
    "Delta på jobbmesser og rekrutteringsarrangementer",
    "Utforsk trainee-programmer i relevante bedrifter"
  ];

  // Choose next steps based on education level
  const nextSteps = isBachelorStudent ? nextStepsBachelor : nextStepsMaster;
  
  return (
    <div className="space-y-10">
      {/* Personalized intro for university students */}
      <div className="bg-card p-6 rounded-lg border animate-fade-up relative overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-1 bg-primary"></div>
        <div className="relative">
          <div className="flex items-center mb-4">
            <GraduationCap className="h-6 w-6 mr-2 text-primary" />
            <h2 className="text-xl font-semibold">
              {isBachelorStudent ? "Bachelorstudent" : "Masterstudent"}
            </h2>
          </div>
          <p className="text-lg mb-6">
            Basert på svarene dine har vi laget en personlig profil som viser dine styrker, interesser 
            og mulige karriereveier som {isBachelorStudent ? "bachelorstudent" : "masterstudent"}. Dette er ikke en fasit – men en start på reisen mot 
            en karriere som passer deg.
          </p>
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Dine dimensjoner</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="p-3 bg-primary/10 rounded-md">
                <h4 className="font-medium">Analytisk</h4>
                <p className="text-sm">Du har sterke analytiske evner og er god til å løse komplekse problemer.</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-md">
                <h4 className="font-medium">Målrettet</h4>
                <p className="text-sm">Du er fokusert på å nå dine mål og jobber systematisk mot dem.</p>
              </div>
              <div className="p-3 bg-green-100 rounded-md">
                <h4 className="font-medium">Samarbeidende</h4>
                <p className="text-sm">Du trives med å jobbe i team og bidra til fellesskapet.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dimension Ranking */}
      <DimensionRanking userData={userData} questionnaire="university" />
      
      {/* Result cards for basic info */}
      {basicInfo.map((card, index) => (
        <ResultCard 
          key={index} 
          title={card.title} 
          icon={card.icon} 
          items={card.items} 
        />
      ))}

      {/* Master studies recommendations (for bachelor students only) */}
      {isBachelorStudent && masterRecommendations.length > 0 && (
        <div className="animate-fade-up">
          <h3 className="text-2xl font-semibold mb-6">Anbefalte masterstudier</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Masterprogram</th>
                  <th className="text-left py-3">Institusjon</th>
                  <th className="text-left py-3">Hvorfor passer det deg?</th>
                  <th className="text-left py-3"></th>
                </tr>
              </thead>
              <tbody>
                {masterRecommendations.map((rec, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/30">
                    <td className="py-3 font-medium">{rec.name}</td>
                    <td className="py-3">{rec.institution}</td>
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
        </div>
      )}
      
      {/* Career recommendations - shown for both bachelor and master students */}
      <div className="animate-fade-up">
        <h3 className="text-2xl font-semibold mb-6">Anbefalte karriereveier</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {careerRecommendations.map((career, idx) => (
            <div key={idx} className="bg-card border rounded-lg p-5 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-lg mb-2">{career.title}</h4>
              <p className="text-sm text-muted-foreground mb-3">{career.location}</p>
              <div className="bg-muted/40 p-2 rounded">
                <p className="text-sm">{career.match}</p>
              </div>
            </div>
          ))}
        </div>
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
    </div>
  );
};
