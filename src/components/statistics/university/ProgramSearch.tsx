
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ProgramSearchProps {
  programSearchTerm: string;
  onSearchTermChange: (value: string) => void;
  resultCount: number;
}

const ProgramSearch: React.FC<ProgramSearchProps> = ({
  programSearchTerm,
  onSearchTermChange,
  resultCount
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Søk på studielinje
        </CardTitle>
        <CardDescription>Søk etter studielinjer (f.eks. "psykologi", "økonomi")</CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Søk etter studielinjer..."
          value={programSearchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="w-full"
        />
        {programSearchTerm && (
          <p className="text-sm text-muted-foreground mt-2">
            Viser {resultCount} studielinjer som inneholder "{programSearchTerm}"
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgramSearch;
