
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

interface ReflectionAndTransitionProps {
  form: UseFormReturn<any>;
}

const ReflectionAndTransition: React.FC<ReflectionAndTransitionProps> = ({
  form,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">7. Refleksjon og overgang til arbeidslivet</h2>
      <p className="text-muted-foreground mb-6">Del dine tanker om studievalg og fremtiden</p>
      
      <FormField
        control={form.control}
        name="university.studyChoiceReason"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>36. Hva var den viktigste grunnen til at du valgte studiet du går på?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="interesser" id="reason-interesser" />
                  <Label htmlFor="reason-interesser">Interesser</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lonn" id="reason-lonn" />
                  <Label htmlFor="reason-lonn">Lønn og jobbutsikter</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prestisje" id="reason-prestisje" />
                  <Label htmlFor="reason-prestisje">Prestisje/status</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pavirkning" id="reason-pavirkning" />
                  <Label htmlFor="reason-pavirkning">Påvirkning fra familie/venner</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="trygt" id="reason-trygt" />
                  <Label htmlFor="reason-trygt">Valgte noe "trygt"</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="annet" id="reason-annet" />
                  <Label htmlFor="reason-annet">Annet</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {form.watch("university.studyChoiceReason") === "annet" && (
        <FormField
          control={form.control}
          name="university.studyChoiceReasonOther"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spesifiser annen grunn</FormLabel>
              <FormControl>
                <Input placeholder="Skriv inn din begrunnelse" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="university.postStudyPlan"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>37. Hva planlegger du å gjøre det første året etter fullført studie?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="privat" id="plan-privat" />
                  <Label htmlFor="plan-privat">Jobbe i privat sektor</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="offentlig" id="plan-offentlig" />
                  <Label htmlFor="plan-offentlig">Jobbe i offentlig sektor</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="egen" id="plan-egen" />
                  <Label htmlFor="plan-egen">Starte egen virksomhet</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reise" id="plan-reise" />
                  <Label htmlFor="plan-reise">Reise / ta pause</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="videre" id="plan-videre" />
                  <Label htmlFor="plan-videre">Studere videre</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="usikker" id="plan-usikker" />
                  <Label htmlFor="plan-usikker">Usikker</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.industryContact"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>38. Har du hatt kontakt med personer som jobber i bransjen du vurderer?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="foredrag" id="contact-foredrag" />
                  <Label htmlFor="contact-foredrag">Ja, gjennom foredrag / veiledning</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nettverk" id="contact-nettverk" />
                  <Label htmlFor="contact-nettverk">Ja, gjennom nettverk</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="onsker" id="contact-onsker" />
                  <Label htmlFor="contact-onsker">Nei, men jeg ønsker det</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ikke" id="contact-ikke" />
                  <Label htmlFor="contact-ikke">Nei, og har ikke vurdert det</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.studyMissing"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel>39. Hva savner du mest i studiet ditt akkurat nå? (velg opptil 2)</FormLabel>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { label: 'Praktisk erfaring', value: 'praktisk_erfaring' },
                { label: 'Mer relevante fag', value: 'relevante_fag' },
                { label: 'Bedre veiledning', value: 'veiledning' },
                { label: 'Nettverk til arbeidslivet', value: 'nettverk' },
                { label: 'Mer fleksibilitet', value: 'fleksibilitet' },
                { label: 'Tydeligere kobling mellom fag og yrker', value: 'kobling' }
              ].map(({ label, value }) => (
                <FormField
                  key={value}
                  control={form.control}
                  name={`university.studyMissing.${value}`}
                  render={({ field }) => (
                    <FormItem
                      key={value}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            // Create a new object for immutability
                            const currentValues = form.getValues("university.studyMissing") || {};
                            
                            // Count existing selections
                            const selectedCount = Object.values(currentValues).filter(Boolean).length;
                            
                            // If this is being checked and we already have 2 selections
                            if (checked && selectedCount >= 2) {
                              // Find the first selected option and unselect it
                              const firstSelected = Object.keys(currentValues).find(key => currentValues[key]);
                              if (firstSelected) {
                                form.setValue(`university.studyMissing.${firstSelected}`, false);
                              }
                            }
                            
                            field.onChange(checked);
                          }}
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
        name="university.setbackReaction"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>40. Hvordan reagerer du på motgang i studiet?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hjelp" id="reaction-hjelp" />
                  <Label htmlFor="reaction-hjelp">Søker hjelp</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="selv" id="reaction-selv" />
                  <Label htmlFor="reaction-selv">Prøver selv</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="skyver" id="reaction-skyver" />
                  <Label htmlFor="reaction-skyver">Skyver det foran meg</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="motivasjon" id="reaction-motivasjon" />
                  <Label htmlFor="reaction-motivasjon">Mister motivasjon</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="struktur" id="reaction-struktur" />
                  <Label htmlFor="reaction-struktur">Løser det med struktur/plan</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university.successMeaning"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>41. Hva betyr suksess for deg?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lonn" id="success-lonn" />
                  <Label htmlFor="success-lonn">Høy lønn</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="frihet" id="success-frihet" />
                  <Label htmlFor="success-frihet">Frihet</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="trygghet" id="success-trygghet" />
                  <Label htmlFor="success-trygghet">Trygghet</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pavirke" id="success-pavirke" />
                  <Label htmlFor="success-pavirke">Å påvirke samfunnet</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mestring" id="success-mestring" />
                  <Label htmlFor="success-mestring">Mestring</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="anerkjennelse" id="success-anerkjennelse" />
                  <Label htmlFor="success-anerkjennelse">Anerkjennelse</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="annet" id="success-annet" />
                  <Label htmlFor="success-annet">Annet</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch("university.successMeaning") === "annet" && (
        <FormField
          control={form.control}
          name="university.successMeaningOther"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spesifiser annen betydning av suksess</FormLabel>
              <FormControl>
                <Input placeholder="Skriv inn din definisjon av suksess" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default ReflectionAndTransition;
