
import React from 'react';
import NavigationButtons from '@/components/questionnaire/NavigationButtons';
import UniversityEducationQuestionnaire from '@/components/UniversityEducationQuestionnaire';
import UniversitySkillsQuestionnaire from '@/components/UniversitySkillsQuestionnaire';
import CareerDevelopment from '@/components/questionnaire/CareerDevelopment';
import EducationBackground from '@/components/questionnaire/EducationBackground';
import FutureIndustries from '@/components/questionnaire/FutureIndustries';
import CareerPlanning from '@/components/questionnaire/CareerPlanning';
import CareerDecisions from '@/components/questionnaire/university/CareerDecisions';
import GradesAndWorkExperience from '@/components/questionnaire/university/GradesAndWorkExperience';

const UniversityQuestionnaire = ({ form, page, onPrevious, onSubmit, isSubmitting }) => {
  // Page 1 - Basic Education info
  if (page === 1) {
    return (
      <div className="space-y-6">
        <UniversityEducationQuestionnaire 
          form={form} 
          onSubmit={onSubmit} 
        />
      </div>
    );
  }

  // Page 2 - Skills and strengths
  if (page === 2) {
    return (
      <div className="space-y-6">
        <UniversitySkillsQuestionnaire 
          form={form} 
          onNext={onSubmit}
          onPrev={onPrevious}
        />
      </div>
    );
  }

  // Page 3 - Education Background
  if (page === 3) {
    return (
      <div className="space-y-6">
        <EducationBackground form={form} />
        
        <NavigationButtons
          page={page}
          onPrevious={onPrevious}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          isLastPage={false}
        />
      </div>
    );
  }

  // Page 4 - Career Decisions (NEW)
  if (page === 4) {
    return (
      <div className="space-y-6">
        <CareerDecisions form={form} />
        
        <NavigationButtons
          page={page}
          onPrevious={onPrevious}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          isLastPage={false}
        />
      </div>
    );
  }

  // Page 5 - Career Development
  if (page === 5) {
    return (
      <div className="space-y-6">
        <CareerDevelopment form={form} />
        
        <NavigationButtons
          page={page}
          onPrevious={onPrevious}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          isLastPage={false}
        />
      </div>
    );
  }

  // Page 6 - Grades and Work Experience (NEW)
  if (page === 6) {
    return (
      <div className="space-y-6">
        <GradesAndWorkExperience form={form} />
        
        <NavigationButtons
          page={page}
          onPrevious={onPrevious}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          isLastPage={false}
        />
      </div>
    );
  }

  // Page 7 - Future Industries and Career Planning
  if (page === 7) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <FutureIndustries form={form} />
        </div>
        
        <CareerPlanning form={form} />
        
        <NavigationButtons
          page={page}
          onPrevious={onPrevious}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          isLastPage={true}
        />
      </div>
    );
  }

  return null;
};

export default UniversityQuestionnaire;
