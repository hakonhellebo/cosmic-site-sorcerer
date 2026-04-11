
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, FileText, GraduationCap, BookOpen } from 'lucide-react';
import { getRecommendations } from '@/services/edpathApi';
import { isEdPathApiConfigured } from '@/services/edpathApi.config';
import type { EdPathApiResponse, EdPathUserType } from '@/services/edpathApi.types';
import { mapUniversityAnswersToApi } from '@/utils/universityApiMapper';
import { mapHighSchoolAnswersToApi } from '@/utils/highSchoolApiMapper';
import { useNavigate } from 'react-router-dom';

const ApiTester: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EdPathApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [testType, setTestType] = useState<EdPathUserType | null>(null);

  const testUniversityData = {
    interests: { teknologi: true, økonomi: true, naturvitenskap: false, helse: false },
    strengths: { kritisk_tenkning: true, problemløsning: true, kreativitet: false },
    taskPreferences: { analytical: true, creative: false, practical: true },
    workPreference: 'team',
    aiUsage: 'daily',
    internship: 'yes',
    internshipValue: 'very',
    studyReason: 'good-salary',
    salaryImportance: 'very-important',
    impactImportance: 'important'
  };

  const testHighSchoolData = {
    interests: { naturvitenskap: true, teknologi: true, helse: false, økonomi: false },
    strengths: { analytisk: true, kreativ: false, samarbeidsvillig: true },
    favoriteSubjects: { matematikk: true, fysikk: true, kjemi: false },
    futureEducation: 'university',
    certaintylevel: 'somewhat-certain'
  };

  const runTest = async (userType: EdPathUserType, data: any) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setTestType(userType);

    try {
      const mappedAnswers = userType === 'student'
        ? mapUniversityAnswersToApi(data)
        : mapHighSchoolAnswersToApi(data);

      console.log(`📤 Mapped ${userType} answers:`, mappedAnswers);
      const recommendations = await getRecommendations(mappedAnswers, userType);
      console.log(`📥 ${userType} API Response:`, recommendations);
      setResult(recommendations);
    } catch (err) {
      console.error(`❌ ${userType} API Test failed:`, err);
      setError(err instanceof Error ? err.message : 'Ukjent feil');
    } finally {
      setIsLoading(false);
    }
  };

  const apiConfigured = isEdPathApiConfigured();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧪 EdPath API Tester
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!apiConfigured && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
            <span className="text-yellow-600 text-sm">
              ⚠️ VITE_EDPATH_API_BASE_URL er ikke satt. Legg den til i .env for å teste mot ekte API.
            </span>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          Tester API-kommunikasjon med eksempeldata for studenter og elever
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Button 
            onClick={() => runTest('student', testUniversityData)} 
            disabled={isLoading || !apiConfigured}
            className="flex items-center gap-2"
          >
            {isLoading && testType === 'student' && <Loader2 className="h-4 w-4 animate-spin" />}
            <GraduationCap className="h-4 w-4" />
            {isLoading && testType === 'student' ? 'Tester...' : 'Test Student API'}
          </Button>
          
          <Button 
            onClick={() => runTest('elev', testHighSchoolData)} 
            disabled={isLoading || !apiConfigured}
            variant="secondary"
            className="flex items-center gap-2"
          >
            {isLoading && testType === 'elev' && <Loader2 className="h-4 w-4 animate-spin" />}
            <BookOpen className="h-4 w-4" />
            {isLoading && testType === 'elev' ? 'Tester...' : 'Test Elev API'}
          </Button>
        </div>
        
        <Button 
          onClick={() => navigate('/user-type-selection')}
          variant="outline"
          className="w-full flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Spørreundersøkelse tester
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
              <div className="font-medium text-green-800">
                {testType === 'student' ? 'Student' : 'Elev'} API Test vellykket!
              </div>
            </div>
            
            <div className="space-y-3">
              {result.dimensjoner && result.dimensjoner.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Dimensjoner:</h4>
                  <div className="flex flex-wrap gap-1">
                    {result.dimensjoner.map((dim, idx) => (
                      <Badge key={idx} variant="secondary">
                        {dim.navn}: {dim.score}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {result.topp_dimensjoner && result.topp_dimensjoner.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Topp dimensjoner:</h4>
                  <div className="flex flex-wrap gap-1">
                    {result.topp_dimensjoner.map((dim, idx) => (
                      <Badge key={idx} variant="secondary">{dim}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {result.studier && result.studier.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">
                    Anbefalte studier ({result.studier.length}):
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {result.studier.slice(0, 3).map((studie, idx) => (
                      <div key={idx} className="p-2 bg-gray-50 rounded">
                        <div className="font-medium">{studie.navn}</div>
                        {studie.lærested && (
                          <div className="text-sm text-muted-foreground">{studie.lærested}</div>
                        )}
                        {studie.stillinger && studie.stillinger.length > 0 && (
                          <div className="text-xs mt-1">
                            Stillinger: {studie.stillinger.slice(0, 2).join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiTester;
