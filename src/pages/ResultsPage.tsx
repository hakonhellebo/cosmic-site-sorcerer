import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, CheckCircle2, BarChart3, Lightbulb, Target, Book, Briefcase } from "lucide-react";
import Layout from '@/components/Layout';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  
  useEffect(() => {
    // Get the full user data including questionnaire answers
    const savedFullData = localStorage.getItem('userFullData');
    
    if (savedFullData) {
      setUserData(JSON.parse(savedFullData));
    } else {
      toast.error("Ingen resultater funnet", {
        description: "Vi kunne ikke finne dine spørreskjemasvar"
      });
      navigate('/');
    }
  }, [navigate]);
  
  if (!userData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Laster resultater...</p>
        </div>
      </Layout>
    );
  }

  // Extract user's name from user data
  const { firstName, lastName } = userData || {};
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : "Anonym bruker";
  
  // Define the result sections based on user questionnaire data
  const questionnaire = userData.questionnaire || {};

  const getIcon = (iconName: string) => {
    const icons = {
      award: <Award className="h-6 w-6 text-primary" />,
      check: <CheckCircle2 className="h-6 w-6 text-green-500" />,
      chart: <BarChart3 className="h-6 w-6 text-blue-500" />,
      idea: <Lightbulb className="h-6 w-6 text-amber-500" />,
      target: <Target className="h-6 w-6 text-red-500" />,
      education: <Book className="h-6 w-6 text-indigo-500" />,
      work: <Briefcase className="h-6 w-6 text-purple-500" />
    };
    return icons[iconName] || icons.chart;
  };

  // Helper function to get formatted values
  const getFormattedValue = (value: string | undefined): string => {
    if (!value) return "Ikke angitt";
    
    // Map some values to more readable Norwegian text
    const valueMap: Record<string, string> = {
      // Certainty levels
      'very': 'Veldig sikker',
      'quite': 'Ganske sikker',
      'little': 'Litt usikker',
      'not': 'Ikke sikker',
      
      // Yes/no
      'yes': 'Ja',
      'no': 'Nei',
      'maybe': 'Kanskje',
      
      // Importance levels
      'very-important': 'Veldig viktig',
      'somewhat-important': 'Noe viktig',
      'not-really': 'Ikke så viktig',
      'not-at-all': 'Ikke viktig',
      
      // Frequency
      'daily': 'Daglig',
      'weekly': 'Ukentlig',
      'monthly': 'Månedlig',
      'rarely': 'Sjelden',
      'never': 'Aldri',
      
      // Work-life balance
      'work-first': 'Arbeid først',
      'balanced': 'Balansert',
      'life-first': 'Fritid først',
      
      // Other common values
      'unsure': 'Usikker',
    };
    
    return valueMap[value] || value.replace(/-/g, ' ');
  };
  
  // Create result sections based on what type of questionnaire the user filled out
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
        { label: "Navn", value: fullName },
        { label: "E-post", value: userData.email || "Ikke angitt" },
        { label: "Status", value: "Spørreskjema fullført" }
      ]
    });
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Resultatene dine</h1>
          <p className="text-sm text-muted-foreground">{fullName}</p>
        </div>
        
        <Separator className="mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resultSections.map((section, index) => (
            <Card key={index} className="overflow-hidden animate-scale-in">
              <CardContent className="p-0">
                <div className="bg-muted/40 p-4 flex items-center gap-4 border-b">
                  {getIcon(section.icon)}
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="grid grid-cols-2 gap-4">
                        <span className="font-medium text-muted-foreground">{item.label}:</span>
                        <span className="font-medium">{item.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ResultsPage;
