import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, School, ChevronRight, Plus } from 'lucide-react';
import { useSchools, useClassGroups, ClassGroup } from '@/hooks/useClassGroups';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import CreateSchoolDialog from '@/components/teacher/CreateSchoolDialog';
import CreateClassDialog from '@/components/teacher/CreateClassDialog';
import ClassCodeCard from '@/components/teacher/ClassCodeCard';
import ClassDetailDashboard from '@/components/teacher/ClassDetailDashboard';
import { Skeleton } from '@/components/ui/skeleton';

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { schools, loading: schoolsLoading, createSchool } = useSchools();
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassGroup | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    if (schools.length > 0 && !selectedSchoolId) {
      setSelectedSchoolId(schools[0].id);
    }
  }, [schools, selectedSchoolId]);

  const selectedSchool = schools.find(s => s.id === selectedSchoolId);

  // If viewing class detail
  if (selectedClass && selectedSchool) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-50 pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <ClassDetailDashboard classGroup={selectedClass} schoolName={selectedSchool.name} />
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-50 pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Lærer-dashboard</h1>
            <p className="text-slate-500 mb-6">Du må være logget inn for å bruke denne funksjonen.</p>
            <Button onClick={() => navigate('/login')} className="bg-teal-600 hover:bg-teal-700">
              Logg inn
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Lærer-dashboard</h1>
              <p className="text-slate-500 text-lg">Opprett klasser, del lenker og følg med på elevenes innsikt.</p>
            </div>
            <CreateSchoolDialog onCreateSchool={createSchool} />
          </div>

          {schoolsLoading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <Skeleton key={i} className="h-24" />)}
            </div>
          ) : schools.length === 0 ? (
            <Card className="bg-white border-dashed border-2 border-slate-200">
              <CardContent className="pt-12 pb-12 text-center">
                <School className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-slate-700 mb-2">Ingen skoler ennå</h2>
                <p className="text-slate-400 max-w-md mx-auto mb-6">
                  Start med å opprette en skole, deretter kan du legge til klasser og dele lenker med elevene.
                </p>
                <CreateSchoolDialog onCreateSchool={createSchool} />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* School selector tabs */}
              {schools.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {schools.map(s => (
                    <Button
                      key={s.id}
                      variant={selectedSchoolId === s.id ? 'default' : 'outline'}
                      onClick={() => { setSelectedSchoolId(s.id); setSelectedClass(null); }}
                      className={selectedSchoolId === s.id ? 'bg-teal-600 hover:bg-teal-700' : ''}
                    >
                      {s.name}
                    </Button>
                  ))}
                </div>
              )}

              {selectedSchool && (
                <SchoolSection
                  school={selectedSchool}
                  onSelectClass={setSelectedClass}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const SchoolSection: React.FC<{
  school: { id: string; name: string };
  onSelectClass: (cg: ClassGroup) => void;
}> = ({ school, onSelectClass }) => {
  const { classGroups, loading, createClassGroup } = useClassGroups(school.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-800">{school.name} – Klasser</h2>
        <CreateClassDialog onCreateClass={createClassGroup} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2].map(i => <Skeleton key={i} className="h-48" />)}
        </div>
      ) : classGroups.length === 0 ? (
        <Card className="bg-white border-dashed border-2 border-slate-200">
          <CardContent className="pt-8 pb-8 text-center">
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">Ingen klasser opprettet</h3>
            <p className="text-slate-400 mb-4">Opprett en klasse for å begynne å samle innsikt.</p>
            <CreateClassDialog onCreateClass={createClassGroup} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classGroups.map(cg => (
            <ClassCard key={cg.id} classGroup={cg} onClick={() => onSelectClass(cg)} />
          ))}
        </div>
      )}
    </div>
  );
};

const ClassCard: React.FC<{ classGroup: ClassGroup; onClick: () => void }> = ({ classGroup, onClick }) => {
  const { stats, loading } = useClassStats(classGroup.id);

  return (
    <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">{classGroup.name}</CardTitle>
            <div className="flex gap-2 mt-1 text-sm text-slate-400">
              {classGroup.grade_level && <span>{classGroup.grade_level}</span>}
              {classGroup.program_area && <span>• {classGroup.program_area}</span>}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-400" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1 text-sm text-slate-500 mb-3">
          <span className="font-mono text-teal-600 font-medium">{classGroup.join_code}</span>
        </div>
        {loading ? (
          <Skeleton className="h-5 w-32" />
        ) : (
          <div className="flex gap-4 text-sm text-slate-500">
            <span>{stats.total} svar</span>
            <span>{stats.completionRate}% fullført</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Need to import useClassStats for ClassCard
import { useClassStats } from '@/hooks/useClassGroups';

export default TeacherDashboard;
