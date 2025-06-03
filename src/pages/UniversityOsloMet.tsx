import React, { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Users, MapPin, BookOpen, Award, Briefcase, FlaskConical, Heart, GraduationCap, TrendingUp, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';

const UniversityOsloMet = () => {
  const navigate = useNavigate();
  const [osloMetStats, setOsloMetStats] = useState<any[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchOsloMetStatistics();
  }, []);

  const fetchOsloMetStatistics = async () => {
    try {
      setStatsLoading(true);
      const { data, error } = await supabase
        .from('universitet_statistikk')
        .select('*')
        .eq('Skole', 'OsloMet – storbyuniversitetet')
        .order('Kategori', { ascending: true });
      
      if (data && !error) {
        setOsloMetStats(data);
        console.log(`Found ${data.length} OsloMet statistics entries`);
      } else {
        console.error('Error fetching OsloMet statistics:', error);
      }
    } catch (error) {
      console.error('Error fetching OsloMet statistics:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const getLatestValue = (stat: any) => {
    const years = ['2024', '2023', '2022', '2021', '2020', '2019'];
    for (const year of years) {
      if (stat[year] && stat[year] !== '-' && stat[year].trim() !== '') {
        return { value: stat[year], year };
      }
    }
    return { value: 'N/A', year: '' };
  };

  const formatStatValue = (value: string) => {
    if (!value || value === '-' || value === 'N/A') return 'N/A';
    
    const num = parseFloat(value.replace(/,/g, ''));
    if (!isNaN(num)) {
      if (num >= 1000) {
        return num.toLocaleString('no-NO');
      }
      return value;
    }
    return value;
  };

  const groupStatsByCategory = (stats: any[]) => {
    const grouped: { [key: string]: any[] } = {};
    stats.forEach(stat => {
      if (!grouped[stat.Kategori]) {
        grouped[stat.Kategori] = [];
      }
      grouped[stat.Kategori].push(stat);
    });
    return grouped;
  };

  const getKeyStats = (stats: any[]) => {
    const keyIndicators = [
      'Studenter totalt',
      'Kandidater på ett- og toårige mastergrader',
      'Prosent med karakterene A og B',
      'Publiseringspoeng',
      'Førstevalgsøkere totalt'
    ];
    
    return stats.filter(stat => keyIndicators.includes(stat.Indikator));
  };

  const groupedStats = groupStatsByCategory(osloMetStats);
  const keyStats = getKeyStats(osloMetStats);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/statistikk')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tilbake til statistikk
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">OsloMet – storbyuniversitetet</h1>
              <p className="text-xl text-muted-foreground">Norges tredje største universitet midt i Oslo sentrum</p>
            </div>
            <Badge variant="secondary" className="w-fit">
              Storbyuniversitet
            </Badge>
          </div>
        </div>

        {/* Kort intro */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Kort intro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              OsloMet er Norges tredje største universitet og holder til midt i Oslo sentrum og på Kjeller. 
              Universitetet har et bredt og arbeidslivsrettet studietilbud, og er spesielt kjent for 
              profesjonsutdanninger innen helse, lærerutdanning, sosialfag, teknologi og samfunnsvitenskap. 
              OsloMet kombinerer teori og praksis med tette bånd til hovedstadens mangfoldige arbeidsliv.
            </p>
          </CardContent>
        </Card>

        {/* Nøkkeltall */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Antall studenter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">22 000</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Campus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">Oslo sentrum (Pilestredet), Kjeller (Lillestrøm)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Studieprogram
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">90+ bachelor- og masterprogram, profesjonsstudier, årsstudier</p>
            </CardContent>
          </Card>
        </div>

        {/* Fagområder */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Fagområder</CardTitle>
            <CardDescription>OsloMet tilbyr et bredt spekter av studier, inkludert:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li>• Helse- og sosialfag (sykepleie, fysioterapi, vernepleie, ergoterapi, barnevern m.m.)</li>
                <li>• Lærerutdanning og pedagogikk (grunnskole, barnehage, yrkesfaglærer)</li>
                <li>• Teknologi og ingeniørfag (data, IT, bygg, maskin, elektro)</li>
              </ul>
              <ul className="space-y-2">
                <li>• Samfunnsvitenskap (sosiologi, journalistikk, kommunikasjon, bibliotek, statsvitenskap)</li>
                <li>• Økonomi, administrasjon og ledelse</li>
                <li>• Kunst, design og drama</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Særlig kjent for */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Særlig kjent for
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Profesjonsutdanninger</h4>
                <p>Størst i Norge på sykepleie, lærer- og barnehagelærerutdanning.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Arbeidslivstilknytning</h4>
                <p>Praktisk orienterte studier, mye praksis og tett samarbeid med Oslo-regionens arbeidsliv.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Mangfold og inkludering</h4>
                <p>Stor andel studenter med ulik bakgrunn, og et inkluderende og urbant studentmiljø.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Forskning</h4>
                <p>Fokus på velferd, digitalisering, byutvikling, teknologi og sosial bærekraft.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Campus midt i byen</h4>
                <p>Lett tilgang til Oslo sitt kulturliv, praksisplasser og jobbmuligheter.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opptakskrav og Karrieremuligheter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Opptakskrav</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>• De fleste bachelorprogram krever generell studiekompetanse</li>
                <li>• Enkelte profesjonsutdanninger (f.eks. sykepleie, barnehagelærer, ingeniør) har spesifikke fagkrav og varierende poenggrenser</li>
                <li>• Praksis- eller opptaksprøver for enkelte kreative og pedagogiske studier</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Karrieremuligheter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>• Utdanning fra OsloMet gir direkte inngang til arbeidslivet – særlig innen helse, undervisning, ingeniør, media og sosialt arbeid</li>
                <li>• Mange praksisplasser gir relevant erfaring og ofte jobbtilbud før fullført utdanning</li>
                <li>• Tett samarbeid med offentlig sektor, private bedrifter og ideelle organisasjoner i Oslo-regionen</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Forskning og Studentliv */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                Forskning og innovasjon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>• OsloMet har sterke forskningsmiljøer innen velferdsteknologi, sosial innovasjon, digitalisering, helse og utdanning</li>
                <li>• Samarbeider med offentlige myndigheter, næringsliv og forskningsinstitutter</li>
                <li>• Satsing på bærekraft, teknologi og byutvikling</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Studentliv
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>• OsloMet har et aktivt og mangfoldig studentmiljø med mange foreninger, idrettslag, kulturtilbud og arrangementer</li>
                <li>• Studenthuset (Pilestredet 52) er et naturlig møtested for studenter</li>
                <li>• Lett tilgang til Oslos uteliv, kultur, kafeer og urbane opplevelser</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Key Statistics from Database */}
        {!statsLoading && keyStats.length > 0 && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Nøkkeltall for OsloMet
              </CardTitle>
              <CardDescription>
                Nyeste tilgjengelige data fra universitetsstatistikk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {keyStats.map((stat, index) => {
                  const latest = getLatestValue(stat);
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm text-muted-foreground">{stat.Indikator}</h4>
                        {latest.year && (
                          <Badge variant="outline" className="text-xs">{latest.year}</Badge>
                        )}
                      </div>
                      <p className="text-2xl font-bold text-primary">
                        {formatStatValue(latest.value)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.Kategori}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Statistics */}
        {!statsLoading && Object.keys(groupedStats).length > 0 && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Detaljert statistikk
              </CardTitle>
              <CardDescription>
                Komplett oversikt over OsloMet sine nøkkeltall fordelt på kategorier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={Object.keys(groupedStats)[0]} className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                  {Object.keys(groupedStats).map((category) => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      className="text-xs"
                    >
                      {category.replace('og', '&')}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {Object.entries(groupedStats).map(([category, stats]) => (
                  <TabsContent key={category} value={category} className="space-y-4">
                    <div className="grid gap-4">
                      {stats.map((stat, index) => {
                        const latest = getLatestValue(stat);
                        return (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-medium">{stat.Indikator}</h4>
                              {latest.year && (
                                <Badge variant="outline">{latest.year}</Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
                              {['2019', '2020', '2021', '2022', '2023', '2024'].map(year => (
                                <div key={year} className="text-center">
                                  <div className="text-muted-foreground text-xs">{year}</div>
                                  <div className={`font-medium ${year === latest.year ? 'text-primary' : ''}`}>
                                    {formatStatValue(stat[year] || '-')}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Noe for deg? */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Noe for deg?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>• Perfekt for deg som vil ta en praksisnær utdanning midt i Norges største by, og få foten innenfor arbeidslivet tidlig</li>
              <li>• Passer for deg som er opptatt av mennesker, velferd, teknologi eller samfunn, og som vil ha studieløp med stor grad av valgfrihet og tilhørighet</li>
            </ul>
          </CardContent>
        </Card>

        {/* Les mer */}
        <Card>
          <CardHeader>
            <CardTitle>Les mer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.oslomet.no/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  oslomet.no
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.oslomet.no/studier" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Studier ved OsloMet
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.oslomet.no/student" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Studentlivet på OsloMet
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.oslomet.no/studier/opptak" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Opptak og søknad
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UniversityOsloMet;
