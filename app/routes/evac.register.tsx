import type { Route } from "./+types/evac.register";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { AppNavbar, BottomNav } from "../components/Navbar";
import { Breadcrumb } from "../components/Breadcrumb";
import liff from "@line/liff";
import { useLiff } from "../lib/liff";
const ReqLabel = ({t}:{t:string}) => { const req = t.includes("*"); const txt = t.replace(" *","").replace("*",""); return <span>{txt} {req && <span style={{color:"#FF4D4D"}}>*</span>}</span>; };
export function meta({}: Route.MetaArgs){ return [{title:"ลงทะเบียนอพยพ - BANBUENG SMART"}]; }

const TAMBONS = ["บ้านบึง","คลองกิ่ว","มาบไผ่","หนองซ้ำซาก","หนองบอนแดง","หนองชาก","หนองอิรุณ","หนองไผ่แก้ว"];
const VILLAGES: Record<string,string[]> = {
  "บ้านบึง":["หมู่ 1","หมู่ 2","หมู่ 3","หมู่ 4","หมู่ 5"],
  "คลองกิ่ว":["หมู่ 1","หมู่ 2","หมู่ 3","หมู่ 4"],
  "มาบไผ่":["หมู่ 1","หมู่ 2","หมู่ 3"],
  "หนองซ้ำซาก":["หมู่ 1","หมู่ 2","หมู่ 3","หมู่ 4"],
  "หนองบอนแดง":["หมู่ 1","หมู่ 2","หมู่ 3"],
  "หนองชาก":["หมู่ 1","หมู่ 2","หมู่ 3","หมู่ 4"],
  "หนองอิรุณ":["หมู่ 1","หมู่ 2","หมู่ 3","หมู่ 4","หมู่ 5"],
  "หนองไผ่แก้ว":["หมู่ 1","หมู่ 2","หมู่ 3"],
};

function StepCircle({ n, color }: { n:number| string; color:string }) {
  return <span className="w-7 h-7 rounded-full text-white text-[12px] font-bold flex items-center justify-center shrink-0" style={{background:color}}>{n}</span>;
}

