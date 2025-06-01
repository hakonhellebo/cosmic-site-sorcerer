
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserData } from '@/hooks/useUserProfile';

interface SkillsFormProps {
  userData: UserData;
  onSubmit: (data: UserData['skills']) => void;
  onBack: () => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ userData, onSubmit, onBack }) => {
  const form = useForm({
    defaultValues: userData.skills
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dine ferdigheter og erfaring</CardTitle>
        <CardDescription>Fortell oss mer om dine ferdigheter, sertifiseringer og arbeidserfaring.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
                onClick={onBack}
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
  );
};

export default SkillsForm;
