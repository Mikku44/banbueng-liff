import { neon } from "@neondatabase/serverless";
import fs from "fs";

const env = fs.readFileSync(".env.local","utf8");
const m = env.match(/^DATABASE_URL="([^"]+)"/m);
const url = m?.[1] || process.env.DATABASE_URL;
if(!url) throw new Error("DATABASE_URL not found");
const sql = neon(url);

await sql`
  CREATE TABLE IF NOT EXISTS calendar_events (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    color TEXT NOT NULL DEFAULT 'after:bg-blue-500',
    owner TEXT NOT NULL DEFAULT '',
    dress TEXT NOT NULL DEFAULT '',
    place TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`;

await sql`CREATE INDEX IF NOT EXISTS idx_calendar_events_start_at ON calendar_events(start_at);`;

const count = await sql`SELECT count(*)::int as c FROM calendar_events`;
console.log("table ready, count:", count[0].c);

if(count[0].c === 0){
  await sql`
    INSERT INTO calendar_events (title, start_at, end_at, color, owner, dress, place) VALUES
    ('อบรมโครงการพัฒนาข้าราชการ และบุคลากร', '2026-08-29T12:33:00+07:00', '2026-08-29T15:00:00+07:00', 'after:bg-green-500', 'ฝ่ายบริหารการปกครอง', 'ผ้าไทยงานเทียน', 'ห้องประชุม ชั้น 2 ที่ว่าการอำเภอบ้านบึง'),
    ('ทดสอบระบบ', '2026-08-29T12:00:00+07:00', '2026-08-29T12:30:00+07:00', 'after:bg-yellow-500', 'อำเภอบ้านบึง', 'ตามสบาย', 'ที่ว่าการอำเภอ'),
    ('เปิดอบรมโครงการพัฒนาประสิทธิภาพการทำงานบุคลากร', '2026-08-29T08:30:00+07:00', '2026-08-29T12:00:00+07:00', 'after:bg-blue-500', 'สำนักงาน', 'ตามสบาย', 'ห้องประชุมอำเภอบ้านบึง ชั้น 2'),
    ('ทำความสะอาดกองร้อย', '2026-08-29T07:30:00+07:00', '2026-08-29T08:00:00+07:00', 'after:bg-emerald-500', 'ปกครองอำเภอบ้านบึง', 'ชุดสุภาพผ้าไทยสีขาว ,ครีม', 'กองร้อย'),
    ('นำการออกกำลังกายทุกเช้า', '2026-08-29T06:00:00+07:00', '2026-08-29T07:00:00+07:00', 'after:bg-orange-500', 'ปลัดอำเภอฝ่ายความมั่นคง', 'ชุดกีฬา', 'วัดทรัพย์เกษร'),
    ('ประชุมกำนัน ผู้ใหญ่บ้าน ประจำเดือน', '2026-08-28T09:00:00+07:00', '2026-08-28T12:00:00+07:00', 'after:bg-blue-500', 'อำเภอบ้านบึง', 'เครื่องแบบ', 'หอประชุมอำเภอ')
  `;
  console.log("seeded 6 events");
}
console.log("done");
