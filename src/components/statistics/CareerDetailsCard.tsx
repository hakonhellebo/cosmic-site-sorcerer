import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, DollarSign, Building } from 'lucide-react';
interface CareerDetailsProps {
  careerName: string;
  basicStats: Record<string, any> | null;
  detailedStats: Record<string, any>[];
}
const CareerDetailsCard: React.FC<CareerDetailsProps> = ({
  careerName,
  basicStats,
  detailedStats
}) => {
  // Calculate average salary from detailed stats
  const salaryData = detailedStats.filter(item => item.value && typeof item.value === 'number');
  const averageSalary = salaryData.length > 0 ? Math.round(salaryData.reduce((sum, item) => sum + item.value, 0) / salaryData.length) : null;

  // Group by sector
  const sectorData = detailedStats.reduce((acc, item) => {
    if (item.Sektor) {
      acc[item.Sektor] = (acc[item.Sektor] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Group by gender
  const genderData = detailedStats.reduce((acc, item) => {
    if (item.Kjonn) {
      acc[item.Kjonn] = (acc[item.Kjonn] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  return <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          {careerName}
        </CardTitle>
        <CardDescription>Statistikk og arbeidsmarkedsdata</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Statistics */}
        {basicStats && <div>
            <h4 className="font-semibold mb-2">Grunnleggende statistikk</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(basicStats).map(([key, value]) => <div key={key} className="text-center">
                  <div className="text-sm text-muted-foreground">{key}</div>
                  <div className="font-semibold">{String(value)}</div>
                </div>)}
            </div>
          </div>}

        {/* Salary Information */}
        {averageSalary && <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div>
              <div className="font-semibold">Gjennomsnittlig lønn</div>
              <div className="text-2xl font-bold text-green-600">
                {averageSalary.toLocaleString()} kr
              </div>
            </div>
          </div>}

        {/* Sector Distribution */}
        {Object.keys(sectorData).length > 0 && <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Building className="h-4 w-4" />
              Sektorfordeling
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(sectorData).map(([sector, count]) => <Badge key={sector} variant="secondary">
                  {String(sector)} ({count})
                </Badge>)}
            </div>
          </div>}

        {/* Gender Distribution */}
        {Object.keys(genderData).length > 0 && <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Kjønnsfordeling
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(genderData).map(([gender, count]) => <Badge key={gender} variant="outline">
                  {gender === 'M' ? 'Menn' : gender === 'K' ? 'Kvinner' : String(gender)} ({count})
                </Badge>)}
            </div>
          </div>}

        {/* Data Details */}
        <div>
          <h4 className="font-semibold mb-2">Datakilder</h4>
          <div className="text-sm text-muted-foreground">
            <p>• Grunndata fra Yrke_Statistikk tabellen</p>
            <p>• Detaljert informasjon fra clean_11418 tabellen</p>
            <p>• Totalt {detailedStats.length} datapunkter</p>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default CareerDetailsCard;