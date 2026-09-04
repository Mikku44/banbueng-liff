import { neon } from '@neondatabase/serverless';
const sql=neon(process.env.DATABASE_URL);
for(const t of ['appointments','ask_questions','evac_registrations','mobile_id_requests','calendar_events','holidays']){
  const cnt = await sql.query(`SELECT count(*)::int as c FROM ${t}`, []);
  console.log(t, cnt);
}
const a = await sql`SELECT * FROM ask_questions LIMIT 5`;
console.log('ask',a);
const e = await sql`SELECT * FROM evac_registrations LIMIT 5`;
console.log('evac',e);
