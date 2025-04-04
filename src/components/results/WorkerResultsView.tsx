import React, { useMemo } from 'react';
import { Check } from 'lucide-react';
import ResultCard from '../ResultCard';
import CareerOpportunities from './worker/CareerOpportunities';
import {
  formatInterests,
  formatSkills,
  formatWorkPreference,
  formatDevelopmentPreference
} from '@/utils/workerDataFormatters';
import { CareerField } from './worker/CareerOpportunities';

interface WorkerResultsViewProps {
  userData: any;
}

export const WorkerResultsView: React.FC<WorkerResultsViewProps> = ({ userData }) => {
  const workerData = userData?.questionnaire?.worker;

  if (!workerData) {
    return <div>Ingen data funnet</div>;
  }

  console.log("WorkerResultsView - Raw workerData:", workerData);

  const interests = Object.keys(workerData.interests || {})
    .filter(key => workerData.interests[key] === true);

  console.log("Filtered interests:", interests);

  const skills = Object.keys(workerData.skills || {})
    .filter(key => workerData.skills[key] === true);

  console.log("Filtered skills:", skills);

  const strengths = Object.keys(workerData.strengths || {})
    .filter(key => workerData.strengths[key] === true);

  console.log("Filtered strengths:", strengths);

  const developmentOpportunities = [
    { title: "Lederstilling", company: "Større bedrifter i samme bransje", match: "Bygger videre på din erfaring og lederegenskaper" },
    { title: "Spesialisering", company: "Fagmiljøer", match: "Fordyper deg i ditt ekspertiseområde" },
    { title: "Rådgivning", company: "Konsulentvirksomheter", match: "Deler din kompetanse med andre" }
  ];

  const careerOpportunities = [
    {
      title: "Prosjektleder",
      careers: [
        { title: "Prosjektleder", description: "Leder prosjekter fra start til slutt", companies: ["Accenture", "IBM"] },
        { title: "Teamleder", description: "Leder et team av utviklere", companies: ["Microsoft", "Google"] }
      ]
    },
    {
      title: "Dataanalytiker",
      careers: [
        { title: "Dataanalytiker", description: "Analyserer data for å finne trender", companies: ["Deloitte", "KPMG"] },
        { title: "Business Intelligence", description: "Bruker data til å ta bedre beslutninger", companies: ["PwC", "EY"] }
      ]
    },
    {
      title: "Systemutvikler",
      careers: [
        { title: "Frontend utvikler", description: "Utvikler brukergrensesnitt", companies: ["Facebook", "Apple"] },
        { title: "Backend utvikler", description: "Utvikler server-side logikk", companies: ["Amazon", "Netflix"] }
      ]
    }
  ];

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

  const formattedInterests = formatInterests(workerData.interests);
  const formattedSkills = formatSkills(workerData.skills);
  const formattedWorkPreference = formatWorkPreference(workerData.workPreference);
  const formattedDevelopmentPreference = formatDevelopmentPreference(workerData.developmentImportance);

  const transformedCareerFields: CareerField[] = careerOpportunities.map(career => ({
    educationProgram: career.title,
    jobs: career.careers.map(job => ({
      title: job.title,
      description: job.description
    })),
    companies: career.careers.flatMap(job =>
      // Convert Company objects to strings (company names)
      typeof job.companies === 'string'
        ? [job.companies]
        : Array.isArray(job.companies)
          ? job.companies.map(company => typeof company === 'string' ? company : company.name)
          : []
    )
  }));

  return (
    <div className="space-y-10">
      <div className="bg-muted/30 p-6 rounded-lg animate-fade-up">
        <p className="text-lg mb-6">
          Basert på svarene dine, har vi laget en personlig profil som viser dine styrker,
          interesser og mulige veier videre i arbeidslivet. Dette er ikke en fasit – men en start på reisen
          mot noe som passer deg.
        </p>

        <h3 className="text-xl font-semibold mb-4">Dine nøkkelområder</h3>
        <div className="flex flex-wrap gap-3 mb-6">
          {strengths.map((strength, idx) => (
            <span key={idx} className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium">
              {strength}
            </span>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            <span className="font-medium">Interesser:</span> {formattedInterests}
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium">Ferdigheter:</span> {formattedSkills}
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium">Arbeidspreferanse:</span> {formattedWorkPreference}
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium">Utviklingsønsker:</span> {formattedDevelopmentPreference}
          </p>
        </div>
      </div>

      {workerInfoCards.map((card, index) => (
        <ResultCard
          key={index}
          title={card.title}
          icon={card.icon}
          items={card.items}
        />
      ))}

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
      </div>

      <CareerOpportunities careerFields={transformedCareerFields} />

      <div className="bg-muted/10 p-6 rounded-lg border animate-fade-up">
        <h3 className="text-xl font-semibold mb-4">Neste steg – dette får du snart tilgang til</h3>
        <p className="mb-4">EdPath blir mer enn bare anbefalinger. Du vil snart kunne:</p>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
            <span>Se hva andre med lik profil har valgt – og hvor de fikk jobb</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
            <span>Utforske bedrifter og stillinger som passer akkurat deg, basert på dine styrker og interesser</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
            <span>Få ferdige forslag til hva du kan skrive i en CV – og hvordan du matcher en jobb</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
            <span>Få anbefalte kurs og ferdigheter som gjør deg mer attraktiv for arbeidsgivere</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
            <span>Snakke med vår AI-rådgiver og få veiledning døgnet rundt</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
            <span>Bygge din egen profil som oppdateres etter hvert som du lærer og utvikler deg</span>
          </li>
        </ul>

        <p className="mt-4">Alt dette er basert på dine svar – og vil tilpasse seg deg, ikke motsatt.</p>
      </div>
    </div>
  );
};
