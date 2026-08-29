import type { Route } from "./+types/knowledge";
import { useState } from "react";
import { AppNavbar, BottomNav } from "../components/Navbar";
import { Breadcrumb } from "../components/Breadcrumb";
export function meta({}: Route.MetaArgs){ return [{title: "คลังความรู้ - BANBUENG SMART"}]; }

type Item = { title:string; type:"PDF"|"เสียง"|"วิดีโอ"; image:string };

const items: Item[] = [
  { title:"คู่มือการปฏิบัติงานทะเบียนราษฎร (สำหรับนายทะเบียนผู้รับแจ้ง กำนัน ผู้ใหญ่บ้าน)", type:"PDF", image:"/images/news/news-1.jpg" },
  { title:"คู่มือปฏิบัติงานกำนัน ผู้ใหญ่บ้าน (เข้าใจง่าย)", type:"PDF", image:"/images/news/news-2.jpg" },
  { title:"คู่มือการดำเนินการทางวินัย กำนัน ผู้ใหญ่บ้าน 2567", type:"PDF", image:"/images/news/news-3.jpg" },
  { title:"คู่มือปฏิบัติงานที่เกี่ยวข้องกับปลัดอำเภอ ชุดที่ 1", type:"PDF", image:"/images/news/news-4.jpg" },
  { title:"คำถาม - คำตอบ จากแนวความเห็นคณะกรรมการกฤษฎีกาเกี่ยวกับรัฐธรรมนูญแห่งราชอาณาจักรไทย", type:"PDF", image:"/images/news/news-5.jpg" },
  { title:"คู่มือปฏิบัติงานด้านการทะเบียนราษฎร ปี 2569", type:"PDF", image:"/images/news/news-6.jpg" },
  { title:"คู่มือกำนันผู้ใหญ่บ้าน ปี 2568", type:"PDF", image:"/images/news/news-7.jpg" },
  { title:"เสียงบรรยาย คู่มือทะเบียนราษฎร (Audio)", type:"เสียง", image:"/images/news/news-8.jpg" },
  { title:"วิดีโอแนะนำการใช้งาน BANBUENG SMART", type:"วิดีโอ", image:"/images/cover.png" },
];

export default function Page(){
  const [active,setActive]=useState("ทั้งหมด");
  const [q]=useState("");
  const filtered = items.filter(it=>{
    const byType = active==="ทั้งหมด" || it.type===active;
    const byQ = !q || it.title.includes(q);
    return byType && byQ;
  });
  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="คลังความรู้" />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[84px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-4">
          <Breadcrumb items={[{label:"หน้าหลัก", to:"/"}, {label:"คลังความรู้"}]} />
          <h1 className="text-[18px] font-bold mt-2" style={{color:"#1A1A1A"}}>คลังความรู้</h1>
          <p className="text-[12px] mt-1" style={{color:"#8E95A5"}}>เอกสาร เสียง วิดีโอ เปิดดู•ฟังได้ในตัว</p>
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {["ทั้งหมด","PDF","เสียง","วิดีโอ"].map(c=>(
              <button key={c} onClick={()=>setActive(c)} className={`text-[12px] px-4 py-1.5 rounded-full border whitespace-nowrap ${active===c ? "bg-[#0a0a54] text-white border-[#0a0a54]" : "bg-white border-slate-100 hover:border-[#0a0a54]/20"}`} style={active!==c ? {color:"#1A1A1A"} as any : {}}>{c}</button>
            ))}
          </div>
          <div className="text-[11px] mt-3" style={{color:"#8E95A5"}}>{filtered.length} รายการ • {active}</div>
        </div>
        <div className="px-4 lg:px-6 pt-4 grid grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(it=>(
            <a key={it.title} href="#" className="group bg-white rounded-[16px] border border-slate-100 overflow-hidden hover:border-[#0a0a54]/30 hover:shadow-[0_12px_28px_rgba(10,10,84,0.12)] hover:-translate-y-[1px] transition-all duration-200" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
              <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                <img src={it.image} alt={it.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className={`absolute top-2 left-2 text-[10px] px-2 py-1 rounded-full font-medium border ${it.type==="PDF" ? "bg-[#EEF2FF] text-[#0a0a54] border-[#DCE2FF]" : it.type==="เสียง" ? "bg-[#FFF0E8] text-[#FF6B2C] border-orange-100" : "bg-[#F0FDF6] text-[#00C875] border-emerald-100"}`}>{it.type}</span>
              </div>
              <div className="p-3">
                <div className="text-[12px] font-medium leading-snug line-clamp-2" style={{color:"#1A1A1A"}}>{it.title}</div>
                <div className="text-[11px] mt-2 flex items-center gap-1" style={{color:"#8E95A5"}}>{it.type==="PDF" ? "เปิดดู" : it.type==="เสียง" ? "ฟัง" : "ดูวิดีโอ"} ›</div>
              </div>
            </a>
          ))}
        </div>
        {filtered.length===0 && <div className="text-center py-12 text-[13px] bg-white rounded-[16px] border border-slate-100 mx-4 lg:mx-6 mt-4" style={{color:"#8E95A5"}}>ไม่พบเอกสาร</div>}
      </div>
      <BottomNav />
    </div>
  );
}