export default function EvacRegister(){
  const [tambon,setTambon]=useState("");
  const [village,setVillage]=useState("");
  const [houseNo,setHouseNo]=useState("");
  const [members,setMembers]=useState([{name:"", gender:"", year:"", id4:"", phone:"", tags:[] as string[], owner:false, hasCar:false, withWhom:"", }]);
  const [expanded,setExpanded]=useState(0);
  const [pets,setPets]=useState("");
  const addMember=()=> { setMembers(m=>{ const n=[...m,{name:"", gender:"", year:"", id4:"", phone:"", tags:[], owner:false, hasCar:false, withWhom:""}]; setExpanded(n.length-1); return n; }); };
  const toggleTag=(idx:number, tag:string)=> setMembers(m=> m.map((x,i)=> i===idx ? {...x, tags: x.tags.includes(tag) ? x.tags.filter(t=>t!==tag) : [...x.tags, tag]} : x));
  const canSave = tambon && village && houseNo && members[0].name;
  const { isInClient, profile } = useLiff();
  const [saving,setSaving]=useState(false);
  const save=async()=>{
    if(!canSave || saving) return;
    const data={tambon, village, houseNo, members, pets, updated:Date.now()};
    localStorage.setItem("banbueng_evac", JSON.stringify(data));
    const memberLines = members.map((m,i)=> `${i+1}. ${m.name||"ไม่ระบุ"}${m.gender?` (${m.gender})`:""}${m.year?` ปี${m.year}`:""}${m.phone?` โทร${m.phone}`:""}${m.tags.length?` [${m.tags.join(",")}]`:""}${m.withWhom?` ->${m.withWhom}`:""}`).join("\n");
    const text = `🚨 ลงทะเบียนอพยพ\nที่อยู่: ${tambon} ${village} บ้านเลขที่ ${houseNo}\nสมาชิก ${members.length} คน:\n${memberLines}${pets?`\nสัตว์เลี้ยง: ${pets}`:""}`;
    setSaving(true);
    try{
      await fetch("/api/evac",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ tambon, village, houseNo, members, pets, userId: profile?.userId ?? null, displayName: profile?.displayName ?? null }) }).catch(()=>null);
      if(isInClient && liff.isApiAvailable("sendMessages")){
        await liff.sendMessages([{ type:"text", text }]);
        setTimeout(()=>liff.closeWindow(), 500);
      } else if(liff.isApiAvailable("shareTargetPicker")){
        const res = await liff.shareTargetPicker([{ type:"text", text } as any]);
        if(!res) { setSaving(false); return; }
      } else {
        try{ await navigator.clipboard.writeText(text); }catch{}
      }
    } catch(e:any){
      alert(e?.message ?? String(e));
      setSaving(false);
      return;
    }
    setSaving(false);
    alert(isInClient ? "บันทึกและส่งเข้าแชต LINE แล้ว" : "บันทึกแล้ว + ส่งเข้าแชต LINE แล้ว");
  };
  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="ลงทะเบียนอพยพครอบครัว" />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[84px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-4">
          <Breadcrumb items={[{label:"หน้าหลัก", to:"/"}, {label:"ลงทะเบียนอพยพ"}]} />
          <h1 className="text-[18px] font-bold mt-2" style={{color:"#1A1A1A"}}>ลงทะเบียนครัวเรือนของท่าน</h1>
          <p className="text-[12px] mt-1 leading-relaxed" style={{color:"#8E95A5"}}>กรอกสมาชิกทุกคนที่อยู่บ้านเดียวกัน — ระบุผู้ป่วยติดเตียง ผู้สูงอายุ เด็กเล็ก เพื่อให้เจ้าหน้าที่จัดลำดับการช่วยเหลือได้ถูกต้องเมื่อเกิดเหตุ</p>
        </div>

        <div className="px-4 lg:px-6 pt-6 space-y-4">
          <div className="bg-white rounded-[16px] border border-slate-100 p-4 space-y-4" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
            <div className="flex items-center gap-2">
              <StepCircle n={1} color="#0a0a54" />
              <span className="text-[13px] font-semibold" style={{color:"#1A1A1A"}}>ที่อยู่ครัวเรือน</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EEF2FF]" style={{color:"#0a0a54"}}>จำเป็น</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}><ReqLabel t="ตำบล *" /></div>
                <select value={tambon} onChange={e=>{setTambon(e.target.value); setVillage("");}} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54]">
                  <option value="">เลือกตำบล…</option>
                  {TAMBONS.map(t=> <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}><ReqLabel t="หมู่บ้าน *" /></div>
                <select value={village} onChange={e=>setVillage(e.target.value)} disabled={!tambon} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54] disabled:bg-slate-50">
                  <option value="">{tambon ? "เลือกหมู่บ้าน" : "เลือกตำบลก่อน"}</option>
                  {(VILLAGES[tambon]||[]).map(v=> <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}><ReqLabel t="บ้านเลขที่ *" /></div>
                <input value={houseNo} onChange={e=>setHouseNo(e.target.value)} placeholder="บ้านเลขที่" className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54]" />
              </div>
            </div>
          </div>

          {members.map((m,idx)=>(
            expanded===idx ? (
              <div key={idx} className="bg-white rounded-[16px] border border-slate-100 p-4 space-y-3" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StepCircle n={idx+2} color={idx===0 ? "#FF6B2C" : "#0a0a54"} />
                    <span className="text-[13px] font-semibold" style={{color:"#1A1A1A"}}>สมาชิกคนที่ {idx+1} · {idx===0 ? "ตัวฉันเอง" : "สมาชิกเพิ่มเติม"}</span>
                    {idx===0 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF0E8]" style={{color:"#FF6B2C"}}>หลัก</span>}
                  </div>
                  {members.length>1 && <button onClick={()=>setExpanded(-1)} className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100" style={{color:"#8E95A5"}}>ย่อ</button>}
                </div>
                <div><div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}><ReqLabel t="ชื่อ-นามสกุล *" /></div><input value={m.name} onChange={e=>setMembers(ms=> ms.map((x,i)=> i===idx ? {...x, name:e.target.value} : x))} placeholder="ชื่อ-นามสกุล" className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54]" /></div>
                <div>
                  <div className="text-[12px] font-medium flex items-center gap-1.5" style={{color:"#1A1A1A"}}><Icon icon="reicon:users" width={14} height={14} style={{color:"#0a0a54"}} /> เพศ</div>
                  <div className="flex gap-2 mt-1.5">
                    {[
                      { label:"ชาย", icon:"reicon:person", color:"#0a0a54" },
                      { label:"หญิง", icon:"reicon:person", color:"#FF6B8A" },
                      { label:"อื่นๆ", icon:"reicon:people", color:"#8E95A5" },
                    ].map(g=>(
                      <button key={g.label} onClick={()=>setMembers(ms=> ms.map((x,i)=> i===idx ? {...x, gender:g.label} : x))} className={`flex-1 py-2.5 rounded-full border text-[13px] font-medium flex items-center justify-center gap-1.5 transition hover:-translate-y-[1px] ${m.gender===g.label ? "text-white border-transparent" : "bg-white border-slate-200 hover:border-[#0a0a54]/30"}`} style={m.gender===g.label ? {background:g.color} as any : {color:"#8E95A5"} as any}><Icon icon={g.icon} width={16} height={16} style={m.gender===g.label ? {color:"white"} : {color:g.color}} />{g.label}</button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div><div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}><ReqLabel t="ปีเกิด (พ.ศ.)" /></div><input value={m.year} onChange={e=>setMembers(ms=> ms.map((x,i)=> i===idx ? {...x, year:e.target.value} : x))} placeholder="เช่น 2535" className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54]" /></div>
                  <div><div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}><ReqLabel t="เลขบัตร 4 ตัวท้าย" /></div><input value={m.id4} onChange={e=>setMembers(ms=> ms.map((x,i)=> i===idx ? {...x, id4:e.target.value} : x))} placeholder="ถ้ามี" className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54]" /></div>
                  <div><div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}><ReqLabel t="เบอร์โทร" /></div><input value={m.phone} onChange={e=>setMembers(ms=> ms.map((x,i)=> i===idx ? {...x, phone:e.target.value} : x))} placeholder="ถ้ามี" className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54]" /></div>
                </div>
                <div>
                  <div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}>ลักษณะบุคคล — ติ๊กถ้า เปราะบาง (ไม่ติ๊ก = กลุ่มปกติ)</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["สูงอายุ","ติดเตียง","พิการ","เด็กเล็ก","จิตเวช","ตั้งครรภ์","ฟอกไต","ช่วยตนเองลำบาก"].map(tag=>(
                      <button key={tag} onClick={()=>toggleTag(idx,tag)} className={`text-[12px] px-3 py-1.5 rounded-full border transition hover:-translate-y-[1px] ${m.tags.includes(tag) ? "bg-[#0a0a54] text-white border-[#0a0a54]" : "bg-white border-slate-200 hover:border-[#0a0a54]/30"}`} style={m.tags.includes(tag) ? {} : {color:"#8E95A5"} as any}>{tag}</button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["เจ้าบ้าน","มีรถอพยพเอง"].map(tag=>(
                      <button key={tag} onClick={()=>toggleTag(idx,tag)} className={`text-[12px] px-3 py-1.5 rounded-full border transition hover:-translate-y-[1px] ${m.tags.includes(tag) ? "bg-[#00C875] text-white border-[#00C875]" : "bg-white border-slate-200 hover:border-[#00C875]/30"}`} style={m.tags.includes(tag) ? {} : {color:"#8E95A5"} as any}>{tag}</button>
                    ))}
                  </div>
                </div>
                <div><div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}>ไปกับใคร/รถคันไหน (ถ้าไม่มีรถ)</div><input value={m.withWhom} onChange={e=>setMembers(ms=> ms.map((x,i)=> i===idx ? {...x, withWhom:e.target.value} : x))} placeholder="ไปกับใคร/รถคันไหน (ถ้าไม่มีรถ)" className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54]" /></div>
              </div>
            ) : (
              <div key={idx} className="bg-white rounded-[16px] border border-slate-100 p-4 flex items-center justify-between" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
                <div className="flex items-center gap-2 min-w-0">
                  <StepCircle n={idx+2} color={idx===0 ? "#FF6B2C" : "#0a0a54"} />
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold truncate" style={{color:"#1A1A1A"}}>{m.name || "ยังไม่ได้กรอก"} {m.gender ? "· "+m.gender : ""}</div>
                    <div className="text-[11px] truncate" style={{color:"#8E95A5"}}>{m.year ? "ปี "+m.year+" · " : ""}{m.phone || ""} {m.tags.length? "· "+m.tags.slice(0,2).join(", "): ""}</div>
                  </div>
                </div>
                <button onClick={()=>setExpanded(idx)} className="ml-2 shrink-0 text-[12px] px-3 py-1.5 rounded-full border border-[#0a0a54] text-[#0a0a54] bg-white hover:bg-[#0a0a54] hover:text-white transition">แก้ไข</button>
              </div>
            )
          ))}

          <button onClick={addMember} className="w-full py-3 rounded-full border-2 border-dashed border-slate-200 bg-white text-[13px] font-medium hover:border-[#0a0a54]/30 hover:bg-[#F7F8FC] hover:-translate-y-[1px] transition-all flex items-center justify-center gap-2" style={{color:"#0a0a54"}}>
            <span className="w-6 h-6 rounded-full bg-[#0a0a54] text-white flex items-center justify-center text-[14px]">+</span> เพิ่มสมาชิกอีกคน (ตกหล่น)
          </button>

          <div className="bg-white rounded-[16px] border border-slate-100 p-4" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
            <div className="flex items-center gap-2">
              <StepCircle n={members.length+2} color="#00C875" />
              <span className="text-[13px] font-semibold" style={{color:"#1A1A1A"}}>สัตว์เลี้ยงที่ต้องพาไปด้วย</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F0FDF6] border border-emerald-100" style={{color:"#00C875"}}>ถ้ามี</span>
            </div>
            <input value={pets} onChange={e=>setPets(e.target.value)} placeholder="เช่น สุนัข 2 ตัว, แมว 1 ตัว" className="mt-3 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54]" />
          </div>

          <button onClick={save} disabled={!canSave || saving} className={`w-full py-3.5 rounded-full font-semibold text-[14px] transition hover:-translate-y-[1px] ${canSave && !saving ? "bg-[#0a0a54] text-white hover:bg-[#07073e] hover:shadow-[0_12px_28px_rgba(10,10,84,0.25)]" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>{saving ? "กำลังบันทึก..." : "บันทึกการลงทะเบียน"}</button>
          <p className="text-[11px] text-center leading-relaxed" style={{color:"#8E95A5"}}>ข้อมูลนี้ใช้เพื่อการช่วยเหลือและอพยพเท่านั้น — ผู้ใหญ่บ้านในหมู่ของท่านและเจ้าหน้าที่อำเภอเห็นได้</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
