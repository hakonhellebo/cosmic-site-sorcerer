import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Briefcase, Building, Users, Target, ArrowRight, TrendingUp, Loader2, Filter } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList, LineChart, Line } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

interface CareerDetailPageProps {
  career: any;
  onBack: () => void;
  onNavigateToCareer: (careerName: string) => void;
  allCareers: any[];
}

interface SalaryTrendData {
  year: number;
  [key: string]: number; // For dynamic job names
}

const CareerDetailPage: React.FC<CareerDetailPageProps> = ({
  career,
  onBack,
  onNavigateToCareer,
  allCareers
}) => {
  const [salaryData, setSalaryData] = useState<SalaryTrendData[]>([]);
  const [loadingSalary, setLoadingSalary] = useState(false);
  const [salaryError, setSalaryError] = useState<string | null>(null);
  const [availableJobs, setAvailableJobs] = useState<string[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [availableGenders, setAvailableGenders] = useState<string[]>([]);

  useEffect(() => {
    if (career?.Yrkesnavn) {
      fetchSalaryTrend();
    }
  }, [career, selectedJobs, selectedGender]);

  const fetchSalaryTrend = async () => {
    if (!career?.Yrkesnavn) return;

    setLoadingSalary(true);
    setSalaryError(null);
    setSalaryData([]);

    try {
      console.log("Fetching salary trend for career:", career.Yrkesnavn);
      
      // First, find the SSB job mapping
      const { data: ssbMapping, error: mappingError } = await supabase
        .from('ssb_til_yrker')
        .select('*')
        .eq('Connections-yrke', career.Yrkesnavn)
        .single();

      if (mappingError || !ssbMapping) {
        console.log("No SSB mapping found for", career.Yrkesnavn);
        setSalaryError("Ingen lønnsdata tilgjengelig for dette yrket");
        return;
      }

      console.log("SSB mapping found:", ssbMapping);

      // Get all SSB job titles for this career
      const allSsbJobs = [
        ssbMapping['SSB-yrke_1'],
        ssbMapping['SSB-yrke_2'],
        ssbMapping['SSB-yrke_3']
      ].filter(Boolean);

      if (allSsbJobs.length === 0) {
        setSalaryError("Ingen SSB-yrker funnet for dette yrket");
        return;
      }

      // Set available jobs if not already set
      if (availableJobs.length === 0) {
        setAvailableJobs(allSsbJobs);
        setSelectedJobs(allSsbJobs); // Select all by default
      }

      // Get available genders if not already set
      if (availableGenders.length === 0) {
        const { data: genderData } = await supabase
          .from('Clean_11418')
          .select('Kjonn')
          .in('Yrke', allSsbJobs)
          .not('Kjonn', 'is', null);
        
        const uniqueGenders = [...new Set(genderData?.map(item => item.Kjonn).filter(Boolean))];
        setAvailableGenders(uniqueGenders);
      }

      // Use selected jobs or all if none selected
      const jobsToFetch = selectedJobs.length > 0 ? selectedJobs : allSsbJobs;

      console.log("Jobs to fetch:", jobsToFetch);

      // Fetch salary data for years 2018-2024
      const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
      const salaryPromises = years.map(async (year) => {
        let query = supabase
          .from('Clean_11418')
          .select('value, Yrke, Kjonn')
          .in('Yrke', jobsToFetch)
          .eq('Tid', year)
          .eq('MaaleMetode', 'Median')
          .not('value', 'is', null);

        // Add gender filter if selected
        if (selectedGender !== 'all') {
          query = query.eq('Kjonn', selectedGender);
        }

        const { data: salaryRecords, error: salaryError } = await query;

        if (salaryError) {
          console.error(`Error fetching salary for year ${year}:`, salaryError);
          return null;
        }

        if (!salaryRecords || salaryRecords.length === 0) {
          console.log(`No salary data for year ${year}`);
          return null;
        }

        // Group by job and calculate data
        const yearData: SalaryTrendData = { year };
        
        // If we're showing specific jobs separately
        if (jobsToFetch.length > 1 && selectedJobs.length > 0) {
          jobsToFetch.forEach(job => {
            const jobRecords = salaryRecords.filter(record => record.Yrke === job);
            if (jobRecords.length > 0) {
              const avgSalary = jobRecords.reduce((sum, record) => sum + (record.value || 0), 0) / jobRecords.length;
              yearData[job] = Math.round(avgSalary);
            }
          });
        } else {
          // Calculate overall average
          const totalSalary = salaryRecords.reduce((sum, record) => sum + (record.value || 0), 0);
          const avgSalary = totalSalary / salaryRecords.length;
          yearData['Gjennomsnitt'] = Math.round(avgSalary);
        }

        console.log(`Year ${year}:`, yearData);
        return yearData;
      });

      const results = await Promise.all(salaryPromises);
      const validResults = results.filter((result): result is SalaryTrendData => result !== null);

      console.log("Valid salary results:", validResults);

      if (validResults.length === 0) {
        setSalaryError("Ingen lønnsdata funnet for de valgte kriteriene");
      } else {
        validResults.sort((a, b) => a.year - b.year);
        setSalaryData(validResults);
      }

    } catch (error) {
      console.error("Error fetching salary trend:", error);
      setSalaryError("Feil ved henting av lønnsdata");
    } finally {
      setLoadingSalary(false);
    }
  };

  const chartConfig = {
    salary: {
      label: "Median månedslønn",
      color: "#3b82f6",
    },
  };

  const getDataKeys = () => {
    if (salaryData.length === 0) return [];
    const keys = Object.keys(salaryData[0]).filter(key => key !== 'year');
    return keys;
  };

  const getChartColors = () => {
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
    return colors;
  };

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

  const dataKeys = getDataKeys();
  const colors = getChartColors();

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

      {/* Salary Trend Chart with Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Lønnsutvikling (Median månedslønn)
          </CardTitle>
          <CardDescription>
            Sammenlign lønnsutvikling mellom relaterte yrker og kjønn (2018-2024)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter Controls */}
          {availableJobs.length > 1 && (
            <div className="mb-6 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4" />
                <span className="font-medium">Filtrer data:</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Job Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Velg yrker å sammenligne:</label>
                  <div className="space-y-2">
                    {availableJobs.map((job) => (
                      <label key={job} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedJobs.includes(job)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedJobs([...selectedJobs, job]);
                            } else {
                              setSelectedJobs(selectedJobs.filter(j => j !== job));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{job}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Gender Selection */}
                {availableGenders.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Kjønn:</label>
                    <Select value={selectedGender} onValueChange={setSelectedGender}>
                      <SelectTrigger>
                        <SelectValue placeholder="Velg kjønn" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle</SelectItem>
                        {availableGenders.map((gender) => (
                          <SelectItem key={gender} value={gender}>
                            {gender}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          )}

          {loadingSalary && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Henter lønnsdata...</span>
            </div>
          )}

          {salaryError && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700 text-sm">{salaryError}</p>
            </div>
          )}

          {salaryData.length > 0 && (
            <>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={salaryData}
                    margin={{
                      top: 30,
                      right: 30,
                      left: 60,
                      bottom: 15,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fontSize: 11 }}
                      tickMargin={8}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      width={60}
                      tick={{ fontSize: 11 }}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      formatter={(value: number, name: string) => [
                        `${value.toLocaleString('nb-NO')} kr`, 
                        name
                      ]}
                      labelFormatter={(year) => `År ${year}`}
                    />
                    {dataKeys.map((key, index) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={colors[index % colors.length]}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name={key}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              {/* Summary Statistics */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                {dataKeys.map((key, index) => {
                  const jobData = salaryData.map(d => d[key]).filter(Boolean);
                  if (jobData.length < 2) return null;
                  
                  const firstValue = jobData[0];
                  const lastValue = jobData[jobData.length - 1];
                  const increase = lastValue - firstValue;
                  const percentIncrease = (increase / firstValue) * 100;

                  return (
                    <div key={key} className="p-3 border rounded-lg" style={{ borderColor: colors[index % colors.length] + '30' }}>
                      <div className="font-medium text-xs mb-1" style={{ color: colors[index % colors.length] }}>
                        {key}
                      </div>
                      <div className="space-y-1">
                        <div>
                          <span className="text-muted-foreground">Siste:</span>
                          <p className="font-semibold">{lastValue.toLocaleString('nb-NO')} kr</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Økning:</span>
                          <p className="font-semibold text-green-600">
                            +{increase.toLocaleString('nb-NO')} kr ({percentIncrease.toFixed(1)}%)
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
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
