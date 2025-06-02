
import React from 'react';
import CompanySearch from './CompanySearch';

interface PreloadedData {
  companies: any[];
  loading: boolean;
}

interface CompanyStatisticsProps {
  preloadedData?: PreloadedData;
}

const CompanyStatistics: React.FC<CompanyStatisticsProps> = ({ preloadedData }) => {
  return <CompanySearch preloadedData={preloadedData} />;
};

export default CompanyStatistics;
