-- Enable RLS on all tables
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_moves ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_snapshots ENABLE ROW LEVEL SECURITY;

-- games: public read, anyone can insert, update only by ID, no delete
CREATE POLICY "games_select" ON games FOR SELECT USING (true);
CREATE POLICY "games_insert" ON games FOR INSERT WITH CHECK (true);
CREATE POLICY "games_update" ON games FOR UPDATE USING (true);
CREATE POLICY "games_no_delete" ON games FOR DELETE USING (false);

-- game_moves: public read, insert allowed, no update/delete
CREATE POLICY "game_moves_select" ON game_moves FOR SELECT USING (true);
CREATE POLICY "game_moves_insert" ON game_moves FOR INSERT WITH CHECK (true);
CREATE POLICY "game_moves_no_update" ON game_moves FOR UPDATE USING (false);
CREATE POLICY "game_moves_no_delete" ON game_moves FOR DELETE USING (false);

-- game_snapshots: public read, insert allowed, no update/delete
CREATE POLICY "game_snapshots_select" ON game_snapshots FOR SELECT USING (true);
CREATE POLICY "game_snapshots_insert" ON game_snapshots FOR INSERT WITH CHECK (true);
CREATE POLICY "game_snapshots_no_update" ON game_snapshots FOR UPDATE USING (false);
CREATE POLICY "game_snapshots_no_delete" ON game_snapshots FOR DELETE USING (false);

-- Grant access to the anon role (used by publishable key)
GRANT SELECT, INSERT, UPDATE ON games TO anon;
GRANT SELECT, INSERT ON game_moves TO anon;
GRANT SELECT, INSERT ON game_snapshots TO anon;
