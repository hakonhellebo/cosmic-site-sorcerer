import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, GraduationCap, Building2, ArrowRight, RotateCcw, TrendingUp } from 'lucide-react';
import type { EdPathApiResponse } from '@/services/edpathApi.types';

const RecommendationsView: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<EdPathApiResponse | null>(null);
  const [surveyType, setSurveyType] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('edpathResults');
    const type = localStorage.getItem('surveyType');
    if (raw) {
      try {
        setResults(JSON.parse(raw));
        setSurveyType(type);
      } catch {
        // ignore
      }
    }
  }, []);

  const getResultsPath = () => {
    if (surveyType === 'elev') return '/results/high-school';
    if (surveyType === 'student') return '/results/university';
    if (surveyType === 'worker' || surveyType === 'arbeidstaker') return '/results/worker';
    return '/results';
  };

  const getSurveyLabel = () => {
    if (surveyType === 'elev') return 'Videregående';
    if (surveyType === 'student') return 'Student';
    if (surveyType === 'worker' || surveyType === 'arbeidstaker') return 'Arbeidstaker';
    return 'Ukjent';
  };

  if (!results) {
    return (
      <div className="space-y-6">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ingen anbefalinger ennå</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Ta en karrieretest for å få personlige anbefalinger om yrker, utdanninger og bedrifter som passer deg.
            </p>
            <Button onClick={() => navigate('/user-type-selection')} size="lg">
              <RotateCcw className="mr-2 h-4 w-4" />
              Ta karrieretesten
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const topYrker = results.yrker?.slice(0, 4) || [];
  const topStudier = results.studier?.slice(0, 4) || [];
  const topBedrifter = results.bedrifter?.slice(0, 4) || [];

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-semibold">Dine karriereanbefalinger</h2>
            <Badge variant="secondary">{getSurveyLabel()}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Basert på din siste karrieretest
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/user-type-selection')}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Ta testen på nytt
          </Button>
          <Button size="sm" onClick={() => navigate(getResultsPath())}>
            Se full rapport
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Top careers */}
      {topYrker.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Anbefalte yrker
            </CardTitle>
            <CardDescription>Yrker som matcher din profil</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {topYrker.map((yrke, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{yrke.navn}</p>
                    <p className="text-xs text-muted-foreground truncate">{yrke.sektor}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top educations */}
      {topStudier.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Anbefalte utdanninger
            </CardTitle>
            <CardDescription>Studier som passer din profil</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {topStudier.map((studie, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{studie.navn}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {studie.lærested || studie.sektor}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top companies */}
      {topBedrifter.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Anbefalte bedrifter
            </CardTitle>
            <CardDescription>Bedrifter innen dine interesseområder</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {topBedrifter.map((bedrift, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{bedrift.navn}</p>
                    <p className="text-xs text-muted-foreground truncate">{bedrift.sektor}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* CTA to full results */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <div>
            <h3 className="font-semibold">Vil du se hele rapporten?</h3>
            <p className="text-sm text-muted-foreground">Se alle dimensjoner, yrker, utdanninger og bedrifter.</p>
          </div>
          <Button onClick={() => navigate(getResultsPath())}>
            Åpne full rapport
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationsView;
