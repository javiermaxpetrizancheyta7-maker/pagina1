/*
# Create shared app_state table (single-tenant, no auth)

1. New Tables
- `app_state`
  - `key` (text, primary key): identifies which piece of the page this is (letters, memories, settings, etc.)
  - `value` (jsonb, not null): the saved content for that piece
  - `updated_at` (timestamptz): when it was last saved
2. Security
- Enable RLS on `app_state`.
- Grant SELECT, INSERT, UPDATE to `anon` and `authenticated` so the shared page can read and save its content.
- Policies allow anon + authenticated read/insert/update. The data is intentionally shared between the couple and there is no sign-in screen.
- No DELETE grant or policy: content is replaced, never removed through the API.
3. Notes
- Idempotent: safe to re-run.
*/

CREATE TABLE IF NOT EXISTS app_state (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE app_state ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON app_state TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_app_state" ON app_state;
CREATE POLICY "anon_select_app_state" ON app_state FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_app_state" ON app_state;
CREATE POLICY "anon_insert_app_state" ON app_state FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_app_state" ON app_state;
CREATE POLICY "anon_update_app_state" ON app_state FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
