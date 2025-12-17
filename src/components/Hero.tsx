import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
const Hero: React.FC = () => {
  return <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(120,120,180,0.1),transparent_40%)]" aria-hidden="true" />
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 flex justify-center">
            <img src="/lovable-uploads/5ea5acb7-62cf-4c3e-8769-6f1975b41458.png" alt="EdPath Logo" className="h-64 w-auto opacity-0 animate-stagger-1" />
          </div>
          <span className="opacity-0 animate-stagger-2 inline-block mb-3 rounded-full bg-secondary px-3 py-1 font-medium text-3xl">
            Velkommen til EdPath
          </span>
          <h1 className="opacity-0 animate-stagger-3 mb-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Finn din vei:  
Personlig karriereinnsikt</h1>
          <p className="opacity-0 animate-stagger-4 mx-auto mb-8 max-w-2xl text-balance text-xl text-muted-foreground">EdPath hjelper deg å forstå karrieremuligheter gjennom datadrevet innsikt, tilpasset din utdanning og ambisjoner.</p>
          <div className="opacity-0 animate-stagger-5 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            <Button className="rounded-full px-8 py-3 font-medium transition-transform hover:scale-105" asChild>
              <Link to="/registrer">Kom i gang gratis</Link>
            </Button>
            <Button variant="outline" className="rounded-full border border-primary px-8 py-3 font-medium transition-all hover:bg-primary hover:text-primary-foreground" asChild>
              <Link to="/registrer">Lær mer</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;