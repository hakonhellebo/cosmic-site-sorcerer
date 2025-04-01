
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const VerificationPending: React.FC = () => {
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);
  
  const userDataString = localStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  
  const handleResendEmail = async () => {
    if (!userData?.email) {
      toast.error("E-postadresse ikke funnet");
      return;
    }
    
    setIsResending(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userData.email,
        options: {
          emailRedirectTo: `${window.location.origin}/email-confirmed`
        }
      });
      
      if (error) {
        toast.error("Kunne ikke sende e-post: " + error.message);
      } else {
        toast.success("Bekreftelseslenke sendt!", {
          description: "Sjekk din e-post for bekreftelseslenken."
        });
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast.error("En feil har oppstått. Vennligst prøv igjen.");
    } finally {
      setIsResending(false);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Mail className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <h1 className="mb-4 text-3xl font-bold">Bekreft e-postadressen din</h1>
          
          <p className="mb-8 text-muted-foreground">
            Vi har sendt en bekreftelseslenke til {userData?.email || "din e-post"}.
            Klikk på lenken i e-posten for å verifisere kontoen din og få tilgang til EdPath.
          </p>
          
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleResendEmail}
              disabled={isResending}
            >
              {isResending ? "Sender..." : "Send e-post på nytt"}
            </Button>
            
            <Button 
              variant="link" 
              className="w-full text-muted-foreground"
              onClick={() => navigate("/login")}
            >
              Tilbake til innlogging
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VerificationPending;
