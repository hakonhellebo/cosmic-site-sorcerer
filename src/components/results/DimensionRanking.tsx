
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
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
    color: '#ef4444', // Red
    icon: Heart,
    description: 'Interesse for helse, omsorg og velvære hos mennesker'
  },
  teknologi: {
    label: 'Teknologi',
    color: '#3b82f6', // Blue
    icon: Cpu,
    description: 'Interesse for og kunnskap om digitale verktøy og teknologiske løsninger'
  },
  ambisjon: {
    label: 'Ambisjon',
    color: '#8b5cf6', // Purple
    icon: Trophy,
    description: 'Ønske om å oppnå suksess, framgang og anerkjennelse'
  },
  analytisk: {
    label: 'Analytisk',
    color: '#10b981', // Green
    icon: Brain,
    description: 'Evne til å analysere informasjon, logisk tenkning og problemløsning'
  },
  kreativitet: {
    label: 'Kreativitet',
    color: '#f59e0b', // Orange
    icon: Lightbulb,
    description: 'Evne til å tenke nytt, skape og uttrykke seg'
  },
  struktur: {
    label: 'Struktur',
    color: '#6b7280', // Gray
    icon: ClipboardList,
    description: 'Evne til å organisere, planlegge og følge prosesser'
  },
  praktisk: {
    label: 'Praktisk',
    color: '#d97706', // Amber
    icon: Hammer,
    description: 'Evne til å håndtere konkrete oppgaver og praktisk arbeid'
  },
  selvstendighet: {
    label: 'Selvstendighet',
    color: '#64748b', // Slate
    icon: User,
    description: 'Evne til å arbeide og ta beslutninger på egenhånd'
  },
  bærekraft: {
    label: 'Bærekraft',
    color: '#059669', // Emerald
    icon: Leaf,
    description: 'Interesse for miljø, klima og bærekraftig utvikling'
  },
  sosialitet: {
    label: 'Sosialitet',
    color: '#2dd4bf', // Teal
    icon: Users,
    description: 'Evne til å samarbeide, kommunisere og bygge relasjoner'
  }
};

const DimensionRanking: React.FC<DimensionRankingProps> = ({ userData, questionnaire }) => {
  const dimensionScores = useMemo(() => {
    // Mock/fixed data as an example
    // In a real implementation, this would calculate scores from the questionnaire data
    
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
    
    // This function would normally process all the questionnaire data
    // and calculate the scores for each dimension
    
    // For now, let's use some example scores
    scores.teknologi = 15;
    scores.analytisk = 12;
    scores.kreativitet = 10;
    scores.selvstendighet = 8;
    scores.struktur = 7;
    scores.ambisjon = 9;
    scores.helseinteresse = 6;
    scores.sosialitet = 11;
    scores.praktisk = 5;
    scores.bærekraft = 3;
    
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
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis type="number" domain={[0, 'dataMax + 2']} />
              <YAxis 
                dataKey="label" 
                type="category" 
                width={120}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value, name) => [`${value} poeng`, 'Score']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar 
                dataKey="score" 
                radius={[0, 4, 4, 0]}
              >
                {dimensionScores.map((entry) => (
                  <rect key={`rect-${entry.dimension}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Dimension details */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Alle dimensjoner</h3>
        
        <div className="space-y-3">
          {dimensionScores.map((dim) => {
            const Icon = dim.icon;
            return (
              <div 
                key={dim.dimension}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="p-2 rounded-full" 
                    style={{ backgroundColor: `${dim.color}20` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: dim.color }} />
                  </div>
                  <div>
                    <h4 className="font-medium">{dim.label}</h4>
                    <p className="text-xs text-muted-foreground">{dim.description}</p>
                  </div>
                </div>
                <span 
                  className="font-bold px-3 py-1 rounded-full text-sm"
                  style={{ 
                    backgroundColor: `${dim.color}15`,
                    color: dim.color 
                  }}
                >
                  {dim.score}
                </span>
              </div>
            );
          })}
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
          For eksempel, med høy score i <strong className="font-semibold">Teknologi</strong> og <strong className="font-semibold">Analytisk</strong> tenkning 
          kan du trives i roller som krever teknisk problemløsning og logisk analyse.
        </p>
      </div>
    </div>
  );
};

export default DimensionRanking;
