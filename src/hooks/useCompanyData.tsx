
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Company {
  Selskap: string;
  Huvudbransje: string;
  Beskrivelse: string;
  Lokasjon: string;
  Ansatte: string;
  'Driftsinntekter (MNOK)': string;
  Geografi: string;
  Linker: string;
  Karriereportal: string;
}

type SortField = 'name' | 'employees' | 'revenue';
type SortDirection = 'asc' | 'desc';

export const useCompanyData = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Helper function to parse employee count for sorting
  const parseEmployeeCount = (employeeStr: string): number => {
    if (!employeeStr) return 0;
    
    // Handle ranges like "1-10", "11-50", etc.
    const cleanStr = employeeStr.replace(/[^\d-]/g, '');
    if (cleanStr.includes('-')) {
      const [min, max] = cleanStr.split('-').map(Number);
      return Math.floor((min + max) / 2); // Use average for sorting
    }
    
    // Handle single numbers
    const num = parseInt(cleanStr);
    return isNaN(num) ? 0 : num;
  };

  // Helper function to parse revenue for sorting
  const parseRevenue = (revenueStr: string): number => {
    if (!revenueStr) return 0;
    const cleanStr = revenueStr.replace(/[^\d,.]/g, '').replace(',', '.');
    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : num;
  };

  // Sort companies based on selected criteria
  const sortCompanies = (companiesToSort: Company[], sortField: SortField, sortDirection: SortDirection): Company[] => {
    return [...companiesToSort].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = (a.Selskap || '').localeCompare(b.Selskap || '');
          break;
        case 'employees':
          comparison = parseEmployeeCount(a.Ansatte) - parseEmployeeCount(b.Ansatte);
          break;
        case 'revenue':
          comparison = parseRevenue(a['Driftsinntekter (MNOK)']) - parseRevenue(b['Driftsinntekter (MNOK)']);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  // Fetch all companies on hook initialization
  const fetchCompanies = async () => {
    setInitialLoading(true);
    console.log("Fetching companies from Supabase...");
    
    try {
      const { data, error } = await supabase
        .from('Bedrifter')
        .select('*')
        .order('Selskap', { ascending: true });
      
      if (error) {
        console.error("Error fetching companies:", error);
      } else {
        console.log(`Fetched ${data?.length || 0} companies`);
        setCompanies(data || []);
        
        // Extract unique industries
        const uniqueIndustries = [...new Set(
          (data || [])
            .map(company => company.Hovedbransje)
            .filter(Boolean)
            .sort()
        )];
        setIndustries(uniqueIndustries);
      }
    } catch (err) {
      console.error("Error:", err);
    }
    
    setInitialLoading(false);
  };

  // Filter and sort companies
  const filterAndSortCompanies = (
    searchTerm: string,
    selectedIndustry: string,
    sortField: SortField,
    sortDirection: SortDirection
  ) => {
    setLoading(true);
    
    let filtered = companies;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(company => 
        company.Selskap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.Huvudbransje?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.Beskrivelse?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply industry filter
    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(company => company.Huvudbransje === selectedIndustry);
    }
    
    // Apply sorting
    filtered = sortCompanies(filtered, sortField, sortDirection);
    
    setFilteredCompanies(filtered);
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return {
    companies,
    filteredCompanies,
    industries,
    loading,
    initialLoading,
    filterAndSortCompanies
  };
};
