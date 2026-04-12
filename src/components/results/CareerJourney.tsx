import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  GraduationCap, Briefcase, Building2, ChevronRight, Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type {
  EdPathStudie, EdPathYrke, EdPathBedrift,
} from '@/services/edpathApi.types';

interface CareerJourneyProps {
  studier: EdPathStudie[];
  yrker: EdPathYrke[];
  bedrifter: EdPathBedrift[];
}

const CareerJourney: React.FC<CareerJourneyProps> = ({ studier, yrker, bedrifter }) => {
  const navigate = useNavigate();

  if (studier.length === 0 && yrker.length === 0 && bedrifter.length === 0) return null;

  const topStudy = studier[0];
  const topCareers = yrker.slice(0, 3);
  const topCompanies = bedrifter.slice(0, 3);

  const handleStudyClick = async (name: string) => {
    try {
      const { data } = await supabase
        .from('Student_data_ny')
        .select('*')
        .ilike('Studienavn', `%${name}%`)
        .limit(1);
      if (data && data.length > 0) {
        const m = data[0] as any;
        navigate(`/utdanning/${encodeURIComponent(m['Lærestednavn'] || '')}/${encodeURIComponent(m['Studiekode'] || '')}`);
        return;
      }
    } catch {}
    navigate('/statistikk', { state: { searchQuery: name } });
  };

  const toSlug = (n: string) => encodeURIComponent(n.toLowerCase().replace(/\s+/g, '-'));

  return (
    <div className="relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.03] via-background to-primary/[0.06] p-6 md:p-8 overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
            En mulig vei videre for deg
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-xl">
          Basert på profilen din har vi satt sammen en konkret vei — fra studie, gjennom karriere, til arbeidsgivere som passer.
        </p>
      </div>

      {/* Journey steps — responsive: vertical on mobile, horizontal on desktop */}
      <div className="relative flex flex-col lg:flex-row gap-4 lg:gap-0 lg:items-stretch">

        {/* ───── STEP 1: STUDIE ───── */}
        {topStudy && (
          <>
            <div
              onClick={() => handleStudyClick(topStudy.navn)}
              className="relative flex-1 rounded-xl border border-primary/30 bg-background/80 backdrop-blur-sm p-5 cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all group"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Steg 1</p>
                  <p className="text-xs font-medium text-primary">Studie</p>
                </div>
              </div>
              <h3 className="font-semibold text-base leading-snug mb-2 group-hover:text-primary transition-colors">
                {topStudy.navn}
              </h3>
              <Badge variant="outline" className="text-[11px]">{topStudy.sektor}</Badge>
              {topStudy.lærested && (
                <p className="text-xs text-muted-foreground mt-2">{topStudy.lærested}</p>
              )}
            </div>

            {/* Arrow connector */}
            <div className="flex items-center justify-center lg:px-2 py-1 lg:py-0">
              <ChevronRight className="h-6 w-6 text-primary/40 hidden lg:block" />
              <ChevronRight className="h-6 w-6 text-primary/40 rotate-90 lg:hidden" />
            </div>
          </>
        )}

        {/* ───── STEP 2: YRKER ───── */}
        {topCareers.length > 0 && (
          <>
            <div className="relative flex-1 rounded-xl border border-primary/20 bg-background/80 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Steg 2</p>
                  <p className="text-xs font-medium text-primary">Mulige roller</p>
                </div>
              </div>
              <div className="space-y-2">
                {topCareers.map((yrke, i) => (
                  <div
                    key={i}
                    onClick={() => navigate(`/karriere/${toSlug(yrke.navn)}`)}
                    className="flex items-center gap-2 p-2.5 rounded-lg border border-transparent hover:border-primary/30 hover:bg-primary/5 cursor-pointer transition-all group"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary/60 flex-shrink-0" />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors leading-tight">
                      {yrke.navn}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow connector */}
            <div className="flex items-center justify-center lg:px-2 py-1 lg:py-0">
              <ChevronRight className="h-6 w-6 text-primary/40 hidden lg:block" />
              <ChevronRight className="h-6 w-6 text-primary/40 rotate-90 lg:hidden" />
            </div>
          </>
        )}

        {/* ───── STEP 3: BEDRIFTER ───── */}
        {topCompanies.length > 0 && (
          <div className="relative flex-1 rounded-xl border border-primary/20 bg-background/80 backdrop-blur-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Steg 3</p>
                <p className="text-xs font-medium text-primary">Aktuelle bedrifter</p>
              </div>
            </div>
            <div className="space-y-2">
              {topCompanies.map((bedrift, i) => (
                <div
                  key={i}
                  onClick={() => navigate(`/bedrift/${toSlug(bedrift.navn)}`)}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-transparent hover:border-primary/30 hover:bg-primary/5 cursor-pointer transition-all group"
                >
                  <div className="h-2 w-2 rounded-full bg-primary/60 flex-shrink-0" />
                  <span className="text-sm font-medium group-hover:text-primary transition-colors leading-tight">
                    {bedrift.navn}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Connecting line (desktop only) */}
      <div className="hidden lg:block absolute top-1/2 left-[calc(33.33%+8px)] right-[calc(33.33%+8px)] h-px bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 -translate-y-1/2 pointer-events-none" style={{ zIndex: 0 }} />
    </div>
  );
};

export default CareerJourney;
