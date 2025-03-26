
import React from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';

const Index: React.FC = () => {
  return (
    <Layout>
      <Hero />
      <HowItWorks />
      <Features />
      <Testimonials />
    </Layout>
  );
};

export default Index;
