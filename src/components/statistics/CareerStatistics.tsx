
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Briefcase, Building, Users, ArrowLeft } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import CareerDetailPage from './CareerDetailPage';
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
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Søk etter yrker..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Velg hovedsektor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle hovedsektorer</SelectItem>
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sub-sector dropdown - only show if main sector is selected and has sub-sectors */}
            {selectedSector !== 'all' && subSectors.length > 0 && (
              <Select value={selectedSubSector} onValueChange={setSelectedSubSector}>
                <SelectTrigger>
                  <Building className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Velg undersektor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle undersektorer</SelectItem>
                  {subSectors.map((subSector) => (
                    <SelectItem key={subSector} value={subSector}>
                      {subSector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Viser {filteredCareers.length} av {careers.length} yrker</span>
            {(searchTerm || selectedSector !== 'all' || selectedSubSector !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-6 px-2"
              >
                Nullstill filtre
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Careers Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Laster yrker...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((career, index) => (
            <Card 
              key={career.Yrkesnavn || index} 
              className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-primary/20 hover:border-l-primary"
              onClick={() => handleCareerClick(career)}
            >
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">
                  {career.Yrkesnavn}
                </CardTitle>
                <div className="flex flex-wrap gap-1">
                  {career.Sektor && (
                    <Badge variant="secondary" className="text-xs">
                      <Building className="h-3 w-3 mr-1" />
                      {career.Sektor}
                    </Badge>
                  )}
                  {career['Spesifikk sektor'] && (
                    <Badge variant="outline" className="text-xs">
                      {career['Spesifikk sektor']}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {career['Kort beskrivelse']}
                </p>
                
                <div className="mt-4 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCareerClick(career);
                    }}
                  >
                    Se detaljer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredCareers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ingen yrker funnet</h3>
            <p className="text-muted-foreground mb-4">
              Prøv å justere søkekriteriene dine
            </p>
            <Button
              variant="outline"
              onClick={resetFilters}
            >
              Nullstill filtre
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CareerStatistics;
