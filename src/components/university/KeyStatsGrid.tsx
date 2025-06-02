
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MapPin, BookOpen } from 'lucide-react';

interface KeyStatsGridProps {
  studentCount: string;
  campuses: string;
  programs: string;
}

const KeyStatsGrid: React.FC<KeyStatsGridProps> = ({ studentCount, campuses, programs }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Antall studenter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{studentCount}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Campuser
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{campuses}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Studieprogram
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{programs}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyStatsGrid;
