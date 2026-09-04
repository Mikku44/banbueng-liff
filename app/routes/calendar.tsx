import type { Route } from "./+types/calendar";
import { useState } from "react";
import { useLoaderData } from "react-router";
import { AppNavbar, BottomNav } from "../components/Navbar";
import { Breadcrumb } from "../components/Breadcrumb";
import { getSql } from "../lib/db.server";

export function meta({}: Route.MetaArgs){ return [{title: "ปฏิทินวาระ - BANBUENG SMART"}]; }

type Ev = { id:number; title:string; start:string; end:string; color:string; owner:string; dress:string; place:string };
type Hol = { id:number; title:string; date:string; type:string };

export async function loader(){
  const sql = getSql();
  const [rows, hols] = await Promise.all([
    sql`SELECT id, title, start_at, end_at, color, owner, dress, place FROM calendar_events ORDER BY start_at ASC`,
    sql`SELECT id, title, date, type FROM holidays ORDER BY date ASC`,
  ]);
  const events: Ev[] = rows.map((r:any)=>({
    id: r.id, title: r.title,
    start: new Date(r.start_at).toISOString(),
    end: new Date(r.end_at).toISOString(),
    color: r.color, owner: r.owner, dress: r.dress, place: r.place,
  }));
  const holidays: Hol[] = hols.map((r:any)=>({ id:r.id, title:r.title, date: new Date(r.date).toISOString().slice(0,10), type:r.type }));
  return { events, holidays };
}

export async function action(){
  return new Response(JSON.stringify({ error: "ไม่อนุญาตให้เพิ่ม/ลบวาระ" }), { status: 403, headers: { "Content-Type": "application/json" } });
}

function formatRange(s:string,e:string){
  const a=new Date(s), b=new Date(e);
  const pad=(n:number)=>String(n).padStart(2,"0");
  return `${pad(a.getHours())}:${pad(a.getMinutes())} - ${pad(b.getHours())}:${pad(b.getMinutes())}`;
}
function toISODate(d:Date){ return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }

