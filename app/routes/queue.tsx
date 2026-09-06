import type { Route } from "./+types/queue";
import { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { AppNavbar, BottomNav } from "../components/Navbar";
import { Breadcrumb } from "../components/Breadcrumb";
import liff from "@line/liff";
import { useLiff } from "../lib/liff";
import { toast } from "sonner";

export function meta({}: Route.MetaArgs) {
  return [{ title: "รับบัตรคิว สำนักทะเบียน - BANBUENG SMART" }, { name: "description", content: "ทะเบียนราษฎร · ทะเบียนทั่วไป · บัตรประชาชน — บัตรคิวส่งเข้าไลน์ แจ้งเมื่อถึงคิว" }];
}

const services = [
  { code:"A", title:"งานทะเบียนราษฎร", desc:"แจ้งเกิด · แจ้งตาย · ย้ายที่อยู่ · ทะเบียนบ้าน · คัดสำเนา", waiting:0 },
  { code:"F", title:"งานทะเบียนทั่วไป", desc:"สมรส · หย่า · รับรองบุตร · เปลี่ยนชื่อ-สกุล · บันทึกฐานะ", waiting:0 },
  { code:"C", title:"งานบัตรประจำตัวประชาชน", desc:"ทำบัตรใหม่ · บัตรหาย · บัตรหมดอายุ · เปลี่ยนที่อยู่ในบัตร", waiting:0 },
];

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

function CalendarGrid({ date, setDate, disabledDates, holidayMap, onMonthChange, dayCounts, capacity }: { date: Date | undefined; setDate: (d:Date|undefined)=>void; disabledDates: Date[]; holidayMap: Map<string,string>; onMonthChange?: (y:number,m:number)=>void; dayCounts?: Record<string, number>; capacity?: number }) {
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
  const isFull = (d:Date) => (capacity ?? 0) > 0 && (dayCounts?.[toKey(d)] ?? 0) >= (capacity ?? 0);
  const isDisabled = (d:Date) => isWeekend(d) || isHoliday(d) || isFull(d) || disabledDates.some(x=> x.toDateString()===d.toDateString());
  const isSelected = (d:Date) => date && d.toDateString()===date.toDateString();
  const months = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
  const go = (y:number,m:number)=>{ const n=new Date(y,m,1); setCur(n); onMonthChange?.(n.getFullYear(), n.getMonth()); };
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={()=>go(year, month-1)} className="w-8 h-8 rounded-full hover:bg-slate-100 hover:text-[#0a0a54] active:scale-90 transition-all cursor-pointer flex items-center justify-center">‹</button>
        <span className="text-[14px] font-semibold" style={{color:"#1A1A1A"}}>{months[month]} {year+543}</span>
        <button type="button" onClick={()=>go(year, month+1)} className="w-8 h-8 rounded-full hover:bg-slate-100 hover:text-[#0a0a54] active:scale-90 transition-all cursor-pointer flex items-center justify-center">›</button>
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
          const booked = dayCounts?.[toKey(d)] ?? 0;
          const full = isFull(d);
          let title = "";
          if(hol) title = hol;
          else if(wk) title = "เสาร์-อาทิตย์ ปิดทำการ";
          else if(full) title = `คิวเต็ม (${booked} คิว)`;
          else if(dis) title = "คิวเต็ม";
          else if(booked>0) title = `มีนัดแล้ว ${booked} คิว`;
          return (
            <button
              key={d.toISOString()}
              type="button"
              disabled={dis}
              title={title}
              onClick={()=>!dis && setDate(d)}
              className={`h-8 min-w-8 px-1 rounded-full text-[13px] flex flex-col items-center justify-center transition-all duration-150 relative active:scale-90 ${dis ? hol ? "bg-amber-50 text-amber-600 line-through cursor-not-allowed border border-amber-200" : wk ? "text-slate-300 line-through bg-slate-50 cursor-not-allowed" : "text-slate-300 line-through bg-slate-50 cursor-not-allowed" : sel ? "bg-[#0a0a54] text-white shadow-md scale-105" : booked>0 ? "bg-[#EEF2FF] hover:bg-[#0a0a54] hover:text-white hover:scale-110 hover:shadow-md cursor-pointer font-semibold" : "hover:bg-[#0a0a54] hover:text-white hover:scale-110 hover:shadow-md cursor-pointer"}`}
              style={!dis && !sel && booked===0 ? {color:"#1A1A1A"} : !sel && booked>0 ? {color:"#0a0a54"} : {}}
            ><span className="leading-none">{d.getDate()}</span>{!dis && booked>0 && <span className={`mt-0.5 text-[8px] leading-none font-bold px-1 rounded-full ${sel ? "bg-white/25 text-white" : "bg-[#0a0a54] text-white"}`}>{booked}</span>}</button>
          );
        })}
      </div>
    </div>
  );
}

