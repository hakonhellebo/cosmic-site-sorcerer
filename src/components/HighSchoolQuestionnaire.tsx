import React, { useEffect } from 'react';
import NavigationButtons from '@/components/questionnaire/NavigationButtons';
import FutureIndustries from '@/components/questionnaire/FutureIndustries';
import CareerPlanning from '@/components/questionnaire/CareerPlanning';
import Introduction from './questionnaire/high-school/Introduction';
import InterestsAndSkills from './questionnaire/high-school/InterestsAndSkills';
import SchoolSubjects from './questionnaire/high-school/SchoolSubjects';
import WorkReadiness from './questionnaire/high-school/WorkReadiness';

// The component has been updated to now show 6 pages, where pages 5 and 6 are the new "Future Plans" sections

const HighSchoolQuestionnaire = ({ 
  form, 
  setFormProgress,
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage
}) => {
  
  // Calculate progress based on current page
  useEffect(() => {
    const progress = (currentPage / totalPages) * 100;
    setFormProgress(progress);
  }, [currentPage, totalPages, setFormProgress]);
  
  // Page 5 - Industries and future roles
  if (currentPage === 5) {
    return (
      <div className="space-y-6">
        <FutureIndustries form={form} />
        
        <NavigationButtons
          page={currentPage}
          onPrevious={onPrevPage}
          onSubmit={onNextPage}
          isSubmitting={false}
          isLastPage={false}
        />
      </div>
    );
  }
  
  // Page 6 - Career planning and motivation (final page)
  if (currentPage === 6) {
    return (
      <div className="space-y-6">
        <CareerPlanning form={form} />
        
        <NavigationButtons
          page={currentPage}
          onPrevious={onPrevPage}
          onSubmit={onNextPage}
          isSubmitting={false}
          isLastPage={true}
        />
      </div>
    );
  }
  
  // Pages 1-4 rendering logic
  if (currentPage === 1) {
    return (
      <div className="space-y-6">
        <Introduction form={form} />
        
        <NavigationButtons
          page={currentPage}
          onPrevious={onPrevPage}
          onSubmit={onNextPage}
          isSubmitting={false}
          isLastPage={false}
        />
      </div>
    );
  }

  if (currentPage === 2) {
    return (
      <div className="space-y-6">
        <InterestsAndSkills form={form} />
        
        <NavigationButtons
          page={currentPage}
          onPrevious={onPrevPage}
          onSubmit={onNextPage}
          isSubmitting={false}
          isLastPage={false}
        />
      </div>
    );
  }

  if (currentPage === 3) {
    return (
      <div className="space-y-6">
        <SchoolSubjects form={form} />
        
        <NavigationButtons
          page={currentPage}
          onPrevious={onPrevPage}
          onSubmit={onNextPage}
          isSubmitting={false}
          isLastPage={false}
        />
      </div>
    );
  }

  if (currentPage === 4) {
    return (
      <div className="space-y-6">
        <WorkReadiness form={form} />
        
        <NavigationButtons
          page={currentPage}
          onPrevious={onPrevPage}
          onSubmit={onNextPage}
          isSubmitting={false}
          isLastPage={false}
        />
      </div>
    );
  }

  return null;
};

export default HighSchoolQuestionnaire;
