import React from 'react';
import ResultCard from './ResultCard';
import { getFormattedValue } from '@/utils/resultFormatters';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Check, BookOpen, GraduationCap, Briefcase } from "lucide-react";

interface ResultsGeneratorProps {
  userData: any;
  userType?: 'highSchool' | 'university' | 'worker';
}

const ResultsGenerator: React.FC<ResultsGeneratorProps> = ({ userData, userType }) => {
  // Extract user's questionnaire data
  const questionnaire = userData.questionnaire || {};
  
  // ELEV (HIGH SCHOOL) VIEW
  if (userType === 'highSchool') {
    const highSchoolData = questionnaire.highSchool;
    
    if (!highSchoolData) {
      return <div>Ingen data funnet</div>;
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
  }
  
  // STUDENT (UNIVERSITY) VIEW
  else if (userType === 'university') {
    const universityData = questionnaire.university;
    
    if (!universityData) {
      return <div>Ingen data funnet</div>;
    }
    
    // Extract interests and strengths
    const interests = Object.keys(universityData.interests || {})
      .filter(key => universityData.interests[key]);
    
    const strengths = Object.keys(universityData.strengths || {})
      .filter(key => universityData.strengths[key]);
    
    // Create basic info card
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
    
    // Define career recommendations
    const careerRecommendations = [
      { title: "Prosjektleder", location: "Teknologibedrifter", match: "Passer med dine organisatoriske evner" },
      { title: "Forsker", location: "Forskningsinstitusjoner", match: "Utnytter dine analytiske ferdigheter" },
      { title: "Konsulent", location: "Konsulentfirmaer", match: "Kombinerer dine sosiale og analytiske evner" }
    ];
    
    // Define next steps
    const nextSteps = [
      "Utforsk bedriftspresentasjoner på campus",
      "Delta på relevante konferanser i ditt fagfelt",
      "Søk praksisplasser innen interessante bransjer",
      "Knytt kontakter med alumni fra ditt studieprogram"
    ];
    
    return (
      <div className="space-y-10">
        {/* Personalized intro for university students */}
        <div className="bg-card p-6 rounded-lg border animate-fade-up relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-1 bg-primary"></div>
          <div className="relative">
            <div className="flex items-center mb-4">
              <GraduationCap className="h-6 w-6 mr-2 text-primary" />
              <h2 className="text-xl font-semibold">Universitets-/høyskolestudent</h2>
            </div>
            <p className="text-lg mb-6">
              Basert på svarene dine har vi laget en personlig profil som viser dine styrker, interesser 
              og mulige karriereveier som student. Dette er ikke en fasit – men en start på reisen mot 
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
        
        {/* Result cards for basic info */}
        {basicInfo.map((card, index) => (
          <ResultCard 
            key={index} 
            title={card.title} 
            icon={card.icon} 
            items={card.items} 
          />
        ))}
        
        {/* Career recommendations */}
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
  } 
  
  // WORKER VIEW
  else if (userType === 'worker') {
    const workerData = questionnaire.worker;
    
    if (!workerData) {
      return <div>Ingen data funnet</div>;
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
  }
  
  // DEFAULT/FALLBACK VIEW
  else {
    const resultSections = [];
    
    if (questionnaire.highSchool) {
      resultSections.push({
        title: "Din utdanningsprofil",
        icon: "education",
        items: [
          { label: "Skole", value: questionnaire.highSchool.school || "Ikke angitt" },
          { label: "Studieretning", value: questionnaire.highSchool.program || "Ikke angitt" },
          { label: "Årstrinn", value: questionnaire.highSchool.grade || "Ikke angitt" }
        ]
      });
    } else if (questionnaire.university) {
      resultSections.push({
        title: "Din utdanningsprofil",
        icon: "education",
        items: [
          { label: "Studiefelt", value: questionnaire.university.studyField || "Ikke angitt" },
          { label: "Institusjon", value: questionnaire.university.institution === 'other' ? 
            questionnaire.university.otherInstitution : questionnaire.university.institution || "Ikke angitt" },
          { label: "Utdanningsnivå", value: questionnaire.university.level || "Ikke angitt" },
          { label: "Sikkerhetsnivå på karrierevalg", value: getFormattedValue(questionnaire.university.certaintylevel) || "Ikke angitt" }
        ]
      });
    } else if (questionnaire.worker) {
      resultSections.push({
        title: "Din jobb og erfaring",
        icon: "work",
        items: [
          { label: "Nåværende stilling", value: questionnaire.worker.currentRole || "Ikke angitt" },
          { label: "Bransje", value: questionnaire.worker.industry || "Ikke angitt" },
          { label: "Erfaring", value: questionnaire.worker.experience ? questionnaire.worker.experience + " år" : "Ikke angitt" }
        ]
      });
    }

    // Add a default section if no questionnaire data is available
    if (resultSections.length === 0) {
      resultSections.push({
        title: "Grunnleggende informasjon",
        icon: "idea",
        items: [
          { label: "Navn", value: userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : "Test Bruker" },
          { label: "E-post", value: userData.email || "test@example.com" },
          { label: "Status", value: "Testdata" }
        ]
      });
    }

    return (
      <div className="space-y-10">
        <div className="bg-muted/30 p-6 rounded-lg">
          <p>Velg en spesifikk brukertype fra hovedsiden for å se tilpassede resultater.</p>
          <div className="flex gap-2 mt-4">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm">Elev</span>
            </div>
            <div className="flex items-center gap-1">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span className="text-sm">Student</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="h-4 w-4 text-primary" />
              <span className="text-sm">Arbeidstaker</span>
            </div>
          </div>
        </div>
        
        {resultSections.map((section, index) => (
          <ResultCard 
            key={index} 
            title={section.title} 
            icon={section.icon} 
            items={section.items} 
          />
        ))}
      </div>
    );
  }
};

export default ResultsGenerator;
