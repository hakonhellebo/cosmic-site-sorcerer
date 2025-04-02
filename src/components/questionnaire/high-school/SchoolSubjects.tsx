import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const SchoolSubjects = ({
  form,
  validationErrors = []
}) => {
  const handleCheckboxLimit = (field, key, value, maxAllowed) => {
    const currentValues = {...form.getValues(field)};
    
    if (value === true) {
      const checkedCount = Object.values(currentValues).filter(Boolean).length;
      if (checkedCount >= maxAllowed) {
        return;
      }
    }
    
    form.setValue(`${field}.${key}`, value, { shouldValidate: true });
  };

  const getFieldError = (fieldPattern) => {
    return validationErrors.find(error => error.includes(fieldPattern));
  };

  return <div className="space-y-6">
      <h2 className="text-2xl font-bold">Skolefag og læringspreferanser</h2>
      <p className="text-muted-foreground mb-6">
        Fortell oss om dine foretrukne skolefag og hvordan du lærer best.
      </p>

      {/* Learning Style */}
      <div className="space-y-4">
        <FormField control={form.control} name="highSchool.learningStyle" render={() => {
          const maxAllowed = 2;
          const checkedCount = Object.values(form.getValues("highSchool.learningStyle") || {}).filter(Boolean).length;
          
          return <FormItem>
            <FormLabel className="text-base font-medium">13. Hvordan lærer du best? (Velg opptil 2) *</FormLabel>
            <div className="text-sm text-muted-foreground mb-2">
              Valgt: {checkedCount}/{maxAllowed}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {[{
                id: "reading",
                label: "Ved å lese"
              }, {
                id: "listening",
                label: "Ved å lytte til forelesninger"
              }, {
                id: "practical",
                label: "Ved å gjøre praktiske oppgaver"
              }, {
                id: "discussing",
                label: "Ved å diskutere med andre"
              }, {
                id: "watching",
                label: "Ved å se videoer"
              }, {
                id: "unknown",
                label: "Jeg vet ikke"
              }].map(item => <FormField key={item.id} control={form.control} name={`highSchool.learningStyle.${item.id}`} render={({
                field
              }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    disabled={!field.value && checkedCount >= maxAllowed}
                    onCheckedChange={(checked) => handleCheckboxLimit("highSchool.learningStyle", item.id, checked, maxAllowed)} 
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  {item.label}
                </FormLabel>
              </FormItem>} />)}
            </div>
            {getFieldError("Spørsmål 13") && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {getFieldError("Spørsmål 13")}
                </AlertDescription>
              </Alert>
            )}
            <FormMessage />
          </FormItem>
        }} />
      </div>

      {/* Digital Tools */}
      <div className="space-y-4">
        <FormField control={form.control} name="highSchool.digitalTools" render={() => {
          const maxAllowed = 2;
          const checkedCount = Object.values(form.getValues("highSchool.digitalTools") || {}).filter(Boolean).length;
          
          return <FormItem>
            <FormLabel className="text-base font-medium">14. Hvilke digitale verktøy bruker du mest i skolearbeidet? (Velg opptil 2) *</FormLabel>
            <div className="text-sm text-muted-foreground mb-2">
              Valgt: {checkedCount}/{maxAllowed}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {[{
                id: "computer",
                label: "PC/Mac"
              }, {
                id: "tablet",
                label: "Nettbrett"
              }, {
                id: "phone",
                label: "Mobiltelefon"
              }, {
                id: "calculator",
                label: "Kalkulator"
              }, {
                id: "ai",
                label: "Google/ChatGPT"
              }, {
                id: "otherPlatforms",
                label: "Andre plattformer (f.eks. Teams, OneNote)"
              }].map(item => <FormField key={item.id} control={form.control} name={`highSchool.digitalTools.${item.id}`} render={({
                field
              }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    disabled={!field.value && checkedCount >= maxAllowed}
                    onCheckedChange={(checked) => handleCheckboxLimit("highSchool.digitalTools", item.id, checked, maxAllowed)} 
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  {item.label}
                </FormLabel>
              </FormItem>} />)}
            </div>
            {getFieldError("Spørsmål 14") && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {getFieldError("Spørsmål 14")}
                </AlertDescription>
              </Alert>
            )}
            <FormMessage />
          </FormItem>
        }} />
      </div>

      {/* Technology Comfort */}
      <FormField control={form.control} name="highSchool.technologyComfort" render={({
      field
    }) => <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">15. Hvor komfortabel er du med å bruke teknologi i skolearbeidet? *</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
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
            {getFieldError("Spørsmål 15") && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {getFieldError("Spørsmål 15")}
                </AlertDescription>
              </Alert>
            )}
            <FormMessage />
          </FormItem>} />

      {/* School Challenges */}
      <div className="space-y-4">
        <FormField control={form.control} name="highSchool.schoolChallenges" render={() => {
          const maxAllowed = 2;
          const checkedCount = Object.values(form.getValues("highSchool.schoolChallenges") || {}).filter(Boolean).length;
          
          return <FormItem>
            <FormLabel className="text-base font-medium">16. Hva synes du er mest utfordrende med skolearbeidet ditt? (Velg opptil 2) *</FormLabel>
            <div className="text-sm text-muted-foreground mb-2">
              Valgt: {checkedCount}/{maxAllowed}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {[{
                id: "timeManagement",
                label: "Strukturere tiden min"
              }, {
                id: "understanding",
                label: "Forstå fagstoffet"
              }, {
                id: "motivation",
                label: "Finne motivasjon"
              }, {
                id: "teacherHelp",
                label: "Hjelp fra lærere"
              }, {
                id: "technology",
                label: "Bruke teknologi effektivt"
              }, {
                id: "collaboration",
                label: "Samarbeid med medelever"
              }].map(item => <FormField key={item.id} control={form.control} name={`highSchool.schoolChallenges.${item.id}`} render={({
                field
              }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    disabled={!field.value && checkedCount >= maxAllowed}
                    onCheckedChange={(checked) => handleCheckboxLimit("highSchool.schoolChallenges", item.id, checked, maxAllowed)} 
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  {item.label}
                </FormLabel>
              </FormItem>} />)}
            </div>
            {getFieldError("Spørsmål 16") && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {getFieldError("Spørsmål 16")}
                </AlertDescription>
              </Alert>
            )}
            <FormMessage />
          </FormItem>
        }} />
      </div>
    </div>;
};
export default SchoolSubjects;
