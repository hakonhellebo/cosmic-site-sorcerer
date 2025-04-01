
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

interface PersonalInfoProps {
  form: UseFormReturn<any>;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">1. Personlige opplysninger</h2>
      <p className="text-muted-foreground mb-6">Vi vil gjerne bli bedre kjent med din bakgrunn</p>
      
      <FormField
        control={form.control}
        name="university.studyField"
        render={({ field }) => (
          <FormItem>
            <FormLabel>1. Hva studerer du?</FormLabel>
            <FormControl>
              <Input placeholder="F.eks. Informatikk, Økonomi, etc." {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.institution"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>2. Hvilket studiested går du på?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Universitetet i Oslo" id="institution-uio" />
                  <Label htmlFor="institution-uio">Universitetet i Oslo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="NTNU" id="institution-ntnu" />
                  <Label htmlFor="institution-ntnu">NTNU</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Universitetet i Bergen" id="institution-uib" />
                  <Label htmlFor="institution-uib">Universitetet i Bergen</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="BI" id="institution-bi" />
                  <Label htmlFor="institution-bi">BI</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="NHH" id="institution-nhh" />
                  <Label htmlFor="institution-nhh">NHH</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Høgskolen i Innlandet" id="institution-hinn" />
                  <Label htmlFor="institution-hinn">Høgskolen i Innlandet</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="institution-other" />
                  <Label htmlFor="institution-other">Andre</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch("university.institution") === "other" && (
        <FormField
          control={form.control}
          name="university.otherInstitution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spesifiser ditt studiested</FormLabel>
              <FormControl>
                <Input placeholder="Navn på studiested" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="university.level"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>3. Hvilket nivå er du på i studiet?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bachelor-1" id="level-bachelor-1" />
                  <Label htmlFor="level-bachelor-1">Bachelor, år 1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bachelor-2" id="level-bachelor-2" />
                  <Label htmlFor="level-bachelor-2">Bachelor, år 2</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bachelor-3" id="level-bachelor-3" />
                  <Label htmlFor="level-bachelor-3">Bachelor, år 3</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="master-1" id="level-master-1" />
                  <Label htmlFor="level-master-1">Master, år 1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="master-2" id="level-master-2" />
                  <Label htmlFor="level-master-2">Master, år 2</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phd" id="level-phd" />
                  <Label htmlFor="level-phd">PhD</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="enkeltemner" id="level-enkeltemner" />
                  <Label htmlFor="level-enkeltemner">Jeg tar enkeltemner</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.changedField"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>4. Har du byttet studieretning underveis?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-row space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="changed-yes" />
                  <Label htmlFor="changed-yes">Ja</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="changed-no" />
                  <Label htmlFor="changed-no">Nei</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.certaintylevel"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>5. Hvor sikker er du på at du har valgt riktig studie?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="very-certain" id="certainty-very" />
                  <Label htmlFor="certainty-very">Veldig sikker</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quite-certain" id="certainty-quite" />
                  <Label htmlFor="certainty-quite">Ganske sikker</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bit-uncertain" id="certainty-bit" />
                  <Label htmlFor="certainty-bit">Litt usikker</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="very-uncertain" id="certainty-not" />
                  <Label htmlFor="certainty-not">Helt usikker</Label>
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

export default PersonalInfo;
