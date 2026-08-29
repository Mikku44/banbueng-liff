import type { Route } from "./+types/fund";
import { AppNavbar, BottomNav } from "../components/Navbar";
import { Breadcrumb } from "../components/Breadcrumb";
export function meta({}: Route.MetaArgs){ return [{title: "กองทุนรวมน้ำใจไทบ้านบึง - BANBUENG SMART"}]; }
export default function Page(){
  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="กองทุนรวมน้ำใจไทบ้านบึง" />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[84px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-4">
          <Breadcrumb items={[{label:"หน้าหลัก", to:"/"}, {label:"กองทุนรวมน้ำใจไทบ้านบึง"}]} />
          <h1 className="text-[18px] font-bold mt-2" style={{color:"#1A1A1A"}}>กองทุนรวมน้ำใจไทบ้านบึง</h1>
          <p className="text-[12px] mt-1 leading-relaxed" style={{color:"#8E95A5"}}>ช่วยเหลือผู้ป่วย ผู้สูงอายุ ผู้ยากไร้ และผู้ประสบความเดือดร้อนในพื้นที่อำเภอบ้านบึง</p>
        </div>

        <div className="px-4 lg:px-6 pt-6 space-y-4">
          <div className="bg-white rounded-[16px] border border-slate-100 p-4" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
            <div className="text-[12px] font-semibold" style={{color:"#1A1A1A"}}>ขั้นตอนการขอรับความช่วยเหลือ</div>
            <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1">
              {["ยื่นคำขอ","กลั่นกรอง 3 ท่าน","นายอำเภออนุมัติ","เบิกจ่าย"].map((s,i)=>(
                <div key={s} className="flex items-center gap-1.5 shrink-0">
                  <span className="w-7 h-7 rounded-full bg-[#0a0a54] text-white text-[11px] font-bold flex items-center justify-center">{i+1}</span>
                  <span className="text-[11px] font-medium whitespace-nowrap" style={{color:"#1A1A1A"}}>{s}</span>
                  {i<3 && <span style={{color:"#8E95A5"}}>→</span>}
                </div>
              ))}
            </div>
            <p className="text-[11px] mt-3 p-2.5 rounded-xl bg-[#FFF7E0] border border-amber-100" style={{color:"#92400e"}}>การยื่นคำขอทำโดยกำนัน/ผู้ใหญ่บ้านในพื้นที่เท่านั้น — ประชาชนที่เดือดร้อนโปรดแจ้งผู้ใหญ่บ้านของท่าน</p>
          </div>

          <div className="bg-white rounded-[16px] border border-slate-100 p-6 text-center" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
            <div className="w-12 h-12 rounded-full bg-[#F7F8FC] border border-slate-100 flex items-center justify-center mx-auto text-[#8E95A5]">—</div>
            <div className="text-[13px] font-medium mt-3" style={{color:"#1A1A1A"}}>ยังไม่มีคำขอของท่าน</div>
            <div className="text-[11px] mt-1" style={{color:"#8E95A5"}}>เมื่อยื่นคำขอแล้ว สถานะจะแสดงที่นี่</div>
            <a href="/hotline" className="mt-4 inline-flex px-5 py-2 rounded-full bg-[#0a0a54] text-white text-[12px] font-medium">ติดต่อผู้ใหญ่บ้าน</a>
          </div>

          <div className="bg-white rounded-[16px] border border-slate-100 p-4" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
            <div className="text-[12px] font-semibold" style={{color:"#1A1A1A"}}>ติดต่อสอบถาม</div>
            <div className="text-[12px] mt-2 leading-relaxed" style={{color:"#5A607F"}}>สำนักงานอำเภอบ้านบึง 038-443020<br/>สำนักทะเบียน 038-446202<br/>ศูนย์ดำรงธรรม 1567</div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
