
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface WorkerQuestionnaireProps {
  form: UseFormReturn<any>;
  page: number;
  onPrevious: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const WorkerQuestionnaire: React.FC<WorkerQuestionnaireProps> = ({
  form,
  page,
  onPrevious,
  onSubmit,
  isSubmitting,
}) => {
  
  // Page 1 - Utdanning
  if (page === 1) {
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
              <FormDescription>Mål: Kartlegge utdanningsnivå</FormDescription>
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
                          const currentValues = { ...field.value } || {};
                          
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
              <FormDescription>Mål: Forstå hvilken studieretning som fører til arbeid</FormDescription>
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
                <Input placeholder="Skriv inn annet studieområde" {...field} />
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
              <FormDescription>Mål: Avdekke om det er gap mellom utdanning og arbeid</FormDescription>
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
                          const currentValues = { ...field.value } || {};
                          
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
              <FormDescription>Mål: Forstå hva utdanning faktisk leverer</FormDescription>
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={page === 1}
          >
            Tilbake
          </Button>
          <Button type="button" onClick={onSubmit}>
            Fortsett
          </Button>
        </div>
      </div>
    );
  }

  // Page 2 - Arbeid
  if (page === 2) {
    return (
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="worker.currentJob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hva er ditt nåværende yrke?</FormLabel>
              <FormControl>
                <Input placeholder="Skriv inn din jobbstilling" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>Mål: Få konkret informasjon om jobbrolle</FormDescription>
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
              <FormDescription>Mål: Forstå hvordan folk kommer seg inn på arbeidsmarkedet</FormDescription>
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
                <Input placeholder="Skriv inn annen metode" {...field} />
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
              <FormDescription>Mål: Finne ut hvor raskt folk etablerer seg</FormDescription>
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
                <Input placeholder="F.eks. 450 000 kr" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>Mål: Få innsikt i økonomiske forhold ved oppstart</FormDescription>
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
          >
            Tilbake
          </Button>
          <Button 
            type="button" 
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sender inn..." : "Send inn"}
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default WorkerQuestionnaire;
