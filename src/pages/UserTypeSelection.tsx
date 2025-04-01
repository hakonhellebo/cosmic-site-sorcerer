
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookOpen, Briefcase } from "lucide-react";

const UserTypeSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleSelection = (userType: string) => {
    // Save user type to localStorage for potential future use
    localStorage.setItem('userType', userType);
    
    // Navigate to the appropriate questionnaire
    switch(userType) {
      case 'high-school':
        navigate('/high-school-questionnaire');
        break;
      case 'university':
        navigate('/university-questionnaire');
        break;
      case 'worker':
        navigate('/worker-questionnaire');
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold">Hva beskriver deg best?</h1>
            <p className="text-muted-foreground">
              Velg din nåværende situasjon for å få tilpasset veiledning
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
              <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
                <BookOpen className="mb-4 h-12 w-12 text-primary" />
                <h2 className="mb-2 text-xl font-semibold">Elev</h2>
                <p className="mb-4 text-sm text-muted-foreground">For elever i videregående skole</p>
                <Button 
                  className="mt-auto w-full" 
                  onClick={() => handleSelection('high-school')}
                >
                  Velg
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
              <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
                <GraduationCap className="mb-4 h-12 w-12 text-primary" />
                <h2 className="mb-2 text-xl font-semibold">Student</h2>
                <p className="mb-4 text-sm text-muted-foreground">For studenter ved universitet eller høyskole</p>
                <Button 
                  className="mt-auto w-full" 
                  onClick={() => handleSelection('university')}
                >
                  Velg
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
              <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
                <Briefcase className="mb-4 h-12 w-12 text-primary" />
                <h2 className="mb-2 text-xl font-semibold">Yrkesaktiv</h2>
                <p className="mb-4 text-sm text-muted-foreground">For deg som er i jobb eller søker arbeid</p>
                <Button 
                  className="mt-auto w-full" 
                  onClick={() => handleSelection('worker')}
                >
                  Velg
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserTypeSelection;
