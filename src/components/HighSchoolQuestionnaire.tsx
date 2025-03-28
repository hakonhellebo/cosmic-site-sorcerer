import React, { useEffect } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const HighSchoolQuestionnaire = ({ 
  form, 
  setFormProgress, 
  currentPage, 
  totalPages, 
  onNextPage, 
  onPrevPage 
}) => {
  // Helper function to count selected checkboxes in a group
  const countSelectedCheckboxes = (fieldGroup) => {
    return Object.values(form.getValues(fieldGroup) || {}).filter(Boolean).length;
  };
  
  // Update progress on form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Calculate form progress based on filled fields
      const totalFields = 20; // Total number of required field groups
      let filledFields = 0;
      
      // Page 1
      if (value.highSchool.grade) filledFields++;
      if (value.highSchool.studyDirection) filledFields++;
      if (value.highSchool.averageGrade) filledFields++;
      if (countSelectedCheckboxes('highSchool.favoriteCourses') > 0) filledFields++;
      if (countSelectedCheckboxes('highSchool.difficultCourses') > 0) filledFields++;
      if (countSelectedCheckboxes('highSchool.educationPriorities') > 0) filledFields++;
      
      // Page 2
      if (countSelectedCheckboxes('highSchool.interests') > 0) filledFields++;
      if (countSelectedCheckboxes('highSchool.workTasks') > 0) filledFields++;
      if (value.highSchool.workEnvironment) filledFields++;
      if (value.highSchool.workPreference) filledFields++;
      if (countSelectedCheckboxes('highSchool.goodSkills') > 0) filledFields++;
      if (countSelectedCheckboxes('highSchool.improveSkills') > 0) filledFields++;
      
      // Page 3
      if (countSelectedCheckboxes('highSchool.bestSubjects') > 0) filledFields++;
      if (countSelectedCheckboxes('highSchool.challengingSubjects') > 0) filledFields++;
      if (countSelectedCheckboxes('highSchool.learningStyle') > 0) filledFields++;
      if (countSelectedCheckboxes('highSchool.digitalTools') > 0) filledFields++;
      if (value.highSchool.technologyComfort) filledFields++;
      if (countSelectedCheckboxes('highSchool.schoolChallenges') > 0) filledFields++;
      
      // Page 4
      if (value.highSchool.workIndependently) filledFields++;
      if (value.highSchool.preparedness) filledFields++;
      if (value.highSchool.collaboration) filledFields++;
      if (value.highSchool.aiUsage) filledFields++;
      if (countSelectedCheckboxes('highSchool.missingSkills') > 0) filledFields++;
      if (value.highSchool.studyTime) filledFields++;
      if (value.highSchool.workExperience) filledFields++;
      if (value.highSchool.workExperienceValue) filledFields++;
      
      const progress = Math.round((filledFields / totalFields) * 100);
      setFormProgress(progress);
    });
    
    return () => subscription.unsubscribe();
  }, [form, setFormProgress]);

  // Page 1 - Introduction and background
  const renderPage1 = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Introduksjon og bakgrunn</h2>
      <p className="text-muted-foreground mb-6">Fortell oss litt om din skolebakgrunn</p>
      
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="highSchool.grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hvilken klasse går du i?</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Velg klasse" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="10">10. klasse</SelectItem>
                  <SelectItem value="vg1">VG1</SelectItem>
                  <SelectItem value="vg2">VG2</SelectItem>
                  <SelectItem value="vg3">VG3</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highSchool.studyDirection"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hvilken studieretning går du på?</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Velg studieretning" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="general">Studiespesialisering</SelectItem>
                  <SelectItem value="vocational">Yrkesfag</SelectItem>
                  <SelectItem value="sports">Idrett</SelectItem>
                  <SelectItem value="arts">Musikk/Dans/Drama</SelectItem>
                  <SelectItem value="other">Annet</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highSchool.averageGrade"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Hvilket karaktergjennomsnitt har du ca. nå?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-2" id="grade1-2" />
                    <Label htmlFor="grade1-2">1-2</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3-4" id="grade3-4" />
                    <Label htmlFor="grade3-4">3-4</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5-6" id="grade5-6" />
                    <Label htmlFor="grade5-6">5-6</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unknown" id="gradeUnknown" />
                    <Label htmlFor="gradeUnknown">Vet ikke</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highSchool.favoriteCourses"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Hvilke av disse fagene liker du best? (Velg opptil 3)</FormLabel>
              </div>
              {form.formState.errors.highSchool?.favoriteCourses?.message && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.highSchool?.favoriteCourses?.message}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2">
                {['Matematikk', 'Norsk', 'Engelsk', 'Samfunnsfag', 'Naturfag', 
                  'Kroppsøving', 'Kunst og håndverk', 'Fremmedspråk'].map(
                  (subject) => (
                    <FormField
                      key={subject}
                      control={form.control}
                      name={`highSchool.favoriteCourses.${subject.toLowerCase().replace(/\s+/g, '_')}`}
                      render={({ field }) => (
                        <FormItem
                          key={subject}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                // Validate max selections after change
                                const currentCount = countSelectedCheckboxes('highSchool.favoriteCourses');
                                if (checked && currentCount > 3) {
                                  // Find the first checked box and uncheck it
                                  const keys = Object.keys(form.getValues('highSchool.favoriteCourses') || {});
                                  for (const key of keys) {
                                    if (
                                      form.getValues(`highSchool.favoriteCourses.${key}`) && 
                                      `highSchool.favoriteCourses.${key}` !== field.name
                                    ) {
                                      form.setValue(`highSchool.favoriteCourses.${key}`, false);
                                      break;
                                    }
                                  }
                                }
                              }}
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
                  )
                )}
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highSchool.difficultCourses"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Hvilke fag synes du er vanskeligst? (Velg opptil 3)</FormLabel>
              </div>
              {form.formState.errors.highSchool?.difficultCourses?.message && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.highSchool?.difficultCourses?.message}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2">
                {['Matematikk', 'Norsk', 'Engelsk', 'Samfunnsfag', 'Naturfag', 
                  'Kroppsøving', 'Kunst og håndverk', 'Fremmedspråk'].map(
                  (subject) => (
                    <FormField
                      key={subject}
                      control={form.control}
                      name={`highSchool.difficultCourses.${subject.toLowerCase().replace(/\s+/g, '_')}`}
                      render={({ field }) => (
                        <FormItem
                          key={subject}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                // Validate max selections after change
                                const currentCount = countSelectedCheckboxes('highSchool.difficultCourses');
                                if (checked && currentCount > 3) {
                                  // Find the first checked box and uncheck it
                                  const keys = Object.keys(form.getValues('highSchool.difficultCourses') || {});
                                  for (const key of keys) {
                                    if (
                                      form.getValues(`highSchool.difficultCourses.${key}`) && 
                                      `highSchool.difficultCourses.${key}` !== field.name
                                    ) {
                                      form.setValue(`highSchool.difficultCourses.${key}`, false);
                                      break;
                                    }
                                  }
                                }
                              }}
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
                  )
                )}
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highSchool.educationPriorities"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Hva er viktigst for deg når det gjelder utdanning? (Velg opptil 2)</FormLabel>
              </div>
              {form.formState.errors.highSchool?.educationPriorities?.message && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.highSchool?.educationPriorities?.message}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'good_pay', label: 'Få en godt betalt jobb' },
                  { id: 'follow_interests', label: 'Følge interessene mine' },
                  { id: 'job_security', label: 'Ha trygg jobb' },
                  { id: 'flexible_work', label: 'Ha en fleksibel arbeidshverdag' },
                  { id: 'meaningful_work', label: 'Jobbe med noe meningsfullt' },
                  { id: 'high_status', label: 'Oppnå høy status' }
                ].map(
                  (priority) => (
                    <FormField
                      key={priority.id}
                      control={form.control}
                      name={`highSchool.educationPriorities.${priority.id}`}
                      render={({ field }) => (
                        <FormItem
                          key={priority.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                // Validate max selections after change
                                const currentCount = countSelectedCheckboxes('highSchool.educationPriorities');
                                if (checked && currentCount > 2) {
                                  // Find the first checked box and uncheck it
                                  const keys = Object.keys(form.getValues('highSchool.educationPriorities') || {});
                                  for (const key of keys) {
                                    if (
                                      form.getValues(`highSchool.educationPriorities.${key}`) && 
                                      `highSchool.educationPriorities.${key}` !== field.name
                                    ) {
                                      form.setValue(`highSchool.educationPriorities.${key}`, false);
                                      break;
                                    }
                                  }
                                }
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              {priority.label}
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  )
                )}
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  // Page 2 - Interests and skills
  const renderPage2 = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Interesser og ferdigheter</h2>
      <p className="text-muted-foreground mb-6">Fortell oss om hva du er interessert i og god på</p>
      
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="highSchool.interests"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Hvilke av disse interesserer deg mest? (Velg opptil 3)</FormLabel>
              </div>
              {form.formState.errors.highSchool?.interests?.message && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.highSchool?.interests?.message}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2">
                {['Teknologi', 'Kunst og design', 'Fysisk aktivitet og sport', 'Økonomi og finans',
                  'Reiseliv og kultur', 'Helse og omsorg', 'Miljø og bærekraft'].map(
                  (interest) => (
                    <FormField
                      key={interest}
                      control={form.control}
                      name={`highSchool.interests.${interest.toLowerCase().replace(/\s+/g, '_')}`}
                      render={({ field }) => (
                        <FormItem
                          key={interest}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                // Validate max selections after change
                                const currentCount = countSelectedCheckboxes('highSchool.interests');
                                if (checked && currentCount > 3) {
                                  // Find the first checked box and uncheck it
                                  const keys = Object.keys(form.getValues('highSchool.interests') || {});
                                  for (const key of keys) {
                                    if (
                                      form.getValues(`highSchool.interests.${key}`) && 
                                      `highSchool.interests.${key}` !== field.name
                                    ) {
                                      form.setValue(`highSchool.interests.${key}`, false);
                                      break;
                                    }
                                  }
                                }
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              {interest}
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  )
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highSchool.workTasks"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Hva slags arbeidsoppgaver trives du med? (Velg opptil 3)</FormLabel>
              </div>
              {form.formState.errors.highSchool?.workTasks?.message && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.highSchool?.workTasks?.message}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'numbers_analysis', label: 'Jobbe med tall og analyser' },
                  { id: 'practical_problems', label: 'Løse praktiske problemer' },
                  { id: 'writing_communication', label: 'Skrive og formidle' },
                  { id: 'lead_organize', label: 'Lede og organisere' },
                  { id: 'create_new', label: 'Skape noe nytt (kunst, design, kode)' },
                  { id: 'help_support', label: 'Hjelpe og støtte andre' }
                ].map(
                  (task) => (
                    <FormField
                      key={task.id}
                      control={form.control}
                      name={`highSchool.workTasks.${task.id}`}
                      render={({ field }) => (
                        <FormItem
                          key={task.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                // Validate max selections after change
                                const currentCount = countSelectedCheckboxes('highSchool.workTasks');
                                if (checked && currentCount > 3) {
                                  // Find the first checked box and uncheck it
                                  const keys = Object.keys(form.getValues('highSchool.workTasks') || {});
                                  for (const key of keys) {
                                    if (
                                      form.getValues(`highSchool.workTasks.${key}`) && 
                                      `highSchool.workTasks.${key}` !== field.name
                                    ) {
                                      form.setValue(`highSchool.workTasks.${key}`, false);
                                      break;
                                    }
                                  }
                                }
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              {task.label}
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  )
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highSchool.workEnvironment"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Hva slags miljø trives du i?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="calm" id="env-calm" />
                    <Label htmlFor="env-calm">Et rolig og strukturert miljø</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="creative" id="env-creative" />
                    <Label htmlFor="env-creative">Et kreativt og dynamisk miljø</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="social" id="env-social" />
                    <Label htmlFor="env-social">Et sosialt og samarbeidsorientert miljø</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="competitive" id="env-competitive" />
                    <Label htmlFor="env-competitive">Et målrettet og konkurransepreget miljø</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highSchool.workPreference"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Liker du å jobbe alene eller i team?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="alone" id="work-alone" />
                    <Label htmlFor="work-alone">Alene</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="team" id="work-team" />
                    <Label htmlFor="work-team">I team</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="work-both" />
                    <Label htmlFor="work-both">Litt av begge deler</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highSchool.goodSkills"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Hvilke ferdigheter føler du at du er god på? (Velg opptil 3)</FormLabel>
              </div>
              {form.formState.errors.highSchool?.goodSkills?.message && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.highSchool?.goodSkills?.message}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Kommunikasjon', 'Logisk tenkning', 'Kreativitet', 'Teknisk forståelse',
                  'Ledelse', 'Samarbeid', 'Problemløsning'
                ].map(
                  (skill) => (
                    <FormField
                      key={skill}
                      control={form.control}
                      name={`highSchool.goodSkills.${skill.toLowerCase().replace(/\s+/g, '_')}`}
                      render={({ field }) => (
                        <FormItem
                          key={skill}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                // Validate max selections after change
                                const currentCount = countSelectedCheckboxes('highSchool.goodSkills');
                                if (checked && currentCount > 3) {
                                  // Find the first checked box and uncheck it
                                  const keys = Object.keys(form.getValues('highSchool.goodSkills') || {});
                                  for (const key of keys) {
                                    if (
                                      form.getValues(`highSchool.goodSkills.${key}`) && 
                                      `highSchool.goodSkills.${key}` !== field.name
                                    ) {
                                      form.setValue(`highSchool.goodSkills.${key}`, false);
                                      break;
                                    }
                                  }
                                }
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              {skill}
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  )
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highSchool.improveSkills"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Hvilke av disse ferdighetene ønsker du å bli bedre på? (Velg opptil 3)</FormLabel>
              </div>
              {form.formState.errors.highSchool?.improveSkills?.message && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.highSchool?.improveSkills?.message}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Kommunikasjon', 'Logisk tenkning', 'Kreativitet', 'Teknisk forståelse',
                  'Ledelse', 'Samarbeid', 'Problemløsning'
                ].map(
                  (skill) => (
                    <FormField
                      key={skill}
                      control={form.control}
                      name={`highSchool.improveSkills.${skill.toLowerCase().replace(/\s+/g, '_')}`}
                      render={({ field }) => (
                        <FormItem
                          key={skill}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                // Validate max selections after change
                                const currentCount = countSelectedCheckboxes('highSchool.improveSkills');
                                if (checked && currentCount > 3) {
                                  // Find the first checked box and uncheck it
                                  const keys = Object.keys(form.getValues('highSchool.improveSkills') || {});
                                  for (const key of keys) {
                                    if (
                                      form.getValues(`highSchool.improveSkills.${key}`) && 
                                      `highSchool.improveSkills.${key}` !== field.name
                                    ) {
                                      form.setValue(`highSchool.improveSkills.${key}`, false);
                                      break;
                                    }
                                  }
                                }
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              {skill}
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  )
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  // Page 3 - School subjects and learning preferences
  const renderPage3 = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Kompetanser og ferdigheter - Del 1</h2>
      <p className="text-muted-foreground mb-6">Fortell oss om din skolehverdag og læringsmetoder</p>
      
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="highSchool.bestSubjects"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Hvilke fag liker du best på skolen? (Velg opptil 3)</FormLabel>
              </div>
              {form.formState.errors.highSchool?.bestSubjects?.message && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.highSchool?.bestSubjects?.message}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2">
                {['Matematikk', 'Norsk', 'Engelsk', 'Naturfag', 'Samfunnsfag', 'Historie', 
                  'Kunst og håndverk', 'Kroppsøving', 'Musikk', 'Programmering/teknologi'].map(
                  (subject) => (
                    <FormField
                      key={subject}
                      control={form.control}
                      name={`highSchool.bestSubjects.${subject.toLowerCase().replace(/\s+|\/+/g, '_')}`}
                      render={({ field }) => (
                        <FormItem
                          key={subject}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                // Validate max selections after change
                                const currentCount = countSelectedCheckboxes('highSchool.bestSubjects');
                                if (checked && currentCount > 3) {
                                  // Find the first checked box and uncheck it
                                  const keys = Object.keys(form.getValues('highSchool.bestSubjects') || {});
                                  for (const key of keys) {
                                    if (
                                      form.getValues(`highSchool.bestSubjects.${key}`) && 
                                      `highSchool.bestSubjects.${key}` !== field.name
                                    ) {
                                      form.setValue(`highSchool.bestSubjects.${key}`, false);
                                      break;
                                    }
                                  }
                                }
                              }}
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
                  )
                )}
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highSchool.challengingSubjects"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Hvilke fag synes du er mest utfordrende? (Velg opptil 3)</FormLabel>
              </div>
              {form.formState.errors.highSchool?.challengingSubjects?.message && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.highSchool?.challengingSubjects?.message}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2">
                {['Matematikk', 'Norsk', 'Engelsk', 'Naturfag', 'Samfunnsfag', 'Historie', 
                  'Kunst og håndverk', 'Kroppsøving', 'Musikk', 'Programmering/teknologi'].map(
                  (subject) => (
                    <FormField
                      key={subject}
                      control={form.control}
                      name={`highSchool.challengingSubjects.${subject.toLowerCase().replace(/\s+|\/+/g, '_')}`}
                      render={({ field }) => (
                        <FormItem
                          key={subject}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                // Validate max selections after change
                                const currentCount = countSelectedCheckboxes('highSchool.challengingSubjects');
                                if (checked && currentCount > 3) {
                                  // Find the first checked box and uncheck it
                                  const keys = Object.keys(form.getValues('highSchool.challengingSubjects') || {});
                                  for (const key of keys) {
                                    if (
                                      form.getValues(`highSchool.challengingSubjects.${key}`) && 
                                      `highSchool.challengingSubjects.${key}` !== field.name
                                    ) {
                                      form.setValue(`highSchool.challengingSubjects.${key}`, false);
                                      break;
                                    }
                                  }
                                }
                              }}
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
                  )
                )}
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highSchool.learningStyle"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Hvordan lærer du best? (Velg opptil 2)</FormLabel>
              </div>
              {form.formState.errors.highSchool?.learningStyle?.message && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.highSchool?.learningStyle?.message}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'reading', label: 'Ved å lese' },
                  { id: 'listening', label: 'Ved å lytte til forelesninger' },
                  { id: 'practical', label: 'Ved å gjøre praktiske oppgaver' },
                  { id: 'discussing', label: 'Ved å diskutere med andre' },
                  { id: 'videos', label: 'Ved å se videoer' },
                  { id: 'unsure', label: 'Jeg vet ikke' }
                ].map(
                  (style) => (
                    <FormField
                      key={style.id}
                      control={form.control}
                      name={`highSchool.learningStyle.${style.id}`}
                      render={({ field }) => (
                        <FormItem
                          key={style.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                // Validate max selections after change
                                const currentCount = countSelectedCheckboxes('highSchool.learningStyle');
                                if (checked && currentCount > 2) {
                                  // Find the first checked box and uncheck it
                                  const keys = Object.keys(form.getValues('highSchool.learningStyle') || {});
                                  for (const key of keys) {
                                    if (
                                      form.getValues(`highSchool.learningStyle.${key}`) && 
                                      `highSchool.learningStyle.${key}` !== field.name
                                    ) {
                                      form.setValue(`highSchool.learningStyle.${key}`, false);
                                      break;
                                    }
                                  }
                                }
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              {style.label}
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  )
                )}
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highSchool.digitalTools"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Hvilke digitale verktøy bruker du mest i skolearbeidet? (Velg opptil 2)</FormLabel>
              </div>
              {form.formState.errors.highSchool?.digitalTools?.message && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.highSchool?.digitalTools?.message}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'pc_mac', label: 'PC/Mac' },
                  { id: 'tablet', label: 'Nettbrett' },
                  { id: 'mobile', label: 'Mobiltelefon' },
                  { id: 'calculator', label: 'Kalkulator' },
                  { id: 'ai', label: 'Google/ChatGPT' },
                  { id: 'other_platforms', label: 'Andre plattformer (f.eks. Teams, OneNote)' }
                ].map(
                  (tool) => (
                    <FormField
                      key={tool.id}
                      control={form.control}
                      name={`highSchool.digitalTools.${tool.id}`}
                      render={({ field }) => (
                        <FormItem
                          key={tool.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                // Validate max selections after change
                                const currentCount = countSelectedCheckboxes('highSchool.digitalTools');
                                if (checked && currentCount > 2) {
                                  // Find the first checked box and uncheck it
                                  const keys = Object.keys(form.getValues('highSchool.digitalTools') || {});
                                  for (const key of keys) {
                                    if (
                                      form.getValues(`highSchool.digitalTools.${key}`) && 
                                      `highSchool.digitalTools.${key}` !== field.name
                                    ) {
                                      form.setValue(`highSchool.digitalTools.${key}`, false);
                                      break;
                                    }
                                  }
                                }
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              {tool.label}
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  )
                )}
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highSchool.technologyComfort"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Hvor komfortabel er du med å bruke teknologi i skolearbeidet?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very_comfortable" id="tech-very-comfortable" />
                    <Label htmlFor="tech-very-comfortable">Veldig komfortabel</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="somewhat_comfortable" id="tech-somewhat-comfortable" />
                    <Label htmlFor="tech-somewhat-comfortable">Litt komfortabel</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not_so_comfortable" id="tech-not-so-comfortable" />
                    <Label htmlFor="tech-not-so-comfortable">Ikke så komfortabel</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not_comfortable" id="tech-not-comfortable" />
                    <Label htmlFor="tech-not-comfortable">Ikke komfortabel i det hele tatt</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highSchool.schoolChallenges"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Hva synes du er mest utfordrende med skolearbeidet ditt? (Velg opptil 2)</FormLabel>
              </div>
              {form.formState.errors.highSchool?.schoolChallenges?.message && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.highSchool?.schoolChallenges?.message}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'time_management', label: 'Strukturere tiden min' },
                  { id: 'understanding', label: 'Forstå fagstoffet' },
                  { id: 'motivation', label: 'Finne motivasjon' },
                  { id: 'teacher_help', label: 'Hjelp fra lærere' },
                  { id: 'technology', label: 'Bruke teknologi effektivt' },
                  { id: 'collaboration', label: 'Samarbeid med medelever' }
                ].map(
                  (challenge) => (
                    <FormField
                      key={challenge.id}
                      control={form.control}
                      name={`highSchool.schoolChallenges.${challenge.id}`}
                      render={({ field }) => (
                        <FormItem
                          key={challenge.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                // Validate max selections after change
                                const currentCount = countSelectedCheckboxes('highSchool.schoolChallenges');
                                if (checked && currentCount > 2) {
                                  // Find the first checked box and uncheck it
                                  const keys = Object.keys(form.getValues('highSchool.schoolChallenges') || {});
                                  for (const key of keys) {
                                    if (
                                      form.getValues(`highSchool.schoolChallenges.${key}`) && 
                                      `highSchool.schoolChallenges.${key}` !== field.name
                                    ) {
                                      form.setValue(`highSchool.schoolChallenges.${key}`, false);
                                      break;
                                    }
                                  }
                                }
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              {challenge.label}
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  )
                )}
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  // Page 4 - Work readiness and school habits
  const renderPage4 = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Kompetanser og ferdigheter - Del 2</h2>
      <p className="text-muted-foreground mb-6">Fortell oss om dine skole- og arbeidsvaner</p>
      
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="highSchool.workIndependently"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Hvordan vil du vurdere din egen evne til å jobbe selvstendig?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very_good" id="work-very-good" />
                    <Label htmlFor="work-very-good">Veldig god</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="work-good" />
                    <Label htmlFor="work-good">God</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="average" id="work-average" />
                    <Label htmlFor="work-average">Middels</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bad" id="work-bad" />
                    <Label htmlFor="work-bad">Dårlig</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highSchool.preparedness"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Hvor godt forberedt føler du deg på videre utdanning eller arbeid?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very_well" id="prep-very-well" />
                    <Label htmlFor="prep-very-well">Veldig godt forberedt</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="quite_well" id="prep-quite-well" />
                    <Label htmlFor="prep-quite-well">Ganske godt forberedt</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="somewhat" id="prep-somewhat" />
                    <Label htmlFor="prep-somewhat">Litt forberedt</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not_at_all" id="prep-not-at-all" />
                    <Label htmlFor="prep-not-at-all">Ikke forberedt i det hele tatt</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highSchool.collaboration"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Hvor ofte samarbeider du med andre på skolen?</FormLabel>
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
          name="highSchool.aiUsage"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Hvor ofte bruker du AI (f.eks. ChatGPT) i skolearbeidet?</FormLabel>
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
          name="highSchool.missingSkills"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Hvilke ferdigheter føler du at du mangler for å lykkes på videregående eller i arbeidslivet? (Velg opptil 2)</FormLabel>
              </div>
              {form.formState.errors.highSchool?.missingSkills?.message && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.highSchool?.missingSkills?.message}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'problem_solving', label: 'Problemløsning' },
                  { id: 'critical_thinking', label: 'Kritisk tenkning' },
                  { id: 'creativity', label: 'Kreativitet' },
                  { id: 'communication', label: 'Kommunikasjon' },
                  { id: 'tech_understanding', label: 'Teknologiforståelse' },
                  { id: 'self_management', label: 'Selvledelse' },
                  { id: 'unsure', label: 'Jeg vet ikke' }
                ].map(
                  (skill) => (
                    <FormField
                      key={skill.id}
                      control={form.control}
                      name={`highSchool.missingSkills.${skill.id}`}
                      render={({ field }) => (
                        <FormItem
                          key={skill.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                // Validate max selections after change
                                const currentCount = countSelectedCheckboxes('highSchool.missingSkills');
                                if (checked && currentCount > 2) {
                                  // Find the first checked box and uncheck it
                                  const keys = Object.keys(form.getValues('highSchool.missingSkills') || {});
                                  for (const key of keys) {
                                    if (
                                      form.getValues(`highSchool.missingSkills.${key}`) && 
                                      `highSchool.missingSkills.${key}` !== field.name
                                    ) {
                                      form.setValue(`highSchool.missingSkills.${key}`, false);
                                      break;
                                    }
                                  }
                                }
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              {skill.label}
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  )
                )}
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highSchool.studyTime"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Hvor mye tid bruker du på skolearbeid utenom skoletiden?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="more_than_10" id="study-more-than-10" />
                    <Label htmlFor="study-more-than-10">Mer enn 10 timer per uke</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5_to_10" id="study-5-to-10" />
                    <Label htmlFor="study-5-to-10">5–10 timer per uke</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1_to_5" id="study-1-to-5" />
                    <Label htmlFor="study-1-to-5">1–5 timer per uke</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="almost_nothing" id="study-almost-nothing" />
                    <Label htmlFor="study-almost-nothing">Nesten ingenting</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highSchool.workExperience"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Har du hatt praksis eller arbeidserfaring gjennom skolen?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="experience-yes" />
                    <Label htmlFor="experience-yes">Ja</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="experience-no" />
                    <Label htmlFor="experience-no">Nei</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highSchool.workExperienceValue"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Hvis du har hatt praksis eller arbeidserfaring – hvor nyttig var det for deg?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very_useful" id="exp-value-very-useful" />
                    <Label htmlFor="exp-value-very-useful">Veldig nyttig</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="somewhat_useful" id="exp-value-somewhat-useful" />
                    <Label htmlFor="exp-value-somewhat-useful">Litt nyttig</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not_so_useful" id="exp-value-not-so-useful" />
                    <Label htmlFor="exp-value-not-so-useful">Ikke så nyttig</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not_useful" id="exp-value-not-useful" />
                    <Label htmlFor="exp-value-not-useful">Ikke nyttig i det hele tatt</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no_experience" id="exp-value-no-experience" />
                    <Label htmlFor="exp-value-no-experience">Har ikke hatt praksis</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  // Render navigation buttons
  const renderNavButtons = () => (
    <div className="flex justify-between pt-6">
      {currentPage > 1 && (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevPage}
          className="rounded-full"
        >
          Tilbake
        </Button>
      )}
      <div className={currentPage === 1 ? "ml-auto" : ""}>
        <Button
          type="button"
          onClick={onNextPage}
          className="rounded-full"
        >
          {currentPage === totalPages ? "Fullfør registrering" : "Neste"}
        </Button>
      </div>
    </div>
  );

  // Render the current page based on the page state
  return (
    <div className="space-y-8">
      {currentPage === 1 && renderPage1()}
      {currentPage === 2 && renderPage2()}
      {currentPage === 3 && renderPage3()}
      {currentPage === 4 && renderPage4()}
      {renderNavButtons()}
    </div>
  );
};

export default HighSchoolQuestionnaire;
