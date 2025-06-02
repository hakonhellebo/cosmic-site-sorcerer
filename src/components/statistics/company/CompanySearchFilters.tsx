
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, SortAsc, SortDesc } from "lucide-react";

type SortField = 'name' | 'employees' | 'revenue';
type SortDirection = 'asc' | 'desc';

interface CompanySearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedIndustry: string;
  setSelectedIndustry: (industry: string) => void;
  industries: string[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField) => void;
  totalCompanies: number;
}

const CompanySearchFilters: React.FC<CompanySearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedIndustry,
  setSelectedIndustry,
  industries,
  sortField,
  sortDirection,
  onSortChange,
  totalCompanies
}) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Søk på firmanavn, bransje eller beskrivelse..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">
            <Filter className="h-4 w-4 inline mr-1" />
            Filtrer på bransje
          </label>
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger>
              <SelectValue placeholder="Velg bransje" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle bransjer</SelectItem>
              {industries.map(industry => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Sorter etter</label>
          <div className="flex gap-2">
            <Button
              variant={sortField === 'name' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSortChange('name')}
              className="flex-1"
            >
              Navn
              {sortField === 'name' && (
                sortDirection === 'asc' ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />
              )}
            </Button>
            <Button
              variant={sortField === 'employees' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSortChange('employees')}
              className="flex-1"
            >
              Ansatte
              {sortField === 'employees' && (
                sortDirection === 'asc' ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />
              )}
            </Button>
            <Button
              variant={sortField === 'revenue' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSortChange('revenue')}
              className="flex-1"
            >
              Inntekt
              {sortField === 'revenue' && (
                sortDirection === 'asc' ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySearchFilters;
