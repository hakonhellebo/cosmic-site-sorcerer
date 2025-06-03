import React, { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Users, MapPin, BookOpen, Award, Briefcase, FlaskConical, Heart, GraduationCap, TrendingUp, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';

const UniversityUiT = () => {
  const navigate = useNavigate();
  const [uitStats, setUitStats] = useState<any[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchUiTStatistics();
  }, []);

  const fetchUiTStatistics = async () => {
    try {
      setStatsLoading(true);
      const { data, error } = await supabase
        .from('universitet_statistikk')
        .select('*')
        .eq('Skole', 'UiT Norges arktiske universitet')
        .order('Kategori', { ascending: true });
      
      if (data && !error) {
        setUitStats(data);
        console.log(`Found ${data.length} UiT statistics entries`);
      } else {
        console.error('Error fetching UiT statistics:', error);
      }
    } catch (error) {
      console.error('Error fetching UiT statistics:', error);
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

  const groupedStats = groupStatsByCategory(uitStats);
  const keyStats = getKeyStats(uitStats);

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
              <h1 className="text-4xl font-bold mb-2">UiT Norges arktiske universitet</h1>
              <p className="text-xl text-muted-foreground">Norges nordligste universitet med arktisk fokus</p>
            </div>
            <Badge variant="secondary" className="w-fit">
              Arktisk profil
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
              UiT Norges arktiske universitet er Norges nordligste universitet og en ledende institusjon innen 
              arktisk forskning og utdanning. Med hovedcampus i Tromsø og avdelinger spredt over Nord-Norge, 
              tilbyr UiT unik kompetanse innen klima, miljø, urfolk og nordområdeforskning.
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
                Campuser
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">Tromsø, Alta, Harstad, Kirkenes, Narvik</p>
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
              <p className="text-lg">Ca. 150 utdanningstilbud</p>
            </CardContent>
          </Card>
        </div>

        {/* Fagområder */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Fagområder</CardTitle>
            <CardDescription>UiT tilbyr utdanninger innen:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li>• Arktisk forskning og klimavitenskap</li>
                <li>• Medisin og helsefag</li>
                <li>• Jus og samfunnsvitenskap</li>
                <li>• Naturvitenskap og teknologi</li>
              </ul>
              <ul className="space-y-2">
                <li>• Humaniora og språkvitenskap</li>
                <li>• Fiskerifag og bioteknologi</li>
                <li>• Lærerutdanning</li>
                <li>• Kunstfag og kreative studier</li>
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
                <h4 className="font-semibold mb-2">Arktisk og polar forskning</h4>
                <p>Ledende kompetanse innen klimaforskning, miljø og arktiske forhold.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Nordområdekunnskap</h4>
                <p>Unik kunnskap om Arktis, urfolk og nordområdenes utfordringer.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Mangfoldighet og inkludering</h4>
                <p>Sterkt fokus på mangfold, urfolksperspektiv og flerkulturell forståelse.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Naturopplevelser</h4>
                <p>Unike muligheter for naturstudier og opplevelser i arktisk miljø.</p>
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
                <li>• Generell studiekompetanse for de fleste bachelorprogram</li>
                <li>• Medisin og enkelte profesjonsstudier har høye karakterkrav</li>
                <li>• Noen fag har særskilte opptakskrav</li>
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
                <li>• Gode muligheter innen forskning, offentlig sektor og næringsliv</li>
                <li>• Spesialkompetanse etterspurt nasjonalt og internasjonalt</li>
                <li>• Tette bånd til arktisk næringsliv og forskningsinstitusjoner</li>
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
                <li>• Verdsledende arktisk forskning og klimastudier</li>
                <li>• Tverrfaglig forskning på nordområder og bærekraft</li>
                <li>• Internasjonalt samarbeid om arktiske spørsmål</li>
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
                <li>• Unikt studentmiljø med midnattssol og nordlys</li>
                <li>• Rike muligheter for friluftsliv og naturopplevelser</li>
                <li>• Levende kulturliv i Tromsø og på andre campuser</li>
                <li>• Sterkt samhold og inkluderende miljø</li>
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
              <li>• Perfekt for deg som er opptatt av klima, miljø og arktiske forhold</li>
              <li>• Godt valg hvis du vil oppleve unike naturforhold og kulturer</li>
              <li>• Passer for deg som ønsker å bidra til forskning på globale utfordringer</li>
            </ul>
          </CardContent>
        </Card>

        {/* Key Statistics from Database */}
        {!statsLoading && keyStats.length > 0 && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Nøkkeltall for UiT Norges arktiske universitet
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
                Komplett oversikt over UiT Norges arktiske universitet sine nøkkeltall fordelt på kategorier
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
                  <TabsContent key={category} value={category} className="space-y-4 mt-6">
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
                <a href="https://uit.no/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  uit.no
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://uit.no/utdanning" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Studier ved UiT
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://uit.no/studentliv" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Studentliv på UiT
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://uit.no/opptak" target="_blank" rel="noopener noreferrer">
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

export default UniversityUiT;