function CalendarGrid({ date, setDate, events, holidays }: { date: Date|undefined; setDate:(d:Date|undefined)=>void; events:Ev[]; holidays:Hol[] }){
  const [cur,setCur]=useState(date||new Date());
  const year=cur.getFullYear(), month=cur.getMonth();
  const first=new Date(year,month,1), last=new Date(year,month+1,0), startDay=first.getDay();
  const days=Array.from({length:last.getDate()},(_,i)=> new Date(year,month,i+1));
  const holSet = new Set(holidays.map(h=>h.date));
  const hasEvent=(d:Date)=> events.some(ev=> new Date(ev.start).toDateString()===d.toDateString());
  const isHoliday=(d:Date)=> holSet.has(toISODate(d));
  const isSelected=(d:Date)=> date && d.toDateString()===date.toDateString();
  const months=["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={()=>setCur(new Date(year,month-1,1))} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">‹</button>
        <span className="text-[14px] font-semibold" style={{color:"#1A1A1A"}}>{months[month]} {year+543}</span>
        <button onClick={()=>setCur(new Date(year,month+1,1))} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] mb-1" style={{color:"#8E95A5"}}>{["อา","จ","อ","พ","พฤ","ศ","ส"].map(d=> <div key={d} className="py-1">{d}</div>)}</div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({length:startDay}).map((_,i)=><div key={"e"+i} />)}
        {days.map(d=>{
          const sel=isSelected(d);
          const has=hasEvent(d);
          const hol=isHoliday(d);
          const isSun = d.getDay()===0;
          let cls = "hover:bg-slate-100";
          if(sel) cls="bg-[#0a0a54] text-white";
          else if(hol) cls="bg-[#FFF1F2] text-[#DC2626] font-semibold";
          else if(has) cls="bg-[#EEF2FF] text-[#0a0a54] font-medium";
          else if(isSun) cls="text-[#DC2626] hover:bg-slate-100";
          return (
            <button key={d.toISOString()} onClick={()=>setDate(d)} className={`w-8 h-8 rounded-full text-[13px] flex flex-col items-center justify-center relative ${cls}`} style={!sel && !has && !hol && !isSun ? {color:"#1A1A1A"} as any : {}}>
              {d.getDate()}
              <span className="absolute bottom-0.5 flex gap-0.5">
                {hol && !sel && <span className="w-1 h-1 rounded-full bg-[#DC2626]" />}
                {has && !sel && <span className={`w-1 h-1 rounded-full ${hol ? "bg-[#DC2626]" : "bg-[#0a0a54]"}`} />}
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex gap-3 mt-3 text-[11px] justify-center" style={{color:"#8E95A5"}}>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#0a0a54] inline-block" />วาระ</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#DC2626] inline-block" />วันหยุด</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FFF1F2] border border-[#FECDD3] inline-block" />วันหยุดนักขัตฤกษ์</span>
      </div>
    </div>
  );
}

export default function Page(){
  const { events, holidays } = useLoaderData<typeof loader>();
  const [date,setDate]=useState<Date|undefined>(new Date());
  const iso = date ? toISODate(date) : "";
  const dayEvents = events.filter(ev=> date && new Date(ev.start).toDateString()===date.toDateString()).sort((a,b)=> new Date(a.start).getTime()-new Date(b.start).getTime());
  const dayHolidays = holidays.filter(h=> h.date===iso);

  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="ปฏิทินวาระ · ข่าวสารอำเภอ" />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[84px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-4">
          <Breadcrumb items={[{label:"หน้าหลัก", to:"/"}, {label:"ปฏิทินวาระอำเภอ"}]} />
          <h1 className="text-[18px] font-bold mt-2" style={{color:"#1A1A1A"}}>ปฏิทินวาระ · ข่าวสารอำเภอ</h1>
          <p className="text-[12px] mt-1" style={{color:"#8E95A5"}}>เชื่อม Neon · {events.length} วาระ · {holidays.length} วันหยุด</p>
        </div>
        <div className="px-4 lg:px-6 pt-6">
          <div className="bg-white rounded-[16px] border border-slate-100 overflow-hidden" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
            <div className="p-4">
              <CalendarGrid date={date} setDate={setDate} events={events} holidays={holidays} />
            </div>
            <div className="border-t border-slate-100">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="text-[13px] font-medium" style={{color:"#1A1A1A"}}>
                  {date?.toLocaleDateString("th-TH",{ day:"numeric", month:"long", year:"numeric"})}
                  <span className="ml-2 text-[11px] font-normal" style={{color:"#8E95A5"}}>{dayHolidays.length>0 ? `วันหยุด · ` : ""}วาระ {dayEvents.length} รายการ</span>
                </div>
              </div>

              <div className="px-4 pb-4 space-y-2">
                {dayHolidays.map(h=>(
                  <div key={`h-${h.id}`} className="bg-[#FFF1F2] relative p-3 pl-6 text-sm rounded-xl border border-red-100 after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full after:bg-[#DC2626]">
                    <div className="text-[13px] font-semibold flex items-center gap-2" style={{color:"#DC2626"}}><span className="px-2 py-0.5 rounded-full bg-[#DC2626] text-white text-[10px]">วันหยุด</span>{h.title}</div>
                    <div className="text-[11px] mt-1" style={{color:"#991B1B"}}>{h.type==="buddhist" ? "วันสำคัญทางพุทธศาสนา" : h.type==="public" ? "วันหยุดนักขัตฤกษ์" : "วันหยุด"} · {new Date(h.date).toLocaleDateString("th-TH",{day:"numeric",month:"long",year:"numeric"})}</div>
                  </div>
                ))}
                {dayEvents.length===0 && dayHolidays.length===0 ? (
                  <div className="text-center py-8 text-[13px] bg-[#F7F8FC] rounded-xl border border-slate-100" style={{color:"#8E95A5"}}>ไม่มีวาระในวันนี้</div>
                ) : dayEvents.map(ev=>(
                  <div key={ev.id} className={`bg-[#F7F8FC] relative p-3 pl-6 text-sm rounded-xl border border-slate-100 after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full ${ev.color}`}>
                    <div className="text-[13px] font-medium" style={{color:"#1A1A1A"}}>{ev.title}</div>
                    <div className="text-[11px] mt-1" style={{color:"#8E95A5"}}>{formatRange(ev.start, ev.end)} · {ev.place}</div>
                    <div className="text-[11px] mt-1 flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-white border border-slate-100" style={{color:"#8E95A5"}}>เจ้าของ: {ev.owner || "-"}</span>
                      <span className="px-2 py-0.5 rounded-full bg-white border border-slate-100" style={{color:"#8E95A5"}}>แต่งกาย: {ev.dress || "-"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
