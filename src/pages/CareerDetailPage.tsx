
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import CareerDetail from '@/components/statistics/CareerDetailPage';
import Layout from '@/components/Layout';

interface Career {
  Yrkesnavn: string;
  'Kort beskrivelse': string;
  'Detaljert beskrivelse': string;
  'Nøkkelkompetanser': string;
  'Relaterte yrker': string;
  Sektor: string;
  'Spesifikk sektor': string;
}

const CareerDetailPageWrapper: React.FC = () => {
  const { careerSlug } = useParams<{ careerSlug: string }>();
  const location = useLocation();
  const [career, setCareer] = useState<Career | null>(null);
  const [allCareers, setAllCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareerData = async () => {
      setLoading(true);
      
      try {
        // First, get all careers
        const { data: careersData, error: careersError } = await supabase
          .from('Yrker_database')
          .select('*')
          .order('Yrkesnavn', { ascending: true });

        if (careersError) {
          console.error("Error fetching careers:", careersError);
          setLoading(false);
          return;
        }

        setAllCareers(careersData || []);

        // Find the specific career based on the slug or location state
        let targetCareer: Career | null = null;

        if (location.state?.career) {
          targetCareer = location.state.career;
        } else if (careerSlug && careersData) {
          // Try to find career by converting slug back to name
          const careerName = careerSlug.replace(/-/g, ' ');
          targetCareer = careersData.find(c => 
            c.Yrkesnavn.toLowerCase().replace(/[^a-z0-9]/g, '-') === careerSlug ||
            c.Yrkesnavn.toLowerCase().includes(careerName.toLowerCase())
          ) || null;
        }

        setCareer(targetCareer);
      } catch (error) {
        console.error("Error fetching career data:", error);
      }
      
      setLoading(false);
    };

    fetchCareerData();
  }, [careerSlug, location.state]);

  const handleNavigateToCareer = (careerName: string) => {
    const newCareer = allCareers.find(c => c.Yrkesnavn === careerName);
    if (newCareer) {
      setCareer(newCareer);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Laster karrieredata...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!career) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Karriere ikke funnet</h1>
            <p className="text-muted-foreground">Den forespurte karrieren kunne ikke finnes.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <CareerDetail
        career={career}
        onBack={() => window.history.back()}
        onNavigateToCareer={handleNavigateToCareer}
        allCareers={allCareers}
        preloadedData={{
          companies: [],
          allStudentData: []
        }}
      />
    </Layout>
  );
};

export default CareerDetailPageWrapper;
