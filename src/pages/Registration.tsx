
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUpWithEmail } from '@/lib/supabase';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const registrationSchema = z.object({
  email: z.string().email("Skriv inn en gyldig e-postadresse"),
  password: z.string().min(6, "Passordet må være minst 6 tegn"),
  confirmPassword: z.string().min(6, "Bekreft passordet")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passordene samsvarer ikke",
  path: ["confirmPassword"],
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (values: RegistrationFormValues) => {
    try {
      setIsLoading(true);
      const { data, error } = await signUpWithEmail(values.email, values.password);
      
      if (error) {
        toast.error(`Registrering feilet: ${error.message}`);
        return;
      }

      if (data.user) {
        toast.success("Du er nå registrert og logget inn");
        // Redirect to user type selection instead of dashboard
        navigate('/user-type-selection');
      }
    } catch (error: any) {
      console.error("Registration error:", error);
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
            <h1 className="mb-2 text-3xl font-bold">Kom i gang med EdPath</h1>
            <p className="text-muted-foreground">
              Registrer deg for å få personlig karriereveiledning basert på din utdanning og interesser.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-post</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="deg@eksempel.no" 
                        {...field} 
                      />
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
                      <Input 
                        type="password" 
                        placeholder="••••••" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bekreft passord</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Registrerer..." : "Registrer deg"}
              </Button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Har du allerede en bruker? {" "}
                  <button 
                    type="button" 
                    className="text-primary font-medium hover:underline"
                    onClick={() => navigate("/login")}
                  >
                    Logg inn her
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

export default Registration;
