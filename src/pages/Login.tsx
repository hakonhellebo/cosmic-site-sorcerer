
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from '@/lib/supabase';

type LoginFormData = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (error) {
        toast.error("Innlogging feilet: " + error.message);
        return;
      }
      
      if (!authData.user) {
        toast.error("Kunne ikke hente brukerdata");
        return;
      }
      
      const { user } = authData;
      
      // Store user session in localStorage
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
      
      // Store additional user data for the application
      localStorage.setItem('userData', JSON.stringify({
        email: user.email,
        firstName: userMeta.firstName || userMeta.name?.split(' ')[0] || '',
        lastName: userMeta.lastName || 
          (userMeta.name?.split(' ').length > 1 ? userMeta.name?.split(' ').slice(1).join(' ') : ''),
        userType: userMeta.userType || '',
        isVerified: true
      }));
      
      toast.success("Innlogging vellykket!");
      
      // Retrieve user's full data if available
      const userFullData = localStorage.getItem(`userFullData_${user.id}`);
      
      if (userFullData) {
        localStorage.setItem('userFullData', userFullData);
        // Navigate to results if user has completed questionnaires
        navigate('/results');
      } else {
        // Navigate based on user type if no questionnaire data is found
        if (userMeta.userType === 'university') {
          navigate('/university-questionnaire');
        } else if (userMeta.userType === 'high-school') {
          navigate('/high-school-questionnaire');
        } else if (userMeta.userType === 'worker') {
          navigate('/worker-questionnaire');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("En feil har oppstått. Vennligst prøv igjen.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold">Logg inn på EdPath</h1>
            <p className="text-muted-foreground">
              Velkommen tilbake! Logg inn for å se din profilanalyse.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-post</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="din.epost@example.com" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passord</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Ditt passord" 
                          required 
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2"
                          onClick={toggleShowPassword}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
                {isLoading ? "Logger inn..." : "Logg inn"}
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
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
