import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
await sql`CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  display_name TEXT,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
)`;
await sql`CREATE TABLE IF NOT EXISTS ask_questions (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  display_name TEXT,
  category TEXT,
  question TEXT NOT NULL,
  status TEXT DEFAULT 'รอตอบ',
  created_at TIMESTAMPTZ DEFAULT NOW()
)`;
await sql`CREATE TABLE IF NOT EXISTS evac_registrations (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  display_name TEXT,
  tambon TEXT,
  village TEXT,
  house_no TEXT,
  members JSONB,
  pets TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
)`;
await sql`CREATE TABLE IF NOT EXISTS mobile_id_requests (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  display_name TEXT,
  name TEXT,
  id_card TEXT,
  phone TEXT,
  relation TEXT,
  tambon TEXT,
  moo TEXT,
  house_no TEXT,
  village TEXT,
  road TEXT,
  soi TEXT,
  status TEXT DEFAULT 'รอดำเนินการ',
  created_at TIMESTAMPTZ DEFAULT NOW()
)`;
console.log("migrated");
const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`;
console.log(tables.map(r=>r.table_name));
