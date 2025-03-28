
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const InterestsAndSkills = ({ form }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Interesser og ferdigheter</h2>
      <p className="text-muted-foreground mb-6">
        Fortell oss om dine interesser og ferdigheter for at vi bedre kan forstå dine styrker.
      </p>

      {/* Interests */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="highSchool.interests"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Hvilke av disse interesserer deg mest? (Velg opptil 3)
              </FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {[
                  { id: "technology", label: "Teknologi" },
                  { id: "science", label: "Vitenskap" },
                  { id: "arts", label: "Kunst og kultur" },
                  { id: "sports", label: "Idrett" },
                  { id: "business", label: "Økonomi og business" },
                  { id: "social", label: "Samfunn og mennesker" },
                  { id: "environment", label: "Miljø og bærekraft" },
                  { id: "mathematics", label: "Matematikk" },
                  { id: "languages", label: "Språk" },
                  { id: "handson", label: "Praktisk arbeid" },
                ].map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={`highSchool.interests.${item.id}`}
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

      {/* Work Tasks */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="highSchool.workTasks"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Hvilke arbeidsoppgaver tror du at du ville trives med? (Velg opptil 3)
              </FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {[
                  { id: "problem", label: "Løse problemer" },
                  { id: "creative", label: "Kreative oppgaver" },
                  { id: "analytical", label: "Analysere data" },
                  { id: "helping", label: "Hjelpe andre" },
                  { id: "technical", label: "Tekniske oppgaver" },
                  { id: "organizing", label: "Organisere og planlegge" },
                  { id: "presenting", label: "Presentere og formidle" },
                  { id: "researching", label: "Undersøke og forske" },
                  { id: "manual", label: "Praktisk håndverk" },
                  { id: "leading", label: "Lede andre" },
                ].map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={`highSchool.workTasks.${item.id}`}
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

      {/* Work Environment */}
      <FormField
        control={form.control}
        name="highSchool.workEnvironment"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">Hvilken arbeidssituasjon tror du ville passe deg best?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="structured" />
                  </FormControl>
                  <FormLabel className="font-normal">Fast struktur og rutiner</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="flexible" />
                  </FormControl>
                  <FormLabel className="font-normal">Fleksibel arbeidstid og oppgaver</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="mixed" />
                  </FormControl>
                  <FormLabel className="font-normal">En blanding av begge</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="unknown" />
                  </FormControl>
                  <FormLabel className="font-normal">Vet ikke</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Work Preference */}
      <FormField
        control={form.control}
        name="highSchool.workPreference"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">Foretrekker du å jobbe:</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="alone" />
                  </FormControl>
                  <FormLabel className="font-normal">Mest alene</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="team" />
                  </FormControl>
                  <FormLabel className="font-normal">Mest i team</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="mixed" />
                  </FormControl>
                  <FormLabel className="font-normal">En blanding av begge</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="unknown" />
                  </FormControl>
                  <FormLabel className="font-normal">Vet ikke</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Good Skills */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="highSchool.goodSkills"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Hva er du god på? (Velg opptil 3)
              </FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {[
                  { id: "communication", label: "Kommunikasjon" },
                  { id: "problemSolving", label: "Problemløsning" },
                  { id: "creativity", label: "Kreativitet" },
                  { id: "teamwork", label: "Samarbeid" },
                  { id: "technology", label: "Teknologi" },
                  { id: "organization", label: "Organisering" },
                  { id: "leadership", label: "Ledelse" },
                  { id: "learning", label: "Lære nye ting" },
                  { id: "analysis", label: "Analysere informasjon" },
                  { id: "practical", label: "Praktiske ferdigheter" },
                ].map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={`highSchool.goodSkills.${item.id}`}
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

      {/* Improve Skills */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="highSchool.improveSkills"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Hva ønsker du å bli bedre på? (Velg opptil 3)
              </FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {[
                  { id: "communication", label: "Kommunikasjon" },
                  { id: "problemSolving", label: "Problemløsning" },
                  { id: "creativity", label: "Kreativitet" },
                  { id: "teamwork", label: "Samarbeid" },
                  { id: "technology", label: "Teknologi" },
                  { id: "organization", label: "Organisering" },
                  { id: "leadership", label: "Ledelse" },
                  { id: "learning", label: "Lære nye ting" },
                  { id: "analysis", label: "Analysere informasjon" },
                  { id: "practical", label: "Praktiske ferdigheter" },
                ].map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={`highSchool.improveSkills.${item.id}`}
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

export default InterestsAndSkills;
