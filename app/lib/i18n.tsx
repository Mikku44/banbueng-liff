import { createContext, useContext, useEffect, useState } from "react";

type Lang = "th" | "en";

const dict: Record<string, Record<Lang,string>> = {
  "หน้าหลัก": { th:"หน้าหลัก", en:"Home" },
  "ข่าว": { th:"ข่าว", en:"News" },
  "สายด่วน": { th:"สายด่วน", en:"Hotline" },
  "โปรไฟล์": { th:"โปรไฟล์", en:"Profile" },
  "อำเภอบ้านบึง": { th:"อำเภอบ้านบึง", en:"Ban Bueng" },
  "ชลบุรี": { th:"ชลบุรี", en:"Chonburi" },
  "เพื่อประชาชน": { th:"เพื่อประชาชน", en:"For Citizens" },
  "ข่าว • อำเภอบ้านบึง": { th:"ข่าว • อำเภอบ้านบึง", en:"News • Ban Bueng" },
  "สายด่วน • อำเภอบ้านบึง": { th:"สายด่วน • อำเภอบ้านบึง", en:"Hotline • Ban Bueng" },
  "โปรไฟล์ • อำเภอบ้านบึง": { th:"โปรไฟล์ • อำเภอบ้านบึง", en:"Profile • Ban Bueng" },
  "หน้าหลัก • อำเภอบ้านบึง": { th:"หน้าหลัก • อำเภอบ้านบึง", en:"Home • Ban Bueng" },
  "ค้นหาเมนู...": { th:"ค้นหาเมนู...", en:"Search menu..." },
  "ค้นหาข่าว...": { th:"ค้นหาข่าว...", en:"Search news..." },
  "ค้นหาเบอร์...": { th:"ค้นหาเบอร์...", en:"Search contacts..." },
  "ยืนยันแล้ว": { th:"ยืนยันแล้ว", en:"Verified" },
  "ยืนยันตัวตนแล้ว": { th:"ยืนยันตัวตนแล้ว", en:"Verified" },
  "บ้านบึง • หมู่ 3": { th:"บ้านบึง • หมู่ 3", en:"Ban Bueng • Moo 3" },
  "คิวของฉัน": { th:"คิวของฉัน", en:"My Queue" },
  "เรื่องร้องเรียน": { th:"เรื่องร้องเรียน", en:"Complaints" },
  "แต้มจิตอาสา": { th:"แต้มจิตอาสา", en:"Volunteer Points" },
  "2 รายการ": { th:"2 รายการ", en:"2 items" },
  "1 รายการ": { th:"1 รายการ", en:"1 item" },
  "1 ดำเนินการ": { th:"1 ดำเนินการ", en:"1 in progress" },
  "ลงทะเบียนครัวเรือนของฉัน": { th:"ลงทะเบียนครัวเรือนของฉัน", en:"My Household Registration" },
  "กรอกสมาชิก • ปักหมุดบ้าน • 5 นาทีเสร็จ": { th:"กรอกสมาชิก • ปักหมุดบ้าน • 5 นาทีเสร็จ", en:"Add members • Pin home • 5 min" },
  "ร้องเรียน • สอบถามเจ้าหน้าที่": { th:"ร้องเรียน • สอบถามเจ้าหน้าที่", en:"Complaint / Inquiry" },
  "ส่งเรื่องพร้อมภาพ ระบบนำส่งทันที": { th:"ส่งเรื่องพร้อมภาพ ระบบนำส่งทันที", en:"Send with photos, auto-assigned" },
  "ฝ่ายทะเบียนและบัตร": { th:"ฝ่ายทะเบียนและบัตร", en:"Registration & ID" },
  "งานทะเบียนและบัตร": { th:"งานทะเบียนและบัตร", en:"Registration & ID Services" },
  "จองคิวออนไลน์ • ทะเบียนดิจิทัล": { th:"จองคิวออนไลน์ • ทะเบียนดิจิทัล", en:"Online queue • Digital registry" },
  "ขอทำบัตรนอกสถานที่": { th:"ขอทำบัตรนอกสถานที่", en:"Mobile ID Service" },
  "ผู้ป่วยติดเตียง ผู้สูงอายุ ผู้พิการ": { th:"ผู้ป่วยติดเตียง ผู้สูงอายุ ผู้พิการ", en:"Bedridden / Elderly / Disabled" },
  "ถามตอบงานทะเบียน": { th:"ถามตอบงานทะเบียน", en:"Registration FAQ" },
  "คำถามพบบ่อยจากเจ้าหน้าที่": { th:"คำถามพบบ่อยจากเจ้าหน้าที่", en:"Common questions answered" },
  "ศูนย์ดำรงธรรมอำเภอ": { th:"ศูนย์ดำรงธรรมอำเภอ", en:"Damrongdhama Center" },
  "ร้องเรียน • ร้องทุกข์": { th:"ร้องเรียน • ร้องทุกข์", en:"Complaints" },
  "แนบภาพได้ • ติดตามสถานะ": { th:"แนบภาพได้ • ติดตามสถานะ", en:"Attach photos • Track status" },
  "คู่มือประชาชน 277 เรื่อง": { th:"คู่มือประชาชน 277 เรื่อง", en:"Citizen Guide 277 topics" },
  "16 หมวดงาน กรมการปกครอง": { th:"16 หมวดงาน กรมการปกครอง", en:"16 categories" },
  "พอตแคสต์ความรู้กฎหมาย": { th:"พอตแคสต์ความรู้กฎหมาย", en:"Legal Podcast" },
  "ฟังสั้นๆ ทุกวันศุกร์": { th:"ฟังสั้นๆ ทุกวันศุกร์", en:"Short episodes every Friday" },
  "สำนักงานอำเภอ": { th:"สำนักงานอำเภอ", en:"District Office" },
  "ข่าวอำเภอ": { th:"ข่าวอำเภอ", en:"District News" },
  "ประกาศ • ประชาสัมพันธ์บ้านบึง": { th:"ประกาศ • ประชาสัมพันธ์บ้านบึง", en:"Announcements • Ban Bueng" },
  "ปฏิทินวาระอำเภอ": { th:"ปฏิทินวาระอำเภอ", en:"District Calendar" },
  "วาระสำคัญ • การแต่งกาย": { th:"วาระสำคัญ • การแต่งกาย", en:"Agenda • Dress code" },
  "กองทุนรวมน้ำใจไทบ้านบึง": { th:"กองทุนรวมน้ำใจไทบ้านบึง", en:"Nam Jai Fund" },
  "ยื่นขอความช่วยเหลือ • ติดตามผล": { th:"ยื่นขอความช่วยเหลือ • ติดตามผล", en:"Request help • Track" },
  "ของดีอำเภอบ้านบึง": { th:"ของดีอำเภอบ้านบึง", en:"Ban Bueng Best Products" },
  "ศูนย์รวมของดี ออนไลน์และหน้างาน": { th:"ศูนย์รวมของดี ออนไลน์และหน้างาน", en:"Local products online & onsite" },
  "ฝ่ายปกครอง": { th:"ฝ่ายปกครอง", en:"Administration" },
  "ผู้ใหญ่บ้าน • ผู้ช่วยฯ • ชรบ.": { th:"ผู้ใหญ่บ้าน • ผู้ช่วยฯ • ชรบ.", en:"Village heads & volunteers" },
  "รายงานภารกิจ • ปฏิบัติงาน": { th:"รายงานภารกิจ • ปฏิบัติงาน", en:"Mission Reports" },
  "รายงาน 11 หมวด • รายหมู่บ้าน": { th:"รายงาน 11 หมวด • รายหมู่บ้าน", en:"11 categories • Village" },
  "แบบทดสอบประจำเดือน": { th:"แบบทดสอบประจำเดือน", en:"Monthly Quiz" },
  "ทำในที่ประชุม เฉลยทันที": { th:"ทำในที่ประชุม เฉลยทันที", en:"In-meeting • Instant answer" },
  "ประวัติการทำแบบทดสอบ": { th:"ประวัติการทำแบบทดสอบ", en:"Quiz History" },
  "คะแนนย้อนหลัง • แนวโน้ม": { th:"คะแนนย้อนหลัง • แนวโน้ม", en:"Past scores • Trend" },
  "คลังความรู้": { th:"คลังความรู้", en:"Knowledge Base" },
  "เอกสาร เสียง วิดีโอ": { th:"เอกสาร เสียง วิดีโอ", en:"Docs • Audio • Video" },
  "โปรไฟล์ของฉัน": { th:"โปรไฟล์ของฉัน", en:"My Profile" },
  "ผลการค้นหา": { th:"ผลการค้นหา", en:"Search results" },
  "พบ": { th:"พบ", en:"found" },
  "รายการ": { th:"รายการ", en:"items" },
  "ล้าง": { th:"ล้าง", en:"Clear" },
  "ไม่พบเมนูที่ค้นหา": { th:"ไม่พบเมนูที่ค้นหา", en:"No menu found" },
  "สำหรับประชาชน": { th:"สำหรับประชาชน", en:"For Citizens" },
};

const Ctx = createContext<{ lang:Lang; setLang:(l:Lang)=>void; t:(s:string)=>string }>({ lang:"th", setLang:()=>{}, t:(s)=>s });

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("th");
  useEffect(()=>{
    const s = localStorage.getItem("banbueng_lang") as Lang | null;
    if (s==="th"||s==="en") setLang(s);
  },[]);
  useEffect(()=>{
    localStorage.setItem("banbueng_lang", lang);
    document.documentElement.lang = lang;
  },[lang]);
  const t = (s:string) => dict[s]?.[lang] ?? s;
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
