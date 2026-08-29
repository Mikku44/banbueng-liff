import type { Route } from "./+types/news";
import { useState } from "react";
import { Tabs, ConfigProvider } from "antd";
import { HiOutlineCalendarDays, HiOutlineEye } from "react-icons/hi2";
import { AppNavbar, BottomNav } from "../components/Navbar";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ข่าว - BANBUENG SMART" }];
}

const allNews = [
  { id:1, cat:"กิจกรรม", catColor:"#FF6B2C", date:"21 ส.ค. 2569 • 09:30 น.", views:"1.8k", title:"อำเภอบ้านบึง ลงพื้นที่มอบเงินช่วยเหลือผู้ยากไร้ ผู้พิการ และผู้ด้อยโอกาส", excerpt:"วันศุกร์ที่ 21 สิงหาคม 2569 เวลา 09.30 น. ภายใต้การอำนวยการของนายนริศ นิรามัยวงศ์ ผู้ว่าราชการจังหวัดชลบุรี และนางสุพิณญา นิรามัยวงศ์ นายกเหล่ากาชาดจังหวัดชลบุรี โดยว่าที่ร้อยตรี ศราวุธ กรจิระเจริญ นายอำเภอบ้านบึง พร้อมด้วย นางสาวปวีณา ธีรสถิตย์ธรรม ปลัดอำเภอ หัวหน้ากลุ่มงานทะเบียนและบัตร ผู้ใหญ่บ้าน และผู้ช่วยผู้ใหญ่บ้าน หมู่ที่ 1 และ หมู่ที่ 2 ตำบลคลองกิ่ว ลงพื้นที่มอบเงินให้แก่ผู้ยากไร้ในพื้นที่ ตามโครงการมอบเงินช่วยเหลือผู้ยากไร้ ผู้พิการ และผู้ด้อยโอกาสในพื้นที่จังหวัดชลบุรี ของสำนักงานเหล่ากาชาดจังหวัดชลบุรี", image:"/images/news/news-1.jpg" },
  { id:2, cat:"ประกาศ", catColor:"#0a0a54", date:"24 ส.ค. 2569", views:"1.2k", title:"อำเภอบ้านบึง เปิดจองคิวทำบัตรประชาชนออนไลน์ ลดรอคิวหน้างาน", excerpt:"เริ่ม 1 ก.ย. นี้ จองผ่าน BANBUENG SMART ได้ 24 ชม. เลือกวันเวลาได้เอง...", image:"/images/news/news-2.jpg" },
  { id:3, cat:"กิจกรรม", catColor:"#FF6B2C", date:"22 ส.ค. 2569", views:"856", title:"รวมน้ำใจไทบ้านบึง มอบทุนการศึกษา 120 ทุน", excerpt:"กองทุนรวมน้ำใจไทบ้านบึง ส่งต่อโอกาสทางการศึกษาแก่เยาวชนในพื้นที่...", image:"/images/news/news-3.jpg" },
  { id:4, cat:"ของดี", catColor:"#00C875", date:"20 ส.ค. 2569", views:"2.3k", title:"ของดีบ้านบึง: ตลาดนัดชุมชนเปิดทุกวันเสาร์-อาทิตย์", excerpt:"ศูนย์รวมของดีบ้านบึง ผักปลอดสาร ผลไม้ตามฤดูกาล งานหัตถกรรม...", image:"/images/news/news-4.jpg" },
  { id:5, cat:"ประกาศ", catColor:"#0a0a54", date:"18 ส.ค. 2569", views:"980", title:"แจ้งปิดถนนชั่วคราว งานประเพณีบุญบ้านบึง", excerpt:"ปิดการจราจรบริเวณหน้าวัดบึง วันที่ 28-29 ส.ค. ขออภัยในความไม่สะดวก...", image:"/images/news/news-5.jpg" },
  { id:6, cat:"กิจกรรม", catColor:"#FF6B2C", date:"15 ส.ค. 2569", views:"640", title:"จิตอาสาพัฒนาชุมชน คลองกิ่วร่วมใจ", excerpt:"ผู้ใหญ่บ้านนำทีมจิตอาสาพัฒนาถนนและคูคลองในพื้นที่หมู่บ้าน...", image:"/images/news/news-6.jpg" },
  { id:7, cat:"ของดี", catColor:"#00C875", date:"12 ส.ค. 2569", views:"1.1k", title:"ทุเรียนบ้านบึง ผลผลิตคุณภาพส่งตรงจากสวน", excerpt:"เกษตรกรบ้านบึงพร้อมส่งทุเรียนหมอนทองคุณภาพถึงมือผู้บริโภค...", image:"/images/news/news-7.jpg" },
  { id:8, cat:"ประกาศ", catColor:"#0a0a54", date:"10 ส.ค. 2569", views:"720", title:"เปิดรับลงทะเบียนครัวเรือนผ่าน BANBUENG SMART", excerpt:"เชิญชวนประชาชนลงทะเบียนครัวเรือนล่วงหน้า กรอกข้อมูลพร้อมปักหมุดบ้าน...", image:"/images/news/news-8.jpg" },
];

