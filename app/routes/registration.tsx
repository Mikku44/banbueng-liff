import type { Route } from "./+types/registration";
import { NavLink } from "react-router";
import { Icon } from "@iconify/react";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { AppNavbar, BottomNav } from "../components/Navbar";
import { Breadcrumb } from "../components/Breadcrumb";
import { useI18n } from "../lib/i18n";

export function meta({}: Route.MetaArgs) {
  return [{ title: "งานทะเบียนและบัตร - BANBUENG SMART" }];
}

const F = (n:string) => <Icon icon={n} width={22} height={22} />;

const items = [
  { title:"คู่มือบริการประชาชน", desc:"ทะเบียนราษฎร · บัตรประชาชน · ทะเบียนทั่วไป · ครอบครัว · สัญชาติ", icon:F("reicon:book"), to:"/registration/manual", external:false },
  { title:"นัดหมายสอบสวน (ปค.14)", desc:"รับรองโสด · บุคคลคนเดียวกัน · เพิ่มชื่อในทะเบียนบ้าน · รับรองเกิด/ตาย ฯลฯ", icon:F("reicon:clipboard"), to:"/registration/appointment", external:false },
  { title:"ขอถ่ายบัตรนอกสถานที่", desc:"ผู้ป่วยติดเตียง · คนชรา · ผู้พิการ ที่เดินทางมาอำเภอไม่ได้", icon:F("reicon:car"), to:"/registration/mobile-id", external:false },
  { title:"ประเด็นถามตอบน่าสนใจ", desc:"คำถามพบบ่อยงานทะเบียน (ถามเจ้าหน้าที่ผ่านศูนย์ดำรงธรรม) • 147 ประเด็น", icon:F("reicon:help-circle"), to:"/registration/qa", external:false },
  { title:"จองคิวออนไลน์", desc:"จองคิวรับบริการงานทะเบียนล่วงหน้า (เปิดเว็บ Q-Online)", icon:F("reicon:calendar"), to:"https://q-online.bora.dopa.go.th/", external:true },
  { title:"บริการทะเบียนทางอิเล็กทรอนิกส์", desc:"คัด/รับรองเอกสารทะเบียนออนไลน์ (เปิดเว็บ DOPA e-Service)", icon:F("reicon:globe"), to:"https://eservices.bora.dopa.go.th/spt/", external:true },
];

export default function Registration() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="งานทะเบียนและบัตร" />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[84px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-4">
          <Breadcrumb items={[{label:"หน้าหลัก", to:"/"}, {label:"งานทะเบียนและบัตร"}]} />
          <h1 className="text-[18px] font-bold mt-2" style={{color:"#1A1A1A"}}>งานทะเบียนและบัตร</h1>
          <p className="text-[12px] mt-1" style={{color:"#8E95A5"}}>บริการทะเบียนราษฎรและบัตรประชาชน</p>
        </div>
        <div className="px-4 lg:px-6 pt-6 space-y-3">
          {items.map(it=>(
            <a key={it.title} href={it.to} target={it.external ? "_blank" : undefined} rel={it.external ? "noreferrer" : undefined} className="group bg-white rounded-[16px] border border-slate-100 p-4 flex items-center gap-3.5 hover:border-[#0a0a54]/30 hover:shadow-[0_12px_28px_rgba(10,10,84,0.12)] hover:-translate-y-[2px] transition-all duration-200" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
              <div className="w-10 h-10 rounded-xl bg-[#F7F8FC] flex items-center justify-center shrink-0">{it.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold" style={{color:"#1A1A1A"}}>{it.title}</div>
                <div className="text-[11px] mt-0.5 line-clamp-2" style={{color:"#8E95A5"}}>{it.desc}</div>
              </div>
              <span className="w-7 h-7 rounded-full bg-[#F7F8FC] group-hover:bg-[#0a0a54] group-hover:text-white flex items-center justify-center text-[#8E95A5] transition-all duration-200 shrink-0">
                {it.external ? <span className="text-[12px]">↗</span> : <HiOutlineChevronRight className="text-[14px]" />}
              </span>
            </a>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
