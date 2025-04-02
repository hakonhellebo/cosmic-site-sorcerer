
import React, { useMemo } from 'react';
import { Check } from 'lucide-react';
import ResultCard from './ResultCard';
import DimensionRanking from './DimensionRanking';
import RecommendedEducation from './highschool/RecommendedEducation';
import CareerOpportunities from './highschool/CareerOpportunities';
import { getFormattedValue } from '@/utils/resultFormatters';
import { Badge } from "@/components/ui/badge";
import { GraduationCap } from "lucide-react";
import { matchEducationPrograms } from '@/utils/educationData';

interface UniversityResultsViewProps {
  userData: any;
}

export const UniversityResultsView: React.FC<UniversityResultsViewProps> = ({ userData }) => {
  const universityData = userData?.questionnaire?.university;
  
  if (!universityData) {
    return <div>Ingen data funnet</div>;
  }
  
  console.log("UniversityResultsView - Raw universityData:", universityData);
  
  // Extract interests and strengths
  const interests = Object.keys(universityData.interests || {})
    .filter(key => universityData.interests[key] === true);
  
  console.log("Filtered interests:", interests);
  
  const strengths = Object.keys(universityData.strengths || {})
    .filter(key => universityData.strengths[key] === true);
  
  console.log("Filtered strengths:", strengths);
  
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
  
  // Sort dimensions by score (highest first)
  const dimensions = useMemo(() => {
    return Object.entries(dimensionScores)
      .map(([name, score]) => ({ name, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // Get top 3
  }, [dimensionScores]);
  
  console.log("Top 3 Calculated dimensions:", dimensions);
  
  // Get top dimension names for education recommendations
  const topDimensions = dimensions.map(dim => dim.name);
  
  // Match education programs based on dimensions - show more recommendations
  const educationRecommendations = useMemo(() => {
    return matchEducationPrograms(topDimensions, 8);
  }, [topDimensions]);
  
  console.log("Education recommendations:", educationRecommendations);
  
  // Create basic info cards
  const basicInfoCards = [
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
  
  // Format learning style
  const formatLearningStyle = (learningStyle: any) => {
    if (!learningStyle) return "Ikke spesifisert";
    
    const styles = Object.keys(learningStyle).filter(key => learningStyle[key] === true);
    if (!styles.length) return "Ingen foretrukket stil";
    
    return styles.join(', ');
  };
  
  // Format work preference
  const formatWorkPreference = (preference: string) => {
    switch(preference) {
      case 'team': return 'Teamarbeid';
      case 'individual': return 'Selvstendig arbeid';
      case 'mixed': return 'Kombinasjon av team og selvstendig';
      default: return 'Ikke spesifisert';
    }
  };
  
  // Format interests for display
  const formattedInterests = interests.length ? interests.join(', ') : "Ikke spesifisert";
  const formattedLearningStyle = formatLearningStyle(universityData.learningStyle);
  
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
              {dimensions.map((dim, index) => {
                const dimensionColors = {
                  analytisk: "bg-primary/10",
                  ambisjon: "bg-blue-100",
                  teknologi: "bg-green-100",
                  kreativitet: "bg-amber-100",
                  struktur: "bg-purple-100",
                  sosialitet: "bg-rose-100",
                  helseinteresse: "bg-red-100",
                  bærekraft: "bg-emerald-100",
                  selvstendighet: "bg-sky-100",
                  praktisk: "bg-orange-100"
                };
                
                const dimensionDescriptions = {
                  analytisk: "Du har sterke analytiske evner og er god til å løse komplekse problemer.",
                  ambisjon: "Du er fokusert på å nå dine mål og jobber systematisk mot dem.",
                  teknologi: "Du har god teknologiforståelse og interesse for digitale løsninger.",
                  kreativitet: "Du har kreative evner og liker å tenke utenfor boksen.",
                  struktur: "Du er strukturert, organisert og metodisk i din tilnærming.",
                  sosialitet: "Du trives med å jobbe i team og bidra til fellesskapet.",
                  helseinteresse: "Du er opptatt av helse og velvære, både for deg selv og andre.",
                  bærekraft: "Du er opptatt av bærekraft og samfunnsansvar.",
                  selvstendighet: "Du er selvstendig, selvgående og liker å ta egne valg.",
                  praktisk: "Du er praktisk anlagt og liker å se konkrete resultater."
                };
                
                const color = dimensionColors[dim.name as keyof typeof dimensionColors] || "bg-gray-100";
                const description = dimensionDescriptions[dim.name as keyof typeof dimensionDescriptions] || "";
                
                return (
                  <div key={index} className={`p-3 ${color} rounded-md`}>
                    <h4 className="font-medium capitalize">{dim.name}</h4>
                    <p className="text-sm">{description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Dimension Ranking */}
      <DimensionRanking 
        userData={userData} 
        questionnaire="university" 
      />
      
      {/* Basic info cards */}
      {basicInfoCards.map((card, index) => (
        <ResultCard 
          key={index} 
          title={card.title} 
          icon={card.icon} 
          items={card.items} 
        />
      ))}

      {/* Education recommendations section */}
      <RecommendedEducation 
        recommendations={educationRecommendations}
        nextSteps={[]}
        showAllRecommendations={true}
        title={isBachelorStudent ? "Anbefalte masterprogrammer" : "Anbefalte karriereveier"}
        subtitle={isBachelorStudent 
          ? "Basert på din profil har vi funnet disse masterprogrammene som kan passe for deg" 
          : "Basert på din profil har vi funnet disse karriereveiene som kan passe for deg"}
      />
      
      {/* Career opportunities section */}
      <CareerOpportunities 
        recommendations={educationRecommendations}
        showAllOpportunities={true}
      />
      
      {/* Next steps - updated content to match high school view */}
      <div className="bg-muted/10 p-6 rounded-lg border">
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
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
            <span>Få kontakt med bransjer og arbeidsgivere – og se hvor du faktisk kan søke</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
            <span>Få oversikt over relevante utdanninger, snitt og opptak – på én side</span>
          </li>
        </ul>
        
        <p className="mt-4">Alt dette er basert på dine svar – og vil tilpasse seg deg, ikke motsatt.</p>
      </div>
    </div>
  );
};
