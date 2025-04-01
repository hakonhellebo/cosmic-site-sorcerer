
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { GraduationCap, BookOpen, Briefcase, ArrowRight } from "lucide-react";

const Index: React.FC = () => {
  
  const loadTestData = (userType: 'university' | 'highSchool' | 'worker') => {
    // Base test data structure
    const baseTestData = {
      firstName: "Test",
      lastName: "Bruker",
      email: "test@example.com",
      questionnaire: {}
    };
    
    // Type-specific test data
    if (userType === 'university') {
      baseTestData.questionnaire = {
        university: {
          studyField: "Informatikk",
          institution: "Universitetet i Oslo",
          level: "Bachelor",
          certaintylevel: "quite",
          interests: {
            teknologi: true,
            forskning: true,
            innovasjon: true
          },
          strengths: {
            analytisk_tenkning: true,
            problemløsning: true,
            teamarbeid: true
          },
          futureRole: "developer",
          workEnvironment: "hybrid",
          dreamJob: "Teknologileder i innovativ bedrift",
          motivationSource: "impact",
          workLifeBalance: "balanced",
          projectPreference: "team"
        }
      };
      toast.success("Student-testdata lastet inn");
    } 
    else if (userType === 'highSchool') {
      baseTestData.questionnaire = {
        highSchool: {
          school: "Oslo videregående skole",
          program: "Studiespesialisering",
          grade: "VG2",
          interests: {
            teknologi: true,
            realfag: true,
            samfunnsfag: true
          },
          strengths: {
            analytisk: true,
            kreativ: true,
            samarbeidsvillig: true
          },
          favoriteSubjects: {
            matematikk: true,
            naturfag: true,
            samfunnsfag: true
          },
          careerPlan: "Ønsker å studere informatikk",
          industries: {
            it: true,
            teknologi: true,
            helse: true,
            kreativ: true
          }
        }
      };
      toast.success("Elev-testdata lastet inn");
    } 
    else if (userType === 'worker') {
      baseTestData.questionnaire = {
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
      };
      toast.success("Arbeidstaker-testdata lastet inn");
    }
    
    // Store test data in localStorage
    localStorage.setItem('userFullData', JSON.stringify(baseTestData));
    
    toast.success("Testdata lastet inn", {
      description: "Du kan nå se resultatssiden med eksempeldata"
    });
  };
  
  return (
    <Layout>
      <Hero />
      
      {/* Direct Questionnaire Access Buttons */}
      <div className="container mx-auto my-12 px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Kom i gang med din karrierereise</h2>
          <p className="text-muted-foreground">Gå direkte til spørreskjemaet som passer din situasjon</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-all duration-200 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-6 w-6 text-primary" />
              <h3 className="font-semibold text-lg">Elev</h3>
            </div>
            <p className="text-muted-foreground mb-6 flex-grow">For elever i videregående skole som ønsker veiledning om fremtidige utdannings- og karrierevalg</p>
            <Link to="/high-school-questionnaire" className="w-full">
              <Button className="w-full flex items-center justify-between">
                Til spørreskjema
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-all duration-200 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="h-6 w-6 text-primary" />
              <h3 className="font-semibold text-lg">Student</h3>
            </div>
            <p className="text-muted-foreground mb-6 flex-grow">For studenter ved universitet eller høyskole som ønsker karriereveiledning basert på studier</p>
            <Link to="/university-questionnaire" className="w-full">
              <Button className="w-full flex items-center justify-between">
                Til spørreskjema
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-all duration-200 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="h-6 w-6 text-primary" />
              <h3 className="font-semibold text-lg">Yrkesaktiv</h3>
            </div>
            <p className="text-muted-foreground mb-6 flex-grow">For deg som er i arbeidslivet og ønsker veiledning om videre karriereutvikling</p>
            <Link to="/worker-questionnaire" className="w-full">
              <Button className="w-full flex items-center justify-between">
                Til spørreskjema
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Features />
      <div className="container mx-auto my-8 px-4">
        <div className="bg-muted/50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">For utviklere og testere</h2>
          <p className="mb-4 text-muted-foreground">Vil du se hvordan resultatssiden ser ut uten å fylle ut alle spørsmålene?</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Elev</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Se resultater tilpasset elever i videregående</p>
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={() => loadTestData('highSchool')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Last inn testdata
                </Button>
                <Link to="/results/high-school" className="w-full">
                  <Button 
                    variant="default"
                    size="sm"
                    className="w-full"
                  >
                    Gå til resultatssiden - Elev
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Student</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Se resultater tilpasset studenter på høyere utdanning</p>
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={() => loadTestData('university')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Last inn testdata
                </Button>
                <Link to="/results/university" className="w-full">
                  <Button 
                    variant="default"
                    size="sm"
                    className="w-full"
                  >
                    Gå til resultatssiden - Student
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Arbeidstaker</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Se resultater tilpasset personer i arbeidslivet</p>
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={() => loadTestData('worker')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Last inn testdata
                </Button>
                <Link to="/results/worker" className="w-full">
                  <Button 
                    variant="default"
                    size="sm"
                    className="w-full"
                  >
                    Gå til resultatssiden - Arbeidstaker
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HowItWorks />
      <Testimonials />
    </Layout>
  );
};

export default Index;
