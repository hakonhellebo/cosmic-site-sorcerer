
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Briefcase, Building, Users, Target, ArrowRight } from "lucide-react";

interface CareerDetailPageProps {
  career: any;
  onBack: () => void;
  onNavigateToCareer: (careerName: string) => void;
  allCareers: any[];
}

const CareerDetailPage: React.FC<CareerDetailPageProps> = ({
  career,
  onBack,
  onNavigateToCareer,
  allCareers
}) => {
  if (!career) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Yrke ikke funnet</p>
        <Button onClick={onBack} className="mt-4">
          Tilbake til oversikt
        </Button>
      </div>
    );
  }

  // Parse related careers from the string
  const getRelatedCareers = () => {
    if (!career['Relaterte yrker']) return [];
    
    // Split by common separators and clean up
    const relatedList = career['Relaterte yrker']
      .split(/[,;]/)
      .map((item: string) => item.trim())
      .filter((item: string) => item.length > 0);
    
    return relatedList;
  };

  const relatedCareers = getRelatedCareers();

  // Check if related career exists in our database
  const isCareerInDatabase = (careerName: string) => {
    return allCareers.some(c => 
      c.Yrkesnavn?.toLowerCase() === careerName.toLowerCase()
    );
  };

  const handleRelatedCareerClick = (relatedCareerName: string) => {
    const exactMatch = allCareers.find(c => 
      c.Yrkesnavn?.toLowerCase() === relatedCareerName.toLowerCase()
    );
    
    if (exactMatch) {
      onNavigateToCareer(exactMatch.Yrkesnavn);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Tilbake til oversikt
        </Button>
      </div>

      {/* Career Title Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Briefcase className="h-6 w-6" />
            {career.Yrkesnavn}
          </CardTitle>
          <CardDescription className="text-lg">
            {career['Kort beskrivelse']}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {career.Sektor && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Building className="h-3 w-3" />
                {career.Sektor}
              </Badge>
            )}
            {career['Spesifikk sektor'] && (
              <Badge variant="outline">
                {career['Spesifikk sektor']}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Description */}
      {career['Detaljert beskrivelse'] && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Detaljert beskrivelse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {career['Detaljert beskrivelse']}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Competencies */}
      {career['Nøkkelkompetanser'] && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Nøkkelkompetanser
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {career['Nøkkelkompetanser']}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Related Careers */}
      {relatedCareers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Relaterte yrker
            </CardTitle>
            <CardDescription>
              Yrker som er relatert til {career.Yrkesnavn}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {relatedCareers.map((relatedCareer, index) => {
                const inDatabase = isCareerInDatabase(relatedCareer);
                
                return (
                  <div 
                    key={index}
                    className={`p-3 border rounded-lg ${
                      inDatabase 
                        ? 'border-primary/20 bg-primary/5 hover:border-primary/40 cursor-pointer transition-colors' 
                        : 'border-muted bg-muted/30'
                    }`}
                    onClick={() => inDatabase && handleRelatedCareerClick(relatedCareer)}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${inDatabase ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                        {relatedCareer}
                      </span>
                      {inDatabase && (
                        <ArrowRight className="h-3 w-3 text-primary" />
                      )}
                    </div>
                    {inDatabase && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        Klikk for å utforske
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CareerDetailPage;