export default function Queue() {
  const [modalCode, setModalCode] = useState<string | null>(null);
  const modalService = services.find(s=>s.code===modalCode) ?? null;

  const bookedDates = useMemo<Date[]>(()=>[], []);
  const [appointmentByDate, setAppointmentByDate] = useState<Record<string, Record<string, number>>>({});
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
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
  const isUnavailable = (d: Date) => isWeekendDate(d) || isBooked(d) || isHolidayDate(d) || isFullDate(d);
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
      if(!wk) return d;
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

  const timeSlots = useMemo(()=>{
    const out: string[] = [];
    for(let mins=8*60+30; mins<=16*60+30; mins+=15){
      out.push(`${String(Math.floor(mins/60)).padStart(2,"0")}:${String(mins%60).padStart(2,"0")}`);
    }
    return out;
  }, []);
  const capacity = timeSlots.length;
  const dayCountsForService = useMemo(()=>{
    const m: Record<string, number> = {};
    for(const [d, per] of Object.entries(appointmentByDate)){
      m[d] = modalCode ? (per[modalCode] ?? 0) : Object.values(per).reduce((a,b)=>a+b,0);
    }
    return m;
  }, [appointmentByDate, modalCode]);
  const isFullDate = (d: Date) => (dayCountsForService[toKey(d)] ?? 0) >= capacity;
  const [selectedTime, setSelectedTime] = useState<string | null>("09:00");
  const isDateUnavailable = date ? isUnavailable(date) : false;
  const holidayTitle = date ? holidayMap.get(toKey(date)) : undefined;
  const weekendUnavailable = date ? isWeekendDate(date) : false;
  const { isInClient, profile } = useLiff();
  const [sending, setSending] = useState(false);
  const [sentMap, setSentMap] = useState<Record<string,{display:string; time:string}>>({});
  const [queueCounts, setQueueCounts] = useState<Record<string, number>>({ A: 0, F: 0, C: 0 });
  const [countsLoading, setCountsLoading] = useState(true);

  async function refreshCounts(signal?: AbortSignal){
    try{
      const res = await fetch("/api/appointments", { signal });
      if(!res.ok) return;
      const data = await res.json();
      if(data?.counts) setQueueCounts({ A: data.counts.A ?? 0, F: data.counts.F ?? 0, C: data.counts.C ?? 0 });
      if(data?.byDate) setAppointmentByDate(data.byDate);
    } catch{
    } finally {
      setCountsLoading(false);
    }
  }

  useEffect(()=>{
    const ctrl = new AbortController();
    refreshCounts(ctrl.signal);
    const t = setInterval(()=> refreshCounts(), 30000);
    return ()=>{ ctrl.abort(); clearInterval(t); };
  }, []);

  const selectedIso = date ? toKey(date) : null;
  useEffect(()=>{
    if(!modalCode || !selectedIso){
      setBookedTimes([]);
      return;
    }
    const ctrl = new AbortController();
    setSlotsLoading(true);
    fetch(`/api/appointments?date=${selectedIso}&service=${modalCode}`, { signal: ctrl.signal })
      .then(r=>r.json())
      .then(data=>{
        const times: string[] = data?.bookedTimes ?? [];
        setBookedTimes(times);
        if(times.length>0){
          setSelectedTime(prev=> prev && !times.includes(prev) ? prev : timeSlots.find(t=>!times.includes(t)) ?? null);
        }
      })
      .catch(()=>{})
      .finally(()=> setSlotsLoading(false));
    return ()=> ctrl.abort();
  }, [modalCode, selectedIso]);
  const freeCount = capacity - bookedTimes.length;
  const dayBookedCount: number = (selectedIso && modalCode ? appointmentByDate[selectedIso]?.[modalCode] ?? 0 : 0);

  function openModal(code: string){
    const prev = sentMap[code];
    if(prev){
      // keep current draft; user can change
    }
    setModalCode(code);
  }

  function closeModal(){
    if(sending) return;
    setModalCode(null);
  }

  useEffect(()=>{
    if(!modalCode) return;
    const onKey = (e: KeyboardEvent)=>{ if(e.key==="Escape") setModalCode(null); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return ()=>{
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modalCode]);

  async function handleConfirm(){
    if(!modalService || !date || !selectedTime || isDateUnavailable || bookedTimes.includes(selectedTime)) return;
    const dateStr = date.toLocaleDateString("th-TH",{ weekday:"long", day:"numeric", month:"long", year:"numeric"});
    const isoDate = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
    const text = `🎫 รับบัตรคิว ${modalService.code} - ${modalService.title}\nวันที่: ${dateStr}\nเวลา: ${selectedTime} น.\nสถานที่: สำนักทะเบียน อ.บ้านบึง`;
    setSending(true);
    try{
      const save = await fetch("/api/appointments",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ date: isoDate, time: selectedTime, service: `${modalService.code} - ${modalService.title}`, userId: profile?.userId ?? null, displayName: profile?.displayName ?? null }) }).then(r=>r.json().catch(()=>null)).catch(()=>null);
      if(!save?.ok && !save?.id) throw new Error("บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่");
      let lineSent = false;
      try{
        if(isInClient){
          if(!liff.isApiAvailable("sendMessages")) throw new Error("LIFF sendMessages ไม่พร้อมใช้งาน");
          await liff.sendMessages([{ type:"text", text }]);
          lineSent = true;
        } else if(liff.isApiAvailable("shareTargetPicker")){
          const res = await liff.shareTargetPicker([{ type:"text", text } as any]);
          lineSent = !!res;
          if(!lineSent){
            toast.info("บันทึกคิวแล้ว กรุณาเลือกแชตเพื่อส่งต่อ");
            setSentMap(prev=>({...prev, [modalService.code]:{display:dateStr, time:selectedTime}}));
            setBookedTimes(prev=> prev.includes(selectedTime) ? prev : [...prev, selectedTime]);
            refreshCounts();
            setModalCode(null);
            return;
          }
        }
      } catch(lineErr:any){
        toast.success("บันทึกคิวเรียบร้อย แต่ส่งเข้า LINE ไม่สำเร็จ");
        setSentMap(prev=>({...prev, [modalService.code]:{display:dateStr, time:selectedTime}}));
        setBookedTimes(prev=> prev.includes(selectedTime) ? prev : [...prev, selectedTime]);
        refreshCounts();
        setModalCode(null);
        return;
      }
      toast.success(lineSent || isInClient ? "รับบัตรคิวเรียบร้อย ส่งเข้าแชต LINE แล้ว" : "บันทึกคิวเรียบร้อยแล้ว");
      setSentMap(prev=>({...prev, [modalService.code]:{display:dateStr, time:selectedTime}}));
      setBookedTimes(prev=> prev.includes(selectedTime) ? prev : [...prev, selectedTime]);
      refreshCounts();
      if(isInClient) setTimeout(()=>{ try{ liff.closeWindow(); } catch{} }, 800);
      else setModalCode(null);
    } catch(e:any){
      toast.error(e?.message ?? "เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="บัตรคิวสำนักทะเบียน" />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[84px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-4">
          <Breadcrumb items={[{label:"หน้าหลัก", to:"/"}, {label:"งานทะเบียนและบัตร", to:"/registration"}, {label:"รับบัตรคิว"}]} />
          <h1 className="text-[18px] font-bold mt-2" style={{color:"#1A1A1A"}}>บัตรคิวสำนักทะเบียน</h1>
          <p className="text-[12px] mt-1" style={{color:"#8E95A5"}}>แตะงานที่ต้องการ → เลือกวัน-เวลาในหน้าต่าง · เปิดรับ 08:30–16:30 น. จันทร์-ศุกร์</p>
        </div>
        <div className="px-4 lg:px-6 pt-4 space-y-3">
          {services.map(s=>{
            const done = sentMap[s.code];
            return (
              <button key={s.code} type="button" onClick={()=>openModal(s.code)} className="group w-full text-left bg-white rounded-[16px] border border-slate-100 p-4 flex items-center gap-3.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0a0a54]/30 hover:shadow-[0px_14px_30px_rgba(10,10,84,0.10)] active:scale-[0.99]" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
                <span className="w-10 h-10 rounded-xl flex items-center justify-center text-[15px] font-bold shrink-0 bg-[#0a0a54] text-white transition-transform duration-200 group-hover:scale-105">{s.code}</span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[13px] font-semibold" style={{color:"#1A1A1A"}}>{s.title}</span>
                  <span className="block text-[11px] mt-0.5 line-clamp-1" style={{color:"#8E95A5"}}>{s.desc}</span>
                  {done ? (
                    <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">✓ {done.display} · {done.time} · แตะเพื่อเปลี่ยน</span>
                  ) : (
                    <span className="block text-[11px] mt-1 font-medium" style={{color:"#0a0a54"}}>รอ {countsLoading ? "…" : queueCounts[s.code] ?? 0} คิว · แตะเพื่อเลือกวัน-เวลา ›</span>
                  )}
                </span>
                <HiOutlineChevronRight className="text-[16px] shrink-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#0a0a54]" style={{color:"#8E95A5"}} />
              </button>
            );
          })}
          <p className="text-[11px] px-1 leading-relaxed" style={{color:"#8E95A5"}}>
            บัตรคิวจะส่งเข้าแชท LINE ของท่าน และมีข้อความแจ้งเมื่อใกล้ถึงคิว/ถึงคิว · รับได้ครั้งละ 1 ใบ · เปิดทำการ จันทร์-ศุกร์ 08:30-16:30 เว้นวันหยุดนักขัตฤกษ์
          </p>
          <a href="/registration" className="group bg-white rounded-[16px] border border-slate-100 p-4 flex items-center gap-3.5 transition-all duration-200 hover:border-[#0a0a54]/30 hover:-translate-y-0.5 hover:shadow-[0px_14px_30px_rgba(10,10,84,0.10)]" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
            <div className="w-10 h-10 rounded-xl bg-[#F7F8FC] flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:bg-[#EEF2FF]"><Icon icon="reicon:book" width={22} height={22} /></div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold transition-colors group-hover:text-[#0a0a54]" style={{color:"#1A1A1A"}}>เตรียมเอกสารก่อนรับคิว</div>
              <div className="text-[11px] mt-0.5" style={{color:"#8E95A5"}}>ดูคู่มือบริการประชาชน 277 เรื่อง</div>
            </div>
            <HiOutlineChevronRight className="text-[16px] shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#0a0a54]" style={{color:"#8E95A5"}} />
          </a>
          <a href="https://q-online.bora.dopa.go.th/" target="_blank" rel="noreferrer" className="group bg-white rounded-[16px] border border-slate-100 p-4 flex items-center gap-3.5 transition-all duration-200 hover:border-[#0a0a54]/30 hover:-translate-y-0.5 hover:shadow-[0px_14px_30px_rgba(10,10,84,0.10)]" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
            <div className="w-10 h-10 rounded-xl bg-[#F7F8FC] flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:bg-[#EEF2FF]"><Icon icon="reicon:calendar" width={22} height={22} /></div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold transition-colors group-hover:text-[#0a0a54]" style={{color:"#1A1A1A"}}>จองคิวออนไลน์ล่วงหน้า (Q-Online)</div>
              <div className="text-[11px] mt-0.5" style={{color:"#8E95A5"}}>เปิดเว็บจองคิวกรมการปกครอง</div>
            </div>
            <span className="text-[12px] shrink-0" style={{color:"#8E95A5"}}>↗</span>
          </a>
        </div>
      </div>

      {modalService && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative w-full sm:max-w-[720px] sm:m-4 max-h-[92vh] bg-white rounded-t-[20px] sm:rounded-[20px] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-[#0a0a54] text-white flex items-center justify-center text-[14px] font-bold shrink-0">{modalService.code}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold truncate" style={{color:"#1A1A1A"}}>นัดหมาย — {modalService.title}</div>
                <div className="text-[11px]" style={{color:"#8E95A5"}}>จันทร์-ศุกร์ 08:30-16:30 · เว้นวันหยุดนักขัตฤกษ์</div>
              </div>
              <button type="button" onClick={closeModal} aria-label="ปิด" className="w-8 h-8 rounded-full hover:bg-slate-100 active:scale-90 transition-all cursor-pointer flex items-center justify-center text-[18px] leading-none" style={{color:"#8E95A5"}}>×</button>
            </div>
            <div className="overflow-y-auto">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-4">
                  <CalendarGrid date={date} setDate={setDate} disabledDates={bookedDates} holidayMap={holidayMap} onMonthChange={(y)=>setViewYear(y)} dayCounts={dayCountsForService} capacity={capacity} />
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px]" style={{color:"#8E95A5"}}>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#0a0a54]" /> เลือกแล้ว</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#0a0a54]/20" /> มีนัดแล้ว (ตัวเลข = จำนวนคิว)</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-200" /> ไม่ว่าง / เต็ม</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-100 border border-slate-300" /> เสาร์-อาทิตย์ ปิดทำการ</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 border border-amber-300" /> วันหยุดนักขัตฤกษ์ {loadingHol ? "(โหลด...)" : ""}</span>
                  </div>
                  {loadingHol && <div className="mt-2 text-[11px]" style={{color:"#8E95A5"}}>กำลังโหลดวันหยุดจาก thailandformats.com…</div>}
                </div>
                <div className="md:w-48 border-t md:border-t-0 md:border-l border-slate-100 flex flex-col md:max-h-[420px]">
                  <div className="px-4 py-3 text-[12px] font-medium border-b border-slate-100 flex items-center justify-between" style={{color:"#1A1A1A"}}><span>เลือกเวลา</span>{date && !isDateUnavailable && <span className="text-[11px] font-normal" style={{color:"#8E95A5"}}>{slotsLoading ? "…" : `ว่าง ${freeCount}/${capacity}`}</span>}</div>
                  {date && !isDateUnavailable && dayBookedCount>0 && <div className="px-4 py-1.5 text-[11px] bg-[#EEF2FF] text-[#0a0a54]">วันนี้มีนัดแล้ว {dayBookedCount} คิว</div>}
                  <div className="flex-1 overflow-auto max-h-[240px] md:max-h-none p-3 space-y-1.5">
                    {isDateUnavailable ? (
                      <div className="py-10 text-center text-[12px] leading-relaxed" style={{color:"#8E95A5"}}>
                        {holidayTitle ? <><span className="font-medium text-amber-600">{holidayTitle}</span><br/>วันหยุดนักขัตฤกษ์<br/>ไม่เปิดรับคิว</> : weekendUnavailable ? <>วันเสาร์-อาทิตย์<br/>ปิดทำการ<br/>กรุณาเลือกวันจันทร์-ศุกร์</> : <>คิวเต็ม / ไม่ว่าง<br/>กรุณาเลือกวันอื่น</>}
                      </div>
                    ) : !date ? (
                      <div className="py-10 text-center text-[12px]" style={{color:"#8E95A5"}}>กรุณาเลือกวันที่</div>
                    ) : slotsLoading ? (
                      <div className="py-10 text-center text-[12px]" style={{color:"#8E95A5"}}>กำลังโหลดคิว…</div>
                    ) : timeSlots.map(time=>{
                      const taken = bookedTimes.includes(time);
                      return (
                      <button
                        key={time}
                        type="button"
                        disabled={taken}
                        title={taken ? "เวลานี้ถูกจองแล้ว" : time}
                        onClick={()=>!taken && setSelectedTime(time)}
                        className={`w-full py-2 rounded-full text-[13px] font-medium border transition-all duration-150 active:scale-[0.97] ${taken ? "bg-slate-50 text-slate-300 border-slate-100 line-through cursor-not-allowed" : selectedTime===time ? "bg-[#0a0a54] text-white border-[#0a0a54] shadow-md scale-[1.02] cursor-pointer" : "bg-white border-slate-200 hover:border-[#0a0a54] hover:text-[#0a0a54] hover:shadow-md hover:-translate-y-px cursor-pointer"}`}
                      >{time}{taken ? " · เต็ม" : ""}</button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-2 text-[13px] min-w-0" style={{color:"#1A1A1A"}}>
                {date && !isDateUnavailable && selectedTime ? (
                  <>
                    <span className="w-4 h-4 rounded-full bg-[#00C875] text-white flex items-center justify-center text-[10px] shrink-0">✓</span>
                    <span className="truncate">คิว {modalService.code} · <b>{date.toLocaleDateString("th-TH",{ weekday:"long", day:"numeric", month:"long", year:"numeric"})}</b> เวลา <b>{selectedTime}</b></span>
                  </>
                ) : isDateUnavailable ? <span style={{color:"#EF4444"}}>{holidayTitle ? `${holidayTitle} - ไม่เปิดรับคิว` : weekendUnavailable ? "วันเสาร์-อาทิตย์ ไม่เปิดรับคิว" : "วันที่เลือกไม่ว่าง"}</span>
                : <span style={{color:"#8E95A5"}}>เลือกวันและเวลาเพื่อรับบัตรคิว</span>}
              </div>
              <div className="flex gap-2 shrink-0">
                <button type="button" onClick={closeModal} disabled={sending} className="flex-1 md:flex-none px-5 py-2.5 rounded-full text-[13px] font-semibold border border-slate-200 transition-all hover:bg-slate-50 active:scale-[0.98] cursor-pointer disabled:opacity-50">ยกเลิก</button>
                <button type="button" onClick={handleConfirm} disabled={!date || !selectedTime || isDateUnavailable || sending || (selectedTime ? bookedTimes.includes(selectedTime) : false)} className={`flex-1 md:flex-none px-6 py-2.5 rounded-full text-[13px] font-semibold border transition-all duration-150 active:scale-[0.98] ${!date || !selectedTime || isDateUnavailable || sending || (selectedTime ? bookedTimes.includes(selectedTime) : false) ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" : "bg-[#0a0a54] border-[#0a0a54] text-white hover:shadow-lg hover:-translate-y-px hover:brightness-110 cursor-pointer"}`}>{sending ? "กำลังส่ง..." : "ยืนยันรับบัตรคิว"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
}
