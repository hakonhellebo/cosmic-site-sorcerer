
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

const CareerStatistics = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="text-center max-w-lg">
        <Briefcase className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
        <h3 className="text-2xl font-semibold mb-4">Yrkesstatistikk kommer snart</h3>
        <p className="text-muted-foreground">
          Vi jobber med å samle inn data om yrker, lønninger og karrieremuligheter. 
          Denne funksjonen vil bli tilgjengelig i nær fremtid.
        </p>
      </div>
    </div>
  );
};

export default CareerStatistics;
