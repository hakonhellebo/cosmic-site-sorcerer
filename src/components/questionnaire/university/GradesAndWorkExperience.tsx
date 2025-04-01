
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface GradesAndWorkExperienceProps {
  form: UseFormReturn<any>;
}

const GradesAndWorkExperience: React.FC<GradesAndWorkExperienceProps> = ({
  form,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">7. Karakterer og arbeidserfaring</h2>
      <p className="text-muted-foreground mb-6">Fortell oss om dine akademiske prestasjoner og arbeidserfaringer</p>
      
      <FormField
        control={form.control}
        name="university.highSchoolGrades"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>42. Hva var ditt snittkarakter fra videregående?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1-2" id="hs-grades-1-2" />
                  <Label htmlFor="hs-grades-1-2">1–2</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3-4" id="hs-grades-3-4" />
                  <Label htmlFor="hs-grades-3-4">3–4</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5-6" id="hs-grades-5-6" />
                  <Label htmlFor="hs-grades-5-6">5–6</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dont-remember" id="hs-grades-dont-remember" />
                  <Label htmlFor="hs-grades-dont-remember">Jeg husker ikke</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.currentGrades"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>43. Hvordan vil du beskrive karakterene dine i studiet så langt?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="current-grades-high" />
                  <Label htmlFor="current-grades-high">Høyt snitt (A–B)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="good" id="current-grades-good" />
                  <Label htmlFor="current-grades-good">Godt snitt (B–C)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="average" id="current-grades-average" />
                  <Label htmlFor="current-grades-average">Middels (C–D)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="current-grades-low" />
                  <Label htmlFor="current-grades-low">Lavt / strever (E eller lavere)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dont-know" id="current-grades-dont-know" />
                  <Label htmlFor="current-grades-dont-know">Jeg vet ikke ennå</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.bestSubjects"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel>44. Hvilke fag presterer du best i? (Velg opptil 3)</FormLabel>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { label: 'Teknologi', value: 'teknologi' },
                { label: 'Økonomi', value: 'okonomi' },
                { label: 'Samfunnsvitenskap', value: 'samfunnsvitenskap' },
                { label: 'Humaniora', value: 'humaniora' },
                { label: 'Naturvitenskap', value: 'naturvitenskap' },
                { label: 'Helse', value: 'helse' },
                { label: 'Kunst og design', value: 'kunst' },
                { label: 'Ingeniørfag', value: 'ingenior' },
                { label: 'Lærerutdanning', value: 'larer' },
                { label: 'Jus', value: 'jus' }
              ].map(({ label, value }) => (
                <FormField
                  key={value}
                  control={form.control}
                  name={`university.bestSubjects.${value}`}
                  render={({ field }) => (
                    <FormItem
                      key={value}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            // Create a new object for immutability
                            const currentValues = form.getValues("university.bestSubjects") || {};
                            
                            // Count existing selections
                            const selectedCount = Object.values(currentValues).filter(Boolean).length;
                            
                            // If this is being checked and we already have 3 selections
                            if (checked && selectedCount >= 3) {
                              // Find the first selected option and unselect it
                              const firstSelected = Object.keys(currentValues).find(key => currentValues[key]);
                              if (firstSelected) {
                                form.setValue(`university.bestSubjects.${firstSelected}`, false);
                              }
                            }
                            
                            field.onChange(checked);
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          {label}
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.hadJob"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>45. Har du hatt betalt jobb ved siden av studiene?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                className="flex flex-row space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="had-job-yes" />
                  <Label htmlFor="had-job-yes">Ja</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="had-job-no" />
                  <Label htmlFor="had-job-no">Nei</Label>
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

export default GradesAndWorkExperience;
