
import React from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const HighSchoolQuestionnaire = ({ form, onSubmit }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Introduksjon og bakgrunn</h2>
        <p className="text-muted-foreground mb-6">Fortell oss litt om din skolebakgrunn</p>
        
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="highSchool.grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hvilken klasse går du i?</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Velg klasse" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="10">10. klasse</SelectItem>
                    <SelectItem value="vg1">VG1</SelectItem>
                    <SelectItem value="vg2">VG2</SelectItem>
                    <SelectItem value="vg3">VG3</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="highSchool.studyDirection"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hvilken studieretning går du på?</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Velg studieretning" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="general">Studiespesialisering</SelectItem>
                    <SelectItem value="vocational">Yrkesfag</SelectItem>
                    <SelectItem value="sports">Idrett</SelectItem>
                    <SelectItem value="arts">Musikk/Dans/Drama</SelectItem>
                    <SelectItem value="other">Annet</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="highSchool.averageGrade"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Hvilket karaktergjennomsnitt har du ca. nå?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1-2" id="grade1-2" />
                      <Label htmlFor="grade1-2">1-2</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3-4" id="grade3-4" />
                      <Label htmlFor="grade3-4">3-4</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5-6" id="grade5-6" />
                      <Label htmlFor="grade5-6">5-6</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unknown" id="gradeUnknown" />
                      <Label htmlFor="gradeUnknown">Vet ikke</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="highSchool.favoriteCourses"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Hvilke av disse fagene liker du best? (Velg opptil 3)</FormLabel>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['Matematikk', 'Norsk', 'Engelsk', 'Samfunnsfag', 'Naturfag', 
                    'Kroppsøving', 'Kunst og håndverk', 'Fremmedspråk'].map(
                    (subject) => (
                      <FormField
                        key={subject}
                        control={form.control}
                        name={`highSchool.favoriteCourses.${subject.toLowerCase()}`}
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
                    )
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Interesser og ferdigheter</h2>
        <p className="text-muted-foreground mb-6">Fortell oss om hva du er interessert i og god på</p>
        
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="highSchool.interests"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Hvilke av disse interesserer deg mest? (Velg opptil 3)</FormLabel>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['Teknologi', 'Kunst og design', 'Fysisk aktivitet og sport', 'Økonomi og finans',
                    'Reiseliv og kultur', 'Helse og omsorg', 'Miljø og bærekraft'].map(
                    (interest) => (
                      <FormField
                        key={interest}
                        control={form.control}
                        name={`highSchool.interests.${interest.toLowerCase().replace(/\s+/g, '_')}`}
                        render={({ field }) => (
                          <FormItem
                            key={interest}
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
                                {interest}
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    )
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="highSchool.workEnvironment"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Hva slags miljø trives du i?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="calm" id="env-calm" />
                      <Label htmlFor="env-calm">Et rolig og strukturert miljø</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="creative" id="env-creative" />
                      <Label htmlFor="env-creative">Et kreativt og dynamisk miljø</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="social" id="env-social" />
                      <Label htmlFor="env-social">Et sosialt og samarbeidsorientert miljø</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="competitive" id="env-competitive" />
                      <Label htmlFor="env-competitive">Et målrettet og konkurransepreget miljø</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="highSchool.workPreference"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Liker du å jobbe alene eller i team?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="alone" id="work-alone" />
                      <Label htmlFor="work-alone">Alene</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="team" id="work-team" />
                      <Label htmlFor="work-team">I team</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="both" id="work-both" />
                      <Label htmlFor="work-both">Litt av begge deler</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="rounded-full">
          Fullfør registrering
        </Button>
      </div>
    </div>
  );
};

export default HighSchoolQuestionnaire;
