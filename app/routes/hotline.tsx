import type { Route } from "./+types/hotline";
import { useEffect, useRef, useState } from "react";
import { HiOutlinePhone, HiOutlineMapPin, HiOutlineSignal } from "react-icons/hi2";
import { HiOutlinePhoneArrowUpRight } from "react-icons/hi2";
import { AppNavbar, BottomNav } from "../components/Navbar";

export function meta({}: Route.MetaArgs) {
  return [{ title: "สายด่วน - BANBUENG SMART" }];
}

const groups = [
  { title:"ฉุกเฉิน", items:[
    { name:"แจ้งเหตุฉุกเฉิน", tel:"191", desc:"ตำรวจ", color:"#FF4D4D" },
    { name:"กู้ชีพ - กู้ภัย", tel:"1669", desc:"เจ็บป่วยฉุกเฉิน", color:"#FF6B2C" },
    { name:"ดับเพลิง", tel:"199", desc:"เพลิงไหม้", color:"#FF4D4D" },
  ]},
  { title:"อำเภอบ้านบึง", items:[
    { name:"ที่ว่าการอำเภอบ้านบึง", tel:"038-443020", desc:"จันทร์-ศุกร์ 08:30-16:30", color:"#0a0a54" },
    { name:"สำนักทะเบียนอำเภอบ้านบึง", tel:"038-446202", desc:"จองคิวออนไลน์", color:"#0a0a54" },
    { name:"ศูนย์ดำรงธรรม", tel:"1567", desc:"ร้องเรียน ร้องทุกข์", color:"#00C875" },
  ]},
];

type Loc = { lat:number; lng:number; accuracy:number; timestamp:number };

