import { NavLink } from "react-router";
import { HiOutlineMagnifyingGlass, HiOutlineXMark } from "react-icons/hi2";
import ShinyText from "./ShinyText";
import { useI18n } from "../lib/i18n";

export function AppNavbar({ subtitle, q, setQ, placeholder }: { subtitle: string; q?: string; setQ?: (v:string)=>void; placeholder?: string }) {
  const { t } = useI18n();
  const s = t(subtitle);
  const ph = placeholder ? t(placeholder) : undefined;
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="w-full lg:max-w-[1180px] mx-auto px-4 lg:px-6 h-[56px] lg:h-[64px] flex items-center justify-between gap-3">
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
        <nav className="hidden lg:flex items-center gap-1 rounded-full p-1 shrink-0" style={{background:"#F7F8FC"}}>
          <NavLink to="/" className={({isActive})=>`text-[13px] px-4 py-1.5 rounded-full ${isActive ? "text-white font-medium" : ""}`} style={({isActive})=> isActive ? {background:"#0a0a54"} as any : {color:"#8E95A5"} as any}>{t("หน้าหลัก")}</NavLink>
          <NavLink to="/news" className={({isActive})=>`text-[13px] px-4 py-1.5 rounded-full ${isActive ? "text-white font-medium" : ""}`} style={({isActive})=> isActive ? {background:"#0a0a54"} as any : {color:"#8E95A5"} as any}>{t("ข่าว")}</NavLink>
          <NavLink to="/hotline" className={({isActive})=>`text-[13px] px-4 py-1.5 rounded-full ${isActive ? "text-white font-medium" : ""}`} style={({isActive})=> isActive ? {background:"#0a0a54"} as any : {color:"#8E95A5"} as any}>{t("สายด่วน")}</NavLink>
          <NavLink to="/profile" className={({isActive})=>`text-[13px] px-4 py-1.5 rounded-full ${isActive ? "text-white font-medium" : ""}`} style={({isActive})=> isActive ? {background:"#0a0a54"} as any : {color:"#8E95A5"} as any}>{t("โปรไฟล์")}</NavLink>
        </nav>
        {setQ !== undefined ? (
          <div className="flex items-center flex-1 justify-end max-w-[280px]">
            <div className="relative flex-1 max-w-[220px]">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[16px]" style={{color:"#8E95A5"}} />
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder={ph || t("ค้นหา...")} className="w-full pl-9 pr-8 py-2 rounded-full border border-slate-200 bg-white text-[13px] outline-none focus:border-[#0a0a54] placeholder:text-[#8E95A5]" />
              {q && <button onClick={()=>setQ("")} className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><HiOutlineXMark className="text-[14px]" /></button>}
            </div>
          </div>
        ) : <div className="w-9 h-9 shrink-0" />}
      </div>
    </header>
  );
}

import { HiOutlineHome, HiOutlineNewspaper, HiOutlinePhone, HiOutlineUser } from "react-icons/hi2";
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
        return <NavLink key={item.to} to={item.to} className="flex flex-col items-center gap-1 px-5 py-1" style={({isActive}:any)=> isActive ? {color:"#0a0a54"} as any : {color:"#8E95A5"} as any}><Icon className="text-[20px]" /><span className="text-[10px]">{item.label}</span></NavLink>
      })}
    </nav>
  );
}
