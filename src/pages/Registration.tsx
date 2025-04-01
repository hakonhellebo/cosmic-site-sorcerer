
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
import { Eye, EyeOff } from "lucide-react";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
  userType: 'high-school' | 'university' | 'worker' | '';
};

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'high-school' | 'university' | 'worker' | ''>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
      userType: '',
    },
  });

  const onSubmit = (data: FormData) => {
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      toast.error("Passordene samsvarer ikke");
      return;
    }

    console.log(data);
    
    // Save user data in localStorage with password for authentication
    const users = JSON.parse(localStorage.getItem('edpath_users') || '[]');
    const existingUser = users.find((user: any) => user.email === data.email);
    
    if (existingUser) {
      toast.error("En bruker med denne e-postadressen eksisterer allerede");
      return;
    }
    
    // Create the new user with firstName derived from name
    const nameParts = data.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    
    const newUser = {
      id: Date.now().toString(),
      email: data.email,
      password: data.password, // In a real app, this should be hashed
      firstName,
      lastName,
      userType: data.userType,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    localStorage.setItem('edpath_users', JSON.stringify(users));
    
    // Store current user session
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Create basic userData for questionnaires
    const userData = {
      email: data.email,
      firstName,
      lastName,
      userType: data.userType,
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    
    toast.success("Registrering fullført!", {
      description: "Takk for din registrering. Vi vil nå stille deg noen spørsmål."
    });
    
    // Navigate to the appropriate questionnaire based on user type
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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
                          placeholder="Velg et passord" 
                          required
                          minLength={6}
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bekreft passord</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showConfirmPassword ? "text" : "password"} 
                          placeholder="Gjenta passord" 
                          required
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2"
                          onClick={toggleShowConfirmPassword}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
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
