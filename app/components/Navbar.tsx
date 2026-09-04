import { NavLink } from "react-router";
import { HiOutlineMagnifyingGlass, HiOutlineXMark } from "react-icons/hi2";
import ShinyText from "./ShinyText";
import { useI18n } from "../lib/i18n";
import { useEffect, useState } from "react";

export function AppNavbar({ subtitle, q, setQ, placeholder }: { subtitle: string; q?: string; setQ?: (v:string)=>void; placeholder?: string }) {
  const { t, lang, setLang } = useI18n();
  const s = t(subtitle);
  const ph = placeholder ? t(placeholder) : undefined;
  const [scale, setScale] = useState<"sm"|"md"|"lg">("md");
  useEffect(()=>{
    const s = localStorage.getItem("banbueng_font") as any;
    if (s==="sm"||s==="md"||s==="lg") setScale(s);
  },[]);
  useEffect(()=>{
    const map = { sm:"0.88", md:"1", lg:"1.15" } as const;
    document.documentElement.style.setProperty("--font-scale", map[scale]);
    const v = map[scale];
    (document.body as any).style.zoom = v;
    document.documentElement.style.fontSize = `${16*parseFloat(v)}px`;
    localStorage.setItem("banbueng_font", scale);
  },[scale]);
  const fontBtn = (k:"sm"|"md"|"lg", label:string) => (
    <button key={k} onClick={()=>setScale(k)} className={`px-2 py-1 text-[11px] font-medium rounded-full transition ${scale===k ? "bg-[#0a0a54] text-white shadow" : "text-[#8E95A5] hover:bg-slate-100"}`}>{label}</button>
  );
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="w-full lg:max-w-[1180px] mx-auto px-4 lg:px-6 h-[56px] lg:h-[64px] flex items-center gap-3">
        <div className="flex items-center gap-3 shrink-0">
          <img src="/logo.png" alt="BANBUENG SMART" className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl object-contain bg-white border border-slate-100 p-1" />
          <div className="leading-none hidden sm:block">
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold tracking-tight text-[15px] lg:text-[16px]" style={{color:"#1A1A1A"}}>BANBUENG</span>
              <ShinyText text="SMART" speed={2} delay={0} color="#0a0a54" shineColor="#8d8d8d" spread={120} direction="left" className="font-bold tracking-tight text-[15px] lg:text-[16px]" />
            </div>
            <div className="text-[11px] hidden lg:block pt-1" style={{color:"#8E95A5"}}>อำเภอบ้านบึง • ชลบุรี</div>
            <div className="text-[11px] mt-1" style={{color:"#8E95A5"}}>{s}</div>
          </div>
          <div className="leading-none sm:hidden flex items-baseline gap-1">
            <span className="font-bold text-[13px]" style={{color:"#1A1A1A"}}>BANBUENG</span>
            <ShinyText text="SMART" speed={2} color="#0a0a54" shineColor="#8d8d8d" spread={120} className="font-bold text-[13px]" />
          </div>
        </div>
        <nav className="hidden lg:flex items-center gap-1 rounded-full p-1 shrink-0 ml-6 lg:hidden" style={{background:"#F7F8FC"}}>
          <NavLink to="/" className={({isActive})=>`text-[13px] px-4 py-1.5 rounded-full ${isActive ? "text-white font-medium" : ""}`} style={({isActive})=> isActive ? {background:"#0a0a54"} as any : {color:"#8E95A5"} as any}>{t("หน้าหลัก")}</NavLink>
          <NavLink to="/news" className={({isActive})=>`text-[13px] px-4 py-1.5 rounded-full ${isActive ? "text-white font-medium" : ""}`} style={({isActive})=> isActive ? {background:"#0a0a54"} as any : {color:"#8E95A5"} as any}>{t("ข่าว")}</NavLink>
          <NavLink to="/hotline" className={({isActive})=>`text-[13px] px-4 py-1.5 rounded-full ${isActive ? "text-white font-medium" : ""}`} style={({isActive})=> isActive ? {background:"#0a0a54"} as any : {color:"#8E95A5"} as any}>{t("สายด่วน")}</NavLink>
          <NavLink to="/profile" className={({isActive})=>`text-[13px] px-4 py-1.5 rounded-full ${isActive ? "text-white font-medium" : ""}`} style={({isActive})=> isActive ? {background:"#0a0a54"} as any : {color:"#8E95A5"} as any}>{t("โปรไฟล์")}</NavLink>
        </nav>
        <div className="flex items-center gap-1.5 flex-1 justify-end ml-auto">
          {setQ !== undefined ? (
            <div className="relative flex-1 max-w-[220px]">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[16px]" style={{color:"#8E95A5"}} />
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder={ph || t("ค้นหา...")} className="w-full pl-9 pr-8 py-2 rounded-full border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54] placeholder:text-[#8E95A5]" />
              {q && <button onClick={()=>setQ("")} className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><HiOutlineXMark className="text-[14px]" /></button>}
            </div>
          ) : null}
          <div className="hidden lg:flex items-center gap-1 bg-white border border-slate-200 rounded-full px-1 py-1 shadow-sm shrink-0">
            <button onClick={()=>setLang(lang==="th"?"en":"th")} className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition ${lang==="th" ? "bg-[#0a0a54] text-white" : "text-[#8E95A5]"}`}>TH</button>
            <button onClick={()=>setLang(lang==="en"?"th":"en")} className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition ${lang==="en" ? "bg-[#0a0a54] text-white" : "text-[#8E95A5]"}`}>EN</button>
          </div>
          <div className="hidden lg:flex items-center gap-1 bg-white border border-slate-200 rounded-full px-1 py-1 shadow-sm shrink-0">
            {fontBtn("sm","A-")}
            {fontBtn("md","A")}
            {fontBtn("lg","A+")}
          </div>
        </div>
      </div>
    </header>
  );
}

