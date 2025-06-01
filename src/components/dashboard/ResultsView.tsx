
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

interface ResultsViewProps {
  onContinueToDashboard: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ onContinueToDashboard }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Takk! Din profil er nå opprettet</CardTitle>
          <CardDescription>
            Vi har lagret informasjonen din og du kan nå utforske dine personlige karriereanbefalinger på dashbordet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-6xl">🎉</div>
            <p className="text-lg">Din profil er nå ferdig!</p>
            <p className="text-muted-foreground">
              Du finner alle dine anbefalinger og kan oppdatere profilen din på dashbordet.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            className="rounded-full" 
            onClick={onContinueToDashboard}
          >
            Gå til mitt dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResultsView;
