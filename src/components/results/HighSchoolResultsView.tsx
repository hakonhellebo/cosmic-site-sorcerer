
import React from 'react';
import ResultCard from './ResultCard';
import { getFormattedValue } from '@/utils/resultFormatters';
import { Badge } from "@/components/ui/badge";
import { Check, BookOpen } from "lucide-react";
import DimensionRanking from './DimensionRanking';

interface HighSchoolResultsViewProps {
  userData: any;
}

export const HighSchoolResultsView: React.FC<HighSchoolResultsViewProps> = ({ userData }) => {
  const highSchoolData = userData?.questionnaire?.highSchool;
  
  if (!highSchoolData) {
    return <div>Ingen elevdata funnet</div>;
  }
  
  // Extract interests, strengths, and subjects
  const interests = Object.keys(highSchoolData.interests || {})
    .filter(key => highSchoolData.interests[key] === true);
  
  const goodSkills = Object.keys(highSchoolData.goodSkills || {})
    .filter(key => highSchoolData.goodSkills[key] === true);
  
  const workTasks = Object.keys(highSchoolData.workTasks || {})
    .filter(key => highSchoolData.workTasks[key] === true);
  
  // Extract favorite and difficult subjects
  const favoriteCourses = Object.keys(highSchoolData.favoriteCourses || {})
    .filter(key => highSchoolData.favoriteCourses[key] === true);
  
  const difficultCourses = Object.keys(highSchoolData.difficultCourses || {})
    .filter(key => highSchoolData.difficultCourses[key] === true);
  
  // Create basic info cards
  const basicInfoCards = [
    {
      title: "Din skoleprofil",
      icon: "education",
      items: [
        { label: "Årstrinn", value: highSchoolData.grade === 'vg1' ? 'VG1' : 
                                    highSchoolData.grade === 'vg2' ? 'VG2' : 
                                    highSchoolData.grade === 'vg3' ? 'VG3' : 'Ikke spesifisert' },
        { label: "Studieretning", value: highSchoolData.studyDirection === 'general-studies' ? 'Studiespesialisering' :
                                        highSchoolData.studyDirection === 'vocational' ? 'Yrkesfag' : 'Ikke spesifisert' },
        { label: "Karaktersnitt", value: highSchoolData.averageGrade || 'Ikke spesifisert' }
      ]
    },
    {
      title: "Dine fag og preferanser",
      icon: "award",
      items: [
        { 
          label: "Favorittfag", 
          value: favoriteCourses.length > 0 ? 
            favoriteCourses.map(course => 
              course === 'mathematics' ? 'Matematikk' :
              course === 'norwegian' ? 'Norsk' :
              course === 'english' ? 'Engelsk' :
              course === 'socialStudies' ? 'Samfunnsfag' :
              course === 'science' ? 'Naturfag' :
              course === 'physEd' ? 'Gym' :
              course === 'artsCrafts' ? 'Kunst og håndverk' :
              course === 'foreignLanguage' ? 'Fremmedspråk' :
              course === 'other' ? highSchoolData.favoriteCoursesOther : course
            ).join(', ') : 
            "Ingen valgt"
        },
        { 
          label: "Utfordrende fag", 
          value: difficultCourses.length > 0 ? 
            difficultCourses.map(course => 
              course === 'mathematics' ? 'Matematikk' :
              course === 'norwegian' ? 'Norsk' :
              course === 'english' ? 'Engelsk' :
              course === 'socialStudies' ? 'Samfunnsfag' :
              course === 'science' ? 'Naturfag' :
              course === 'physEd' ? 'Gym' :
              course === 'artsCrafts' ? 'Kunst og håndverk' :
              course === 'foreignLanguage' ? 'Fremmedspråk' :
              course === 'other' ? highSchoolData.difficultCoursesOther : course
            ).join(', ') : 
            "Ingen valgt"
        },
        { 
          label: "Arbeidspreferanse", 
          value: highSchoolData.workPreference === 'alone' ? 'Jobbe alene' : 
                 highSchoolData.workPreference === 'team' ? 'Jobbe i team' : 
                 'Kombinasjon av alene og i team'
        }
      ]
    }
  ];
  
  // Define recommended education options based on interests, skills and tasks
  const educationRecommendations = [
    { 
      name: interests.includes('technology') || goodSkills.includes('technicalUnderstanding') ? 
            "Informatikk" : "Økonomi",
      institution: "NTNU / UiO", 
      match: interests.includes('technology') ? 
             "Passer med din teknologiinteresse og analytiske evner" : 
             "Passer med din interesse for økonomi og analytiske evner"
    },
    { 
      name: interests.includes('economyFinance') ? 
            "Økonomi og administrasjon" : "Psykologi",
      institution: "NHH / BI / UiO", 
      match: interests.includes('economyFinance') ? 
             "Passer med din interesse for økonomi og finans" :
             "Passer med dine sosiale og analytiske evner"
    },
    { 
      name: workTasks.includes('leadership') ? 
            "Ledelse og organisasjon" : "Datavitenskap",
      institution: "BI / UiO", 
      match: workTasks.includes('leadership') ? 
             "Passer med dine lederegenskaper og analytiske evner" :
             "Passer med din tekniske forståelse og problemløsningsevner"
    }
  ];
  
  // Define next steps
  const nextSteps = [
    "Snakk med rådgiver på skolen",
    "Utforsk utdanningsprogrammer på utdanning.no",
    "Besøk åpen dag hos aktuelle utdanningsinstitusjoner",
    "Delta på karrieredager og møt potensielle arbeidsgivere"
  ];
  
  return (
    <div className="space-y-10">
      {/* Personalized intro for high school students */}
      <div className="bg-card p-6 rounded-lg border animate-fade-up relative overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-1 bg-primary"></div>
        <div className="relative">
          <div className="flex items-center mb-4">
            <BookOpen className="h-6 w-6 mr-2 text-primary" />
            <h2 className="text-xl font-semibold">Videregåendeskole-elev</h2>
          </div>
          <p className="text-lg mb-6">
            Basert på svarene dine har vi laget en personlig profil som viser dine styrker, interesser 
            og mulige utdanningsveier. Dette er ikke en fasit – men en start på reisen mot noe som passer deg.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-md">
              <h4 className="font-medium">Interesser</h4>
              <p className="text-sm">{interests.length > 0 ? 
                interests.map(interest => 
                  interest === 'technology' ? 'Teknologi' :
                  interest === 'artDesign' ? 'Kunst og design' :
                  interest === 'sports' ? 'Sport' :
                  interest === 'economyFinance' ? 'Økonomi og finans' :
                  interest === 'travelCulture' ? 'Reise og kultur' :
                  interest === 'healthCare' ? 'Helse og omsorg' :
                  interest === 'environmentSustainability' ? 'Miljø og bærekraft' :
                  interest
                ).join(', ') : "Ingen valgt"}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-md">
              <h4 className="font-medium">Læringsstil</h4>
              <p className="text-sm">
                {highSchoolData.learningStyle ? 
                  Object.keys(highSchoolData.learningStyle)
                    .filter(key => highSchoolData.learningStyle[key] === true)
                    .map(style => 
                      style === 'reading' ? 'Lesing' :
                      style === 'listening' ? 'Lytting' :
                      style === 'practical' ? 'Praktisk' :
                      style === 'discussing' ? 'Diskusjon' :
                      style === 'watching' ? 'Observasjon' :
                      style === 'unknown' ? 'Vet ikke' :
                      style
                    ).join(', ') : 
                  "Ikke spesifisert"}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-md">
              <h4 className="font-medium">Arbeidspreferanser</h4>
              <p className="text-sm">
                {highSchoolData.workPreference === 'alone' ? 'Jobbe alene' : 
                 highSchoolData.workPreference === 'team' ? 'Jobbe i team' : 
                 'Kombinasjon av alene og i team'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dimension Ranking - Now passing actual user data */}
      <DimensionRanking userData={userData} questionnaire="highSchool" />
      
      {/* Basic info cards */}
      {basicInfoCards.map((card, index) => (
        <ResultCard 
          key={index} 
          title={card.title} 
          icon={card.icon} 
          items={card.items} 
        />
      ))}
      
      {/* Recommended education options */}
      <div className="animate-fade-up">
        <h3 className="text-2xl font-semibold mb-6">Anbefalte utdanninger</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {educationRecommendations.map((edu, idx) => (
            <div key={idx} className="bg-card border rounded-lg p-5 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-lg mb-2">{edu.name}</h4>
              <p className="text-sm text-muted-foreground mb-3">{edu.institution}</p>
              <div className="bg-muted/40 p-3 rounded">
                <p className="text-sm">Passer deg: {edu.match}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Next steps */}
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
