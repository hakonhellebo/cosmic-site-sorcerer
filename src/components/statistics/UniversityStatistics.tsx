
import React, { useState } from 'react';
import UniversitySelector from './university/UniversitySelector';
import ProgramSearch from './university/ProgramSearch';
import SortSelector from './university/SortSelector';
import ProgramsList from './university/ProgramsList';
import { useUniversityData } from './university/hooks/useUniversityData';
import { processUniversityData, sortPrograms } from './university/utils/dataProcessor';

const UniversityStatistics = () => {
  const [selectedUniversity, setSelectedUniversity] = useState("alle");
  const [programSearchTerm, setProgramSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("snitt");
  
  const { allStudentData, loading, universities } = useUniversityData();
  
  const processedData = processUniversityData(allStudentData, selectedUniversity, programSearchTerm);
  const sortedPrograms = sortPrograms(processedData, sortBy);
  
  return (
    <div className="space-y-8">
      {/* Data source indicator */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 text-sm">
          ✅ Viser data hentet fra Student_data tabell
        </p>
        <p className="text-green-700 text-xs mt-1">
          Totalt {allStudentData.length} poster hentet fra databasen
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UniversitySelector 
          selectedUniversity={selectedUniversity}
          onUniversityChange={setSelectedUniversity}
          universities={universities}
        />

        <ProgramSearch 
          programSearchTerm={programSearchTerm}
          onSearchTermChange={setProgramSearchTerm}
          resultCount={processedData.length}
        />

        <SortSelector 
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      <ProgramsList 
        programs={sortedPrograms}
        selectedUniversity={selectedUniversity}
        programSearchTerm={programSearchTerm}
        loading={loading}
        totalDataCount={allStudentData.length}
      />
    </div>
  );
};

export default UniversityStatistics;
