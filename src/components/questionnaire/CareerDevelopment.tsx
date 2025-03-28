
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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface CareerDevelopmentProps {
  form: UseFormReturn<any>;
}

const CareerDevelopment: React.FC<CareerDevelopmentProps> = ({
  form,
}) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="worker.yearsWorking"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Hvor mange år har du vært i arbeidslivet?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                {[
                  { value: '0-2', label: '0–2 år' },
                  { value: '3-5', label: '3–5 år' },
                  { value: '6-10', label: '6–10 år' },
                  { value: '11-20', label: '11–20 år' },
                  { value: 'over-20', label: 'Over 20 år' },
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`years-${option.value}`} />
                    <Label htmlFor={`years-${option.value}`}>{option.label}</Label>
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
        name="worker.industryChange"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Har du byttet bransje i løpet av karrieren?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                {[
                  { value: 'once', label: 'Ja, én gang' },
                  { value: 'multiple', label: 'Ja, flere ganger' },
                  { value: 'never', label: 'Nei' },
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`industry-${option.value}`} />
                    <Label htmlFor={`industry-${option.value}`}>{option.label}</Label>
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
        name="worker.jobChanges"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Hvor mange ganger har du byttet jobb?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                {[
                  { value: 'never', label: 'Aldri' },
                  { value: '1-2', label: '1–2 ganger' },
                  { value: '3-5', label: '3–5 ganger' },
                  { value: 'more-than-5', label: 'Mer enn 5 ganger' },
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`changes-${option.value}`} />
                    <Label htmlFor={`changes-${option.value}`}>{option.label}</Label>
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
        name="worker.jobChangeReason"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Hva var hovedgrunnen til at du byttet jobb sist gang?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                {[
                  { value: 'higher-salary', label: 'Høyere lønn' },
                  { value: 'better-environment', label: 'Bedre arbeidsmiljø' },
                  { value: 'career-development', label: 'Ønsket karriereutvikling' },
                  { value: 'lack-challenges', label: 'Mangel på utfordringer' },
                  { value: 'conflict', label: 'Konflikt med leder/kollega' },
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`reason-${option.value}`} />
                    <Label htmlFor={`reason-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="reason-other" />
                  <Label htmlFor="reason-other">Annet</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="worker.jobChangeReasonOther"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Annet (spesifiser)</FormLabel>
            <FormControl>
              <Input placeholder="Skriv inn annen årsak" {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="worker.leadershipRole"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Har du hatt lederansvar i løpet av karrieren?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="leadership-yes" />
                  <Label htmlFor="leadership-yes">Ja</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="leadership-no" />
                  <Label htmlFor="leadership-no">Nei</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="worker.careerSatisfaction"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Hvor fornøyd er du med karriereutviklingen din så langt?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                {[
                  { value: 'very-satisfied', label: 'Svært fornøyd' },
                  { value: 'satisfied', label: 'Ganske fornøyd' },
                  { value: 'somewhat-satisfied', label: 'Litt fornøyd' },
                  { value: 'dissatisfied', label: 'Misfornøyd' },
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`satisfaction-${option.value}`} />
                    <Label htmlFor={`satisfaction-${option.value}`}>{option.label}</Label>
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
        name="worker.keySkill"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Hvilken ferdighet mener du har vært viktigst for å lykkes i karrieren?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                {[
                  { value: 'technical', label: 'Teknisk kompetanse' },
                  { value: 'network', label: 'Nettverk' },
                  { value: 'communication', label: 'Kommunikasjon' },
                  { value: 'leadership', label: 'Ledelse' },
                  { value: 'creativity', label: 'Kreativitet' },
                  { value: 'problem-solving', label: 'Problemløsning' },
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`key-skill-${option.value}`} />
                    <Label htmlFor={`key-skill-${option.value}`}>{option.label}</Label>
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
        name="worker.furtherEducation"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Har du tatt videreutdanning etter å ha startet å jobbe?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="further-education-yes" />
                  <Label htmlFor="further-education-yes">Ja</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="further-education-no" />
                  <Label htmlFor="further-education-no">Nei</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="worker.educationChange"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hvis du kunne gjort om på utdanningen din – hva ville du endret?</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Skriv svaret ditt her" 
                className="min-h-[100px]" 
                {...field}
                value={field.value || ""} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="worker.rightIndustry"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Føler du at du er i riktig bransje?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="right-industry-yes" />
                  <Label htmlFor="right-industry-yes">Ja</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="right-industry-no" />
                  <Label htmlFor="right-industry-no">Nei</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unsure" id="right-industry-unsure" />
                  <Label htmlFor="right-industry-unsure">Usikker</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CareerDevelopment;
