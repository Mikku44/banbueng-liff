import { getSql } from "../lib/db.server";

async function ensureColumns(sql: any) {
  await sql`ALTER TABLE mobile_id_requests ADD COLUMN IF NOT EXISTS applicant_name TEXT`;
  await sql`ALTER TABLE mobile_id_requests ADD COLUMN IF NOT EXISTS applicant_id_card TEXT`;
  await sql`ALTER TABLE mobile_id_requests ADD COLUMN IF NOT EXISTS applicant_birthdate TEXT`;
  await sql`ALTER TABLE mobile_id_requests ADD COLUMN IF NOT EXISTS applicant_gender TEXT`;
  await sql`ALTER TABLE mobile_id_requests ADD COLUMN IF NOT EXISTS applicant_phone TEXT`;
  await sql`ALTER TABLE mobile_id_requests ADD COLUMN IF NOT EXISTS app_tambon TEXT`;
  await sql`ALTER TABLE mobile_id_requests ADD COLUMN IF NOT EXISTS app_moo TEXT`;
  await sql`ALTER TABLE mobile_id_requests ADD COLUMN IF NOT EXISTS app_house_no TEXT`;
  await sql`ALTER TABLE mobile_id_requests ADD COLUMN IF NOT EXISTS app_village TEXT`;
  await sql`ALTER TABLE mobile_id_requests ADD COLUMN IF NOT EXISTS app_road TEXT`;
  await sql`ALTER TABLE mobile_id_requests ADD COLUMN IF NOT EXISTS app_soi TEXT`;
  await sql`ALTER TABLE mobile_id_requests ADD COLUMN IF NOT EXISTS landmark TEXT`;
  await sql`ALTER TABLE mobile_id_requests ADD COLUMN IF NOT EXISTS condition_type TEXT`;
  await sql`ALTER TABLE mobile_id_requests ADD COLUMN IF NOT EXISTS reason_detail TEXT`;
  await sql`ALTER TABLE mobile_id_requests ADD COLUMN IF NOT EXISTS urgency TEXT`;
  await sql`ALTER TABLE mobile_id_requests ADD COLUMN IF NOT EXISTS note TEXT`;
  await sql`ALTER TABLE mobile_id_requests ADD COLUMN IF NOT EXISTS doc_ready TEXT`;
}

export async function action({ request }: { request: Request }) {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.phone) return Response.json({ error: "missing name/phone" }, { status: 400 });
  if (!body?.applicantName) return Response.json({ error: "missing applicantName" }, { status: 400 });
  const sql = getSql();
  await ensureColumns(sql);
  const rows = await sql`INSERT INTO mobile_id_requests (
    user_id, display_name, name, id_card, phone, relation, tambon, moo, house_no, village, road, soi,
    applicant_name, applicant_id_card, applicant_birthdate, applicant_gender, applicant_phone,
    app_tambon, app_moo, app_house_no, app_village, app_road, app_soi, landmark,
    condition_type, reason_detail, urgency, note, doc_ready
  ) VALUES (
    ${body.userId ?? null}, ${body.displayName ?? null}, ${body.name}, ${body.id ?? null}, ${body.phone}, ${body.relation ?? null}, ${body.tambon ?? null}, ${body.moo ?? null}, ${body.houseNo ?? null}, ${body.village ?? null}, ${body.road ?? null}, ${body.soi ?? null},
    ${body.applicantName ?? null}, ${body.applicantId ?? null}, ${body.applicantBirthdate ?? null}, ${body.applicantGender ?? null}, ${body.applicantPhone ?? null},
    ${body.appTambon ?? null}, ${body.appMoo ?? null}, ${body.appHouseNo ?? null}, ${body.appVillage ?? null}, ${body.appRoad ?? null}, ${body.appSoi ?? null}, ${body.landmark ?? null},
    ${body.conditionType ?? null}, ${body.reasonDetail ?? null}, ${body.urgency ?? null}, ${body.note ?? null}, ${body.docReady ?? null}
  ) RETURNING id`;
  return Response.json({ ok: true, id: rows[0].id });
}

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  try {
    const sql = getSql();
    await ensureColumns(sql);
    if (!userId) {
      const rows = await sql`SELECT * FROM mobile_id_requests ORDER BY created_at DESC LIMIT 20`;
      return Response.json({ ok: true, items: rows });
    }
    const rows = await sql`SELECT * FROM mobile_id_requests WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 50`;
    return Response.json({ ok: true, items: rows });
  } catch (e: any) {
    return Response.json({ ok: false, error: e?.message ?? String(e), items: [] }, { status: 500 });
  }
}
