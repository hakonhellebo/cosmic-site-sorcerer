import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
const FutureIndustries = ({
  form
}) => {
  return <div className="space-y-6">
      <h2 className="text-2xl font-bold">Fremtidsplaner - Bransjer og roller</h2>
      <p className="text-muted-foreground mb-6">
        Fortell oss om hvilke bransjer og roller som interesserer deg.
      </p>

      {/* Interesting Industries */}
      <div className="space-y-4">
        <FormField control={form.control} name="highSchool.interestingIndustries" render={() => <FormItem>
              <FormLabel className="text-base font-medium">25. Hvilke bransjer synes du virker mest spennende? (Velg opptil 3)</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {[{
            id: "technology",
            label: "Teknologi"
          }, {
            id: "healthcare",
            label: "Helse og omsorg"
          }, {
            id: "finance",
            label: "Økonomi og finans"
          }, {
            id: "creative",
            label: "Kreativitet og media"
          }, {
            id: "education",
            label: "Utdanning"
          }, {
            id: "logistics",
            label: "Handel og logistikk"
          }, {
            id: "research",
            label: "Forskning og utvikling"
          }, {
            id: "environment",
            label: "Miljø og bærekraft"
          }, {
            id: "publicSector",
            label: "Offentlig sektor"
          }, {
            id: "engineering",
            label: "Ingeniørfag og bygg"
          }].map(item => <FormField key={item.id} control={form.control} name={`highSchool.interestingIndustries.${item.id}`} render={({
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

      {/* Desired Roles */}
      <div className="space-y-4">
        <FormField control={form.control} name="highSchool.desiredRoles" render={() => <FormItem>
              <FormLabel className="text-base font-medium">26 Hvilke av disse jobbrollene kunne du sett for deg? (Velg opptil 3)</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {[{
            id: "leader",
            label: "Leder"
          }, {
            id: "specialist",
            label: "Spesialist (f.eks. lege, ingeniør)"
          }, {
            id: "creative",
            label: "Kreativ rolle (f.eks. designer, kunstner)"
          }, {
            id: "technical",
            label: "Teknisk rolle (f.eks. programmerer)"
          }, {
            id: "consultant",
            label: "Rådgiver/konsulent"
          }, {
            id: "entrepreneur",
            label: "Entreprenør (starte egen bedrift)"
          }, {
            id: "researcher",
            label: "Forskning og utvikling"
          }, {
            id: "sales",
            label: "Salg og markedsføring"
          }, {
            id: "teacher",
            label: "Lærer eller veileder"
          }].map(item => <FormField key={item.id} control={form.control} name={`highSchool.desiredRoles.${item.id}`} render={({
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

      {/* Salary Importance */}
      <FormField control={form.control} name="highSchool.salaryImportance" render={({
      field
    }) => <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">27. Hvor viktig er det for deg å tjene godt?</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="very-important" />
                  </FormControl>
                  <FormLabel className="font-normal">Veldig viktig</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="somewhat-important" />
                  </FormControl>
                  <FormLabel className="font-normal">Litt viktig</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="not-very-important" />
                  </FormControl>
                  <FormLabel className="font-normal">Ikke så viktig</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="not-important" />
                  </FormControl>
                  <FormLabel className="font-normal">Ikke viktig i det hele tatt</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>} />

      {/* Social Impact Importance */}
      <FormField control={form.control} name="highSchool.socialImpactImportance" render={({
      field
    }) => <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">28. Hvor viktig er det for deg å gjøre en positiv forskjell i samfunnet?</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="very-important" />
                  </FormControl>
                  <FormLabel className="font-normal">Veldig viktig</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="somewhat-important" />
                  </FormControl>
                  <FormLabel className="font-normal">Litt viktig</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="not-very-important" />
                  </FormControl>
                  <FormLabel className="font-normal">Ikke så viktig</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="not-important" />
                  </FormControl>
                  <FormLabel className="font-normal">Ikke viktig i det hele tatt</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>} />

      {/* Work Environment Preferences */}
      <div className="space-y-4">
        <FormField control={form.control} name="highSchool.workEnvironmentPreferences" render={() => <FormItem>
              <FormLabel className="text-base font-medium">29. Hva er viktigst for deg i et arbeidsmiljø? (Velg opptil 2)</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {[{
            id: "flexibility",
            label: "Fleksibilitet (f.eks. hjemmekontor)"
          }, {
            id: "social",
            label: "Sosialt miljø"
          }, {
            id: "structure",
            label: "Struktur og tydelige arbeidsoppgaver"
          }, {
            id: "career",
            label: "Mulighet for karriereutvikling"
          }, {
            id: "innovation",
            label: "Innovasjon og kreativitet"
          }, {
            id: "stability",
            label: "Stabilitet og trygghet"
          }].map(item => <FormField key={item.id} control={form.control} name={`highSchool.workEnvironmentPreferences.${item.id}`} render={({
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

      {/* Future Work Vision */}
      <FormField control={form.control} name="highSchool.futureWorkVision" render={({
      field
    }) => <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">30. Hvordan ser du for deg arbeidshverdagen din om 10 år?</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="creative" />
                  </FormControl>
                  <FormLabel className="font-normal">Jeg jobber med noe kreativt og selvstendig</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="leadership" />
                  </FormControl>
                  <FormLabel className="font-normal">Jeg har en lederrolle</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="technology" />
                  </FormControl>
                  <FormLabel className="font-normal">Jeg jobber med teknologi og innovasjon</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="specialist" />
                  </FormControl>
                  <FormLabel className="font-normal">Jeg har en spesialisert rolle med høy kompetanse</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="entrepreneur" />
                  </FormControl>
                  <FormLabel className="font-normal">Jeg driver min egen bedrift</FormLabel>
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
    </div>;
};
export default FutureIndustries;