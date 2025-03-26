
import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Opprett din profil',
    description: 'Registrer deg og gi grunnleggende informasjon om din utdanning og karriereinteresser.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Få skreddersydde råd',
    description: 'Motta personlige karriereanbefalinger basert på din bakgrunn og preferanser.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Ta handling',
    description: 'Ta det neste skrittet i karrieren din med handlingsorientert innsikt og veiledning.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
        <polyline points="16 7 22 7 22 13"></polyline>
      </svg>
    ),
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Hvordan det fungerer</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            EdPath gjør det enkelt og oversiktlig å finne din ideelle karrierevei.
          </p>
        </div>
        
        <div className="grid gap-10 md:grid-cols-3">
          {steps.map((step, index) => (
            <div 
              key={step.title} 
              className="group relative rounded-lg border bg-card p-6 transition-all duration-300 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                {step.icon}
              </div>
              <span className="absolute right-4 top-4 text-4xl font-bold text-muted/10 transition-all duration-300 group-hover:text-primary/10">
                {step.number}
              </span>
              <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground transition-all duration-200 hover:scale-105">
            Start din reise
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
