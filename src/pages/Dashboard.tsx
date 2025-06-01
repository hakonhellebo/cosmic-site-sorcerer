
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useForm } from "react-hook-form";
import { getCurrentUser } from '@/lib/supabase';

// Define the steps for the data collection process
type Step = 'education' | 'career' | 'skills' | 'results' | 'dashboard';

const Dashboard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('education');
  const [progress, setProgress] = useState(33);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [userData, setUserData] = useState({
    education: {
      degree: '',
      fieldOfStudy: '',
      institution: '',
      graduationYear: '',
    },
    career: {
      interests: [] as string[],
      workEnvironment: '',
      salaryRange: [500000],
    },
    skills: {
      keySkills: '',
      certifications: '',
      workExperience: '',
    }
  });
  
  const navigate = useNavigate();

  // Check if user has completed profile on component mount
  useEffect(() => {
    checkUserProfile();
  }, []);

  const checkUserProfile = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        // Check localStorage for saved profile data
        const savedProfile = localStorage.getItem(`userProfile_${user.id}`);
        if (savedProfile) {
          const profileData = JSON.parse(savedProfile);
          setUserData(profileData);
          setIsProfileComplete(true);
          setCurrentStep('dashboard');
        }
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
    }
  };

  const saveUserProfile = async (profileData: any) => {
    try {
      const user = await getCurrentUser();
      if (user) {
        localStorage.setItem(`userProfile_${user.id}`, JSON.stringify(profileData));
        console.log('Profile saved for user:', user.id);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  // Education form
  const educationForm = useForm({
    defaultValues: userData.education
  });

  // Career form
  const careerForm = useForm({
    defaultValues: {
      ...userData.career,
      interests: userData.career.interests,
      workEnvironment: userData.career.workEnvironment,
    }
  });

  // Skills form
  const skillsForm = useForm({
    defaultValues: userData.skills
  });

  const careerInterests = [
    { id: "technology", label: "Teknologi" },
    { id: "finance", label: "Finans" },
    { id: "marketing", label: "Markedsføring" },
    { id: "healthcare", label: "Helsevesen" },
    { id: "education", label: "Utdanning" },
    { id: "engineering", label: "Ingeniørfag" },
  ];

  const handleEducationSubmit = async (data: any) => {
    const updatedUserData = {
      ...userData,
      education: data
    };
    setUserData(updatedUserData);
    await saveUserProfile(updatedUserData);
    setCurrentStep('career');
    setProgress(66);
    toast.success("Utdanningsinformasjon lagret!");
  };

  const handleCareerSubmit = async (data: any) => {
    const updatedUserData = {
      ...userData,
      career: {
        ...data,
        interests: Array.isArray(data.interests) ? data.interests : [],
        salaryRange: userData.career.salaryRange,
      }
    };
    setUserData(updatedUserData);
    await saveUserProfile(updatedUserData);
    setCurrentStep('skills');
    setProgress(100);
    toast.success("Karrierepreferanser lagret!");
  };

  const handleSkillsSubmit = async (data: any) => {
    const updatedUserData = {
      ...userData,
      skills: data
    };
    setUserData(updatedUserData);
    await saveUserProfile(updatedUserData);
    setCurrentStep('results');
    setIsProfileComplete(true);
    toast.success("Profil fullført!");
  };

  const formatSalary = (value: number) => {
    return `${value.toLocaleString('no-NO')} NOK`;
  };

  const getRecommendedCareers = () => {
    // This would normally be based on actual data analysis
    // For now, we're just providing examples based on field of study
    const field = userData.education.fieldOfStudy.toLowerCase();
    
    if (field.includes('data') || field.includes('informatikk') || field.includes('programmering')) {
      return [
        { title: 'Data Scientist', description: 'Analyserer store datasett for å finne mønstre og innsikt.' },
        { title: 'Programvareutvikler', description: 'Utvikler applikasjoner og systemer.' },
        { title: 'IT-konsulent', description: 'Gir teknisk rådgivning til bedrifter.' }
      ];
    } else if (field.includes('økonomi') || field.includes('business')) {
      return [
        { title: 'Finansanalytiker', description: 'Analyserer finansielle data og gir investeringsråd.' },
        { title: 'Prosjektleder', description: 'Leder komplekse prosjekter på tvers av team.' },
        { title: 'Forretningsutvikler', description: 'Identifiserer nye forretningsmuligheter.' }
      ];
    } else {
      return [
        { title: 'Prosjektkoordinator', description: 'Koordinerer prosjekter og ressurser.' },
        { title: 'Forskningsassistent', description: 'Støtter vitenskapelig forskning innen ditt felt.' },
        { title: 'Konsulent', description: 'Gir ekspertråd innen ditt spesialfelt.' }
      ];
    }
  };

  const resetProfile = () => {
    setCurrentStep('education');
    setProgress(33);
    setIsProfileComplete(false);
    setUserData({
      education: {
        degree: '',
        fieldOfStudy: '',
        institution: '',
        graduationYear: '',
      },
      career: {
        interests: [],
        workEnvironment: '',
        salaryRange: [500000],
      },
      skills: {
        keySkills: '',
        certifications: '',
        workExperience: '',
      }
    });
  };

  // Dashboard view when profile is complete
  if (currentStep === 'dashboard' && isProfileComplete) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold">Velkommen tilbake til EdPath!</h1>
              <p className="text-muted-foreground">
                Din personlige karriereprofil er ferdig. Her er en oversikt over dine data og anbefalinger.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* User Profile Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Din profil</CardTitle>
                  <CardDescription>Oversikt over informasjonen du har oppgitt</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium">Utdanning</h4>
                    <p className="text-sm text-muted-foreground">
                      {userData.education.degree} i {userData.education.fieldOfStudy}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {userData.education.institution} ({userData.education.graduationYear})
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Karriereinteresser</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {userData.career.interests.map((interest, index) => (
                        <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                          {careerInterests.find(ci => ci.id === interest)?.label || interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium">Arbeidsmiljø</h4>
                    <p className="text-sm text-muted-foreground">
                      {userData.career.workEnvironment === 'remote' && 'Fjernarbeid'}
                      {userData.career.workEnvironment === 'office' && 'Kontorbasert'}
                      {userData.career.workEnvironment === 'hybrid' && 'Hybrid'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium">Ønsket lønn</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatSalary(userData.career.salaryRange[0])}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium">Nøkkelferdigheter</h4>
                    <p className="text-sm text-muted-foreground">
                      {userData.skills.keySkills || 'Ikke spesifisert'}
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={resetProfile} className="w-full">
                    Oppdater profil
                  </Button>
                </CardFooter>
              </Card>

              {/* Career Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Dine karriereanbefalinger</CardTitle>
                  <CardDescription>Basert på din profil</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getRecommendedCareers().map((career, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h4 className="font-medium">{career.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {career.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => navigate('/statistikk')}>
                    Utforsk karrierestatistikk
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Hurtighandlinger</CardTitle>
                <CardDescription>Utforsk mer av EdPath</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Button variant="outline" onClick={() => navigate('/statistikk')}>
                    📊 Karrierestatistikk
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/user-type-selection')}>
                    📝 Ta ny spørreundersøkelse
                  </Button>
                  <Button variant="outline" onClick={resetProfile}>
                    ⚙️ Oppdater profil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          {/* Header with progress bar */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold">Velkommen til EdPath!</h1>
            <p className="mb-6 text-muted-foreground">
              Fortell oss litt mer om deg selv så vi kan gi deg skreddersydde karriereråd.
            </p>
            {currentStep !== 'results' && (
              <div className="mb-4">
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div 
                    className="h-2 rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {currentStep === 'education' && "Steg 1 av 3: Fortell oss om din utdanning"}
                  {currentStep === 'career' && "Steg 2 av 3: Velg dine karriereinteresser"}
                  {currentStep === 'skills' && "Steg 3 av 3: Fullfør profilen"}
                </p>
              </div>
            )}
          </div>

          {/* Education Step */}
          {currentStep === 'education' && (
            <Card>
              <CardHeader>
                <CardTitle>Din utdanning</CardTitle>
                <CardDescription>Fortell oss om din utdanningsbakgrunn</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...educationForm}>
                  <form onSubmit={educationForm.handleSubmit(handleEducationSubmit)} className="space-y-6">
                    <FormField
                      control={educationForm.control}
                      name="degree"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grad</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="bachelor" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Bachelor
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="master" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Master
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="phd" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  PhD
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="other" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Annet
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={educationForm.control}
                      name="fieldOfStudy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Studiefelt</FormLabel>
                          <FormControl>
                            <Input placeholder="F.eks. Informatikk, Business, Psykologi" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={educationForm.control}
                      name="institution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institusjon</FormLabel>
                          <FormControl>
                            <Input placeholder="F.eks. Universitetet i Oslo, NTNU" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={educationForm.control}
                      name="graduationYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Uteksamineringsår</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="F.eks. 2024" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button type="submit" className="rounded-full">
                        Lagre og fortsett
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Career Interests Step */}
          {currentStep === 'career' && (
            <Card>
              <CardHeader>
                <CardTitle>Dine karriereambisjoner</CardTitle>
                <CardDescription>Velg bransjer eller roller du er interessert i for å motta mer målrettede karriereforslag.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...careerForm}>
                  <form onSubmit={careerForm.handleSubmit(handleCareerSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormLabel>Karriereområder av interesse</FormLabel>
                      <div className="grid grid-cols-2 gap-4">
                        {careerInterests.map((interest) => (
                          <FormField
                            key={interest.id}
                            control={careerForm.control}
                            name="interests"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={interest.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(interest.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, interest.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== interest.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {interest.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <FormField
                      control={careerForm.control}
                      name="workEnvironment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Foretrukket arbeidsmiljø</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="remote" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Fjernarbeid
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="office" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Kontorbasert
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="hybrid" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Hybrid
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FormLabel>Ønsket lønnsområde</FormLabel>
                      <div className="mt-2 px-2">
                        <Slider
                          defaultValue={userData.career.salaryRange}
                          max={1500000}
                          min={300000}
                          step={50000}
                          onValueChange={(value) => {
                            setUserData(prev => ({
                              ...prev,
                              career: {
                                ...prev.career,
                                salaryRange: value
                              }
                            }));
                          }}
                        />
                        <p className="mt-2 text-center text-muted-foreground">
                          {formatSalary(userData.career.salaryRange[0])}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="rounded-full"
                        onClick={() => {
                          setCurrentStep('education');
                          setProgress(33);
                        }}
                      >
                        Tilbake
                      </Button>
                      <Button type="submit" className="rounded-full">
                        Lagre og fortsett
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Skills Step */}
          {currentStep === 'skills' && (
            <Card>
              <CardHeader>
                <CardTitle>Dine ferdigheter og erfaring</CardTitle>
                <CardDescription>Fortell oss mer om dine ferdigheter, sertifiseringer og arbeidserfaring.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...skillsForm}>
                  <form onSubmit={skillsForm.handleSubmit(handleSkillsSubmit)} className="space-y-6">
                    <FormField
                      control={skillsForm.control}
                      name="keySkills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nøkkelferdigheter</FormLabel>
                          <FormControl>
                            <Input placeholder="F.eks. Python, Dataanalyse, Markedsføring, Grafisk design" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={skillsForm.control}
                      name="certifications"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sertifiseringer</FormLabel>
                          <FormControl>
                            <Input placeholder="F.eks. Google Analytics, AWS, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={skillsForm.control}
                      name="workExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Arbeidserfaring (valgfritt)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Beskriv relevant arbeidserfaring" 
                              className="min-h-[150px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="rounded-full"
                        onClick={() => {
                          setCurrentStep('career');
                          setProgress(66);
                        }}
                      >
                        Tilbake
                      </Button>
                      <Button type="submit" className="rounded-full">
                        Lagre og fullfør
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Results Step */}
          {currentStep === 'results' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Takk! Din profil er nå opprettet</CardTitle>
                  <CardDescription>
                    Vi har lagret informasjonen din og du kan nå utforske dine personlige karriereanbefalinger på dashbordet.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-6xl">🎉</div>
                    <p className="text-lg">Din profil er nå ferdig!</p>
                    <p className="text-muted-foreground">
                      Du finner alle dine anbefalinger og kan oppdatere profilen din på dashbordet.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button 
                    className="rounded-full" 
                    onClick={() => {
                      setCurrentStep('dashboard');
                      toast.success("Velkommen til ditt personlige dashboard!");
                    }}
                  >
                    Gå til mitt dashboard
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
