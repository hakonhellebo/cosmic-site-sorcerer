
import React from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { UserData } from '@/hooks/useUserProfile';

interface CareerFormProps {
  userData: UserData;
  onSubmit: (data: UserData['career']) => void;
  onBack: () => void;
  setUserData: (userData: UserData) => void;
}

const careerInterests = [
  { id: "technology", label: "Teknologi" },
  { id: "finance", label: "Finans" },
  { id: "marketing", label: "Markedsføring" },
  { id: "healthcare", label: "Helsevesen" },
  { id: "education", label: "Utdanning" },
  { id: "engineering", label: "Ingeniørfag" },
];

const CareerForm: React.FC<CareerFormProps> = ({ userData, onSubmit, onBack, setUserData }) => {
  const form = useForm({
    defaultValues: {
      ...userData.career,
      interests: userData.career.interests,
      workEnvironment: userData.career.workEnvironment,
    }
  });

  const formatSalary = (value: number) => {
    return `${value.toLocaleString('no-NO')} NOK`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dine karriereambisjoner</CardTitle>
        <CardDescription>Velg bransjer eller roller du er interessert i for å motta mer målrettede karriereforslag.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormLabel>Karriereområder av interesse</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                {careerInterests.map((interest) => (
                  <FormField
                    key={interest.id}
                    control={form.control}
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
              control={form.control}
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
                    setUserData({
                      ...userData,
                      career: {
                        ...userData.career,
                        salaryRange: value
                      }
                    });
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
                onClick={onBack}
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
  );
};

export default CareerForm;
