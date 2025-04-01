
import React from 'react';
import NavigationButtons from '@/components/questionnaire/NavigationButtons';
import PersonalInfo from '@/components/questionnaire/university/PersonalInfo';
import SkillsAndCompetencies from '@/components/questionnaire/university/SkillsAndCompetencies';
import MotivationAndAmbitions from '@/components/questionnaire/university/MotivationAndAmbitions';
import CareerExpectations from '@/components/questionnaire/university/CareerExpectations';
import PreferencesAndWorkStyle from '@/components/questionnaire/university/PreferencesAndWorkStyle';
import ReflectionAndTransition from '@/components/questionnaire/university/ReflectionAndTransition';
import GradesAndWorkExperience from '@/components/questionnaire/university/GradesAndWorkExperience';
import WorkExperienceDetails from '@/components/questionnaire/university/WorkExperienceDetails';

const UniversityQuestionnaire = ({ form, page, onPrevious, onSubmit, isSubmitting }) => {
  // Page 1 - Personal Information
  if (page === 1) {
    return (
      <div className="space-y-6">
        <PersonalInfo form={form} />
        
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

  // Page 2 - Skills and Competencies
  if (page === 2) {
    return (
      <div className="space-y-6">
        <SkillsAndCompetencies form={form} />
        
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

  // Page 3 - Motivation and Ambitions
  if (page === 3) {
    return (
      <div className="space-y-6">
        <MotivationAndAmbitions form={form} />
        
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

  // Page 4 - Career Expectations
  if (page === 4) {
    return (
      <div className="space-y-6">
        <CareerExpectations form={form} />
        
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

  // Page 5 - Preferences and Work Style
  if (page === 5) {
    return (
      <div className="space-y-6">
        <PreferencesAndWorkStyle form={form} />
        
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

  // Page 6 - Reflection and Transition
  if (page === 6) {
    return (
      <div className="space-y-6">
        <ReflectionAndTransition form={form} />
        
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

  // Page 7 - Grades and Work Experience (now without job details questions)
  if (page === 7) {
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

  // Page 8 - Work Experience Details (questions 46-51)
  if (page === 8) {
    return (
      <div className="space-y-6">
        <WorkExperienceDetails form={form} />
        
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
