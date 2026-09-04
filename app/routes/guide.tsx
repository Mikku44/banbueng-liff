import type { Route } from "./+types/guide";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Icon } from "@iconify/react";
import { AppNavbar, BottomNav } from "../components/Navbar";
import { Breadcrumb } from "../components/Breadcrumb";
import guideData from "../lib/guide-data.json";
import guideDetails from "../lib/guide-details.json";
export function meta({}: Route.MetaArgs){ return [{title:"คู่มือประชาชน 277 เรื่อง - BANBUENG SMART"}]; }

type Topic = { id:string; title:string; summary:string };
type Group = { group:string; topics: Topic[] };
type CatRaw = { id:string; title:string; icon:string; groups: Group[] };
const catsRaw = guideData as CatRaw[];

const iconMap: Record<string,string> = {
  id:"reicon:address-card", home:"reicon:home", file:"reicon:file", shield:"reicon:shield",
  ticket:"reicon:ticket", bag:"reicon:bag", heart:"reicon:heart", people:"reicon:people",
  gift:"reicon:gift", building:"reicon:building", music:"reicon:music", more:"reicon:more",
  bank:"reicon:bank", globe:"reicon:globe", users:"reicon:users", flag:"reicon:flag",
  star:"reicon:star", grid:"reicon:grid", landmark:"reicon:landmark"
};

type Cat = { id:string; title:string; count:number; icon:string; groups: Group[]; topics: (Topic & {group:string})[] };
const cats: Cat[] = catsRaw.map(c=>{
  const topics = c.groups.flatMap(g=> g.topics.map(t=>({...t, group:g.group})));
  return { id:c.id, title:c.title, count:topics.length, icon: iconMap[c.icon] || "reicon:file", groups:c.groups, topics };
});

type Detail = { catTitle:string; topic:{ id:string; group:string; title:string; url:string; sections:{head:string; body:string[]}[] } };
const detailsMap = guideDetails as Record<string, Detail>;

