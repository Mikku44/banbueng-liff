import type { Route } from "./+types/news";
import { useState } from "react";
import { Tabs, ConfigProvider } from "antd";
import { HiOutlineCalendarDays, HiOutlineEye } from "react-icons/hi2";
import { AppNavbar, BottomNav } from "../components/Navbar";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ข่าว - BANBUENG SMART" }];
}

const allNews: { id:number; cat:string; catColor:string; date:string; views:string; title:string; excerpt:string; image:string; fbUrl?:string }[] = [];

export default function News() {
  const [active, setActive] = useState("ทั้งหมด");
  const [q, setQ] = useState("");
  const cats = ["ทั้งหมด","จาก Facebook"];
  const byCat = active==="ทั้งหมด" ? allNews : allNews.filter(n=> n.cat===active);
  const filtered = q.trim() ? byCat.filter(n=> (n.title+n.excerpt+n.cat).toLowerCase().includes(q.toLowerCase())) : byCat;
  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="ข่าว • อำเภอบ้านบึง" q={q} setQ={setQ} placeholder="ค้นหาข่าว..." />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[88px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-5">
          <h1 className="text-[18px] font-bold" style={{color:"#1A1A1A"}}>ข่าวอำเภอ</h1>
          <p className="text-[12px] mt-1" style={{color:"#8E95A5"}}>ประกาศและข่าวประชาสัมพันธ์บ้านบึง • ซิงก์ล่าสุดจาก Facebook ที่ว่าการอำเภอบ้านบึง (3.4พัน ผู้ติดตาม)</p>
          <div className="mt-4 bg-white rounded-[16px] border border-slate-100 overflow-hidden" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
              <span className="text-[12px] font-semibold flex items-center gap-2" style={{color:"#1877F2"}}><span className="w-2 h-2 rounded-full bg-[#1877F2] animate-pulse" /> ไลฟ์จาก Facebook</span>
              <a href="https://www.facebook.com/profile.php?id=100064874252635" target="_blank" rel="noreferrer" className="text-[11px] px-3 py-1 rounded-full bg-[#1877F2] text-white">เปิดเพจ</a>
            </div>
            <div className="w-full overflow-hidden bg-[#F7F8FC] flex justify-center">
              <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100064874252635&tabs=timeline&width=500&height=380&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false" width="500" height="380" style={{border:"none", overflow:"hidden", maxWidth:"100%"}} scrolling="no" frameBorder={0} allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" title="Facebook Page Timeline"></iframe>
            </div>

          </div>
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
                <a href={(n as any).fbUrl || "#"} target={(n as any).fbUrl ? "_blank" : undefined} rel={(n as any).fbUrl ? "noreferrer" : undefined} className="inline-flex mt-3 text-[12px] font-medium" style={{color:(n as any).fbUrl ? "#1877F2" : "#0a0a54"}}>{(n as any).fbUrl ? "ดูบน Facebook →" : "อ่านต่อ →"}</a>
              </div>
            </article>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
