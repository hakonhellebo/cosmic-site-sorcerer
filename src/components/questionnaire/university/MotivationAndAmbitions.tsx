
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

interface MotivationAndAmbitionsProps {
  form: UseFormReturn<any>;
}

const MotivationAndAmbitions: React.FC<MotivationAndAmbitionsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">3. Motivasjon og ambisjoner</h2>
      <p className="text-muted-foreground mb-6">Fortell oss om hva som driver deg</p>
      
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
                className="flex flex-col space-y-2"
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
                className="flex flex-col space-y-2"
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
                className="flex flex-col space-y-2"
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
              {[
                { label: 'Fleksibilitet', value: 'fleksibilitet' },
                { label: 'Høy lønn', value: 'hoy_lonn' },
                { label: 'Stabilitet', value: 'stabilitet' },
                { label: 'Karrieremuligheter', value: 'karrieremuligheter' },
                { label: 'Mening i arbeidet', value: 'mening' },
                { label: 'Innovasjon', value: 'innovasjon' }
              ].map(({ label, value }) => (
                <FormField
                  key={value}
                  control={form.control}
                  name={`university.jobPriorities.${value}`}
                  render={({ field }) => {
                    return (
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`priority-${value}`} 
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            // Create a new object for immutability
                            const currentValues = form.getValues("university.jobPriorities") || {};
                            
                            // Count existing selections
                            const selectedCount = Object.values(currentValues).filter(Boolean).length;
                            
                            // If this is being checked and we already have 2 selections
                            if (checked && selectedCount >= 2) {
                              // Find the first selected option and unselect it
                              const firstSelected = Object.keys(currentValues).find(key => currentValues[key]);
                              if (firstSelected) {
                                form.setValue(`university.jobPriorities.${firstSelected}`, false);
                              }
                            }
                            
                            field.onChange(checked);
                          }}
                        />
                        <Label htmlFor={`priority-${value}`}>{label}</Label>
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
              {[
                { label: 'Konkurranse', value: 'konkurranse' },
                { label: 'Manglende erfaring', value: 'manglende_erfaring' },
                { label: 'Høye krav fra arbeidsgiver', value: 'hoye_krav' },
                { label: 'Vet ikke hva jeg vil jobbe med', value: 'usikker_jobbvalg' }
              ].map(({ label, value }) => (
                <FormField
                  key={value}
                  control={form.control}
                  name={`university.jobChallenges.${value}`}
                  render={({ field }) => {
                    return (
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`challenge-${value}`} 
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            // Create a new object for immutability
                            const currentValues = form.getValues("university.jobChallenges") || {};
                            
                            // Count existing selections
                            const selectedCount = Object.values(currentValues).filter(Boolean).length;
                            
                            // If this is being checked and we already have 2 selections
                            if (checked && selectedCount >= 2) {
                              // Find the first selected option and unselect it
                              const firstSelected = Object.keys(currentValues).find(key => currentValues[key]);
                              if (firstSelected) {
                                form.setValue(`university.jobChallenges.${firstSelected}`, false);
                              }
                            }
                            
                            field.onChange(checked);
                          }}
                        />
                        <Label htmlFor={`challenge-${value}`}>{label}</Label>
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
                className="flex flex-col space-y-2"
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
                className="flex flex-col space-y-2"
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
  );
};

export default MotivationAndAmbitions;
