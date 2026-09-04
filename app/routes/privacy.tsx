import type { Route } from "./+types/privacy";
import { Icon } from "@iconify/react";
import { AppNavbar, BottomNav } from "../components/Navbar";
import { Breadcrumb } from "../components/Breadcrumb";
export function meta({}: Route.MetaArgs){ return [{title:"ความเป็นส่วนตัว - BANBUENG SMART"}]; }
export default function Privacy(){
  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="ความเป็นส่วนตัว" />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[88px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-4">
          <Breadcrumb items={[{label:"หน้าหลัก", to:"/"}, {label:"โปรไฟล์", to:"/profile"}, {label:"ความเป็นส่วนตัว"}]} />
          <button onClick={()=>history.back()} className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-[13px] font-medium hover:border-[#0a0a54]/30 hover:shadow-sm transition-all" style={{color:"#0a0a54"}}><Icon icon="heroicons:chevron-left-20-solid" width={16} height={16} /> กลับ</button>
          <div className="mt-4 bg-white rounded-[16px] border border-slate-100 p-5" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
            <h1 className="text-[18px] font-bold" style={{color:"#1A1A1A"}}>ข้อมูลของท่านถูกดูแลอย่างไร</h1>
            <p className="text-[12px] mt-1" style={{color:"#8E95A5"}}>ประกาศความเป็นส่วนตัว · ที่ว่าการอำเภอบ้านบึง จังหวัดชลบุรี</p>
            <div className="mt-4 space-y-5 text-[13px] leading-relaxed" style={{color:"#1A1A1A"}}>
              <section>
                <h2 className="text-[13px] font-bold flex items-center gap-2" style={{color:"#0a0a54"}}><Icon icon="heroicons:shield-check-20-solid" width={16} height={16} /> เก็บอะไร — และตั้งใจไม่เก็บอะไร</h2>
                <p className="mt-2 text-[12px]" style={{color:"#5A607F"}}>เก็บ: ชื่อ–สกุล เพศ ปีเกิด บ้านเลขที่ พิกัดบ้าน เบอร์โทร (ถ้าท่านให้) และลักษณะกลุ่มเปราะบาง เช่น ติดเตียง พิการ ตั้งครรภ์</p>
                <ul className="mt-2 space-y-1.5 text-[12px] list-disc list-inside" style={{color:"#1A1A1A"}}>
                  <li>ไม่เก็บเลขบัตรประชาชน — แม้แต่ 4 หลักท้ายก็ไม่บังคับ</li>
                  <li>ไม่เก็บข้อมูลการเงินหรือบัญชีธนาคาร</li>
                  <li>ไม่ติดตามตำแหน่งมือถือตลอดเวลา — รับพิกัดเฉพาะวินาทีที่ท่านกดแจ้งเอง</li>
                  <li>สายรัดข้อมืออพยพไม่มีชื่อ มีแต่รหัส QR — สายหล่นหาย คนเก็บได้ไม่รู้แม้แต่ชื่อท่าน</li>
                </ul>
              </section>
              <section>
                <h2 className="text-[13px] font-bold" style={{color:"#0a0a54"}}>เก็บไปทำไม</h2>
                <p className="mt-2 text-[12px]" style={{color:"#1A1A1A"}}>เพื่อตอบคำถามเดียวในคืนที่มีเหตุ — “ใครตกค้างอยู่ที่ไหน และเขาปลอดภัยดีหรือไม่” ข้อมูลกลุ่มเปราะบางทำให้ รพ.สต. รู้ล่วงหน้าว่าต้องไปรับใคร ด้วยรถแบบไหน อำเภอไม่ขายข้อมูล ไม่ส่งให้บริษัทโฆษณา และไม่ใช้ทำอย่างอื่นนอกภารกิจ</p>
              </section>
              <section>
                <h2 className="text-[13px] font-bold" style={{color:"#0a0a54"}}>ใครเห็นข้อมูลของท่านได้บ้าง</h2>
                <ul className="mt-2 space-y-1.5 text-[12px] list-disc list-inside" style={{color:"#1A1A1A"}}>
                  <li>ตัวท่านเอง — ครัวเรือนของท่านเท่านั้น</li>
                  <li>ผู้ใหญ่บ้าน/ผู้ช่วยฯ — เฉพาะหมู่บ้านของตน</li>
                  <li>กำนัน — เฉพาะตำบลของตน</li>
                  <li>นายอำเภอ/ปลัดอำเภอ/ศูนย์บัญชาการ — ทั้งอำเภอ เพื่อสั่งการช่วยเหลือ</li>
                </ul>
                <p className="mt-2 text-[11px]" style={{color:"#8E95A5"}}>ทุกครั้งที่มีคนเปิดดูหรือแก้ไข ระบบบันทึกไว้ว่าใครทำ เมื่อไร — ใช้สิทธิ์ผิดวัตถุประสงค์ ตรวจสอบและดำเนินการทางวินัยได้ทันที</p>
              </section>
              <section>
                <h2 className="text-[13px] font-bold" style={{color:"#0a0a54"}}>เก็บให้ปลอดภัยอย่างไร</h2>
                <ul className="mt-2 space-y-1.5 text-[12px] list-disc list-inside" style={{color:"#1A1A1A"}}>
                  <li>ส่งข้อมูลผ่านช่องทางเข้ารหัสตลอดเส้นทาง</li>
                  <li>ฐานข้อมูลตั้งค่า “ปฏิเสธการเข้าถึงเป็นค่าเริ่มต้น”</li>
                  <li>สำเนาสำรองเข้ารหัสทุกวัน กุญแจเก็บคนละที่กับไฟล์</li>
                  <li>แผนที่ผ่านเซิร์ฟเวอร์ของอำเภอเอง — พิกัดบ้านไม่ถูกส่งออกนอกระบบ</li>
                </ul>
              </section>
              <section>
                <h2 className="text-[13px] font-bold" style={{color:"#0a0a54"}}>สิทธิของท่าน</h2>
                <p className="mt-2 text-[12px]" style={{color:"#1A1A1A"}}>ตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 ท่านดู แก้ไข และขอลบข้อมูลของครัวเรือนตัวเองได้ รวมทั้งถอนความยินยอมส่วนชื่อ–รูปโปรไฟล์ไลน์ได้โดยไม่กระทบบริการหลัก</p>
                <p className="mt-2 text-[11px] p-3 rounded-xl bg-[#FFFBEB] border border-amber-100" style={{color:"#92400E"}}>ข้อยกเว้นเดียวของการลบ: ขณะที่ยังมีภารกิจช่วยเหลือท่านค้างอยู่ ระบบจะยังไม่ลบ เพื่อไม่ให้ทีมกู้ภัยหาท่านไม่เจอ — เมื่อภารกิจปิดแล้วลบได้ตามปกติ</p>
              </section>
              <section>
                <h2 className="text-[13px] font-bold" style={{color:"#0a0a54"}}>ถ้าเกิดเหตุข้อมูลรั่วไหล</h2>
                <p className="mt-2 text-[12px]" style={{color:"#1A1A1A"}}>อำเภอจะแจ้งสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคลภายใน 72 ชั่วโมง และแจ้งผู้ได้รับผลกระทบโดยตรงหากมีความเสี่ยงสูง พร้อมมาตรการเยียวยา — ไม่ปกปิด</p>
              </section>
              <section>
                <h2 className="text-[13px] font-bold" style={{color:"#0a0a54"}}>ใช้สิทธิ หรือสอบถามเพิ่มเติม</h2>
                <p className="mt-2 text-[12px]" style={{color:"#1A1A1A"}}>แก้ไขข้อมูลด้วยตัวเองได้ที่เมนู “ครัวเรือนของฉัน” ที่ว่าการอำเภอบ้านบึง (ฝ่ายทะเบียนและบัตร) ในวันเวลาราชการ หรือแจ้งผู้ใหญ่บ้าน/กำนันในพื้นที่ของท่าน</p>
              </section>
            </div>
            <a href="/profile" className="mt-6 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-[13px] font-medium" style={{color:"#0a0a54"}}><Icon icon="heroicons:chevron-left-20-solid" width={16} height={16} /> กลับหน้าโปรไฟล์</a>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
