
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
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const UniversityQuestionnaire = ({ form, onSubmit }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Personlige opplysninger</h2>
        <p className="text-muted-foreground mb-6">Fortell oss om din utdanning</p>
        
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="university.studyField"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hva studerer du?</FormLabel>
                <FormControl>
                  <Input placeholder="F.eks. Informatikk, Økonomi, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="university.institution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hvilket studiested går du på?</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Velg studiested" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="uio">Universitetet i Oslo</SelectItem>
                    <SelectItem value="ntnu">NTNU</SelectItem>
                    <SelectItem value="uib">Universitetet i Bergen</SelectItem>
                    <SelectItem value="bi">BI</SelectItem>
                    <SelectItem value="nhh">NHH</SelectItem>
                    <SelectItem value="hinn">Høgskolen i Innlandet</SelectItem>
                    <SelectItem value="other">Andre</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="university.level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hvilket nivå er du på i studiet?</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Velg nivå" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="bachelor1">Bachelor, år 1</SelectItem>
                    <SelectItem value="bachelor2">Bachelor, år 2</SelectItem>
                    <SelectItem value="bachelor3">Bachelor, år 3</SelectItem>
                    <SelectItem value="master1">Master, år 1</SelectItem>
                    <SelectItem value="master2">Master, år 2</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="single">Jeg tar enkeltemner</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="university.changedField"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Har du byttet studieretning underveis?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="changed-yes" />
                      <Label htmlFor="changed-yes">Ja</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="changed-no" />
                      <Label htmlFor="changed-no">Nei</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

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
                  <FormLabel>Hvilke fagområder interesserer deg mest i studiet? (Velg opptil 3)</FormLabel>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['Teknologi', 'Økonomi', 'Samfunnsvitenskap', 'Humaniora', 'Naturvitenskap', 
                    'Helse', 'Kunst og design', 'Ingeniørfag', 'Lærerutdanning', 'Jus'].map(
                    (subject) => (
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
                    )
                  )}
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
                  <FormLabel>Hvilke ferdigheter føler du at du har styrke i? (Velg opptil 3)</FormLabel>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['Kritisk tenkning', 'Problemløsning', 'Kreativitet', 'Kommunikasjon',
                    'Selvledelse', 'Prosjektstyring', 'Teknologiforståelse', 'Empati'].map(
                    (skill) => (
                      <FormField
                        key={skill}
                        control={form.control}
                        name={`university.strengths.${skill.toLowerCase().replace(/\s+/g, '_')}`}
                        render={({ field }) => (
                          <FormItem
                            key={skill}
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
                                {skill}
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
            name="university.weaknesses"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Hvilke ferdigheter føler du at du mangler? (Velg opptil 3)</FormLabel>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['Kritisk tenkning', 'Problemløsning', 'Kreativitet', 'Kommunikasjon',
                    'Selvledelse', 'Prosjektstyring', 'Teknologiforståelse', 'Empati'].map(
                    (skill) => (
                      <FormField
                        key={skill}
                        control={form.control}
                        name={`university.weaknesses.${skill.toLowerCase().replace(/\s+/g, '_')}`}
                        render={({ field }) => (
                          <FormItem
                            key={skill}
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
                                {skill}
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

      <div className="flex justify-end">
        <Button type="submit" className="rounded-full">
          Fullfør registrering
        </Button>
      </div>
    </div>
  );
};

export default UniversityQuestionnaire;
