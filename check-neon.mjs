import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`;
console.log("tables:", tables.map(r=>r.table_name));
for (const t of tables) {
  const cols = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name=${t.table_name} ORDER BY ordinal_position`;
  console.log(`=== ${t.table_name} ===`, cols);
  const c = await sql.unsafe(`SELECT count(*) as c FROM "${t.table_name}"`);
  console.log("count", c[0].c);
}
