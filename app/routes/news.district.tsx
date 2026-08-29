import type { Route } from "./+types/news.district";
import { AppNavbar, BottomNav } from "../components/Navbar";
import { Breadcrumb } from "../components/Breadcrumb";
export function meta({}: Route.MetaArgs){ return [{title:"ข่าวอำเภอ - BANBUENG SMART"}]; }
const news = [
  { id:1, title:"อำเภอบ้านบึง ลงพื้นที่มอบเงินช่วยเหลือผู้ยากไร้", date:"21 ส.ค. 2569", excerpt:"วันศุกร์ที่ 21 สิงหาคม 2569 เวลา 09.30 น. ...", image:"/images/news/news-1.jpg" },
  { id:2, title:"อำเภอบ้านบึง เปิดจองคิวทำบัตรประชาชนออนไลน์", date:"24 ส.ค. 2569", excerpt:"เริ่ม 1 ก.ย. นี้ จองผ่าน BANBUENG SMART ได้ 24 ชม....", image:"/images/news/news-2.jpg" },
  { id:5, title:"แจ้งปิดถนนชั่วคราว งานประเพณีบุญบ้านบึง", date:"18 ส.ค. 2569", excerpt:"ปิดการจราจรบริเวณหน้าวัดบึง...", image:"/images/news/news-5.jpg" },
];
export default function DistrictNews(){
  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="ข่าวอำเภอ" />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[84px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-4">
          <Breadcrumb items={[{label:"หน้าหลัก", to:"/"}, {label:"ข่าว", to:"/news"}, {label:"ข่าวอำเภอ"}]} />
          <h1 className="text-[18px] font-bold mt-2" style={{color:"#1A1A1A"}}>ข่าวอำเภอ</h1>
          <p className="text-[12px] mt-1" style={{color:"#8E95A5"}}>ประกาศและข่าวประชาสัมพันธ์บ้านบึง</p>
        </div>
        <div className="px-4 lg:px-6 pt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {news.map(n=>(
            <article key={n.id} className="bg-white rounded-[16px] border border-slate-100 overflow-hidden hover:border-[#0a0a54]/20 hover:shadow-[0_12px_28px_rgba(10,10,84,0.08)] transition-all" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
              <img src={n.image} alt="" className="w-full h-[160px] object-cover" />
              <div className="p-4">
                <div className="text-[11px] px-2 py-1 rounded-full bg-[#EEF2FF] inline-block" style={{color:"#0a0a54"}}>ข่าวอำเภอ</div>
                <h3 className="text-[14px] font-semibold mt-2" style={{color:"#1A1A1A"}}>{n.title}</h3>
                <p className="text-[12px] mt-1 line-clamp-2" style={{color:"#5A607F"}}>{n.excerpt}</p>
                <div className="text-[11px] mt-2" style={{color:"#8E95A5"}}>{n.date}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