import { HiOutlineHome, HiOutlineNewspaper, HiOutlinePhone, HiOutlineUser, HiOutlineBuildingOffice2, HiOutlineBookOpen, HiOutlineGift, HiOutlineCalendarDays } from "react-icons/hi2";
export function DesktopSidebar() {
  const { t } = useI18n();
  const itemCls = ({isActive}:{isActive:boolean}) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition ${isActive ? "bg-[#0a0a54] text-white shadow" : "text-[#5A607F] hover:bg-[#F7F8FC] hover:text-[#1A1A1A]"}`;
  return (
    <aside className="hidden lg:flex flex-col w-[220px] shrink-0 sticky top-0 h-screen bg-white border-r border-slate-100">
      <div className="h-[64px] flex items-center gap-3 px-4 border-b border-slate-100 shrink-0">
        <img src="/logo.png" alt="BANBUENG SMART" className="w-9 h-9 rounded-xl object-contain bg-white border border-slate-100 p-1" />
        <div className="leading-none">
          <div className="flex items-baseline gap-1"><span className="font-bold text-[13px]" style={{color:"#1A1A1A"}}>BANBUENG</span><span className="font-bold text-[13px]" style={{color:"#0a0a54"}}>SMART</span></div>
          <div className="text-[11px]" style={{color:"#8E95A5"}}>อำเภอบ้านบึง</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <NavLink to="/search" className={itemCls}><HiOutlineMagnifyingGlass className="text-[18px] shrink-0" /> {t("ค้นหา")}</NavLink>
        <NavLink to="/" className={itemCls}><HiOutlineHome className="text-[18px] shrink-0" /> {t("หน้าหลัก")}</NavLink>
        <NavLink to="/news" className={itemCls}><HiOutlineNewspaper className="text-[18px] shrink-0" /> {t("ข่าว")}</NavLink>
        <NavLink to="/hotline" className={itemCls}><HiOutlinePhone className="text-[18px] shrink-0" /> {t("สายด่วน")}</NavLink>
        <NavLink to="/guide" className={itemCls}><HiOutlineBookOpen className="text-[18px] shrink-0" /> คู่มือ 277 เรื่อง</NavLink>
        <NavLink to="/registration" className={itemCls}><HiOutlineBuildingOffice2 className="text-[18px] shrink-0" /> งานทะเบียน</NavLink>
        <NavLink to="/products" className={itemCls}><HiOutlineGift className="text-[18px] shrink-0" /> ของดีบ้านบึง</NavLink>
        <NavLink to="/calendar" className={itemCls}><HiOutlineCalendarDays className="text-[18px] shrink-0" /> ปฏิทิน</NavLink>
        <NavLink to="/profile" className={itemCls}><HiOutlineUser className="text-[18px] shrink-0" /> {t("โปรไฟล์")}</NavLink>
      </nav>
      <div className="p-3 border-t border-slate-100">
        <div className="bg-[#F7F8FC] rounded-xl p-3">
          <div className="text-[11px] font-semibold" style={{color:"#1A1A1A"}}>BANBUENG SMART</div>
          <div className="text-[11px] mt-1 leading-relaxed" style={{color:"#8E95A5"}}>เชื่อมโยงบริการเป็นหนึ่งเดียว เพื่อชาวบ้านบึง</div>
        </div>
      </div>
    </aside>
  );
}
export function BottomNav() {
  const { t } = useI18n();
  return (
    <nav className="fixed lg:hidden bottom-0 left-0 w-full bg-white border-t border-slate-100 flex justify-around py-1.5 z-50">
      {[
        { to:"/", label:t("หน้าหลัก"), icon:HiOutlineHome },
        { to:"/news", label:t("ข่าว"), icon:HiOutlineNewspaper },
        { to:"/hotline", label:t("สายด่วน"), icon:HiOutlinePhone },
        { to:"/profile", label:t("โปรไฟล์"), icon:HiOutlineUser },
      ].map(item=>{
        const Icon=item.icon;
        return (
          <NavLink key={item.to} to={item.to} className="flex flex-col items-center gap-1 px-5 py-1" style={({isActive}:any)=> isActive ? {color:"#0a0a54"} as any : {color:"#8E95A5"} as any}>
            {({isActive}:any)=>(
              <>
                <span className={`flex items-center justify-center w-8 h-8 rounded-full ${isActive ? "bg-[#0a0a54] text-white shadow-sm" : "bg-transparent"}`}>
                  <Icon key={isActive ? "a" : "i"} className="text-[20px]" style={isActive ? { animation: "navBounce 0.5s ease" } as any : undefined} />
                </span>
                <span className={`text-[10px] leading-none ${isActive ? "font-semibold" : "font-medium"}`}>{item.label}</span>
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  );
}
