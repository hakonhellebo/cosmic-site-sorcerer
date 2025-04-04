
import React from 'react';
import ResultCard from '../ResultCard';
import { BookOpen, GraduationCap, Briefcase } from "lucide-react";

interface DefaultResultsGeneratorProps {
  userData: any;
}

const DefaultResultsGenerator: React.FC<DefaultResultsGeneratorProps> = ({ userData }) => {
  // Extract any available questionnaire data
  const questionnaire = userData.questionnaire || {};
  
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
        { label: "Utdanningsnivå", value: questionnaire.university.level || "Ikke angitt" }
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
};

export default DefaultResultsGenerator;
