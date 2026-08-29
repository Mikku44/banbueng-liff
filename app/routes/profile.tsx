import type { Route } from "./+types/profile";
import { HiOutlineCog6Tooth, HiOutlineQuestionMarkCircle, HiOutlineArrowRightOnRectangle, HiOutlineShieldCheck, HiOutlineBell, HiOutlineLanguage } from "react-icons/hi2";
import { AppNavbar, BottomNav } from "../components/Navbar";

export function meta({}: Route.MetaArgs) {
  return [{ title: "โปรไฟล์ - BANBUENG SMART" }];
}

export default function Profile() {
  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="โปรไฟล์ • อำเภอบ้านบึง" />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[88px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-6">
          <div className="bg-white rounded-[16px] border border-slate-100 p-5 flex flex-col items-center text-center" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
            <img src="https://i.pravatar.cc/100?img=33" alt="" className="w-[72px] h-[72px] rounded-full object-cover ring-4 ring-[#F7F8FC]" />
            <div className="text-[16px] font-bold mt-3" style={{color:"#1A1A1A"}}>Username</div>
            <div className="text-[12px]" style={{color:"#8E95A5"}}>บ้านบึง • หมู่ 3 • 123 หมู่ 3 ต.บ้านบึง</div>
            <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border" style={{background:"#EEF2FF", color:"#0a0a54", borderColor:"#DCE2FF"}}><HiOutlineShieldCheck className="text-[14px]" /> ยืนยันตัวตนแล้ว</span>
            <div className="grid grid-cols-3 gap-3 w-full mt-5">
              {[
                { v:"2", l:"คิว" },
                { v:"1", l:"คำร้อง" },
                { v:"340", l:"แต้ม" },
              ].map(s=>(
                <div key={s.l} className="rounded-xl py-2.5 border border-slate-100" style={{background:"#F7F8FC"}}><div className="text-[15px] font-bold" style={{color:"#1A1A1A"}}>{s.v}</div><div className="text-[11px]" style={{color:"#8E95A5"}}>{s.l}</div></div>
              ))}
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {[
              { icon:HiOutlineCog6Tooth, title:"ตั้งค่า", desc:"ภาษา • การแจ้งเตือน" },
              { icon:HiOutlineBell, title:"การแจ้งเตือน", desc:"จัดการแจ้งเตือนข่าวและคิว" },
              { icon:HiOutlineLanguage, title:"ภาษา", desc:"ไทย" },
              { icon:HiOutlineQuestionMarkCircle, title:"ช่วยเหลือ", desc:"คู่มือการใช้งาน" },
            ].map(it=>{
              const Icon=it.icon;
              return (
                <a key={it.title} href="#" className="bg-white rounded-[16px] border border-slate-100 p-4 flex items-center gap-3.5" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:"#F7F8FC", color:"#0a0a54"}}><Icon className="text-[18px]" /></div>
                  <div className="flex-1"><div className="text-[13px] font-semibold" style={{color:"#1A1A1A"}}>{it.title}</div><div className="text-[11px]" style={{color:"#8E95A5"}}>{it.desc}</div></div>
                  <span style={{color:"#8E95A5"}}>›</span>
                </a>
              );
            })}
            <a href="#" className="bg-white rounded-[16px] border border-red-100 p-4 flex items-center gap-3.5" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-50 text-[#FF4D4D]"><HiOutlineArrowRightOnRectangle className="text-[18px]" /></div>
              <div className="flex-1"><div className="text-[13px] font-semibold text-[#FF4D4D]">ออกจากระบบ</div><div className="text-[11px]" style={{color:"#8E95A5"}}>ลงชื่อออกจากการใช้งาน</div></div>
            </a>
          </div>
          <div className="text-center text-[11px] mt-6" style={{color:"#8E95A5"}}>BANBUENG SMART v1.0 • อำเภอบ้านบึง จ.ชลบุรี</div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