export default function Hotline() {
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState<Loc | null>(null);
  const [status, setStatus] = useState<"idle"|"asking"|"watching"|"error"|"denied">("idle");
  const [error, setError] = useState("");
  const watchId = useRef<number | null>(null);
  const query = q.toLowerCase();
  useEffect(()=>{
    try {
      const raw = localStorage.getItem("banbueng_location");
      if (raw) { const p = JSON.parse(raw) as Loc; setLoc(p); setStatus("watching"); }
    } catch {}
    return ()=>{ if (watchId.current!==null) navigator.geolocation.clearWatch(watchId.current); };
  },[]);
  const save = (p: Loc) => { setLoc(p); localStorage.setItem("banbueng_location", JSON.stringify(p)); localStorage.setItem("banbueng_location_updated", String(Date.now())); };
  const start = () => {
    if (!navigator.geolocation) { setError("อุปกรณ์ไม่รองรับการระบุตำแหน่ง"); setStatus("error"); return; }
    setStatus("asking"); setError("");
    navigator.geolocation.getCurrentPosition((pos)=>{
        const p: Loc = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy, timestamp: Date.now() };
        save(p); setStatus("watching");
        watchId.current = navigator.geolocation.watchPosition((pos2)=>{
            const qq: Loc = { lat: pos2.coords.latitude, lng: pos2.coords.longitude, accuracy: pos2.coords.accuracy, timestamp: Date.now() };
            save(qq);
          }, (e)=>{ setError(e.message); setStatus("error"); }, { enableHighAccuracy:true, maximumAge:5000, timeout:10000 });
      }, (e)=>{ if (e.code===1) { setStatus("denied"); setError("ถูกปฏิเสธการเข้าถึงตำแหน่ง กรุณาเปิดสิทธิ์ในตั้งค่าเบราว์เซอร์"); } else { setStatus("error"); setError(e.message); } }, { enableHighAccuracy:true, timeout:10000, maximumAge:0 });
  };
  const stop = () => { if (watchId.current!==null) { navigator.geolocation.clearWatch(watchId.current); watchId.current=null; } localStorage.removeItem("banbueng_location"); localStorage.removeItem("banbueng_location_updated"); setLoc(null); setStatus("idle"); setError(""); };
  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="สายด่วน • อำเภอบ้านบึง" q={q} setQ={setQ} placeholder="ค้นหาเบอร์..." />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[88px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-5">
          <h1 className="text-[18px] font-bold" style={{color:"#1A1A1A"}}>สายด่วน</h1>
          <p className="text-[12px] mt-1" style={{color:"#8E95A5"}}>ติดต่อเจ้าหน้าที่ได้ทุกวัน แตะเพื่อโทรทันที</p>
          <a href="tel:191" className="mt-4 flex items-center justify-center gap-2 rounded-[16px] py-3.5 text-white font-semibold" style={{background:"#FF4D4D", boxShadow:"0px 10px 25px rgba(255,77,77,0.25)"}}><HiOutlinePhone className="text-[18px]" /> โทรฉุกเฉิน 191</a>
        </div>
        <div className="px-4 lg:px-6 pt-6 space-y-6">
          {q && <div className="text-[12px] px-1" style={{color:"#8E95A5"}}>ค้นหา "{q}"</div>}
          {groups.map(g=>{
            const items = g.items.filter(it=> !query || (it.name+it.desc+it.tel).toLowerCase().includes(query));
            if (items.length===0) return null;
            return (
            <div key={g.title} className="space-y-3">
              <div className="text-[12px] font-semibold px-1" style={{color:"#1A1A1A"}}>{g.title}</div>
              <div className="grid grid-cols-1 gap-3">
                {items.map(it=>(
                  <a key={it.tel} href={`tel:${it.tel}`} className="bg-white rounded-[16px] border border-slate-100 p-4 flex items-center gap-3.5" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{background:it.color}}><HiOutlinePhone className="text-[18px]" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold" style={{color:"#1A1A1A"}}>{it.name}</div>
                      <div className="text-[11px]" style={{color:"#8E95A5"}}>{it.desc} • {it.tel}</div>
                    </div>
                    <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:"#F7F8FC", color:"#0a0a54"}}><HiOutlinePhoneArrowUpRight className="text-[16px]" /></span>
                  </a>
                ))}
              </div>
            </div>
          )})}
          <div className="bg-white rounded-[16px] border border-slate-100 p-4" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{background: status==="watching" ? "#00C875" : "#0a0a54"}}><HiOutlineMapPin className="text-[18px]" /></div>
                <div>
                  <div className="text-[13px] font-semibold" style={{color:"#1A1A1A"}}>แชร์พิกัดฉุกเฉิน</div>
                  <div className="text-[11px]" style={{color:"#8E95A5"}}>{status==="watching" ? "ติดตามแบบเรียลไทม์ • บันทึกในเครื่องแล้ว" : "ส่งตำแหน่งให้เจ้าหน้าที่ทันที"}</div>
                </div>
              </div>
              {status!=="watching" ? <button onClick={start} disabled={status==="asking"} className="text-[12px] font-semibold px-4 py-2 rounded-full text-white disabled:opacity-50" style={{background:"#0a0a54"}}>{status==="asking" ? "กำลังขอสิทธิ์..." : "แชร์ตำแหน่ง"}</button> : <button onClick={stop} className="text-[12px] font-semibold px-4 py-2 rounded-full border border-red-100 bg-red-50" style={{color:"#FF4D4D"}}>หยุดแชร์</button>}
            </div>
            {status==="watching" && loc && (
              <div className="mt-4 rounded-xl p-3 border border-emerald-100" style={{background:"#F0FDF6"}}>
                <div className="flex items-center gap-1.5 text-[11px] font-medium" style={{color:"#00C875"}}><HiOutlineSignal /> เรียลไทม์ • อัปเดตทุก ~5 วินาที</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white rounded-lg p-2 border border-slate-100"><div style={{color:"#8E95A5"}}>ละติจูด</div><div className="font-mono font-semibold" style={{color:"#1A1A1A"}}>{loc.lat.toFixed(6)}</div></div>
                  <div className="bg-white rounded-lg p-2 border border-slate-100"><div style={{color:"#8E95A5"}}>ลองจิจูด</div><div className="font-mono font-semibold" style={{color:"#1A1A1A"}}>{loc.lng.toFixed(6)}</div></div>
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px]" style={{color:"#8E95A5"}}><span>ความแม่นยำ ±{Math.round(loc.accuracy)} ม.</span><span>{new Date(loc.timestamp).toLocaleTimeString("th-TH")}</span></div>
                <div className="flex gap-2 mt-3">
                  <a href={`https://www.google.com/maps?q=${loc.lat},${loc.lng}`} target="_blank" rel="noreferrer" className="flex-1 text-center text-[12px] font-medium py-2 rounded-full bg-white border border-slate-200" style={{color:"#0a0a54"}}>เปิดใน Maps</a>
                  <button onClick={()=>{navigator.clipboard.writeText(`${loc.lat},${loc.lng}`)}} className="flex-1 text-[12px] font-medium py-2 rounded-full text-white" style={{background:"#0a0a54"}}>คัดลอกพิกัด</button>
                </div>
                <div className="text-[10px] mt-2 text-center" style={{color:"#8E95A5"}}>เก็บใน localStorage: banbueng_location • ลบเมื่อหยุดแชร์</div>
              </div>
            )}
            {error && <div className="mt-3 text-[12px] rounded-xl p-3 border border-red-100 bg-red-50" style={{color:"#FF4D4D"}}>{error}</div>}
            {status==="denied" && <div className="mt-3 text-[11px]" style={{color:"#8E95A5"}}>ไปที่ ตั้งค่าเบราว์เซอร์ → สิทธิ์เข้าถึงตำแหน่ง → อนุญาตสำหรับไซต์นี้ แล้วลองใหม่</div>}
            {loc && status!=="watching" && <div className="mt-3 text-[11px] p-2 rounded-lg bg-[#F7F8FC] border border-slate-100" style={{color:"#8E95A5"}}>พิกัดล่าสุดที่บันทึก: {loc.lat.toFixed(5)}, {loc.lng.toFixed(5)} • {new Date(loc.timestamp).toLocaleString("th-TH")}</div>}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
