import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, CheckCircle, HelpCircle, Lock, Lightbulb, Target, BookOpen, Compass } from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  // Mock data
  const keyStats = {
    studentsUsed: 312,
    totalStudents: 420,
    completionRate: 74,
    avgTime: 9,
    uncertainStudents: 68,
  };

  const interests = [
    { name: 'IT / teknologi', percentage: 28 },
    { name: 'Helse', percentage: 22 },
    { name: 'Økonomi / finans', percentage: 18 },
    { name: 'Ingeniør', percentage: 14 },
    { name: 'Kreative fag', percentage: 9 },
  ];

  const certaintyLevels = [
    { label: 'Veldig usikre', percentage: 35, color: 'bg-red-400' },
    { label: 'Litt usikre', percentage: 33, color: 'bg-amber-400' },
    { label: 'Ganske sikre', percentage: 32, color: 'bg-emerald-400' },
  ];

  const challenges = [
    { text: 'Vet ikke hva jeg passer til', percentage: 46, icon: HelpCircle },
    { text: 'Redd for å velge feil', percentage: 31, icon: Target },
    { text: 'Lite kunnskap om yrker', percentage: 23, icon: BookOpen },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* 1. HEADER */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                  Innsikt fra EdPath – Eksempelskole VGS
                </h1>
                <p className="text-slate-500 text-lg">
                  Anonym og aggregert innsikt basert på elevenes svar
                </p>
              </div>
              <div className="text-sm text-slate-400 md:text-right">
                Datagrunnlag: VG2 – 2025 (eksempeldata)
              </div>
            </div>
          </div>

          {/* 2. NØKKELTALL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <Users className="h-4 w-4 text-teal-600" />
                  Elever som har brukt EdPath
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-slate-800">{keyStats.studentsUsed}</p>
                <p className="text-sm text-slate-400">av {keyStats.totalStudents} elever</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-teal-600" />
                  Fullføringsgrad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-slate-800">{keyStats.completionRate} %</p>
                <p className="text-sm text-slate-400">fullførte hele undersøkelsen</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-teal-600" />
                  Snitt tidsbruk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-slate-800">{keyStats.avgTime} min</p>
                <p className="text-sm text-slate-400">per elev</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-teal-600" />
                  Andel usikre elever
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-slate-800">{keyStats.uncertainStudents} %</p>
                <p className="text-sm text-slate-400">helt eller delvis usikre på valg</p>
              </CardContent>
            </Card>
          </div>

          {/* 3. INTERESSER */}
          <Card className="bg-white border-0 shadow-sm mb-12">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800">
                Hva er elevene mest interessert i?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {interests.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-32 text-sm text-slate-600 shrink-0">{item.name}</div>
                    <div className="flex-1 h-8 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-teal-500 rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                        style={{ width: `${item.percentage * 3}%` }}
                      >
                        <span className="text-sm font-medium text-white">{item.percentage} %</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-400 mt-6">
                Basert på elevenes interesser og svar i EdPath.
              </p>
            </CardContent>
          </Card>

          {/* 4. HVA ELEVENE ØNSKER Å LÆRE MER OM */}
          <Card className="bg-white border-0 shadow-sm mb-12">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800">
                Hva elevene ønsker å lære mer om
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'Yrker og arbeidsoppgaver', percentage: 48 },
                  { label: 'Hvilke studier som passer', percentage: 41 },
                  { label: 'Lønn og jobbmuligheter', percentage: 34 },
                  { label: 'Hva jeg er god på', percentage: 29 },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="w-48 text-sm text-slate-600">{item.label}</span>
                    <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-teal-400 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="w-12 text-right text-sm font-medium text-slate-700">{item.percentage} %</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-400 mt-6">
                Kan brukes til å planlegge temaundervisning og gruppeveiledning.
              </p>
            </CardContent>
          </Card>

          {/* 5. USIKKERHET */}
          <Card className="bg-white border-0 shadow-sm mb-12">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800">
                Hvor sikre er elevene på veien videre?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Donut Chart */}
                <div className="relative w-48 h-48 shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#f87171"
                      strokeWidth="16"
                      strokeDasharray={`${35 * 2.51} ${100 * 2.51}`}
                      strokeDashoffset="0"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="16"
                      strokeDasharray={`${33 * 2.51} ${100 * 2.51}`}
                      strokeDashoffset={`${-35 * 2.51}`}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="16"
                      strokeDasharray={`${32 * 2.51} ${100 * 2.51}`}
                      strokeDashoffset={`${-(35 + 33) * 2.51}`}
                    />
                  </svg>
                </div>
                
                {/* Legend */}
                <div className="flex-1 space-y-3">
                  {certaintyLevels.map((level, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${level.color}`} />
                      <span className="text-slate-600">{level.label}</span>
                      <span className="font-semibold text-slate-800 ml-auto">{level.percentage} %</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-400 mt-6">
                Kan brukes til å prioritere rådgivningssamtaler.
              </p>
            </CardContent>
          </Card>

          {/* 6. HVA GJØR ELEVENE MEST USIKRE */}
          <Card className="bg-white border-0 shadow-sm mb-12">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800">
                Hva gjør elevene mest usikre?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'Vet ikke hva jeg passer til', percentage: 39 },
                  { label: 'Redd for å velge feil', percentage: 33 },
                  { label: 'For mange valg', percentage: 17 },
                  { label: 'Lite kunnskap om jobber', percentage: 11 },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                    <span className="flex-1 text-sm text-slate-600">{item.label}</span>
                    <span className="text-sm font-medium text-slate-700">{item.percentage} %</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 7. ANBEFALT SAMTALEFOKUS */}
          <Card className="bg-teal-50/50 border border-teal-100 shadow-sm mb-12">
            <CardHeader>
              <div className="flex items-start gap-3">
                <Compass className="h-6 w-6 text-teal-600 mt-0.5 shrink-0" />
                <div>
                  <CardTitle className="text-xl font-semibold text-slate-800">
                    Anbefalt fokus i rådgivningssamtaler
                  </CardTitle>
                  <p className="text-sm text-slate-500 mt-1">
                    Basert på elevenes samlede svar i EdPath
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Basert på svarene anbefaler vi å:
              </p>
              <ul className="space-y-3 text-slate-600 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  <span>
                    bruke tid på å normalisere usikkerhet – <span className="font-medium text-slate-700">{keyStats.uncertainStudents} %</span> av elevene er helt eller delvis usikre
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  <span>utforske konkrete yrker i samtaler, ikke bare studier</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  <span>vise at flere ulike veier kan føre til samme mål</span>
                </li>
              </ul>
              
              {/* Prioritering mini-seksjon */}
              <div className="border-t border-teal-100 pt-5 mt-2">
                <p className="text-sm font-medium text-slate-700 mb-2">
                  🔍 Hvem kan ha ekstra behov for veiledning?
                </p>
                <p className="text-sm text-slate-500">
                  Elever som er veldig usikre og samtidig viser interesse for flere retninger, kan ha ekstra behov for individuelle samtaler.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 8. ELEVENES OPPLEVELSE */}
          <Card className="bg-white border-0 shadow-sm mb-12">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800">
                Elevenes opplevelse etter anbefalingene
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'Føler seg mye mer bevisst', percentage: 42, color: 'bg-teal-500' },
                  { label: 'Føler seg litt mer bevisst', percentage: 31, color: 'bg-teal-400' },
                  { label: 'Omtrent som før', percentage: 22, color: 'bg-slate-300' },
                  { label: 'Litt mer usikre', percentage: 5, color: 'bg-slate-400' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="w-48 text-sm text-slate-600">{item.label}</span>
                    <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="w-12 text-right text-sm font-medium text-slate-700">{item.percentage} %</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-6 italic">
                Basert på elevenes egen vurdering rett etter bruk av EdPath.
              </p>
            </CardContent>
          </Card>

          {/* 9. UTFORDRINGER */}
          <Card className="bg-white border-0 shadow-sm mb-12">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800">
                Hva opplever elevene som vanskeligst?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {challenges.map((challenge, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                    <challenge.icon className="h-6 w-6 text-teal-600 shrink-0" />
                    <span className="flex-1 text-slate-700">{challenge.text}</span>
                    <span className="text-lg font-semibold text-slate-800">{challenge.percentage} %</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 10. HVORDAN BRUKE DETTE */}
          <Card className="bg-teal-50 border-0 shadow-sm mb-12">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-teal-600" />
                Hvordan kan denne innsikten brukes?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Denne oversikten gir et bilde av hva elevmassen er opptatt av akkurat nå. 
                Rådgivere kan bruke dette til å:
              </p>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  prioritere hvilke elever som trenger mest veiledning
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  planlegge temainformasjon og gruppeveiledning
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  strukturere individuelle samtaler bedre
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* 11. PERSONVERN */}
          <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
            <Lock className="h-4 w-4" />
            <span>Alle data er anonymisert og vises kun samlet. Skolen har ikke tilgang til enkeltelevers svar.</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
