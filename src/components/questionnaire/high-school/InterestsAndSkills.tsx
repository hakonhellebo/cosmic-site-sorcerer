
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
                7. Hvilke av disse interesserer deg mest? (Velg opptil 3)
              </FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {[
                  { id: "technology", label: "Teknologi" },
                  { id: "artDesign", label: "Kunst og design" },
                  { id: "sports", label: "Fysisk aktivitet og sport" },
                  { id: "economyFinance", label: "Økonomi og finans" },
                  { id: "travelCulture", label: "Reiseliv og kultur" },
                  { id: "healthCare", label: "Helse og omsorg" },
                  { id: "environmentSustainability", label: "Miljø og bærekraft" },
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
                8. Hva slags arbeidsoppgaver trives du med? (Velg opptil 3)
              </FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {[
                  { id: "numbers", label: "Jobbe med tall og analyser" },
                  { id: "practical", label: "Løse praktiske problemer" },
                  { id: "writing", label: "Skrive og formidle" },
                  { id: "leadership", label: "Lede og organisere" },
                  { id: "creative", label: "Skape noe nytt (kunst, design, kode)" },
                  { id: "supportive", label: "Hjelpe og støtte andre" },
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
            <FormLabel className="text-base font-medium">9. Hva slags miljø trives du i?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="calm" />
                  </FormControl>
                  <FormLabel className="font-normal">Et rolig og strukturert miljø</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="creative" />
                  </FormControl>
                  <FormLabel className="font-normal">Et kreativt og dynamisk miljø</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="social" />
                  </FormControl>
                  <FormLabel className="font-normal">Et sosialt og samarbeidsorientert miljø</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="competitive" />
                  </FormControl>
                  <FormLabel className="font-normal">Et målrettet og konkurransepreget miljø</FormLabel>
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
            <FormLabel className="text-base font-medium">10. Liker du å jobbe alene eller i team?</FormLabel>
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
                  <FormLabel className="font-normal">Alene</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="team" />
                  </FormControl>
                  <FormLabel className="font-normal">I team</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="mixed" />
                  </FormControl>
                  <FormLabel className="font-normal">Litt av begge deler</FormLabel>
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
                11. Hvilke ferdigheter føler du at du er god på? (Velg opptil 3)
              </FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {[
                  { id: "communication", label: "Kommunikasjon" },
                  { id: "logicalThinking", label: "Logisk tenkning" },
                  { id: "creativity", label: "Kreativitet" },
                  { id: "technicalUnderstanding", label: "Teknisk forståelse" },
                  { id: "leadership", label: "Ledelse" },
                  { id: "collaboration", label: "Samarbeid" },
                  { id: "problemSolving", label: "Problemløsning" },
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

      {/* Skills to Improve */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="highSchool.improveSkills"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                12. Hvilke av disse ferdighetene ønsker du å bli bedre på? (Velg opptil 3)
              </FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {[
                  { id: "communication", label: "Kommunikasjon" },
                  { id: "logicalThinking", label: "Logisk tenkning" },
                  { id: "creativity", label: "Kreativitet" },
                  { id: "technicalUnderstanding", label: "Teknisk forståelse" },
                  { id: "leadership", label: "Ledelse" },
                  { id: "collaboration", label: "Samarbeid" },
                  { id: "problemSolving", label: "Problemløsning" },
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
