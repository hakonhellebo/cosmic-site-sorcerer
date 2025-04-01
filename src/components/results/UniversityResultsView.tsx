
import React from 'react';
import ResultCard from './ResultCard';
import { getFormattedValue } from '@/utils/resultFormatters';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, GraduationCap, Building, ExternalLink } from "lucide-react";

interface UniversityResultsViewProps {
  userData: any;
}

export const UniversityResultsView: React.FC<UniversityResultsViewProps> = ({ userData }) => {
  const universityData = userData?.questionnaire?.university;
  
  if (!universityData) {
    return <div>Ingen studentdata funnet</div>;
  }
  
  // Extract interests and strengths
  const interests = Object.keys(universityData.interests || {})
    .filter(key => universityData.interests[key]);
  
  const strengths = Object.keys(universityData.strengths || {})
    .filter(key => universityData.strengths[key]);
  
  // Define personality dimensions based on strengths
  const dimensions = [
    { 
      name: "Analytisk", 
      description: "Du liker å analysere komplekse problemer og finne løsninger.",
      active: strengths.includes('analytisk') || strengths.includes('grundig')
    },
    { 
      name: "Sosial", 
      description: "Du trives med å samarbeide tett med andre.",
      active: strengths.includes('samarbeidsvillig') || strengths.includes('utadvendt')
    },
    { 
      name: "Kreativ", 
      description: "Du tenker nytt og ser muligheter andre ikke ser.",
      active: strengths.includes('kreativ') || strengths.includes('nyskapende')
    }
  ].filter(d => d.active).slice(0, 3);
  
  // If no dimensions match, use default ones
  if (dimensions.length === 0) {
    dimensions.push(
      { name: "Analytisk", description: "Du liker å analysere komplekse problemer og finne løsninger.", active: true },
      { name: "Sosial", description: "Du trives med å samarbeide tett med andre.", active: true },
      { name: "Kreativ", description: "Du tenker nytt og ser muligheter andre ikke ser.", active: true }
    );
  }
  
  // Define personality types that match their profile
  const personalityTypes = [
    { 
      title: "Tverrfaglig teamarbeid", 
      description: "Du liker å samarbeide tett i kreative miljøer.",
      icon: "users"
    },
    { 
      title: "Mål- og strukturorientert", 
      description: "Du liker klare mål og prosess.",
      icon: "target"
    },
    { 
      title: "Problemløser", 
      description: "Du vil finne løsninger som skaper verdi.",
      icon: "puzzle"
    }
  ];
  
  // Define education to career pathways
  const careerPathways = [
    { 
      education: "Medier og kommunikasjon", 
      roles: "Innholdsstrateg, UX-writer, SoMe-rådgiver", 
      reason: "Du er kreativ og strukturert"
    },
    { 
      education: "Økonomi og ledelse", 
      roles: "Controller, HR-analytiker, konsulent", 
      reason: "Du scorer høyt på analyse og struktur"
    },
    { 
      education: "Psykologi", 
      roles: "Rådgiver, HR, organisasjonsutvikler", 
      reason: "Du kombinerer helse, empati og analyse"
    }
  ];
  
  // Define potential companies or sectors
  const companies = [
    { 
      name: "NAV", 
      description: "Rådgivning, organisasjonsutvikling"
    },
    { 
      name: "Kantega, Sopra Steria", 
      description: "Analyse og design"
    },
    { 
      name: "Startups", 
      description: "For de som scorer høyt på kreativitet og selvstendighet"
    },
    { 
      name: "Kommune / skole / helsevesen", 
      description: "Trygghet, struktur, samfunnsnytte"
    }
  ];
  
  // Define next steps
  const nextSteps = [
    "Finn ut hvilke ferdigheter som er etterspurt",
    "Gjør et miniprosjekt / frivillig arbeid",
    "Snakk med noen som jobber i en relevant rolle",
    "Se etter praksis eller internships"
  ];
  
  // Create basic info card
  const basicInfo = [
    {
      title: "Din utdanningsprofil",
      icon: "education",
      items: [
        { label: "Studiefelt", value: universityData.studyField || "Ikke angitt" },
        { label: "Institusjon", value: universityData.institution === 'other' ? 
          universityData.otherInstitution : (universityData.institution || "Ikke angitt") },
        { label: "Utdanningsnivå", value: universityData.level || "Ikke angitt" }
      ]
    }
  ];
  
  return (
    <div className="space-y-10">
      {/* 1. Din profil */}
      <div className="bg-card p-6 rounded-lg border animate-fade-up relative overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-1 bg-primary"></div>
        <div className="relative">
          <div className="flex items-center mb-4">
            <GraduationCap className="h-6 w-6 mr-2 text-primary" />
            <h2 className="text-xl font-semibold">Her er kjernen i profilen din</h2>
          </div>
          
          {/* Dimensions badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            {dimensions.map((dim, idx) => (
              <Badge key={idx} variant="outline" className="px-3 py-1.5 text-base bg-primary/10 hover:bg-primary/20">
                {dim.name}
              </Badge>
            ))}
          </div>
          
          {/* Combined description */}
          <p className="text-lg mb-6">
            Du liker å analysere komplekse problemer og samtidig samarbeide tett med andre. 
            Du tenker nytt, men trives med klare rammer.
          </p>
          
          {/* Individual dimension descriptions */}
          <div className="space-y-2">
            {dimensions.map((dim, idx) => (
              <p key={idx} className="text-muted-foreground">
                <span className="font-medium">{dim.name}:</span> {dim.description}
              </p>
            ))}
          </div>
        </div>
      </div>
      
      {/* 2. Passer godt til dette yrkesmiljøet */}
      <div className="animate-fade-up">
        <h3 className="text-2xl font-semibold mb-6">Passer godt til dette yrkesmiljøet</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {personalityTypes.map((type, idx) => (
            <div key={idx} className="bg-card border rounded-lg p-5 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-lg mb-2 flex items-center">
                <span className="flex h-8 w-8 bg-primary/10 rounded-full items-center justify-center mr-2">
                  {idx === 0 && <span className="text-xl">👥</span>}
                  {idx === 1 && <span className="text-xl">🎯</span>}
                  {idx === 2 && <span className="text-xl">🔧</span>}
                </span>
                {type.title}
              </h4>
              <p className="text-sm text-muted-foreground">{type.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* 3. Hva kan du bruke utdanningen din til? */}
      <div className="animate-fade-up">
        <h3 className="text-2xl font-semibold mb-6">Hva kan du bruke utdanningen din til?</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Din utdanning</th>
                <th className="text-left py-3">Relevante roller</th>
                <th className="text-left py-3">Hvorfor?</th>
              </tr>
            </thead>
            <tbody>
              {careerPathways.map((path, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/30">
                  <td className="py-3 font-medium">{path.education}</td>
                  <td className="py-3">{path.roles}</td>
                  <td className="py-3">{path.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* 4. Aktuelle bedrifter eller sektorer */}
      <div className="animate-fade-up">
        <h3 className="text-2xl font-semibold mb-6">Aktuelle bedrifter eller sektorer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {companies.map((company, idx) => (
            <div key={idx} className="flex items-start p-4 bg-card border rounded-lg">
              <Building className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">{company.name}</h4>
                <p className="text-sm text-muted-foreground">{company.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 5. Hva kan være lurt å gjøre nå? */}
      <div className="bg-muted/10 p-6 rounded-lg border animate-fade-up">
        <h3 className="text-xl font-semibold mb-4">Hva kan være lurt å gjøre nå?</h3>
        <ul className="space-y-3 mb-6">
          {nextSteps.map((step, idx) => (
            <li key={idx} className="flex items-start">
              <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
              <span>{step}</span>
            </li>
          ))}
        </ul>
        
        {/* Result cards for basic info */}
        {basicInfo.map((card, index) => (
          <ResultCard 
            key={index} 
            title={card.title} 
            icon={card.icon} 
            items={card.items} 
          />
        ))}
        
        <div className="mt-6 flex justify-center">
          <Button variant="outline" className="flex items-center gap-2">
            <span>Finn studietilbud som passer dine interesser</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
