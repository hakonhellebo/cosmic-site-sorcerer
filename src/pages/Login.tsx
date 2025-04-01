
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from '@/lib/supabase';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const { error } = await signInWithGoogle();
      
      if (error) {
        toast.error(`Innlogging feilet: ${error.message}`);
      }
      // No need to navigate here as the OAuth redirect will handle that
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("En feil har oppstått. Vennligst prøv igjen.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold">Logg inn på EdPath</h1>
            <p className="text-muted-foreground">
              Velkommen! Logg inn med Google for å se din profilanalyse.
            </p>
          </div>

          <div className="space-y-6">
            <Button 
              type="button" 
              onClick={handleGoogleSignIn} 
              className="w-full rounded-full flex items-center justify-center gap-2" 
              disabled={isLoading}
            >
              {isLoading ? (
                "Logger inn..."
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path fill="#4285F4" fillRule="evenodd" d="M20.64 12.2045C20.64 11.566 20.5827 10.9502 20.4764 10.3545H12V13.4455H16.8436C16.635 14.7364 15.9009 15.8118 14.7436 16.5273V18.8363H17.6564C19.4582 17.1409 20.64 14.9045 20.64 12.2045Z" clipRule="evenodd"/>
                    <path fill="#34A853" fillRule="evenodd" d="M12 21C14.43 21 16.4673 20.1941 17.6564 18.8364L14.7436 16.5273C13.9673 17.0364 13.0118 17.3364 12 17.3364C9.39545 17.3364 7.19091 15.6027 6.40455 13.2H3.38182V15.5727C4.56364 18.69 8.05909 21 12 21Z" clipRule="evenodd"/>
                    <path fill="#FBBC05" fillRule="evenodd" d="M6.40455 13.1999C6.20455 12.5999 6.09091 11.9599 6.09091 11.2999C6.09091 10.6399 6.20455 9.99994 6.40455 9.39994V7.02722H3.38182C2.70455 8.27267 2.3 9.69767 2.3 11.2999C2.3 12.9022 2.70455 14.3272 3.38182 15.5727L6.40455 13.1999Z" clipRule="evenodd"/>
                    <path fill="#EA4335" fillRule="evenodd" d="M12 6.06363C13.3082 6.06363 14.4891 6.49999 15.4018 7.36817L18 4.76999C16.4673 3.35454 14.4282 2.49999 12 2.49999C8.05909 2.49999 4.56364 4.80999 3.38182 7.92726L6.40455 10.2999C7.19091 7.89726 9.39545 6.06363 12 6.06363Z" clipRule="evenodd"/>
                  </svg>
                  Logg inn med Google
                </>
              )}
            </Button>
            
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                Har du ikke en bruker? {" "}
                <button 
                  type="button" 
                  className="text-primary font-medium hover:underline"
                  onClick={() => navigate("/registrer")}
                >
                  Registrer deg her
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
