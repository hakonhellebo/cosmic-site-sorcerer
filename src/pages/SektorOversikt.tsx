import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { ChevronRight } from "lucide-react";

const SEKTORER = [
  { navn: 'Administrasjon og ledelse',                slug: 'administrasjon-og-ledelse',           emoji: '🏢' },
  { navn: 'Helse og omsorg',                          slug: 'helse-og-omsorg',                     emoji: '🏥' },
  { navn: 'Humaniora og språk',                       slug: 'humaniora-og-sprak',                  emoji: '📚' },
  { navn: 'Ingeniør og teknisk',                      slug: 'ingenior-og-teknisk',                 emoji: '⚙️' },
  { navn: 'IT og teknologi',                          slug: 'it-og-teknologi',                     emoji: '💻' },
  { navn: 'Jus og rettsvesen',                        slug: 'jus-og-rettsvesen',                   emoji: '⚖️' },
  { navn: 'Kunst og kultur',                          slug: 'kunst-og-kultur',                     emoji: '🎨' },
  { navn: 'Design, markedsføring og kommunikasjon',   slug: 'design-markedsforing-og-kommunikasjon', emoji: '📣' },
  { navn: 'Miljø, natur og forskning',                slug: 'miljo-natur-og-forskning',            emoji: '🌿' },
  { navn: 'Økonomi og finans',                        slug: 'okonomi-og-finans',                   emoji: '💰' },
  { navn: 'Psykologi og rådgivning',                  slug: 'psykologi-og-radgivning',             emoji: '🧠' },
  { navn: 'Religion og livssyn',                      slug: 'religion-og-livssyn',                 emoji: '🕊️' },
  { navn: 'Samfunnsfag og politikk',                  slug: 'samfunnsfag-og-politikk',             emoji: '🏛️' },
  { navn: 'Sikkerhet og beredskap',                   slug: 'sikkerhet-og-beredskap',              emoji: '🛡️' },
  { navn: 'Sport og kroppsøving',                     slug: 'sport-og-kroppsoving',                emoji: '⚽' },
  { navn: 'Transport og logistikk',                   slug: 'transport-og-logistikk',              emoji: '🚛' },
  { navn: 'Undervisning og pedagogikk',               slug: 'undervisning-og-pedagogikk',          emoji: '🎓' },
];

const SektorOversikt = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 pt-24 max-w-5xl">

          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3">Utforsk etter sektor</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Finn yrker, bedrifter og studier innenfor 17 ulike sektorer — alt koblet sammen.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {SEKTORER.map((s) => (
              <button
                key={s.slug}
                onClick={() => navigate(`/sektor/${s.slug}`)}
                className="text-left rounded-2xl border bg-card hover:bg-primary/5 hover:border-primary/30 transition-all p-5 group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl flex-shrink-0">
                      {s.emoji}
                    </div>
                    <span className="font-medium text-sm leading-tight">{s.navn}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors" />
                </div>
              </button>
            ))}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default SektorOversikt;
