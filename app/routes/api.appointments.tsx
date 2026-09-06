import { getSql } from "../lib/db.server";
export async function action({ request }: { request: Request }) {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  const body = await request.json().catch(() => null);
  if (!body?.date || !body?.time) return Response.json({ error: "missing date/time" }, { status: 400 });
  const sql = getSql();
  await sql`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS service TEXT`;
  const rows = await sql`INSERT INTO appointments (user_id, display_name, date, time, service) VALUES (${body.userId ?? null}, ${body.displayName ?? null}, ${body.date}, ${body.time}, ${body.service ?? null}) RETURNING id`;
  return Response.json({ ok: true, id: rows[0].id });
}
export async function loader({ request }: { request: Request }) {
  try {
    const sql = getSql();
    await sql`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS service TEXT`;
    const url = new URL(request.url);
    const filterDate = url.searchParams.get("date");
    const filterService = (url.searchParams.get("service") ?? "").trim().charAt(0).toUpperCase();

    // Per-service upcoming counts (for "รอ X คิว")
    const rows = await sql`SELECT service, COUNT(*)::int AS count FROM appointments WHERE date >= CURRENT_DATE GROUP BY service` as { service: string | null; count: number }[];
    const counts: Record<string, number> = { A: 0, F: 0, C: 0 };
    for (const r of rows) {
      if (!r.service) continue;
      const code = r.service.trim().charAt(0).toUpperCase();
      if (code in counts) counts[code] += r.count;
    }
    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    // Per-date counts for datepicker (next 120 days)
    const byDateRows = await sql`SELECT date::text AS d, service, COUNT(*)::int AS count FROM appointments WHERE date >= CURRENT_DATE AND date < CURRENT_DATE + 120 GROUP BY d, service` as { d: string; service: string | null; count: number }[];
    const byDate: Record<string, Record<string, number>> = {};
    const byDateTotal: Record<string, number> = {};
    for (const r of byDateRows) {
      const code = (r.service ?? "").trim().charAt(0).toUpperCase() || "OTHER";
      if (!byDate[r.d]) byDate[r.d] = {};
      byDate[r.d][code] = (byDate[r.d][code] ?? 0) + r.count;
      byDateTotal[r.d] = (byDateTotal[r.d] ?? 0) + r.count;
    }

    // Booked times for a specific date (+ optional service filter)
    let bookedTimes: string[] = [];
    if (filterDate && /^\d{4}-\d{2}-\d{2}$/.test(filterDate)) {
      const timeRows = filterService && ["A", "F", "C"].includes(filterService)
        ? await sql`SELECT time FROM appointments WHERE date = ${filterDate} AND service ILIKE ${filterService + "%"}` as { time: string }[]
        : await sql`SELECT time FROM appointments WHERE date = ${filterDate}` as { time: string }[];
      bookedTimes = timeRows.map((r) => r.time);
    }

    return Response.json({ counts, total, byDate, byDateTotal, bookedTimes, date: filterDate ?? null });
  } catch (e: any) {
    return Response.json({ counts: { A: 0, F: 0, C: 0 }, total: 0, byDate: {}, byDateTotal: {}, bookedTimes: [], error: e?.message ?? String(e) }, { status: 500 });
  }
}
