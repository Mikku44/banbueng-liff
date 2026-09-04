import { getSql } from "../lib/db.server";
export async function action({ request }: { request: Request }) {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.phone) return Response.json({ error: "missing name/phone" }, { status: 400 });
  const sql = getSql();
  const rows = await sql`INSERT INTO mobile_id_requests (user_id, display_name, name, id_card, phone, relation, tambon, moo, house_no, village, road, soi) VALUES (${body.userId ?? null}, ${body.displayName ?? null}, ${body.name}, ${body.id ?? null}, ${body.phone}, ${body.relation ?? null}, ${body.tambon ?? null}, ${body.moo ?? null}, ${body.houseNo ?? null}, ${body.village ?? null}, ${body.road ?? null}, ${body.soi ?? null}) RETURNING id`;
  return Response.json({ ok: true, id: rows[0].id });
}
export function loader() { return new Response("Not Found", { status: 404 }); }
