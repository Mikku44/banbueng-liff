import type { Route } from "./+types/profile";
import { Icon } from "@iconify/react";
import { AppNavbar, BottomNav } from "../components/Navbar";
import { Breadcrumb } from "../components/Breadcrumb";
import { useI18n } from "../lib/i18n";
import { LIFF_ID, LIFF_URL, useLiff } from "../lib/liff";

export function meta({}: Route.MetaArgs) {
  return [{ title: "โปรไฟล์ - BANBUENG SMART" }];
}

export default function Profile() {
  const { ready, error, isInClient, isLoggedIn, profile, login, logout } = useLiff();
  const { t } = useI18n();
  const showHomeLike = ready && !isLoggedIn && !error;
  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="โปรไฟล์ • อำเภอบ้านบึง" />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[88px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-4">
          <Breadcrumb items={[{label:"หน้าหลัก", to:"/"}, {label:"โปรไฟล์"}]} />
          {showHomeLike ? (
            <>
              <div className="bg-white rounded-[16px] border border-slate-100 p-4 flex items-center justify-between gap-4 mt-3" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
                <div className="text-[13px] font-semibold leading-none" style={{color:"#1A1A1A"}}>{t("บ้านบึง • หมู่ 3")}</div>
                <button onClick={login} className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-4 py-1.5 rounded-full text-white shrink-0" style={{background:"#06C755"}}>ล็อกอินด้วย LINE</button>
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
            </>
          ) : (
            <div className="bg-white rounded-[16px] border border-slate-100 p-5 flex flex-col items-center text-center mt-3" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
              <div className="relative">
                <img src={profile?.pictureUrl ?? "https://i.pravatar.cc/100?img=33"} alt="" className="w-[72px] h-[72px] rounded-full object-cover ring-4 ring-[#F7F8FC]" />
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0a0a54] border-2 border-white flex items-center justify-center"><Icon icon="heroicons:check-20-solid" width={12} height={12} style={{color:"white"}} /></span>
              </div>
              <div className="text-[16px] font-bold mt-3" style={{color:"#1A1A1A"}}>{profile?.displayName ?? "Username"}</div>
              <div className="text-[12px]" style={{color:"#8E95A5"}}>{profile ? `${profile.userId.slice(0,10)}… • ${isInClient ? "เปิดใน LINE" : "เบราว์เซอร์"} • LIFF ${LIFF_ID.slice(-8)}` : "บทบาท: ประชาชน • บ้านบึง • หมู่ 3 • 123 หมู่ 3 ต.บ้านบึง"}</div>
              <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border" style={{background: isLoggedIn ? "#EEF2FF" : "#FFF7ED", color: isLoggedIn ? "#0a0a54" : "#9A3412", borderColor: isLoggedIn ? "#DCE2FF" : "#FED7AA"}}><Icon icon={isLoggedIn ? "heroicons:shield-check-20-solid" : "heroicons:exclamation-triangle-20-solid"} width={14} height={14} /> {ready ? (isLoggedIn ? "เชื่อม LINE แล้ว" : error ? `LIFF error: ${error}` : "ยังไม่ล็อกอิน") : "กำลังโหลด LIFF..."}</span>
              {!isLoggedIn && ready && !error && <button onClick={login} className="mt-3 px-5 py-2 rounded-full bg-[#06C755] text-white text-[13px] font-semibold hover:bg-[#05b64d]">ล็อกอินด้วย LINE</button>}
              {isLoggedIn && <button onClick={logout} className="mt-3 px-5 py-2 rounded-full bg-white border border-slate-200 text-[12px]">ออกจาก LINE</button>}
              <div className="mt-2 text-[10px] break-all" style={{color:"#8E95A5"}}><a href={LIFF_URL} target="_blank" rel="noreferrer" className="underline">{LIFF_URL}</a></div>
              {false && <div className="grid grid-cols-3 gap-3 w-full mt-5">
                {[
                  { v:"2", l:"คิว" },
                  { v:"1", l:"คำร้อง" },
                  { v:"340", l:"แต้ม" },
                ].map(s=>(
                  <div key={s.l} className="rounded-xl py-2.5 border border-slate-100" style={{background:"#F7F8FC"}}><div className="text-[15px] font-bold" style={{color:"#1A1A1A"}}>{s.v}</div><div className="text-[11px]" style={{color:"#8E95A5"}}>{s.l}</div></div>
                ))}
              </div>}
              <div className="flex gap-2 w-full mt-4">
                <a href="/registration/appointment" className="flex-1 py-2 rounded-full bg-[#0a0a54] text-white text-[12px] font-medium text-center hover:bg-[#0a0a54]/90 transition-colors">ดูคิวของฉัน</a>
                <a href="/profile" className="flex-1 py-2 rounded-full bg-white border border-slate-200 text-[12px] font-medium text-center hover:border-[#0a0a54]/20 transition-colors" style={{color:"#1A1A1A"}}>แก้ไขโปรไฟล์</a>
              </div>
            </div>
          )}

          <div className="mt-6 space-y-3">
            <div className="text-[11px] font-semibold tracking-widest" style={{color:"#8E95A5"}}>บัญชีและความปลอดภัย</div>
            {[
              { icon:"heroicons:identification-20-solid", title:"ยืนยันตัวตนเจ้าหน้าที่ (กำนัน/ผู้ใหญ่บ้าน ฯลฯ)", desc:"สำหรับเจ้าหน้าที่ปกครอง", to:"/claim", badge:"ใหม่" },
              { icon:"heroicons:device-phone-mobile-20-solid", title:"เชื่อมแอปบนหน้าจอโฮม", desc:"เพิ่มทางลัด BANBUENG SMART", to:"/link-device" },
              { icon:"heroicons:shield-check-20-solid", title:"ข้อมูลของฉันถูกดูแลอย่างไร", desc:"นโยบายความเป็นส่วนตัว", to:"/privacy" },
            ].map(it=>(
              <a key={it.title} href={it.to} className="bg-white rounded-[16px] border border-slate-100 p-4 flex items-center gap-3.5 hover:border-[#0a0a54]/20 hover:shadow-[0_12px_28px_rgba(10,10,84,0.08)] transition-all" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{background:"#F7F8FC", color:"#0a0a54"}}><Icon icon={it.icon} width={18} height={18} /></div>
                <div className="flex-1 min-w-0"><div className="text-[13px] font-semibold flex items-center gap-2" style={{color:"#1A1A1A"}}>{it.title} {it.badge && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#EEF2FF] border border-[#DCE2FF]" style={{color:"#0a0a54"}}>{it.badge}</span>}</div><div className="text-[11px] truncate" style={{color:"#8E95A5"}}>{it.desc}</div></div>
                <Icon icon="heroicons:chevron-right-20-solid" width={18} height={18} style={{color:"#8E95A5"}} />
              </a>
            ))}
          </div>

          {isLoggedIn && (
            <div className="mt-6 space-y-3">
              <button onClick={logout} className="w-full bg-white rounded-[16px] border border-red-100 p-4 flex items-center gap-3.5 hover:border-red-200 transition-colors text-left" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-50 text-[#FF4D4D] shrink-0"><Icon icon="heroicons:arrow-right-on-rectangle-20-solid" width={18} height={18} /></div>
                <div className="flex-1"><div className="text-[13px] font-semibold text-[#FF4D4D]">ออกจากระบบ</div><div className="text-[11px]" style={{color:"#8E95A5"}}>ลงชื่อออกจากการใช้งาน</div></div>
                <Icon icon="heroicons:chevron-right-20-solid" width={18} height={18} style={{color:"#FF4D4D"}} />
              </button>
            </div>
          )}
          <div className="text-center text-[11px] mt-6" style={{color:"#8E95A5"}}>BANBUENG SMART v1.0 • อำเภอบ้านบึง จ.ชลบุรี </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
