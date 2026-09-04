import type { Route } from "./+types/registration.appointment";
import { useState, useEffect, useMemo } from "react";
import { AppNavbar, BottomNav } from "../components/Navbar";
import { Breadcrumb } from "../components/Breadcrumb";
import liff from "@line/liff";
import { useLiff } from "../lib/liff";
export function meta({}: Route.MetaArgs){ return [{title:"นัดหมายสอบสวน - BANBUENG SMART"}]; }

const API_BASE = "https://thailandformats.com/api/v1";

function toKey(d: Date){
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function expandHolidays(holidays: {title:string; start_date:string; end_date:string}[]): Map<string,string> {
  const m = new Map<string,string>();
  for(const h of holidays){
    const s = new Date(h.start_date);
    const e = new Date(h.end_date);
    for(let d=new Date(s); d<=e; d.setDate(d.getDate()+1)){
      m.set(toKey(d), h.title);
    }
  }
  return m;
}

async function fetchYear(year:number, signal?:AbortSignal): Promise<Map<string,string>>{
  const res = await fetch(`${API_BASE}/holidays/${year}`, { signal, headers:{Accept:"application/json"}});
  if(!res.ok) throw new Error(String(res.status));
  const data = await res.json();
  return expandHolidays(data.holidays ?? []);
}

function CalendarGrid({ date, setDate, disabledDates, holidayMap, onMonthChange }: { date: Date | undefined; setDate: (d:Date|undefined)=>void; disabledDates: Date[]; holidayMap: Map<string,string>; onMonthChange?: (y:number,m:number)=>void }) {
  const [cur, setCur] = useState(date || new Date());
  useEffect(()=>{ if(date) setCur(new Date(date.getFullYear(), date.getMonth(), 1)); }, []);
  const year = cur.getFullYear();
  const month = cur.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month+1, 0);
  const startDay = first.getDay();
  const days = Array.from({length: last.getDate()}, (_,i)=> new Date(year, month, i+1));
  const isWeekend = (d:Date) => d.getDay()===0 || d.getDay()===6;
  const isHoliday = (d:Date) => holidayMap.has(toKey(d));
  const isDisabled = (d:Date) => isWeekend(d) || isHoliday(d) || disabledDates.some(x=> x.toDateString()===d.toDateString());
  const isSelected = (d:Date) => date && d.toDateString()===date.toDateString();
  const months = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
  const go = (y:number,m:number)=>{ const n=new Date(y,m,1); setCur(n); onMonthChange?.(n.getFullYear(), n.getMonth()); };
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={()=>go(year, month-1)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">‹</button>
        <span className="text-[14px] font-semibold" style={{color:"#1A1A1A"}}>{months[month]} {year+543}</span>
        <button onClick={()=>go(year, month+1)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] mb-1" style={{color:"#8E95A5"}}>
        {["อา","จ","อ","พ","พฤ","ศ","ส"].map(d=> <div key={d} className="py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({length: startDay}).map((_,i)=><div key={"e"+i} />)}
        {days.map(d=>{
          const dis = isDisabled(d);
          const sel = isSelected(d);
          const hol = holidayMap.get(toKey(d));
          const wk = isWeekend(d);
          let title = "";
          if(hol) title = hol;
          else if(wk) title = "เสาร์-อาทิตย์ ปิดทำการ";
          else if(dis) title = "คิวเต็ม";
          return (
            <button
              key={d.toISOString()}
              disabled={dis}
              title={title}
              onClick={()=>!dis && setDate(d)}
              className={`w-8 h-8 rounded-full text-[13px] flex items-center justify-center transition relative ${dis ? hol ? "bg-amber-50 text-amber-600 line-through cursor-not-allowed border border-amber-200" : wk ? "text-slate-300 line-through bg-slate-50 cursor-not-allowed" : "text-slate-300 line-through bg-slate-50 cursor-not-allowed" : sel ? "bg-[#0a0a54] text-white" : "hover:bg-slate-100"}`}
              style={!dis && !sel ? {color:"#1A1A1A"} : {}}
            >{d.getDate()}</button>
          );
        })}
      </div>
    </div>
  );
}

export default function Appointment(){
  const bookedDates = useMemo(()=> Array.from({ length: 3 }, (_, i) => new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + i)), []);
  const [holidayMap, setHolidayMap] = useState<Map<string,string>>(new Map());
  const [loadingHol, setLoadingHol] = useState(true);
  const [viewYear, setViewYear] = useState(()=> new Date().getFullYear());
  const [fetchedYears, setFetchedYears] = useState<Set<number>>(new Set());

  useEffect(()=>{
    const years = [viewYear-1, viewYear, viewYear+1].filter(y=>!fetchedYears.has(y));
    if(years.length===0) return;
    const ctrl = new AbortController();
    (async()=>{
      try{
        const maps = await Promise.all(years.map(y=> fetchYear(y, ctrl.signal).catch(()=> new Map<string,string>() as Map<string,string>)));
        setHolidayMap(prev=>{
          const next = new Map(prev);
          for(const m of maps) for(const [k,v] of m) next.set(k,v);
          return next;
        });
        setFetchedYears(prev=>{ const n=new Set(prev); years.forEach(y=>n.add(y)); return n; });
      } finally { setLoadingHol(false); }
    })();
    return ()=> ctrl.abort();
  }, [viewYear, fetchedYears]);

  useEffect(()=>{
    const y0 = new Date().getFullYear();
    const ctrl = new AbortController();
    setLoadingHol(true);
    Promise.all([fetchYear(y0, ctrl.signal), fetchYear(y0+1, ctrl.signal)]).then(([a,b])=>{
      const m=new Map<string,string>();
      for(const [k,v] of a) m.set(k,v);
      for(const [k,v] of b) m.set(k,v);
      setHolidayMap(m);
      setFetchedYears(new Set([y0,y0+1]));
    }).catch(()=>{}).finally(()=> setLoadingHol(false));
    return ()=> ctrl.abort();
  }, []);

  const isWeekendDate = (d: Date) => d.getDay()===0 || d.getDay()===6;
  const isBooked = (d: Date) => bookedDates.some(x=> x.toDateString()===d.toDateString());
  const isHolidayDate = (d: Date) => holidayMap.has(toKey(d));
  const isUnavailable = (d: Date) => isWeekendDate(d) || isBooked(d) || isHolidayDate(d);
  const getInitialDate = (): Date | undefined => {
    let d = new Date();
    for(let i=0; i<30; i++){
      if(!isUnavailable(d)) return d;
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate()+1);
    }
    return undefined;
  };
  const [date, setDate] = useState<Date | undefined>(()=> {
    let d = new Date();
    for(let i=0;i<30;i++){
      const wk=d.getDay()===0||d.getDay()===6;
      const booked=bookedDates.some(x=>x.toDateString()===d.toDateString());
      if(!wk && !booked) return d;
      d=new Date(d.getFullYear(), d.getMonth(), d.getDate()+1);
    }
    return undefined;
  });
  useEffect(()=>{
    if(date && isUnavailable(date) && holidayMap.size>0){
      const n=getInitialDate();
      if(n) setDate(n);
    }
  }, [holidayMap]);

  const [selectedTime, setSelectedTime] = useState<string | null>("10:00");
  const timeSlots = Array.from({ length: 37 }, (_, i) => {
    const totalMinutes = i * 15;
    const hour = Math.floor(totalMinutes / 60) + 9;
    const minute = totalMinutes % 60;
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  });
  const isDateUnavailable = date ? isUnavailable(date) : false;
  const holidayTitle = date ? holidayMap.get(toKey(date)) : undefined;
  const weekendUnavailable = date ? isWeekendDate(date) : false;
  const { isInClient, profile } = useLiff();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleConfirm(){
    if(!date || !selectedTime || isDateUnavailable) return;
    const dateStr = date.toLocaleDateString("th-TH",{ weekday:"long", day:"numeric", month:"long", year:"numeric"});
    const isoDate = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
    const text = `📅 ยืนยันนัดหมายสอบสวน (ปค.14)\nวันที่: ${dateStr}\nเวลา: ${selectedTime} น.\nสถานที่: ที่ว่าการอำเภอบ้านบึง\nประเภท: รับรองโสด · บุคคลคนเดียวกัน · เพิ่มชื่อฯ`;
    setSending(true);
    try{
      await fetch("/api/appointments",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ date: isoDate, time: selectedTime, userId: profile?.userId ?? null, displayName: profile?.displayName ?? null }) }).catch(()=>null);
      if(isInClient){
        if(!liff.isApiAvailable("sendMessages")){
          alert("LIFF sendMessages ไม่พร้อมใช้งานในเวอร์ชันนี้");
          return;
        }
        await liff.sendMessages([{ type:"text", text }]);
        setSent(true);
        setTimeout(()=>liff.closeWindow(), 500);
      } else if(liff.isApiAvailable("shareTargetPicker")){
        const res = await liff.shareTargetPicker([{ type:"text", text } as any]);
        if(res) setSent(true);
        else alert("ยกเลิกการส่ง");
      } else {
        await navigator.clipboard.writeText(text);
        alert(text + "\n\n(คัดลอกข้อความแล้ว - เปิดใน LINE จะส่งเข้าแชตอัตโนมัติ)");
        setSent(true);
      }
    } catch(e:any){
      alert(e?.message ?? String(e));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="นัดหมายสอบสวน (ปค.14)" />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[84px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-4">
          <Breadcrumb items={[{label:"หน้าหลัก", to:"/"}, {label:"งานทะเบียนและบัตร", to:"/registration"}, {label:"นัดหมายสอบสวน"}]} />
          <h1 className="text-[18px] font-bold mt-2" style={{color:"#1A1A1A"}}>นัดหมายสอบสวน (ปค.14)</h1>
          <p className="text-[12px] mt-1" style={{color:"#8E95A5"}}>รับรองโสด · บุคคลคนเดียวกัน · เพิ่มชื่อในทะเบียนบ้าน · รับรองเกิด/ตาย ฯลฯ</p>
        </div>

        <div className="px-4 lg:px-6 pt-6">
          <div className="bg-white rounded-[16px] border border-slate-100 overflow-hidden" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[14px] font-semibold" style={{color:"#1A1A1A"}}>จองนัดหมาย</span>
              <span className="text-[11px] px-2 py-1 rounded-full bg-[#EEF2FF]" style={{color:"#0a0a54"}}>ปค.14</span>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 p-4">
                <CalendarGrid date={date} setDate={setDate} disabledDates={bookedDates} holidayMap={holidayMap} onMonthChange={(y)=>setViewYear(y)} />
                <div className="mt-3 flex flex-wrap gap-2 text-[11px]" style={{color:"#8E95A5"}}>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#0a0a54]" /> เลือกแล้ว</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-200" /> ไม่ว่าง / เต็ม</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-100 border border-slate-300" /> เสาร์-อาทิตย์ ปิดทำการ</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 border border-amber-300" /> วันหยุดนักขัตฤกษ์ {loadingHol ? "(โหลด...)" : ""}</span>
                </div>
                {loadingHol && <div className="mt-2 text-[11px]" style={{color:"#8E95A5"}}>กำลังโหลดวันหยุดจาก thailandformats.com…</div>}
              </div>
              <div className="md:w-48 border-t md:border-t-0 md:border-l border-slate-100 flex flex-col">
                <div className="px-4 py-3 text-[12px] font-medium border-b border-slate-100" style={{color:"#1A1A1A"}}>เลือกเวลา</div>
                <div className="flex-1 overflow-auto max-h-[240px] md:max-h-[320px] p-3 space-y-1.5">
                  {isDateUnavailable ? (
                    <div className="py-10 text-center text-[12px] leading-relaxed" style={{color:"#8E95A5"}}>
                      {holidayTitle ? <><span className="font-medium text-amber-600">{holidayTitle}</span><br/>วันหยุดนักขัตฤกษ์<br/>ไม่เปิดนัดหมาย</> : weekendUnavailable ? <>วันเสาร์-อาทิตย์<br/>คิวเต็ม / ปิดทำการ<br/>กรุณาเลือกวันจันทร์-ศุกร์</> : <>คิวเต็ม / ไม่ว่าง<br/>กรุณาเลือกวันอื่น</>}
                    </div>
                  ) : !date ? (
                    <div className="py-10 text-center text-[12px]" style={{color:"#8E95A5"}}>กรุณาเลือกวันที่</div>
                  ) : timeSlots.map(time=>(
                    <button
                      key={time}
                      onClick={()=>setSelectedTime(time)}
                      className={`w-full py-2 rounded-full text-[13px] font-medium border transition ${selectedTime===time ? "bg-[#0a0a54] text-white border-[#0a0a54]" : "bg-white border-slate-200 hover:border-[#0a0a54]/30"}`}
                    >{time}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-4 py-3 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[13px]" style={{color:"#1A1A1A"}}>
                {date && !isDateUnavailable && selectedTime ? (
                  <>
                    <span className="w-4 h-4 rounded-full bg-[#00C875] text-white flex items-center justify-center text-[10px]">✓</span>
                    <span>นัดหมายวันที่ <b>{date.toLocaleDateString("th-TH",{ weekday:"long", day:"numeric", month:"long", year:"numeric"})}</b> เวลา <b>{selectedTime}</b></span>
                  </>
                ) : isDateUnavailable ? <span style={{color:"#EF4444"}}>{holidayTitle ? `${holidayTitle} - ไม่เปิดนัดหมาย` : weekendUnavailable ? "วันเสาร์-อาทิตย์ ไม่เปิดนัดหมาย" : "วันที่เลือกไม่ว่าง"}</span>
                : <span style={{color:"#8E95A5"}}>เลือกวันและเวลาเพื่อนัดหมาย</span>}
              </div>
              <button onClick={handleConfirm} disabled={!date || !selectedTime || isDateUnavailable || sending || sent} className={`w-full md:w-auto px-6 py-2.5 rounded-full text-[13px] font-semibold border transition ${!date || !selectedTime || isDateUnavailable || sending || sent ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" : "bg-white border-[#0a0a54] text-[#0a0a54] hover:bg-[#0a0a54] hover:text-white"}`}>{sent ? "ส่งเข้าแชตแล้ว ✓" : sending ? "กำลังส่ง..." : "ยืนยันการจอง"}</button>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-center" style={{color:"#8E95A5"}}>จองคิวล่วงหน้า • เปิดทำการ จันทร์-ศุกร์ 08:30-16:30 • วันหยุดนักขัตฤกษ์ปิดทำการ (ข้อมูลจาก thailandformats.com) • ติดต่อ 038-446202</div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
