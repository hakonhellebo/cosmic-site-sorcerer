
import React, { useState, useEffect } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import CareerDetailPage from './CareerDetailPage';
import CareerSearchFilters from './career/CareerSearchFilters';
import CareersGrid from './career/CareersGrid';
import { useLocation } from 'react-router-dom';

interface Career {
  Yrkesnavn: string;
  'Kort beskrivelse': string;
  'Detaljert beskrivelse': string;
  'Nøkkelkompetanser': string;
  'Relaterte yrker': string;
  Sektor: string;
  'Spesifikk sektor': string;
}

interface CareerStatisticsProps {
  preloadedData?: {
    companies: any[];
    allStudentData: any[];
  };
}

const CareerStatistics: React.FC<CareerStatisticsProps> = ({ preloadedData }) => {
  const location = useLocation();
  const [careers, setCareers] = useState<Career[]>([]);
  const [filteredCareers, setFilteredCareers] = useState<Career[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedSubSector, setSelectedSubSector] = useState("all");
  const [sectors, setSectors] = useState<string[]>([]);
  const [subSectors, setSubSectors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);

  useEffect(() => {
    fetchCareers();
  }, []);

  useEffect(() => {
    // Check if we should show a specific career from navigation state
    if (location.state?.selectedCareer && careers.length > 0) {
      const careerToShow = careers.find(c => c.Yrkesnavn === location.state.selectedCareer);
      if (careerToShow) {
        setSelectedCareer(careerToShow);
      }
    }
  }, [location.state, careers]);

  useEffect(() => {
    filterCareers();
  }, [careers, searchTerm, selectedSector, selectedSubSector]);

  // Update sub-sectors when main sector changes
  useEffect(() => {
    updateSubSectors();
  }, [selectedSector, careers]);

  const fetchCareers = async () => {
    setLoading(true);
    console.log("Fetching careers from Yrker_database...");
    
    try {
      const { data, error } = await supabase
        .from('Yrker_database')
        .select('*')
        .order('Yrkesnavn', { ascending: true });
      
      if (error) {
        console.error("Error fetching careers:", error);
      } else {
        console.log(`Fetched ${data?.length || 0} careers`);
        setCareers(data || []);
        
        // Extract unique sectors
        const uniqueSectors = [...new Set(
          (data || [])
            .map(career => career.Sektor)
            .filter(Boolean)
            .sort()
        )];
        setSectors(uniqueSectors);
      }
    } catch (err) {
      console.error("Error:", err);
    }
    
    setLoading(false);
  };

  const updateSubSectors = () => {
    if (selectedSector === 'all') {
      setSubSectors([]);
      setSelectedSubSector('all');
      return;
    }

    // Get unique sub-sectors for the selected main sector
    const uniqueSubSectors = [...new Set(
      careers
        .filter(career => career.Sektor === selectedSector)
        .map(career => career['Spesifikk sektor'])
        .filter(Boolean)
        .sort()
    )];

    setSubSectors(uniqueSubSectors);
    setSelectedSubSector('all'); // Reset sub-sector selection when main sector changes
  };

  const filterCareers = () => {
    let filtered = careers;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(career => 
        career.Yrkesnavn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career['Kort beskrivelse']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career.Sektor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career['Spesifikk sektor']?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply main sector filter
    if (selectedSector !== 'all') {
      filtered = filtered.filter(career => career.Sektor === selectedSector);
    }

    // Apply sub-sector filter
    if (selectedSubSector !== 'all') {
      filtered = filtered.filter(career => career['Spesifikk sektor'] === selectedSubSector);
    }
    
    setFilteredCareers(filtered);
  };

  const handleCareerClick = (career: Career) => {
    setSelectedCareer(career);
  };

  const handleBackToList = () => {
    setSelectedCareer(null);
  };

  const handleNavigateToCareer = (careerName: string) => {
    const career = careers.find(c => c.Yrkesnavn === careerName);
    if (career) {
      setSelectedCareer(career);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSector("all");
    setSelectedSubSector("all");
  };

  if (selectedCareer) {
    return (
      <CareerDetailPage
        career={selectedCareer}
        onBack={handleBackToList}
        onNavigateToCareer={handleNavigateToCareer}
        allCareers={careers}
        preloadedData={preloadedData}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-6 w-6" />
            Karrierestatistikk
          </CardTitle>
          <CardDescription>
            Utforsk ulike yrker og karrieremuligheter
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Search and Filter Controls */}
      <CareerSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
        selectedSubSector={selectedSubSector}
        setSelectedSubSector={setSelectedSubSector}
        sectors={sectors}
        subSectors={subSectors}
        filteredCareersCount={filteredCareers.length}
        totalCareersCount={careers.length}
        resetFilters={resetFilters}
      />

      {/* Careers Grid */}
      <CareersGrid
        filteredCareers={filteredCareers}
        loading={loading}
        onCareerClick={handleCareerClick}
        resetFilters={resetFilters}
      />
    </div>
  );
};

export default CareerStatistics;
