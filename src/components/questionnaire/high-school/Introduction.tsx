import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Introduction = ({ form, validationErrors = [] }) => {
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
      <h2 className="text-2xl font-bold">Introduksjon og bakgrunn</h2>
      <p className="text-muted-foreground mb-6">
        Fortell oss litt om deg selv for at vi kan forstå din situasjon.
      </p>

      {/* Current Grade */}
      <FormField control={form.control} name="highSchool.grade" render={({
      field
    }) => <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">1. Hvilket trinn går du på? *</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="10th-grade" />
                  </FormControl>
                  <FormLabel className="font-normal">10. klasse</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="vg1" />
                  </FormControl>
                  <FormLabel className="font-normal">VGS 1.</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="vg2" />
                  </FormControl>
                  <FormLabel className="font-normal">VGS 2.</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="vg3" />
                  </FormControl>
                  <FormLabel className="font-normal">VGS 3.</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            {getFieldError("Spørsmål 1") && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {getFieldError("Spørsmål 1")}
                </AlertDescription>
              </Alert>
            )}
            <FormMessage />
          </FormItem>} />

      {/* Study Direction */}
      <FormField control={form.control} name="highSchool.studyDirection" render={({
      field
    }) => <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">2. Hvilken studieretning går du på (hvis VGS)? *</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="general-studies" />
                  </FormControl>
                  <FormLabel className="font-normal">Studiespesialisering</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="vocational" />
                  </FormControl>
                  <FormLabel className="font-normal">Yrkesfag</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="sports" />
                  </FormControl>
                  <FormLabel className="font-normal">Idrett</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="music-dance-drama" />
                  </FormControl>
                  <FormLabel className="font-normal">Musikk/Dans/Drama</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="other" />
                  </FormControl>
                  <FormLabel className="font-normal">Annet</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            {getFieldError("Spørsmål 2") && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {getFieldError("Spørsmål 2")}
                </AlertDescription>
              </Alert>
            )}
            <FormMessage />
          </FormItem>} />

      {/* Average Grade */}
      <FormField control={form.control} name="highSchool.averageGrade" render={({
      field
    }) => <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">3. Hvilket karaktergjennomsnitt har du ca. nå? *</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="1-2" />
                  </FormControl>
                  <FormLabel className="font-normal">1–2</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="3-4" />
                  </FormControl>
                  <FormLabel className="font-normal">3–4</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="5-6" />
                  </FormControl>
                  <FormLabel className="font-normal">5–6</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="unknown" />
                  </FormControl>
                  <FormLabel className="font-normal">Vet ikke</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            {getFieldError("Spørsmål 3") && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {getFieldError("Spørsmål 3")}
                </AlertDescription>
              </Alert>
            )}
            <FormMessage />
          </FormItem>} />
      
      {/* Favorite Subjects */}
      <FormField control={form.control} name="highSchool.favoriteCourses" render={() => {
        const maxAllowed = 3;
        const checkedCount = Object.values(form.getValues("highSchool.favoriteCourses") || {}).filter(Boolean).length;
        
        return <FormItem>
          <FormLabel className="text-base font-medium">
            4. Hvilke av disse fagene liker du best? (Velg opptil 3) *
          </FormLabel>
          <div className="text-sm text-muted-foreground mb-2">
            Valgt: {checkedCount}/{maxAllowed}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {[{
          id: "mathematics",
          label: "Matematikk"
        }, {
          id: "norwegian",
          label: "Norsk"
        }, {
          id: "english",
          label: "Engelsk"
        }, {
          id: "socialStudies",
          label: "Samfunnsfag"
        }, {
          id: "science",
          label: "Naturfag"
        }, {
          id: "physEd",
          label: "Kroppsøving"
        }, {
          id: "artsCrafts",
          label: "Kunst og håndverk"
        }, {
          id: "foreignLanguage",
          label: "Fremmedspråk"
        }, {
          id: "other",
          label: "Annet"
        }].map(item => <FormField key={item.id} control={form.control} name={`highSchool.favoriteCourses.${item.id}`} render={({
          field
        }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          disabled={!field.value && checkedCount >= maxAllowed}
                          onCheckedChange={(checked) => handleCheckboxLimit("highSchool.favoriteCourses", item.id, checked, maxAllowed)} 
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {item.label}
                      </FormLabel>
                    </FormItem>} />)}
          </div>
          <div className="mt-2">
            <FormField control={form.control} name="highSchool.favoriteCoursesOther" render={({
          field
        }) => <FormItem>
                    <FormControl>
                      <Input placeholder="Skriv inn andre fag" {...field} className={form.getValues('highSchool.favoriteCourses.other') ? "" : "hidden"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
          </div>
          {getFieldError("Spørsmål 4") && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {getFieldError("Spørsmål 4")}
              </AlertDescription>
            </Alert>
          )}
          <FormMessage />
        </FormItem>
      }} />
      
      {/* Difficult Subjects */}
      <FormField control={form.control} name="highSchool.difficultCourses" render={() => {
        const maxAllowed = 3;
        const checkedCount = Object.values(form.getValues("highSchool.difficultCourses") || {}).filter(Boolean).length;
        
        return <FormItem>
          <FormLabel className="text-base font-medium">
            5. Hvilke fag synes du er vanskeligst? (Velg opptil 3) *
          </FormLabel>
          <div className="text-sm text-muted-foreground mb-2">
            Valgt: {checkedCount}/{maxAllowed}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {[{
          id: "mathematics",
          label: "Matematikk"
        }, {
          id: "norwegian",
          label: "Norsk"
        }, {
          id: "english",
          label: "Engelsk"
        }, {
          id: "socialStudies",
          label: "Samfunnsfag"
        }, {
          id: "science",
          label: "Naturfag"
        }, {
          id: "physEd",
          label: "Kroppsøving"
        }, {
          id: "artsCrafts",
          label: "Kunst og håndverk"
        }, {
          id: "foreignLanguage",
          label: "Fremmedspråk"
        }, {
          id: "other",
          label: "Annet"
        }].map(item => <FormField key={item.id} control={form.control} name={`highSchool.difficultCourses.${item.id}`} render={({
          field
        }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          disabled={!field.value && checkedCount >= maxAllowed}
                          onCheckedChange={(checked) => handleCheckboxLimit("highSchool.difficultCourses", item.id, checked, maxAllowed)} 
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {item.label}
                      </FormLabel>
                    </FormItem>} />)}
          </div>
          <div className="mt-2">
            <FormField control={form.control} name="highSchool.difficultCoursesOther" render={({
          field
        }) => <FormItem>
                    <FormControl>
                      <Input placeholder="Skriv inn andre fag" {...field} className={form.getValues('highSchool.difficultCourses.other') ? "" : "hidden"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
          </div>
          {getFieldError("Spørsmål 5") && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {getFieldError("Spørsmål 5")}
              </AlertDescription>
            </Alert>
          )}
          <FormMessage />
        </FormItem>
      }} />
      
      {/* Education Priorities */}
      <FormField control={form.control} name="highSchool.educationPriorities" render={() => {
        const maxAllowed = 2;
        const checkedCount = Object.values(form.getValues("highSchool.educationPriorities") || {}).filter(Boolean).length;
        
        return <FormItem>
          <FormLabel className="text-base font-medium">
            6. Hva er viktigst for deg når det gjelder utdanning? (Velg opptil 2) *
          </FormLabel>
          <div className="text-sm text-muted-foreground mb-2">
            Valgt: {checkedCount}/{maxAllowed}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {[{
          id: "salary",
          label: "Få en godt betalt jobb"
        }, {
          id: "interest",
          label: "Følge interessene mine"
        }, {
          id: "security",
          label: "Ha trygg jobb"
        }, {
          id: "flexibility",
          label: "Ha en fleksibel arbeidshverdag"
        }, {
          id: "meaning",
          label: "Jobbe med noe meningsfullt"
        }, {
          id: "status",
          label: "Oppnå høy status"
        }].map(item => <FormField key={item.id} control={form.control} name={`highSchool.educationPriorities.${item.id}`} render={({
          field
        }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          disabled={!field.value && checkedCount >= maxAllowed}
                          onCheckedChange={(checked) => handleCheckboxLimit("highSchool.educationPriorities", item.id, checked, maxAllowed)} 
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {item.label}
                      </FormLabel>
                    </FormItem>} />)}
          </div>
          {getFieldError("Spørsmål 6") && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {getFieldError("Spørsmål 6")}
              </AlertDescription>
            </Alert>
          )}
          <FormMessage />
        </FormItem>
      }} />
    </div>;
};
export default Introduction;
