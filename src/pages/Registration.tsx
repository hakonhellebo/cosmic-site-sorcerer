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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type FormData = {
  name: string;
  email: string;
  education: string;
  terms: boolean;
  userType: 'high-school' | 'university' | 'worker' | '';
};

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'high-school' | 'university' | 'worker' | ''>('');
  
  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      education: '',
      terms: false,
      userType: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    toast.success("Registrering fullført!", {
      description: "Takk for din registrering. Vi vil nå stille deg noen spørsmål."
    });
    
    // Lagre brukerdata i localStorage for å kunne bruke det i spørreskjemaene
    localStorage.setItem('userData', JSON.stringify(data));
    
    // Navigere til riktig spørreskjema basert på brukertypen
    if (data.userType === 'university') {
      navigate('/university-questionnaire');
    } else if (data.userType === 'high-school') {
      navigate('/high-school-questionnaire');
    } else if (data.userType === 'worker') {
      navigate('/worker-questionnaire');
    } else {
      navigate('/dashboard');
    }
  };

  const handleUserTypeChange = (value: 'high-school' | 'university' | 'worker') => {
    setUserType(value);
    form.setValue('userType', value);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-lg">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold">Kom i gang med EdPath</h1>
            <p className="text-muted-foreground">
              Registrer deg for å få personlig karriereveiledning basert på din utdanning og interesser.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Navn</FormLabel>
                    <FormControl>
                      <Input placeholder="Skriv ditt navn" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <div className="space-y-3">
                <FormLabel>Jeg er:</FormLabel>
                <RadioGroup 
                  value={userType} 
                  onValueChange={(value: 'high-school' | 'university' | 'worker') => handleUserTypeChange(value)}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {[
                    { id: 'high-school', label: 'Videregående elev', value: 'high-school' },
                    { id: 'university', label: 'Bachelor/Master student', value: 'university' },
                    { id: 'worker', label: 'Yrkesaktiv', value: 'worker' }
                  ].map((option) => (
                    <div 
                      key={option.id}
                      className={`p-4 border rounded-md cursor-pointer transition-all ${userType === option.value ? 'border-primary bg-primary/5' : 'hover:bg-secondary/50'}`}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={option.value} 
                          id={option.id}
                        />
                        <Label htmlFor={option.id} className="cursor-pointer">{option.label}</Label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {userType && (
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Utdanning</FormLabel>
                      <FormControl>
                        <Input placeholder="F.eks. Bachelor i Informatikk, NTNU" required {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        required
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Jeg godtar vilkårene og betingelsene for bruk av tjenesten
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full rounded-full">
                Registrer deg
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default Registration;
