
import React from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const UniversityQuestionnaire = ({ form, onSubmit }) => {
  return (
    <div className="space-y-8">
      <div>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="university.studyField"
            render={({ field }) => (
              <FormItem>
                <FormLabel>1. Hva studerer du?</FormLabel>
                <FormControl>
                  <Input placeholder="F.eks. Informatikk, Økonomi, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="university.institution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>2. Hvilket studiested går du på?</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Velg studiested" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="uio">Universitetet i Oslo</SelectItem>
                    <SelectItem value="ntnu">NTNU</SelectItem>
                    <SelectItem value="uib">Universitetet i Bergen</SelectItem>
                    <SelectItem value="bi">BI</SelectItem>
                    <SelectItem value="nhh">NHH</SelectItem>
                    <SelectItem value="hinn">Høgskolen i Innlandet</SelectItem>
                    <SelectItem value="other">Andre</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="university.level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>3. Hvilket nivå er du på i studiet?</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Velg nivå" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="bachelor1">Bachelor, år 1</SelectItem>
                    <SelectItem value="bachelor2">Bachelor, år 2</SelectItem>
                    <SelectItem value="bachelor3">Bachelor, år 3</SelectItem>
                    <SelectItem value="master1">Master, år 1</SelectItem>
                    <SelectItem value="master2">Master, år 2</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="single">Jeg tar enkeltemner</SelectItem>
                  </SelectContent>
                </Select>
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
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="very" id="certainty-very" />
                      <Label htmlFor="certainty-very">Veldig sikker</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="quite" id="certainty-quite" />
                      <Label htmlFor="certainty-quite">Ganske sikker</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="little" id="certainty-little" />
                      <Label htmlFor="certainty-little">Litt usikker</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not" id="certainty-not" />
                      <Label htmlFor="certainty-not">Helt usikker</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="button" onClick={onSubmit} className="rounded-full">
          Neste
        </Button>
      </div>
    </div>
  );
};

export default UniversityQuestionnaire;
