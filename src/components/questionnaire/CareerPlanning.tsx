import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
const CareerPlanning = ({
  form
}) => {
  return <div className="space-y-6">
      <h2 className="text-2xl font-bold">Karriereplanlegging og motivasjon</h2>
      <p className="text-muted-foreground mb-6">
        Fortell oss om dine tanker rundt fremtidig karriere og hva som motiverer deg.
      </p>

      {/* Work Location */}
      <FormField control={form.control} name="highSchool.workLocation" render={({
      field
    }) => <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">30. Hvis du kunne valgt et arbeidssted, hvor ville det vært?</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="norway" />
                  </FormControl>
                  <FormLabel className="font-normal">Norge</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="europe" />
                  </FormControl>
                  <FormLabel className="font-normal">Et annet europeisk land</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="usa" />
                  </FormControl>
                  <FormLabel className="font-normal">USA</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="asia" />
                  </FormControl>
                  <FormLabel className="font-normal">Asia</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="australia" />
                  </FormControl>
                  <FormLabel className="font-normal">Australia</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="unknown" />
                  </FormControl>
                  <FormLabel className="font-normal">Jeg vet ikke</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>} />

      {/* Job Challenges */}
      <div className="space-y-4">
        <FormField control={form.control} name="highSchool.jobChallenges" render={() => <FormItem>
              <FormLabel className="text-base font-medium">31. Hva tror du kommer til å være den største utfordringen når du skal finne jobb? (Velg opptil 2)</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {[{
            id: "fewJobs",
            label: "For få relevante jobber"
          }, {
            id: "highRequirements",
            label: "Høye krav fra arbeidsgiver"
          }, {
            id: "lackOfExperience",
            label: "Manglende erfaring"
          }, {
            id: "competition",
            label: "Konkurranse med andre kandidater"
          }, {
            id: "careerUncertainty",
            label: "Usikkerhet om hva jeg vil jobbe med"
          }, {
            id: "unknown",
            label: "Vet ikke"
          }].map(item => <FormField key={item.id} control={form.control} name={`highSchool.jobChallenges.${item.id}`} render={({
            field
          }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>} />)}
              </div>
              <FormMessage />
            </FormItem>} />
      </div>

      {/* Career Support Needs */}
      <div className="space-y-4">
        <FormField control={form.control} name="highSchool.careerSupportNeeds" render={() => <FormItem>
              <FormLabel className="text-base font-medium">32. Hva ville gjort det enklere for deg å velge karriere? (Velg opptil 2)</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {[{
            id: "careerInsight",
            label: "Bedre innsikt i yrker og utdanninger"
          }, {
            id: "workExperience",
            label: "Praksis og arbeidserfaring"
          }, {
            id: "careerGuidance",
            label: "Karriereveiledning"
          }, {
            id: "industryContacts",
            label: "Kontakt med folk i bransjen"
          }, {
            id: "betterGrades",
            label: "Bedre karakterer"
          }].map(item => <FormField key={item.id} control={form.control} name={`highSchool.careerSupportNeeds.${item.id}`} render={({
            field
          }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>} />)}
              </div>
              <FormMessage />
            </FormItem>} />
      </div>

      {/* Education Motivation */}
      <FormField control={form.control} name="highSchool.educationMotivation" render={({
      field
    }) => <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">33. Hva motiverer deg mest til å fullføre utdanningen din?</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="secure-job" />
                  </FormControl>
                  <FormLabel className="font-normal">Få en sikker jobb</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="good-salary" />
                  </FormControl>
                  <FormLabel className="font-normal">Tjene godt</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="meaningful-work" />
                  </FormControl>
                  <FormLabel className="font-normal">Gjøre noe meningsfullt</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="passion" />
                  </FormControl>
                  <FormLabel className="font-normal">Følge lidenskapen min</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="unknown" />
                  </FormControl>
                  <FormLabel className="font-normal">Jeg vet ikke ennå</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>} />

      {/* AI Job Market Impact */}
      <FormField control={form.control} name="highSchool.aiJobMarketImpact" render={({
      field
    }) => <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">34. Hvordan tror du AI og automatisering vil påvirke jobbmarkedet i fremtiden?</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="create-jobs" />
                  </FormControl>
                  <FormLabel className="font-normal">Jeg tror det kommer til å skape flere jobber</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="replace-jobs" />
                  </FormControl>
                  <FormLabel className="font-normal">Jeg tror det kommer til å erstatte mange jobber</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="unknown" />
                  </FormControl>
                  <FormLabel className="font-normal">Jeg vet ikke</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>} />

      {/* Industry Mentor Interest */}
      <FormField control={form.control} name="highSchool.industryMentorInterest" render={({
      field
    }) => <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">35. Hvis du fikk muligheten til å snakke med en erfaren person i bransjen du vurderer – ville du gjort det?</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="yes" />
                  </FormControl>
                  <FormLabel className="font-normal">Ja</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="no" />
                  </FormControl>
                  <FormLabel className="font-normal">Nei</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="maybe" />
                  </FormControl>
                  <FormLabel className="font-normal">Kanskje</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>} />
    </div>;
};
export default CareerPlanning;