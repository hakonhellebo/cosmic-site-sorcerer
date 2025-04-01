
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

interface SkillsAndCompetenciesProps {
  form: UseFormReturn<any>;
}

const SkillsAndCompetenciesProps: React.FC<SkillsAndCompetenciesProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">2. Kompetanser og ferdigheter</h2>
      <p className="text-muted-foreground mb-6">Fortell oss om dine faglige styrker og interesser</p>
      
      <FormField
        control={form.control}
        name="university.interests"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel>6. Hvilke fagområder interesserer deg mest i studiet? (Velg opptil 3)</FormLabel>
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
                  name={`university.interests.${value}`}
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
                            const currentValues = form.getValues("university.interests") || {};
                            
                            // Count existing selections
                            const selectedCount = Object.values(currentValues).filter(Boolean).length;
                            
                            // If this is being checked and we already have 3 selections
                            if (checked && selectedCount >= 3) {
                              // Find the first selected option and unselect it
                              const firstSelected = Object.keys(currentValues).find(key => currentValues[key]);
                              if (firstSelected) {
                                form.setValue(`university.interests.${firstSelected}`, false);
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
        name="university.strengths"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel>7. Hvilke ferdigheter føler du at du har styrke i? (Velg opptil 3)</FormLabel>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { label: 'Kritisk tenkning', value: 'kritisk_tenkning' },
                { label: 'Problemløsning', value: 'problemlosning' },
                { label: 'Kreativitet', value: 'kreativitet' },
                { label: 'Kommunikasjon', value: 'kommunikasjon' },
                { label: 'Selvledelse', value: 'selvledelse' },
                { label: 'Prosjektstyring', value: 'prosjektstyring' },
                { label: 'Teknologiforståelse', value: 'teknologiforstaaelse' },
                { label: 'Empati', value: 'empati' }
              ].map(({ label, value }) => (
                <FormField
                  key={value}
                  control={form.control}
                  name={`university.strengths.${value}`}
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
                            const currentValues = form.getValues("university.strengths") || {};
                            
                            // Count existing selections
                            const selectedCount = Object.values(currentValues).filter(Boolean).length;
                            
                            // If this is being checked and we already have 3 selections
                            if (checked && selectedCount >= 3) {
                              // Find the first selected option and unselect it
                              const firstSelected = Object.keys(currentValues).find(key => currentValues[key]);
                              if (firstSelected) {
                                form.setValue(`university.strengths.${firstSelected}`, false);
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
        name="university.weaknesses"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel>8. Hvilke ferdigheter føler du at du mangler? (Velg opptil 3)</FormLabel>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { label: 'Kritisk tenkning', value: 'kritisk_tenkning' },
                { label: 'Problemløsning', value: 'problemlosning' },
                { label: 'Kreativitet', value: 'kreativitet' },
                { label: 'Kommunikasjon', value: 'kommunikasjon' },
                { label: 'Selvledelse', value: 'selvledelse' },
                { label: 'Prosjektstyring', value: 'prosjektstyring' },
                { label: 'Teknologiforståelse', value: 'teknologiforstaaelse' },
                { label: 'Empati', value: 'empati' }
              ].map(({ label, value }) => (
                <FormField
                  key={value}
                  control={form.control}
                  name={`university.weaknesses.${value}`}
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
                            const currentValues = form.getValues("university.weaknesses") || {};
                            
                            // Count existing selections
                            const selectedCount = Object.values(currentValues).filter(Boolean).length;
                            
                            // If this is being checked and we already have 3 selections
                            if (checked && selectedCount >= 3) {
                              // Find the first selected option and unselect it
                              const firstSelected = Object.keys(currentValues).find(key => currentValues[key]);
                              if (firstSelected) {
                                form.setValue(`university.weaknesses.${firstSelected}`, false);
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
        name="university.learningStyle"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel>9. Hvordan lærer du best? (Velg opptil 2)</FormLabel>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: 'Ved å lese', value: 'lesing' },
                { label: 'Ved å lytte til forelesninger', value: 'lytting' },
                { label: 'Ved å gjøre praktiske oppgaver', value: 'praksis' },
                { label: 'Ved å diskutere med andre', value: 'diskusjon' },
                { label: 'Ved å se videoer', value: 'video' }
              ].map(({ label, value }) => (
                <FormField
                  key={value}
                  control={form.control}
                  name={`university.learningStyle.${value}`}
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
                            const currentValues = form.getValues("university.learningStyle") || {};
                            
                            // Count existing selections
                            const selectedCount = Object.values(currentValues).filter(Boolean).length;
                            
                            // If this is being checked and we already have 2 selections
                            if (checked && selectedCount >= 2) {
                              // Find the first selected option and unselect it
                              const firstSelected = Object.keys(currentValues).find(key => currentValues[key]);
                              if (firstSelected) {
                                form.setValue(`university.learningStyle.${firstSelected}`, false);
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
        name="university.collaboration"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>10. Hvor ofte samarbeider du med andre i studiene dine?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="collab-daily" />
                  <Label htmlFor="collab-daily">Daglig</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="collab-weekly" />
                  <Label htmlFor="collab-weekly">Ukentlig</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="collab-monthly" />
                  <Label htmlFor="collab-monthly">Månedlig</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rarely" id="collab-rarely" />
                  <Label htmlFor="collab-rarely">Sjeldnere enn månedlig</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.aiUsage"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>11. Hvor ofte bruker du AI (f.eks. ChatGPT) i skolearbeidet?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="ai-daily" />
                  <Label htmlFor="ai-daily">Daglig</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="ai-weekly" />
                  <Label htmlFor="ai-weekly">Ukentlig</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="ai-monthly" />
                  <Label htmlFor="ai-monthly">Månedlig</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rarely" id="ai-rarely" />
                  <Label htmlFor="ai-rarely">Sjeldnere enn månedlig</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="never" id="ai-never" />
                  <Label htmlFor="ai-never">Aldri</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.internship"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>12. Har du hatt praksis gjennom studiene dine?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-row space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="internship-yes" />
                  <Label htmlFor="internship-yes">Ja</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="internship-no" />
                  <Label htmlFor="internship-no">Nei</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch("university.internship") === "yes" && (
        <FormField
          control={form.control}
          name="university.internshipValue"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>13. Hvis ja – hvor nyttig var det?</FormLabel>
              <FormControl>
                <RadioGroup 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-useful" id="internship-very-useful" />
                    <Label htmlFor="internship-very-useful">Veldig nyttig</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="somewhat-useful" id="internship-somewhat-useful" />
                    <Label htmlFor="internship-somewhat-useful">Litt nyttig</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not-very-useful" id="internship-not-very-useful" />
                    <Label htmlFor="internship-not-very-useful">Ikke særlig nyttig</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not-useful" id="internship-not-useful" />
                    <Label htmlFor="internship-not-useful">Ikke nyttig i det hele tatt</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default SkillsAndCompetenciesProps;
