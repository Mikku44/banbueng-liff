import type { Route } from "./+types/calendar";
import { useState } from "react";
import { AppNavbar, BottomNav } from "../components/Navbar";
import { Breadcrumb } from "../components/Breadcrumb";
export function meta({}: Route.MetaArgs){ return [{title: "ปฏิทินวาระ - BANBUENG SMART"}]; }

type Ev = { title:string; start:string; end:string; color:string; owner:string; dress:string; place:string };

const events: Ev[] = [
  { title:"อบรมโครงการพัฒนาข้าราชการ และบุคลากร", start:"2026-08-29T12:33:00", end:"2026-08-29T15:00:00", color:"after:bg-green-500", owner:"ฝ่ายบริหารการปกครอง", dress:"ผ้าไทยงานเทียน", place:"ห้องประชุม ชั้น 2 ที่ว่าการอำเภอบ้านบึง" },
  { title:"ทดสอบระบบ", start:"2026-08-29T12:00:00", end:"2026-08-29T12:30:00", color:"after:bg-yellow-500", owner:"อำเภอบ้านบึง", dress:"ตามสบาย", place:"ที่ว่าการอำเภอ" },
  { title:"เปิดอบรมโครงการพัฒนาประสิทธิภาพการทำงานบุคลากร", start:"2026-08-29T08:30:00", end:"2026-08-29T12:00:00", color:"after:bg-blue-500", owner:"สำนักงาน", dress:"ตามสบาย", place:"ห้องประชุมอำเภอบ้านบึง ชั้น 2" },
  { title:"ทำความสะอาดกองร้อย", start:"2026-08-29T07:30:00", end:"2026-08-29T08:00:00", color:"after:bg-emerald-500", owner:"ปกครองอำเภอบ้านบึง", dress:"ชุดสุภาพผ้าไทยสีขาว ,ครีม", place:"กองร้อย" },
  { title:"นำการออกกำลังกายทุกเช้า", start:"2026-08-29T06:00:00", end:"2026-08-29T07:00:00", color:"after:bg-orange-500", owner:"ปลัดอำเภอฝ่ายความมั่นคง", dress:"ชุดกีฬา", place:"วัดทรัพย์เกษร" },
  { title:"ประชุมกำนัน ผู้ใหญ่บ้าน ประจำเดือน", start:"2026-08-28T09:00:00", end:"2026-08-28T12:00:00", color:"after:bg-blue-500", owner:"อำเภอบ้านบึง", dress:"เครื่องแบบ", place:"หอประชุมอำเภอ" },
];

function formatRange(s:string,e:string){
  const a=new Date(s), b=new Date(e);
  const pad=(n:number)=>String(n).padStart(2,"0");
  return `${pad(a.getHours())}:${pad(a.getMinutes())} - ${pad(b.getHours())}:${pad(b.getMinutes())}`;
}

function CalendarGrid({ date, setDate, events }: { date: Date|undefined; setDate:(d:Date|undefined)=>void; events:Ev[] }){
  const [cur,setCur]=useState(date||new Date(2026,7,1));
  const year=cur.getFullYear(), month=cur.getMonth();
  const first=new Date(year,month,1), last=new Date(year,month+1,0), startDay=first.getDay();
  const days=Array.from({length:last.getDate()},(_,i)=> new Date(year,month,i+1));
  const hasEvent=(d:Date)=> events.some(ev=> new Date(ev.start).toDateString()===d.toDateString());
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
          return (
            <button key={d.toISOString()} onClick={()=>setDate(d)} className={`w-8 h-8 rounded-full text-[13px] flex flex-col items-center justify-center relative ${sel ? "bg-[#0a0a54] text-white" : has ? "bg-[#EEF2FF] text-[#0a0a54] font-medium" : "hover:bg-slate-100"}`} style={!sel && !has ? {color:"#1A1A1A"} as any : {}}>
              {d.getDate()}
              {has && !sel && <span className="w-1 h-1 rounded-full bg-[#0a0a54] absolute bottom-0.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Page(){
  const [date,setDate]=useState<Date|undefined>(new Date(2026,7,29));
  const dayEvents = events.filter(ev=> date && new Date(ev.start).toDateString()===date.toDateString()).sort((a,b)=> new Date(a.start).getTime()-new Date(b.start).getTime());
  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="ปฏิทินวาระ · ข่าวสารอำเภอ" />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[84px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-4">
          <Breadcrumb items={[{label:"หน้าหลัก", to:"/"}, {label:"ปฏิทินวาระอำเภอ"}]} />
          <h1 className="text-[18px] font-bold mt-2" style={{color:"#1A1A1A"}}>ปฏิทินวาระ · ข่าวสารอำเภอ</h1>
        </div>
        <div className="px-4 lg:px-6 pt-6">
          <div className="bg-white rounded-[16px] border border-slate-100 overflow-hidden" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
            <div className="p-4">
              <CalendarGrid date={date} setDate={setDate} events={events} />
            </div>
            <div className="border-t border-slate-100">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="text-[13px] font-medium" style={{color:"#1A1A1A"}}>
                  {date?.toLocaleDateString("th-TH",{ day:"numeric", month:"long", year:"numeric"})}
                  <span className="ml-2 text-[11px] font-normal" style={{color:"#8E95A5"}}>วาระที่จะถึง</span>
                </div>
                <button className="w-6 h-6 rounded-full bg-[#F7F8FC] border border-slate-100 flex items-center justify-center text-[#8E95A5]">+</button>
              </div>
              <div className="px-4 pb-4 space-y-2">
                {dayEvents.length===0 ? (
                  <div className="text-center py-8 text-[13px] bg-[#F7F8FC] rounded-xl border border-slate-100" style={{color:"#8E95A5"}}>ไม่มีวาระในวันนี้</div>
                ) : dayEvents.map(ev=>(
                  <div key={ev.title} className={`bg-[#F7F8FC] relative p-3 pl-6 text-sm rounded-xl border border-slate-100 after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full ${ev.color}`}>
                    <div className="text-[13px] font-medium" style={{color:"#1A1A1A"}}>{ev.title}</div>
                    <div className="text-[11px] mt-1" style={{color:"#8E95A5"}}>{formatRange(ev.start, ev.end)} · {ev.place}</div>
                    <div className="text-[11px] mt-1 flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-white border border-slate-100" style={{color:"#8E95A5"}}>เจ้าของ: {ev.owner}</span>
                      <span className="px-2 py-0.5 rounded-full bg-white border border-slate-100" style={{color:"#8E95A5"}}>แต่งกาย: {ev.dress}</span>
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
