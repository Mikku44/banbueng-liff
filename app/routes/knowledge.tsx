import type { Route } from "./+types/knowledge";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { AppNavbar, BottomNav } from "../components/Navbar";
import { Breadcrumb } from "../components/Breadcrumb";
export function meta({}: Route.MetaArgs){ return [{title: "คลังความรู้ - BANBUENG SMART"}]; }

type KbItem = { id:number; title:string; description:string|null; file_type:string; file_url:string; cover_url:string|null; created_at:string };

const items: KbItem[] = [
  { id:8, title:"คู่มือการปฏิบัติงานทะเบียนราษฎร (สำหรับนายทะเบียนผู้รับแจ้ง)", description:null, file_type:"pdf", file_url:"https://drive.google.com/file/d/1B6WpUSGFNVh0P_X7oplnQ15iqRzMVAT0/view?usp=sharing", cover_url:"https://iuqibecqotiyysmlmsim.supabase.co/storage/v1/object/public/knowledge/1788272112312-wlhhxi.jpg", created_at:"2026-08-26T03:39:54.912698+00:00" },
  { id:7, title:"คู่มือปฏิบัติงานกำนัน ผู้ใหญ่บ้าน (เข้าใจง่าย)", description:null, file_type:"pdf", file_url:"https://multi.dopa.go.th/pab/work_manual/read8", cover_url:"https://iuqibecqotiyysmlmsim.supabase.co/storage/v1/object/public/knowledge/1787714122328-s9e0bi.jpg", created_at:"2026-08-26T03:15:44.632037+00:00" },
  { id:6, title:"คู่มือการดำเนินการทางวินัย กำนัน ผุ้ใหญ่บ้าน 2567", description:"คู่มือการดำเนินการทางวินัย และการสั่งให้กำนัน ผุ้ใหญ่บ้าน ฯลฯ พ้นจากตำแหน่ง 2567", file_type:"pdf", file_url:"https://multi.dopa.go.th/svhad/assets/modules/news/uploads/169f3a6eaadbfd1aa8d8848e769346e16639d0ccbbbfe1184143446080556582.pdf", cover_url:"https://iuqibecqotiyysmlmsim.supabase.co/storage/v1/object/public/knowledge/1786405413062-s461s1.jpg", created_at:"2026-08-10T23:43:35.644365+00:00" },
  { id:5, title:"คู่มือปฏิบัติงานที่เกี่ยวข้องกับปลัดอำเภอ ชุดที่ 1", description:"คู่มือปฏิบัติงานที่เกี่ยวข้องกับปลัดอำเภอ ชุดที่ 1 โดยกรมการปกครอง", file_type:"link", file_url:"https://drive.google.com/drive/folders/1cvMBTsE8ujxwRbVibGb2DwCfK7XGotx9?fbclid=IwY2xjawTGr3JleHRuA2FlbQIxMABicmlkETFxMDRJd1ZrcHFaQXBoQTFrc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHvy2j8stEaQ9CWULAfkzlIxSYw851wc3cPCmaoIp-GcyIuNhCiViygHOaJV5_aem_ChsZs3NgZ-YhxJD36GbTfg", cover_url:"https://iuqibecqotiyysmlmsim.supabase.co/storage/v1/object/public/knowledge/1784270487717-qd5r3o.jpg", created_at:"2026-07-17T04:04:14.58984+00:00" },
  { id:4, title:"คำถาม - คำตอบ จากแนวความเห็นคณะกรรมการกฤษฎีกาเกี่ยวกับรัฐธรรมนูญแห่งราชอาณาจักรไทย", description:"คำถาม - คำตอบ จากแนวความเห็นคณะกรรมการกฤษฎีกาเกี่ยวกับรัฐธรรมนูญแห่งราชอาณาจักรไทย", file_type:"link", file_url:"https://drive.google.com/file/d/1ssxXSpVdJ5GVyuDJb9ZmjZVjmOynGwcn/view?fbclid=IwY2xjawTGrvBleHRuA2FlbQIxMABicmlkETFxMDRJd1ZrcHFaQXBoQTFrc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHsY0ug1Btf2qenP9UZMDOg-wjlfEm0kL0eWPG1KnLStBicev0E3aDeR6WF9o_aem_ATd7jJKBtcnhQcDNF0Grug", cover_url:"https://iuqibecqotiyysmlmsim.supabase.co/storage/v1/object/public/knowledge/1784270507711-009n3o.jpg", created_at:"2026-07-17T04:01:39.720259+00:00" },
  { id:3, title:"คู่มือปฏิบัติงานด้านการทะเบียนราษฎร ปี 2569", description:"คู่มือปฏิบัติงานด้านการทะเบียนราษฎร 2569", file_type:"link", file_url:"https://drive.google.com/drive/folders/1WGvMjg2M45PlOE7ExNDm1kNAdLT6E01C?usp=drive_link", cover_url:"https://iuqibecqotiyysmlmsim.supabase.co/storage/v1/object/public/knowledge/1784270523718-a3qmaa.jpg", created_at:"2026-07-17T03:51:20.070285+00:00" },
  { id:2, title:"คู่มือกำนันผู้ใหญ่บ้าน ปี 2568", description:"คู่มือกำนันผู้ใหญ่บ้าน 2568", file_type:"link", file_url:"https://drive.google.com/file/d/1wpHU9tlOJKEEL3E4FWRuwAGwPKH6qpJb/view?usp=drive_link", cover_url:"https://iuqibecqotiyysmlmsim.supabase.co/storage/v1/object/public/knowledge/1784270538041-i9lx77.jpg", created_at:"2026-07-13T13:51:48.227127+00:00" },
];

