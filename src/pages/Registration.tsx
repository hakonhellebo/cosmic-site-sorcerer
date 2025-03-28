
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

type FormData = {
  name: string;
  email: string;
  education: string;
  interests: string;
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
      interests: '',
      terms: false,
      userType: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    toast.success("Registrering fullført!", {
      description: "Takk for din registrering. Vi vil kontakte deg snart."
    });
    form.reset();
    
    // Redirect to dashboard after successful registration
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    className={`p-4 border rounded-md cursor-pointer transition-all ${userType === 'high-school' ? 'border-primary bg-primary/5' : 'hover:bg-secondary/50'}`}
                    onClick={() => handleUserTypeChange('high-school')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="high-school" 
                        id="high-school"
                        checked={userType === 'high-school'}
                      />
                      <Label htmlFor="high-school" className="cursor-pointer">Videregående elev</Label>
                    </div>
                  </div>
                  
                  <div 
                    className={`p-4 border rounded-md cursor-pointer transition-all ${userType === 'university' ? 'border-primary bg-primary/5' : 'hover:bg-secondary/50'}`}
                    onClick={() => handleUserTypeChange('university')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="university" 
                        id="university"
                        checked={userType === 'university'}
                      />
                      <Label htmlFor="university" className="cursor-pointer">Bachelor/Master student</Label>
                    </div>
                  </div>

                  <div 
                    className={`p-4 border rounded-md cursor-pointer transition-all ${userType === 'worker' ? 'border-primary bg-primary/5' : 'hover:bg-secondary/50'}`}
                    onClick={() => handleUserTypeChange('worker')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="worker" 
                        id="worker"
                        checked={userType === 'worker'}
                      />
                      <Label htmlFor="worker" className="cursor-pointer">Yrkesaktiv</Label>
                    </div>
                  </div>
                </div>
              </div>

              {userType && (
                <>
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

                  <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Karriereinteresser (valgfritt)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Fortell oss om dine karriereinteresser og mål"
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
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
