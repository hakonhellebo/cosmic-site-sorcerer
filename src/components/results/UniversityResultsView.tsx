
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

    // Interest fields (question 6)
    if (universityData.interests) {
      if (universityData.interests.technology) scores.teknologi += 3;
      if (universityData.interests.economy) scores.analytisk += 3;
      if (universityData.interests.socialScience) scores.bærekraft += 2;
      if (universityData.interests.humanities) scores.kreativitet += 2;
      if (universityData.interests.healthPsychology) scores.helseinteresse += 3;
      if (universityData.interests.environmentSustainability) scores.bærekraft += 3;
      if (universityData.interests.artDesign) scores.kreativitet += 3;
    }

    // Strengths (question 7)
    if (universityData.strengths) {
      if (universityData.strengths.criticalThinking) scores.analytisk += 2;
      if (universityData.strengths.projectManagement) scores.struktur += 2;
      if (universityData.strengths.technologicalUnderstanding) scores.teknologi += 2;
      if (universityData.strengths.humanUnderstanding) scores.helseinteresse += 2;
      if (universityData.strengths.creativeProblemSolving) scores.kreativitet += 2;
      if (universityData.strengths.collaborationLeadership) scores.sosialitet += 2;
      if (universityData.strengths.empathyCommunication) scores.sosialitet += 2;
    }

    // Weaknesses (question 8) - not used in scoring

    // Learning style (question 8) - favorite tasks
    if (universityData.learningStyle) {
      if (universityData.learningStyle.analytical) scores.analytisk += 3;
      if (universityData.learningStyle.creative) scores.kreativitet += 3;
      if (universityData.learningStyle.practical) scores.praktisk += 3;
      if (universityData.learningStyle.projectBased) scores.struktur += 2;
      if (universityData.learningStyle.leadingOrganizing) scores.ambisjon += 2;
      if (universityData.learningStyle.guidingHelping) scores.sosialitet += 2;
    }

    // Collaboration style (question 9)
    if (universityData.collaboration === 'independent') scores.selvstendighet += 3;
    else if (universityData.collaboration === 'team') scores.sosialitet += 3;
    else if (universityData.collaboration === 'both') scores.struktur += 2;

    // AI comfort level (question 10)
    if (universityData.aiUsage === 'very-comfortable') scores.teknologi += 3;
    else if (universityData.aiUsage === 'comfortable') scores.teknologi += 2;
    else if (universityData.aiUsage === 'slightly-comfortable') scores.teknologi += 1;

    // Internship experience (questions 12-13)
    if (universityData.internship === 'yes') scores.praktisk += 2;
    
    if (universityData.internshipValue === 'very-useful') scores.praktisk += 3;
    else if (universityData.internshipValue === 'somewhat-useful') scores.praktisk += 2;
    else if (universityData.internshipValue === 'not-very-useful') scores.praktisk += 1;

    // Study reason (question 14)
    if (universityData.studyReason === 'job-security') scores.ambisjon += 2;
    else if (universityData.studyReason === 'good-earnings') scores.ambisjon += 3;
    else if (universityData.studyReason === 'make-difference') scores.bærekraft += 3;
    else if (universityData.studyReason === 'passion') scores.kreativitet += 3;

    // Salary importance (question 15)
    if (universityData.salaryImportance === 'very-important') scores.ambisjon += 3;
    else if (universityData.salaryImportance === 'somewhat-important') scores.ambisjon += 2;
    else if (universityData.salaryImportance === 'not-very-important') scores.ambisjon += 1;

    // Impact importance (question 16)
    if (universityData.impactImportance === 'very-important') scores.bærekraft += 3;
    else if (universityData.impactImportance === 'somewhat-important') scores.bærekraft += 2;
    else if (universityData.impactImportance === 'not-very-important') scores.bærekraft += 1;

    // Job priorities (question 22)
    if (universityData.jobPriorities) {
      if (universityData.jobPriorities.competition) scores.ambisjon += 2;
      if (universityData.jobPriorities.inexperience) scores.praktisk += 2;
      if (universityData.jobPriorities.highRequirements) scores.struktur += 2;
    }

    // International importance (question 18)
    if (universityData.internationalImportance === 'very-important') scores.selvstendighet += 3;
    else if (universityData.internationalImportance === 'somewhat-important') scores.selvstendighet += 2;
    else if (universityData.internationalImportance === 'not-very-important') scores.selvstendighet += 1;

    // Entrepreneurship (question 19)
    if (universityData.entrepreneurship === 'yes') scores.selvstendighet += 3;
    else if (universityData.entrepreneurship === 'maybe') scores.selvstendighet += 2;
    else if (universityData.entrepreneurship === 'no') scores.struktur += 1;

    // Future role (question 20-21)
    if (universityData.futureRole === 'leadership') scores.ambisjon += 3;
    else if (universityData.futureRole === 'specialist') scores.analytisk += 3;
    else if (universityData.futureRole === 'entrepreneur') scores.selvstendighet += 3;

    // Employer factors (question 22)
    if (universityData.futureEmployerFactors) {
      if (universityData.futureEmployerFactors.highSalary) scores.ambisjon += 2;
      if (universityData.futureEmployerFactors.goodEnvironment) scores.sosialitet += 2;
      if (universityData.futureEmployerFactors.careerDevelopment) scores.ambisjon += 2;
      if (universityData.futureEmployerFactors.stability) scores.struktur += 2;
      if (universityData.futureEmployerFactors.innovation) scores.kreativitet += 2;
    }

    // Preferred company (question 23)
    if (universityData.preferredCompanyType === 'startup') scores.selvstendighet += 3;
    else if (universityData.preferredCompanyType === 'small-medium') scores.sosialitet += 2;
    else if (universityData.preferredCompanyType === 'large-corporate') scores.struktur += 2;
    else if (universityData.preferredCompanyType === 'public-sector') scores.struktur += 2;
    else if (universityData.preferredCompanyType === 'non-profit') scores.bærekraft += 2;

    // Technology importance (question 24)
    if (universityData.technologyImportance === 'very-important') scores.teknologi += 3;
    else if (universityData.technologyImportance === 'somewhat-important') scores.teknologi += 2;
    else if (universityData.technologyImportance === 'not-very-important') scores.teknologi += 1;

    // Work-life balance (question 25)
    if (universityData.workLifeBalance === 'work-first') scores.ambisjon += 3;
    else if (universityData.workLifeBalance === 'balanced') scores.struktur += 3;
    else if (universityData.workLifeBalance === 'life-first') scores.selvstendighet += 2;

    // Remote work importance (question 26)
    if (universityData.remoteWorkImportance === 'very-important') scores.selvstendighet += 3;
    else if (universityData.remoteWorkImportance === 'somewhat-important') scores.selvstendighet += 2;
    else if (universityData.remoteWorkImportance === 'not-very-important') scores.struktur += 1;

    // Travel importance (question 27)
    if (universityData.travelImportance === 'very-important') scores.selvstendighet += 3;
    else if (universityData.travelImportance === 'somewhat-important') scores.selvstendighet += 2;
    else if (universityData.travelImportance === 'not-very-important') scores.struktur += 1;

    // Satisfaction factors (question 28)
    if (universityData.satisfactionFactors) {
      if (universityData.satisfactionFactors.meaningfulWork) scores.bærekraft += 2;
      if (universityData.satisfactionFactors.highSalary) scores.ambisjon += 2;
      if (universityData.satisfactionFactors.careerDevelopment) scores.ambisjon += 2;
      if (universityData.satisfactionFactors.flexibility) scores.selvstendighet += 2;
      if (universityData.satisfactionFactors.innovation) scores.kreativitet += 2;
      if (universityData.satisfactionFactors.stability) scores.struktur += 2;
    }

    // Employer values (question 29)
    if (universityData.employerValuesImportance === 'very-important') scores.bærekraft += 3;
    else if (universityData.employerValuesImportance === 'somewhat-important') scores.bærekraft += 2;
    else if (universityData.employerValuesImportance === 'not-very-important') scores.bærekraft += 1;

    // Work environment (question 30)
    if (universityData.preferredWorkEnvironment === 'structured') scores.struktur += 3;
    else if (universityData.preferredWorkEnvironment === 'creative') scores.kreativitet += 3;
    else if (universityData.preferredWorkEnvironment === 'social') scores.sosialitet += 3;
    else if (universityData.preferredWorkEnvironment === 'independent') scores.selvstendighet += 3;

    // People vs tech (question 31)
    if (universityData.peopleTech === 'people') scores.sosialitet += 3;
    else if (universityData.peopleTech === 'tech') scores.teknologi += 3;
    else if (universityData.peopleTech === 'both') scores.struktur += 2;

    // Project preference (question 32)
    if (universityData.projectPreference === 'short') scores.praktisk += 2;
    else if (universityData.projectPreference === 'long') scores.struktur += 2;
    else if (universityData.projectPreference === 'combination') scores.struktur += 1.5;

    // Uncertainty reaction (question 33)
    if (universityData.uncertaintyReaction === 'enjoy') scores.selvstendighet += 3;
    else if (universityData.uncertaintyReaction === 'handle-ok') scores.selvstendighet += 2;
    else if (universityData.uncertaintyReaction === 'challenging') scores.struktur += 1;
    else if (universityData.uncertaintyReaction === 'dislike') scores.struktur += 0;

    // Career path importance (question 34)
    if (universityData.careerPathImportance === 'very-important') scores.struktur += 3;
    else if (universityData.careerPathImportance === 'somewhat-important') scores.struktur += 2;
    else if (universityData.careerPathImportance === 'not-very-important') scores.struktur += 1;
    else if (universityData.careerPathImportance === 'not-important') scores.selvstendighet += 0;

    // Study choice reason (question 36)
    if (universityData.studyChoiceReason === 'interests') scores.kreativitet += 2;
    else if (universityData.studyChoiceReason === 'salary-prospects') scores.ambisjon += 3;
    else if (universityData.studyChoiceReason === 'prestige') scores.ambisjon += 2;
    else if (universityData.studyChoiceReason === 'family-influence') scores.struktur += 1;
    else if (universityData.studyChoiceReason === 'safe-choice') scores.struktur += 2;

    // Post study plan (question 37)
    if (universityData.postStudyPlan === 'private-sector') scores.ambisjon += 2;
    else if (universityData.postStudyPlan === 'public-sector') scores.struktur += 2;
    else if (universityData.postStudyPlan === 'entrepreneur') scores.selvstendighet += 3;
    else if (universityData.postStudyPlan === 'travel-break') scores.selvstendighet += 2;
    else if (universityData.postStudyPlan === 'further-studies') scores.analytisk += 2;

    // Industry contact (question 38)
    if (universityData.industryContact === 'yes-lectures') scores.sosialitet += 2;
    else if (universityData.industryContact === 'yes-network') scores.sosialitet += 3;
    else if (universityData.industryContact === 'no-but-want') scores.sosialitet += 0.5;
    else if (universityData.industryContact === 'no-not-considered') scores.struktur += 0.5;

    // Study missing (question 39)
    if (universityData.studyMissing) {
      if (universityData.studyMissing.practicalExperience) scores.praktisk += 2;
      if (universityData.studyMissing.relevantCourses) scores.analytisk += 2;
      if (universityData.studyMissing.betterGuidance) scores.sosialitet += 2;
      if (universityData.studyMissing.industryNetwork) scores.sosialitet += 2;
      if (universityData.studyMissing.flexibility) scores.selvstendighet += 2;
      if (universityData.studyMissing.clearStrengthsLink) scores.struktur += 2;
    }

    // Setback reaction (question 40)
    if (universityData.setbackReaction === 'seek-help') scores.sosialitet += 2;
    else if (universityData.setbackReaction === 'try-myself') scores.selvstendighet += 2;
    else if (universityData.setbackReaction === 'procrastinate') scores.struktur += 1;
    else if (universityData.setbackReaction === 'lose-motivation') scores.struktur += 0.5;
    else if (universityData.setbackReaction === 'solve-structure') scores.struktur += 2;

    // Current grades (question 43)
    if (universityData.currentGrades === 'high') scores.ambisjon += 3;
    else if (universityData.currentGrades === 'good') scores.ambisjon += 2;
    else if (universityData.currentGrades === 'average') scores.ambisjon += 1;
    else if (universityData.currentGrades === 'low') scores.struktur += 0.5;

    // Best subjects (question 44)
    if (universityData.bestSubjects) {
      if (universityData.bestSubjects.technology) scores.teknologi += 2;
      if (universityData.bestSubjects.finance) scores.analytisk += 2;
      if (universityData.bestSubjects.socialScience) scores.bærekraft += 2;
      if (universityData.bestSubjects.humanities) scores.kreativitet += 2;
      if (universityData.bestSubjects.healthPsychology) scores.helseinteresse += 2;
      if (universityData.bestSubjects.artDesign) scores.kreativitet += 2;
    }

    // Work experience (question 45-51)
    if (universityData.hadJob === 'yes') scores.praktisk += 2;

    // Job count (question 46)
    if (universityData.jobCount === '1') scores.ambisjon += 1;
    else if (universityData.jobCount === '2-3') scores.ambisjon += 2;
    else if (universityData.jobCount === '4+') scores.ambisjon += 3;

    // Job types (question 47)
    if (universityData.jobTypes) {
      if (universityData.jobTypes.retail) scores.sosialitet += 2;
      if (universityData.jobTypes.healthcare) scores.helseinteresse += 2;
      if (universityData.jobTypes.technology) scores.teknologi += 2;
      if (universityData.jobTypes.office) scores.struktur += 2;
      if (universityData.jobTypes.teaching) scores.sosialitet += 2;
      if (universityData.jobTypes.creative) scores.kreativitet += 2;
      if (universityData.jobTypes.logistics) scores.praktisk += 2;
    }

    // Industries (question 48)
    if (universityData.industries) {
      if (universityData.industries.retail) scores.praktisk += 2;
      if (universityData.industries.technology) scores.teknologi += 2;
      if (universityData.industries.healthcare) scores.helseinteresse += 2;
      if (universityData.industries.education) scores.sosialitet += 2;
      if (universityData.industries.consulting) scores.analytisk += 2;
      if (universityData.industries.government) scores.struktur += 2;
      if (universityData.industries.media) scores.kreativitet += 2;
    }

    // Job learning (question 51)
    if (universityData.jobLearning) {
      if (universityData.jobLearning.collaboration) scores.sosialitet += 2;
      if (universityData.jobLearning.structure) scores.struktur += 2;
      if (universityData.jobLearning.customerService) scores.sosialitet += 2;
      if (universityData.jobLearning.technical) scores.teknologi += 2;
      if (universityData.jobLearning.leadership) scores.ambisjon += 2;
      if (universityData.jobLearning.communication) scores.sosialitet += 2;
    }

    // Ensure minimum scores
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
  
  // Extract top dimensions from answers for education recommendations
  // Using actual calculated dimensions now
  
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
      
      {/* Dimension Ranking - Now properly populated with university data */}
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
