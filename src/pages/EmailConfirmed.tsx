
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const EmailConfirmed: React.FC = () => {
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Check if the user is authenticated after email verification
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          setVerificationStatus('error');
          return;
        }
        
        if (session?.user) {
          // Update user metadata in localStorage
          const userDataString = localStorage.getItem('userData');
          if (userDataString) {
            const userData = JSON.parse(userDataString);
            userData.isVerified = true;
            localStorage.setItem('userData', JSON.stringify(userData));
          }
          
          // Store the basic user data
          const { user } = session;
          const userMeta = user.user_metadata;
          
          localStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            email: user.email,
            firstName: userMeta.firstName || userMeta.name?.split(' ')[0] || '',
            lastName: userMeta.lastName || 
              (userMeta.name?.split(' ').length > 1 ? userMeta.name?.split(' ').slice(1).join(' ') : ''),
            userType: userMeta.userType || '',
            isVerified: true
          }));
          
          setVerificationStatus('success');
        } else {
          setVerificationStatus('error');
        }
      } catch (error) {
        console.error("Email confirmation error:", error);
        setVerificationStatus('error');
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  const handleContinue = () => {
    // Get user data to determine where to navigate
    const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (userData.userType === 'university') {
      navigate('/university-questionnaire');
    } else if (userData.userType === 'high-school') {
      navigate('/high-school-questionnaire');
    } else if (userData.userType === 'worker') {
      navigate('/worker-questionnaire');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-md text-center">
          {verificationStatus === 'loading' && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader className="h-12 w-12 animate-spin text-primary" />
              <h1 className="text-2xl font-bold">Bekrefter e-postadressen din...</h1>
            </div>
          )}
          
          {verificationStatus === 'success' && (
            <>
              <div className="mb-8 flex justify-center">
                <div className="rounded-full bg-green-100 p-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              
              <h1 className="mb-4 text-3xl font-bold">E-post bekreftet!</h1>
              
              <p className="mb-8 text-muted-foreground">
                E-postadressen din er nå bekreftet. Du har nå full tilgang til EdPath.
              </p>
              
              <Button onClick={handleContinue} className="w-full rounded-full">
                Fortsett til EdPath
              </Button>
            </>
          )}
          
          {verificationStatus === 'error' && (
            <>
              <h1 className="mb-4 text-3xl font-bold text-destructive">Bekreftelse feilet</h1>
              
              <p className="mb-8 text-muted-foreground">
                Det oppstod en feil under bekreftelsen av e-postadressen din. Lenken kan ha utløpt eller være ugyldig.
              </p>
              
              <Button onClick={() => navigate('/login')} className="w-full rounded-full">
                Gå til innlogging
              </Button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EmailConfirmed;
