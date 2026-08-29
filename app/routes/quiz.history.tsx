import type { Route } from "./+types/quiz.history";
import { AppNavbar, BottomNav } from "../components/Navbar";
export function meta({}: Route.MetaArgs){ return [{title: "ประวัติการทำแบบทดสอบ - BANBUENG SMART"}]; }
export default function Page(){
  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="ประวัติการทำแบบทดสอบ" />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[84px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-6">
          <a href="/" className="text-[12px]" style={{color:"#8E95A5"}}>‹ หน้าหลัก</a>
          <h1 className="text-[18px] font-bold mt-2" style={{color:"#1A1A1A"}}>ประวัติการทำแบบทดสอบ</h1>
          <p className="text-[12px] mt-1" style={{color:"#8E95A5"}}>คะแนนย้อนหลัง</p>
          <div className="mt-6 bg-white rounded-[16px] border border-slate-100 p-8 text-center" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
            <div className="text-[14px] font-semibold" style={{color:"#1A1A1A"}}>หน้านี้อยู่ระหว่างพัฒนา</div>
            <div className="text-[12px] mt-2" style={{color:"#8E95A5"}}>เนื้อหาสำหรับ ประวัติการทำแบบทดสอบ จะถูกเพิ่มในเร็วๆ นี้</div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
