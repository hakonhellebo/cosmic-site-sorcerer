
import React from 'react';
import { Check } from 'lucide-react';

const NextSteps: React.FC = () => {
  return (
    <div className="bg-muted/10 p-6 rounded-lg border">
      <h3 className="text-xl font-semibold mb-4">Neste steg – dette får du snart tilgang til</h3>
      <p className="mb-4">EdPath blir mer enn bare anbefalinger. Du vil snart kunne:</p>
      
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <li className="flex items-start">
          <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
          <span>Se hva andre med lik profil har valgt – og hvor de fikk jobb</span>
        </li>
        <li className="flex items-start">
          <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
          <span>Utforske bedrifter og stillinger som passer akkurat deg, basert på dine styrker og interesser</span>
        </li>
        <li className="flex items-start">
          <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
          <span>Få ferdige forslag til hva du kan skrive i en CV – og hvordan du matcher en jobb</span>
        </li>
        <li className="flex items-start">
          <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
          <span>Få anbefalte kurs og ferdigheter som gjør deg mer attraktiv for arbeidsgivere</span>
        </li>
        <li className="flex items-start">
          <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
          <span>Snakke med vår AI-rådgiver og få veiledning døgnet rundt</span>
        </li>
        <li className="flex items-start">
          <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
          <span>Bygge din egen profil som oppdateres etter hvert som du lærer og utvikler deg</span>
        </li>
        <li className="flex items-start">
          <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
          <span>Få kontakt med bransjer og arbeidsgivere – og se hvor du faktisk kan søke</span>
        </li>
        <li className="flex items-start">
          <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
          <span>Få oversikt over relevante utdanninger, snitt og opptak – på én side</span>
        </li>
      </ul>
      
      <p className="mt-4">Alt dette er basert på dine svar – og vil tilpasse seg deg, ikke motsatt.</p>
    </div>
  );
};

export default NextSteps;
