import type { Route } from "./+types/registration.mobile-id";
import { useState, useEffect } from "react";
import { AppNavbar, BottomNav } from "../components/Navbar";
import { Breadcrumb } from "../components/Breadcrumb";
import liff from "@line/liff";
import { useLiff } from "../lib/liff";
import { toast } from "sonner";
import { HiOutlineHeart, HiOutlineUser, HiOutlineShieldCheck, HiOutlineDocumentText } from "react-icons/hi2";
const ReqLabel = ({ t }: { t: string }) => { const req = t.includes("*"); const txt = t.replace(" *", "").replace("*", ""); return <span>{txt} {req && <span style={{ color: "#FF4D4D" }}>*</span>}</span>; };
export function meta({}: Route.MetaArgs) { return [{ title: "ขอถ่ายบัตรนอกสถานที่ - BANBUENG SMART" }]; }

const TAMBONS = ["บ้านบึง","คลองกิ่ว","มาบไผ่","หนองซ้ำซาก","หนองบอนแดง","หนองชาก","หนองอิรุณ","หนองไผ่แก้ว"];

export default function MobileId() {
  const [tab, setTab] = useState<"new" | "mine">("new");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", id: "", phone: "", relation: "", tambon: "", moo: "", houseNo: "", village: "", road: "", soi: "",
    applicantName: "", applicantId: "", applicantBirthdate: "", applicantGender: "", applicantPhone: "",
    appTambon: "", appMoo: "", appHouseNo: "", appVillage: "", appRoad: "", appSoi: "", landmark: "",
    conditionType: "", reasonDetail: "", urgency: "", note: "", docReady: "",
  });
  const [same, setSame] = useState(false);
  const [consent, setConsent] = useState(false);
  const [mine, setMine] = useState<any[]>([]);
  const [loadingMine, setLoadingMine] = useState(false);
  const { isInClient, profile } = useLiff();
  const [sending, setSending] = useState(false);
  const set = (k: string, v: string) => setForm(s => ({ ...s, [k]: v }));

  const toggleSame = (checked: boolean) => {
    setSame(checked);
    if (checked) {
      setForm(s => ({ ...s, appTambon: s.tambon, appMoo: s.moo, appHouseNo: s.houseNo, appVillage: s.village, appRoad: s.road, appSoi: s.soi }));
    }
  };
  // Effective applicant address: when "same" is checked, always mirror reporter address
  const effAppTambon = same ? form.tambon : form.appTambon;
  const effAppMoo = same ? form.moo : form.appMoo;
  const effAppHouseNo = same ? form.houseNo : form.appHouseNo;
  const effAppVillage = same ? form.village : form.appVillage;
  const effAppRoad = same ? form.road : form.appRoad;
  const effAppSoi = same ? form.soi : form.appSoi;

  const canNext1 = form.name.trim().length > 1 && /^\d{9,10}$/.test(form.phone.replace(/\D/g,"")) && form.relation.trim().length > 0 && form.tambon !== "";
  const canNext2 = form.applicantName.trim().length > 1 && /^\d{13}$/.test(form.applicantId) && form.applicantBirthdate !== "";
  const canNext3 = effAppTambon.trim() !== "" && effAppHouseNo.trim() !== "";
  const canNext4 = form.conditionType !== "" && form.urgency !== "" && form.docReady !== "";

  async function fetchMine() {
    if (tab !== "mine") return;
    setLoadingMine(true);
    try {
      const uid = profile?.userId ? `?userId=${encodeURIComponent(profile.userId)}` : "";
      const r = await fetch(`/api/mobile-id${uid}`).then(x => x.json()).catch(()=>null);
      if (r?.items?.length) setMine(r.items);
      else {
        const local = localStorage.getItem("banbueng_mobile_mine");
        if (local) setMine(JSON.parse(local));
      }
    } catch {} finally { setLoadingMine(false); }
  }
  useEffect(()=>{ fetchMine(); }, [tab, profile?.userId]);
  useEffect(()=>{
    try{ const r=localStorage.getItem("banbueng_mobile_mine"); if(r) setMine(JSON.parse(r)); }catch{}
  }, []);

  async function handleSubmit() {
    if (!consent) { toast.error("กรุณายอมรับเงื่อนไขก่อนส่งคำร้อง"); return; }
    const text = `🏠 ขอถ่ายบัตรนอกสถานที่\n`+
      `ผู้แจ้ง: ${form.name} (${form.relation}) โทร ${form.phone}${form.id?` เลขบัตร ${form.id}`:""}\n`+
      `ที่อยู่ผู้แจ้ง: ต.${form.tambon} ม.${form.moo||"-"} บ้านเลขที่ ${form.houseNo||"-"} ${form.village} ${form.road} ${form.soi}\n`+
      `ผู้ขอ: ${form.applicantName} เลข ${form.applicantId} เกิด ${form.applicantBirthdate} ${form.applicantGender} โทร ${form.applicantPhone||"-"}\n`+
      `ที่อยู่ผู้ขอ: ต.${effAppTambon} ม.${effAppMoo||"-"} บ้านเลขที่ ${effAppHouseNo} ${effAppVillage} ${effAppRoad} ${effAppSoi} ${form.landmark?`จุดสังเกต ${form.landmark}`:""}\n`+
      `สภาพ: ${form.conditionType} ความเร่งด่วน: ${form.urgency} เอกสาร: ${form.docReady}\n`+
      `เหตุผล: ${form.reasonDetail}${form.note?`\nหมายเหตุ: ${form.note}`:""}`;
    setSending(true);
    try {
      const payload = {
        name: form.name, id: form.id, phone: form.phone, relation: form.relation, tambon: form.tambon, moo: form.moo, houseNo: form.houseNo, village: form.village, road: form.road, soi: form.soi,
        applicantName: form.applicantName, applicantId: form.applicantId, applicantBirthdate: form.applicantBirthdate, applicantGender: form.applicantGender, applicantPhone: form.applicantPhone,
        appTambon: effAppTambon, appMoo: effAppMoo, appHouseNo: effAppHouseNo, appVillage: effAppVillage, appRoad: effAppRoad, appSoi: effAppSoi, landmark: form.landmark,
        conditionType: form.conditionType, reasonDetail: form.reasonDetail, urgency: form.urgency, note: form.note, docReady: form.docReady,
        userId: profile?.userId ?? null, displayName: profile?.displayName ?? null,
      };
      const res = await fetch("/api/mobile-id", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).then(r=>r.json()).catch(()=>null);
      if (!res?.ok) throw new Error(res?.error || "บันทึกไม่สำเร็จ");
      const localItem = { ...payload, id: res.id, status: "รอดำเนินการ", created_at: new Date().toISOString(), applicant_name: payload.applicantName, app_tambon: payload.appTambon };
      const nextMine = [localItem, ...mine];
      setMine(nextMine);
      localStorage.setItem("banbueng_mobile_mine", JSON.stringify(nextMine));
      let sent = false;
      if (isInClient && liff.isApiAvailable("sendMessages")) {
        try{ await liff.sendMessages([{ type: "text", text }]); sent = true; }catch{}
      }
      if (!sent && liff.isApiAvailable("shareTargetPicker")) {
        try{ const r = await liff.shareTargetPicker([{ type: "text", text } as any]); if(r) sent = true; }catch{}
      }
      if (!sent) { try{ await navigator.clipboard.writeText(text); }catch{} }
      toast.success(sent ? "ส่งคำร้องแล้ว — ส่งเข้าแชต LINE แล้ว" : "บันทึกคำร้องแล้ว เจ้าหน้าที่จะติดต่อกลับ");
      setTab("mine"); setStep(1);
      if (sent && isInClient) setTimeout(()=>{ try{ liff.closeWindow(); }catch{} }, 800);
    } catch (e: any) { toast.error(e?.message ?? String(e)); }
    finally { setSending(false); }
  }

  return (
    <div className="min-h-screen" style={{ background: "#F7F8FC" }}>
      <AppNavbar subtitle="ขอถ่ายบัตรนอกสถานที่" />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[84px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-4">
          <Breadcrumb items={[{ label: "หน้าหลัก", to: "/" }, { label: "งานทะเบียนและบัตร", to: "/registration" }, { label: "ขอถ่ายบัตรนอกสถานที่" }]} />
          <h1 className="text-[18px] font-bold mt-2" style={{ color: "#1A1A1A" }}>ขอถ่ายบัตรนอกสถานที่</h1>
          <div className="flex gap-2 mt-3">
            <button onClick={() => setTab("new")} className={`text-[12px] px-4 py-1.5 rounded-full border transition ${tab === "new" ? "bg-[#0a0a54] text-white border-[#0a0a54]" : "bg-white border-slate-200"}`} style={tab !== "new" ? { color: "#8E95A5" } as any : {}}>ยื่นคำร้อง</button>
            <button onClick={() => setTab("mine")} className={`text-[12px] px-4 py-1.5 rounded-full border transition ${tab === "mine" ? "bg-[#0a0a54] text-white border-[#0a0a54]" : "bg-white border-slate-200"}`} style={tab !== "mine" ? { color: "#8E95A5" } as any : {}}>คำร้องของฉัน {mine.length ? `(${mine.length})` : ""}</button>
          </div>
          <p className="text-[12px] mt-3 p-3 rounded-xl bg-[#FFF7E0] border border-amber-100 leading-relaxed" style={{ color: "#92400e" }}>สำหรับผู้เคลื่อนย้ายไม่ได้ — ผู้ป่วยติดเตียง · คนชรา · ผู้พิการ ที่เดินทางมาอำเภอไม่ได้ — ญาติ ผู้ดูแล กำนัน/ผู้ใหญ่บ้าน หรือ อสม. ยื่นแทนได้</p>
        </div>

        {tab === "mine" ? (
          <div className="px-4 lg:px-6 pt-6">
            {loadingMine ? <div className="text-center py-8 text-[12px]" style={{color:"#8E95A5"}}>กำลังโหลด...</div> : mine.length === 0 ? (
              <div className="bg-white rounded-[16px] border border-slate-100 p-8 text-center" style={{ boxShadow: "0px 10px 25px rgba(0,0,0,0.05)" }}>
                <div className="w-12 h-12 rounded-full bg-[#F7F8FC] flex items-center justify-center mx-auto text-[#8E95A5]">—</div>
                <div className="text-[13px] mt-3" style={{ color: "#8E95A5" }}>ยังไม่มีคำร้อง</div>
                <div className="text-[11px] mt-1" style={{ color: "#8E95A5" }}>ยื่นคำร้องใหม่เพื่อขอเจ้าหน้าที่ออกไปถ่ายบัตรนอกสถานที่</div>
                <button onClick={() => setTab("new")} className="mt-4 px-5 py-2 rounded-full text-white text-[12px] font-medium" style={{ background: "#0a0a54" }}>ยื่นคำร้องใหม่</button>
              </div>
            ) : (
              <div className="space-y-3">
                {mine.map((r:any, i:number)=>(
                  <div key={r.id ?? i} className="bg-white rounded-[16px] border border-slate-100 p-4" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[12px] font-semibold truncate" style={{color:"#1A1A1A"}}>{r.applicant_name ?? r.applicantName ?? r.name} · เลข {r.applicant_id_card ?? r.applicantId ?? "-"}</span>
                      <span className={`text-[11px] px-2 py-1 rounded-full border whitespace-nowrap ${r.status==="รอดำเนินการ"?"bg-[#FFF7E0] border-amber-100 text-[#92400e]":"bg-[#F0FDF6] border-emerald-100 text-[#065f46]"}`}>{r.status ?? "รอดำเนินการ"}</span>
                    </div>
                    <div className="text-[11px] mt-1" style={{color:"#8E95A5"}}>{r.app_tambon ?? r.appTambon ?? r.tambon} · บ้านเลขที่ {r.app_house_no ?? r.appHouseNo ?? r.house_no ?? "-"} · {r.condition_type ?? r.conditionType ?? "-"} · {new Date(r.created_at).toLocaleDateString("th-TH")}</div>
                    <div className="text-[12px] mt-2 leading-snug line-clamp-2" style={{color:"#1A1A1A"}}>{r.reason_detail ?? r.reasonDetail ?? ""} {r.note ?? ""}</div>
                    <div className="text-[11px] mt-2" style={{color:"#8E95A5"}}>ผู้แจ้ง: {r.name} ({r.relation}) โทร {r.phone}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="px-4 lg:px-6 pt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden"><div className="h-full bg-[#0a0a54] transition-all" style={{ width: `${step / 5 * 100}%` }} /></div>
              <span className="text-[11px] whitespace-nowrap" style={{ color: "#8E95A5" }}>ขั้นที่ {step} จาก 5</span>
            </div>

            {step === 1 && (
              <div className="bg-white rounded-[16px] border border-slate-100 p-4 space-y-4" style={{ boxShadow: "0px 10px 25px rgba(0,0,0,0.05)" }}>
                <div className="text-[13px] font-semibold" style={{ color: "#1A1A1A" }}>1. ข้อมูลผู้แจ้ง (ผู้ยื่นแทน)</div>
                {[
                  { k: "name", l: "ชื่อ – นามสกุล *", ph: "ชื่อผู้แจ้ง" },
                  { k: "id", l: "เลขประจำตัว 13 หลัก", ph: "เลขบัตรผู้แจ้ง (ถ้ามี)" },
                  { k: "phone", l: "เบอร์โทรศัพท์ *", ph: "0xx-xxx-xxxx" },
                  { k: "relation", l: "ความสัมพันธ์กับผู้ขอทำบัตร *", ph: "เช่น บุตร คู่สมรส ผู้ดูแล ผู้ใหญ่บ้าน" },
                ].map(f => (
                  <div key={f.k}><div className="text-[12px] font-medium" style={{ color: "#1A1A1A" }}><ReqLabel t={f.l} /></div><input value={(form as any)[f.k]} onChange={e => set(f.k, e.target.value)} placeholder={f.ph} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54] placeholder:text-[#8E95A5]" /></div>
                ))}
                <div className="text-[13px] font-semibold pt-2" style={{ color: "#1A1A1A" }}>ที่อยู่ผู้แจ้ง</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[12px] font-medium" style={{ color: "#1A1A1A" }}><ReqLabel t="ตำบล *" /></div>
                    <select value={form.tambon} onChange={e => set("tambon", e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54]">
                      <option value="">เลือกตำบล</option>
                      {TAMBONS.map(t=> <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  {[
                    { k: "moo", l: "หมู่ที่" },
                    { k: "houseNo", l: "บ้านเลขที่" },
                    { k: "village", l: "หมู่บ้าน" },
                    { k: "road", l: "ถนน" },
                    { k: "soi", l: "ตรอก/ซอย" },
                  ].map(f => (
                    <div key={f.k}><div className="text-[12px] font-medium" style={{ color: "#1A1A1A" }}><ReqLabel t={f.l} /></div><input value={(form as any)[f.k]} onChange={e => set(f.k, e.target.value)} placeholder={f.l} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54]" /></div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><div className="text-[12px] font-medium" style={{ color: "#1A1A1A" }}>อำเภอ</div><input defaultValue="บ้านบึง" disabled className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[13px]" /></div>
                  <div><div className="text-[12px] font-medium" style={{ color: "#1A1A1A" }}>จังหวัด</div><input defaultValue="ชลบุรี" disabled className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[13px]" /></div>
                </div>
                <button disabled={!canNext1} onClick={() => canNext1 && setStep(2)} className={`w-full py-3 rounded-full font-semibold text-[13px] transition ${canNext1 ? "bg-[#0a0a54] text-white hover:bg-[#07073e]" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>ถัดไป ›</button>
                {!canNext1 && <div className="text-[11px] text-center" style={{ color: "#8E95A5" }}>กรอกชื่อ เบอร์โทร ความสัมพันธ์ และตำบลให้ครบ</div>}
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-[16px] border border-slate-100 p-4 space-y-4" style={{ boxShadow: "0px 10px 25px rgba(0,0,0,0.05)" }}>
                <div className="text-[13px] font-semibold" style={{ color: "#1A1A1A" }}>2. ข้อมูลผู้ขอทำบัตร <span className="text-[11px] font-normal" style={{color:"#8E95A5"}}>ผู้ป่วย/ผู้สูงอายุที่ต้องการถ่ายบัตร</span></div>
                <div><div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}><ReqLabel t="ชื่อ–นามสกุล ผู้ขอทำบัตร *" /></div><input value={form.applicantName} onChange={e=>set("applicantName", e.target.value)} placeholder="ชื่อผู้ป่วยตามทะเบียนบ้าน" className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54]" /></div>
                <div><div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}><ReqLabel t="เลขประจำตัว 13 หลัก *" /></div><input value={form.applicantId} onChange={e=>set("applicantId", e.target.value.replace(/\D/g,"").slice(0,13))} placeholder="xxxxxxxxxxxxx" maxLength={13} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54]" /><div className="text-[11px] mt-1" style={{color: form.applicantId.length===13 || form.applicantId.length===0 ? "#8E95A5":"#EF4444"}}>{form.applicantId.length}/13 หลัก</div></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}><ReqLabel t="วันเกิด *" /></div><input type="date" value={form.applicantBirthdate} onChange={e=>set("applicantBirthdate", e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54]" /></div>
                  <div><div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}>เพศ</div><select value={form.applicantGender} onChange={e=>set("applicantGender", e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54]"><option value="">เลือก</option><option value="ชาย">ชาย</option><option value="หญิง">หญิง</option><option value="อื่นๆ">อื่นๆ</option></select></div>
                </div>
                <div><div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}>เบอร์ติดต่อผู้ขอ (ถ้ามี)</div><input value={form.applicantPhone} onChange={e=>set("applicantPhone", e.target.value)} placeholder="เบอร์ผู้ขอหรือญาติใกล้ชิด" className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54]" /></div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-full border border-slate-200 bg-white text-[13px]">ย้อนกลับ</button>
                  <button disabled={!canNext2} onClick={() => canNext2 && setStep(3)} className={`flex-1 py-3 rounded-full font-semibold text-[13px] transition ${canNext2 ? "bg-[#0a0a54] text-white hover:bg-[#07073e]" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>ถัดไป ›</button>
                </div>
                {!canNext2 && <div className="text-[11px] text-center" style={{color:"#8E95A5"}}>กรอกชื่อ เลข 13 หลัก และวันเกิดให้ครบ</div>}
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-[16px] border border-slate-100 p-4 space-y-4" style={{ boxShadow: "0px 10px 25px rgba(0,0,0,0.05)" }}>
                <div className="text-[13px] font-semibold" style={{ color: "#1A1A1A" }}>3. ที่อยู่ผู้ขอ (จุดที่ให้เจ้าหน้าที่ไปถ่ายบัตร)</div>
                <label className="flex items-center gap-2 text-[12px] p-2.5 rounded-xl bg-[#F7F8FC] border border-slate-100 cursor-pointer"><input type="checkbox" checked={same} onChange={e=>toggleSame(e.target.checked)} className="accent-[#0a0a54]" /> ที่อยู่เดียวกับผู้แจ้ง</label>
                {same && <div className="text-[11px] p-2.5 rounded-xl bg-[#F0FDF6] border border-emerald-100 leading-relaxed" style={{color:"#065f46"}}>คัดลอกจากที่อยู่ผู้แจ้งแล้ว: ต.{form.tambon||"-"} ม.{form.moo||"-"} บ้านเลขที่ {form.houseNo||"-"} {form.village} {form.road} {form.soi}</div>}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[12px] font-medium" style={{ color: "#1A1A1A" }}><ReqLabel t="ตำบล *" /></div>
                    <select value={effAppTambon} onChange={e => set("appTambon", e.target.value)} disabled={same} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54] disabled:bg-slate-50 disabled:text-slate-700">
                      <option value="">เลือกตำบล</option>
                      {TAMBONS.map(t=> <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  {[
                    { k: "appMoo", l: "หมู่ที่", v: effAppMoo },
                    { k: "appHouseNo", l: "บ้านเลขที่ *", v: effAppHouseNo },
                    { k: "appVillage", l: "หมู่บ้าน", v: effAppVillage },
                    { k: "appRoad", l: "ถนน", v: effAppRoad },
                    { k: "appSoi", l: "ตรอก/ซอย", v: effAppSoi },
                  ].map(f => (
                    <div key={f.k}><div className="text-[12px] font-medium" style={{ color: "#1A1A1A" }}><ReqLabel t={f.l} /></div><input value={f.v} onChange={e => set(f.k, e.target.value)} disabled={same} placeholder={f.l.replace(" *","")} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54] disabled:bg-slate-50 disabled:text-slate-700" /></div>
                  ))}
                </div>
                <div><div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}>จุดสังเกต / ทางเข้า / เบอร์ติดต่อหน้างาน</div><input value={form.landmark} onChange={e=>set("landmark", e.target.value)} placeholder="เช่น ซอยข้างวัด บ้านไม้สองชั้น โทร 08x-xxx-xxxx" className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54]" /></div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-full border border-slate-200 bg-white text-[13px]">ย้อนกลับ</button>
                  <button disabled={!canNext3} onClick={() => canNext3 && setStep(4)} className={`flex-1 py-3 rounded-full font-semibold text-[13px] transition ${canNext3 ? "bg-[#0a0a54] text-white hover:bg-[#07073e]" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>ถัดไป ›</button>
                </div>
                {!canNext3 && <div className="text-[11px] text-center" style={{color:"#8E95A5"}}>เลือกตำบลและบ้านเลขที่ของผู้ขอ</div>}
              </div>
            )}

            {step === 4 && (
              <div className="bg-white rounded-[16px] border border-slate-100 p-4 space-y-4" style={{ boxShadow: "0px 10px 25px rgba(0,0,0,0.05)" }}>
                <div className="text-[13px] font-semibold" style={{ color: "#1A1A1A" }}>4. เหตุผลและความจำเป็น</div>
                <div>
                  <div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}><ReqLabel t="สภาพผู้ขอ *" /></div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {[
                      {v:"ผู้ป่วยติดเตียง", Icon:HiOutlineHeart},
                      {v:"ผู้สูงอายุเดินทางลำบาก", Icon:HiOutlineUser},
                      {v:"ผู้พิการ", Icon:HiOutlineShieldCheck},
                      {v:"อื่นๆ", Icon:HiOutlineDocumentText},
                    ].map(({v, Icon})=>(
                      <button key={v} onClick={()=>set("conditionType", v)} className={`p-3 rounded-xl border text-[12px] font-medium flex items-center gap-2 text-left transition ${form.conditionType===v ? "bg-[#0a0a54] text-white border-[#0a0a54]" : "bg-white border-slate-200 hover:border-[#0a0a54]/30"}`} style={form.conditionType!==v?{color:"#1A1A1A"}as any:{}}><Icon className="text-[18px] shrink-0" />{v}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}><ReqLabel t="ความเร่งด่วน *" /></div>
                  <div className="flex gap-2 mt-2">
                    {[
                      {v:"เร่งด่วน", sub:"ต้องใช้บัตรทันที"},
                      {v:"ภายในสัปดาห์นี้", sub:"มีนัดสำคัญ"},
                      {v:"ตามคิว", sub:"รอคิวปกติ"},
                    ].map(o=>(
                      <button key={o.v} onClick={()=>set("urgency", o.v)} className={`flex-1 p-2.5 rounded-xl border text-center transition ${form.urgency===o.v ? "bg-[#FFF7E0] border-amber-300 text-[#92400e]" : "bg-white border-slate-200"}`}>
                        <div className="text-[12px] font-semibold">{o.v}</div><div className="text-[10px]" style={{color:"#8E95A5"}}>{o.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}><ReqLabel t="เอกสารพร้อม *" /></div>
                  <div className="flex gap-2 mt-2">
                    {[
                      {v:"มีเอกสารครบ", desc:"ทะเบียนบ้าน + บัตรเดิม/ใบแจ้งความ"},
                      {v:"ไม่ครบ", desc:"จะเตรียมเพิ่ม"},
                    ].map(o=>(
                      <button key={o.v} onClick={()=>set("docReady", o.v)} className={`flex-1 py-2.5 rounded-xl border text-[12px] font-medium transition ${form.docReady===o.v ? "bg-[#F0FDF6] border-emerald-300 text-[#065f46]" : "bg-white border-slate-200"}`} style={form.docReady!==o.v?{color:"#1A1A1A"}as any:{}}>{o.v}<div className="text-[10px] font-normal" style={{color:"#8E95A5"}}>{o.desc}</div></button>
                    ))}
                  </div>
                </div>
                <div><div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}>รายละเอียดเหตุผล <span className="font-normal" style={{color:"#8E95A5"}}>(เช่น ป่วยติดเตียง 3 เดือน เดินไม่ได้ ต้องใช้บัตรเบิกสิทธิ์)</span></div><textarea value={form.reasonDetail} onChange={e=>set("reasonDetail", e.target.value)} placeholder="อธิบายสั้นๆ เพื่อให้เจ้าหน้าที่จัดลำดับ" rows={3} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54] resize-none" /></div>
                <div><div className="text-[12px] font-medium" style={{color:"#1A1A1A"}}>หมายเหตุเพิ่มเติม</div><input value={form.note} onChange={e=>set("note", e.target.value)} placeholder="เวลาสะดวกให้เข้าพบ, ผู้ประสานงาน ฯลฯ" className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54]" /></div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-full border border-slate-200 bg-white text-[13px]">ย้อนกลับ</button>
                  <button disabled={!canNext4} onClick={() => canNext4 && setStep(5)} className={`flex-1 py-3 rounded-full font-semibold text-[13px] transition ${canNext4 ? "bg-[#0a0a54] text-white hover:bg-[#07073e]" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>ถัดไป ›</button>
                </div>
                {!canNext4 && <div className="text-[11px] text-center" style={{color:"#8E95A5"}}>เลือกสภาพ ความเร่งด่วน และความพร้อมเอกสาร</div>}
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <div className="bg-white rounded-[16px] border border-slate-100 p-4 space-y-3" style={{ boxShadow: "0px 10px 25px rgba(0,0,0,0.05)" }}>
                  <div className="text-[13px] font-semibold" style={{ color: "#1A1A1A" }}>5. ตรวจสอบและยืนยัน</div>
                  <div className="space-y-2 text-[12px] leading-relaxed">
                    <div className="p-3 rounded-xl bg-[#F7F8FC] border border-slate-100">
                      <div className="font-semibold flex justify-between" style={{color:"#1A1A1A"}}>ผู้แจ้ง <button onClick={()=>setStep(1)} className="text-[11px] font-normal" style={{color:"#0a0a54"}}>แก้ไข ›</button></div>
                      <div style={{color:"#1A1A1A"}}>{form.name} · {form.phone} · {form.relation} · ต.{form.tambon} ม.{form.moo||"-"} บ้านเลขที่ {form.houseNo||"-"}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F7F8FC] border border-slate-100">
                      <div className="font-semibold flex justify-between" style={{color:"#1A1A1A"}}>ผู้ขอ <button onClick={()=>setStep(2)} className="text-[11px] font-normal" style={{color:"#0a0a54"}}>แก้ไข ›</button></div>
                      <div style={{color:"#1A1A1A"}}>{form.applicantName} · {form.applicantId} · เกิด {form.applicantBirthdate||"-"} {form.applicantGender} · โทร {form.applicantPhone||"-"}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F7F8FC] border border-slate-100">
                      <div className="font-semibold flex justify-between" style={{color:"#1A1A1A"}}>ที่อยู่ถ่ายบัตร <button onClick={()=>setStep(3)} className="text-[11px] font-normal" style={{color:"#0a0a54"}}>แก้ไข ›</button></div>
                      <div style={{color:"#1A1A1A"}}>ต.{effAppTambon} ม.{effAppMoo||"-"} บ้านเลขที่ {effAppHouseNo} {effAppVillage} {form.landmark && `· ${form.landmark}`}{same && <span style={{color:"#065f46"}}> (ที่เดียวกับผู้แจ้ง)</span>}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FFF7E0] border border-amber-100">
                      <div className="font-semibold flex justify-between" style={{color:"#92400e"}}>เหตุผล <button onClick={()=>setStep(4)} className="text-[11px] font-normal" style={{color:"#0a0a54"}}>แก้ไข ›</button></div>
                      <div style={{color:"#1A1A1A"}}>{form.conditionType} · {form.urgency} · {form.docReady}</div>
                      {form.reasonDetail && <div style={{color:"#8E95A5"}} className="mt-1">“{form.reasonDetail}”</div>}
                      {form.note && <div style={{color:"#8E95A5"}}>หมายเหตุ: {form.note}</div>}
                    </div>
                  </div>
                  <label className="flex gap-2 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer">
                    <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} className="mt-0.5 accent-[#0a0a54]" />
                    <span className="text-[11px] leading-relaxed" style={{color:"#1A1A1A"}}>ข้าพเจ้ายินยอมให้เจ้าหน้าที่ใช้ข้อมูลนี้เพื่อจัดคิวถ่ายบัตรนอกสถานที่ และรับทราบว่าต้องเตรียมเอกสาร (ทะเบียนบ้าน บัตรเดิม/ใบแจ้งความหาย) และจัดสถานที่ให้ผู้ขอพร้อมถ่ายรูปในวันนัด</span>
                  </label>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(4)} className="flex-1 py-3 rounded-full border border-slate-200 bg-white text-[13px]">ย้อนกลับ</button>
                  <button onClick={handleSubmit} disabled={sending || !consent} className={`flex-1 py-3 rounded-full text-[13px] font-semibold transition ${sending || !consent ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-[#00C875] text-white hover:bg-[#00a86a]"}`}>{sending ? "กำลังส่ง..." : "ยืนยันส่งคำร้อง"}</button>
                </div>
                <div className="text-[11px] text-center leading-relaxed" style={{color:"#8E95A5"}}>ส่งแล้วเจ้าหน้าที่จะติดต่อกลับทางโทรศัพท์/แชต LINE ภายใน 1-3 วันทำการ · ติดต่อ 038-446202</div>
              </div>
            )}

          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
