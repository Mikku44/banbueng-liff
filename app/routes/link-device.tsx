import type { Route } from "./+types/link-device";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { AppNavbar, BottomNav } from "../components/Navbar";
import { Breadcrumb } from "../components/Breadcrumb";
export function meta({}: Route.MetaArgs){ return [{title:"เชื่อมแอปบนหน้าจอโฮม - BANBUENG SMART"}]; }
export default function LinkDevice(){
  const [code,setCode]=useState<string|null>(null);
  const gen=()=> setCode(Math.random().toString(36).slice(2,8).toUpperCase()+"-"+Math.random().toString(36).slice(2,6).toUpperCase());
  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="เชื่อมแอปบนหน้าจอโฮม" />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[88px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-4">
          <Breadcrumb items={[{label:"หน้าหลัก", to:"/"}, {label:"โปรไฟล์", to:"/profile"}, {label:"เชื่อมแอป"}]} />
          <button onClick={()=>history.back()} className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-[13px] font-medium hover:border-[#0a0a54]/30 hover:shadow-sm transition-all" style={{color:"#0a0a54"}}><Icon icon="heroicons:chevron-left-20-solid" width={16} height={16} /> กลับ</button>
          <div className="mt-4 bg-white rounded-[16px] border border-slate-100 p-5" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
            <div className="flex items-center gap-2 text-[14px] font-bold" style={{color:"#1A1A1A"}}><Icon icon="heroicons:device-phone-mobile-20-solid" width={20} height={20} style={{color:"#0a0a54"}} /> เชื่อมแอปบนหน้าจอโฮม</div>
            <p className="text-[12px] mt-1" style={{color:"#8E95A5"}}>ใช้แอปจากไอคอนหน้าจอโฮมโดยไม่ต้องล็อกอิน LINE</p>
            <div className="mt-4 bg-[#F7F8FC] rounded-xl p-3 text-[12px] leading-relaxed" style={{color:"#1A1A1A"}}>แอปบนหน้าจอโฮมเปิดได้แม้ไม่มีสัญญาณ แต่ต้องเชื่อมบัญชีครั้งแรกครั้งเดียว — กดขอรหัสด้านล่าง แล้วนำไปพิมพ์ในแอปนั้น</div>
            {code ? (
              <div className="mt-4 text-center">
                <div className="text-[11px]" style={{color:"#8E95A5"}}>รหัสเชื่อมอุปกรณ์ (หมดอายุใน 10 นาที)</div>
                <div className="mt-2 inline-flex px-6 py-3 rounded-xl bg-[#0a0a54] text-white text-[20px] font-mono tracking-widest">{code}</div>
                <div className="mt-3 flex gap-2 justify-center">
                  <button onClick={()=>navigator.clipboard?.writeText(code)} className="px-4 py-1.5 rounded-full border border-slate-200 text-[12px] bg-white">คัดลอก</button>
                  <button onClick={gen} className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-[12px]">ขอรหัสใหม่</button>
                </div>
              </div>
            ) : (
              <button onClick={gen} className="mt-4 w-full py-3 rounded-full bg-[#0a0a54] text-white text-[13px] font-semibold hover:bg-[#0a0a54]/90">ขอรหัสเชื่อมอุปกรณ์</button>
            )}
          </div>
          <div className="mt-4 bg-white rounded-[16px] border border-slate-100 p-4" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
            <div className="text-[12px] font-semibold" style={{color:"#0a0a54"}}>วิธีใช้งาน</div>
            <ol className="mt-2 space-y-1.5 text-[12px] list-decimal list-inside" style={{color:"#1A1A1A"}}>
              <li>ติดตั้ง BANBUENG SMART ลงหน้าจอโฮม</li>
              <li>เปิดแอป → เลือก “เชื่อมบัญชี”</li>
              <li>พิมพ์รหัส 6 หลักด้านบน</li>
            </ol>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
