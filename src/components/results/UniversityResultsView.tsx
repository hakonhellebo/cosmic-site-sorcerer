
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
    .filter(key => universityData.interests[key] === true);
  
  const strengths = Object.keys(universityData.strengths || {})
    .filter(key => universityData.strengths[key] === true);
  
  // Determine if bachelor or master student
  const isBachelorStudent = universityData.level?.toLowerCase().includes('bachelor');

  // Calculate dimension scores based on university questionnaire answers
  const calculateDimensionScores = () => {
    const scores = {
      teknologi: 0,
      analytisk: 0,
      kreativitet: 0,
      struktur: 0,
      ambisjon: 0,
      sosialitet: 0,
      helseinteresse: 0,
      bærekraft: 0,
      praktisk: 0,
      selvstendighet: 0
    };

    // Process interests (properly handling boolean values)
    if (universityData.interests) {
      if (universityData.interests.teknologi === true) scores.teknologi += 3;
      if (universityData.interests.okonomi === true) scores.analytisk += 3;
      if (universityData.interests.samfunnsvitenskap === true) scores.bærekraft += 2;
      if (universityData.interests.humaniora === true) scores.kreativitet += 2;
      if (universityData.interests.naturvitenskap === true) scores.analytisk += 2;
      if (universityData.interests.helse === true) scores.helseinteresse += 3;
      if (universityData.interests.kunst === true) scores.kreativitet += 3;
      if (universityData.interests.ingenior === true) {
        scores.teknologi += 2;
        scores.analytisk += 1;
      }
      if (universityData.interests.larer === true) scores.sosialitet += 3;
      if (universityData.interests.jus === true) scores.struktur += 3;
    }

    // Process strengths (properly handling boolean values)
    if (universityData.strengths) {
      if (universityData.strengths.kritisk_tenkning === true) scores.analytisk += 2;
      if (universityData.strengths.problemlosning === true) scores.analytisk += 2;
      if (universityData.strengths.kreativitet === true) scores.kreativitet += 2;
      if (universityData.strengths.kommunikasjon === true) scores.sosialitet += 2;
      if (universityData.strengths.selvledelse === true) scores.selvstendighet += 2;
      if (universityData.strengths.prosjektstyring === true) scores.struktur += 2;
      if (universityData.strengths.teknologiforstaaelse === true) scores.teknologi += 2;
      if (universityData.strengths.empati === true) scores.sosialitet += 2;
    }

    // Learning style
    if (universityData.learningStyle) {
      if (universityData.learningStyle.lesing === true) scores.analytisk += 2;
      if (universityData.learningStyle.lytting === true) scores.sosialitet += 1;
      if (universityData.learningStyle.praksis === true) scores.praktisk += 3;
      if (universityData.learningStyle.diskusjon === true) scores.sosialitet += 2;
      if (universityData.learningStyle.video === true) scores.teknologi += 1;
    }

    // Collaboration style
    if (universityData.collaboration === 'independent') scores.selvstendighet += 3;
    else if (universityData.collaboration === 'team') scores.sosialitet += 3;
    else if (universityData.collaboration === 'daily') scores.sosialitet += 2;
    else if (universityData.collaboration === 'weekly') scores.selvstendighet += 1;

    // AI comfort level
    if (universityData.aiUsage === 'daily') scores.teknologi += 3;
    else if (universityData.aiUsage === 'weekly') scores.teknologi += 2;
    else if (universityData.aiUsage === 'monthly') scores.teknologi += 1;

    // Internship experience
    if (universityData.internship === 'yes') scores.praktisk += 2;
    
    if (universityData.internshipValue === 'very-useful') scores.praktisk += 3;
    else if (universityData.internshipValue === 'somewhat-useful') scores.praktisk += 2;

    // Study reason
    if (universityData.studyReason === 'job-security') scores.ambisjon += 2;
    else if (universityData.studyReason === 'salary') scores.ambisjon += 3;
    else if (universityData.studyReason === 'impact') scores.bærekraft += 3;
    else if (universityData.studyReason === 'interest') scores.kreativitet += 3;

    // Salary importance
    if (universityData.salaryImportance === 'very') scores.ambisjon += 3;
    else if (universityData.salaryImportance === 'somewhat') scores.ambisjon += 2;

    // Impact importance
    if (universityData.impactImportance === 'very') scores.bærekraft += 3;
    else if (universityData.impactImportance === 'somewhat') scores.bærekraft += 2;

    // Job priorities
    if (universityData.jobPriorities) {
      if (universityData.jobPriorities.fleksibilitet === true) scores.selvstendighet += 2;
      if (universityData.jobPriorities.hoy_lonn === true) scores.ambisjon += 2;
      if (universityData.jobPriorities.stabilitet === true) scores.struktur += 2;
      if (universityData.jobPriorities.karrieremuligheter === true) scores.ambisjon += 2;
      if (universityData.jobPriorities.mening === true) scores.bærekraft += 2;
      if (universityData.jobPriorities.innovasjon === true) scores.kreativitet += 2;
    }

    // Job challenges
    if (universityData.jobChallenges) {
      if (universityData.jobChallenges.konkurranse === true) scores.ambisjon += 2;
      if (universityData.jobChallenges.manglende_erfaring === true) scores.praktisk += 1;
      if (universityData.jobChallenges.hoye_krav === true) scores.struktur += 1;
      if (universityData.jobChallenges.usikker_jobbvalg === true) scores.struktur += 1;
    }

    // International importance
    if (universityData.internationalImportance === 'very') scores.selvstendighet += 3;
    else if (universityData.internationalImportance === 'somewhat') scores.selvstendighet += 2;
    else if (universityData.internationalImportance === 'not-really') scores.struktur += 1;

    // Entrepreneurship
    if (universityData.entrepreneurship === 'yes') scores.selvstendighet += 3;
    else if (universityData.entrepreneurship === 'maybe') scores.selvstendighet += 2;
    else if (universityData.entrepreneurship === 'no') scores.struktur += 1;

    // Future role
    if (universityData.futureRole === 'leader') scores.ambisjon += 3;
    else if (universityData.futureRole === 'specialist') scores.analytisk += 3;
    else if (universityData.futureRole === 'entrepreneur') scores.selvstendighet += 3;

    // Employer factors
    if (universityData.futureEmployerFactors) {
      if (universityData.futureEmployerFactors.hoy_lonn === true) scores.ambisjon += 2;
      if (universityData.futureEmployerFactors.godt_arbeidsmiljo === true) scores.sosialitet += 2;
      if (universityData.futureEmployerFactors.karriereutvikling === true) scores.ambisjon += 2;
      if (universityData.futureEmployerFactors.stabilitet === true) scores.struktur += 2;
      if (universityData.futureEmployerFactors.innovasjon === true) scores.kreativitet += 2;
    }

    // Preferred company
    if (universityData.preferredCompanyType === 'startup') scores.selvstendighet += 3;
    else if (universityData.preferredCompanyType === 'small-medium') scores.sosialitet += 2;
    else if (universityData.preferredCompanyType === 'large') scores.struktur += 2;
    else if (universityData.preferredCompanyType === 'public') scores.struktur += 2;
    else if (universityData.preferredCompanyType === 'nonprofit') scores.bærekraft += 2;

    // Technology importance
    if (universityData.technologyImportance === 'very') scores.teknologi += 3;
    else if (universityData.technologyImportance === 'somewhat') scores.teknologi += 2;

    // Work-life balance
    if (universityData.workLifeBalance === 'work') scores.ambisjon += 3;
    else if (universityData.workLifeBalance === 'balance') scores.struktur += 2;
    else if (universityData.workLifeBalance === 'life') scores.selvstendighet += 2;

    // Remote work importance
    if (universityData.remoteWorkImportance === 'very') scores.selvstendighet += 3;
    else if (universityData.remoteWorkImportance === 'somewhat') scores.selvstendighet += 2;
    else if (universityData.remoteWorkImportance === 'not-really') scores.struktur += 1;

    // Travel importance
    if (universityData.travelImportance === 'very') scores.selvstendighet += 3;
    else if (universityData.travelImportance === 'somewhat') scores.selvstendighet += 2;
    else if (universityData.travelImportance === 'not-really') scores.struktur += 1;

    // Satisfaction factors
    if (universityData.satisfactionFactors) {
      if (universityData.satisfactionFactors.meningsfylt === true) scores.bærekraft += 2;
      if (universityData.satisfactionFactors.hoy_lonn === true) scores.ambisjon += 2;
      if (universityData.satisfactionFactors.karriereutvikling === true) scores.ambisjon += 2;
      if (universityData.satisfactionFactors.fleksibilitet === true) scores.selvstendighet += 2;
      if (universityData.satisfactionFactors.innovasjon === true) scores.kreativitet += 2;
      if (universityData.satisfactionFactors.stabilitet === true) scores.struktur += 2;
    }

    // Preferred work environment
    if (universityData.preferredWorkEnvironment === 'structured') scores.struktur += 3;
    else if (universityData.preferredWorkEnvironment === 'creative') scores.kreativitet += 3;
    else if (universityData.preferredWorkEnvironment === 'social') scores.sosialitet += 3;
    else if (universityData.preferredWorkEnvironment === 'flexible') scores.selvstendighet += 3;

    // People vs tech
    if (universityData.peopleTech === 'people') scores.sosialitet += 3;
    else if (universityData.peopleTech === 'tech') scores.teknologi += 3;
    else if (universityData.peopleTech === 'both') scores.sosialitet += 1.5;

    // Project preference
    if (universityData.projectPreference === 'short') scores.praktisk += 2;
    else if (universityData.projectPreference === 'long') scores.struktur += 2;
    else if (universityData.projectPreference === 'mixed') scores.struktur += 1;

    // Study choice reason
    if (universityData.studyChoiceReason === 'interesse') scores.kreativitet += 2;
    else if (universityData.studyChoiceReason === 'lonn') scores.ambisjon += 3;
    else if (universityData.studyChoiceReason === 'prestisje') scores.ambisjon += 2;
    else if (universityData.studyChoiceReason === 'familie') scores.sosialitet += 2;
    else if (universityData.studyChoiceReason === 'trygt') scores.struktur += 2;

    // Study missing
    if (universityData.studyMissing) {
      if (universityData.studyMissing.praktisk_erfaring === true) scores.praktisk += 2;
      if (universityData.studyMissing.relevante_fag === true) scores.analytisk += 2;
      if (universityData.studyMissing.veiledning === true) scores.sosialitet += 2;
      if (universityData.studyMissing.nettverk === true) scores.sosialitet += 2;
      if (universityData.studyMissing.fleksibilitet === true) scores.selvstendighet += 2;
      if (universityData.studyMissing.kobling === true) scores.struktur += 2;
    }

    // Current grades
    if (universityData.currentGrades === 'high') scores.ambisjon += 3;
    else if (universityData.currentGrades === 'good') scores.ambisjon += 2;
    else if (universityData.currentGrades === 'average') scores.ambisjon += 1;

    // Best subjects
    if (universityData.bestSubjects) {
      if (universityData.bestSubjects.teknologi === true) scores.teknologi += 2;
      if (universityData.bestSubjects.okonomi === true) scores.analytisk += 2;
      if (universityData.bestSubjects.samfunnsvitenskap === true) scores.bærekraft += 2;
      if (universityData.bestSubjects.humaniora === true) scores.kreativitet += 2;
      if (universityData.bestSubjects.naturvitenskap === true) scores.analytisk += 2;
      if (universityData.bestSubjects.helse === true) scores.helseinteresse += 2;
      if (universityData.bestSubjects.kunst === true) scores.kreativitet += 2;
      if (universityData.bestSubjects.ingenior === true) scores.teknologi += 2;
      if (universityData.bestSubjects.larer === true) scores.sosialitet += 2;
      if (universityData.bestSubjects.jus === true) scores.struktur += 2;
    }

    // Work experience (hadJob - yes/no)
    if (universityData.hadJob === 'yes') scores.praktisk += 2;

    // Ensure minimum scores of 1 for all dimensions
    Object.keys(scores).forEach(key => {
      scores[key as keyof typeof scores] = Math.max(1, scores[key as keyof typeof scores]);
    });

    return scores;
  };

  // Calculate dimension scores
  const dimensionScores = calculateDimensionScores();
  
  // Get top 3 dimensions
  const topDimensions = Object.entries(dimensionScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([dimension]) => dimension);
  
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
          value: interests.length ? interests.join(', ') : "Ingen oppgitt"
        },
        { 
          label: "Styrker", 
          value: strengths.length ? strengths.join(', ') : "Ingen oppgitt"
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
          value: getFormattedValue(universityData.preferredWorkEnvironment)
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
      
      {/* Dimension Ranking - Now properly populated with university data */}
      <DimensionRanking userData={{
        questionnaire: {
          university: universityData
        }
      }} questionnaire="university" />
      
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
