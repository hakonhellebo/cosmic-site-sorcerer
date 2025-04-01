
import React from 'react';
import ResultCard from './ResultCard';
import { getFormattedValue } from '@/utils/resultFormatters';

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {resultSections.map((section, index) => (
        <ResultCard key={index} title={section.title} icon={section.icon} items={section.items} />
      ))}
    </div>
  );
};

export default ResultsGenerator;
