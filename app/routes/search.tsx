import type { Route } from "./+types/search";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { HiOutlineMagnifyingGlass, HiOutlineXMark, HiOutlineChevronRight } from "react-icons/hi2";
import { AppNavbar, BottomNav } from "../components/Navbar";
import guideData from "../lib/guide-data.json";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ค้นหา - BANBUENG SMART" }];
}

type Entry = { title: string; desc: string; to: string; cat: string };

const menuItems: Entry[] = [
  { title: "ลงทะเบียนครัวเรือนของฉัน", desc: "กรอกสมาชิก ปักหมุดบ้าน", to: "/evac/register", cat: "เมนูหลัก" },
  { title: "ร้องเรียน สอบถามเจ้าหน้าที่", desc: "ส่งเรื่องพร้อมภาพ", to: "/ask", cat: "เมนูหลัก" },
  { title: "งานทะเบียนและบัตร", desc: "จองคิวออนไลน์ ทะเบียนดิจิทัล", to: "/registration", cat: "เมนูหลัก" },
  { title: "ขอทำบัตรนอกสถานที่", desc: "ผู้ป่วยติดเตียง ผู้สูงอายุ", to: "/registration/mobile-id", cat: "เมนูหลัก" },
  { title: "ถามตอบงานทะเบียน", desc: "คำถามพบบ่อย", to: "/registration/qa", cat: "เมนูหลัก" },
  { title: "ร้องเรียน ร้องทุกข์", desc: "ศูนย์ดำรงธรรม", to: "/ask", cat: "เมนูหลัก" },
  { title: "คู่มือประชาชน 277 เรื่อง", desc: "16 หมวดงาน กรมการปกครอง", to: "/guide", cat: "เมนูหลัก" },
  { title: "พอตแคสต์ความรู้กฎหมาย", desc: "กฎหมาย 5 นาที กฎหมายง่ายจัง", to: "/podcast", cat: "เมนูหลัก" },
  { title: "ข่าวอำเภอ", desc: "ประกาศ ประชาสัมพันธ์", to: "/news/district", cat: "เมนูหลัก" },
  { title: "ปฏิทินวาระอำเภอ", desc: "วาระสำคัญ การแต่งกาย", to: "/calendar", cat: "เมนูหลัก" },
  { title: "กองทุนรวมน้ำใจไทบ้านบึง", desc: "ขอความช่วยเหลือ", to: "/fund", cat: "เมนูหลัก" },
  { title: "ของดีอำเภอบ้านบึง", desc: "OTOP ผลไม้ หัตถกรรม", to: "/products", cat: "เมนูหลัก" },
  { title: "คลังความรู้", desc: "เอกสาร เสียง วิดีโอ", to: "/knowledge", cat: "เมนูหลัก" },
  { title: "ข่าว", desc: "ข่าวสารอำเภอบ้านบึง", to: "/news", cat: "เมนูหลัก" },
  { title: "สายด่วน", desc: "เบอร์ฉุกเฉิน 191 1669", to: "/hotline", cat: "เมนูหลัก" },
  { title: "โปรไฟล์", desc: "โปรไฟล์ อำเภอบ้านบึง", to: "/profile", cat: "เมนูหลัก" },
  { title: "แจ้งเหตุฉุกเฉิน 191", desc: "ตำรวจ", to: "/hotline", cat: "สายด่วน" },
  { title: "กู้ชีพ 1669", desc: "เจ็บป่วยฉุกเฉิน", to: "/hotline", cat: "สายด่วน" },
  { title: "ดับเพลิง 199", desc: "เพลิงไหม้", to: "/hotline", cat: "สายด่วน" },
  { title: "ที่ว่าการอำเภอบ้านบึง 038-443020", desc: "อำเภอบ้านบึง", to: "/hotline", cat: "สายด่วน" },
  { title: "สำนักทะเบียน 038-446202", desc: "จองคิว", to: "/hotline", cat: "สายด่วน" },
  { title: "ศูนย์ดำรงธรรม 1567", desc: "ร้องเรียน", to: "/hotline", cat: "สายด่วน" },
];

const guideEntries: Entry[] = (guideData as any[]).flatMap((c: any) =>
  c.groups.flatMap((g: any) => g.topics.map((t: any) => ({
    title: t.title,
    desc: `${c.title}${g.group ? " • " + g.group : ""} • ${t.summary}`,
    to: `/guide?t=${t.id}`,
    cat: "คู่มือประชาชน",
  })))
);

const all: Entry[] = [...menuItems, ...guideEntries];
const cats = ["ทั้งหมด", "เมนูหลัก", "คู่มือประชาชน", "สายด่วน"] as const;

