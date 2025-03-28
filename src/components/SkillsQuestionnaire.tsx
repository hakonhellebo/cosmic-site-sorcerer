
import React from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

const SkillsQuestionnaire = ({ form, onPrevious, onSubmit }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Kompetanser og ferdigheter</h2>
        <p className="text-muted-foreground mb-6">Fortell oss om dine styrker og interesser</p>
        
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="university.interests"
            render={() => (
              <FormItem>
                <FormLabel>6. Hvilke fagområder interesserer deg mest i studiet? (Velg opptil 3)</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {['Teknologi', 'Økonomi', 'Samfunnsvitenskap', 'Humaniora', 'Naturvitenskap', 
                   'Helse', 'Kunst og design', 'Ingeniørfag', 'Lærerutdanning', 'Jus'].map((interest) => (
                    <FormField
                      key={interest}
                      control={form.control}
                      name={`university.interests.${interest.toLowerCase()}`}
                      render={({ field }) => {
                        return (
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`interest-${interest.toLowerCase()}`} 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <Label htmlFor={`interest-${interest.toLowerCase()}`}>{interest}</Label>
                          </div>
                        );
                      }}
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
                <FormLabel>7. Hvilke ferdigheter føler du at du har styrke i? (Velg opptil 3)</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {['Kritisk tenkning', 'Problemløsning', 'Kreativitet', 'Kommunikasjon', 
                    'Selvledelse', 'Prosjektstyring', 'Teknologiforståelse', 'Empati'].map((strength) => (
                    <FormField
                      key={strength}
                      control={form.control}
                      name={`university.strengths.${strength.toLowerCase().replace(' ', '_')}`}
                      render={({ field }) => {
                        return (
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`strength-${strength.toLowerCase().replace(' ', '_')}`} 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <Label htmlFor={`strength-${strength.toLowerCase().replace(' ', '_')}`}>{strength}</Label>
                          </div>
                        );
                      }}
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
                <FormLabel>8. Hvilke ferdigheter føler du at du mangler? (Velg opptil 3)</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {['Kritisk tenkning', 'Problemløsning', 'Kreativitet', 'Kommunikasjon', 
                    'Selvledelse', 'Prosjektstyring', 'Teknologiforståelse', 'Empati'].map((weakness) => (
                    <FormField
                      key={weakness}
                      control={form.control}
                      name={`university.weaknesses.${weakness.toLowerCase().replace(' ', '_')}`}
                      render={({ field }) => {
                        return (
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`weakness-${weakness.toLowerCase().replace(' ', '_')}`} 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <Label htmlFor={`weakness-${weakness.toLowerCase().replace(' ', '_')}`}>{weakness}</Label>
                          </div>
                        );
                      }}
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
                <FormLabel>9. Hvordan lærer du best? (Velg opptil 2)</FormLabel>
                <div className="grid grid-cols-1 gap-2">
                  {['Ved å lese', 'Ved å lytte til forelesninger', 'Ved å gjøre praktiske oppgaver', 
                    'Ved å diskutere med andre', 'Ved å se videoer'].map((style) => (
                    <FormField
                      key={style}
                      control={form.control}
                      name={`university.learningStyle.${style.toLowerCase().replace(/ /g, '_')}`}
                      render={({ field }) => {
                        return (
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`style-${style.toLowerCase().replace(/ /g, '_')}`} 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <Label htmlFor={`style-${style.toLowerCase().replace(/ /g, '_')}`}>{style}</Label>
                          </div>
                        );
                      }}
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
                    className="flex flex-col space-y-1"
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
                    className="flex flex-col space-y-1"
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
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevious}
          className="rounded-full"
        >
          Tilbake
        </Button>
        <Button 
          type="button" 
          onClick={onSubmit}
          className="rounded-full"
        >
          Neste
        </Button>
      </div>
    </div>
  );
};

export default SkillsQuestionnaire;
