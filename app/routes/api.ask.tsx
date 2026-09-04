import { getSql } from "../lib/db.server";
export async function action({ request }: { request: Request }) {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  const body = await request.json().catch(() => null);
  if (!body?.question) return Response.json({ error: "missing question" }, { status: 400 });
  const sql = getSql();
  const rows = await sql`INSERT INTO ask_questions (user_id, display_name, category, question, status) VALUES (${body.userId ?? null}, ${body.displayName ?? null}, ${body.category ?? "ยังไม่จัดหมวด"}, ${body.question}, 'รอตอบ') RETURNING id`;
  return Response.json({ ok: true, id: rows[0].id });
}
export function loader() { return new Response("Not Found", { status: 404 }); }
