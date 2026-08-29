import type { Route } from "./+types/registration.appointment";
import { useState } from "react";
import { AppNavbar, BottomNav } from "../components/Navbar";
import { Breadcrumb } from "../components/Breadcrumb";
export function meta({}: Route.MetaArgs){ return [{title:"นัดหมายสอบสวน - BANBUENG SMART"}]; }

function CalendarGrid({ date, setDate, disabledDates }: { date: Date | undefined; setDate: (d:Date|undefined)=>void; disabledDates: Date[] }) {
  const [cur, setCur] = useState(date || new Date());
  const year = cur.getFullYear();
  const month = cur.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month+1, 0);
  const startDay = first.getDay();
  const days = Array.from({length: last.getDate()}, (_,i)=> new Date(year, month, i+1));
  const isDisabled = (d:Date) => disabledDates.some(x=> x.toDateString()===d.toDateString());
  const isSelected = (d:Date) => date && d.toDateString()===date.toDateString();
  const months = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={()=>setCur(new Date(year, month-1, 1))} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">‹</button>
        <span className="text-[14px] font-semibold" style={{color:"#1A1A1A"}}>{months[month]} {year+543}</span>
        <button onClick={()=>setCur(new Date(year, month+1, 1))} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] mb-1" style={{color:"#8E95A5"}}>
        {["อา","จ","อ","พ","พฤ","ศ","ส"].map(d=> <div key={d} className="py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({length: startDay}).map((_,i)=><div key={"e"+i} />)}
        {days.map(d=>{
          const dis = isDisabled(d);
          const sel = isSelected(d);
          return (
            <button
              key={d.toISOString()}
              disabled={dis}
              onClick={()=>!dis && setDate(d)}
              className={`w-8 h-8 rounded-full text-[13px] flex items-center justify-center transition ${dis ? "text-slate-300 line-through bg-slate-50 cursor-not-allowed" : sel ? "bg-[#0a0a54] text-white" : "hover:bg-slate-100"}`}
              style={!dis && !sel ? {color:"#1A1A1A"} : {}}
            >{d.getDate()}</button>
          );
        })}
      </div>
    </div>
  );
}

export default function Appointment(){
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>("10:00");
  const timeSlots = Array.from({ length: 37 }, (_, i) => {
    const totalMinutes = i * 15;
    const hour = Math.floor(totalMinutes / 60) + 9;
    const minute = totalMinutes % 60;
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  });
  const bookedDates = Array.from({ length: 3 }, (_, i) => new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + i));

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
                <CalendarGrid date={date} setDate={setDate} disabledDates={bookedDates} />
                <div className="mt-3 flex gap-2 text-[11px]" style={{color:"#8E95A5"}}>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#0a0a54]" /> เลือกแล้ว</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-200" /> ไม่ว่าง</span>
                </div>
              </div>
              <div className="md:w-48 border-t md:border-t-0 md:border-l border-slate-100 flex flex-col">
                <div className="px-4 py-3 text-[12px] font-medium border-b border-slate-100" style={{color:"#1A1A1A"}}>เลือกเวลา</div>
                <div className="flex-1 overflow-auto max-h-[240px] md:max-h-[320px] p-3 space-y-1.5">
                  {timeSlots.map(time=>(
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
                {date && selectedTime ? (
                  <>
                    <span className="w-4 h-4 rounded-full bg-[#00C875] text-white flex items-center justify-center text-[10px]">✓</span>
                    <span>นัดหมายวันที่ <b>{date.toLocaleDateString("th-TH",{ weekday:"long", day:"numeric", month:"long", year:"numeric"})}</b> เวลา <b>{selectedTime}</b></span>
                  </>
                ) : <span style={{color:"#8E95A5"}}>เลือกวันและเวลาเพื่อนัดหมาย</span>}
              </div>
              <button disabled={!date || !selectedTime} className={`w-full md:w-auto px-6 py-2.5 rounded-full text-[13px] font-semibold border transition ${!date || !selectedTime ? "bg-slate-100 text-slate-400 border-slate-200" : "bg-white border-[#0a0a54] text-[#0a0a54] hover:bg-[#0a0a54] hover:text-white"}`}>ยืนยันการจอง</button>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-center" style={{color:"#8E95A5"}}>จองคิวล่วงหน้า • เปิดทำการ จันทร์-ศุกร์ 08:30-16:30 • ติดต่อ 038-446202</div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