export default function News() {
  const [active, setActive] = useState("ทั้งหมด");
  const [q, setQ] = useState("");
  const cats = ["ทั้งหมด","ประกาศ","กิจกรรม","ของดี"];
  const byCat = active==="ทั้งหมด" ? allNews : allNews.filter(n=> n.cat===active);
  const filtered = q.trim() ? byCat.filter(n=> (n.title+n.excerpt+n.cat).toLowerCase().includes(q.toLowerCase())) : byCat;
  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="ข่าว • อำเภอบ้านบึง" q={q} setQ={setQ} placeholder="ค้นหาข่าว..." />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[88px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-5">
          <h1 className="text-[18px] font-bold" style={{color:"#1A1A1A"}}>ข่าวอำเภอ</h1>
          <p className="text-[12px] mt-1" style={{color:"#8E95A5"}}>ประกาศและข่าวประชาสัมพันธ์บ้านบึง</p>
          <ConfigProvider theme={{ token:{ colorPrimary:"#0a0a54", fontFamily:"Bai Jamjuree" }, components:{ Tabs:{ inkBarColor:"#0a0a54", itemSelectedColor:"#0a0a54", itemColor:"#8E95A5" }}}}>
            <Tabs activeKey={active} onChange={setActive} items={cats.map(c=>({ key:c, label:c }))} size="small" style={{marginTop:12}} />
          </ConfigProvider>
        </div>
        <div className="px-4 lg:px-6 pt-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.length===0 ? <div className="col-span-full text-center py-12 text-[13px]" style={{color:"#8E95A5"}}>ไม่มีข่าวในหมวดนี้</div> : filtered.map(n=>(
            <article key={n.id} className="bg-white rounded-[16px] border border-slate-100 overflow-hidden" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
              <img src={n.image} alt="" className="w-full h-[160px] object-cover" />
              <div className="p-4">
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="px-2 py-1 rounded-full text-white font-medium" style={{background:n.catColor}}>{n.cat}</span>
                  <span className="flex items-center gap-1" style={{color:"#8E95A5"}}><HiOutlineCalendarDays /> {n.date}</span>
                  <span className="flex items-center gap-1" style={{color:"#8E95A5"}}><HiOutlineEye /> {n.views}</span>
                </div>
                <h3 className="text-[14px] font-semibold mt-2.5 leading-snug" style={{color:"#1A1A1A"}}>{n.title}</h3>
                <p className="text-[12px] mt-1.5 line-clamp-2" style={{color:"#5A607F"}}>{n.excerpt}</p>
                <a href="#" className="inline-flex mt-3 text-[12px] font-medium" style={{color:"#0a0a54"}}>อ่านต่อ →</a>
              </div>
            </article>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
