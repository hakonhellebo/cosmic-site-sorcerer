import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { 
  Trophy, Brain, Lightbulb, ClipboardList, Hammer, User, Leaf, Users, Heart, Cpu
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DimensionRankingProps {
  userData?: any;
  questionnaire?: 'highSchool' | 'university' | 'worker';
}

// Define dimension data with colors, icons and descriptions
const dimensionMeta = {
  helseinteresse: {
    label: 'Helseinteresse',
    color: '#D946EF', // Magenta Pink
    icon: Heart,
    description: 'Interesse for helse, omsorg og velvære hos mennesker'
  },
  teknologi: {
    label: 'Teknologi',
    color: '#0EA5E9', // Ocean Blue
    icon: Cpu,
    description: 'Interesse for og kunnskap om digitale verktøy og teknologiske løsninger'
  },
  ambisjon: {
    label: 'Ambisjon',
    color: '#F97316', // Bright Orange
    icon: Trophy,
    description: 'Ønske om å oppnå suksess, framgang og anerkjennelse'
  },
  analytisk: {
    label: 'Analytisk',
    color: '#8B5CF6', // Vivid Purple
    icon: Brain,
    description: 'Evne til å analysere informasjon, logisk tenkning og problemløsning'
  },
  kreativitet: {
    label: 'Kreativitet',
    color: '#F59E0B', // Amber
    icon: Lightbulb,
    description: 'Evne til å tenke nytt, skape og uttrykke seg'
  },
  struktur: {
    label: 'Struktur',
    color: '#10B981', // Emerald
    icon: ClipboardList,
    description: 'Evne til å organisere, planlegge og følge prosesser'
  },
  praktisk: {
    label: 'Praktisk',
    color: '#6366F1', // Indigo
    icon: Hammer,
    description: 'Evne til å håndtere konkrete oppgaver og praktisk arbeid'
  },
  selvstendighet: {
    label: 'Selvstendighet',
    color: '#EC4899', // Pink
    icon: User,
    description: 'Evne til å arbeide og ta beslutninger på egenhånd'
  },
  bærekraft: {
    label: 'Bærekraft',
    color: '#22C55E', // Green
    icon: Leaf,
    description: 'Interesse for miljø, klima og bærekraftig utvikling'
  },
  sosialitet: {
    label: 'Sosialitet',
    color: '#3B82F6', // Blue
    icon: Users,
    description: 'Evne til å samarbeide, kommunisere og bygge relasjoner'
  }
};

// Custom Bar Label component that includes the icon
const CustomBarLabel = (props: any) => {
  const { x, y, width, value, dimension } = props;
  const Icon = dimensionMeta[dimension as keyof typeof dimensionMeta]?.icon;
  
  return (
    <g>
      {Icon && (
        <foreignObject x={x - 25} y={y - 9} width={18} height={18}>
          <Icon size={18} color={dimensionMeta[dimension as keyof typeof dimensionMeta]?.color} />
        </foreignObject>
      )}
    </g>
  );
};

const DimensionRanking: React.FC<DimensionRankingProps> = ({ userData, questionnaire }) => {
  const dimensionScores = useMemo(() => {
    // Initialize all dimensions with score 0
    const scores: Record<string, number> = {
      helseinteresse: 0,
      teknologi: 0,
      ambisjon: 0,
      analytisk: 0,
      kreativitet: 0,
      struktur: 0,
      praktisk: 0,
      selvstendighet: 0,
      bærekraft: 0,
      sosialitet: 0
    };
    
    // If no user data, return default scores with minimum value 1
    if (!userData || !questionnaire || !userData.questionnaire?.[questionnaire]) {
      console.log("No user data found, using default scores");
      return Object.entries(scores)
        .map(([dimension, score]) => ({
          dimension,
          score: 1, // Set minimum score to 1
          ...dimensionMeta[dimension as keyof typeof dimensionMeta]
        }))
        .sort((a, b) => b.score - a.score);
    }
    
    console.log("Processing user data for dimensions", questionnaire);
    const questionnaireData = userData.questionnaire[questionnaire];
    
    // Process data from high school questionnaire
    if (questionnaire === 'highSchool') {
      const data = questionnaireData;
      console.log("Processing high school data", data);
      
      // Calculate scores based on interests - check for true values only
      if (data.interests) {
        if (data.interests.technology === true) scores.teknologi += 5;
        if (data.interests.artDesign === true) scores.kreativitet += 5;
        if (data.interests.sports === true) scores.praktisk += 3;
        if (data.interests.economyFinance === true) scores.analytisk += 4;
        if (data.interests.travelCulture === true) scores.sosialitet += 3;
        if (data.interests.healthCare === true) scores.helseinteresse += 5;
        if (data.interests.environmentSustainability === true) scores.bærekraft += 5;
      }
      
      // Calculate scores based on work tasks - check for true values only
      if (data.workTasks) {
        if (data.workTasks.numbers === true) scores.analytisk += 4;
        if (data.workTasks.practical === true) scores.praktisk += 5;
        if (data.workTasks.writing === true) scores.kreativitet += 2;
        if (data.workTasks.leadership === true) {
          scores.ambisjon += 5;
          scores.sosialitet += 3;
        }
        if (data.workTasks.creative === true) scores.kreativitet += 5;
        if (data.workTasks.supportive === true) {
          scores.sosialitet += 4;
          scores.helseinteresse += 2;
        }
      }
      
      // Calculate scores based on good skills - check for true values only
      if (data.goodSkills) {
        if (data.goodSkills.communication === true) scores.sosialitet += 4;
        if (data.goodSkills.logicalThinking === true) scores.analytisk += 5;
        if (data.goodSkills.creativity === true) scores.kreativitet += 5;
        if (data.goodSkills.technicalUnderstanding === true) scores.teknologi += 5;
        if (data.goodSkills.leadership === true) {
          scores.ambisjon += 4;
          scores.sosialitet += 2;
        }
        if (data.goodSkills.collaboration === true) scores.sosialitet += 5;
        if (data.goodSkills.problemSolving === true) scores.analytisk += 3;
      }
      
      // Calculate scores based on work environment preference
      if (data.workEnvironment === 'competitive') {
        scores.ambisjon += 4;
        scores.selvstendighet += 3;
      } else if (data.workEnvironment === 'collaborative') {
        scores.sosialitet += 4;
      }
      
      // Calculate scores based on work preference
      if (data.workPreference === 'alone') {
        scores.selvstendighet += 5;
      } else if (data.workPreference === 'team') {
        scores.sosialitet += 5;
      }
      
      // Calculate scores based on educational priorities - check for true values only
      if (data.educationPriorities) {
        if (data.educationPriorities.salary === true) scores.ambisjon += 3;
        if (data.educationPriorities.flexibility === true) scores.selvstendighet += 3;
        if (data.educationPriorities.meaning === true) {
          scores.helseinteresse += 2;
          scores.bærekraft += 2;
        }
        if (data.educationPriorities.status === true) {
          scores.ambisjon += 4;
        }
      }
      
      // Calculate scores based on interesting industries - check for true values only
      if (data.interestingIndustries) {
        if (data.interestingIndustries.technology === true) scores.teknologi += 4;
        if (data.interestingIndustries.healthcare === true) scores.helseinteresse += 4;
        if (data.interestingIndustries.finance === true) {
          scores.analytisk += 3;
          scores.ambisjon += 2;
        }
        if (data.interestingIndustries.creative === true) scores.kreativitet += 4;
        if (data.interestingIndustries.education === true) scores.sosialitet += 3;
        if (data.interestingIndustries.environment === true) scores.bærekraft += 4;
        if (data.interestingIndustries.research === true) scores.analytisk += 3;
        if (data.interestingIndustries.logistics === true) {
          scores.struktur += 4;
          scores.analytisk += 2;
        }
        if (data.interestingIndustries.engineering === true) {
          scores.teknologi += 3;
          scores.analytisk += 3;
        }
      }
      
      // Calculate scores based on desired roles - check for true values only
      if (data.desiredRoles) {
        if (data.desiredRoles.leader === true) {
          scores.ambisjon += 4;
          scores.sosialitet += 2;
        }
        if (data.desiredRoles.specialist === true) scores.analytisk += 3;
        if (data.desiredRoles.creative === true) scores.kreativitet += 4;
        if (data.desiredRoles.technical === true) scores.teknologi += 4;
        if (data.desiredRoles.entrepreneur === true) {
          scores.ambisjon += 4;
          scores.selvstendighet += 3;
        }
        if (data.desiredRoles.researcher === true) scores.analytisk += 4;
        if (data.desiredRoles.consultant === true) {
          scores.analytisk += 3;
          scores.sosialitet += 2;
        }
      }
      
      // Add scoring for salaryImportance
      if (data.salaryImportance === 'very-important') scores.ambisjon += 4;
      else if (data.salaryImportance === 'important') scores.ambisjon += 2;
      
      // Add scoring for socialImpactImportance
      if (data.socialImpactImportance === 'very-important') scores.bærekraft += 4;
      else if (data.socialImpactImportance === 'important') scores.bærekraft += 2;
      
      // Calculate scores based on work environment preferences - check for true values only
      if (data.workEnvironmentPreferences) {
        if (data.workEnvironmentPreferences.flexibility === true) scores.selvstendighet += 3;
        if (data.workEnvironmentPreferences.social === true) scores.sosialitet += 4;
        if (data.workEnvironmentPreferences.structure === true) scores.struktur += 5;
        if (data.workEnvironmentPreferences.career === true) scores.ambisjon += 3;
        if (data.workEnvironmentPreferences.innovation === true) {
          scores.kreativitet += 3;
          scores.teknologi += 2;
        }
        if (data.workEnvironmentPreferences.stability === true) {
          scores.struktur += 4;
        }
      }
      
      // Additional scoring based on future work vision
      if (data.futureWorkVision === 'creative') scores.kreativitet += 3;
      else if (data.futureWorkVision === 'secure') scores.struktur += 3;
      else if (data.futureWorkVision === 'leading') scores.ambisjon += 3;
      else if (data.futureWorkVision === 'helping') {
        scores.helseinteresse += 3;
        scores.sosialitet += 2;
      }
      else if (data.futureWorkVision === 'specialist') {
        scores.analytisk += 3;
        scores.teknologi += 2;
      }
      
      console.log("Calculated dimension scores:", scores);
    }
    
    // Process data from university questionnaire 
    if (questionnaire === 'university') {
      const data = questionnaireData;
      console.log("Processing university data", data);
      
      // Process interests - handle boolean values
      if (data.interests) {
        if (data.interests.teknologi === true) scores.teknologi += 5;
        if (data.interests.okonomi === true) scores.analytisk += 5;
        if (data.interests.samfunnsvitenskap === true) scores.bærekraft += 4;
        if (data.interests.humaniora === true) scores.kreativitet += 4;
        if (data.interests.naturvitenskap === true) scores.analytisk += 4;
        if (data.interests.helse === true) scores.helseinteresse += 5;
        if (data.interests.kunst === true) scores.kreativitet += 5;
        if (data.interests.ingenior === true) {
          scores.teknologi += 4;
          scores.analytisk += 3;
        }
        if (data.interests.larer === true) scores.sosialitet += 5;
        if (data.interests.jus === true) scores.struktur += 5;
      }
      
      // Process strengths - handle boolean values
      if (data.strengths) {
        if (data.strengths.kritisk_tenkning === true) scores.analytisk += 4;
        if (data.strengths.problemlosning === true) scores.analytisk += 4;
        if (data.strengths.kreativitet === true) scores.kreativitet += 5;
        if (data.strengths.kommunikasjon === true) scores.sosialitet += 4;
        if (data.strengths.selvledelse === true) scores.selvstendighet += 4;
        if (data.strengths.prosjektstyring === true) scores.struktur += 4;
        if (data.strengths.teknologiforstaaelse === true) scores.teknologi += 4;
        if (data.strengths.empati === true) scores.sosialitet += 4;
      }
      
      // Process weaknesses (opposite effect)
      if (data.weaknesses) {
        if (data.weaknesses.kritisk_tenkning === true) scores.analytisk -= 1;
        if (data.weaknesses.problemlosning === true) scores.analytisk -= 1;
        if (data.weaknesses.kreativitet === true) scores.kreativitet -= 1;
        if (data.weaknesses.kommunikasjon === true) scores.sosialitet -= 1;
        if (data.weaknesses.selvledelse === true) scores.selvstendighet -= 1;
        if (data.weaknesses.prosjektstyring === true) scores.struktur -= 1;
        if (data.weaknesses.teknologiforstaaelse === true) scores.teknologi -= 1;
        if (data.weaknesses.empati === true) scores.sosialitet -= 1;
      }
      
      // Process learning style
      if (data.learningStyle) {
        if (data.learningStyle.lesing === true) scores.analytisk += 3;
        if (data.learningStyle.lytting === true) scores.sosialitet += 2;
        if (data.learningStyle.praksis === true) scores.praktisk += 4;
        if (data.learningStyle.diskusjon === true) scores.sosialitet += 3;
        if (data.learningStyle.video === true) scores.teknologi += 2;
      }
      
      // Process collaboration style
      if (data.collaboration === 'independent') scores.selvstendighet += 4;
      else if (data.collaboration === 'team') scores.sosialitet += 4;
      else if (data.collaboration === 'daily') scores.sosialitet += 3;
      else if (data.collaboration === 'weekly') scores.selvstendighet += 2;
      
      // Process AI usage
      if (data.aiUsage === 'daily') scores.teknologi += 4;
      else if (data.aiUsage === 'weekly') scores.teknologi += 3;
      else if (data.aiUsage === 'monthly') scores.teknologi += 2;
      else if (data.aiUsage === 'rarely') scores.teknologi += 1;
      
      // Internship
      if (data.internship === 'yes') scores.praktisk += 3;
      if (data.internshipValue === 'very-useful') scores.praktisk += 2;
      
      // Study reason
      if (data.studyReason === 'job-security') {
        scores.struktur += 3;
        scores.ambisjon += 2;
      }
      else if (data.studyReason === 'salary') scores.ambisjon += 4;
      else if (data.studyReason === 'impact') scores.bærekraft += 4;
      else if (data.studyReason === 'interest') scores.kreativitet += 4;
      
      // Salary importance
      if (data.salaryImportance === 'very') scores.ambisjon += 4;
      else if (data.salaryImportance === 'somewhat') scores.ambisjon += 2;
      
      // Impact importance
      if (data.impactImportance === 'very') scores.bærekraft += 4;
      else if (data.impactImportance === 'somewhat') scores.bærekraft += 2;
      
      // Job priorities
      if (data.jobPriorities) {
        if (data.jobPriorities.fleksibilitet === true) scores.selvstendighet += 3;
        if (data.jobPriorities.hoy_lonn === true) scores.ambisjon += 3;
        if (data.jobPriorities.stabilitet === true) scores.struktur += 3;
        if (data.jobPriorities.karrieremuligheter === true) scores.ambisjon += 3;
        if (data.jobPriorities.mening === true) scores.bærekraft += 3;
        if (data.jobPriorities.innovasjon === true) scores.kreativitet += 3;
      }
      
      // Future role
      if (data.futureRole === 'leader') scores.ambisjon += 4;
      else if (data.futureRole === 'specialist') scores.analytisk += 4;
      else if (data.futureRole === 'entrepreneur') scores.selvstendighet += 4;
      
      // Technology importance
      if (data.technologyImportance === 'very') scores.teknologi += 4;
      else if (data.technologyImportance === 'somewhat') scores.teknologi += 2;
      
      // Work-life balance
      if (data.workLifeBalance === 'work') scores.ambisjon += 3;
      else if (data.workLifeBalance === 'balance') scores.struktur += 3;
      else if (data.workLifeBalance === 'life') scores.selvstendighet += 3;
      
      // Remote work importance
      if (data.remoteWorkImportance === 'very') scores.selvstendighet += 3;
      else if (data.remoteWorkImportance === 'somewhat') scores.selvstendighet += 2;
      
      // Travel importance
      if (data.travelImportance === 'very') scores.selvstendighet += 3;
      else if (data.travelImportance === 'somewhat') scores.selvstendighet += 2;
      
      // Preferred work environment
      if (data.preferredWorkEnvironment === 'structured') scores.struktur += 3;
      else if (data.preferredWorkEnvironment === 'creative') scores.kreativitet += 3;
      else if (data.preferredWorkEnvironment === 'social') scores.sosialitet += 3;
      else if (data.preferredWorkEnvironment === 'flexible') scores.selvstendighet += 3;
      
      // People vs tech preference
      if (data.peopleTech === 'people') scores.sosialitet += 3;
      else if (data.peopleTech === 'tech') scores.teknologi += 3;
      
      // Study choice reason
      if (data.studyChoiceReason === 'interesse') scores.kreativitet += 3;
      else if (data.studyChoiceReason === 'lonn') scores.ambisjon += 3;
      else if (data.studyChoiceReason === 'prestisje') scores.ambisjon += 3;
      
      // Best subjects
      if (data.bestSubjects) {
        if (data.bestSubjects.teknologi === true) scores.teknologi += 3;
        if (data.bestSubjects.okonomi === true) scores.analytisk += 3;
        if (data.bestSubjects.ingenior === true) scores.teknologi += 3;
      }
      
      console.log("Calculated university dimension scores:", scores);
    }
    
    // Ensure minimum score of 1 for all dimensions
    Object.keys(scores).forEach(key => {
      scores[key] = Math.max(1, scores[key]);
    });
    
    // Convert to array and sort by score (highest first)
    return Object.entries(scores)
      .map(([dimension, score]) => ({
        dimension,
        score,
        ...dimensionMeta[dimension as keyof typeof dimensionMeta]
      }))
      .sort((a, b) => b.score - a.score);
  }, [userData, questionnaire]);

  // Get top 3 dimensions
  const topDimensions = dimensionScores.slice(0, 3);
  
  return (
    <div className="animate-fade-up space-y-8">
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold">Dine topp dimensjoner</h3>
        <p className="text-muted-foreground">
          Basert på dine svar har vi beregnet dine styrker innenfor 10 ulike dimensjoner. 
          Dette kan hjelpe deg med å finne karriereveier som passer dine egenskaper og interesser.
        </p>
        
        {/* Top 3 dimensions cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          {topDimensions.map((dim, idx) => {
            const Icon = dim.icon;
            return (
              <div 
                key={dim.dimension} 
                className="relative overflow-hidden border rounded-lg p-5 bg-white dark:bg-gray-950"
              >
                <div 
                  className="absolute top-0 left-0 w-1 h-full" 
                  style={{ backgroundColor: dim.color }} 
                />
                <div className="flex items-center space-x-3 mb-2">
                  <div 
                    className="p-2 rounded-full" 
                    style={{ backgroundColor: `${dim.color}20` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: dim.color }} />
                  </div>
                  <h4 className="font-bold">{dim.label}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{dim.description}</p>
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className="font-semibold"
                    style={{ 
                      backgroundColor: `${dim.color}10`, 
                      color: dim.color,
                      borderColor: `${dim.color}30`
                    }}
                  >
                    {idx === 0 ? "Topp styrke" : `#${idx + 1}`}
                  </Badge>
                  <span className="text-lg font-bold">{dim.score} poeng</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Bar chart for all dimensions */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Dimensjonsprofil</h3>
        <p className="text-muted-foreground">
          Her kan du se hvordan du scorer på alle dimensjonene.
        </p>
        
        <div className="h-96 w-full border rounded-lg p-4 bg-card">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={dimensionScores}
              margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
            >
              <XAxis type="number" domain={[0, 'dataMax + 2']} />
              <YAxis 
                dataKey="label" 
                type="category" 
                width={100}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value, name) => [`${value} poeng`, 'Score']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar 
                dataKey="score" 
                radius={[0, 4, 4, 0]}
                fill="#0EA5E9"
              >
                <LabelList 
                  dataKey="dimension" 
                  position="insideLeft" 
                  content={<CustomBarLabel />} 
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* What this means */}
      <div className="p-6 border rounded-lg bg-muted/30 space-y-4">
        <h3 className="text-xl font-semibold">Hva betyr dette?</h3>
        <p>
          Dine høyeste scorer indikerer hvilke dimensjoner som er mest fremtredende i din profil. 
          Disse kan gi innsikt i hvilke typer karrierer og arbeidsmiljøer som vil passe deg best.
        </p>
        <p>
          For eksempel, med høy score i <strong className="font-semibold">{topDimensions[0]?.label}</strong> og <strong className="font-semibold">{topDimensions[1]?.label}</strong> 
          kan du trives i roller som {
            topDimensions[0]?.dimension === 'teknologi' ? 'krever teknisk problemløsning og innovasjon' : 
            topDimensions[0]?.dimension === 'analytisk' ? 'krever analytisk tenkning og strukturert problemløsning' :
            topDimensions[0]?.dimension === 'kreativitet' ? 'gir rom for kreativ utfoldelse og nytenking' :
            topDimensions[0]?.dimension === 'sosialitet' ? 'involverer mye kontakt med mennesker' :
            topDimensions[0]?.dimension === 'ambisjon' ? 'gir muligheter for å klatre på karrierestigen' :
            topDimensions[0]?.dimension === 'helseinteresse' ? 'lar deg hjelpe andre med helse og velvære' :
            topDimensions[0]?.dimension === 'bærekraft' ? 'bidrar til miljø og bærekraftig utvikling' :
            topDimensions[0]?.dimension === 'struktur' ? 'krever god organisering og planlegging' :
            topDimensions[0]?.dimension === 'praktisk' ? 'involverer praktisk arbeid og konkrete oppgaver' :
            'utvikler dine styrker og interesser'
          }.
        </p>
      </div>
    </div>
  );
};

export default DimensionRanking;
