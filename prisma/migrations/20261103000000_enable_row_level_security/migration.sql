-- Supabase serves every table in the public schema through its REST API using a
-- public key. With RLS on and no policies, that API can read nothing. Prisma
-- connects as the table owner, which RLS does not restrict, so the app is unaffected.
DO $$
DECLARE
  t record;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = current_schema() LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t.tablename);
  END LOOP;
END $$;
