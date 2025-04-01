
import React from 'react';

interface TestDataNoticeProps {
  isTestData: boolean;
}

const TestDataNotice: React.FC<TestDataNoticeProps> = ({ isTestData }) => {
  if (!isTestData) return null;
  
  return (
    <div className="mt-8 p-4 bg-muted rounded-lg">
      <p className="text-muted-foreground text-center">Dette er testdata. For å se dine egne resultater, fyll ut spørreskjemaet.</p>
    </div>
  );
};

export default TestDataNotice;
