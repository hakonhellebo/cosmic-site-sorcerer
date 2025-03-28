
import React from 'react';
import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  page: number;
  onPrevious: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isLastPage: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  page,
  onPrevious,
  onSubmit,
  isSubmitting,
  isLastPage
}) => {
  return (
    <div className="flex justify-between pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={page === 1}
      >
        Tilbake
      </Button>
      <Button 
        type="button" 
        onClick={onSubmit}
        disabled={isSubmitting && isLastPage}
      >
        {isLastPage 
          ? (isSubmitting ? "Sender inn..." : "Send inn") 
          : "Fortsett"
        }
      </Button>
    </div>
  );
};

export default NavigationButtons;
