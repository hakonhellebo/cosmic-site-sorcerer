
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
      const totalFields = 11; // Total number of required field groups
      let filledFields = 0;
      
      if (value.highSchool.grade) filledFields++;
      if (value.highSchool.studyDirection) filledFields++;
      if (value.highSchool.averageGrade) filledFields++;
      if (countSelectedCheckboxes('highSchool.favoriteCourses') > 0) filledFields++;
      if (countSelectedCheckboxes('highSchool.difficultCourses') > 0) filledFields++;
      if (countSelectedCheckboxes('highSchool.educationPriorities') > 0) filledFields++;
      if (countSelectedCheckboxes('highSchool.interests') > 0) filledFields++;
      if (countSelectedCheckboxes('highSchool.workTasks') > 0) filledFields++;
      if (value.highSchool.workEnvironment) filledFields++;
      if (value.highSchool.workPreference) filledFields++;
      if (countSelectedCheckboxes('highSchool.goodSkills') > 0) filledFields++;
      if (countSelectedCheckboxes('highSchool.improveSkills') > 0) filledFields++;
      
      const progress = Math.round((filledFields / totalFields) * 100);
      setFormProgress(progress);
    });
    
    return () => subscription.unsubscribe();
  }, [form, setFormProgress]);

  // First page - Introduction and background
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

  // Second page - Interests and skills
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
      {renderNavButtons()}
    </div>
  );
};

export default HighSchoolQuestionnaire;
