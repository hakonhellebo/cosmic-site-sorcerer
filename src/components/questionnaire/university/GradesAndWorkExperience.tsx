
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

const GradesAndWorkExperience = ({ form }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Karakterer og arbeidserfaring</h2>
        <p className="text-muted-foreground mb-6">
          Fortell oss om dine karakterer og arbeidserfaringer
        </p>
        
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="university.highSchoolGrades"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>42. Hva var ditt snittkarakter fra videregående?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1-2" id="hs-grades-1-2" />
                      <Label htmlFor="hs-grades-1-2">1–2</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3-4" id="hs-grades-3-4" />
                      <Label htmlFor="hs-grades-3-4">3–4</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5-6" id="hs-grades-5-6" />
                      <Label htmlFor="hs-grades-5-6">5–6</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dont_remember" id="hs-grades-dont-remember" />
                      <Label htmlFor="hs-grades-dont-remember">Jeg husker ikke</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="university.currentGrades"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>43. Hvordan vil du beskrive karakterene dine i studiet så langt?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="current-grades-high" />
                      <Label htmlFor="current-grades-high">Høyt snitt (A–B)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="good" id="current-grades-good" />
                      <Label htmlFor="current-grades-good">Godt snitt (B–C)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="average" id="current-grades-average" />
                      <Label htmlFor="current-grades-average">Middels (C–D)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="current-grades-low" />
                      <Label htmlFor="current-grades-low">Lavt / strever (E eller lavere)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dont_know" id="current-grades-dont-know" />
                      <Label htmlFor="current-grades-dont-know">Jeg vet ikke ennå</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="university.bestSubjects"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>44. Hvilke fag presterer du best i? (Velg opptil 3)</FormLabel>
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
                      name={`university.bestSubjects.${subject.toLowerCase().replace(/\s+/g, '_')}`}
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
            name="university.hadJob"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>45. Har du hatt betalt jobb ved siden av studiene?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="had-job-yes" />
                      <Label htmlFor="had-job-yes">Ja</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="had-job-no" />
                      <Label htmlFor="had-job-no">Nei</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("university.hadJob") === "yes" && (
            <>
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
                        className="flex flex-col space-y-1"
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
                        { value: 'retail', label: 'Butikk/kundeservice' },
                        { value: 'health', label: 'Helse/omsorg' },
                        { value: 'technology', label: 'Teknologi/IT' },
                        { value: 'admin', label: 'Kontor/administrasjon' },
                        { value: 'teaching', label: 'Undervisning' },
                        { value: 'creative', label: 'Kreative bransjer' },
                        { value: 'logistics', label: 'Lager/logistikk' },
                        { value: 'other', label: 'Annet' },
                      ].map((item) => (
                        <FormField
                          key={item.value}
                          control={form.control}
                          name={`university.jobTypes.${item.value}`}
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
                name="university.industries"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>48. Hvilke bransjer har du jobbet innenfor? (flervalg)</FormLabel>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[
                        { value: 'retail_service', label: 'Handel og service' },
                        { value: 'technology', label: 'Teknologi' },
                        { value: 'healthcare', label: 'Helse og omsorg' },
                        { value: 'education', label: 'Utdanning' },
                        { value: 'consulting', label: 'Konsulent/økonomi' },
                        { value: 'government', label: 'Offentlig forvaltning' },
                        { value: 'creative', label: 'Media/kreativ næring' },
                        { value: 'other', label: 'Annet' },
                      ].map((item) => (
                        <FormField
                          key={item.value}
                          control={form.control}
                          name={`university.industries.${item.value}`}
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
                name="university.companies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>49. Hvilke selskaper har du jobbet for? (valgfritt)</FormLabel>
                    <FormControl>
                      <Input placeholder="Skriv selskapsnavn her..." {...field} />
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
                      <Input placeholder="Skriv stillingstitler her..." {...field} />
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
                        { value: 'collaboration', label: 'Samarbeid' },
                        { value: 'structure', label: 'Struktur og ansvar' },
                        { value: 'customer_service', label: 'Kundebehandling' },
                        { value: 'technical', label: 'Teknisk innsikt' },
                        { value: 'leadership', label: 'Ledelse' },
                        { value: 'communication', label: 'Kommunikasjon' },
                        { value: 'other', label: 'Annet' },
                      ].map((item) => (
                        <FormField
                          key={item.value}
                          control={form.control}
                          name={`university.jobLearning.${item.value}`}
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

              {form.watch("university.jobLearning.other") && (
                <FormField
                  control={form.control}
                  name="university.jobLearningOther"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spesifiser hva annet du har lært</FormLabel>
                      <FormControl>
                        <Input placeholder="Skriv her..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradesAndWorkExperience;
