import { neon } from "@neondatabase/serverless";
import fs from "fs";
const env = fs.readFileSync(".env.local","utf8");
const m = env.match(/^DATABASE_URL="([^"]+)"/m);
const url = m?.[1] || process.env.DATABASE_URL;
if(!url) throw new Error("DATABASE_URL not found");
const sql = neon(url);

await sql`
  CREATE TABLE IF NOT EXISTS holidays (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    date DATE NOT NULL UNIQUE,
    type TEXT NOT NULL DEFAULT 'public',
    description TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`;
await sql`CREATE INDEX IF NOT EXISTS idx_holidays_date ON holidays(date);`;

const count = await sql`SELECT count(*)::int as c FROM holidays`;
console.log("holidays count:", count[0].c);

if(count[0].c === 0){
  await sql`
    INSERT INTO holidays (title, date, type) VALUES
    ('วันขึ้นปีใหม่','2026-01-01','public'),
    ('วันมาฆบูชา','2026-03-03','buddhist'),
    ('วันจักรี','2026-04-06','public'),
    ('วันสงกรานต์','2026-04-13','public'),
    ('วันสงกรานต์','2026-04-14','public'),
    ('วันสงกรานต์','2026-04-15','public'),
    ('ชดเชยวันสงกรานต์','2026-04-16','public'),
    ('วันแรงงานแห่งชาติ','2026-05-01','public'),
    ('วันฉัตรมงคล','2026-05-04','public'),
    ('วันวิสาขบูชา','2026-05-31','buddhist'),
    ('วันเฉลิมพระชนมพรรษา สมเด็จพระราชินี','2026-06-03','public'),
    ('วันอาสาฬหบูชา','2026-07-29','buddhist'),
    ('วันเข้าพรรษา','2026-07-30','buddhist'),
    ('วันเฉลิมพระชนมพรรษา ร.10','2026-07-28','public'),
    ('วันแม่แห่งชาติ','2026-08-12','public'),
    ('วันคล้ายวันสวรรคต ร.9','2026-10-13','public'),
    ('วันปิยมหาราช','2026-10-23','public'),
    ('วันพ่อแห่งชาติ','2026-12-05','public'),
    ('วันรัฐธรรมนูญ','2026-12-10','public'),
    ('วันสิ้นปี','2026-12-31','public'),
    ('วันขึ้นปีใหม่','2025-01-01','public'),
    ('วันคริสต์มาส','2025-12-25','public'),
    ('วันสงกรานต์','2025-04-13','public'),
    ('วันสงกรานต์','2025-04-14','public'),
    ('วันสงกรานต์','2025-04-15','public')
  `;
  console.log("seeded holidays");
}
console.log("done");
