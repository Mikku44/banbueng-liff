import type { Route } from "./+types/registration.mobile-id";
import { NavLink } from "react-router";
import { useState } from "react";
import { AppNavbar, BottomNav } from "../components/Navbar";
import { Breadcrumb } from "../components/Breadcrumb";
import liff from "@line/liff";
import { useLiff } from "../lib/liff";
const ReqLabel = ({t}:{t:string}) => { const req = t.includes("*"); const txt = t.replace(" *","").replace("*",""); return <span>{txt} {req && <span style={{color:"#FF4D4D"}}>*</span>}</span>; };
export function meta({}: Route.MetaArgs){ return [{title:"ขอถ่ายบัตรนอกสถานที่ - BANBUENG SMART"}]; }

export default function MobileId(){
  const [tab, setTab] = useState<"new"|"mine">("new");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:"", id:"", phone:"", relation:"", tambon:"", moo:"", houseNo:"", village:"", road:"", soi:"" });
  const canNext = form.name.trim().length>1 && form.phone.trim().length>=9 && form.relation.trim().length>0 && form.tambon!=="";
  const set = (k:string, v:string)=> setForm(s=>({...s,[k]:v}));
  const { isInClient, profile } = useLiff();
  const [sending,setSending]=useState(false);
  async function handleSubmit(){
    const text = `🏠 ขอถ่ายบัตรนอกสถานที่\nผู้แจ้ง: ${form.name} (${form.relation}) โทร ${form.phone}${form.id?` เลขบัตร ${form.id}`:""}\nที่อยู่: ต.${form.tambon} ม.${form.moo||"-"} บ้านเลขที่ ${form.houseNo||"-"} ${form.village} ${form.road} ${form.soi}\nอ.บ้านบึง จ.ชลบุรี`;
    setSending(true);
    try{
      await fetch("/api/mobile-id",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ ...form, userId: profile?.userId ?? null, displayName: profile?.displayName ?? null }) }).catch(()=>null);
      if(isInClient && liff.isApiAvailable("sendMessages")){
        await liff.sendMessages([{ type:"text", text }]);
        setTab("mine"); setStep(1);
        setTimeout(()=>liff.closeWindow(), 500);
      } else if(liff.isApiAvailable("shareTargetPicker")){
        const res = await liff.shareTargetPicker([{ type:"text", text } as any]);
        if(res){ setTab("mine"); setStep(1); }
        else { setSending(false); return; }
      } else {
        try{ await navigator.clipboard.writeText(text); }catch{}
        alert(text + "\n\n(คัดลอกแล้ว)");
        setTab("mine"); setStep(1);
      }
    } catch(e:any){ alert(e?.message ?? String(e)); }
    finally{ setSending(false); }
  }
  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="ขอถ่ายบัตรนอกสถานที่" />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[84px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-4">
          <Breadcrumb items={[{label:"หน้าหลัก", to:"/"}, {label:"งานทะเบียนและบัตร", to:"/registration"}, {label:"ขอถ่ายบัตรนอกสถานที่"}]} />
          <h1 className="text-[18px] font-bold mt-2" style={{color:"#1A1A1A"}}>ขอถ่ายบัตรนอกสถานที่</h1>
          <div className="flex gap-2 mt-3">
            <button onClick={()=>setTab("new")} className={`text-[12px] px-4 py-1.5 rounded-full border transition ${tab==="new" ? "bg-[#0a0a54] text-white border-[#0a0a54]" : "bg-white border-slate-200"}`} style={tab!=="new" ? {color:"#8E95A5"} as any : {}}>ยื่นคำร้อง</button>
            <button onClick={()=>setTab("mine")} className={`text-[12px] px-4 py-1.5 rounded-full border transition ${tab==="mine" ? "bg-[#0a0a54] text-white border-[#0a0a54]" : "bg-white border-slate-200"}`} style={tab!=="mine" ? {color:"#8E95A5"} as any : {}}>คำร้องของฉัน</button>
          </div>
          <p className="text-[12px] mt-3 p-3 rounded-xl bg-[#FFF7E0] border border-amber-100 leading-relaxed" style={{color:"#92400e"}}>สำหรับผู้ที่เคลื่อนย้ายไม่ได้ — ใช้กรณี ผู้ป่วยติดเตียง · คนชรา · ผู้พิการ ที่ไม่สามารถเดินทางมาทำบัตรที่อำเภอได้ และจำเป็นต้องใช้บัตรประจำตัวประชาชนเร่งด่วน — ญาติ ผู้ดูแล กำนัน/ผู้ใหญ่บ้าน หรือ อสม. ยื่นแทนได้</p>
        </div>

        {tab==="mine" ? (
          <div className="px-4 lg:px-6 pt-6">
            <div className="bg-white rounded-[16px] border border-slate-100 p-8 text-center" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
              <div className="w-12 h-12 rounded-full bg-[#F7F8FC] flex items-center justify-center mx-auto text-[#8E95A5]">—</div>
              <div className="text-[13px] mt-3" style={{color:"#8E95A5"}}>ยังไม่มีคำร้อง</div>
              <div className="text-[11px] mt-1" style={{color:"#8E95A5"}}>ยื่นคำร้องใหม่เพื่อขอเจ้าหน้าที่ออกไปถ่ายบัตรนอกสถานที่</div>
              <button onClick={()=>setTab("new")} className="mt-4 px-5 py-2 rounded-full text-white text-[12px] font-medium" style={{background:"#0a0a54"}}>ยื่นคำร้องใหม่</button>
            </div>
          </div>
        ) : (
          <div className="px-4 lg:px-6 pt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden"><div className="h-full bg-[#0a0a54] transition-all" style={{width:`${step/5*100}%`}} /></div>
              <span className="text-[11px] whitespace-nowrap" style={{color:"#8E95A5"}}>ขั้นที่ {step} จาก 5</span>
            </div>

            {step===1 && (
              <div className="bg-white rounded-[16px] border border-slate-100 p-4 space-y-4" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
                <div className="text-[13px] font-semibold" style={{color:"#1A1A1A"}}>1. ข้อมูลผู้แจ้ง</div>
                {[
                  {k:"name", l:"ชื่อ – นามสกุล *", ph:"ชื่อ – นามสกุล *"},
                  {k:"id", l:"เลขประจำตัวประชาชน 13 หลัก", ph:"เลขประจำตัวประชาชน 13 หลัก"},
                  {k:"phone", l:"เบอร์โทรศัพท์ *", ph:"เบอร์โทรศัพท์ *"},
                  {k:"relation", l:"ความสัมพันธ์กับผู้ขอทำบัตร (เช่น บุตร · คู่สมรส · ผู้ดูแล · ผู้ใหญ่บ้าน)", ph:"ความสัมพันธ์กับผู้ขอทำบัตร (เช่น บุตร · คู่สมรส · ผู้ดูแล · ผู้ใหญ่บ้าน)"},
                ].map(f=>(
                  <div key={f.k}><div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}><ReqLabel t={f.l} /></div><input value={(form as any)[f.k]} onChange={e=>set(f.k, e.target.value)} placeholder={f.ph} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54] placeholder:text-[#8E95A5]" /></div>
                ))}
                <div className="text-[13px] font-semibold pt-2" style={{color:"#1A1A1A"}}>ที่อยู่ผู้แจ้ง</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}><ReqLabel t="ตำบล *" /></div>
                    <select value={form.tambon} onChange={e=>set("tambon", e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54]">
                      <option value="">เลือกตำบล</option>
                      <option value="บ้านบึง">บ้านบึง (Ban Bueng)</option>
                      <option value="คลองกิ่ว">คลองกิ่ว (Khlong Kio)</option>
                      <option value="มาบไผ่">มาบไผ่ (Map Phai)</option>
                      <option value="หนองซ้ำซาก">หนองซ้ำซาก (Nong Samsak)</option>
                      <option value="หนองบอนแดง">หนองบอนแดง (Nong Bon Daeng)</option>
                      <option value="หนองชาก">หนองชาก (Nong Chak)</option>
                      <option value="หนองอิรุณ">หนองอิรุณ (Nong Irun)</option>
                      <option value="หนองไผ่แก้ว">หนองไผ่แก้ว (Nong Phai Kaeo)</option>
                    </select>
                  </div>
                  {[
                    {k:"moo", l:"หมู่ที่"},
                    {k:"houseNo", l:"บ้านเลขที่"},
                    {k:"village", l:"หมู่บ้าน"},
                    {k:"road", l:"ถนน"},
                    {k:"soi", l:"ตรอก/ซอย"},
                  ].map(f=>(
                    <div key={f.k}><div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}><ReqLabel t={f.l} /></div><input value={(form as any)[f.k]} onChange={e=>set(f.k, e.target.value)} placeholder={f.l} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54]" /></div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}>อำเภอ</div><input defaultValue="บ้านบึง" disabled className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[13px]" /></div>
                  <div><div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}>จังหวัด</div><input defaultValue="ชลบุรี" disabled className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[13px]" /></div>
                </div>
                <button disabled={!canNext} onClick={()=>canNext && setStep(2)} className={`w-full py-3 rounded-full font-semibold text-[13px] transition ${canNext ? "bg-[#0a0a54] text-white hover:bg-[#07073e]" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>ถัดไป ›</button>
                {!canNext && <div className="text-[11px] text-center" style={{color:"#8E95A5"}}>กรอกชื่อ, เบอร์โทร และความสัมพันธ์ให้ครบเพื่อไปต่อ</div>}
              </div>
            )}

            {step===2 && (
              <div className="bg-white rounded-[16px] border border-slate-100 p-6 text-center" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
                <div className="text-[14px] font-semibold" style={{color:"#1A1A1A"}}>ขั้นที่ 2: ข้อมูลผู้ขอทำบัตร</div>
                <p className="text-[12px] mt-2" style={{color:"#8E95A5"}}>กรอกชื่อ-สกุล, เลขบัตร, วันเกิดของผู้ป่วย/ผู้สูงอายุ</p>
                <div className="mt-4 p-4 rounded-xl bg-[#F7F8FC] border border-slate-100 text-[12px]" style={{color:"#8E95A5"}}>ฟอร์มตัวอย่าง — ต่อยอดเพิ่ม field ได้ตามต้นฉบับ</div>
                <div className="flex gap-3 mt-6">
                  <button onClick={()=>setStep(1)} className="flex-1 py-3 rounded-full border border-slate-200 bg-white text-[13px]">ย้อนกลับ</button>
                  <button onClick={()=>setStep(3)} className="flex-1 py-3 rounded-full bg-[#0a0a54] text-white text-[13px] font-semibold">ถัดไป ›</button>
                </div>
              </div>
            )}
            {step>=3 && (
              <div className="bg-white rounded-[16px] border border-slate-100 p-6 text-center" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
                <div className="text-[14px] font-semibold" style={{color:"#1A1A1A"}}>ขั้นที่ {step}: {["","", "","ที่อยู่ผู้ขอ","เหตุผล/เอกสารแนบ","ยืนยันส่งคำร้อง"][step] || "ดำเนินการ"}</div>
                <p className="text-[12px] mt-2" style={{color:"#8E95A5"}}>หน้านี้จำลองตามต้นฉบับ — เพิ่ม field ตาม API จริงได้</p>
                <div className="flex gap-3 mt-6">
                  <button onClick={()=>setStep(s=>Math.max(1,s-1))} className="flex-1 py-3 rounded-full border border-slate-200 bg-white text-[13px]">ย้อนกลับ</button>
                  {step<5 ? <button onClick={()=>setStep(s=>s+1)} className="flex-1 py-3 rounded-full bg-[#0a0a54] text-white text-[13px] font-semibold">ถัดไป ›</button> : <button onClick={handleSubmit} disabled={sending} className={`flex-1 py-3 rounded-full text-[13px] font-semibold ${sending ? "bg-slate-200 text-slate-400" : "bg-[#00C875] text-white"}`}>{sending ? "กำลังส่ง..." : "ส่งคำร้อง"}</button>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
