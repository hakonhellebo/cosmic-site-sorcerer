
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-24"
    >
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(120,120,180,0.1),transparent_40%)]"
        aria-hidden="true"
      />
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span className="opacity-0 animate-stagger-1 inline-block mb-3 rounded-full bg-secondary px-3 py-1 text-xs font-medium">
            Welcome to EdPath
          </span>
          <h1 className="opacity-0 animate-stagger-2 mb-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Find Your Path: Personalized Career Guidance
          </h1>
          <p className="opacity-0 animate-stagger-3 mx-auto mb-8 max-w-2xl text-balance text-xl text-muted-foreground">
            EdPath helps you discover your best career options with data-driven insights, tailored specifically to your education and aspirations.
          </p>
          <div className="opacity-0 animate-stagger-4 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            <button className="rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground transition-transform-200 hover:scale-105">
              Get Started for Free
            </button>
            <button className="rounded-full border border-primary px-8 py-3 font-medium transition-all-200 hover:bg-primary hover:text-primary-foreground">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
