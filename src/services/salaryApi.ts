
// Cache for occupation options to avoid repeated API calls
let cachedYrkeOptions: { value: string; label: string }[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const API_BASE_URL = 'https://edpath-backend-production.up.railway.app';

export interface SalaryResult {
  Yrke: string;
  Kjonn: string;
  Tid: number;
  Sektor: string;
  MaaleMetode: string;
  AvtaltVanlig: string;
  ContentsCode: string;
  value: number;
}

export interface YrkeOption {
  value: string;
  label: string;
}

// Check if cache is still valid
const isCacheValid = (): boolean => {
  if (!cacheTimestamp || !cachedYrkeOptions) return false;
  return Date.now() - cacheTimestamp < CACHE_DURATION;
};

// Load occupation options with caching
export const loadYrkeOptions = async (): Promise<YrkeOption[]> => {
  // Return cached data if available and valid
  if (isCacheValid() && cachedYrkeOptions) {
    console.log('Using cached yrke options');
    return cachedYrkeOptions;
  }

  try {
    console.log('Fetching fresh yrke options from API...');
    
    const response = await fetch(`${API_BASE_URL}/lonn/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API feil: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('API response received, processing occupations...');
    
    // Extract unique occupations more efficiently using Set
    const uniqueYrker = [...new Set(data.map((item: any) => item.Yrke).filter(Boolean))];
    const options = uniqueYrker.map(yrke => ({
      value: yrke as string,
      label: yrke as string
    }));
    
    // Cache the results
    cachedYrkeOptions = options;
    cacheTimestamp = Date.now();
    
    console.log(`Processed ${options.length} unique occupations`);
    return options;
    
  } catch (error) {
    console.error('Error loading yrker:', error);
    throw error;
  }
};

// Search for salary data
export const searchSalaryData = async (params: {
  yrke: string;
  kjonn?: string;
  selectedYears: string[];
  sektor?: string;
  maaleMetode?: string;
  avtaltVanlig?: string;
  contentsCode?: string;
}): Promise<SalaryResult[]> => {
  const { yrke, kjonn, selectedYears, sektor, maaleMetode, avtaltVanlig, contentsCode } = params;
  
  const searchParams = new URLSearchParams();
  searchParams.append('yrke', yrke);
  if (kjonn) searchParams.append('kjonn', kjonn);
  if (sektor) searchParams.append('sektor', sektor);
  if (maaleMetode) searchParams.append('MaaleMetode', maaleMetode);
  if (avtaltVanlig) searchParams.append('AvtaltVanlig', avtaltVanlig);
  if (contentsCode) searchParams.append('ContentsCode', contentsCode);
  
  // Add multiple years
  selectedYears.forEach(year => {
    searchParams.append('tid', year);
  });

  const url = `${API_BASE_URL}/lonn/?${searchParams.toString()}`;
  console.log('Search URL for', yrke, ':', url);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`API feil: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log('Search response for', yrke, ':', data);
  
  // Handle array response (multiple years)
  if (Array.isArray(data) && data.length > 0) {
    return data.map(item => ({
      Yrke: yrke,
      Kjonn: kjonn || 'Ikke spesifisert', 
      Tid: item.Tid,
      Sektor: sektor || 'Ikke spesifisert',
      MaaleMetode: maaleMetode || 'Ikke spesifisert',
      AvtaltVanlig: avtaltVanlig || 'Ikke spesifisert',
      ContentsCode: contentsCode || 'Ikke spesifisert',
      value: item.value
    }));
  }
  
  return [];
};

// Search for trend data (single occupation over multiple years)
export const searchTrendData = async (params: {
  yrke: string;
  kjonn?: string;
  sektor?: string;
  maaleMetode?: string;
  avtaltVanlig?: string;
  contentsCode?: string;
  years: number[];
}): Promise<{ year: number; value: number }[]> => {
  const { yrke, kjonn, sektor, maaleMetode, avtaltVanlig, contentsCode, years } = params;
  
  const promises = years.map(async (year) => {
    const searchParams = new URLSearchParams();
    searchParams.append('yrke', yrke);
    if (kjonn) searchParams.append('kjonn', kjonn);
    searchParams.append('tid', year.toString());
    if (sektor) searchParams.append('sektor', sektor);
    if (maaleMetode) searchParams.append('MaaleMetode', maaleMetode);
    if (avtaltVanlig) searchParams.append('AvtaltVanlig', avtaltVanlig);
    if (contentsCode) searchParams.append('ContentsCode', contentsCode);

    const url = `${API_BASE_URL}/lonn/?${searchParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch data for ${year}: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data && typeof data === 'object' && data.value !== undefined) {
      return {
        year: year,
        value: data.value
      };
    }
    
    return null;
  });

  const results = await Promise.all(promises);
  return results.filter((result): result is { year: number; value: number } => result !== null);
};
