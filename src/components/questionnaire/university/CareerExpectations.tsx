
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

interface CareerExpectationsProps {
  form: UseFormReturn<any>;
}

const CareerExpectations: React.FC<CareerExpectationsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">4. Karriereforventninger</h2>
      <p className="text-muted-foreground mb-6">Fortell oss om dine forventninger til arbeidslivet</p>
      
      <FormField
        control={form.control}
        name="university.futureRole"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>21. Hvordan ser du for deg arbeidshverdagen din om 10 år?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="leader" id="role-leader" />
                  <Label htmlFor="role-leader">I en lederrolle</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="specialist" id="role-specialist" />
                  <Label htmlFor="role-specialist">I en spesialistrolle</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="entrepreneur" id="role-entrepreneur" />
                  <Label htmlFor="role-entrepreneur">Driver egen bedrift</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unsure" id="role-unsure" />
                  <Label htmlFor="role-unsure">Vet ikke ennå</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.futureEmployerFactors"
        render={() => (
          <FormItem>
            <FormLabel>22. Hva er viktigst for deg i en fremtidig arbeidsgiver? (Velg opptil 2)</FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { label: 'Høy lønn', value: 'hoy_lonn' },
                { label: 'Godt arbeidsmiljø', value: 'godt_arbeidsmiljo' },
                { label: 'Karriereutvikling', value: 'karriereutvikling' },
                { label: 'Stabilitet', value: 'stabilitet' },
                { label: 'Innovasjon', value: 'innovasjon' }
              ].map(({ label, value }) => (
                <FormField
                  key={value}
                  control={form.control}
                  name={`university.futureEmployerFactors.${value}`}
                  render={({ field }) => {
                    return (
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`employer-${value}`} 
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            // Create a new object for immutability
                            const currentValues = form.getValues("university.futureEmployerFactors") || {};
                            
                            // Count existing selections
                            const selectedCount = Object.values(currentValues).filter(Boolean).length;
                            
                            // If this is being checked and we already have 2 selections
                            if (checked && selectedCount >= 2) {
                              // Find the first selected option and unselect it
                              const firstSelected = Object.keys(currentValues).find(key => currentValues[key]);
                              if (firstSelected) {
                                form.setValue(`university.futureEmployerFactors.${firstSelected}`, false);
                              }
                            }
                            
                            field.onChange(checked);
                          }}
                        />
                        <Label htmlFor={`employer-${value}`}>{label}</Label>
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
        name="university.preferredCompanyType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>23. Hva slags bedrift ønsker du helst å jobbe i?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="startup" id="company-startup" />
                  <Label htmlFor="company-startup">Startup</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="small-medium" id="company-small-medium" />
                  <Label htmlFor="company-small-medium">Lite/mellomstort selskap</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="company-large" />
                  <Label htmlFor="company-large">Stort konsern</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="company-public" />
                  <Label htmlFor="company-public">Offentlig sektor</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nonprofit" id="company-nonprofit" />
                  <Label htmlFor="company-nonprofit">Frivillig sektor</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unsure" id="company-unsure" />
                  <Label htmlFor="company-unsure">Jeg vet ikke ennå</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.technologyImportance"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>24. Hvor viktig er det for deg å jobbe med teknologi i fremtidig jobb?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="very" id="tech-very" />
                  <Label htmlFor="tech-very">Veldig viktig</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="somewhat" id="tech-somewhat" />
                  <Label htmlFor="tech-somewhat">Litt viktig</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-really" id="tech-not-really" />
                  <Label htmlFor="tech-not-really">Ikke så viktig</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-at-all" id="tech-not-at-all" />
                  <Label htmlFor="tech-not-at-all">Ikke viktig i det hele tatt</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.workLifeBalance"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>25. Hvordan ser du på balansen mellom jobb og fritid?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="work-first" id="balance-work" />
                  <Label htmlFor="balance-work">Jeg prioriterer jobb først</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="balance" id="balance-equal" />
                  <Label htmlFor="balance-equal">Jeg prioriterer balanse mellom jobb og fritid</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="leisure-first" id="balance-leisure" />
                  <Label htmlFor="balance-leisure">Jeg prioriterer fritid først</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.remoteWorkImportance"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>26. Hvor viktig er det for deg å ha mulighet til å jobbe hjemmefra?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="very" id="remote-very" />
                  <Label htmlFor="remote-very">Veldig viktig</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="somewhat" id="remote-somewhat" />
                  <Label htmlFor="remote-somewhat">Litt viktig</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-really" id="remote-not-really" />
                  <Label htmlFor="remote-not-really">Ikke så viktig</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-at-all" id="remote-not-at-all" />
                  <Label htmlFor="remote-not-at-all">Ikke viktig i det hele tatt</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.travelImportance"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>27. Hvor viktig er det for deg å ha en jobb som involverer reising?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="very" id="travel-very" />
                  <Label htmlFor="travel-very">Veldig viktig</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="somewhat" id="travel-somewhat" />
                  <Label htmlFor="travel-somewhat">Litt viktig</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-really" id="travel-not-really" />
                  <Label htmlFor="travel-not-really">Ikke så viktig</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-at-all" id="travel-not-at-all" />
                  <Label htmlFor="travel-not-at-all">Ikke viktig i det hele tatt</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.satisfactionFactors"
        render={() => (
          <FormItem>
            <FormLabel>28. Hvilke faktorer tror du vil gi deg mest tilfredshet i jobben? (Velg opptil 2)</FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { label: 'Meningsfylt arbeid', value: 'meningsfylt' },
                { label: 'Høy lønn', value: 'hoy_lonn' },
                { label: 'Karriereutvikling', value: 'karriereutvikling' },
                { label: 'Fleksibilitet', value: 'fleksibilitet' },
                { label: 'Innovasjon', value: 'innovasjon' },
                { label: 'Stabilitet', value: 'stabilitet' }
              ].map(({ label, value }) => (
                <FormField
                  key={value}
                  control={form.control}
                  name={`university.satisfactionFactors.${value}`}
                  render={({ field }) => {
                    return (
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`satisfaction-${value}`} 
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            // Create a new object for immutability
                            const currentValues = form.getValues("university.satisfactionFactors") || {};
                            
                            // Count existing selections
                            const selectedCount = Object.values(currentValues).filter(Boolean).length;
                            
                            // If this is being checked and we already have 2 selections
                            if (checked && selectedCount >= 2) {
                              // Find the first selected option and unselect it
                              const firstSelected = Object.keys(currentValues).find(key => currentValues[key]);
                              if (firstSelected) {
                                form.setValue(`university.satisfactionFactors.${firstSelected}`, false);
                              }
                            }
                            
                            field.onChange(checked);
                          }}
                        />
                        <Label htmlFor={`satisfaction-${value}`}>{label}</Label>
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
        name="university.employerValuesImportance"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>29. Hvor viktig er det for deg at arbeidsgiveren din har tydelige verdier?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="very" id="values-very" />
                  <Label htmlFor="values-very">Veldig viktig</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="somewhat" id="values-somewhat" />
                  <Label htmlFor="values-somewhat">Litt viktig</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-really" id="values-not-really" />
                  <Label htmlFor="values-not-really">Ikke så viktig</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-at-all" id="values-not-at-all" />
                  <Label htmlFor="values-not-at-all">Ikke viktig i det hele tatt</Label>
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

export default CareerExpectations;
