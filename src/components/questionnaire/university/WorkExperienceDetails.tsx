
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

interface WorkExperienceDetailsProps {
  form: UseFormReturn<any>;
}

const WorkExperienceDetails: React.FC<WorkExperienceDetailsProps> = ({
  form,
}) => {
  // Get the value of had job from the form
  const hadJob = form.watch("university.hadJob");
  
  // If they haven't had a job, show a message
  if (hadJob !== "yes") {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">8. Arbeidserfaring detaljer</h2>
        <p className="text-lg mb-6">
          Du har oppgitt at du ikke har hatt betalt jobb ved siden av studiene. 
          Klikk "Send inn" nedenfor for å avslutte spørreskjemaet.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">8. Arbeidserfaring detaljer</h2>
      <p className="text-muted-foreground mb-6">Fortell oss mer om din arbeidserfaring</p>
      
      <FormField
        control={form.control}
        name="university.jobCount"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>46. Hvis ja – hvor mange jobber har du hatt totalt?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="job-count-1" />
                  <Label htmlFor="job-count-1">1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2-3" id="job-count-2-3" />
                  <Label htmlFor="job-count-2-3">2–3</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4+" id="job-count-4+" />
                  <Label htmlFor="job-count-4+">4+</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.jobTypes"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel>47. Hvilke typer stillinger har du hatt? (flervalg)</FormLabel>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { label: 'Butikk/kundeservice', value: 'butikk' },
                { label: 'Helse/omsorg', value: 'helse' },
                { label: 'Teknologi/IT', value: 'teknologi' },
                { label: 'Kontor/administrasjon', value: 'kontor' },
                { label: 'Undervisning', value: 'undervisning' },
                { label: 'Kreative bransjer', value: 'kreativ' },
                { label: 'Lager/logistikk', value: 'lager' },
                { label: 'Annet', value: 'annet' }
              ].map(({ label, value }) => (
                <FormField
                  key={value}
                  control={form.control}
                  name={`university.jobTypes.${value}`}
                  render={({ field }) => (
                    <FormItem
                      key={value}
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
                          {label}
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.industries"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel>48. Hvilke bransjer har du jobbet innenfor? (flervalg)</FormLabel>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { label: 'Handel og service', value: 'handel' },
                { label: 'Teknologi', value: 'teknologi' },
                { label: 'Helse og omsorg', value: 'helse' },
                { label: 'Utdanning', value: 'utdanning' },
                { label: 'Konsulent/økonomi', value: 'konsulent' },
                { label: 'Offentlig forvaltning', value: 'offentlig' },
                { label: 'Media/kreativ næring', value: 'media' },
                { label: 'Annet', value: 'annet' }
              ].map(({ label, value }) => (
                <FormField
                  key={value}
                  control={form.control}
                  name={`university.industries.${value}`}
                  render={({ field }) => (
                    <FormItem
                      key={value}
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
                          {label}
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.companies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>49. Hvilke selskaper har du jobbet for? (valgfritt)</FormLabel>
            <FormControl>
              <Input placeholder="F.eks. Rema 1000, Telenor, etc." {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.jobTitles"
        render={({ field }) => (
          <FormItem>
            <FormLabel>50. Hvilke stillingstitler har du hatt? (valgfritt)</FormLabel>
            <FormControl>
              <Input placeholder="F.eks. Butikkmedarbeider, Veileder, etc." {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.jobLearning"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel>51. Hva føler du at du har lært mest av i tidligere jobber? (flervalg)</FormLabel>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { label: 'Samarbeid', value: 'samarbeid' },
                { label: 'Struktur og ansvar', value: 'struktur' },
                { label: 'Kundebehandling', value: 'kundebehandling' },
                { label: 'Teknisk innsikt', value: 'teknisk' },
                { label: 'Ledelse', value: 'ledelse' },
                { label: 'Kommunikasjon', value: 'kommunikasjon' },
                { label: 'Annet', value: 'annet' }
              ].map(({ label, value }) => (
                <FormField
                  key={value}
                  control={form.control}
                  name={`university.jobLearning.${value}`}
                  render={({ field }) => (
                    <FormItem
                      key={value}
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
                          {label}
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch("university.jobLearning.annet") && (
        <FormField
          control={form.control}
          name="university.jobLearningOther"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spesifiser annet læringsområde</FormLabel>
              <FormControl>
                <Input placeholder="Skriv inn hva du har lært" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default WorkExperienceDetails;
