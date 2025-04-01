
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PreferencesAndWorkStyleProps {
  form: UseFormReturn<any>;
}

const PreferencesAndWorkStyle: React.FC<PreferencesAndWorkStyleProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">6. Personlige preferanser og arbeidsstil</h2>
      <p className="text-muted-foreground mb-6">Fortell oss om hvordan du liker å jobbe</p>
      
      <FormField
        control={form.control}
        name="university.peopleTech"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>31. Er du mest motivert av å jobbe med mennesker eller teknologi?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="people" id="people-tech-people" />
                  <Label htmlFor="people-tech-people">Mennesker</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tech" id="people-tech-tech" />
                  <Label htmlFor="people-tech-tech">Teknologi</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="people-tech-both" />
                  <Label htmlFor="people-tech-both">Begge</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="people-tech-none" />
                  <Label htmlFor="people-tech-none">Ingen av delene</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.projectPreference"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>32. Foretrekker du å jobbe med korte eller langsiktige prosjekter?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="short" id="project-short" />
                  <Label htmlFor="project-short">Korte prosjekter</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="long" id="project-long" />
                  <Label htmlFor="project-long">Langsiktige prosjekter</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="combination" id="project-combination" />
                  <Label htmlFor="project-combination">En kombinasjon</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.uncertaintyReaction"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>33. Hvordan reagerer du på usikkerhet på arbeidsplassen?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="enjoy" id="uncertainty-enjoy" />
                  <Label htmlFor="uncertainty-enjoy">Trives med det</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="handle" id="uncertainty-handle" />
                  <Label htmlFor="uncertainty-handle">Håndterer det greit</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="challenging" id="uncertainty-challenging" />
                  <Label htmlFor="uncertainty-challenging">Synes det er utfordrende</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dislike" id="uncertainty-dislike" />
                  <Label htmlFor="uncertainty-dislike">Misliker det sterkt</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.careerPathImportance"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>34. Hvor viktig er det for deg å ha en klar karrierevei?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="very" id="career-path-very" />
                  <Label htmlFor="career-path-very">Veldig viktig</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="somewhat" id="career-path-somewhat" />
                  <Label htmlFor="career-path-somewhat">Litt viktig</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-really" id="career-path-not-really" />
                  <Label htmlFor="career-path-not-really">Ikke så viktig</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-at-all" id="career-path-not-at-all" />
                  <Label htmlFor="career-path-not-at-all">Ikke viktig i det hele tatt</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.dreamJob"
        render={({ field }) => (
          <FormItem>
            <FormLabel>35. Hvis du kunne velge én jobb akkurat nå – hva ville det vært?</FormLabel>
            <FormControl>
              <Input placeholder="Din drømmejobb" {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.preferredWorkEnvironment"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>30. Hvilke arbeidsmiljøer trives du best i?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="structured" id="environment-structured" />
                  <Label htmlFor="environment-structured">Strukturerte og organiserte</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flexible" id="environment-flexible" />
                  <Label htmlFor="environment-flexible">Fleksible og kreative</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="social" id="environment-social" />
                  <Label htmlFor="environment-social">Sosiale og team-orienterte</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="independent" id="environment-independent" />
                  <Label htmlFor="environment-independent">Uavhengige og selvstyrte</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PreferencesAndWorkStyle;
