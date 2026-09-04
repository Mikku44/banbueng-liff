import { getSql } from "../lib/db.server";
export async function action({ request }: { request: Request }) {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  const body = await request.json().catch(() => null);
  if (!body?.tambon || !body?.village) return Response.json({ error: "missing tambon/village" }, { status: 400 });
  const sql = getSql();
  const rows = await sql`INSERT INTO evac_registrations (user_id, display_name, tambon, village, house_no, members, pets) VALUES (${body.userId ?? null}, ${body.displayName ?? null}, ${body.tambon}, ${body.village}, ${body.houseNo ?? null}, ${JSON.stringify(body.members ?? [])}, ${body.pets ?? null}) RETURNING id`;
  return Response.json({ ok: true, id: rows[0].id });
}
export function loader() { return new Response("Not Found", { status: 404 }); }
