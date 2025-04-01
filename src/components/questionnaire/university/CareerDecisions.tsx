
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const CareerDecisions = ({ form }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Karrierevalg</h2>
        <p className="text-muted-foreground mb-6">
          Fortell oss om dine valg og planer for karrieren
        </p>
        
        <div className="space-y-6">
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
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="interests" id="reason-interests" />
                      <Label htmlFor="reason-interests">Interesser</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="salary" id="reason-salary" />
                      <Label htmlFor="reason-salary">Lønn og jobbutsikter</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="prestige" id="reason-prestige" />
                      <Label htmlFor="reason-prestige">Prestisje/status</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="influence" id="reason-influence" />
                      <Label htmlFor="reason-influence">Påvirkning fra familie/venner</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="safe" id="reason-safe" />
                      <Label htmlFor="reason-safe">Valgte noe "trygt"</Label>
                    </div>
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

          {form.watch("university.studyChoiceReason") === "other" && (
            <FormField
              control={form.control}
              name="university.studyChoiceReasonOther"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spesifiser annen grunn</FormLabel>
                  <FormControl>
                    <Input placeholder="Skriv her..." {...field} />
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
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="private_sector" id="plan-private" />
                      <Label htmlFor="plan-private">Jobbe i privat sektor</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public_sector" id="plan-public" />
                      <Label htmlFor="plan-public">Jobbe i offentlig sektor</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="entrepreneurship" id="plan-entrepreneur" />
                      <Label htmlFor="plan-entrepreneur">Starte egen virksomhet</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="break" id="plan-break" />
                      <Label htmlFor="plan-break">Reise / ta pause</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="further_studies" id="plan-further-studies" />
                      <Label htmlFor="plan-further-studies">Studere videre</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="uncertain" id="plan-uncertain" />
                      <Label htmlFor="plan-uncertain">Usikker</Label>
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
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="formal" id="contact-formal" />
                      <Label htmlFor="contact-formal">Ja, gjennom foredrag / veiledning</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="network" id="contact-network" />
                      <Label htmlFor="contact-network">Ja, gjennom nettverk</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no_want" id="contact-no-want" />
                      <Label htmlFor="contact-no-want">Nei, men jeg ønsker det</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no_considered" id="contact-no-considered" />
                      <Label htmlFor="contact-no-considered">Nei, og har ikke vurdert det</Label>
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
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { value: 'practical', label: 'Praktisk erfaring' },
                    { value: 'relevant_subjects', label: 'Mer relevante fag' },
                    { value: 'guidance', label: 'Bedre veiledning' },
                    { value: 'industry_network', label: 'Nettverk til arbeidslivet' },
                    { value: 'flexibility', label: 'Mer fleksibilitet' },
                    { value: 'subject_career_connection', label: 'Tydeligere kobling mellom fag og yrker' },
                  ].map((item) => (
                    <FormField
                      key={item.value}
                      control={form.control}
                      name={`university.studyMissing.${item.value}`}
                      render={({ field }) => (
                        <FormItem
                          key={item.value}
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
                              {item.label}
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
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="seek_help" id="setback-help" />
                      <Label htmlFor="setback-help">Søker hjelp</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="try_self" id="setback-self" />
                      <Label htmlFor="setback-self">Prøver selv</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="procrastinate" id="setback-procrastinate" />
                      <Label htmlFor="setback-procrastinate">Skyver det foran meg</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lose_motivation" id="setback-motivation" />
                      <Label htmlFor="setback-motivation">Mister motivasjon</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="structure" id="setback-structure" />
                      <Label htmlFor="setback-structure">Løser det med struktur/plan</Label>
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
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high_salary" id="success-salary" />
                      <Label htmlFor="success-salary">Høy lønn</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="freedom" id="success-freedom" />
                      <Label htmlFor="success-freedom">Frihet</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="security" id="success-security" />
                      <Label htmlFor="success-security">Trygghet</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="impact" id="success-impact" />
                      <Label htmlFor="success-impact">Å påvirke samfunnet</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mastery" id="success-mastery" />
                      <Label htmlFor="success-mastery">Mestring</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="recognition" id="success-recognition" />
                      <Label htmlFor="success-recognition">Anerkjennelse</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="success-other" />
                      <Label htmlFor="success-other">Annet (spesifiser)</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("university.successMeaning") === "other" && (
            <FormField
              control={form.control}
              name="university.successMeaningOther"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spesifiser hva suksess betyr for deg</FormLabel>
                  <FormControl>
                    <Input placeholder="Skriv her..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerDecisions;
