
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface WorkExperienceProps {
  form: UseFormReturn<any>;
}

const WorkExperience: React.FC<WorkExperienceProps> = ({
  form,
}) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="worker.currentJob"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hva er ditt nåværende yrke?</FormLabel>
            <FormControl>
              <Input placeholder="Skriv inn din jobbstilling" {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="worker.firstJobMethod"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Hvordan fikk du din første jobb etter studiene?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                {['internship', 'nettverk', 'jobbportal', 'headhunting', 'rekrutterer'].map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <RadioGroupItem value={method} id={`method-${method}`} />
                    <Label htmlFor={`method-${method}`}>
                      {method === 'internship' && 'Internship'}
                      {method === 'nettverk' && 'Nettverk'}
                      {method === 'jobbportal' && 'Søknad gjennom jobbportal'}
                      {method === 'headhunting' && 'Head-hunting'}
                      {method === 'rekrutterer' && 'Rekrutterer'}
                    </Label>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="annet" id="method-annet" />
                  <Label htmlFor="method-annet">Annet</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="worker.otherMethod"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Annet (spesifiser)</FormLabel>
            <FormControl>
              <Input placeholder="Skriv inn annen metode" {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="worker.timeToJob"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Hvor mange år tok det før du fikk en jobb i ditt fagfelt?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                {['right-after', 'within-1', 'within-2', 'within-5', 'not-yet'].map((time) => (
                  <div key={time} className="flex items-center space-x-2">
                    <RadioGroupItem value={time} id={`time-${time}`} />
                    <Label htmlFor={`time-${time}`}>
                      {time === 'right-after' && 'Rett etter studiene'}
                      {time === 'within-1' && 'Innen 1 år'}
                      {time === 'within-2' && 'Innen 2 år'}
                      {time === 'within-5' && 'Innen 5 år'}
                      {time === 'not-yet' && 'Har fortsatt ikke fått jobb i mitt fagfelt'}
                    </Label>
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
        name="worker.startingSalary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hva var startlønnen din?</FormLabel>
            <FormControl>
              <Input placeholder="F.eks. 450 000 kr" {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default WorkExperience;
