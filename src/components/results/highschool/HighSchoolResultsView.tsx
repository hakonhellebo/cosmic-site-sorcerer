import React, { useMemo } from 'react';
import { Check } from 'lucide-react';
import ResultCard from '../ResultCard';
import DimensionRanking from '../DimensionRanking';
import HighSchoolIntro from './HighSchoolIntro';
import RecommendedEducation from './RecommendedEducation';
import CareerOpportunities from './CareerOpportunities';
import { calculateHighSchoolDimensions } from '@/utils/dimensionCalculator';
import { matchEducationPrograms } from '@/utils/educationData';
import { getCareerRecommendations } from '@/utils/careerRecommendations';
import { 
  formatInterests, 
  formatCourses, 
  formatLearningStyle,
  formatWorkPreference,
  formatStudyDirection,
  formatGrade
} from '@/utils/highschoolDataFormatters';

interface HighSchoolResultsViewProps {
  userData: any;
}

export const HighSchoolResultsView: React.FC<HighSchoolResultsViewProps> = ({ userData }) => {
  const highSchoolData = userData?.questionnaire?.highSchool;
  
  if (!highSchoolData) {
    return <div>Ingen elevdata funnet</div>;
  }
  
  console.log("HighSchoolResultsView - Raw highSchoolData:", highSchoolData);
  
  const interests = Object.keys(highSchoolData.interests || {})
    .filter(key => highSchoolData.interests[key] === true);
  
  console.log("Filtered interests:", interests);
  
  const goodSkills = Object.keys(highSchoolData.goodSkills || {})
    .filter(key => highSchoolData.goodSkills[key] === true);
    
  console.log("Filtered goodSkills:", goodSkills);
  
  const workTasks = Object.keys(highSchoolData.workTasks || {})
    .filter(key => highSchoolData.workTasks[key] === true);
    
  console.log("Filtered workTasks:", workTasks);
  
  const dimensions = useMemo(() => {
    if (highSchoolData.strengths && !highSchoolData.goodSkills) {
      const convertedData = {
        ...highSchoolData,
        goodSkills: {
          logicalThinking: highSchoolData.strengths.analytisk === true,
          creativity: highSchoolData.strengths.kreativ === true,
          collaboration: highSchoolData.strengths.samarbeidsvillig === true,
          communication: highSchoolData.strengths.kommunikativ === true,
          leadership: highSchoolData.strengths.lederskap === true,
          problemSolving: highSchoolData.strengths.problemlosning === true,
          technicalUnderstanding: highSchoolData.strengths.teknisk === true
        },
        interests: {
          ...highSchoolData.interests,
          technology: highSchoolData.interests.teknologi === true,
          artDesign: highSchoolData.interests.kreativitet === true,
          sports: highSchoolData.interests.idrett === true,
          economyFinance: highSchoolData.interests.okonomi === true,
          travelCulture: highSchoolData.interests.reise === true,
          healthCare: highSchoolData.interests.helse === true,
          environmentSustainability: highSchoolData.interests.miljo === true
        }
      };
      console.log("Using converted data format for dimension calculation:", convertedData);
      return calculateHighSchoolDimensions(convertedData);
    }
    
    return calculateHighSchoolDimensions(highSchoolData);
  }, [highSchoolData]);
  
  console.log("Top 3 Calculated dimensions:", dimensions);
  
  const topDimensions = dimensions.map(dim => dim.name);
  
  const educationRecommendations = useMemo(() => {
    const allPossibleRecommendations = matchEducationPrograms(topDimensions, 20);
    console.log("All possible recommendations:", allPossibleRecommendations);
    
    const dim1 = topDimensions[0];
    const dim2 = topDimensions[1];
    const dim3 = topDimensions[2];
    
    console.log(`Using dimensions: 1) ${dim1}, 2) ${dim2}, 3) ${dim3}`);
    
    let dim1And2Matches = [];
    let dim1And3Matches = [];
    let dim2And3Matches = [];
    let otherGoodMatches = [];
    
    const hasDimensions = (program, dim1Value, dim2Value) => {
      const matchText = program.match.toLowerCase();
      return matchText.includes(dim1Value.toLowerCase()) && 
             matchText.includes(dim2Value.toLowerCase());
    };
    
    for (const rec of allPossibleRecommendations) {
      if (dim1And2Matches.some(r => r.name === rec.name) ||
          dim1And3Matches.some(r => r.name === rec.name) ||
          dim2And3Matches.some(r => r.name === rec.name) ||
          otherGoodMatches.some(r => r.name === rec.name)) {
        continue;
      }
      
      if (hasDimensions(rec, dim1, dim2)) {
        dim1And2Matches.push(rec);
      }
      else if (hasDimensions(rec, dim1, dim3)) {
        dim1And3Matches.push(rec);
      }
      else if (hasDimensions(rec, dim2, dim3)) {
        dim2And3Matches.push(rec);
      }
      else {
        otherGoodMatches.push(rec);
      }
    }
    
    console.log(`Found: ${dim1And2Matches.length} for dim1+2, ${dim1And3Matches.length} for dim1+3, ${dim2And3Matches.length} for dim2+3`);
    
    const finalDim1And2 = dim1And2Matches.slice(0, 3);
    const finalDim1And3 = dim1And3Matches.slice(0, 1);
    const finalDim2And3 = dim2And3Matches.slice(0, 1);
    
    if (finalDim1And2.length < 3) {
      console.log("Not enough dim1+2 matches, filling from other categories");
      const needed = 3 - finalDim1And2.length;
      
      const fillers = [
        ...dim1And3Matches.filter(r => !finalDim1And3.some(f => f.name === r.name)).slice(0, needed),
        ...dim2And3Matches.filter(r => !finalDim2And3.some(f => f.name === r.name)).slice(0, needed - finalDim1And2.length),
        ...otherGoodMatches.slice(0, needed - finalDim1And2.length)
      ].slice(0, needed);
      
      finalDim1And2.push(...fillers);
    }
    
    if (finalDim1And3.length < 1) {
      console.log("Missing dim1+3 match, filling from other categories");
      const filler = [...dim2And3Matches, ...otherGoodMatches].find(r => 
        !finalDim1And2.some(f => f.name === r.name) && 
        !finalDim2And3.some(f => f.name === r.name)
      );
      
      if (filler) finalDim1And3.push(filler);
    }
    
    if (finalDim2And3.length < 1) {
      console.log("Missing dim2+3 match, filling from other categories");
      const filler = [...dim1And3Matches, ...otherGoodMatches].find(r => 
        !finalDim1And2.some(f => f.name === r.name) && 
        !finalDim1And3.some(f => f.name === r.name)
      );
      
      if (filler) finalDim2And3.push(filler);
    }
    
    const finalOther = otherGoodMatches
      .filter(r => 
        !finalDim1And2.some(f => f.name === r.name) &&
        !finalDim1And3.some(f => f.name === r.name) &&
        !finalDim2And3.some(f => f.name === r.name)
      )
      .slice(0, 1);
    
    const combinedRecommendations = [
      ...finalDim1And2,
      ...finalDim1And3,
      ...finalDim2And3,
      ...finalOther
    ];
    
    if (combinedRecommendations.length < 6) {
      console.log(`Only have ${combinedRecommendations.length} recommendations, filling to get 6`);
      const remainingNeeded = 6 - combinedRecommendations.length;
      const additionalRecs = allPossibleRecommendations.filter(rec => 
        !combinedRecommendations.some(r => r.name === rec.name)
      ).slice(0, remainingNeeded);
      
      combinedRecommendations.push(...additionalRecs);
    }
    
    console.log("Final recommendations:", combinedRecommendations);
    return combinedRecommendations.slice(0, 6);
  }, [topDimensions]);
  
  const careerRecommendations = useMemo(() => {
    const educationProgramNames = educationRecommendations.map(rec => rec.name);
    console.log("Fetching career data for programs:", educationProgramNames);
    
    const careerData = getCareerRecommendations(educationProgramNames);
    console.log("Career data received:", careerData);
    
    return educationRecommendations.map((rec, index) => {
      const matchingCareerData = careerData.find(career => 
        career.educationProgram.toLowerCase().includes(rec.name.toLowerCase()) ||
        rec.name.toLowerCase().includes(career.educationProgram.toLowerCase())
      );
      
      console.log(`Matching career data for ${rec.name}:`, matchingCareerData);
      
      if (matchingCareerData) {
        const careersWithCompanies = (matchingCareerData.jobs || []).map((job, idx) => {
          const startIdx = idx * 3 % Math.max(matchingCareerData.companies?.length || 1, 1);
          const jobSpecificCompanies = matchingCareerData.companies?.length 
            ? [
                ...matchingCareerData.companies.slice(startIdx, startIdx + 3),
                ...matchingCareerData.companies.slice(0, Math.max(0, 3 - (matchingCareerData.companies.length - startIdx)))
              ].slice(0, 3)
            : [];
            
          return {
            ...job,
            companies: jobSpecificCompanies
          };
        });
        
        return {
          title: rec.name,
          institution: rec.institution,
          match: rec.match,
          description: rec.description || '',
          careers: careersWithCompanies
        };
      }
      
      return {
        title: rec.name,
        institution: rec.institution,
        match: rec.match,
        description: rec.description || '',
        careers: rec.careers || []
      };
    });
  }, [educationRecommendations]);
  
  const favoriteCourses = Object.keys(highSchoolData.favoriteCourses || {})
    .filter(key => highSchoolData.favoriteCourses[key] === true);
  
  const difficultCourses = Object.keys(highSchoolData.difficultCourses || {})
    .filter(key => highSchoolData.difficultCourses[key] === true);
  
  const basicInfoCards = [
    {
      title: "Din skoleprofil",
      icon: "education",
      items: [
        { 
          label: "Årstrinn", 
          value: formatGrade(highSchoolData.grade)
        },
        { 
          label: "Studieretning", 
          value: formatStudyDirection(highSchoolData.studyDirection)
        },
        { 
          label: "Karaktersnitt", 
          value: highSchoolData.averageGrade || 'Ikke spesifisert' 
        }
      ]
    },
    {
      title: "Dine fag og preferanser",
      icon: "award",
      items: [
        { 
          label: "Favorittfag", 
          value: formatCourses(highSchoolData.favoriteCourses, highSchoolData.favoriteCoursesOther)
        },
        { 
          label: "Utfordrende fag", 
          value: formatCourses(highSchoolData.difficultCourses, highSchoolData.difficultCoursesOther)
        },
        { 
          label: "Arbeidspreferanse", 
          value: formatWorkPreference(highSchoolData.workPreference)
        }
      ]
    }
  ];
  
  const nextSteps = [
    "Snakk med rådgiver på skolen",
    "Utforsk utdanningsprogrammer på utdanning.no",
    "Besøk åpen dag hos aktuelle utdanningsinstitusjoner",
    "Delta på karrieredager og møt potensielle arbeidsgivere",
    "Meld deg på fagforedrag om temaer som interesserer deg"
  ];
  
  const formattedInterests = formatInterests(highSchoolData.interests);
  const formattedLearningStyle = formatLearningStyle(highSchoolData.learningStyle);
  const formattedWorkPreference = formatWorkPreference(highSchoolData.workPreference);
  
  return (
    <div className="space-y-10">
      <HighSchoolIntro 
        dimensions={dimensions}
        interests={formattedInterests}
        learningStyle={formattedLearningStyle}
        workPreference={formattedWorkPreference}
      />
      
      <DimensionRanking userData={userData} questionnaire="highSchool" />
      
      {basicInfoCards.map((card, index) => (
        <ResultCard 
          key={index} 
          title={card.title} 
          icon={card.icon} 
          items={card.items} 
        />
      ))}
      
      <RecommendedEducation 
        recommendations={educationRecommendations} 
        nextSteps={[]}
        showAllRecommendations={true}
        maxCount={6}
      />
      
      <CareerOpportunities 
        recommendations={careerRecommendations}
        showAllOpportunities={false}
        maxCount={6}
      />
      
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
