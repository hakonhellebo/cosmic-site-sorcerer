
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Introduction = ({ form }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Introduksjon og bakgrunn</h2>
      <p className="text-muted-foreground mb-6">
        Fortell oss litt om deg selv for at vi kan forstå din situasjon.
      </p>

      {/* Current Grade */}
      <FormField
        control={form.control}
        name="highSchool.grade"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">Hvilket trinn går du på?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="vg1" />
                  </FormControl>
                  <FormLabel className="font-normal">VG1</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="vg2" />
                  </FormControl>
                  <FormLabel className="font-normal">VG2</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="vg3" />
                  </FormControl>
                  <FormLabel className="font-normal">VG3</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Study Direction */}
      <FormField
        control={form.control}
        name="highSchool.studyDirection"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">Hvilken studieretning tar du?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
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
                    <RadioGroupItem value="art-design-architecture" />
                  </FormControl>
                  <FormLabel className="font-normal">Kunst, design og arkitektur</FormLabel>
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
                  <FormLabel className="font-normal">Musikk, dans og drama</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="media-communication" />
                  </FormControl>
                  <FormLabel className="font-normal">Medier og kommunikasjon</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Average Grade */}
      <FormField
        control={form.control}
        name="highSchool.averageGrade"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">Hva er omtrent snittet ditt?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="5-6" />
                  </FormControl>
                  <FormLabel className="font-normal">5-6</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="4-5" />
                  </FormControl>
                  <FormLabel className="font-normal">4-5</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="3-4" />
                  </FormControl>
                  <FormLabel className="font-normal">3-4</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="2-3" />
                  </FormControl>
                  <FormLabel className="font-normal">2-3</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="below-2" />
                  </FormControl>
                  <FormLabel className="font-normal">Under 2</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default Introduction;
