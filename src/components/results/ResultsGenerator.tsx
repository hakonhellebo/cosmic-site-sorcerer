import React from 'react';
import ResultCard from './ResultCard';
import { getFormattedValue } from '@/utils/resultFormatters';
import { Badge } from "@/components/ui/badge";

interface ResultsGeneratorProps {
  userData: any;
}

const ResultsGenerator: React.FC<ResultsGeneratorProps> = ({ userData }) => {
  // Extract user's questionnaire data
  const questionnaire = userData.questionnaire || {};
  const resultSections = [];
  
  if (questionnaire.university) {
    // University questionnaire results
    resultSections.push(
      {
        title: "Din utdanningsprofil",
        icon: "education",
        items: [
          { label: "Studiefelt", value: questionnaire.university.studyField },
          { label: "Institusjon", value: questionnaire.university.institution === 'other' ? 
            questionnaire.university.otherInstitution : questionnaire.university.institution },
          { label: "Utdanningsnivå", value: questionnaire.university.level },
          { label: "Sikkerhetsnivå på karrierevalg", value: getFormattedValue(questionnaire.university.certaintylevel) }
        ]
      },
      {
        title: "Dine styrker og interesser",
        icon: "award",
        items: [
          { 
            label: "Interesser", 
            value: Object.keys(questionnaire.university.interests || {})
              .filter(key => questionnaire.university.interests[key])
              .join(', ') || "Ingen oppgitt"
          },
          { 
            label: "Styrker", 
            value: Object.keys(questionnaire.university.strengths || {})
              .filter(key => questionnaire.university.strengths[key])
              .join(', ') || "Ingen oppgitt"
          }
        ]
      },
      {
        title: "Karriere og fremtid",
        icon: "target",
        items: [
          { 
            label: "Foretrukket rolle", 
            value: getFormattedValue(questionnaire.university.futureRole)
          },
          { 
            label: "Ønsket arbeidsform", 
            value: getFormattedValue(questionnaire.university.workEnvironment)
          },
          { 
            label: "Drømmejobb", 
            value: questionnaire.university.dreamJob || "Ikke angitt"
          }
        ]
      },
      {
        title: "Arbeidspreferanser",
        icon: "work",
        items: [
          { 
            label: "Motivasjonskilder", 
            value: getFormattedValue(questionnaire.university.motivationSource)
          },
          { 
            label: "Arbeidsbalanse", 
            value: getFormattedValue(questionnaire.university.workLifeBalance)
          },
          { 
            label: "Prosjektpreferanse", 
            value: getFormattedValue(questionnaire.university.projectPreference)
          }
        ]
      }
    );

    // Add a personalized intro for university students
    resultSections.unshift({
      type: "intro",
      content: "Basert på svarene dine har vi laget en personlig profil som viser dine styrker, interesser og mulige karriereveier som student. Dette er ikke en fasit – men en start på reisen mot en karriere som passer deg.",
      dimensions: [
        { name: "Analytisk", description: "Du har sterke analytiske evner og er god til å løse komplekse problemer." },
        { name: "Målrettet", description: "Du er fokusert på å nå dine mål og jobber systematisk mot dem." },
        { name: "Samarbeidende", description: "Du trives med å jobbe i team og bidra til fellesskapet." }
      ]
    });

    // Add career recommendations for university students
    resultSections.push({
      type: "careers",
      title: "Anbefalte karriereveier",
      recommendations: [
        { title: "Prosjektleder", location: "Teknologibedrifter", match: "Passer med dine organisatoriske evner" },
        { title: "Forsker", location: "Forskningsinstitusjoner", match: "Utnytter dine analytiske ferdigheter" },
        { title: "Konsulent", location: "Konsulentfirmaer", match: "Kombinerer dine sosiale og analytiske evner" }
      ],
      nextSteps: [
        "Utforsk bedriftspresentasjoner på campus",
        "Delta på relevante konferanser i ditt fagfelt",
        "Søk praksisplasser innen interessante bransjer",
        "Knytt kontakter med alumni fra ditt studieprogram"
      ]
    });

  } else if (questionnaire.highSchool) {
    // High school questionnaire results
    resultSections.push(
      {
        title: "Din utdanningsprofil",
        icon: "education",
        items: [
          { label: "Skole", value: questionnaire.highSchool.school },
          { label: "Studieretning", value: questionnaire.highSchool.program },
          { label: "Årstrinn", value: questionnaire.highSchool.grade }
        ]
      },
      {
        title: "Dine styrker og interesser",
        icon: "award",
        items: [
          { 
            label: "Interesser", 
            value: Object.keys(questionnaire.highSchool.interests || {})
              .filter(key => questionnaire.highSchool.interests[key])
              .join(', ') || "Ingen oppgitt"
          },
          { 
            label: "Styrker", 
            value: Object.keys(questionnaire.highSchool.strengths || {})
              .filter(key => questionnaire.highSchool.strengths[key])
              .join(', ') || "Ingen oppgitt"
          },
          { 
            label: "Foretrukne fag", 
            value: Object.keys(questionnaire.highSchool.favoriteSubjects || {})
              .filter(key => questionnaire.highSchool.favoriteSubjects[key])
              .join(', ') || "Ingen oppgitt"
          }
        ]
      },
      {
        title: "Karriere og fremtid",
        icon: "target",
        items: [
          { 
            label: "Karriereplaner", 
            value: questionnaire.highSchool.careerPlan || "Ikke angitt"
          },
          { 
            label: "Ønsket industri", 
            value: Object.keys(questionnaire.highSchool.industries || {})
              .filter(key => questionnaire.highSchool.industries[key])
              .join(', ') || "Ingen oppgitt"
          }
        ]
      }
    );
    
    // Add a personalized intro for high school students
    resultSections.unshift({
      type: "intro",
      content: "Basert på svarene dine har vi laget en personlig profil som viser dine styrker, interesser og mulige veier videre. Dette er ikke en fasit – men en start på reisen mot noe som passer deg.",
      dimensions: [
        { name: "Struktur", description: "Du liker orden, system og klar retning." },
        { name: "Sosialitet", description: "Du trives med å jobbe sammen med andre mennesker." },
        { name: "Kreativitet", description: "Du har evne til å tenke utenfor boksen og finne nye løsninger." }
      ]
    });

    // Add education and career recommendations for high school students
    resultSections.push({
      type: "education",
      title: "Anbefalte utdanninger",
      recommendations: [
        { title: "Psykologi", location: "UiO, UiB", match: "Du scorer høyt på Helse og Struktur" },
        { title: "HR og ledelse", location: "OsloMet", match: "Du er både sosial og strukturert" },
        { title: "Ergoterapi", location: "UiT", match: "Praktisk, men med fokus på mennesker" }
      ]
    });
    
    resultSections.push({
      type: "jobs",
      title: "Mulige jobber",
      jobs: [
        { title: "Karriereveileder", description: "Hjelper unge med å ta gode valg" },
        { title: "Prosjektleder HR", description: "Jobber med mennesker og systemer" },
        { title: "Spesialpedagog", description: "Kombinerer omsorg og struktur" }
      ],
      nextSteps: [
        "Snakk med rådgiver",
        "Utforsk utdanning.no",
        "Book møte med noen i bransjen",
        "Gjør en praksis der du får testet interessene dine"
      ],
      learningStyle: "Du lærer best gjennom å gjøre praktiske oppgaver og diskutere med andre. Tenk på dette når du velger utdanning."
    });
    
  } else if (questionnaire.worker) {
    // Worker questionnaire results
    resultSections.push(
      {
        title: "Din jobb og erfaring",
        icon: "work",
        items: [
          { label: "Nåværende stilling", value: questionnaire.worker.currentRole },
          { label: "Bransje", value: questionnaire.worker.industry },
          { label: "Erfaring", value: questionnaire.worker.experience + " år" }
        ]
      },
      {
        title: "Dine styrker og ferdigheter",
        icon: "award",
        items: [
          { 
            label: "Styrker", 
            value: Object.keys(questionnaire.worker.strengths || {})
              .filter(key => questionnaire.worker.strengths[key])
              .join(', ') || "Ingen oppgitt"
          },
          { 
            label: "Ferdigheter", 
            value: Object.keys(questionnaire.worker.skills || {})
              .filter(key => questionnaire.worker.skills[key])
              .join(', ') || "Ingen oppgitt"
          }
        ]
      },
      {
        title: "Karrieremål",
        icon: "target",
        items: [
          { 
            label: "Karrieremål", 
            value: questionnaire.worker.careerGoal || "Ikke angitt"
          },
          { 
            label: "Utviklingsmuligheter", 
            value: getFormattedValue(questionnaire.worker.developmentImportance)
          }
        ]
      }
    );
    
    // Add a personalized intro for workers
    resultSections.unshift({
      type: "intro",
      content: "Basert på svarene dine har vi laget en personlig profil som viser dine styrker, ferdigheter og potensielle karrieremuligheter. Dette er ment som et utgangspunkt for videre karriereutvikling.",
      dimensions: [
        { name: "Ekspertise", description: "Du har opparbeidet verdifull fagkompetanse i din bransje." },
        { name: "Lederskap", description: "Du viser evne til å ta ansvar og lede andre." },
        { name: "Tilpasningsdyktighet", description: "Du er god til å tilpasse deg nye situasjoner og utfordringer." }
      ]
    });
    
    // Add career development recommendations for workers
    resultSections.push({
      type: "development",
      title: "Karriereutvikling",
      opportunities: [
        { title: "Lederstilling", company: "Større bedrifter i samme bransje", match: "Bygger videre på din erfaring og lederegenskaper" },
        { title: "Spesialisering", company: "Fagmiljøer", match: "Fordyper deg i ditt ekspertiseområde" },
        { title: "Rådgivning", company: "Konsulentvirksomheter", match: "Deler din kompetanse med andre" }
      ],
      nextSteps: [
        "Utforsk videreutdanningsmuligheter innen ditt felt",
        "Bygg nettverk med bransjeeksperter",
        "Delta på kurs for å styrke dine ferdigheter",
        "Vurder mentorordninger for karriereveiledning"
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
      {resultSections.map((section, index) => {
        // Render different components based on section type
        if (section.type === "intro") {
          return (
            <div key={index} className="bg-muted/30 p-6 rounded-lg animate-fade-up">
              <p className="text-lg mb-6">{section.content}</p>
              <h3 className="text-xl font-semibold mb-4">Dine toppdimensjoner</h3>
              <div className="flex flex-wrap gap-3 mb-6">
                {section.dimensions.map((dim, idx) => (
                  <Badge key={idx} variant="outline" className="px-3 py-1 text-base bg-primary/10 hover:bg-primary/20">
                    {dim.name}
                  </Badge>
                ))}
              </div>
              <div className="space-y-2">
                {section.dimensions.map((dim, idx) => (
                  <p key={idx} className="text-muted-foreground">
                    <span className="font-medium">{dim.name}:</span> {dim.description}
                  </p>
                ))}
              </div>
            </div>
          );
        } else if (section.type === "education") {
          return (
            <div key={index} className="animate-fade-up">
              <h3 className="text-2xl font-semibold mb-6">{section.title}</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Utdanning</th>
                      <th className="text-left py-3">Lærested</th>
                      <th className="text-left py-3">Hvorfor passer det deg?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.recommendations.map((rec, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/30">
                        <td className="py-3 font-medium">{rec.title}</td>
                        <td className="py-3">{rec.location}</td>
                        <td className="py-3">{rec.match}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <a href="https://utdanning.no" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Se flere utdanningsmuligheter →
                </a>
              </div>
            </div>
          );
        } else if (section.type === "jobs" || section.type === "careers") {
          return (
            <div key={index} className="animate-fade-up">
              <h3 className="text-2xl font-semibold mb-6">{section.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {section.jobs ? section.jobs.map((job, idx) => (
                  <div key={idx} className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-lg mb-2">{job.title}</h4>
                    <p className="text-muted-foreground">{job.description}</p>
                  </div>
                )) : section.recommendations?.map((career, idx) => (
                  <div key={idx} className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-lg mb-2">{career.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{career.location}</p>
                    <p>{career.match}</p>
                  </div>
                ))}
              </div>
              
              {section.nextSteps && (
                <>
                  <h3 className="text-xl font-semibold mb-4">Neste steg</h3>
                  <ul className="space-y-2 mb-6">
                    {section.nextSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="mr-2 mt-1 text-primary">✓</div>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              
              {section.learningStyle && (
                <div className="bg-muted/30 p-4 rounded-lg mt-6">
                  <h4 className="font-semibold mb-2">Din læringsstil</h4>
                  <p>{section.learningStyle}</p>
                </div>
              )}
            </div>
          );
        } else if (section.type === "development") {
          return (
            <div key={index} className="animate-fade-up">
              <h3 className="text-2xl font-semibold mb-6">{section.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {section.opportunities.map((opp, idx) => (
                  <div key={idx} className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-lg mb-2">{opp.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{opp.company}</p>
                    <p>{opp.match}</p>
                  </div>
                ))}
              </div>
              
              {section.nextSteps && (
                <>
                  <h3 className="text-xl font-semibold mb-4">Anbefalte tiltak</h3>
                  <ul className="space-y-2 mb-6">
                    {section.nextSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="mr-2 mt-1 text-primary">✓</div>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          );
        } else {
          // Default case: render the standard result card
          return <ResultCard key={index} title={section.title} icon={section.icon} items={section.items} />;
        }
      })}
    </div>
  );
};

export default ResultsGenerator;
