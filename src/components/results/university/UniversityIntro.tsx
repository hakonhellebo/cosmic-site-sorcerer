
import React from 'react';
import { GraduationCap } from "lucide-react";

interface UniversityIntroProps {
  isBachelorStudent: boolean;
  dimensions: { name: string; score: number }[];
}

const UniversityIntro: React.FC<UniversityIntroProps> = ({ isBachelorStudent, dimensions }) => {
  const dimensionColors = {
    analytisk: "bg-primary/10",
    ambisjon: "bg-blue-100",
    teknologi: "bg-green-100",
    kreativitet: "bg-amber-100",
    struktur: "bg-purple-100",
    sosialitet: "bg-rose-100",
    helseinteresse: "bg-red-100",
    bærekraft: "bg-emerald-100",
    selvstendighet: "bg-sky-100",
    praktisk: "bg-orange-100"
  };
  
  const dimensionDescriptions = {
    analytisk: "Du har sterke analytiske evner og er god til å løse komplekse problemer.",
    ambisjon: "Du er fokusert på å nå dine mål og jobber systematisk mot dem.",
    teknologi: "Du har god teknologiforståelse og interesse for digitale løsninger.",
    kreativitet: "Du har kreative evner og liker å tenke utenfor boksen.",
    struktur: "Du er strukturert, organisert og metodisk i din tilnærming.",
    sosialitet: "Du trives med å jobbe i team og bidra til fellesskapet.",
    helseinteresse: "Du er opptatt av helse og velvære, både for deg selv og andre.",
    bærekraft: "Du er opptatt av bærekraft og samfunnsansvar.",
    selvstendighet: "Du er selvstendig, selvgående og liker å ta egne valg.",
    praktisk: "Du er praktisk anlagt og liker å se konkrete resultater."
  };
  
  return (
    <div className="bg-card p-6 rounded-lg border animate-fade-up relative overflow-hidden">
      <div className="absolute top-0 left-0 h-full w-1 bg-primary"></div>
      <div className="relative">
        <div className="flex items-center mb-4">
          <GraduationCap className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-xl font-semibold">
            {isBachelorStudent ? "Bachelorstudent" : "Masterstudent"}
          </h2>
        </div>
        <p className="text-lg mb-6">
          Basert på svarene dine har vi laget en personlig profil som viser dine styrker, interesser 
          og mulige karriereveier som {isBachelorStudent ? "bachelorstudent" : "masterstudent"}. Dette er ikke en fasit – men en start på reisen mot 
          en karriere som passer deg.
        </p>
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Dine dimensjoner</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {dimensions.map((dim, index) => {
              const color = dimensionColors[dim.name as keyof typeof dimensionColors] || "bg-gray-100";
              const description = dimensionDescriptions[dim.name as keyof typeof dimensionDescriptions] || "";
              
              return (
                <div key={index} className={`p-3 ${color} rounded-md`}>
                  <h4 className="font-medium capitalize">{dim.name}</h4>
                  <p className="text-sm">{description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityIntro;
