import type { Route } from "./+types/podcast";
import { useState, useMemo } from "react";
import { AppNavbar, BottomNav } from "../components/Navbar";
import { Breadcrumb } from "../components/Breadcrumb";
export function meta({}: Route.MetaArgs){ return [{title: "พอตแคสต์ความรู้กฎหมาย - BANBUENG SMART"}]; }

type Ep = { id:string; title:string; series:"กฎหมาย 5 นาที"|"กฎหมายง่ายจัง"; url:string };

const eps: Ep[] = [
  { id:"5-1", title:"EP.1 รับจ้างเปิดบัญชีม้า เปิดบัตร เปิดเบอร์ เปิดแอพ", series:"กฎหมาย 5 นาที", url:"https://justicechannel.org/listen/ep-1-fake-bank-account" },
  { id:"5-2", title:"EP.2 ซื้อสลากกินแบ่งรัฐบาลก่อนจดทะเบียนสมรส และถูกรางวัลหลังจดทะเบียน เงินเป็นของใคร?", series:"กฎหมาย 5 นาที", url:"https://justicechannel.org/listen/ep-2-marriage-lottery" },
  { id:"5-3", title:"EP.3 ผู้เสียหายเป็นเด็กหรือผู้เยาว์ ใครบ้างที่จะสามารถดำเนินการแทนได้?", series:"กฎหมาย 5 นาที", url:"https://justicechannel.org/listen/ep-3-child-sufferer" },
  { id:"5-4", title:"EP.4 โดนทวงค่างวดรถแบบไหน ไฟแนนซ์ยึดรถไม่ได้?", series:"กฎหมาย 5 นาที", url:"https://justicechannel.org/listen/ep-4-confiscate-the-car" },
  { id:"5-5", title:"EP.5 พูดแค่ไหน.. พูดอย่างไรผิดกฎหมายหมิ่นประมาท?", series:"กฎหมาย 5 นาที", url:"https://justicechannel.org/listen/ep-4-defame" },
  { id:"5-6", title:"EP.6 แบบไหนเรียกว่า..หมิ่นประมาทบนโซเชียล?", series:"กฎหมาย 5 นาที", url:"https://justicechannel.org/listen/ep-6-social-defame" },
  { id:"5-7", title:"EP.7 ระยะเวลาการบังคับคดี กี่ปี และนับอย่างไร?", series:"กฎหมาย 5 นาที", url:"https://justicechannel.org/listen/ep-7-compulsory-execution" },
  { id:"5-8", title:"EP.8 เมื่อผิดนัดชำระบัตรเครดิต", series:"กฎหมาย 5 นาที", url:"https://justicechannel.org/listen/ep-8-credit-card-payment" },
  { id:"5-9", title:"EP.9 พยานหลักฐานทางคดีแพ่ง และคดีอาญา", series:"กฎหมาย 5 นาที", url:"https://justicechannel.org/listen/ep-9-evidence" },
  { id:"5-10", title:"EP.10 การไกล่เกลี่ย คดีอาญา", series:"กฎหมาย 5 นาที", url:"https://justicechannel.org/listen/ep-10-mediation-criminal" },
  { id:"easy-1", title:"EP.1 ตัดกิ่งไม้", series:"กฎหมายง่ายจัง", url:"https://soundcloud.com/user-167217831/1-1" },
  { id:"easy-2", title:"EP.2 ที่ดินตาบอด", series:"กฎหมายง่ายจัง", url:"https://soundcloud.com/user-167217831/2-1" },
  { id:"easy-3", title:"EP.3 เรื่องของหมาต้องเกี่ยว", series:"กฎหมายง่ายจัง", url:"https://soundcloud.com/user-167217831/3-1" },
  { id:"easy-4", title:"EP.4 กระบวนความทางอาญา", series:"กฎหมายง่ายจัง", url:"https://soundcloud.com/user-167217831/4-1" },
  { id:"easy-5", title:"EP.5 ค้ำประกัน", series:"กฎหมายง่ายจัง", url:"https://soundcloud.com/user-167217831/5-1" },
  { id:"easy-6", title:"EP.6 พรุ่งนี้รวย", series:"กฎหมายง่ายจัง", url:"https://soundcloud.com/user-167217831/6-1" },
  { id:"easy-7", title:"EP.7 ลุงไม่เข้าใจ ทำไมแก้ผ้าไม่ได้ละหนู", series:"กฎหมายง่ายจัง", url:"https://soundcloud.com/user-167217831/7-1" },
  { id:"easy-15", title:"EP.15 หยาบคายกับเจ้าหน้าที่", series:"กฎหมายง่ายจัง", url:"https://soundcloud.com/user-167217831/15-2" },
  { id:"easy-20", title:"EP.20 ใส่ชุดไทยก็ถ่ายรูปบัตรประชาชนได้", series:"กฎหมายง่ายจัง", url:"https://soundcloud.com/user-167217831/20-1" },
  { id:"easy-40", title:"EP.40 โรงรับจำนำดอกเบี้ยแพงจัง", series:"กฎหมายง่ายจัง", url:"https://soundcloud.com/user-167217831/40-2" },
  { id:"easy-45", title:"EP.45 งดเหล้าเข้าพรรษา", series:"กฎหมายง่ายจัง", url:"https://soundcloud.com/user-167217831/45-2" },
];

