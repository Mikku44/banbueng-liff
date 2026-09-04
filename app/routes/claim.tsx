import type { Route } from "./+types/claim";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { AppNavbar, BottomNav } from "../components/Navbar";
import { Breadcrumb } from "../components/Breadcrumb";
export function meta({}: Route.MetaArgs){ return [{title:"ยืนยันตัวตนเจ้าหน้าที่ - BANBUENG SMART"}]; }
const TAMBONS = ["บ้านบึง","คลองกิ่ว","มาบไผ่","หนองซ้ำซาก","หนองบอนแดง","หนองชาก","หนองอิรุณ","หนองไผ่แก้ว"];
export default function Claim(){
  const [step,setStep]=useState(1);
  const [tambon,setTambon]=useState<string|null>(null);
  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="ยืนยันตัวตนเจ้าหน้าที่" />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[88px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-4">
          <Breadcrumb items={[{label:"หน้าหลัก", to:"/"}, {label:"โปรไฟล์", to:"/profile"}, {label:"ยืนยันตัวตนเจ้าหน้าที่"}]} />
          <button onClick={()=>history.back()} className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-[13px] font-medium hover:border-[#0a0a54]/30 hover:shadow-sm transition-all" style={{color:"#0a0a54"}}><Icon icon="heroicons:chevron-left-20-solid" width={16} height={16} /> กลับ</button>
          <div className="mt-4 bg-white rounded-[16px] border border-slate-100 p-4" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
            <div className="flex items-center gap-2 text-[12px] font-semibold" style={{color:"#0a0a54"}}><Icon icon="heroicons:identification-20-solid" width={18} height={18} /> ยืนยันตัวตนเจ้าหน้าที่</div>
            <div className="flex gap-1.5 mt-3">
              {[1,2,3,4].map(n=>(
                <div key={n} className={`flex-1 h-1.5 rounded-full ${n<=step ? "bg-[#0a0a54]" : "bg-slate-200"}`} />
              ))}
            </div>
            <div className="text-[11px] mt-2" style={{color:"#8E95A5"}}>ขั้นที่ {step} จาก 4 · {step===1 ? "เลือกตำบลของท่าน" : step===2 ? "เลือกหมู่บ้าน" : step===3 ? "กรอกข้อมูลเจ้าหน้าที่" : "ยืนยัน"}</div>
          </div>
          {step===1 && (
            <div className="mt-4 space-y-3">
              <div className="text-[13px] font-semibold" style={{color:"#1A1A1A"}}>1. เลือกตำบล</div>
              <div className="grid grid-cols-2 gap-3">
                {TAMBONS.map(t=>(
                  <button key={t} onClick={()=>{setTambon(t); setStep(2);}} className={`p-4 rounded-[16px] border text-[13px] font-medium text-left hover:border-[#0a0a54]/30 transition-all ${tambon===t ? "bg-[#0a0a54] text-white border-[#0a0a54]" : "bg-white border-slate-100"}`} style={tambon!==t ? {boxShadow:"0px 10px 25px rgba(0,0,0,0.05)", color:"#1A1A1A"} as any : {}}>{t}</button>
                ))}
              </div>
            </div>
          )}
          {step===2 && (
            <div className="mt-4 space-y-3">
              <div className="text-[13px] font-semibold" style={{color:"#1A1A1A"}}>2. เลือกหมู่บ้าน — {tambon}</div>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({length:8},(_,i)=>`หมู่ ${i+1}`).map(m=>(
                  <button key={m} onClick={()=>setStep(3)} className="p-3 rounded-xl bg-white border border-slate-100 text-[13px] hover:border-[#0a0a54]/30" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>{m}</button>
                ))}
              </div>
              <button onClick={()=>setStep(1)} className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-[12px]" style={{color:"#8E95A5"}}><Icon icon="heroicons:chevron-left-20-solid" width={14} height={14} /> ย้อนกลับ</button>
            </div>
          )}
          {step===3 && (
            <div className="mt-4 bg-white rounded-[16px] border border-slate-100 p-4 space-y-3" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
              <div className="text-[13px] font-semibold" style={{color:"#1A1A1A"}}>3. กรอกข้อมูลเจ้าหน้าที่</div>
              <input placeholder="ชื่อ-สกุล" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-[13px] outline-none focus:border-[#0a0a54]" />
              <input placeholder="ตำแหน่ง (กำนัน/ผู้ใหญ่บ้าน/ผู้ช่วยฯ)" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-[13px] outline-none focus:border-[#0a0a54]" />
              <input placeholder="เบอร์โทร" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-[13px] outline-none focus:border-[#0a0a54]" />
              <div className="flex gap-2 pt-2">
                <button onClick={()=>setStep(2)} className="flex-1 py-2 rounded-full border border-slate-200 text-[13px]">ย้อนกลับ</button>
                <button onClick={()=>setStep(4)} className="flex-1 py-2 rounded-full bg-[#0a0a54] text-white text-[13px] font-medium">ถัดไป</button>
              </div>
            </div>
          )}
          {step===4 && (
            <div className="mt-4 bg-white rounded-[16px] border border-slate-100 p-6 text-center" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
              <div className="w-12 h-12 rounded-full bg-[#EEF2FF] flex items-center justify-center mx-auto" style={{color:"#0a0a54"}}><Icon icon="heroicons:paper-airplane-20-solid" width={20} height={20} /></div>
              <div className="text-[14px] font-bold mt-3" style={{color:"#1A1A1A"}}>ส่งคำขอยืนยันแล้ว</div>
              <div className="text-[12px] mt-1" style={{color:"#8E95A5"}}>เจ้าหน้าที่อำเภอจะตรวจสอบภายใน 1-2 วันทำการ<br/>ตำบล {tambon}</div>
              <a href="/profile" className="inline-flex mt-4 px-6 py-2 rounded-full bg-[#0a0a54] text-white text-[13px]">กลับโปรไฟล์</a>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
