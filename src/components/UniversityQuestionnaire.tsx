import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const UniversityQuestionnaire = ({
  form,
  page,
  onPrevious,
  onSubmit,
  isSubmitting = false
}) => {
  if (page === 1) {
    return (
      <div className="space-y-8">
        <div>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="university.studyField"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>1. Hva studerer du?</FormLabel>
                  <FormControl>
                    <Input placeholder="F.eks. Informatikk, Økonomi, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university.institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>2. Hvilket studiested går du på?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Velg studiested" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="uio">Universitetet i Oslo</SelectItem>
                      <SelectItem value="ntnu">NTNU</SelectItem>
                      <SelectItem value="uib">Universitetet i Bergen</SelectItem>
                      <SelectItem value="bi">BI</SelectItem>
                      <SelectItem value="nhh">NHH</SelectItem>
                      <SelectItem value="hinn">Høgskolen i Innlandet</SelectItem>
                      <SelectItem value="other">Annet</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("university.institution") === "other" && (
              <FormField
                control={form.control}
                name="university.otherInstitution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annet studiested</FormLabel>
                    <FormControl>
                      <Input placeholder="Skriv navn på studiested" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="university.level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>3. Hvilket nivå er du på i studiet?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Velg nivå" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bachelor1">Bachelor, år 1</SelectItem>
                      <SelectItem value="bachelor2">Bachelor, år 2</SelectItem>
                      <SelectItem value="bachelor3">Bachelor, år 3</SelectItem>
                      <SelectItem value="master1">Master, år 1</SelectItem>
                      <SelectItem value="master2">Master, år 2</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                      <SelectItem value="single">Jeg tar enkeltemner</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university.changedField"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>4. Har du byttet studieretning underveis?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="changed-yes" />
                        <Label htmlFor="changed-yes">Ja</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="changed-no" />
                        <Label htmlFor="changed-no">Nei</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university.certaintylevel"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>5. Hvor sikker er du på at du har valgt riktig studie?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="very" id="certainty-very" />
                        <Label htmlFor="certainty-very">Veldig sikker</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="quite" id="certainty-quite" />
                        <Label htmlFor="certainty-quite">Ganske sikker</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="little" id="certainty-little" />
                        <Label htmlFor="certainty-little">Litt usikker</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not" id="certainty-not" />
                        <Label htmlFor="certainty-not">Helt usikker</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="button" onClick={onSubmit} className="rounded-full">
            Neste
          </Button>
        </div>
      </div>
    );
  } else if (page === 2) {
    return (
      <div className="space-y-8">
        <div>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="university.interests"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>6. Hvilke fagfelt interesserer deg mest? (Velg opptil 3)</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Teknologi', 
                      'Økonomi', 
                      'Samfunnsvitenskap', 
                      'Humaniora', 
                      'Naturvitenskap',
                      'Helse',
                      'Kunst og design',
                      'Ingeniørfag',
                      'Lærerutdanning',
                      'Jus'
                    ].map((subject) => (
                      <FormField
                        key={subject}
                        control={form.control}
                        name={`university.interests.${subject.toLowerCase().replace(/\s+/g, '_')}`}
                        render={({ field }) => (
                          <FormItem
                            key={subject}
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
                                {subject}
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
              name="university.strengths"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>7. Hvilke ferdigheter føler du at du har styrke i? (Velg opptil 3)</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Kritisk tenkning',
                      'Problemløsning',
                      'Kreativitet',
                      'Kommunikasjon',
                      'Selvledelse',
                      'Prosjektstyring',
                      'Teknologiforståelse',
                      'Empati'
                    ].map((strength) => (
                      <FormField
                        key={strength}
                        control={form.control}
                        name={`university.strengths.${strength.toLowerCase().replace(/\s+/g, '_')}`}
                        render={({ field }) => (
                          <FormItem
                            key={strength}
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
                                {strength}
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
              name="university.weaknesses"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>8. Hvilke ferdigheter føler du at du mangler? (Velg opptil 3)</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Kritisk tenkning',
                      'Problemløsning',
                      'Kreativitet',
                      'Kommunikasjon',
                      'Selvledelse',
                      'Prosjektstyring',
                      'Teknologiforståelse',
                      'Empati'
                    ].map((weakness) => (
                      <FormField
                        key={weakness}
                        control={form.control}
                        name={`university.weaknesses.${weakness.toLowerCase().replace(/\s+/g, '_')}`}
                        render={({ field }) => (
                          <FormItem
                            key={weakness}
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
                                {weakness}
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
              name="university.learningStyle"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>9. Hvordan lærer du best? (Velg opptil 2)</FormLabel>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      'Ved å lese',
                      'Ved å lytte til forelesninger',
                      'Ved å gjøre praktiske oppgaver',
                      'Ved å diskutere med andre',
                      'Ved å se videoer'
                    ].map((style) => (
                      <FormField
                        key={style}
                        control={form.control}
                        name={`university.learningStyle.${style.toLowerCase().replace(/\s+/g, '_')}`}
                        render={({ field }) => (
                          <FormItem
                            key={style}
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
                                {style}
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
              name="university.collaboration"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>10. Hvor ofte samarbeider du med andre i studiene dine?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="daily" id="collab-daily" />
                        <Label htmlFor="collab-daily">Daglig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="collab-weekly" />
                        <Label htmlFor="collab-weekly">Ukentlig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="collab-monthly" />
                        <Label htmlFor="collab-monthly">Månedlig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rarely" id="collab-rarely" />
                        <Label htmlFor="collab-rarely">Sjeldnere enn månedlig</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university.aiUsage"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>11. Hvor ofte bruker du AI (f.eks. ChatGPT) i skolearbeidet?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="daily" id="ai-daily" />
                        <Label htmlFor="ai-daily">Daglig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="ai-weekly" />
                        <Label htmlFor="ai-weekly">Ukentlig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="ai-monthly" />
                        <Label htmlFor="ai-monthly">Månedlig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rarely" id="ai-rarely" />
                        <Label htmlFor="ai-rarely">Sjeldnere enn månedlig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="never" id="ai-never" />
                        <Label htmlFor="ai-never">Aldri</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university.internship"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>12. Har du hatt praksis gjennom studiene dine?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="intern-yes" />
                        <Label htmlFor="intern-yes">Ja</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="intern-no" />
                        <Label htmlFor="intern-no">Nei</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("university.internship") === "yes" && (
              <FormField
                control={form.control}
                name="university.internshipValue"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>13. Hvis ja – hvor nyttig var det?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="very" id="intern-very" />
                          <Label htmlFor="intern-very">Veldig nyttig</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="somewhat" id="intern-somewhat" />
                          <Label htmlFor="intern-somewhat">Litt nyttig</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="not-really" id="intern-not-really" />
                          <Label htmlFor="intern-not-really">Ikke særlig nyttig</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="not-at-all" id="intern-not-at-all" />
                          <Label htmlFor="intern-not-at-all">Ikke nyttig i det hele tatt</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onPrevious}
            className="rounded-full"
          >
            Tilbake
          </Button>
          <Button 
            type="button" 
            onClick={onSubmit}
            className="rounded-full"
          >
            Neste
          </Button>
        </div>
      </div>
    );
  } else if (page === 3) {
    return (
      <div className="space-y-8">
        <div>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="university.studyReason"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>14. Hva er den viktigste grunnen til at du studerer?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="job-security" id="reason-job" />
                        <Label htmlFor="reason-job">For å få en sikker jobb</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="earnings" id="reason-earnings" />
                        <Label htmlFor="reason-earnings">For å tjene godt</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="difference" id="reason-difference" />
                        <Label htmlFor="reason-difference">For å gjøre en forskjell</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="passion" id="reason-passion" />
                        <Label htmlFor="reason-passion">For å følge lidenskapen min</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="unsure" id="reason-unsure" />
                        <Label htmlFor="reason-unsure">Jeg vet ikke ennå</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university.salaryImportance"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>15. Hvor viktig er det for deg å ha en jobb med høy lønn?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="very" id="salary-very" />
                        <Label htmlFor="salary-very">Veldig viktig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="somewhat" id="salary-somewhat" />
                        <Label htmlFor="salary-somewhat">Litt viktig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-really" id="salary-not-really" />
                        <Label htmlFor="salary-not-really">Ikke så viktig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-at-all" id="salary-not-at-all" />
                        <Label htmlFor="salary-not-at-all">Ikke viktig i det hele tatt</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university.impactImportance"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>16. Hvor viktig er det for deg å gjøre en forskjell i samfunnet?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="very" id="impact-very" />
                        <Label htmlFor="impact-very">Veldig viktig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="somewhat" id="impact-somewhat" />
                        <Label htmlFor="impact-somewhat">Litt viktig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-really" id="impact-not-really" />
                        <Label htmlFor="impact-not-really">Ikke så viktig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-at-all" id="impact-not-at-all" />
                        <Label htmlFor="impact-not-at-all">Ikke viktig i det hele tatt</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university.jobPriorities"
              render={() => (
                <FormItem>
                  <FormLabel>17. Hva er viktigst for deg i en jobb? (Velg opptil 2)</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {['Fleksibilitet', 'Høy lønn', 'Stabilitet', 'Karrieremuligheter', 
                      'Mening i arbeidet', 'Innovasjon'].map((priority) => (
                      <FormField
                        key={priority}
                        control={form.control}
                        name={`university.jobPriorities.${priority.toLowerCase().replace(/ /g, '_')}`}
                        render={({ field }) => {
                          return (
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id={`priority-${priority.toLowerCase().replace(/ /g, '_')}`} 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <Label htmlFor={`priority-${priority.toLowerCase().replace(/ /g, '_')}`}>{priority}</Label>
                            </div>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university.jobChallenges"
              render={() => (
                <FormItem>
                  <FormLabel>18. Hva tror du kommer til å bli den største utfordringen når du søker jobb? (Velg opptil 2)</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {['Konkurranse', 'Manglende erfaring', 'Høye krav fra arbeidsgiver', 
                      'Vet ikke hva jeg vil jobbe med'].map((challenge) => (
                      <FormField
                        key={challenge}
                        control={form.control}
                        name={`university.jobChallenges.${challenge.toLowerCase().replace(/ /g, '_')}`}
                        render={({ field }) => {
                          return (
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id={`challenge-${challenge.toLowerCase().replace(/ /g, '_')}`} 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <Label htmlFor={`challenge-${challenge.toLowerCase().replace(/ /g, '_')}`}>{challenge}</Label>
                            </div>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university.internationalImportance"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>19. Hvor viktig er det for deg å jobbe internasjonalt?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="very" id="international-very" />
                        <Label htmlFor="international-very">Veldig viktig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="somewhat" id="international-somewhat" />
                        <Label htmlFor="international-somewhat">Litt viktig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-really" id="international-not-really" />
                        <Label htmlFor="international-not-really">Ikke så viktig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-at-all" id="international-not-at-all" />
                        <Label htmlFor="international-not-at-all">Ikke viktig i det hele tatt</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university.entrepreneurship"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>20. Kunne du tenke deg å starte egen bedrift i fremtiden?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="entrepreneur-yes" />
                        <Label htmlFor="entrepreneur-yes">Ja</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="entrepreneur-no" />
                        <Label htmlFor="entrepreneur-no">Nei</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="maybe" id="entrepreneur-maybe" />
                        <Label htmlFor="entrepreneur-maybe">Kanskje</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onPrevious}
            className="rounded-full"
          >
            Tilbake
          </Button>
          <Button 
            type="button" 
            onClick={onSubmit}
            className="rounded-full"
          >
            Neste
          </Button>
        </div>
      </div>
    );
  } else if (page === 4) {
    return (
      <div className="space-y-8">
        <div>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="university.futureRole"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>21. Hvordan ser du for deg arbeidshverdagen din om 10 år?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="leadership" id="role-leadership" />
                        <Label htmlFor="role-leadership">I en lederrolle</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="specialist" id="role-specialist" />
                        <Label htmlFor="role-specialist">I en spesialistrolle</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="entrepreneur" id="role-entrepreneur" />
                        <Label htmlFor="role-entrepreneur">Driver egen bedrift</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="unsure" id="role-unsure" />
                        <Label htmlFor="role-unsure">Vet ikke ennå</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university.employerPriorities"
              render={() => (
                <FormItem>
                  <FormLabel>22. Hva er viktigst for deg i en fremtidig arbeidsgiver? (Velg opptil 2)</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {['Høy lønn', 'Godt arbeidsmiljø', 'Karriereutvikling', 'Stabilitet', 'Innovasjon'].map((priority) => (
                      <FormField
                        key={priority}
                        control={form.control}
                        name={`university.employerPriorities.${priority.toLowerCase().replace(/ /g, '_')}`}
                        render={({ field }) => {
                          return (
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id={`employer-${priority.toLowerCase().replace(/ /g, '_')}`} 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <Label htmlFor={`employer-${priority.toLowerCase().replace(/ /g, '_')}`}>{priority}</Label>
                            </div>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university.preferredCompanyType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>23. Hva slags bedrift ønsker du helst å jobbe i?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="startup" id="company-startup" />
                        <Label htmlFor="company-startup">Startup</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sme" id="company-sme" />
                        <Label htmlFor="company-sme">Lite/mellomstort selskap</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="large" id="company-large" />
                        <Label htmlFor="company-large">Stort konsern</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="company-public" />
                        <Label htmlFor="company-public">Offentlig sektor</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ngo" id="company-ngo" />
                        <Label htmlFor="company-ngo">Frivillig sektor</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="unsure" id="company-unsure" />
                        <Label htmlFor="company-unsure">Jeg vet ikke ennå</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university.techImportance"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>24. Hvor viktig er det for deg å jobbe med teknologi i fremtidig jobb?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="very" id="tech-very" />
                        <Label htmlFor="tech-very">Veldig viktig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="somewhat" id="tech-somewhat" />
                        <Label htmlFor="tech-somewhat">Litt viktig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-really" id="tech-not-really" />
                        <Label htmlFor="tech-not-really">Ikke så viktig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-at-all" id="tech-not-at-all" />
                        <Label htmlFor="tech-not-at-all">Ikke viktig i det hele tatt</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university.workLifeBalance"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>25. Hvordan ser du på balansen mellom jobb og fritid?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="work-first" id="balance-work-first" />
                        <Label htmlFor="balance-work-first">Jeg prioriterer jobb først</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="balanced" id="balance-balanced" />
                        <Label htmlFor="balance-balanced">Jeg prioriterer balanse mellom jobb og fritid</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="life-first" id="balance-life-first" />
                        <Label htmlFor="balance-life-first">Jeg prioriterer fritid først</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university.remoteWorkImportance"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>26. Hvor viktig er det for deg å ha mulighet til å jobbe hjemmefra?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="very" id="remote-very" />
                        <Label htmlFor="remote-very">Veldig viktig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="somewhat" id="remote-somewhat" />
                        <Label htmlFor="remote-somewhat">Litt viktig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-really" id="remote-not-really" />
                        <Label htmlFor="remote-not-really">Ikke så viktig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-at-all" id="remote-not-at-all" />
                        <Label htmlFor="remote-not-at-all">Ikke viktig i det hele tatt</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university.travelImportance"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>27. Hvor viktig er det for deg å ha en jobb som involverer reising?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="very" id="travel-very" />
                        <Label htmlFor="travel-very">Veldig viktig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="somewhat" id="travel-somewhat" />
                        <Label htmlFor="travel-somewhat">Litt viktig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-really" id="travel-not-really" />
                        <Label htmlFor="travel-not-really">Ikke så viktig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-at-all" id="travel-not-at-all" />
                        <Label htmlFor="travel-not-at-all">Ikke viktig i det hele tatt</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university.satisfactionFactors"
              render={() => (
                <FormItem>
                  <FormLabel>28. Hvilke faktorer tror du vil gi deg mest tilfredshet i jobben? (Velg opptil 2)</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {['Meningsfylt arbeid', 'Høy lønn', 'Karriereutvikling', 'Fleksibilitet', 'Innovasjon', 'Stabilitet'].map((factor) => (
                      <FormField
                        key={factor}
                        control={form.control}
                        name={`university.satisfactionFactors.${factor.toLowerCase().replace(/ /g, '_')}`}
                        render={({ field }) => {
                          return (
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id={`factor-${factor.toLowerCase().replace(/ /g, '_')}`} 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <Label htmlFor={`factor-${factor.toLowerCase().replace(/ /g, '_')}`}>{factor}</Label>
                            </div>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university.valueImportance"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>29. Hvor viktig er det for deg at arbeidsgiveren din har tydelige verdier?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="very" id="values-very" />
                        <Label htmlFor="values-very">Veldig viktig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="somewhat" id="values-somewhat" />
                        <Label htmlFor="values-somewhat">Litt viktig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-really" id="values-not-really" />
                        <Label htmlFor="values-not-really">Ikke så viktig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-at-all" id="values-not-at-all" />
                        <Label htmlFor="values-not-at-all">Ikke viktig i det hele tatt</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university.workEnvironment"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>30. Hvilke arbeidsmiljøer trives du best i?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="structured" id="env-structured" />
                        <Label htmlFor="env-structured">Strukturerte og organiserte</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="flexible" id="env-flexible" />
                        <Label htmlFor="env-flexible">Fleksible og kreative</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="social" id="env-social" />
                        <Label htmlFor="env-social">Sosiale og team-orienterte</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="independent" id="env-independent" />
                        <Label htmlFor="env-independent">Uavhengige og selvstyrte</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university.motivationSource"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>31. Er du mest motivert av å jobbe med mennesker eller teknologi?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="people" id="motivation-people" />
                        <Label htmlFor="motivation-people">Mennesker</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="technology" id="motivation-technology" />
                        <Label htmlFor="motivation-technology">Teknologi</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="motivation-both" />
                        <Label htmlFor="motivation-both">Begge</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="neither" id="motivation-neither" />
                        <Label htmlFor="motivation-neither">Ingen av delene</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university.projectPreference"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>32. Foretrekker du å jobbe med korte eller langsiktige prosjekter?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="short" id="project-short" />
                        <Label htmlFor="project-short">Korte prosjekter</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="long" id="project-long" />
                        <Label htmlFor="project-long">Langsiktige prosjekter</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="combination" id="project-combination" />
                        <Label htmlFor="project-combination">En kombinasjon</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university.uncertaintyResponse"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>33. Hvordan reagerer du på usikkerhet på arbeidsplassen?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="enjoy" id="uncertainty-enjoy" />
                        <Label htmlFor="uncertainty-enjoy">Trives med det</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="handle" id="uncertainty-handle" />
                        <Label htmlFor="uncertainty-handle">Håndterer det greit</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="challenging" id="uncertainty-challenging" />
                        <Label htmlFor="uncertainty-challenging">Synes det er utfordrende</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dislike" id="uncertainty-dislike" />
                        <Label htmlFor="uncertainty-dislike">Misliker det sterkt</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university.careerPathImportance"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>34. Hvor viktig er det for deg å ha en klar karrierevei?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="very" id="career-path-very" />
                        <Label htmlFor="career-path-very">Veldig viktig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="somewhat" id="career-path-somewhat" />
                        <Label htmlFor="career-path-somewhat">Litt viktig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-really" id="career-path-not-really" />
                        <Label htmlFor="career-path-not-really">Ikke så viktig</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-at-all" id="career-path-not-at-all" />
                        <Label htmlFor="career-path-not-at-all">Ikke viktig i det hele tatt</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university.dreamJob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>35. Hvis du kunne velge én jobb akkurat nå – hva ville det vært?</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Beskriv drømmejobben din her..." 
                      className="min-h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onPrevious}
            className="rounded-full"
            disabled={isSubmitting}
          >
            Tilbake
          </Button>
          <Button 
            type="submit" 
            onClick={onSubmit}
            className="rounded-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sender...
              </>
            ) : (
              "Fullfør"
            )}
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default UniversityQuestionnaire;
