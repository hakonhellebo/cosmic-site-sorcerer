
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { getRecommendationsFromApi } from '@/services/edpathApi';
import { mapUniversityAnswersToApi } from '@/utils/universityApiMapper';

const ApiTester: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Test data som simulerer en student som har fylt ut skjemaet
  const testUniversityData = {
    interests: {
      teknologi: true,
      økonomi: true,
      naturvitenskap: false,
      helse: false
    },
    strengths: {
      kritisk_tenkning: true,
      problemløsning: true,
      kreativitet: false
    },
    taskPreferences: {
      analytical: true,
      creative: false,
      practical: true
    },
    workPreference: 'team',
    aiUsage: 'daily',
    internship: 'yes',
    internshipValue: 'very',
    studyReason: 'good-salary',
    salaryImportance: 'very-important',
    impactImportance: 'important'
  };

  const testApi = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log("🧪 Testing API with data:", testUniversityData);
      
      // Map test data to API format
      const mappedAnswers = mapUniversityAnswersToApi(testUniversityData);
      console.log("📤 Mapped answers:", mappedAnswers);
      
      // Call API
      const recommendations = await getRecommendationsFromApi(mappedAnswers);
      console.log("📥 API Response:", recommendations);
      
      setResult(recommendations);
    } catch (err) {
      console.error("❌ API Test failed:", err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧪 EdPath API Tester
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Tester API-kommunikasjon med eksempel studentdata
        </div>
        
        <Button 
          onClick={testApi} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Tester API...' : 'Test EdPath API'}
        </Button>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
            <XCircle className="h-5 w-5 text-red-500" />
            <div>
              <div className="font-medium text-red-800">API Test feilet</div>
              <div className="text-sm text-red-600">{error}</div>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div className="font-medium text-green-800">API Test vellykket!</div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Topp dimensjoner:</h4>
                <div className="flex flex-wrap gap-1">
                  {result.topp_dimensjoner?.map((dim: string, idx: number) => (
                    <Badge key={idx} variant="secondary">
                      {dim}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Anbefalte studier ({result.studier?.length || 0}):</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {result.studier?.slice(0, 3).map((studie: any, idx: number) => (
                    <div key={idx} className="p-2 bg-gray-50 rounded">
                      <div className="font-medium">{studie.navn}</div>
                      <div className="text-sm text-muted-foreground">{studie.lærested}</div>
                      {studie.stillinger?.length > 0 && (
                        <div className="text-xs mt-1">
                          Stillinger: {studie.stillinger.slice(0, 2).join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiTester;
