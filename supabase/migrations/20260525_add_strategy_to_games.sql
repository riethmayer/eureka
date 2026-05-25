-- Record the order strategy each game's board was dealt with.
--
-- Rows created before solvability-by-construction shipped were dealt with a
-- plain random fill, so they backfill to 'random' via the column default.
-- New games record the actual strategy (e.g. 'scatter'). The default also keeps
-- inserts from the previously-deployed client (which omits the column) valid.
-- Idempotent so it is safe to re-run.
ALTER TABLE games ADD COLUMN IF NOT EXISTS strategy text NOT NULL DEFAULT 'random';
