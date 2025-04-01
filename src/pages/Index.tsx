
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

const Index: React.FC = () => {
  
  const loadTestResults = () => {
    // Lager testdata som simulerer en fullført spørreundersøkelse
    const testData = {
      firstName: "Test",
      lastName: "Bruker",
      email: "test@example.com",
      questionnaire: {
        worker: {
          currentRole: "Utvikler",
          industry: "IT og teknologi",
          experience: "5",
          strengths: {
            problemløsning: true,
            kritisk_tenkning: true,
            kommunikasjon: true
          },
          skills: {
            programmering: true,
            prosjektledelse: true,
            dataanalyse: true
          },
          careerGoal: "Bli en teknisk leder innen 3 år",
          developmentImportance: "very-important"
        }
      }
    };
    
    // Lagrer testdataen i localStorage
    localStorage.setItem('userFullData', JSON.stringify(testData));
    
    toast.success("Testdata lastet inn", {
      description: "Du kan nå se resultatssiden med eksempeldata"
    });
  };
  
  return (
    <Layout>
      <Hero />
      <Features />
      <div className="container mx-auto my-8 px-4">
        <div className="bg-muted/50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">For utviklere og testere</h2>
          <p className="mb-4 text-muted-foreground">Vil du se hvordan resultatssiden ser ut uten å fylle ut alle spørsmålene?</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={loadTestResults}>
              Last inn testdata
            </Button>
            <Link to="/results">
              <Button variant="outline">
                Gå til resultatssiden
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <HowItWorks />
      <Testimonials />
    </Layout>
  );
};

export default Index;
