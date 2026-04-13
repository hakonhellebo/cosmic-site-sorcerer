
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserData } from '@/hooks/useUserProfile';
import FavoritesView from './FavoritesView';
import RecommendationsView from './RecommendationsView';

interface DashboardViewProps {
  userData: UserData;
  onResetProfile: () => void;
}

const careerInterests = [
  { id: "technology", label: "Teknologi" },
  { id: "finance", label: "Finans" },
  { id: "marketing", label: "Markedsføring" },
  { id: "healthcare", label: "Helsevesen" },
  { id: "education", label: "Utdanning" },
  { id: "engineering", label: "Ingeniørfag" },
];

const DashboardView: React.FC<DashboardViewProps> = ({ userData, onResetProfile }) => {
  const navigate = useNavigate();

  const formatSalary = (value: number) => {
    return `${value.toLocaleString('no-NO')} NOK`;
  };

  const getRecommendedCareers = () => {
    const field = userData.education.fieldOfStudy.toLowerCase();
    
    if (field.includes('data') || field.includes('informatikk') || field.includes('programmering')) {
      return [
        { title: 'Data Scientist', description: 'Analyserer store datasett for å finne mønstre og innsikt.' },
        { title: 'Programvareutvikler', description: 'Utvikler applikasjoner og systemer.' },
        { title: 'IT-konsulent', description: 'Gir teknisk rådgivning til bedrifter.' }
      ];
    } else if (field.includes('økonomi') || field.includes('business')) {
      return [
        { title: 'Finansanalytiker', description: 'Analyserer finansielle data og gir investeringsråd.' },
        { title: 'Prosjektleder', description: 'Leder komplekse prosjekter på tvers av team.' },
        { title: 'Forretningsutvikler', description: 'Identifiserer nye forretningsmuligheter.' }
      ];
    } else {
      return [
        { title: 'Prosjektkoordinator', description: 'Koordinerer prosjekter og ressurser.' },
        { title: 'Forskningsassistent', description: 'Støtter vitenskapelig forskning innen ditt felt.' },
        { title: 'Konsulent', description: 'Gir ekspertråd innen ditt spesialfelt.' }
      ];
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">Velkommen tilbake til EdPath!</h1>
        <p className="text-muted-foreground">
          Din personlige karriereprofil er ferdig. Her er en oversikt over dine data og anbefalinger.
        </p>
      </div>

      <Tabs defaultValue="recommendations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations">Mine anbefalinger</TabsTrigger>
          <TabsTrigger value="overview">Oversikt</TabsTrigger>
          <TabsTrigger value="favorites">Mine favoritter</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations">
          <RecommendationsView />
        </TabsContent>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* User Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Din profil</CardTitle>
                <CardDescription>Oversikt over informasjonen du har oppgitt</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">Utdanning</h4>
                  <p className="text-sm text-muted-foreground">
                    {userData.education.degree} i {userData.education.fieldOfStudy}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {userData.education.institution} ({userData.education.graduationYear})
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Karriereinteresser</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {userData.career.interests.map((interest, index) => (
                      <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                        {careerInterests.find(ci => ci.id === interest)?.label || interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">Arbeidsmiljø</h4>
                  <p className="text-sm text-muted-foreground">
                    {userData.career.workEnvironment === 'remote' && 'Fjernarbeid'}
                    {userData.career.workEnvironment === 'office' && 'Kontorbasert'}
                    {userData.career.workEnvironment === 'hybrid' && 'Hybrid'}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">Ønsket lønn</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatSalary(userData.career.salaryRange[0])}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">Nøkkelferdigheter</h4>
                  <p className="text-sm text-muted-foreground">
                    {userData.skills.keySkills || 'Ikke spesifisert'}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={onResetProfile} className="w-full">
                  Oppdater profil
                </Button>
              </CardFooter>
            </Card>

            {/* Career Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Dine karriereanbefalinger</CardTitle>
                <CardDescription>Basert på din profil</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getRecommendedCareers().map((career, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-medium">{career.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {career.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => navigate('/statistikk')}>
                  Utforsk karrierestatistikk
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hurtighandlinger</CardTitle>
              <CardDescription>Utforsk mer av EdPath</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" onClick={() => navigate('/statistikk')}>
                  📊 Karrierestatistikk
                </Button>
                <Button variant="outline" onClick={() => navigate('/user-type-selection')}>
                  📝 Ta ny spørreundersøkelse
                </Button>
                <Button variant="outline" onClick={onResetProfile}>
                  ⚙️ Oppdater profil
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="favorites">
          <FavoritesView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardView;
