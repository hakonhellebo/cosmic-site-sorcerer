import React, { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Users, MapPin, BookOpen, Award, Briefcase, FlaskConical, Heart, GraduationCap, TrendingUp, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';

const UniversityUiB = () => {
  const navigate = useNavigate();
  const [uibStats, setUibStats] = useState<any[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchUiBStatistics();
  }, []);

  const fetchUiBStatistics = async () => {
    try {
      setStatsLoading(true);
      const { data, error } = await supabase
        .from('universitet_statistikk')
        .select('*')
        .eq('Skole', 'Universitetet i Bergen')
        .order('Kategori', { ascending: true });
      
      if (data && !error) {
        setUibStats(data);
        console.log(`Found ${data.length} UiB statistics entries`);
      } else {
        console.error('Error fetching UiB statistics:', error);
      }
    } catch (error) {
      console.error('Error fetching UiB statistics:', error);
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

  const groupedStats = groupStatsByCategory(uibStats);
  const keyStats = getKeyStats(uibStats);

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
              <h1 className="text-4xl font-bold mb-2">Universitetet i Bergen (UiB)</h1>
              <p className="text-xl text-muted-foreground">Vestlandets flaggskip innen forskning og utdanning</p>
            </div>
            <Badge variant="secondary" className="w-fit">
              Vestlandet
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
              Universitetet i Bergen (UiB) er Vestlandets eldste og største universitet, grunnlagt i 1946. 
              UiB er kjent for sin høye kvalitet innen forskning og utdanning, og tilbyr et bredt spekter 
              av fagområder med særlig styrke innen naturvitenskap, medisin og samfunnsvitenskap.
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
              <p className="text-2xl font-bold">17 000+</p>
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
              <p className="text-lg">Bergen sentrum og Årstadvollen</p>
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
              <p className="text-lg">Ca. 180 utdanningstilbud</p>
            </CardContent>
          </Card>
        </div>

        {/* Fagområder */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Fagområder</CardTitle>
            <CardDescription>UiB tilbyr utdanninger innen:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li>• Medisin og odontologi</li>
                <li>• Naturvitenskap og teknologi</li>
                <li>• Samfunnsvitenskap og jus</li>
                <li>• Humaniora</li>
              </ul>
              <ul className="space-y-2">
                <li>• Psykologi og utdanningsvitenskap</li>
                <li>• Kunstfag</li>
                <li>• Økonomi og administrasjon</li>
                <li>• Geofag og petroleumsvitenskap</li>
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
                <h4 className="font-semibold mb-2">Medisin og helsefag</h4>
                <p>Sterke tradisjon innen medisinske fag og helseforskning.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Marin forskning</h4>
                <p>Verdensledende innen havforskning og maritime studier.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Geofag og klima</h4>
                <p>Fremragende kompetanse innen geologi, klima og miljøforskning.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Forskningskvalitet</h4>
                <p>Høy forskningskvalitet og internasjonalt samarbeid.</p>
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
                <li>• Høye karakterkrav for medisin og psykologi</li>
                <li>• Generell studiekompetanse for de fleste bachelorprogram</li>
                <li>• Realfagskrav for tekniske og naturvitenskapelige fag</li>
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
                <li>• Gode jobbmuligheter innen helse, forskning og teknologi</li>
                <li>• Sterke koblinger til vestlandsk næringsliv</li>
                <li>• Internasjonale karrieremuligheter gjennom forskningsnettverk</li>
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
                <li>• Verdensledende havforskning og klimastudier</li>
                <li>• Medisinsk forskning i topp internasjonalt</li>
                <li>• Sterke kobling mellom forskning og undervisning</li>
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
                <li>• Aktivt studentmiljø i en vakker by omgitt av fjorder og fjell</li>
                <li>• Rikt kulturtilbud og festivaltradisjoner</li>
                <li>• Mange muligheter for friluftsliv og naturopplevelser</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Noe for deg? */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Noe for deg?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>• Perfekt for deg som vil kombinere høy faglig kvalitet med vakre omgivelser</li>
              <li>• Godt valg hvis du er interessert i medisin, naturvitenskap eller havforskning</li>
              <li>• Passer for deg som ønsker en balanse mellom studier og naturopplevelser</li>
            </ul>
          </CardContent>
        </Card>

        {/* Key Statistics from Database */}
        {!statsLoading && keyStats.length > 0 && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Nøkkeltall for Universitetet i Bergen
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
                Komplett oversikt over Universitetet i Bergen sine nøkkeltall fordelt på kategorier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={Object.keys(groupedStats)[0]} className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-gray-100">
                  {Object.keys(groupedStats).map((category) => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      className="text-xs data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900"
                    >
                      {category.replace('og', '&')}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {Object.entries(groupedStats).map(([category, stats]) => (
                  <TabsContent key={category} value={category} className="space-y-4 mt-8">
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

        {/* Les mer */}
        <Card>
          <CardHeader>
            <CardTitle>Les mer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.uib.no/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  uib.no
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.uib.no/studier" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Studier ved UiB
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.uib.no/student" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Studentliv på UiB
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.uib.no/student/opptak" target="_blank" rel="noopener noreferrer">
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

export default UniversityUiB;
