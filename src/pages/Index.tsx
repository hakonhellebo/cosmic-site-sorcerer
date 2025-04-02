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
  
  const randomBool = (probability = 0.5) => Math.random() < probability;
  
  const randomItem = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];
  
  const generateRandomUniversityData = () => {
    const studyFields = ["Informatikk", "Økonomi", "Psykologi", "Medisin", "Ingeniør", "Pedagogikk", "Statsvitenskap", "Juss"];
    const institutions = ["Universitetet i Oslo", "NTNU", "Universitetet i Bergen", "UiT", "OsloMet", "Handelshøyskolen BI", "NMBU", "Høgskulen på Vestlandet"];
    const levels = ["Bachelor", "Master", "PhD"];
    const certaintyLevels = ["very", "quite", "somewhat", "not-really"];
    const roles = ["leader", "specialist", "developer", "researcher", "teacher", "consultant", "entrepreneur"];
    const environments = ["office", "remote", "hybrid", "field"];
    
    const possibleInterests = ["teknologi", "okonomi", "samfunnsvitenskap", "humaniora", "naturvitenskap", "helse", "kunst", "ingenior", "larer", "jus"];
    const interests: Record<string, boolean> = {};
    possibleInterests.forEach(interest => {
      interests[interest] = randomBool(0.3);
    });
    
    if (!Object.values(interests).some(v => v)) {
      interests[randomItem(possibleInterests)] = true;
    }
    
    const possibleStrengths = ["kritisk_tenkning", "problemlosning", "kreativitet", "kommunikasjon", "selvledelse", "prosjektstyring", "teknologiforstaaelse", "empati"];
    const strengths: Record<string, boolean> = {};
    possibleStrengths.forEach(strength => {
      strengths[strength] = randomBool(0.4);
    });
    
    if (!Object.values(strengths).some(v => v)) {
      strengths[randomItem(possibleStrengths)] = true;
    }
    
    const learningStyles = ["lesing", "lytting", "praksis", "diskusjon", "video"];
    const learningStyle: Record<string, boolean> = {};
    learningStyles.forEach(style => {
      learningStyle[style] = randomBool(0.5);
    });
    
    const jobPriorities = ["fleksibilitet", "hoy_lonn", "stabilitet", "karrieremuligheter", "mening", "innovasjon"];
    const priorities: Record<string, boolean> = {};
    jobPriorities.forEach(priority => {
      priorities[priority] = randomBool(0.5);
    });
    
    const challengeOptions = ["konkurranse", "manglende_erfaring", "hoye_krav", "usikker_jobbvalg"];
    const jobChallenges: Record<string, boolean> = {};
    challengeOptions.forEach(challenge => {
      jobChallenges[challenge] = randomBool(0.4);
    });
    
    const bestSubjects: Record<string, boolean> = {};
    possibleInterests.forEach(subject => {
      bestSubjects[subject] = randomBool(0.3);
    });
    
    const employerFactors = ["hoy_lonn", "godt_arbeidsmiljo", "karriereutvikling", "stabilitet", "innovasjon"];
    const futureEmployerFactors: Record<string, boolean> = {};
    employerFactors.forEach(factor => {
      futureEmployerFactors[factor] = randomBool(0.5);
    });
    
    const studyMissingOptions = ["praktisk_erfaring", "relevante_fag", "veiledning", "nettverk", "fleksibilitet", "kobling"];
    const studyMissing: Record<string, boolean> = {};
    studyMissingOptions.forEach(option => {
      studyMissing[option] = randomBool(0.4);
    });
    
    const satisfactionOptions = ["meningsfylt", "hoy_lonn", "karriereutvikling", "fleksibilitet", "innovasjon", "stabilitet"];
    const satisfactionFactors: Record<string, boolean> = {};
    satisfactionOptions.forEach(option => {
      satisfactionFactors[option] = randomBool(0.5);
    });

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
          jobChallenges: jobChallenges,
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
          hadJob: randomItem(["yes", "no"]),
          bestSubjects: bestSubjects,
          futureEmployerFactors: futureEmployerFactors,
          studyMissing: studyMissing,
          satisfactionFactors: satisfactionFactors
        }
      }
    };
  };

  const generateRandomHighSchoolData = () => {
    const studyDirections = ["studiespesialisering", "idrettsfag", "musikk_dans_drama", "kunst_design", "medier_kommunikasjon", "helse_oppvekst", "teknologi_industri", "elektro_datateknologi", "bygg_anlegg", "restaurant_matfag"];
    const grades = ["vg1", "vg2", "vg3"];
    const averageGrades = ["3-4", "4-5", "5-6"];
    const workPreferences = ["team", "individual", "mixed"];
    
    const possibleInterests = ["teknologi", "realfag", "samfunnsfag", "kreativitet", "entrepenørskap", "helse", "språk", "idrett", "teknologi", "okonomi", "reise", "miljø"];
    const interests: Record<string, boolean> = {};
    let selectedInterestsCount = 0;
    
    possibleInterests.forEach(interest => {
      if (selectedInterestsCount < 3 && randomBool(0.4)) {
        interests[interest] = true;
        selectedInterestsCount++;
      } else {
        interests[interest] = false;
      }
    });
    
    if (selectedInterestsCount < 3) {
      const remainingInterests = possibleInterests.filter(interest => !interests[interest]);
      while (selectedInterestsCount < 3 && remainingInterests.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingInterests.length);
        const selectedInterest = remainingInterests.splice(randomIndex, 1)[0];
        interests[selectedInterest] = true;
        selectedInterestsCount++;
      }
    }
    
    const possibleSkills = ["logicalThinking", "creativity", "communication", "leadership", "collaboration", "problemSolving", "technicalUnderstanding"];
    const goodSkills: Record<string, boolean> = {};
    let selectedSkillsCount = 0;
    
    possibleSkills.forEach(skill => {
      if (selectedSkillsCount < 2 && randomBool(0.4)) {
        goodSkills[skill] = true;
        selectedSkillsCount++;
      } else {
        goodSkills[skill] = false;
      }
    });
    
    if (selectedSkillsCount < 2) {
      const remainingSkills = possibleSkills.filter(skill => !goodSkills[skill]);
      while (selectedSkillsCount < 2 && remainingSkills.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingSkills.length);
        const selectedSkill = remainingSkills.splice(randomIndex, 1)[0];
        goodSkills[selectedSkill] = true;
        selectedSkillsCount++;
      }
    }
    
    const possibleCourses = ["matematikk", "norsk", "engelsk", "naturfag", "samfunnsfag", "historie", "geografi", "kroppsøving", "teknologi", "kunst"];
    const favoriteCourses: Record<string, boolean> = {};
    const difficultCourses: Record<string, boolean> = {};
    
    const favoriteCoursesCount = Math.floor(Math.random() * 3) + 1;
    const favoriteIndices = new Set<number>();
    while (favoriteIndices.size < favoriteCoursesCount) {
      favoriteIndices.add(Math.floor(Math.random() * possibleCourses.length));
    }
    possibleCourses.forEach((course, index) => {
      favoriteCourses[course] = favoriteIndices.has(index);
    });
    
    const difficultCoursesCount = Math.floor(Math.random() * 2) + 1;
    const nonFavoriteCourses = possibleCourses.filter(course => !favoriteCourses[course]);
    const difficultIndices = new Set<number>();
    while (difficultIndices.size < difficultCoursesCount && difficultIndices.size < nonFavoriteCourses.length) {
      difficultIndices.add(Math.floor(Math.random() * nonFavoriteCourses.length));
    }
    possibleCourses.forEach((course) => {
      difficultCourses[course] = difficultIndices.has(nonFavoriteCourses.indexOf(course)) && nonFavoriteCourses.includes(course);
    });
    
    const possibleWorkTasks = ["problemSolving", "creativity", "leadership", "teamwork", "technical", "communication"];
    const workTasks: Record<string, boolean> = {};
    let selectedWorkTasksCount = 0;
    
    possibleWorkTasks.forEach(task => {
      if (selectedWorkTasksCount < 2 && randomBool(0.5)) {
        workTasks[task] = true;
        selectedWorkTasksCount++;
      } else {
        workTasks[task] = false;
      }
    });
    
    if (selectedWorkTasksCount < 2) {
      const remainingTasks = possibleWorkTasks.filter(task => !workTasks[task]);
      while (selectedWorkTasksCount < 2 && remainingTasks.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingTasks.length);
        const selectedTask = remainingTasks.splice(randomIndex, 1)[0];
        workTasks[selectedTask] = true;
        selectedWorkTasksCount++;
      }
    }
    
    const learningStyleOptions = ["visual", "auditory", "writing", "practical"];
    const learningStylePrefs: Record<string, boolean> = {};
    let selectedLearningStylesCount = 0;
    
    learningStyleOptions.forEach(style => {
      if (selectedLearningStylesCount < 1 && randomBool(0.6)) {
        learningStylePrefs[style] = true;
        selectedLearningStylesCount++;
      } else {
        learningStylePrefs[style] = false;
      }
    });
    
    if (selectedLearningStylesCount === 0) {
      const randomStyle = randomItem(learningStyleOptions);
      learningStylePrefs[randomStyle] = true;
    }
    
    return {
      firstName: "Test",
      lastName: "Bruker",
      email: "test@example.com",
      questionnaire: {
        highSchool: {
          school: "Oslo videregående skole",
          studyDirection: randomItem(studyDirections),
          grade: randomItem(grades),
          averageGrade: randomItem(averageGrades),
          interests: interests,
          goodSkills: goodSkills,
          favoriteCourses: favoriteCourses,
          difficultCourses: difficultCourses,
          careerPlan: randomBool() ? "Jeg planlegger å studere videre" : "Jeg er usikker på hva jeg vil gjøre",
          favoriteCoursesOther: randomBool(0.3) ? "Programmering" : "",
          difficultCoursesOther: randomBool(0.3) ? "Fysikk" : "",
          workPreference: randomItem(workPreferences),
          learningStyle: learningStylePrefs,
          workTasks: workTasks
        }
      }
    };
  };
  
  const generateRandomWorkerData = () => {
    const studyFields = ["Informatikk", "Økonomi", "Psykologi", "Medisin", "Ingeniør", "Pedagogikk", "Statsvitenskap", "Juss"];
    const institutions = ["Universitetet i Oslo", "NTNU", "Universitetet i Bergen", "UiT", "OsloMet", "Handelshøyskolen BI", "NMBU", "Høgskulen på Vestlandet"];
    const levels = ["Bachelor", "Master", "PhD"];
    const certaintyLevels = ["very", "quite", "somewhat", "not-really"];
    const roles = ["leader", "specialist", "developer", "researcher", "teacher", "consultant", "entrepreneur"];
    const environments = ["office", "remote", "hybrid", "field"];
    
    const possibleInterests = ["teknologi", "okonomi", "samfunnsvitenskap", "humaniora", "naturvitenskap", "helse", "kunst", "ingenior", "larer", "jus"];
    const interests: Record<string, boolean> = {};
    possibleInterests.forEach(interest => {
      interests[interest] = randomBool(0.3);
    });
    
    if (!Object.values(interests).some(v => v)) {
      interests[randomItem(possibleInterests)] = true;
    }
    
    const possibleStrengths = ["kritisk_tenkning", "problemlosning", "kreativitet", "kommunikasjon", "selvledelse", "prosjektstyring", "teknologiforstaaelse", "empati"];
    const strengths: Record<string, boolean> = {};
    possibleStrengths.forEach(strength => {
      strengths[strength] = randomBool(0.4);
    });
    
    if (!Object.values(strengths).some(v => v)) {
      strengths[randomItem(possibleStrengths)] = true;
    }
    
    const learningStyles = ["lesing", "lytting", "praksis", "diskusjon", "video"];
    const learningStyle: Record<string, boolean> = {};
    learningStyles.forEach(style => {
      learningStyle[style] = randomBool(0.5);
    });
    
    const jobPriorities = ["fleksibilitet", "hoy_lonn", "stabilitet", "karrieremuligheter", "mening", "innovasjon"];
    const priorities: Record<string, boolean> = {};
    jobPriorities.forEach(priority => {
      priorities[priority] = randomBool(0.5);
    });
    
    const workerChallengeOptions = ["konkurranse", "manglende_erfaring", "hoye_krav", "usikker_jobbvalg"];
    const jobChallenges: Record<string, boolean> = {};
    workerChallengeOptions.forEach(challenge => {
      jobChallenges[challenge] = randomBool(0.4);
    });
    
    const bestSubjects: Record<string, boolean> = {};
    possibleInterests.forEach(subject => {
      bestSubjects[subject] = randomBool(0.3);
    });
    
    const employerFactors = ["hoy_lonn", "godt_arbeidsmiljo", "karriereutvikling", "stabilitet", "innovasjon"];
    const futureEmployerFactors: Record<string, boolean> = {};
    employerFactors.forEach(factor => {
      futureEmployerFactors[factor] = randomBool(0.5);
    });
    
    const studyMissingOptions = ["praktisk_erfaring", "relevante_fag", "veiledning", "nettverk", "fleksibilitet", "kobling"];
    const studyMissing: Record<string, boolean> = {};
    studyMissingOptions.forEach(option => {
      studyMissing[option] = randomBool(0.4);
    });
    
    const satisfactionOptions = ["meningsfylt", "hoy_lonn", "karriereutvikling", "fleksibilitet", "innovasjon", "stabilitet"];
    const satisfactionFactors: Record<string, boolean> = {};
    satisfactionOptions.forEach(option => {
      satisfactionFactors[option] = randomBool(0.5);
    });

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
          jobChallenges: jobChallenges,
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
          hadJob: randomItem(["yes", "no"]),
          bestSubjects: bestSubjects,
          futureEmployerFactors: futureEmployerFactors,
          studyMissing: studyMissing,
          satisfactionFactors: satisfactionFactors
        }
      }
    };
  };
  
  const loadTestData = (userType: 'university' | 'highSchool' | 'worker') => {
    let testData;
    
    if (userType === 'university') {
      testData = generateRandomUniversityData();
      toast.success("Student-testdata lastet inn med tilfeldige svar");
    } 
    else if (userType === 'highSchool') {
      testData = generateRandomHighSchoolData();
      toast.success("Elev-testdata lastet inn med tilfeldige svar");
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
    
    localStorage.setItem('userFullData', JSON.stringify(testData));
    localStorage.setItem('userType', userType);
    
    toast.success("Testdata lastet inn", {
      description: "Du kan nå se resultatssiden med eksempeldata"
    });
  };
  
  return (
    <Layout>
      <Hero />
      
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
