
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const NoResultsView: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <p className="text-muted-foreground">Ingen resultater funnet</p>
      <div className="flex gap-4">
        <Button onClick={() => navigate('/')}>
          Gå til hovedsiden
        </Button>
        <Button variant="outline" onClick={() => navigate('/registrer')}>
          Registrer deg
        </Button>
      </div>
    </div>
  );
};

export default NoResultsView;
