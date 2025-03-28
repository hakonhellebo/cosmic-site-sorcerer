
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
import { Checkbox } from "@/components/ui/checkbox";

interface EducationBackgroundProps {
  form: UseFormReturn<any>;
}

const EducationBackground: React.FC<EducationBackgroundProps> = ({
  form,
}) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="worker.educationLevel"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Hva er ditt høyeste utdanningsnivå?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                {['videregaende', 'fagskole', 'bachelor', 'master', 'phd', 'ingen'].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <RadioGroupItem value={level} id={`level-${level}`} />
                    <Label htmlFor={`level-${level}`}>
                      {level === 'videregaende' && 'Videregående skole'}
                      {level === 'fagskole' && 'Fagskole'}
                      {level === 'bachelor' && 'Bachelorgrad'}
                      {level === 'master' && 'Mastergrad'}
                      {level === 'phd' && 'Doktorgrad'}
                      {level === 'ingen' && 'Ingen formell utdanning'}
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
        name="worker.studyField"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Hva studerte du? (Velg opptil 2)</FormLabel>
            <FormControl>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  'teknologi',
                  'okonomi',
                  'helse',
                  'kunst',
                  'ingeniorfag',
                  'humaniora',
                  'samfunnsvitenskap',
                  'jus'
                ].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`field-${option}`}
                      checked={field.value?.[option] || false}
                      onCheckedChange={(checked) => {
                        // Create a new object for immutability, using empty object as fallback if field.value is null/undefined
                        const currentValues = field.value ? { ...field.value } : {};
                        
                        // Count existing selections
                        const selectedCount = Object.values(currentValues).filter(Boolean).length;
                        
                        // If this is being checked and we already have 2 selections
                        if (checked && selectedCount >= 2) {
                          // Find the first selected option and unselect it
                          const firstSelected = Object.keys(currentValues).find(key => currentValues[key]);
                          if (firstSelected) {
                            currentValues[firstSelected] = false;
                          }
                        }
                        
                        currentValues[option] = checked;
                        field.onChange(currentValues);
                      }}
                    />
                    <Label htmlFor={`field-${option}`}>
                      {option === 'teknologi' && 'Teknologi'}
                      {option === 'okonomi' && 'Økonomi/Finans'}
                      {option === 'helse' && 'Helse'}
                      {option === 'kunst' && 'Kunst/Design'}
                      {option === 'ingeniorfag' && 'Ingeniørfag'}
                      {option === 'humaniora' && 'Humaniora'}
                      {option === 'samfunnsvitenskap' && 'Samfunnsvitenskap'}
                      {option === 'jus' && 'Jus'}
                    </Label>
                  </div>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="worker.otherField"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Annet (spesifiser)</FormLabel>
            <FormControl>
              <Input placeholder="Skriv inn annet studieområde" {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="worker.preparedness"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Føler du at utdanningen din forberedte deg godt på arbeidslivet?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                {['very-well', 'well', 'somewhat', 'not-at-all'].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <RadioGroupItem value={level} id={`preparedness-${level}`} />
                    <Label htmlFor={`preparedness-${level}`}>
                      {level === 'very-well' && 'Ja, svært godt'}
                      {level === 'well' && 'Ja, ganske godt'}
                      {level === 'somewhat' && 'Litt'}
                      {level === 'not-at-all' && 'Ikke i det hele tatt'}
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
        name="worker.usedSkills"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Hvilke ferdigheter fra utdanningen din bruker du mest i jobben? (Velg opptil 2)</FormLabel>
            <FormControl>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  'problemlosning',
                  'kritisk-tenkning',
                  'teknisk-kompetanse',
                  'kommunikasjon',
                  'samarbeid',
                  'ledelse',
                  'kreativitet'
                ].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`skill-${option}`}
                      checked={field.value?.[option] || false}
                      onCheckedChange={(checked) => {
                        // Create a new object for immutability, using empty object as fallback if field.value is null/undefined
                        const currentValues = field.value ? { ...field.value } : {};
                        
                        // Count existing selections
                        const selectedCount = Object.values(currentValues).filter(Boolean).length;
                        
                        // If this is being checked and we already have 2 selections
                        if (checked && selectedCount >= 2) {
                          // Find the first selected option and unselect it
                          const firstSelected = Object.keys(currentValues).find(key => currentValues[key]);
                          if (firstSelected) {
                            currentValues[firstSelected] = false;
                          }
                        }
                        
                        currentValues[option] = checked;
                        field.onChange(currentValues);
                      }}
                    />
                    <Label htmlFor={`skill-${option}`}>
                      {option === 'problemlosning' && 'Problemløsning'}
                      {option === 'kritisk-tenkning' && 'Kritisk tenkning'}
                      {option === 'teknisk-kompetanse' && 'Teknisk kompetanse'}
                      {option === 'kommunikasjon' && 'Kommunikasjon'}
                      {option === 'samarbeid' && 'Samarbeid'}
                      {option === 'ledelse' && 'Ledelse'}
                      {option === 'kreativitet' && 'Kreativitet'}
                    </Label>
                  </div>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default EducationBackground;
