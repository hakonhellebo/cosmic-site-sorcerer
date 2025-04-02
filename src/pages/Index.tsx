
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
  
  // Generate random boolean value with specified probability
  const randomBool = (probability = 0.5) => Math.random() < probability;
  
  // Generate random item from an array
  const randomItem = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];
  
  // Generate random university student data with random answers
  const generateRandomUniversityData = () => {
    const studyFields = ["Informatikk", "Økonomi", "Psykologi", "Medisin", "Ingeniør", "Pedagogikk", "Statsvitenskap", "Juss"];
    const institutions = ["Universitetet i Oslo", "NTNU", "Universitetet i Bergen", "UiT", "OsloMet", "Handelshøyskolen BI", "NMBU", "Høgskulen på Vestlandet"];
    const levels = ["Bachelor", "Master", "PhD"];
    const certaintyLevels = ["very", "quite", "somewhat", "not-really"];
    const roles = ["leader", "specialist", "developer", "researcher", "teacher", "consultant", "entrepreneur"];
    const environments = ["office", "remote", "hybrid", "field"];
    
    // Generate random interests
    const possibleInterests = ["teknologi", "okonomi", "samfunnsvitenskap", "humaniora", "naturvitenskap", "helse", "kunst", "ingenior", "larer", "jus"];
    const interests: Record<string, boolean> = {};
    possibleInterests.forEach(interest => {
      interests[interest] = randomBool(0.3); // 30% chance of having each interest
    });
    
    // Ensure at least one interest is selected
    if (!Object.values(interests).some(v => v)) {
      interests[randomItem(possibleInterests)] = true;
    }
    
    // Generate random strengths
    const possibleStrengths = ["kritisk_tenkning", "problemlosning", "kreativitet", "kommunikasjon", "selvledelse", "prosjektstyring", "teknologiforstaaelse", "empati"];
    const strengths: Record<string, boolean> = {};
    possibleStrengths.forEach(strength => {
      strengths[strength] = randomBool(0.4); // 40% chance of having each strength
    });
    
    // Ensure at least one strength is selected
    if (!Object.values(strengths).some(v => v)) {
      strengths[randomItem(possibleStrengths)] = true;
    }
    
    // Generate random learning style
    const learningStyles = ["lesing", "lytting", "praksis", "diskusjon", "video"];
    const learningStyle: Record<string, boolean> = {};
    learningStyles.forEach(style => {
      learningStyle[style] = randomBool(0.5);
    });
    
    // Generate random job priorities
    const jobPriorities = ["fleksibilitet", "hoy_lonn", "stabilitet", "karrieremuligheter", "mening", "innovasjon"];
    const priorities: Record<string, boolean> = {};
    jobPriorities.forEach(priority => {
      priorities[priority] = randomBool(0.5);
    });
    
    // Random dream job options
    const dreamJobs = [
      "Teknologileder i innovativ bedrift", 
      "Forsker innen mitt fagfelt", 
      "Selvstendig konsulent", 
      "Prosjektleder for internasjonale prosjekter",
      "Produktutvikler i tech-startup",
      "Underviser på høyere nivå",
      "Gründer med eget selskap"
    ];

    return {
      firstName: "Test",
      lastName: "Bruker",
      email: "test@example.com",
      questionnaire: {
        university: {
          studyField: randomItem(studyFields),
          institution: randomItem(institutions),
          level: randomItem(levels),
          certaintylevel: randomItem(certaintyLevels),
          interests: interests,
          strengths: strengths,
          futureRole: randomItem(roles),
          workEnvironment: randomItem(environments),
          dreamJob: randomItem(dreamJobs),
          motivationSource: randomItem(["impact", "salary", "security", "passion"]),
          workLifeBalance: randomItem(["work", "balanced", "life"]),
          projectPreference: randomItem(["team", "solo", "mixed"]),
          learningStyle: learningStyle,
          collaboration: randomItem(["independent", "team", "daily", "weekly"]),
          aiUsage: randomItem(["daily", "weekly", "monthly", "never"]),
          internship: randomItem(["yes", "no", "planning"]),
          internshipValue: randomItem(["very-useful", "somewhat-useful", "not-useful"]),
          studyReason: randomItem(["job-security", "salary", "impact", "interest"]),
          salaryImportance: randomItem(["very", "somewhat", "not-really"]),
          impactImportance: randomItem(["very", "somewhat", "not-really"]),
          jobPriorities: priorities,
          internationalImportance: randomItem(["very", "somewhat", "not-really"]),
          entrepreneurship: randomItem(["yes", "no", "maybe"]),
          preferredCompanyType: randomItem(["startup", "small-medium", "large", "public", "nonprofit"]),
          technologyImportance: randomItem(["very", "somewhat", "not-really"]),
          remoteWorkImportance: randomItem(["very", "somewhat", "not-really"]),
          travelImportance: randomItem(["very", "somewhat", "not-really"]),
          preferredWorkEnvironment: randomItem(["structured", "creative", "social", "flexible"]),
          peopleTech: randomItem(["people", "tech", "both"]),
          studyChoiceReason: randomItem(["interesse", "lonn", "prestisje", "familie", "trygt"]),
          currentGrades: randomItem(["high", "good", "average", "below-average"]),
          hadJob: randomItem(["yes", "no"])
        }
      }
    };
  };
  
  const loadTestData = (userType: 'university' | 'highSchool' | 'worker') => {
    // Base test data structure
    let testData;
    
    // Type-specific test data
    if (userType === 'university') {
      // Generate random university student data
      testData = generateRandomUniversityData();
      toast.success("Student-testdata lastet inn med tilfeldige svar");
    } 
    else if (userType === 'highSchool') {
      testData = {
        firstName: "Test",
        lastName: "Bruker",
        email: "test@example.com",
        questionnaire: {
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
        }
      };
      toast.success("Elev-testdata lastet inn");
    } 
    else if (userType === 'worker') {
      testData = {
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
      toast.success("Arbeidstaker-testdata lastet inn");
    }
    
    // Store test data in localStorage
    localStorage.setItem('userFullData', JSON.stringify(testData));
    localStorage.setItem('userType', userType);
    
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