const labelMap: Record<string,string> = { pdf:"PDF", link:"ลิงก์", audio:"เสียง", video:"วิดีโอ" };

export default function Page(){
  const [active,setActive]=useState("all");
  const [selected,setSelected]=useState<KbItem|null>(null);
  const filtered = items.filter(it=> active==="all" || it.file_type===active);
  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="คลังความรู้" />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[84px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-4">
          <Breadcrumb items={[{label:"หน้าหลัก", to:"/"}, {label:"คลังความรู้"}]} />
          <h1 className="text-[18px] font-bold mt-2" style={{color:"#1A1A1A"}}>คลังความรู้</h1>
          <p className="text-[12px] mt-1" style={{color:"#8E95A5"}}>เอกสาร เสียง วิดีโอ เปิดดู•ฟังได้ในตัว — อ้างอิง {items.length} รายการจาก namyuen</p>
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {[["all","ทั้งหมด"],["pdf","PDF"],["audio","เสียง"],["video","วิดีโอ"] as const].map(([v,l])=>(
              <button key={v} onClick={()=>setActive(v)} className={`text-[12px] px-4 py-1.5 rounded-full border whitespace-nowrap inline-flex items-center gap-1.5 ${active===v ? "bg-[#0a0a54] text-white border-[#0a0a54]" : "bg-white border-slate-100 hover:border-[#0a0a54]/20"}`} style={active!==v ? {color:"#1A1A1A"} as any : {}}>{l}</button>
            ))}
          </div>
          <div className="text-[11px] mt-3" style={{color:"#8E95A5"}}>{filtered.length} รายการ • {active==="all" ? "ทั้งหมด" : labelMap[active] || active}</div>
        </div>
        <div className="px-4 lg:px-6 pt-4 grid grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(it=>(
            <button key={it.id} onClick={()=>{ if(it.file_type==="pdf" || it.file_type==="link") window.open(it.file_url,"_blank","noopener"); else setSelected(it); }} className="group text-left bg-white rounded-[16px] border border-slate-100 overflow-hidden hover:border-[#0a0a54]/30 hover:shadow-[0_12px_28px_rgba(10,10,84,0.12)] hover:-translate-y-[1px] transition-all duration-200" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
              <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                {it.cover_url ? <img src={it.cover_url} alt={it.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#EEF2FF] to-white">
                    <span className="text-[10px] px-2 py-1 rounded-full bg-white border border-slate-200" style={{color:"#0a0a54"}}>{labelMap[it.file_type] || it.file_type}</span>
                    <span className="text-[11px] font-semibold mt-2 text-center line-clamp-2" style={{color:"#0a0a54"}}>{it.title}</span>
                  </div>
                )}
                <span className={`absolute top-2 left-2 text-[10px] px-2 py-1 rounded-full font-medium border ${it.file_type==="pdf" ? "bg-[#EEF2FF] text-[#0a0a54] border-[#DCE2FF]" : it.file_type==="link" ? "bg-[#FFF7ED] text-[#C2410C] border-orange-100" : it.file_type==="audio" ? "bg-[#FFF0E8] text-[#FF6B2C] border-orange-100" : "bg-[#F0FDF6] text-[#00C875] border-emerald-100"}`}>{labelMap[it.file_type] || it.file_type}</span>
              </div>
              <div className="p-3">
                <div className="text-[12px] font-medium leading-snug line-clamp-2" style={{color:"#1A1A1A"}}>{it.title}</div>
                {it.description && <div className="text-[11px] mt-1 line-clamp-1" style={{color:"#8E95A5"}}>{it.description}</div>}
                <div className="text-[11px] mt-2 flex items-center gap-1" style={{color:"#8E95A5"}}>{it.file_type==="pdf" || it.file_type==="link" ? "เปิดดู" : it.file_type==="audio" ? "ฟัง" : "ดูวิดีโอ"} <Icon icon="heroicons:chevron-right-20-solid" width={14} height={14} /></div>
              </div>
            </button>
          ))}
        </div>
        {filtered.length===0 && <div className="text-center py-12 text-[13px] bg-white rounded-[16px] border border-slate-100 mx-4 lg:mx-6 mt-4" style={{color:"#8E95A5"}}>ไม่พบเอกสาร</div>}
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={()=>setSelected(null)}>
          <div className="bg-white rounded-[16px] p-4 w-full max-w-[420px] text-left" onClick={e=>e.stopPropagation()}>
            <div className="text-[13px] font-semibold" style={{color:"#1A1A1A"}}>{selected.title}</div>
            {selected.description && <div className="text-[11px] mt-1" style={{color:"#8E95A5"}}>{selected.description}</div>}
            {selected.file_type==="audio" && <audio controls autoPlay src={selected.file_url} className="w-full mt-3 rounded-[10px]" />}
            {selected.file_type==="video" && <video controls autoPlay src={selected.file_url} className="w-full mt-3 rounded-[10px]" />}
            <button onClick={()=>setSelected(null)} className="mt-4 w-full py-2 rounded-full bg-[#0a0a54] text-white text-[13px] font-medium">ปิด</button>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
}
