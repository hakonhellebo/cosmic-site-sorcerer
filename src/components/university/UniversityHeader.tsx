
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface UniversityHeaderProps {
  title: string;
  subtitle: string;
  badge: string;
}

const UniversityHeader: React.FC<UniversityHeaderProps> = ({ title, subtitle, badge }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/statistikk')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Tilbake til statistikk
      </Button>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          <p className="text-xl text-muted-foreground">{subtitle}</p>
        </div>
        <Badge variant="secondary" className="w-fit">
          {badge}
        </Badge>
      </div>
    </div>
  );
};

export default UniversityHeader;
