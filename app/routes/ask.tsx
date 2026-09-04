import type { Route } from "./+types/ask";
import { useState, useEffect } from "react";
import { AppNavbar, BottomNav } from "../components/Navbar";
import { Breadcrumb } from "../components/Breadcrumb";
import liff from "@line/liff";
import { useLiff } from "../lib/liff";
export function meta({}: Route.MetaArgs){ return [{title:"ถามเจ้าหน้าที่ - BANBUENG SMART"}]; }

const cats = [
  "งานทะเบียนและบัตร",
  "งานความมั่นคง",
  "งานบริหารงานปกครอง",
  "งานศูนย์ดำรงธรรม",
  "เรื่องทั่วไป/ยังไม่จัดหมวด",
  "งานสำนักงานอำเภอ (แผนพัฒนา · พิธี/รัฐพิธี · นโยบาย · ผลไม้/ของดี · ธุรการ)",
];

type Q = { id:string; text:string; cat:string; time:number; status:"รอตอบ"|"ตอบแล้ว" };

export default function Ask(){
  const [cat,setCat]=useState<string>("");
  const [text,setText]=useState("");
  const [list,setList]=useState<Q[]>([]);
  const [sending,setSending]=useState(false);
  const { isInClient, profile } = useLiff();
  useEffect(()=>{
    try{ const r=localStorage.getItem("banbueng_ask"); if(r) setList(JSON.parse(r)); }catch{}
  },[]);
  const save=(q:Q)=>{
    const n=[q,...list];
    setList(n);
    localStorage.setItem("banbueng_ask", JSON.stringify(n));
  };
  const send=async()=>{
    if(!text.trim() || sending) return;
    const q:Q={ id:Date.now().toString(), text:text.trim(), cat:cat||"ยังไม่จัดหมวด", time:Date.now(), status:"รอตอบ" };
    const msg = `❓ สอบถามเจ้าหน้าที่\nหมวด: ${q.cat}\nคำถาม: ${q.text}\nเวลา: ${new Date(q.time).toLocaleString("th-TH")}`;
    setSending(true);
    try{
      await fetch("/api/ask",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ category: q.cat, question: q.text, userId: profile?.userId ?? null, displayName: profile?.displayName ?? null }) }).catch(()=>null);
      let sent = false;
      if(isInClient && liff.isApiAvailable("sendMessages")){
        try{ await liff.sendMessages([{ type:"text", text: msg }]); sent = true; }catch{}
      }
      if(!sent && liff.isApiAvailable("shareTargetPicker")){
        try{
          const res = await liff.shareTargetPicker([{ type:"text", text: msg } as any]);
          if(res) sent = true;
          else { setSending(false); return; }
        }catch{}
      }
      if(!sent){
        try{ await navigator.clipboard.writeText(msg); }catch{}
      }
    } catch(e:any){
      console.warn(e);
    }
    save(q);
    setText(""); setCat("");
    setSending(false);
    if(isInClient) setTimeout(()=>liff.closeWindow(), 500);
    else alert("ส่งคำถามแล้ว — ส่งเข้าแชต LINE แล้ว เจ้าหน้าที่จะตอบทางแชท");
  };
  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="ถามเจ้าหน้าที่" />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[84px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-4">
          <Breadcrumb items={[{label:"หน้าหลัก", to:"/"}, {label:"ถามเจ้าหน้าที่"}]} />
          <h1 className="text-[18px] font-bold mt-2" style={{color:"#1A1A1A"}}>ถามเจ้าหน้าที่</h1>
          <p className="text-[12px] mt-1" style={{color:"#8E95A5"}}>ประเภทคำถาม (เลือกได้ ไม่เลือกระบบจะจัดหมวดให้)</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {cats.map(c=>(
              <button key={c} onClick={()=>setCat(c===cat?"":c)} className={`text-[12px] px-3 py-1.5 rounded-full border text-left leading-snug ${cat===c ? "bg-[#0a0a54] text-white border-[#0a0a54]" : "bg-white border-slate-100 hover:border-[#0a0a54]/30"}`} style={cat!==c ? {color:"#1A1A1A"} as any : {}}>{c}</button>
            ))}
          </div>
          <div className="mt-4 bg-white rounded-[16px] border border-slate-100 p-4" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
            <div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}>คำถามของท่าน</div>
            <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="พิมพ์คำถามของท่าน..." rows={4} className="mt-2 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54] placeholder:text-[#8E95A5] resize-none" />
            <button onClick={send} disabled={!text.trim() || sending} className={`mt-3 w-full py-2.5 rounded-full text-[13px] font-semibold transition ${text.trim() && !sending ? "bg-[#0a0a54] text-white hover:bg-[#07073e]" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>{sending ? "กำลังส่ง..." : "ส่งคำถาม"}</button>
          </div>
        </div>

        <div className="px-4 lg:px-6 pt-6">
          <h2 className="text-[14px] font-semibold" style={{color:"#1A1A1A"}}>ประวัติคำถามของฉัน</h2>
          {list.length===0 ? (
            <div className="mt-3 bg-white rounded-[16px] border border-slate-100 p-8 text-center" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
              <div className="text-[13px]" style={{color:"#8E95A5"}}>ยังไม่เคยถามคำถาม</div>
              <div className="text-[11px] mt-1 leading-relaxed" style={{color:"#8E95A5"}}>คำถามจะถูกส่งถึงปลัดอำเภอผู้รับผิดชอบงานนั้นโดยตรง และท่านจะได้รับคำตอบทางแชท LINE</div>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {list.map(q=>(
                <div key={q.id} className="bg-white rounded-[16px] border border-slate-100 p-4" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] px-2 py-1 rounded-full bg-[#F7F8FC] border border-slate-100" style={{color:"#0a0a54"}}>{q.cat}</span>
                    <span className={`text-[11px] px-2 py-1 rounded-full border ${q.status==="รอตอบ" ? "bg-[#FFF7E0] border-amber-100 text-[#92400e]" : "bg-[#F0FDF6] border-emerald-100 text-[#065f46]"}`}>{q.status}</span>
                  </div>
                  <div className="text-[13px] mt-2 leading-snug" style={{color:"#1A1A1A"}}>{q.text}</div>
                  <div className="text-[11px] mt-2" style={{color:"#8E95A5"}}>{new Date(q.time).toLocaleString("th-TH")}</div>
                </div>
              ))}
            </div>
          )}
          <div className="text-[11px] text-center mt-4 leading-relaxed" style={{color:"#8E95A5"}}>คำถามจะถูกส่งถึงปลัดอำเภอผู้รับผิดชอบงานนั้นโดยตรง และท่านจะได้รับคำตอบทางแชท LINE</div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
