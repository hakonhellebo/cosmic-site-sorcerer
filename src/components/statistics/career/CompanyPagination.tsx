
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CompanyPaginationProps {
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
}

const CompanyPagination: React.FC<CompanyPaginationProps> = ({
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevPage}
        disabled={totalPages <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm text-muted-foreground">
        {currentPage + 1} av {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onNextPage}
        disabled={totalPages <= 1}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CompanyPagination;
