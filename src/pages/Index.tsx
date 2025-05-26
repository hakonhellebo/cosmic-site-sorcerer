
import React from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import ApiTester from '@/components/ApiTester';

const Index: React.FC = () => {
  return (
    <Layout>
      <Hero />
      
      {/* API Tester Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Test API Integrasjon</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Test om EdPath API-en mottar og behandler studentdata korrekt
            </p>
          </div>
          <ApiTester />
        </div>
      </section>
      
      <Features />
      <HowItWorks />
      <Testimonials />
    </Layout>
  );
};

export default Index;
