import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, CheckCircle, HelpCircle, Lock, Lightbulb, Compass, ArrowLeft, BookOpen, Briefcase, BarChart3, Star, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useClassStats, ClassGroup } from '@/hooks/useClassGroups';
import { Skeleton } from '@/components/ui/skeleton';
import ClassCodeCard from './ClassCodeCard';
import {
  generateInsightRecommendations,
  aggregateInterests,
  aggregateLearningWishes,
  aggregateCertaintyLevels,
  aggregateChallenges,
  aggregatePostExperience,
  aggregateWorkPreferences,
  aggregateSubjectPreferences,
  getResponseTimeline,
} from '@/utils/classInsights';

interface Props {
  classGroup: ClassGroup;
  schoolName: string;
}

const ClassDetailDashboard: React.FC<Props> = ({ classGroup, schoolName }) => {
  const { stats, responses, loading } = useClassStats(classGroup.id);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  const interests = aggregateInterests(responses);
  const learningWishes = aggregateLearningWishes(responses);
  const certaintyLevels = aggregateCertaintyLevels(responses);
  const challenges = aggregateChallenges(responses);
  const recommendations = generateInsightRecommendations(responses);
  const postExperience = aggregatePostExperience(responses);
  const workPreferences = aggregateWorkPreferences(responses);
  const subjectPreferences = aggregateSubjectPreferences(responses);
  const timeline = getResponseTimeline(responses);
  const uncertaintyRate = certaintyLevels.find(c => c.label.includes('usikre'))?.percentage || 0;
  const completedCount = responses.filter(r => r.completion_status === 'completed').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 gap-2 text-slate-500">
          <ArrowLeft className="h-4 w-4" /> Tilbake
        </Button>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-1">{classGroup.name}</h1>
            <p className="text-slate-500 text-lg">{schoolName}</p>
            <div className="flex gap-3 mt-2 text-sm text-slate-400">
              {classGroup.grade_level && <span>{classGroup.grade_level}</span>}
              {classGroup.program_area && <span>• {classGroup.program_area}</span>}
            </div>
          </div>
          <div className="text-sm text-slate-400 md:text-right">
            Opprettet: {new Date(classGroup.created_at).toLocaleDateString('nb-NO')}
          </div>
        </div>
      </div>

      {/* Join code */}
      <ClassCodeCard joinCode={classGroup.join_code} />

      {/* Key stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={Users} label="Elever som har startet" value={stats.total} sub="respondenter" />
        <StatCard icon={CheckCircle} label="Fullføringsgrad" value={`${stats.completionRate} %`} sub={`${completedCount} av ${stats.total} fullførte`} />
        <StatCard icon={Clock} label="Snitt tidsbruk" value={`${stats.avgTimeMinutes} min`} sub="per elev" />
        <StatCard icon={HelpCircle} label="Andel usikre" value={`${uncertaintyRate} %`} sub="helt eller delvis usikre" />
      </div>

      {/* No data state */}
      {stats.total === 0 && (
        <Card className="bg-slate-50 border-dashed border-2 border-slate-200">
          <CardContent className="pt-8 pb-8 text-center">
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">Ingen svar ennå</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              Del klassekoden eller lenken med elevene dine. Når de starter spørreundersøkelsen via lenken, vil svarene dukke opp her automatisk.
            </p>
          </CardContent>
        </Card>
      )}

      {stats.total > 0 && (
        <>
          {/* Response timeline */}
          {timeline.length > 1 && (
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-teal-600" />
                  Svar over tid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-1 h-32">
                  {timeline.map((day, i) => {
                    const maxCount = Math.max(...timeline.map(t => t.count));
                    const heightPct = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs text-slate-500 font-medium">{day.count}</span>
                        <div
                          className="w-full bg-teal-500 rounded-t-md transition-all min-h-[4px]"
                          style={{ height: `${heightPct}%` }}
                        />
                        <span className="text-[10px] text-slate-400 truncate max-w-full">{day.date}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Certainty levels */}
          {certaintyLevels.length > 0 && (
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-800">
                  Hvor sikre er elevene på veien videre?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="relative w-48 h-48 shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      {certaintyLevels.map((level, i) => {
                        const offset = certaintyLevels.slice(0, i).reduce((a, l) => a + l.percentage, 0);
                        const colors = ['#f87171', '#fbbf24', '#34d399'];
                        return (
                          <circle
                            key={i}
                            cx="50" cy="50" r="40" fill="none"
                            stroke={colors[i]}
                            strokeWidth="16"
                            strokeDasharray={`${level.percentage * 2.51} ${100 * 2.51}`}
                            strokeDashoffset={`${-offset * 2.51}`}
                          />
                        );
                      })}
                    </svg>
                  </div>
                  <div className="flex-1 space-y-3">
                    {certaintyLevels.map((level, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${level.color}`} />
                        <span className="text-slate-600">{level.label}</span>
                        <span className="font-semibold text-slate-800 ml-auto">{level.percentage} %</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-400 mt-6">Kan brukes til å prioritere rådgivningssamtaler.</p>
              </CardContent>
            </Card>
          )}

          {/* Interests */}
          {interests.length > 0 && (
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <Star className="h-5 w-5 text-teal-600" />
                  Hva er elevene mest interessert i?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interests.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-40 text-sm text-slate-600 shrink-0 truncate">{item.name}</div>
                      <div className="flex-1 h-8 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500 rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                          style={{ width: `${Math.min(item.percentage * 2, 100)}%` }}
                        >
                          <span className="text-sm font-medium text-white">{item.percentage} %</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-400 mt-6">Basert på elevenes svar i EdPath.</p>
              </CardContent>
            </Card>
          )}

          {/* Favourite subjects */}
          {subjectPreferences.length > 0 && (
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-teal-600" />
                  Favorittfag blant elevene
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjectPreferences.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-40 text-sm text-slate-600 shrink-0 truncate">{item.name}</div>
                      <div className="flex-1 h-8 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-400 rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                          style={{ width: `${Math.min(item.percentage * 2, 100)}%` }}
                        >
                          <span className="text-sm font-medium text-white">{item.percentage} %</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Work preferences */}
          {workPreferences.length > 0 && (
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-teal-600" />
                  Arbeidsstil og jobbpreferanser
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workPreferences.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="w-48 text-sm text-slate-600 truncate">{item.label}</span>
                      <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${item.percentage}%` }} />
                      </div>
                      <span className="w-12 text-right text-sm font-medium text-slate-700">{item.percentage} %</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Learning wishes */}
          {learningWishes.length > 0 && (
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-800">
                  Hva elevene ønsker å lære mer om
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {learningWishes.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="w-48 text-sm text-slate-600 truncate">{item.label}</span>
                      <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-400 rounded-full" style={{ width: `${item.percentage}%` }} />
                      </div>
                      <span className="w-12 text-right text-sm font-medium text-slate-700">{item.percentage} %</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-400 mt-6">Kan brukes til å planlegge temaundervisning og gruppeveiledning.</p>
              </CardContent>
            </Card>
          )}

          {/* Challenges */}
          {challenges.length > 0 && (
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-800">
                  Hva gjør elevene mest usikre?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {challenges.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                      <span className="flex-1 text-sm text-slate-600">{item.label}</span>
                      <span className="text-sm font-medium text-slate-700">{item.percentage} %</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Post-experience */}
          {postExperience.length > 0 && (
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-teal-600" />
                  Elevenes opplevelse etter anbefalingene
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  {postExperience.map((item, i) => (
                    <div key={i} className="flex-1 text-center p-4 bg-slate-50 rounded-xl">
                      <div className={`w-12 h-12 rounded-full ${item.color} mx-auto mb-3 flex items-center justify-center`}>
                        <span className="text-white text-lg font-bold">{item.percentage}%</span>
                      </div>
                      <p className="text-sm font-medium text-slate-700">{item.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-400 mt-6">Basert på elevenes svar etter å ha mottatt sine anbefalinger.</p>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          <Card className="bg-teal-50/50 border border-teal-100 shadow-sm">
            <CardHeader>
              <div className="flex items-start gap-3">
                <Compass className="h-6 w-6 text-teal-600 mt-0.5 shrink-0" />
                <div>
                  <CardTitle className="text-xl font-semibold text-slate-800">
                    Anbefalt fokus i rådgivningssamtaler
                  </CardTitle>
                  <p className="text-sm text-slate-500 mt-1">Basert på elevenes samlede svar i EdPath</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-slate-600">
                {recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5">{rec.icon}</span>
                    <span>{rec.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* How to use */}
          <Card className="bg-teal-50 border-0 shadow-sm">
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
                  planlegge temainformasjon og gruppeveiledning basert på interesser og fagpreferanser
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  strukturere individuelle samtaler bedre med bakgrunn i usikkerhet og utfordringer
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  evaluere om rådgivningen har effekt ved å følge med på opplevelsen etter anbefalingene
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Anonymized responses overview */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800">
                Oversikt over besvarelser
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 px-2 text-slate-500 font-medium">Respondent</th>
                      <th className="text-left py-3 px-2 text-slate-500 font-medium">Status</th>
                      <th className="text-left py-3 px-2 text-slate-500 font-medium">Startet</th>
                      <th className="text-left py-3 px-2 text-slate-500 font-medium">Fullført</th>
                      <th className="text-left py-3 px-2 text-slate-500 font-medium">Tidsbruk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responses.map((r, i) => {
                      const started = new Date(r.started_at);
                      const completed = r.completed_at ? new Date(r.completed_at) : null;
                      const minutes = completed ? Math.round((completed.getTime() - started.getTime()) / 60000) : null;
                      return (
                        <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                          <td className="py-3 px-2 text-slate-600">Elev {i + 1}</td>
                          <td className="py-3 px-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              r.completion_status === 'completed' 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {r.completion_status === 'completed' ? 'Fullført' : 'Påbegynt'}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-slate-500">{started.toLocaleDateString('nb-NO')}</td>
                          <td className="py-3 px-2 text-slate-500">{completed ? completed.toLocaleDateString('nb-NO') : '–'}</td>
                          <td className="py-3 px-2 text-slate-500">{minutes !== null ? `${minutes} min` : '–'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Privacy footer */}
      <div className="flex items-center justify-center gap-2 text-slate-400 text-sm pb-8">
        <Lock className="h-4 w-4" />
        <span>Alle data er anonymisert og vises kun samlet. Skolen har ikke tilgang til enkeltelevers svar.</span>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: any; label: string; value: string | number; sub: string }> = ({ icon: Icon, label, value, sub }) => (
  <Card className="bg-white border-0 shadow-sm">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
        <Icon className="h-4 w-4 text-teal-600" />
        {label}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-4xl font-bold text-slate-800">{value}</p>
      <p className="text-sm text-slate-400">{sub}</p>
    </CardContent>
  </Card>
);

export default ClassDetailDashboard;
