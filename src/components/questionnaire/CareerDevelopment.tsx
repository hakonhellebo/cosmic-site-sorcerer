import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CareerDevelopmentProps {
  form: UseFormReturn<any>;
}

const CareerDevelopment: React.FC<CareerDevelopmentProps> = ({
  form,
}) => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Karriereutvikling</h3>
        
        <FormField
          control={form.control}
          name="worker.yearsWorking"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Hvor mange år har du vært i arbeidslivet?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2"
                >
                  {[
                    { value: '0-2', label: '0-2 år' },
                    { value: '3-5', label: '3-5 år' },
                    { value: '6-10', label: '6-10 år' },
                    { value: '11-20', label: '11-20 år' },
                    { value: 'over-20', label: 'Over 20 år' },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`years-${option.value}`} />
                      <Label htmlFor={`years-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="worker.industryChange"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Har du byttet bransje siden din første jobb?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2"
                >
                  {[
                    { value: 'never', label: 'Nei, aldri' },
                    { value: 'once', label: 'Ja, én gang' },
                    { value: 'multiple', label: 'Ja, flere ganger' },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`industry-${option.value}`} />
                      <Label htmlFor={`industry-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="worker.jobChanges"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Hvor mange ganger har du byttet arbeidsgiver?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2"
                >
                  {[
                    { value: 'never', label: 'Aldri' },
                    { value: '1-2', label: '1-2 ganger' },
                    { value: '3-5', label: '3-5 ganger' },
                    { value: 'more-than-5', label: 'Mer enn 5 ganger' },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`changes-${option.value}`} />
                      <Label htmlFor={`changes-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Jobbtilfredshet og fremtid</h3>
        
        <FormField
          control={form.control}
          name="worker.jobSatisfaction"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Hvor fornøyd er du med nåværende jobb?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2"
                >
                  {[
                    { value: 'very-satisfied', label: 'Svært fornøyd' },
                    { value: 'somewhat-satisfied', label: 'Ganske fornøyd' },
                    { value: 'slightly-satisfied', label: 'Litt fornøyd' },
                    { value: 'dissatisfied', label: 'Misfornøyd' },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`jobsat-${option.value}`} />
                      <Label htmlFor={`jobsat-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="worker.jobImportance"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Hva er det viktigste for deg i en jobb? (Velg opptil 2)</FormLabel>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'salary', label: 'Lønn' },
                  { id: 'career_development', label: 'Karriereutvikling' },
                  { id: 'work_environment', label: 'Arbeidsmiljø' },
                  { id: 'flexibility', label: 'Fleksibilitet' },
                  { id: 'stability', label: 'Stabilitet' },
                  { id: 'innovation', label: 'Innovasjon' },
                ].map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={`worker.jobImportance.${item.id}`}
                    render={({ field }) => (
                      <FormItem
                        key={item.id}
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
                            {item.label}
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
          name="worker.nextCareerGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hva er ditt neste karrieremål?</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Skriv svaret ditt her" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="worker.meaningfulWork"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Hvor viktig er det for deg å jobbe med noe meningsfylt?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2"
                >
                  {[
                    { value: 'very-important', label: 'Svært viktig' },
                    { value: 'somewhat-important', label: 'Ganske viktig' },
                    { value: 'slightly-important', label: 'Litt viktig' },
                    { value: 'not-important', label: 'Ikke viktig' },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`meaning-${option.value}`} />
                      <Label htmlFor={`meaning-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="worker.careerAdvice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hvis du kunne fått karriereråd tidligere – hva ville du ønsket å vite?</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Skriv svaret ditt her" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="worker.jobChangeOpenness"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Hvor åpen er du for å bytte jobb nå?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2"
                >
                  {[
                    { value: 'very-open', label: 'Veldig åpen' },
                    { value: 'somewhat-open', label: 'Litt åpen' },
                    { value: 'not-open', label: 'Ikke åpen' },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`open-${option.value}`} />
                      <Label htmlFor={`open-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="worker.aiCareerAdvice"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Ville du vært villig til å bruke en AI-basert tjeneste for å få karriereråd?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2"
                >
                  {[
                    { value: 'yes', label: 'Ja' },
                    { value: 'maybe', label: 'Kanskje' },
                    { value: 'no', label: 'Nei' },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`ai-${option.value}`} />
                      <Label htmlFor={`ai-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default CareerDevelopment;
