
import React from 'react';
import { InfoIcon } from 'lucide-react';

interface TestDataNoticeProps {
  isTestData: boolean;
  userType?: 'highSchool' | 'university' | 'worker';
}

const TestDataNotice: React.FC<TestDataNoticeProps> = ({ isTestData, userType }) => {
  if (!isTestData) return null;
  
  const userTypeLabel = userType === 'highSchool' 
    ? 'elev'
    : userType === 'university'
      ? 'student'
      : userType === 'worker'
        ? 'arbeidstaker'
        : 'bruker';
  
  return (
    <div className="mt-8 p-4 bg-muted rounded-lg flex items-center gap-3">
      <InfoIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      <div>
        <p className="text-muted-foreground">
          Dette er testdata for <span className="font-medium">{userTypeLabel}</span>. 
          For å se dine egne resultater, fyll ut spørreskjemaet.
        </p>
      </div>
    </div>
  );
};

export default TestDataNotice;
