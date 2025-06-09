
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Briefcase, Building, Users, Target, ArrowRight, TrendingUp, Loader2 } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

interface CareerDetailPageProps {
  career: any;
  onBack: () => void;
  onNavigateToCareer: (careerName: string) => void;
  allCareers: any[];
}

interface SalaryTrendData {
  year: number;
  salary: number;
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

  useEffect(() => {
    if (career?.Yrkesnavn) {
      fetchSalaryTrend();
    }
  }, [career]);

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

      // Get all SSB job titles for this career (SSB-yrke_1, SSB-yrke_2, SSB-yrke_3)
      const ssbJobs = [
        ssbMapping['SSB-yrke_1'],
        ssbMapping['SSB-yrke_2'],
        ssbMapping['SSB-yrke_3']
      ].filter(Boolean);

      if (ssbJobs.length === 0) {
        setSalaryError("Ingen SSB-yrker funnet for dette yrket");
        return;
      }

      console.log("SSB jobs to fetch:", ssbJobs);

      // Fetch salary data for years 2018-2024 for all mapped SSB jobs
      const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
      const salaryPromises = years.map(async (year) => {
        const { data: salaryRecords, error: salaryError } = await supabase
          .from('Clean_11418')
          .select('value, Yrke')
          .in('Yrke', ssbJobs)
          .eq('Tid', year)
          .eq('MaaleMetode', 'Median')
          .not('value', 'is', null);

        if (salaryError) {
          console.error(`Error fetching salary for year ${year}:`, salaryError);
          return null;
        }

        if (!salaryRecords || salaryRecords.length === 0) {
          console.log(`No salary data for year ${year}`);
          return null;
        }

        // Calculate average salary across all mapped SSB jobs for this year
        const totalSalary = salaryRecords.reduce((sum, record) => sum + (record.value || 0), 0);
        const avgSalary = totalSalary / salaryRecords.length;

        console.log(`Year ${year}: Found ${salaryRecords.length} records, average salary: ${avgSalary}`);

        return {
          year,
          salary: Math.round(avgSalary)
        };
      });

      const results = await Promise.all(salaryPromises);
      const validResults = results.filter((result): result is SalaryTrendData => result !== null);

      console.log("Valid salary results:", validResults);

      if (validResults.length === 0) {
        setSalaryError("Ingen lønnsdata funnet for de tilknyttede SSB-yrkene");
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
      label: "Median lønn",
      color: "#3b82f6",
    },
  };

  const renderCustomLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <text 
        x={x + width / 2} 
        y={y - 5} 
        fill="#374151" 
        textAnchor="middle" 
        dy={-6} 
        fontSize="12"
        fontWeight="500"
      >
        {value ? `${(value / 1000).toFixed(0)}k` : ''}
      </text>
    );
  };

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

      {/* Salary Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Lønnsutvikling (Median)
          </CardTitle>
          <CardDescription>
            Lønnsutvikling fra 2018 til 2024 basert på SSB-data
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={salaryData}
                    margin={{
                      top: 30,
                      right: 20,
                      left: 60,
                      bottom: 15,
                    }}
                    maxBarSize={50}
                    barCategoryGap="15%"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fontSize: 11 }}
                      tickMargin={8}
                      axisLine={true}
                      tickLine={true}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      width={50}
                      tick={{ fontSize: 11 }}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      formatter={(value: number) => [`${value.toLocaleString('nb-NO')} kr`, 'Median månedslønn']}
                      labelFormatter={(year) => `År ${year}`}
                    />
                    <Bar 
                      dataKey="salary" 
                      fill="var(--color-salary)"
                      radius={[3, 3, 0, 0]}
                    >
                      <LabelList content={renderCustomLabel} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {salaryData.length > 1 && (
                  <>
                    <div>
                      <span className="text-muted-foreground">Start median ({salaryData[0].year}):</span>
                      <p className="font-semibold">{salaryData[0].salary.toLocaleString('nb-NO')} kr</p>
                      <span className="text-xs text-muted-foreground">Årslønn: {(salaryData[0].salary * 12).toLocaleString('nb-NO')} kr</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Siste median ({salaryData[salaryData.length - 1].year}):</span>
                      <p className="font-semibold">{salaryData[salaryData.length - 1].salary.toLocaleString('nb-NO')} kr</p>
                      <span className="text-xs text-muted-foreground">Årslønn: {(salaryData[salaryData.length - 1].salary * 12).toLocaleString('nb-NO')} kr</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total økning (måned):</span>
                      <p className="font-semibold text-green-600">
                        +{(salaryData[salaryData.length - 1].salary - salaryData[0].salary).toLocaleString('nb-NO')} kr
                      </p>
                      <span className="text-xs text-muted-foreground">
                        Årlig: +{((salaryData[salaryData.length - 1].salary - salaryData[0].salary) * 12).toLocaleString('nb-NO')} kr
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Økning %:</span>
                      <p className="font-semibold text-green-600">
                        +{(((salaryData[salaryData.length - 1].salary - salaryData[0].salary) / salaryData[0].salary) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </>
                )}
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
