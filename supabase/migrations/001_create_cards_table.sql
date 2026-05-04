-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Main cards table
CREATE TABLE IF NOT EXISTS cards (
  id                INTEGER PRIMARY KEY,
  name_en           TEXT NOT NULL,
  name_fr           TEXT,
  type              TEXT NOT NULL,
  frame_type        TEXT NOT NULL,
  race              TEXT,
  attribute         TEXT,
  level             INTEGER,
  rank              INTEGER,
  link_value        INTEGER,
  pendulum_scale    INTEGER,
  atk               INTEGER,
  def               INTEGER,
  archetype         TEXT,
  desc_en           TEXT,
  desc_fr           TEXT,
  image_url         TEXT,
  image_url_small   TEXT,
  image_url_cropped TEXT,
  ban_tcg           TEXT,
  ban_ocg           TEXT,
  ban_md            TEXT,
  -- Reserved for future semantic search (Jalon 4)
  embedding         VECTOR(1536),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast name search (trigram for partial matching)
CREATE INDEX IF NOT EXISTS idx_cards_name_en_trgm
  ON cards USING gin(name_en gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_cards_name_fr_trgm
  ON cards USING gin(name_fr gin_trgm_ops)
  WHERE name_fr IS NOT NULL;

-- Indexes for filter columns
CREATE INDEX IF NOT EXISTS idx_cards_frame_type  ON cards (frame_type);
CREATE INDEX IF NOT EXISTS idx_cards_attribute   ON cards (attribute);
CREATE INDEX IF NOT EXISTS idx_cards_level       ON cards (level)      WHERE level IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cards_rank        ON cards (rank)       WHERE rank IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cards_link_value  ON cards (link_value) WHERE link_value IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cards_atk         ON cards (atk)        WHERE atk IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cards_def         ON cards (def)        WHERE def IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cards_archetype   ON cards (archetype)  WHERE archetype IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cards_ban_tcg     ON cards (ban_tcg)    WHERE ban_tcg IS NOT NULL;

-- Composite index for the most common monster filter combination
CREATE INDEX IF NOT EXISTS idx_cards_frame_attr
  ON cards (frame_type, attribute);

-- RPC helper: returns distinct archetypes for the filter dropdown
CREATE OR REPLACE FUNCTION get_archetypes()
RETURNS TABLE(archetype TEXT)
LANGUAGE SQL
STABLE
AS $$
  SELECT DISTINCT archetype FROM cards
  WHERE archetype IS NOT NULL
  ORDER BY archetype;
$$;

-- Auto-update updated_at on row modification
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS cards_updated_at ON cards;
CREATE TRIGGER cards_updated_at
  BEFORE UPDATE ON cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Row Level Security: cards are public read-only
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cards are publicly readable"
  ON cards FOR SELECT
  USING (true);
