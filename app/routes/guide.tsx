import type { Route } from "./+types/guide";
import { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { AppNavbar, BottomNav } from "../components/Navbar";
import { Breadcrumb } from "../components/Breadcrumb";
export function meta({}: Route.MetaArgs){ return [{title:"คู่มือประชาชน 277 เรื่อง - BANBUENG SMART"}]; }

type Cat = { id:string; title:string; count:number; icon:string; topics: { id:string; title:string }[] };

const cats: Cat[] = [
  { id:"idcard", title:"ทะเบียนบัตรประจำตัวประชาชน", count:14, icon:"reicon:address-card", topics: Array.from({length:14}, (_,i)=> ({id:`id-${i+1}`, title:`งานบัตร เรื่องที่ ${i+1} - ${["ทำบัตรครั้งแรก","บัตรหาย","บัตรหมดอายุ","เปลี่ยนชื่อ","ย้ายที่อยู่","คัดรับรอง","ตรวจสอบ","ต่ออายุ","ทำบัตรผู้สูงอายุ","ทำบัตรผู้พิการ","ทำบัตรเด็ก","ทำบัตรคนต่างด้าว","ทำบัตรหายต่างจังหวัด","ทำบัตรออนไลน์"][i%14]}` }))},
  { id:"civil", title:"ทะเบียนราษฎร", count:63, icon:"reicon:home", topics: Array.from({length:63}, (_,i)=> ({id:`civil-${i+1}`, title:`ทะเบียนราษฎร เรื่องที่ ${i+1}` }))},
  { id:"general", title:"ทะเบียนทั่วไป", count:54, icon:"reicon:clipboard", topics: Array.from({length:54}, (_,i)=> ({id:`gen-${i+1}`, title:`ทะเบียนทั่วไป เรื่องที่ ${i+1}` }))},
  { id:"gun", title:"อาวุธปืน", count:30, icon:"reicon:shield", topics: Array.from({length:30}, (_,i)=> ({id:`gun-${i+1}`, title:`อาวุธปืน เรื่องที่ ${i+1}` }))},
  { id:"gambling", title:"การพนัน", count:43, icon:"reicon:money", topics: Array.from({length:43}, (_,i)=> ({id:`gamble-${i+1}`, title:`การพนัน เรื่องที่ ${i+1}` }))},
  { id:"auction", title:"ขายทอดตลาดและค้าของเก่า", count:7, icon:"reicon:bag", topics: Array.from({length:7}, (_,i)=> ({id:`auc-${i+1}`, title:`ขายทอดตลาด เรื่องที่ ${i+1}` }))},
  { id:"foundation", title:"มูลนิธิ", count:4, icon:"reicon:heart", topics: Array.from({length:4}, (_,i)=> ({id:`found-${i+1}`, title:`มูลนิธิ เรื่องที่ ${i+1}` }))},
  { id:"association", title:"สมาคม", count:4, icon:"reicon:people", topics: Array.from({length:4}, (_,i)=> ({id:`assoc-${i+1}`, title:`สมาคม เรื่องที่ ${i+1}` }))},
  { id:"donation", title:"เรี่ยไร", count:2, icon:"reicon:gift", topics: Array.from({length:2}, (_,i)=> ({id:`donate-${i+1}`, title:`เรี่ยไร เรื่องที่ ${i+1}` }))},
  { id:"hotel", title:"โรงแรม", count:11, icon:"reicon:building", topics: Array.from({length:11}, (_,i)=> ({id:`hotel-${i+1}`, title:`โรงแรม เรื่องที่ ${i+1}` }))},
  { id:"entertainment", title:"สถานบริการ", count:7, icon:"reicon:music", topics: Array.from({length:7}, (_,i)=> ({id:`ent-${i+1}`, title:`สถานบริการ เรื่องที่ ${i+1}` }))},
  { id:"other", title:"อื่นๆ", count:2, icon:"reicon:more", topics: Array.from({length:2}, (_,i)=> ({id:`other-${i+1}`, title:`อื่นๆ เรื่องที่ ${i+1}` }))},
  { id:"pawn", title:"โรงรับจำนำ", count:10, icon:"reicon:bank", topics: Array.from({length:10}, (_,i)=> ({id:`pawn-${i+1}`, title:`โรงรับจำนำ เรื่องที่ ${i+1}` }))},
  { id:"border", title:"สัญจรข้ามแดน", count:2, icon:"reicon:globe", topics: Array.from({length:2}, (_,i)=> ({id:`border-${i+1}`, title:`สัญจรข้ามแดน เรื่องที่ ${i+1}` }))},
  { id:"minority", title:"ชนกลุ่มน้อย", count:8, icon:"reicon:users", topics: Array.from({length:8}, (_,i)=> ({id:`minor-${i+1}`, title:`ชนกลุ่มน้อย เรื่องที่ ${i+1}` }))},
  { id:"nationality", title:"สัญชาติ", count:16, icon:"reicon:flag", topics: Array.from({length:16}, (_,i)=> ({id:`nat-${i+1}`, title:`สัญชาติ เรื่องที่ ${i+1}` }))},
];

export default function Guide(){
  const [q,setQ]=useState("");
  const [cat,setCat]=useState<string|null>(null);
  const [topic,setTopic]=useState<{cat:Cat, t:{id:string,title:string}}|null>(null);
  const search = useMemo(()=>{
    const s=q.trim().toLowerCase();
    if(!s) return [];
    const out: {cat:Cat, t:{id:string,title:string}}[]=[];
    for(const c of cats) for(const t of c.topics) if((t.title+" "+c.title).toLowerCase().includes(s)) out.push({cat:c,t});
    return out;
  },[q]);
  const curCat = cat ? cats.find(c=>c.id===cat) : null;
  if(topic){
    return (
      <div className="min-h-screen" style={{background:"#F7F8FC"}}>
        <AppNavbar subtitle="คู่มือบริการประชาชน" />
        <div className="w-full lg:max-w-[1180px] mx-auto pb-[84px] lg:pb-8">
          <div className="px-4 lg:px-6 pt-4">
            <button onClick={()=>setTopic(null)} className="text-[12px]" style={{color:"#8E95A5"}}>‹ กลับ</button>
            <div className="mt-3 bg-[#0a0a54] text-white rounded-[16px] p-4">
              <div className="text-[16px] font-bold">{topic.t.title}</div>
              <div className="text-[12px] mt-1 text-white/80">{topic.cat.title} · ขั้นตอน เอกสาร ค่าธรรมเนียม และระยะเวลา</div>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { label:"ขั้นตอน", content:"ยื่นคำร้องที่อำเภอ → ตรวจสอบเอกสาร → นายทะเบียนพิจารณา → ออกหนังสือสำคัญ" },
                { label:"เอกสาร", content:"บัตรประชาชน · ทะเบียนบ้าน · เอกสารที่เกี่ยวข้องตามประเภทคำขอ" },
                { label:"ค่าธรรมเนียม", content:"ตามที่กฎหมายกำหนด (บางประเภทฟรี)" },
                { label:"ระยะเวลา", content:"โดยทั่วไป 3-15 วันทำการ" },
                { label:"สถานที่ยื่น", content:"สำนักทะเบียนอำเภอบ้านบึง 038-446202 · ติดต่อได้ทั่วประเทศ" },
              ].map(s=>(
                <div key={s.label} className="bg-white rounded-[16px] border border-slate-100 p-4" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
                  <div className="text-[12px] font-semibold flex items-center gap-2" style={{color:"#0a0a54"}}><Icon icon="reicon:check-circle" width={16} height={16} /> {s.label}</div>
                  <div className="text-[13px] mt-2" style={{color:"#1A1A1A"}}>{s.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }
  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="คู่มือบริการประชาชน" q={q} setQ={setQ} placeholder="ค้นหาบริการ เช่น โรงแรม อาวุธปืน แจ้งเกิด สัญชาติ" />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[84px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-4">
          <Breadcrumb items={[{label:"หน้าหลัก", to:"/"}, {label:"คู่มือประชาชน 277 เรื่อง"}]} />
          <h1 className="text-[18px] font-bold mt-2" style={{color:"#1A1A1A"}}>คู่มือบริการประชาชน</h1>
          <p className="text-[12px] mt-1" style={{color:"#8E95A5"}}>ขั้นตอน เอกสาร ค่าธรรมเนียม และระยะเวลาของงานบริการอำเภอ — อ้างอิงคู่มือกรมการปกครอง · 277 เรื่อง 16 หมวด</p>
          {q.trim() ? (
            <div className="mt-4 space-y-3">
              <div className="text-[12px]" style={{color:"#8E95A5"}}>ผลการค้นหา {search.length} เรื่อง</div>
              {search.map(({cat,t})=>(
                <button key={t.id} onClick={()=>setTopic({cat,t})} className="w-full text-left bg-white rounded-[16px] border border-slate-100 p-4 flex items-center justify-between hover:border-[#0a0a54]/30 hover:shadow-[0_12px_28px_rgba(10,10,84,0.12)] hover:-translate-y-[1px] transition-all" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
                  <div><div className="text-[13px] font-semibold" style={{color:"#1A1A1A"}}>{t.title}</div><div className="text-[11px] mt-1" style={{color:"#8E95A5"}}>{cat.title}</div></div>
                  <span style={{color:"#8E95A5"}}>›</span>
                </button>
              ))}
            </div>
          ) : !curCat ? (
            <div className="mt-4 grid grid-cols-1 gap-3">
              {cats.map(c=>(
                <button key={c.id} onClick={()=>setCat(c.id)} className="w-full text-left bg-white rounded-[16px] border border-slate-100 p-4 flex items-center gap-3 hover:border-[#0a0a54]/30 hover:shadow-[0_12px_28px_rgba(10,10,84,0.12)] hover:-translate-y-[1px] transition-all" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
                  <span className="w-10 h-10 rounded-xl bg-[#F7F8FC] flex items-center justify-center"><Icon icon={c.icon} width={22} height={22} /></span>
                  <div className="flex-1 text-left"><div className="text-[13px] font-semibold" style={{color:"#1A1A1A"}}>{c.title}</div><div className="text-[11px]" style={{color:"#8E95A5"}}>{c.count} เรื่อง</div></div>
                  <span style={{color:"#8E95A5"}}>›</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <button onClick={()=>setCat(null)} className="text-[12px]" style={{color:"#0a0a54"}}>‹ {curCat.title}</button>
              {curCat.topics.map(t=>(
                <button key={t.id} onClick={()=>setTopic({cat:curCat,t})} className="w-full text-left bg-white rounded-[16px] border border-slate-100 p-4 flex items-center justify-between hover:border-[#0a0a54]/30 hover:shadow-[0_12px_28px_rgba(10,10,84,0.12)] hover:-translate-y-[1px] transition-all" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
                  <div><div className="text-[13px] font-semibold" style={{color:"#1A1A1A"}}>{t.title}</div><div className="text-[11px] mt-1" style={{color:"#8E95A5"}}>{curCat.title}</div></div>
                  <span style={{color:"#8E95A5"}}>›</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
