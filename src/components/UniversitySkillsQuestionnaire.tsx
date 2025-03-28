
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const UniversitySkillsQuestionnaire = ({ form, onNext, onPrev }) => {
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
                <div className="mb-4">
                  <FormLabel>6. Hvilke fagfelt interesserer deg mest? (Velg opptil 3)</FormLabel>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Teknologi', 
                    'Økonomi', 
                    'Samfunnsvitenskap', 
                    'Humaniora', 
                    'Naturvitenskap',
                    'Helse',
                    'Kunst og design',
                    'Ingeniørfag',
                    'Lærerutdanning',
                    'Jus'
                  ].map((subject) => (
                    <FormField
                      key={subject}
                      control={form.control}
                      name={`university.interests.${subject.toLowerCase().replace(/\s+/g, '_')}`}
                      render={({ field }) => (
                        <FormItem
                          key={subject}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              {subject}
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
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Kritisk tenkning',
                    'Problemløsning',
                    'Kreativitet',
                    'Kommunikasjon',
                    'Selvledelse',
                    'Prosjektstyring',
                    'Teknologiforståelse',
                    'Empati'
                  ].map((strength) => (
                    <FormField
                      key={strength}
                      control={form.control}
                      name={`university.strengths.${strength.toLowerCase().replace(/\s+/g, '_')}`}
                      render={({ field }) => (
                        <FormItem
                          key={strength}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              {strength}
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
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Kritisk tenkning',
                    'Problemløsning',
                    'Kreativitet',
                    'Kommunikasjon',
                    'Selvledelse',
                    'Prosjektstyring',
                    'Teknologiforståelse',
                    'Empati'
                  ].map((weakness) => (
                    <FormField
                      key={weakness}
                      control={form.control}
                      name={`university.weaknesses.${weakness.toLowerCase().replace(/\s+/g, '_')}`}
                      render={({ field }) => (
                        <FormItem
                          key={weakness}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              {weakness}
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
                    'Ved å lese',
                    'Ved å lytte til forelesninger',
                    'Ved å gjøre praktiske oppgaver',
                    'Ved å diskutere med andre',
                    'Ved å se videoer'
                  ].map((style) => (
                    <FormField
                      key={style}
                      control={form.control}
                      name={`university.learningStyle.${style.toLowerCase().replace(/\s+/g, '_')}`}
                      render={({ field }) => (
                        <FormItem
                          key={style}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              {style}
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
                      <RadioGroupItem value="yes" id="intern-yes" />
                      <Label htmlFor="intern-yes">Ja</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="intern-no" />
                      <Label htmlFor="intern-no">Nei</Label>
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
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="very" id="intern-very" />
                        <Label htmlFor="intern-very">Veldig nyttig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="somewhat" id="intern-somewhat" />
                        <Label htmlFor="intern-somewhat">Litt nyttig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-really" id="intern-not-really" />
                        <Label htmlFor="intern-not-really">Ikke særlig nyttig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-at-all" id="intern-not-at-all" />
                        <Label htmlFor="intern-not-at-all">Ikke nyttig i det hele tatt</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrev}
          className="rounded-full"
        >
          Tilbake
        </Button>
        <Button 
          type="button" 
          onClick={onNext}
          className="rounded-full"
        >
          Neste
        </Button>
      </div>
    </div>
  );
};

export default UniversitySkillsQuestionnaire;
