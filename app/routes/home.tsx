import type { Route } from "./+types/home";
import { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { HiOutlineChevronRight, HiOutlineUser, HiOutlineCheckBadge } from "react-icons/hi2";
import { AppNavbar, BottomNav } from "../components/Navbar";
import ImageCarousel from "../components/ImageCarousel";
import { useI18n } from "../lib/i18n";
import { useLiff } from "../lib/liff";

export function meta({}: Route.MetaArgs) {
  return [{ title: "BANBUENG SMART - อำเภอบ้านบึง" }, { name: "description", content: "เชื่อมโยงบริการเป็นหนึ่งเดียว เพื่อชาวบ้านบึง" }];
}

function UserCard({ title, desc, icon, featured, accent, to, external }: { title:string; desc:string; icon:React.ReactNode; featured?:boolean; accent?: string; to?: string; external?:boolean }) {
  const { t } = useI18n();
  return (
    <a href={to || "#"} {...(external ? { target:"_blank", rel:"noopener noreferrer" } : {})} className={`group flex items-center gap-3.5 rounded-[16px] p-4 border transition-all duration-200 ${featured ? "bg-[#0a0a54] border-[#0a0a54] hover:bg-[#07073e]" : "bg-white border-slate-100 hover:border-[#0a0a54]/30 hover:shadow-[0_12px_28px_rgba(10,10,84,0.12)] hover:-translate-y-[2px]"}`} style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 ${featured ? "bg-white" : accent || "bg-[#F7F8FC]"}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div className={`text-[13px] font-semibold leading-tight ${featured ? "text-white" : "text-[#1A1A1A]"}`}>{t(title)} {external && <span className="ml-1 inline-flex align-middle text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{background:"#EEF2FF", color:"#0a0a54"}}>มท. ↗</span>}</div>
        <div className={`text-[11px] mt-0.5 line-clamp-1 ${featured ? "text-white/70" : "text-[#8E95A5]"}`}>{t(desc)}</div>
      </div>
      <HiOutlineChevronRight className={`text-[16px] shrink-0 ${featured ? "text-white/60" : "text-[#8E95A5] group-hover:text-[#0a0a54]"}`} />
    </a>
  );
}

function Section({ num, title, subtitle, children }: { num:string; title:string; subtitle?:string; children:React.ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <span className="text-[11px] font-semibold tracking-widest" style={{color:"#8E95A5"}}>{num}</span>
        <span className="h-px flex-1 bg-slate-100 hidden lg:block" />
        <span className="text-[13px] font-semibold" style={{color:"#1A1A1A"}}>{t(title)}</span>
        {subtitle && <span className="text-[11px]" style={{color:"#8E95A5"}}>— {t(subtitle)}</span>}
      </div>
      <div className="grid grid-cols-1 gap-3">{children}</div>
    </div>
  );
}

const F = (name:string) => <Icon icon={name} width={24} height={24} />;

const allItems = [
  { id:"house", title:"ลงทะเบียนครัวเรือนของฉัน", desc:"กรอกสมาชิก • ปักหมุดบ้าน • 5 นาทีเสร็จ", icon:F("reicon:home"), featured:true, accent:"", section:"top", to:"/evac/register" },
  { id:"complain", title:"ร้องเรียน • สอบถามเจ้าหน้าที่", desc:"ส่งเรื่องพร้อมภาพ ระบบนำส่งทันที", icon:F("reicon:chat"), featured:false, accent:"", section:"top", to:"/ask" },
  { id:"reg", title:"งานทะเบียนและบัตร", desc:"จองคิวออนไลน์ • ทะเบียนดิจิทัล", icon:F("reicon:address-card"), accent:"", section:"01", to:"/registration" },
  { id:"queue", title:"รับบัตรคิว สำนักทะเบียน", desc:"ทะเบียนราษฎร · ทะเบียนทั่วไป · บัตรประชาชน — บัตรคิวส่งเข้าไลน์ แจ้งเมื่อถึงคิว", icon:F("reicon:ticket"), accent:"", section:"01", to:"/queue" },
  { id:"card-out", title:"ขอทำบัตรนอกสถานที่", desc:"ผู้ป่วยติดเตียง ผู้สูงอายุ ผู้พิการ", icon:F("reicon:car"), accent:"", section:"01", to:"/registration/mobile-id" },
  { id:"faq", title:"ถามตอบงานทะเบียน", desc:"คำถามพบบ่อยจากเจ้าหน้าที่", icon:F("reicon:help-circle"), accent:"", section:"01", to:"/registration/qa" },
  { id:"damrong1", title:"ร้องเรียน • ร้องทุกข์", desc:"แนบภาพได้ • ติดตามสถานะ", icon:F("reicon:shield"), accent:"", section:"02", to:"/ask" },
  { id:"damrong-moi", title:"ร้องเรียน-ร้องทุกข์ ศูนย์ดำรงธรรม มท.", desc:"ยื่นเรื่องผ่านระบบศูนย์ดำรงธรรม กระทรวงมหาดไทย", icon:F("reicon:courthouse"), accent:"bg-[#FFF7ED]", section:"02", to:"https://damrongdham.moi.go.th", external:true },
  { id:"manual", title:"คู่มือประชาชน 277 เรื่อง", desc:"16 หมวดงาน กรมการปกครอง", icon:F("reicon:book"), accent:"", section:"02", to:"/guide" },
  { id:"podcast", title:"พอตแคสต์ความรู้กฎหมาย", desc:"ฟังสั้นๆ ทุกวันศุกร์", icon:F("reicon:headset"), accent:"", section:"02", to:"/podcast" },
  { id:"news", title:"ข่าวอำเภอ", desc:"ประกาศ • ประชาสัมพันธ์บ้านบึง", icon:F("reicon:bullhorn"), accent:"", section:"03", to:"/news/district" },
  { id:"calendar", title:"ปฏิทินวาระอำเภอ", desc:"วาระสำคัญ • การแต่งกาย", icon:F("reicon:calendar"), accent:"", section:"03", to:"/calendar" },
  { id:"fund", title:"กองทุนรวมน้ำใจไทบ้านบึง", desc:"ยื่นขอความช่วยเหลือ • ติดตามผล", icon:F("reicon:building-coins"), accent:"", section:"03", to:"/fund" },
  { id:"good", title:"ของดีอำเภอบ้านบึง", desc:"ศูนย์รวมของดี ออนไลน์และหน้างาน", icon:F("reicon:gift"), accent:"", section:"03", to:"/products" },
  { id:"knowledge", title:"คลังความรู้", desc:"เอกสาร เสียง วิดีโอ", icon:F("reicon:folder"), accent:"", section:"04", to:"/knowledge" },
];

export default function Home() {
  const { t } = useI18n();
  const { ready, isLoggedIn, login } = useLiff();
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const match = (t:string,d:string)=> !query || t.toLowerCase().includes(query) || d.toLowerCase().includes(query);
  const filtered = useMemo(()=> allItems.filter(i=> match(i.title,i.desc)), [query]);
  const hasQuery = query.length>0;
  const top = filtered.filter(i=> i.section==="top");
  const s01 = filtered.filter(i=> i.section==="01");
  const s02 = filtered.filter(i=> i.section==="02");
  const s03 = filtered.filter(i=> i.section==="03");
  const s04 = filtered.filter(i=> i.section==="04");
  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="หน้าหลัก • อำเภอบ้านบึง" q={q} setQ={setQ} placeholder="ค้นหาเมนู..." />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[84px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-4 lg:pt-6 space-y-4">
          <ImageCarousel />
          <div className="bg-white rounded-[16px] border border-slate-100 p-4 flex items-center justify-between gap-4" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
            <div className="text-[13px] font-semibold leading-none" style={{color:"#1A1A1A"}}>{t("บ้านบึง • หมู่ 3")}</div>
            {isLoggedIn ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-full border shrink-0" style={{background:"#EEF2FF", color:"#0a0a54", borderColor:"#DCE2FF"}}><HiOutlineCheckBadge className="text-[14px]" /> {t("ยืนยันแล้ว")}</span>
            ) : ready ? (
              <button onClick={login} className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-4 py-1.5 rounded-full text-white shrink-0" style={{background:"#06C755"}}>ล็อกอินด้วย LINE</button>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-full border shrink-0" style={{background:"#F7F8FC", color:"#8E95A5", borderColor:"#E2E8F0"}}>...</span>
            )}
          </div>
          {false && <div className="grid grid-cols-3 gap-2.5 mt-3">
            {[
              { k:"คิวของฉัน", v:t("2 รายการ"), c:"#0a0a54" },
              { k:"เรื่องร้องเรียน", v:t("1 รายการ"), c:"#FF6B2C" },
              { k:"แต้มจิตอาสา", v:"340", c:"#00C875" },
            ].map(s=>(
              <div key={s.k} className="bg-white rounded-[16px] border border-slate-100 p-3 text-center" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
                <div className="text-[10px] font-medium tracking-widest" style={{color:"#8E95A5"}}>{t(s.k)}</div>
                <div className="text-[13px] font-bold mt-1.5" style={{color:"#1A1A1A"}}>{s.v}</div>
                <div className="h-1 rounded-full mt-2 mx-auto w-8" style={{background:s.c}} />
              </div>
            ))}
          </div>}
        </div>
        <div className="px-4 lg:px-6 pt-6 space-y-6">
          {hasQuery && <div className="text-[12px] px-1" style={{color:"#8E95A5"}}>{t("ผลการค้นหา")} "{q}" — {t("พบ")} {filtered.length} {t("รายการ")} {filtered.length===0 && <button onClick={()=>setQ("")} className="ml-2 underline" style={{color:"#0a0a54"}}>{t("ล้าง")}</button>}</div>}
          {top.length>0 && <div className="grid grid-cols-1 gap-3">{top.map(i=> <UserCard key={i.id} featured={!!i.featured} accent={i.accent} icon={i.icon} title={i.title} desc={i.desc} to={(i as any).to} external={(i as any).external} />)}</div>}
          <div className="grid grid-cols-1 gap-6">
            {s01.length>0 && <Section num="01" title="ฝ่ายทะเบียนและบัตร">{s01.map(i=> <UserCard key={i.id} icon={i.icon} accent={i.accent} title={i.title} desc={i.desc} to={(i as any).to} external={(i as any).external} />)}</Section>}
            {s02.length>0 && <Section num="02" title="ศูนย์ดำรงธรรมอำเภอ">{s02.map(i=> <UserCard key={i.id} icon={i.icon} accent={i.accent} title={i.title} desc={i.desc} to={(i as any).to} external={(i as any).external} />)}</Section>}
            {s03.length>0 && <Section num="03" title="สำนักงานอำเภอ">{s03.map(i=> <UserCard key={i.id} icon={i.icon} accent={i.accent} title={i.title} desc={i.desc} to={(i as any).to} external={(i as any).external} />)}</Section>}
            {s04.length>0 && <Section num="04" title="ฝ่ายปกครอง" subtitle="ผู้ใหญ่บ้าน • ผู้ช่วยฯ • ชรบ.">{s04.map(i=> <UserCard key={i.id} icon={i.icon} accent={i.accent} title={i.title} desc={i.desc} to={(i as any).to} external={(i as any).external} />)}</Section>}
            {hasQuery && filtered.length===0 && <div className="text-center py-10 bg-white rounded-[16px] border border-slate-100" style={{color:"#8E95A5"}}>{t("ไม่พบเมนูที่ค้นหา")}</div>}
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <div className="text-[11px]" style={{color:"#8E95A5"}}>BANBUENG SMART v1.0 • {t("อำเภอบ้านบึง")} จ.ชลบุรี — {t("สำหรับประชาชน")}</div>
            <a href="#" className="w-full lg:w-auto inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white" style={{background:"#0a0a54"}}><HiOutlineUser className="text-[16px]" /> {t("โปรไฟล์ของฉัน")}</a>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
