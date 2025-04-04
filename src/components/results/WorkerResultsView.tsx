
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ResultCard from './ResultCard';
import { User } from '@supabase/supabase-js';
import { Badge } from "@/components/ui/badge";
import { Check, Briefcase } from "lucide-react";
import { getFormattedValue } from '@/utils/resultFormatters';
import { formatLearningStyle } from '@/utils/highschoolDataFormatters';
import { CareerOpportunities } from '@/components/results/worker/CareerOpportunities';

interface WorkerResultsViewProps {
  userData: any;
}

export const WorkerResultsView: React.FC<WorkerResultsViewProps> = ({ userData }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    // Get the current user from Supabase
    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        console.error("Error getting user:", error);
      } else {
        setUser(data.user);
      }
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Extract worker data from userData with fallback
  const workerData = userData?.questionnaire?.worker || {};
  
  // Extract strengths and skills
  const strengths = Object.keys(workerData.strengths || {})
    .filter(key => workerData.strengths?.[key]);
  
  const skills = Object.keys(workerData.skills || {})
    .filter(key => workerData.skills?.[key]);
  
  // Create worker info cards
  const workerInfoCards = [
    {
      title: "Din jobb og erfaring",
      icon: "work",
      items: [
        { label: "Nåværende stilling", value: workerData.currentRole || "Ikke angitt" },
        { label: "Bransje", value: workerData.industry || "Ikke angitt" },
        { label: "Erfaring", value: workerData.experience ? workerData.experience + " år" : "Ikke angitt" }
      ]
    },
    {
      title: "Dine styrker og ferdigheter",
      icon: "award",
      items: [
        { 
          label: "Styrker", 
          value: strengths.join(', ') || "Ingen oppgitt"
        },
        { 
          label: "Ferdigheter", 
          value: skills.join(', ') || "Ingen oppgitt"
        }
      ]
    }
  ];

  // Define development opportunities
  const developmentOpportunities = [
    { 
      title: "Lederstilling", 
      institution: "Større bedrifter i samme bransje", 
      description: "Bygger videre på din erfaring og lederegenskaper" 
    },
    { 
      title: "Spesialisering", 
      institution: "Fagmiljøer", 
      description: "Fordyper deg i ditt ekspertiseområde" 
    },
    { 
      title: "Rådgivning", 
      institution: "Konsulentvirksomheter", 
      description: "Deler din kompetanse med andre" 
    }
  ];
  
  // Sample career opportunities
  const careerOpportunities = [
    {
      title: "Senior Prosjektleder",
      description: "Lede og koordinere større prosjekter i bedriften.",
      fields: ["Teknologi", "Produktutvikling", "Organisasjon"]
    },
    {
      title: "Fagspesialist",
      description: "Utvikle dybdekunnskap innen spesifikke fagområder.",
      fields: ["Teknisk ekspertise", "Rådgivning", "Forskning"]
    },
    {
      title: "Avdelingsleder",
      description: "Lede en avdeling med personalansvar og strategisk planlegging.",
      fields: ["Ledelse", "Strategi", "HR"]
    }
  ];
  
  // Define next steps
  const nextSteps = [
    "Utforsk videreutdanningsmuligheter innen ditt felt",
    "Bygg nettverk med bransjeeksperter",
    "Delta på kurs for å styrke dine ferdigheter",
    "Vurder mentorordninger for karriereveiledning"
  ];
  
  // Function to handle login with Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/results/worker'
        }
      });
      
      if (error) {
        toast.error("Kunne ikke logge inn med Google", {
          description: error.message
        });
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      toast.error("En feil oppstod under innlogging", {
        description: "Vennligst prøv igjen senere"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Function to handle logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Kunne ikke logge ut", {
        description: error.message
      });
    } else {
      toast.success("Du er nå logget ut");
    }
  };
  
  // Function to save results to profile
  const saveResultsToProfile = async () => {
    if (!user) {
      toast.error("Du må være logget inn for å lagre resultatene dine");
      return;
    }
    
    setSaving(true);
    
    try {
      // Store the user's results in localStorage with their user ID
      localStorage.setItem(`userFullData_${user.id}`, JSON.stringify(userData));
      
      toast.success("Resultatene dine er lagret", {
        description: "Du kan finne dem igjen på profilsiden din"
      });
    } catch (error) {
      console.error("Error saving results:", error);
      toast.error("Kunne ikke lagre resultatene dine", {
        description: "Vennligst prøv igjen senere"
      });
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="space-y-10">
      {/* Auth controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-muted/30 rounded-lg">
        {user ? (
          <div className="flex flex-col sm:flex-row gap-2 w-full justify-between items-start sm:items-center">
            <div>
              <p className="text-sm">Logget inn som: <span className="font-medium">{user.email}</span></p>
              <p className="text-xs text-muted-foreground">Dine resultater vil automatisk bli knyttet til din konto</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={saveResultsToProfile}
                disabled={saving}
              >
                {saving ? "Lagrer..." : "Lagre resultater"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
              >
                Logg ut
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-between items-start sm:items-center">
            <div>
              <p className="text-sm">Logg inn for å lagre resultatene dine</p>
              <p className="text-xs text-muted-foreground">Resultatene dine vil være tilgjengelige neste gang du logger inn</p>
            </div>
            <Button 
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                "Logger inn..."
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 0, 0)">
                      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="currentColor"></path>
                    </g>
                  </svg>
                  Logg inn med Google
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="bg-card p-6 rounded-lg border animate-fade-up relative overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-1 bg-primary"></div>
        <div className="relative">
          <div className="flex items-center mb-4">
            <Briefcase className="h-6 w-6 mr-2 text-primary" />
            <h2 className="text-xl font-semibold">Arbeidstaker</h2>
          </div>
          <p className="text-lg mb-6">
            Basert på dine svar har vi laget en personlig profil som viser dine styrker, 
            ferdigheter og potensielle karrieremuligheter. Dette er ment som et utgangspunkt 
            for videre karriereutvikling.
          </p>
          
          {/* Worker dimensions */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Badge className="px-3 py-1.5 text-base bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-300">
              Ekspertise
            </Badge>
            <Badge className="px-3 py-1.5 text-base bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300">
              Lederskap
            </Badge>
            <Badge className="px-3 py-1.5 text-base bg-green-100 hover:bg-green-200 text-green-800 border-green-300">
              Tilpasningsdyktighet
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border rounded-md">
              <h4 className="font-medium text-purple-800">Ekspertise</h4>
              <p className="text-sm">Du har opparbeidet verdifull fagkompetanse i din bransje.</p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium text-blue-800">Lederskap</h4>
              <p className="text-sm">Du viser evne til å ta ansvar og lede andre.</p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium text-green-800">Tilpasningsdyktighet</h4>
              <p className="text-sm">Du er god til å tilpasse deg nye situasjoner og utfordringer.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Worker info cards */}
      {workerInfoCards.map((card, index) => (
        <ResultCard 
          key={index} 
          title={card.title} 
          icon={card.icon} 
          items={card.items} 
        />
      ))}
      
      {/* Career goal card */}
      <ResultCard 
        title="Karrieremål" 
        icon="target" 
        items={[
          { 
            label: "Karrieremål", 
            value: workerData.careerGoal || "Ikke angitt"
          },
          { 
            label: "Utviklingsmuligheter", 
            value: getFormattedValue(workerData.developmentImportance) || "Ikke angitt"
          }
        ]}
      />
      
      {/* Development opportunities */}
      <div className="animate-fade-up">
        <h3 className="text-2xl font-semibold mb-6">Karriereutvikling</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {developmentOpportunities.map((opp, idx) => (
            <div key={idx} className="bg-card border rounded-lg p-5 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-lg mb-2">{opp.title}</h4>
              <p className="text-sm text-muted-foreground mb-3">{opp.institution}</p>
              <div className="bg-muted/40 p-3 rounded">
                <p>{opp.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Career opportunities */}
        <div className="mb-8">
          <CareerOpportunities 
            careers={careerOpportunities}
          />
        </div>
        
        {/* Next steps */}
        <div className="bg-gradient-to-r from-muted/20 to-muted/5 p-6 rounded-lg border">
          <h3 className="text-xl font-semibold mb-4">Anbefalte tiltak</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {nextSteps.map((step, idx) => (
              <li key={idx} className="flex items-start">
                <div className="mr-2 mt-1 bg-primary/20 rounded-full p-0.5">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkerResultsView;
