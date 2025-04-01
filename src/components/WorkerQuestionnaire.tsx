
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import EducationBackground from './questionnaire/EducationBackground';
import WorkExperience from './questionnaire/WorkExperience';
import CareerDevelopment from './questionnaire/CareerDevelopment';
import NavigationButtons from './questionnaire/NavigationButtons';

interface WorkerQuestionnaireProps {
  form: UseFormReturn<any>;
  page: number;
  onPrevious: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const WorkerQuestionnaire: React.FC<WorkerQuestionnaireProps> = ({
  form,
  page,
  onPrevious,
  onSubmit,
  isSubmitting,
}) => {
  
  // Determine content based on current page
  const renderContent = () => {
    switch (page) {
      case 1:
        return (
          <div className="space-y-6">
            <EducationBackground form={form} includeEducationProgram={true} />
            <NavigationButtons 
              page={page} 
              onPrevious={onPrevious} 
              onSubmit={onSubmit} 
              isSubmitting={isSubmitting}
              isLastPage={false}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <WorkExperience form={form} />
            <NavigationButtons 
              page={page} 
              onPrevious={onPrevious} 
              onSubmit={onSubmit} 
              isSubmitting={isSubmitting}
              isLastPage={false}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <CareerDevelopment form={form} />
            <NavigationButtons 
              page={page} 
              onPrevious={onPrevious} 
              onSubmit={onSubmit} 
              isSubmitting={isSubmitting}
              isLastPage={true}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return renderContent();
};

export default WorkerQuestionnaire;