export default function Page(){
  const [q,setQ]=useState("");
  const [series,setSeries]=useState("ทุกซีรีส์");
  const filtered = useMemo(()=>{
    return eps.filter(e=>{
      const bySeries = series==="ทุกซีรีส์" || e.series===series;
      const byQ = !q || e.title.toLowerCase().includes(q.toLowerCase());
      return bySeries && byQ;
    });
  },[q,series]);
  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="พอตแคสต์ความรู้กฎหมาย" q={q} setQ={setQ} placeholder="ค้นหาตอน เช่น มรดก, ค้ำประกัน หรือเลขตอน" />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[84px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-4">
          <Breadcrumb items={[{label:"หน้าหลัก", to:"/"}, {label:"พอตแคสต์"}]} />
          <h1 className="text-[18px] font-bold mt-2" style={{color:"#1A1A1A"}}>กฎหมายง่ายจัง</h1>
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {["ทุกซีรีส์","กฎหมายง่ายจัง","กฎหมาย 5 นาที"].map(s=>(
              <button key={s} onClick={()=>setSeries(s)} className={`text-[12px] px-3.5 py-1.5 rounded-full border whitespace-nowrap ${series===s ? "bg-[#0a0a54] text-white border-[#0a0a54]" : "bg-white border-slate-100 hover:border-[#0a0a54]/20"}`} style={series!==s ? {color:"#1A1A1A"} as any : {}}>{s}</button>
            ))}
          </div>
          <div className="text-[11px] mt-3" style={{color:"#8E95A5"}}>ทั้งหมด {filtered.length} ตอน {series!=="ทุกซีรีส์" ? "· "+series : ""} {q && `· ค้นหา "${q}"`}</div>
        </div>
        <div className="px-4 lg:px-6 pt-4 space-y-3">
          {filtered.map(e=>(
            <a key={e.id} href={e.url} target="_blank" rel="noreferrer" className="group bg-white rounded-[16px] border border-slate-100 p-4 flex items-center gap-3 hover:border-[#0a0a54]/30 hover:shadow-[0_12px_28px_rgba(10,10,84,0.12)] hover:-translate-y-[1px] transition-all duration-200" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
              <div className="w-10 h-10 rounded-xl bg-[#0a0a54] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">▶</div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium leading-snug" style={{color:"#1A1A1A"}}>{e.title}</div>
                <div className="text-[11px] mt-1" style={{color:"#8E95A5"}}>{e.series} · ฟัง ▶</div>
              </div>
              <span className="text-[11px] px-2 py-1 rounded-full bg-[#F7F8FC] border border-slate-100 shrink-0" style={{color:"#0a0a54"}}>ฟัง</span>
            </a>
          ))}
          {filtered.length===0 && <div className="text-center py-12 bg-white rounded-[16px] border border-slate-100" style={{color:"#8E95A5"}}>ไม่พบตอนที่ค้นหา</div>}
          <div className="text-[11px] text-center py-4 leading-relaxed" style={{color:"#8E95A5"}}>เนื้อหาโดย Justice Channel สำนักงานกิจการยุติธรรม — เปิดฟังที่เว็บไซต์ต้นทาง<br/>รวมกว่า 160 ตอน อัปเดตทุกสัปดาห์</div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
