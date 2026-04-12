import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Briefcase, Building2, TrendingUp, Lightbulb, Check } from 'lucide-react';
import type { EdPathApiResponse, EdPathUserType } from '@/services/edpathApi.types';

interface ApiResultsViewProps {
  results: EdPathApiResponse;
  userType: EdPathUserType;
}

const DIMENSION_COLORS = [
  'hsl(var(--primary))',
  'hsl(262, 83%, 58%)',
  'hsl(24, 95%, 53%)',
  'hsl(142, 71%, 45%)',
  'hsl(199, 89%, 48%)',
  'hsl(340, 82%, 52%)',
  'hsl(45, 93%, 47%)',
  'hsl(215, 76%, 56%)',
];

const ApiResultsView: React.FC<ApiResultsViewProps> = ({ results, userType }) => {
  const hasDimensions = results.dimensjoner && results.dimensjoner.length > 0;
  const hasSektorer = results.topp_sektorer && results.topp_sektorer.length > 0;
  const hasYrker = results.yrker && results.yrker.length > 0;
  const hasStudier = results.studier && results.studier.length > 0;
  const hasBedrifter = results.bedrifter && results.bedrifter.length > 0;

  const userTypeLabel = userType === 'elev' ? 'elev' : userType === 'student' ? 'student' : 'arbeidstaker';

  return (
    <div className="space-y-8">
      {/* Intro */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-1 bg-primary" />
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            <CardTitle>Din personlige profil</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Basert på svarene dine har vi analysert din profil som {userTypeLabel} og funnet 
            anbefalinger som passer deg. Her er en oversikt over dine dimensjoner, anbefalte 
            sektorer, yrker, studier og bedrifter.
          </p>
          {hasDimensions && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {results.dimensjoner.slice(0, 3).map((dim, i) => (
                <div key={i} className="p-3 bg-primary/10 rounded-md border border-primary/20">
                  <h4 className="font-medium">{dim.navn}</h4>
                  <p className="text-sm text-muted-foreground">Score: {dim.score}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dimension Chart */}
      {hasDimensions && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle>Dine dimensjoner</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={results.dimensjoner.map((d, i) => ({
                    navn: d.navn,
                    score: d.score,
                    fill: DIMENSION_COLORS[i % DIMENSION_COLORS.length],
                  }))}
                  layout="vertical"
                  margin={{ left: 20, right: 20 }}
                >
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="navn" width={120} tick={{ fontSize: 13 }} />
                  <Tooltip formatter={(value: number) => [`${value} poeng`, 'Score']} />
                  <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                    {results.dimensjoner.map((_, i) => (
                      <Cell key={i} fill={DIMENSION_COLORS[i % DIMENSION_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Sectors */}
      {hasSektorer && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <CardTitle>Anbefalte sektorer</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.topp_sektorer.map((sektor, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{sektor.sektor}</h4>
                    {sektor.underkategori && (
                      <p className="text-sm text-muted-foreground">{sektor.underkategori}</p>
                    )}
                  </div>
                  <Badge variant="secondary">{sektor.score} poeng</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Studies */}
      {hasStudier && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle>Anbefalte studier</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {results.studier.map((studie, i) => (
                <div key={i} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-medium">{studie.navn}</h4>
                  {studie.lærested && (
                    <p className="text-sm text-muted-foreground">{studie.lærested}</p>
                  )}
                  <Badge variant="outline" className="mt-2">{studie.sektor}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Careers */}
      {hasYrker && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <CardTitle>Anbefalte yrker</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {results.yrker.map((yrke, i) => (
                <div key={i} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-medium">{yrke.navn}</h4>
                  <Badge variant="outline" className="mt-2">{yrke.sektor}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Companies */}
      {hasBedrifter && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle>Anbefalte bedrifter</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {results.bedrifter.map((bedrift, i) => (
                <div key={i} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-medium">{bedrift.navn}</h4>
                  <Badge variant="outline" className="mt-2">{bedrift.sektor}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card className="bg-muted/10">
        <CardHeader>
          <CardTitle>Neste steg – dette får du snart tilgang til</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">EdPath blir mer enn bare anbefalinger. Du vil snart kunne:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Se hva andre med lik profil har valgt – og hvor de fikk jobb',
              'Utforske bedrifter og stillinger som passer akkurat deg',
              'Få ferdige forslag til hva du kan skrive i en CV',
              'Få anbefalte kurs og ferdigheter',
              'Snakke med vår AI-rådgiver',
              'Bygge din egen profil som oppdateres over tid',
            ].map((text, i) => (
              <li key={i} className="flex items-start">
                <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiResultsView;
