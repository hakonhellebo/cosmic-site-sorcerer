
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';

interface AuthControlsProps {
  user: User | null;
  userData: any;
  onSave?: () => void;
}

const AuthControls: React.FC<AuthControlsProps> = ({ user, userData, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Function to handle login with Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/results/high-school'
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
      
      if (onSave) {
        onSave();
      }
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
  );
};

export default AuthControls;
