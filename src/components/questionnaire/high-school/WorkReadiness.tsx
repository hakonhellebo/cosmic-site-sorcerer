import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface WorkReadinessProps {
  form: any;
  validationErrors?: string[];
}

const WorkReadiness: React.FC<WorkReadinessProps> = ({ form, validationErrors = [] }) => {
  const getFieldError = (fieldPattern) => {
    return validationErrors.find(error => error.includes(fieldPattern));
  };
  
  return <div className="space-y-6">
      <h2 className="text-2xl font-bold">Arbeidsforberedelse og skolevaner</h2>
      <p className="text-muted-foreground mb-6">
        Fortell oss om dine vaner og din forberedelse til videre utdanning eller arbeid.
      </p>

      {/* Independent Work */}
      <FormField control={form.control} name="highSchool.workIndependently" render={({
      field
    }) => <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">17. Hvordan vil du vurdere din egen evne til å jobbe selvstendig?</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="very-good" />
                  </FormControl>
                  <FormLabel className="font-normal">Veldig god</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="good" />
                  </FormControl>
                  <FormLabel className="font-normal">God</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="average" />
                  </FormControl>
                  <FormLabel className="font-normal">Middels</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="poor" />
                  </FormControl>
                  <FormLabel className="font-normal">Dårlig</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            {getFieldError("Spørsmål 17") && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {getFieldError("Spørsmål 17")}
                </AlertDescription>
              </Alert>
            )}
            <FormMessage />
          </FormItem>} />

      {/* Education/work preparedness */}
      <FormField control={form.control} name="highSchool.preparedness" render={({
      field
    }) => <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">18. Hvor godt forberedt føler du deg på videre utdanning eller arbeid?</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="very-prepared" />
                  </FormControl>
                  <FormLabel className="font-normal">Veldig godt forberedt</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="somewhat-prepared" />
                  </FormControl>
                  <FormLabel className="font-normal">Ganske godt forberedt</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="little-prepared" />
                  </FormControl>
                  <FormLabel className="font-normal">Litt forberedt</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="not-prepared" />
                  </FormControl>
                  <FormLabel className="font-normal">Ikke forberedt i det hele tatt</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>} />

      {/* Collaboration Frequency */}
      <FormField control={form.control} name="highSchool.collaboration" render={({
      field
    }) => <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">19. Hvor ofte samarbeider du med andre på skolen?</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="daily" />
                  </FormControl>
                  <FormLabel className="font-normal">Daglig</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="weekly" />
                  </FormControl>
                  <FormLabel className="font-normal">Ukentlig</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="monthly" />
                  </FormControl>
                  <FormLabel className="font-normal">Månedlig</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="rarely" />
                  </FormControl>
                  <FormLabel className="font-normal">Sjeldnere enn månedlig</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>} />

      {/* AI Usage */}
      <FormField control={form.control} name="highSchool.aiUsage" render={({
      field
    }) => <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">19. Hvor ofte bruker du AI (f.eks. ChatGPT) i skolearbeidet?</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="daily" />
                  </FormControl>
                  <FormLabel className="font-normal">Daglig</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="weekly" />
                  </FormControl>
                  <FormLabel className="font-normal">Ukentlig</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="monthly" />
                  </FormControl>
                  <FormLabel className="font-normal">Månedlig</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="rarely" />
                  </FormControl>
                  <FormLabel className="font-normal">Sjeldnere enn månedlig</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="never" />
                  </FormControl>
                  <FormLabel className="font-normal">Aldri</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>} />

      {/* Missing Skills */}
      <div className="space-y-4">
        <FormField control={form.control} name="highSchool.missingSkills" render={() => <FormItem>
              <FormLabel className="text-base font-medium">21. Hvilke ferdigheter føler du at du mangler for å lykkes på videregående eller i arbeidslivet? (Velg opptil 2)</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {[{
            id: "problemSolving",
            label: "Problemløsning"
          }, {
            id: "criticalThinking",
            label: "Kritisk tenkning"
          }, {
            id: "creativity",
            label: "Kreativitet"
          }, {
            id: "communication",
            label: "Kommunikasjon"
          }, {
            id: "technology",
            label: "Teknologiforståelse"
          }, {
            id: "selfManagement",
            label: "Selvledelse"
          }, {
            id: "unknown",
            label: "Jeg vet ikke"
          }].map(item => <FormField key={item.id} control={form.control} name={`highSchool.missingSkills.${item.id}`} render={({
            field
          }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>} />)}
              </div>
              <FormMessage />
            </FormItem>} />
      </div>

      {/* Study Time */}
      <FormField control={form.control} name="highSchool.studyTime" render={({
      field
    }) => <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">22. Hvor mye tid bruker du på skolearbeid utenom skoletiden?</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="more-than-10" />
                  </FormControl>
                  <FormLabel className="font-normal">Mer enn 10 timer per uke</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="5-10" />
                  </FormControl>
                  <FormLabel className="font-normal">5–10 timer per uke</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="1-5" />
                  </FormControl>
                  <FormLabel className="font-normal">1–5 timer per uke</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="almost-none" />
                  </FormControl>
                  <FormLabel className="font-normal">Nesten ingenting</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>} />

      {/* Work Experience */}
      <FormField control={form.control} name="highSchool.workExperience" render={({
      field
    }) => <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">23. Har du hatt praksis eller arbeidserfaring gjennom skolen?</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="yes" />
                  </FormControl>
                  <FormLabel className="font-normal">Ja</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="no" />
                  </FormControl>
                  <FormLabel className="font-normal">Nei</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>} />

      {/* Work Experience Value */}
      <FormField control={form.control} name="highSchool.workExperienceValue" render={({
      field
    }) => <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">24. Hvis du har hatt praksis eller arbeidserfaring – hvor nyttig var det for deg?</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="very-useful" />
                  </FormControl>
                  <FormLabel className="font-normal">Veldig nyttig</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="somewhat-useful" />
                  </FormControl>
                  <FormLabel className="font-normal">Litt nyttig</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="not-very-useful" />
                  </FormControl>
                  <FormLabel className="font-normal">Ikke så nyttig</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="not-useful" />
                  </FormControl>
                  <FormLabel className="font-normal">Ikke nyttig i det hele tatt</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="no-experience" />
                  </FormControl>
                  <FormLabel className="font-normal">Har ikke hatt praksis</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>} />
    </div>;
};
export default WorkReadiness;