export default function Guide(){
  const [searchParams,setSearchParams]=useSearchParams();
  const initialTopic = searchParams.get("t");
  const [q,setQ]=useState("");
  const [catId,setCatId]=useState<string|null>(null);
  const [topicId,setTopicId]=useState<string|null>(initialTopic);

  const curCat = useMemo(()=> cats.find(c=>c.id===catId) || null,[catId]);
  const allTopics = useMemo(()=> cats.flatMap(c=> c.topics.map(t=>({cat:c, t}))),[]);
  const detail = topicId ? (detailsMap[topicId] || null) : null;

  const searchResults = useMemo(()=>{
    const s=q.trim().toLowerCase();
    if(!s) return [];
    return allTopics.filter(({cat,t})=> (t.title+" "+t.summary+" "+cat.title+" "+t.group).toLowerCase().includes(s)).slice(0,60);
  },[q,allTopics]);

  useEffect(()=>{
    if(topicId) window.scrollTo(0,0);
  },[topicId]);

  useEffect(()=>{
    if(topicId) setSearchParams(prev=>{ prev.set("t",topicId); return prev; },{replace:true});
    else setSearchParams(prev=>{ prev.delete("t"); return prev; },{replace:true});
  },[topicId]);

  const showDetail = !!topicId;
  const showSearch = q.trim().length>0 && !showDetail;
  const showCatList = !showDetail && !showSearch && !curCat;
  const showTopicList = !showDetail && !showSearch && !!curCat;

  if(showDetail){
    const bcCat = detail ? cats.find(c=>c.title===detail.catTitle) : null;
    return (
      <div className="min-h-screen" style={{background:"#F7F8FC"}}>
        <AppNavbar subtitle="คู่มือบริการประชาชน" q={q} setQ={setQ} placeholder="ค้นหาบริการ เช่น โรงแรม อาวุธปืน แจ้งเกิด สัญชาติ" />
        <div className="w-full lg:max-w-[1180px] mx-auto pb-[84px] lg:pb-8">
          <div className="px-4 lg:px-6 pt-4">
            <Breadcrumb items={[
              {label:"หน้าหลัก", to:"/"},
              {label:"คู่มือประชาชน 277 เรื่อง", to:"/guide"},
              ...(bcCat ? [{label:bcCat.title}] : []),
              ...(detail ? [{label:detail.topic.title}] : [])
            ]} />
            <button onClick={()=>setTopicId(null)} className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-[13px] font-medium hover:border-[#0a0a54]/30 hover:shadow-sm transition-all" style={{color:"#0a0a54"}}><Icon icon="heroicons:chevron-left-20-solid" width={16} height={16} /> กลับ</button>
            {!detail && <div className="mt-4 bg-white rounded-[16px] border border-red-100 p-4 text-[13px] text-red-600">ไม่พบรายละเอียด</div>}
            {detail && (
              <>
                <div className="mt-3 bg-[#0a0a54] text-white rounded-[16px] p-4">
                  <div className="text-[11px] text-white/70">{detail.catTitle}{detail.topic.group ? ` · ${detail.topic.group}` : ""}</div>
                  <div className="text-[16px] font-bold mt-1 leading-snug">{detail.topic.title}</div>
                  <a href={detail.topic.url} target="_blank" rel="noreferrer" className="inline-block mt-2 text-[11px] bg-white/15 px-2 py-1 rounded-full text-white/90">อ้างอิงกรมการปกครอง ↗</a>
                </div>
                <div className="mt-4 space-y-3">
                  {detail.topic.sections.map(s=>(
                    <div key={s.head} className="bg-white rounded-[16px] border border-slate-100 p-4" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
                      <div className="text-[12px] font-semibold flex items-center gap-2" style={{color:"#0a0a54"}}><Icon icon="reicon:check-circle" width={16} height={16} /> {s.head}</div>
                      <div className="mt-2 space-y-1.5">
                        {s.body.map((line,i)=>(
                          <div key={i} className="text-[13px] leading-relaxed" style={{color:"#1A1A1A"}}>{line.replace(/^\d+\.\s*/,"• ")}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="bg-white rounded-[16px] border border-slate-100 p-4" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
                    <div className="text-[12px] font-semibold" style={{color:"#0a0a54"}}>สถานที่ยื่น</div>
                    <div className="text-[13px] mt-2" style={{color:"#1A1A1A"}}>สำนักทะเบียนอำเภอบ้านบึง 038-446202 · ติดต่อได้ทั่วประเทศ</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  const topBreadcrumb = showSearch ? [{label:"หน้าหลัก", to:"/"}, {label:"คู่มือประชาชน 277 เรื่อง", to:"/guide"}, {label:`ค้นหา "${q.trim()}"`}] : showTopicList && curCat ? [{label:"หน้าหลัก", to:"/"}, {label:"คู่มือประชาชน 277 เรื่อง", to:"/guide"}, {label:curCat.title}] : [{label:"หน้าหลัก", to:"/"}, {label:"คู่มือประชาชน 277 เรื่อง"}];

  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="คู่มือบริการประชาชน" q={q} setQ={setQ} placeholder="ค้นหาบริการ เช่น โรงแรม อาวุธปืน แจ้งเกิด สัญชาติ" />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[84px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-4">
          <Breadcrumb items={topBreadcrumb} />
          <h1 className="text-[18px] font-bold mt-2" style={{color:"#1A1A1A"}}>คู่มือบริการประชาชน</h1>
          <p className="text-[12px] mt-1" style={{color:"#8E95A5"}}>ขั้นตอน เอกสาร ค่าธรรมเนียม และระยะเวลาของงานบริการอำเภอ — อ้างอิงคู่มือกรมการปกครอง · 277 เรื่อง 16 หมวด</p>
          {showSearch ? (
            <div className="mt-4 space-y-3">
              <div className="text-[12px]" style={{color:"#8E95A5"}}>ผลการค้นหา {searchResults.length} เรื่อง</div>
              {searchResults.map(({cat,t})=>(
                <button key={t.id} onClick={()=>{setTopicId(t.id); setQ("");}} className="w-full text-left bg-white rounded-[16px] border border-slate-100 p-4 flex items-center justify-between hover:border-[#0a0a54]/30 hover:shadow-[0_12px_28px_rgba(10,10,84,0.12)] hover:-translate-y-[1px] transition-all" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
                  <div className="pr-3"><div className="text-[13px] font-semibold leading-snug" style={{color:"#1A1A1A"}}>{t.title}</div><div className="text-[11px] mt-1" style={{color:"#8E95A5"}}>{cat.title} · {t.summary}</div></div>
                  <Icon icon="heroicons:chevron-right-20-solid" width={18} height={18} style={{color:"#8E95A5"}} />
                </button>
              ))}
              {searchResults.length===0 && <div className="text-[13px] py-8 text-center" style={{color:"#8E95A5"}}>ไม่พบรายการที่ค้นหา</div>}
            </div>
          ) : showCatList ? (
            <div className="mt-4 grid grid-cols-1 gap-3">
              {cats.map(c=>(
                <button key={c.id} onClick={()=>setCatId(c.id)} className="w-full text-left bg-white rounded-[16px] border border-slate-100 p-4 flex items-center gap-3 hover:border-[#0a0a54]/30 hover:shadow-[0_12px_28px_rgba(10,10,84,0.12)] hover:-translate-y-[1px] transition-all" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
                  <span className="w-10 h-10 rounded-xl bg-[#F7F8FC] flex items-center justify-center shrink-0"><Icon icon={c.icon} width={22} height={22} /></span>
                  <div className="flex-1 text-left"><div className="text-[13px] font-semibold" style={{color:"#1A1A1A"}}>{c.title}</div><div className="text-[11px]" style={{color:"#8E95A5"}}>{c.count} เรื่อง</div></div>
                  <Icon icon="heroicons:chevron-right-20-solid" width={18} height={18} style={{color:"#8E95A5"}} />
                </button>
              ))}
            </div>
          ) : showTopicList && curCat ? (
            <div className="mt-4 space-y-3">
              <button onClick={()=>setCatId(null)} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-[13px] font-medium hover:border-[#0a0a54]/30 hover:shadow-sm transition-all" style={{color:"#0a0a54"}}><Icon icon="heroicons:chevron-left-20-solid" width={16} height={16} /> กลับ {curCat.title}</button>
              {curCat.groups.map(g=>(
                <div key={g.group || curCat.id}>
                  {g.group && <div className="text-[12px] font-semibold mt-2 mb-2" style={{color:"#0a0a54"}}>{g.group}</div>}
                  <div className="space-y-3">
                    {g.topics.map(t=>(
                      <button key={t.id} onClick={()=>setTopicId(t.id)} className="w-full text-left bg-white rounded-[16px] border border-slate-100 p-4 flex items-center justify-between hover:border-[#0a0a54]/30 hover:shadow-[0_12px_28px_rgba(10,10,84,0.12)] hover:-translate-y-[1px] transition-all" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
                        <div className="pr-3"><div className="text-[13px] font-semibold leading-snug" style={{color:"#1A1A1A"}}>{t.title}</div><div className="text-[11px] mt-1" style={{color:"#8E95A5"}}>{t.summary}</div></div>
                        <Icon icon="heroicons:chevron-right-20-solid" width={18} height={18} style={{color:"#8E95A5"}} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
