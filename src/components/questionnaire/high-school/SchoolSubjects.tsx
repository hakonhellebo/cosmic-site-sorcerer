
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const SchoolSubjects = ({ form }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Skolefag og læringspreferanser</h2>
      <p className="text-muted-foreground mb-6">
        Fortell oss om dine foretrukne skolefag og hvordan du lærer best.
      </p>

      {/* Best Subjects */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="highSchool.bestSubjects"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                10. Hvilke fag liker du best på skolen? (Velg opptil 3)
              </FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {[
                  { id: "maths", label: "Matematikk" },
                  { id: "norwegian", label: "Norsk" },
                  { id: "english", label: "Engelsk" },
                  { id: "science", label: "Naturfag" },
                  { id: "socialScience", label: "Samfunnsfag" },
                  { id: "history", label: "Historie" },
                  { id: "arts", label: "Kunst og håndverk" },
                  { id: "pe", label: "Kroppsøving" },
                  { id: "music", label: "Musikk" },
                  { id: "programming", label: "Programmering/teknologi" },
                  { id: "other", label: "Annet" },
                ].map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={`highSchool.bestSubjects.${item.id}`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <div className="mt-2">
                <FormField
                  control={form.control}
                  name="highSchool.bestSubjectsOther"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Annet fag</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Skriv inn annet fag du liker"
                          {...field}
                          className={!form.watch('highSchool.bestSubjects.other') ? 'opacity-50' : ''}
                          disabled={!form.watch('highSchool.bestSubjects.other')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Challenging Subjects */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="highSchool.challengingSubjects"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                11. Hvilke fag synes du er mest utfordrende? (Velg opptil 3)
              </FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {[
                  { id: "maths", label: "Matematikk" },
                  { id: "norwegian", label: "Norsk" },
                  { id: "english", label: "Engelsk" },
                  { id: "science", label: "Naturfag" },
                  { id: "socialScience", label: "Samfunnsfag" },
                  { id: "history", label: "Historie" },
                  { id: "arts", label: "Kunst og håndverk" },
                  { id: "pe", label: "Kroppsøving" },
                  { id: "music", label: "Musikk" },
                  { id: "programming", label: "Programmering/teknologi" },
                  { id: "other", label: "Annet" },
                ].map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={`highSchool.challengingSubjects.${item.id}`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <div className="mt-2">
                <FormField
                  control={form.control}
                  name="highSchool.challengingSubjectsOther"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Annet fag</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Skriv inn annet fag du finner utfordrende"
                          {...field}
                          className={!form.watch('highSchool.challengingSubjects.other') ? 'opacity-50' : ''}
                          disabled={!form.watch('highSchool.challengingSubjects.other')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Learning Style */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="highSchool.learningStyle"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                12. Hvordan lærer du best? (Velg opptil 2)
              </FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {[
                  { id: "reading", label: "Ved å lese" },
                  { id: "listening", label: "Ved å lytte til forelesninger" },
                  { id: "practical", label: "Ved å gjøre praktiske oppgaver" },
                  { id: "discussing", label: "Ved å diskutere med andre" },
                  { id: "watching", label: "Ved å se videoer" },
                  { id: "unknown", label: "Jeg vet ikke" },
                ].map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={`highSchool.learningStyle.${item.id}`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Digital Tools */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="highSchool.digitalTools"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                13. Hvilke digitale verktøy bruker du mest i skolearbeidet? (Velg opptil 2)
              </FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {[
                  { id: "computer", label: "PC/Mac" },
                  { id: "tablet", label: "Nettbrett" },
                  { id: "phone", label: "Mobiltelefon" },
                  { id: "calculator", label: "Kalkulator" },
                  { id: "ai", label: "Google/ChatGPT" },
                  { id: "otherPlatforms", label: "Andre plattformer (f.eks. Teams, OneNote)" },
                ].map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={`highSchool.digitalTools.${item.id}`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Technology Comfort */}
      <FormField
        control={form.control}
        name="highSchool.technologyComfort"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">14. Hvor komfortabel er du med å bruke teknologi i skolearbeidet?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="very-comfortable" />
                  </FormControl>
                  <FormLabel className="font-normal">Veldig komfortabel</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="somewhat-comfortable" />
                  </FormControl>
                  <FormLabel className="font-normal">Litt komfortabel</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="not-very-comfortable" />
                  </FormControl>
                  <FormLabel className="font-normal">Ikke så komfortabel</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="not-comfortable" />
                  </FormControl>
                  <FormLabel className="font-normal">Ikke komfortabel i det hele tatt</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* School Challenges */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="highSchool.schoolChallenges"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                15. Hva synes du er mest utfordrende med skolearbeidet ditt? (Velg opptil 2)
              </FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {[
                  { id: "timeManagement", label: "Strukturere tiden min" },
                  { id: "understanding", label: "Forstå fagstoffet" },
                  { id: "motivation", label: "Finne motivasjon" },
                  { id: "teacherHelp", label: "Hjelp fra lærere" },
                  { id: "technology", label: "Bruke teknologi effektivt" },
                  { id: "collaboration", label: "Samarbeid med medelever" },
                ].map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={`highSchool.schoolChallenges.${item.id}`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default SchoolSubjects;
