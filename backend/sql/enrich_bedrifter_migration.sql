-- =============================================================================
-- EdPath — Bedrifter_ny enrichment migration
-- Kjør i Supabase SQL Editor: https://supabase.com/dashboard/project/zcfclojzyqezuuwxzrzq/editor
-- =============================================================================

-- 1. Legg til nye kolonner (IF NOT EXISTS er ikke støttet for ADD COLUMN i eldre Postgres,
--    men Supabase kjører Postgres 15 så det fungerer fint)

ALTER TABLE "Bedrifter_ny"
  ADD COLUMN IF NOT EXISTS organisasjonsnummer   TEXT,
  ADD COLUMN IF NOT EXISTS stiftelsesaar         INTEGER,
  ADD COLUMN IF NOT EXISTS nace_kode             TEXT,
  ADD COLUMN IF NOT EXISTS nace_beskrivelse      TEXT,
  ADD COLUMN IF NOT EXISTS antall_ansatte_tall   INTEGER,
  ADD COLUMN IF NOT EXISTS driftsresultat_mnok   NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS regnskapsaar          INTEGER,
  ADD COLUMN IF NOT EXISTS ansetter_til_yrker    TEXT,        -- komma-separert, maks 5
  ADD COLUMN IF NOT EXISTS ansetter_fra_studier  TEXT,        -- komma-separert, maks 5
  ADD COLUMN IF NOT EXISTS ai_beskrivelse        TEXT,        -- AI-generert rik beskrivelse
  ADD COLUMN IF NOT EXISTS noekkelord            TEXT,        -- komma-separert nøkkelord
  ADD COLUMN IF NOT EXISTS brreg_hentet          BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS sist_oppdatert        TIMESTAMPTZ  DEFAULT NOW();

-- 2. Indeks for oppslag via org-nummer (nyttig for fremtidig refresh)
CREATE INDEX IF NOT EXISTS idx_bedrifter_orgnr
  ON "Bedrifter_ny" (organisasjonsnummer)
  WHERE organisasjonsnummer IS NOT NULL;

-- 3. Indeks for søk via sektorer (frontend bruker dette i filtrering)
CREATE INDEX IF NOT EXISTS idx_bedrifter_sektor
  ON "Bedrifter_ny" (Sektor);

-- 4. Full-tekst søk indeks for bedriftssøk
CREATE INDEX IF NOT EXISTS idx_bedrifter_search
  ON "Bedrifter_ny" USING GIN (
    to_tsvector('norwegian',
      COALESCE("Selskap", '') || ' ' ||
      COALESCE("Beskrivelse", '') || ' ' ||
      COALESCE(ai_beskrivelse, '') || ' ' ||
      COALESCE(noekkelord, '')
    )
  );

-- Verifiser nye kolonner
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'Bedrifter_ny'
ORDER BY ordinal_position;
