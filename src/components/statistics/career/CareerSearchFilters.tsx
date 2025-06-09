
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Building } from "lucide-react";

interface CareerSearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedSector: string;
  setSelectedSector: (sector: string) => void;
  selectedSubSector: string;
  setSelectedSubSector: (subSector: string) => void;
  sectors: string[];
  subSectors: string[];
  filteredCareersCount: number;
  totalCareersCount: number;
  resetFilters: () => void;
}

const CareerSearchFilters: React.FC<CareerSearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedSector,
  setSelectedSector,
  selectedSubSector,
  setSelectedSubSector,
  sectors,
  subSectors,
  filteredCareersCount,
  totalCareersCount,
  resetFilters
}) => {
  const hasActiveFilters = searchTerm || selectedSector !== 'all' || selectedSubSector !== 'all';

  return (
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
          <span>Viser {filteredCareersCount} av {totalCareersCount} yrker</span>
          {hasActiveFilters && (
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
  );
};

export default CareerSearchFilters;
