
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

const MotivationQuestionnaire = ({ form, onPrevious, onSubmit }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Motivasjon og ambisjoner</h2>
        <p className="text-muted-foreground mb-6">Fortell oss om hva som driver deg</p>
        
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="university.studyReason"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>14. Hva er den viktigste grunnen til at du studerer?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="job-security" id="reason-job" />
                      <Label htmlFor="reason-job">For å få en sikker jobb</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="earnings" id="reason-earnings" />
                      <Label htmlFor="reason-earnings">For å tjene godt</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="difference" id="reason-difference" />
                      <Label htmlFor="reason-difference">For å gjøre en forskjell</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="passion" id="reason-passion" />
                      <Label htmlFor="reason-passion">For å følge lidenskapen min</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unsure" id="reason-unsure" />
                      <Label htmlFor="reason-unsure">Jeg vet ikke ennå</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="university.salaryImportance"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>15. Hvor viktig er det for deg å ha en jobb med høy lønn?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="very" id="salary-very" />
                      <Label htmlFor="salary-very">Veldig viktig</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="somewhat" id="salary-somewhat" />
                      <Label htmlFor="salary-somewhat">Litt viktig</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-really" id="salary-not-really" />
                      <Label htmlFor="salary-not-really">Ikke så viktig</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-at-all" id="salary-not-at-all" />
                      <Label htmlFor="salary-not-at-all">Ikke viktig i det hele tatt</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="university.impactImportance"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>16. Hvor viktig er det for deg å gjøre en forskjell i samfunnet?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="very" id="impact-very" />
                      <Label htmlFor="impact-very">Veldig viktig</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="somewhat" id="impact-somewhat" />
                      <Label htmlFor="impact-somewhat">Litt viktig</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-really" id="impact-not-really" />
                      <Label htmlFor="impact-not-really">Ikke så viktig</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-at-all" id="impact-not-at-all" />
                      <Label htmlFor="impact-not-at-all">Ikke viktig i det hele tatt</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="university.jobPriorities"
            render={() => (
              <FormItem>
                <FormLabel>17. Hva er viktigst for deg i en jobb? (Velg opptil 2)</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {['Fleksibilitet', 'Høy lønn', 'Stabilitet', 'Karrieremuligheter', 
                    'Mening i arbeidet', 'Innovasjon'].map((priority) => (
                    <FormField
                      key={priority}
                      control={form.control}
                      name={`university.jobPriorities.${priority.toLowerCase().replace(' ', '_')}`}
                      render={({ field }) => {
                        return (
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`priority-${priority.toLowerCase().replace(' ', '_')}`} 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <Label htmlFor={`priority-${priority.toLowerCase().replace(' ', '_')}`}>{priority}</Label>
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
            name="university.jobChallenges"
            render={() => (
              <FormItem>
                <FormLabel>18. Hva tror du kommer til å bli den største utfordringen når du søker jobb? (Velg opptil 2)</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {['Konkurranse', 'Manglende erfaring', 'Høye krav fra arbeidsgiver', 
                    'Vet ikke hva jeg vil jobbe med'].map((challenge) => (
                    <FormField
                      key={challenge}
                      control={form.control}
                      name={`university.jobChallenges.${challenge.toLowerCase().replace(/ /g, '_')}`}
                      render={({ field }) => {
                        return (
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`challenge-${challenge.toLowerCase().replace(/ /g, '_')}`} 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <Label htmlFor={`challenge-${challenge.toLowerCase().replace(/ /g, '_')}`}>{challenge}</Label>
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
            name="university.internationalImportance"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>19. Hvor viktig er det for deg å jobbe internasjonalt?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="very" id="international-very" />
                      <Label htmlFor="international-very">Veldig viktig</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="somewhat" id="international-somewhat" />
                      <Label htmlFor="international-somewhat">Litt viktig</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-really" id="international-not-really" />
                      <Label htmlFor="international-not-really">Ikke så viktig</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-at-all" id="international-not-at-all" />
                      <Label htmlFor="international-not-at-all">Ikke viktig i det hele tatt</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="university.entrepreneurship"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>20. Kunne du tenke deg å starte egen bedrift i fremtiden?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="entrepreneur-yes" />
                      <Label htmlFor="entrepreneur-yes">Ja</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="entrepreneur-no" />
                      <Label htmlFor="entrepreneur-no">Nei</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="maybe" id="entrepreneur-maybe" />
                      <Label htmlFor="entrepreneur-maybe">Kanskje</Label>
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

export default MotivationQuestionnaire;