export default function Search() {
  const [params, setParams] = useSearchParams();
  const initial = params.get("q") || "";
  const [q, setQ] = useState(initial);
  const [activeCat, setActiveCat] = useState<string>("ทั้งหมด");
  const query = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!query) return [];
    let r = all.filter((e) => (e.title + " " + e.desc + " " + e.cat).toLowerCase().includes(query));
    if (activeCat !== "ทั้งหมด") r = r.filter((e) => e.cat === activeCat);
    return r.slice(0, 80);
  }, [query, activeCat]);

  const grouped = useMemo(() => {
    const m = new Map<string, Entry[]>();
    for (const r of results) {
      if (!m.has(r.cat)) m.set(r.cat, []);
      m.get(r.cat)!.push(r);
    }
    return [...m.entries()];
  }, [results]);

  const update = (v: string) => {
    setQ(v);
    setParams((p) => {
      if (v) p.set("q", v);
      else p.delete("q");
      return p;
    }, { replace: true });
  };

  return (
    <div className="min-h-screen" style={{ background: "#F7F8FC" }}>
      <AppNavbar subtitle="ค้นหา" />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[84px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-5">
          <h1 className="text-[18px] font-bold" style={{ color: "#1A1A1A" }}>ค้นหาทั่วทั้งแอป</h1>
          <p className="text-[12px] mt-1" style={{ color: "#8E95A5" }}>เมนู คู่มือ 277 เรื่อง สายด่วน และบริการทั้งหมด</p>
          <div className="mt-4 relative">
            <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px]" style={{ color: "#8E95A5" }} />
            <input
              autoFocus
              value={q}
              onChange={(e) => update(e.target.value)}
              placeholder="พิมพ์คำค้น เช่น บัตรประชาชน แจ้งเกิด ทะเบียนบ้าน สายด่วน..."
              className="w-full pl-10 pr-10 py-3 rounded-[16px] border border-slate-200 bg-white text-[14px] outline-none focus:border-[#0a0a54] placeholder:text-[#8E95A5]"
            />
            {q && (
              <button onClick={() => update("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <HiOutlineXMark className="text-[16px]" />
              </button>
            )}
          </div>

          <div className="mt-6 lg:flex lg:gap-6">
            <div className="hidden lg:block w-[200px] shrink-0">
              <div className="bg-white rounded-[16px] border border-slate-100 p-3 sticky top-[80px]">
                <div className="text-[11px] font-semibold tracking-widest mb-2" style={{ color: "#8E95A5" }}>หมวดหมู่</div>
                <div className="space-y-1">
                  {cats.map((c) => (
                    <button
                      key={c}
                      onClick={() => setActiveCat(c)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-medium transition ${activeCat === c ? "bg-[#0a0a54] text-white" : "text-[#5A607F] hover:bg-[#F7F8FC]"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="text-[11px] font-semibold" style={{ color: "#8E95A5" }}>คำค้นยอดนิยม</div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {["บัตรประชาชน", "แจ้งเกิด", "ทะเบียนบ้าน", "ย้ายที่อยู่", "สายด่วน", "ร้องเรียน"].map((k) => (
                      <button key={k} onClick={() => update(k)} className="text-[11px] px-2.5 py-1 rounded-full bg-[#F7F8FC] border border-slate-100 hover:border-[#0a0a54]/20" style={{ color: "#0a0a54" }}>
                        {k}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex gap-2 lg:hidden overflow-x-auto pb-1">
                {cats.map((c) => (
                  <button key={c} onClick={() => setActiveCat(c)} className={`text-[12px] px-3.5 py-1.5 rounded-full border whitespace-nowrap ${activeCat === c ? "bg-[#0a0a54] text-white border-[#0a0a54]" : "bg-white border-slate-200 text-[#1A1A1A]"}`}>
                    {c}
                  </button>
                ))}
              </div>

              {!query ? (
                <div className="mt-4 lg:mt-0">
                  <div className="lg:hidden flex flex-wrap gap-2">
                    {["บัตรประชาชน", "แจ้งเกิด", "ทะเบียนบ้าน", "ย้ายที่อยู่", "สายด่วน", "ร้องเรียน", "คู่มือ", "อาวุธปืน"].map((k) => (
                      <button key={k} onClick={() => update(k)} className="text-[12px] px-3.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-[#0a0a54]/30" style={{ color: "#0a0a54" }}>
                        {k}
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-2">
                    {menuItems.slice(0, 6).map((e) => (
                      <Link key={e.to + e.title} to={e.to} className="bg-white rounded-[16px] border border-slate-100 p-3.5 flex items-center justify-between hover:border-[#0a0a54]/20">
                        <div><div className="text-[13px] font-semibold" style={{ color: "#1A1A1A" }}>{e.title}</div><div className="text-[11px]" style={{ color: "#8E95A5" }}>{e.desc}</div></div>
                        <HiOutlineChevronRight style={{ color: "#8E95A5" }} />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 lg:mt-0">
                  <div className="text-[12px]" style={{ color: "#8E95A5" }}>พบ {results.length} รายการสำหรับ "{q.trim()}" {activeCat !== "ทั้งหมด" && `• ${activeCat}`}</div>
                  {grouped.length === 0 && <div className="mt-6 text-center py-10 bg-white rounded-[16px] border border-slate-100 text-[13px]" style={{ color: "#8E95A5" }}>ไม่พบผลลัพธ์</div>}
                  <div className="mt-4 space-y-6">
                    {grouped.map(([cat, items]) => (
                      <div key={cat}>
                        <div className="text-[11px] font-semibold tracking-widest mb-2" style={{ color: "#8E95A5" }}>{cat} • {items.length}</div>
                        <div className="space-y-2">
                          {items.map((e) => (
                            <Link key={e.to + e.title} to={e.to} className="block bg-white rounded-[16px] border border-slate-100 p-3.5 flex items-center justify-between hover:border-[#0a0a54]/20 hover:shadow-[0_8px_20px_rgba(10,10,84,0.08)] transition-all">
                              <div className="pr-3 min-w-0">
                                <div className="text-[13px] font-semibold leading-snug line-clamp-2" style={{ color: "#1A1A1A" }}>{e.title}</div>
                                <div className="text-[11px] mt-1 line-clamp-1" style={{ color: "#8E95A5" }}>{e.desc}</div>
                              </div>
                              <HiOutlineChevronRight className="shrink-0" style={{ color: "#8E95A5" }} />
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
