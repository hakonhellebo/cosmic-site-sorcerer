
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp } from 'lucide-react';

interface SortSelectorProps {
  sortBy: string;
  onSortChange: (value: string) => void;
}

const SortSelector: React.FC<SortSelectorProps> = ({
  sortBy,
  onSortChange
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Sorter etter
        </CardTitle>
        <CardDescription>Velg hvordan du vil sortere utdanningene</CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Velg sorteringsmetode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="snitt">Karaktersnitt</SelectItem>
            <SelectItem value="popularity">Popularitet (antall møtt)</SelectItem>
            <SelectItem value="competition">Konkurransenivå (søkere per plass)</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default SortSelector;
