import { getSql } from "../lib/db.server";
export async function action({ request }: { request: Request }) {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  const body = await request.json().catch(() => null);
  if (!body?.date || !body?.time) return Response.json({ error: "missing date/time" }, { status: 400 });
  const sql = getSql();
  const rows = await sql`INSERT INTO appointments (user_id, display_name, date, time) VALUES (${body.userId ?? null}, ${body.displayName ?? null}, ${body.date}, ${body.time}) RETURNING id`;
  return Response.json({ ok: true, id: rows[0].id });
}
export function loader() { return new Response("Not Found", { status: 404 }); }
