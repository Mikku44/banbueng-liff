import type { Route } from "./+types/products";
import { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { AppNavbar, BottomNav } from "../components/Navbar";
import { Breadcrumb } from "../components/Breadcrumb";
export function meta({}: Route.MetaArgs){ return [{title: "ของดีอำเภอบ้านบึง - BANBUENG SMART"}]; }

type Product = { id:number; name:string; cat:string; price:string; unit:string; img:string; badge?:string; desc:string; seller:string; tel:string };
const cats = ["ทั้งหมด","ผลไม้","OTOP","หัตถกรรม","อาหารแปรรูป"] as const;

const products: Product[] = [
  { id:1, name:"ทุเรียนหมอนทองบ้านบึง", cat:"ผลไม้", price:"180", unit:"กก.", img:"https://images.unsplash.com/photo-1594489573454-e92474ff1a2b?w=400&h=300&fit=crop&auto=format", badge:"ขายดี", desc:"ทุเรียนหมอนทองคัดเกรด เนื้อแห้ง หวานมัน ส่งตรงจากสวน ต.หนองไผ่แก้ว", seller:"สวนลุงสมชาย • หมู่ 4 ต.หนองไผ่แก้ว", tel:"081-234-5678" },
  { id:2, name:"มังคุดคัดพิเศษ", cat:"ผลไม้", price:"80", unit:"กก.", img:"https://images.unsplash.com/photo-1615484477778-ca3b02f8ccd7?w=400&h=300&fit=crop&auto=format", desc:"มังคุดเปลือกดำ เนื้อขาว หวานอมเปรี้ยว คัดลูกใหญ่", seller:"วิสาหกิจชุมชนคลองกิ่ว", tel:"089-111-2222" },
  { id:3, name:"ลองกองน้ำผึ้ง", cat:"ผลไม้", price:"60", unit:"กก.", img:"https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop&auto=format", desc:"ลองกองช่อสวย เม็ดเล็ก หวานฉ่ำ", seller:"สวนป้าน้อย • หนองบอนแดง", tel:"082-333-4444" },
  { id:4, name:"ผ้าทอมัดหมี่บ้านบึง", cat:"หัตถกรรม", price:"450", unit:"ผืน", img:"https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop&auto=format", desc:"ผ้าฝ้ายทอมือ ลายมัดหมี่ย้อมคราม ภูมิปัญญาท้องถิ่น", seller:"กลุ่มทอผ้าบ้านบึง", tel:"086-555-6666" },
  { id:5, name:"กระเป๋าจักสานกก", cat:"หัตถกรรม", price:"290", unit:"ใบ", img:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=300&fit=crop&auto=format", badge:"ใหม่", desc:"จักสานจากต้นกก ทนทาน ดีไซน์ร่วมสมัย", seller:"กลุ่มจักสานหนองชาก", tel:"087-777-8888" },
  { id:6, name:"น้ำผึ้งป่าแท้ 100%", cat:"อาหารแปรรูป", price:"250", unit:"ขวด", img:"https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400&h=300&fit=crop&auto=format", desc:"น้ำผึ้งป่าจากเขาหนองอิรุณ ไม่ผสมน้ำตาล", seller:"วิสาหกิจหนองอิรุณ", tel:"084-999-0000" },
  { id:7, name:"ข้าวเหนียวเขี้ยวงู", cat:"OTOP", price:"120", unit:"กก.", img:"https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&h=300&fit=crop&auto=format", desc:"ข้าวเหนียวเขี้ยวงู ข้าวใหม่ หอมนุ่ม", seller:"สหกรณ์การเกษตรบ้านบึง", tel:"038-443-020" },
  { id:8, name:"ไข่เค็มหนองบอนแดง", cat:"อาหารแปรรูป", price:"90", unit:"โหล", img:"https://images.unsplash.com/photo-1482049016688-2d3e4b311543?w=400&h=300&fit=crop&auto=format", desc:"ไข่เค็มดองเกลือสมุทร ไข่แดงมันเยิ้ม", seller:"กลุ่มแม่บ้านหนองบอนแดง", tel:"085-123-4567" },
  { id:9, name:"กล้วยตากพลังงานแสงอาทิตย์", cat:"อาหารแปรรูป", price:"70", unit:"ถุง", img:"https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop&auto=format", desc:"กล้วยน้ำว้าตากแห้ง หวานธรรมชาติ ไม่ใส่น้ำตาล", seller:"กลุ่มแปรรูปมาบไผ่", tel:"083-222-3333" },
  { id:10, name:"เสื้อมัดย้อมคราม", cat:"OTOP", price:"350", unit:"ตัว", img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop&auto=format", desc:"เสื้อมัดย้อมครามธรรมชาติ ใส่สบาย", seller:"กลุ่มมัดย้อมบ้านบึง", tel:"088-444-5555" },
  { id:11, name:"เงาะโรงเรียนสด", cat:"ผลไม้", price:"50", unit:"กก.", img:"https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop&auto=format", desc:"เงาะโรงเรียนลูกใหญ่ ขนยาว หวานกรอบ", seller:"สวนเงาะหนองซ้ำซาก", tel:"081-666-7777" },
  { id:12, name:"พริกแกงใต้บ้านบึง", cat:"อาหารแปรรูป", price:"45", unit:"กระปุก", img:"https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop&auto=format", desc:"พริกแกงตำมือ สูตรเข้มข้น หอมเครื่องแกงใต้", seller:"กลุ่มแม่บ้านคลองกิ่ว", tel:"082-888-9999" },
];

export default function Page(){
  const SHOW_ITEMS = false;
  const [q,setQ]=useState("");
  const [cat,setCat]=useState<string>("ทั้งหมด");
  const [selected,setSelected]=useState<Product|null>(null);
  const filtered = useMemo(()=>{
    if(!SHOW_ITEMS) return [];
    const s=q.trim().toLowerCase();
    return products.filter(p=>{
      const byCat = cat==="ทั้งหมด" || p.cat===cat;
      const byQ = !s || (p.name+p.desc+p.seller).toLowerCase().includes(s);
      return byCat && byQ;
    });
  },[q,cat]);
  return (
    <div className="min-h-screen" style={{background:"#F7F8FC"}}>
      <AppNavbar subtitle="ของดีอำเภอบ้านบึง" q={q} setQ={setQ} placeholder="ค้นหาของดี เช่น ทุเรียน ผ้าทอ น้ำผึ้ง" />
      <div className="w-full lg:max-w-[1180px] mx-auto pb-[84px] lg:pb-8">
        <div className="px-4 lg:px-6 pt-4">
          <Breadcrumb items={[{label:"หน้าหลัก", to:"/"}, {label:"ของดีอำเภอบ้านบึง"}]} />
          <h1 className="text-[18px] font-bold mt-2" style={{color:"#1A1A1A"}}>ของดีอำเภอบ้านบึง</h1>
          <p className="text-[12px] mt-1" style={{color:"#8E95A5"}}>ศูนย์รวมของดี ออนไลน์และหน้างาน • ผลไม้ตามฤดูกาล • OTOP • หัตถกรรม</p>
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
            {cats.map(c=>(
              <button key={c} onClick={()=>setCat(c)} className={`text-[12px] px-4 py-1.5 rounded-full border whitespace-nowrap inline-flex items-center gap-1 ${cat===c ? "bg-[#0a0a54] text-white border-[#0a0a54]" : "bg-white border-slate-100 hover:border-[#0a0a54]/20"}`} style={cat!==c ? {color:"#1A1A1A"} as any : {}}>{c}</button>
            ))}
          </div>
          <div className="text-[11px] mt-3 flex items-center justify-between" style={{color:"#8E95A5"}}>
            <span>{SHOW_ITEMS ? `${filtered.length} รายการ • ${cat}` : "เร็วๆ นี้"}</span>
            <a href="tel:038443020" className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200" style={{color:"#0a0a54"}}><Icon icon="heroicons:phone-20-solid" width={12} height={12} /> 038-443-020</a>
          </div>
        </div>
        {!SHOW_ITEMS ? (
          <div className="mx-4 lg:mx-6 mt-4 bg-white rounded-[16px] border border-slate-100 p-8 text-center" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
            <Icon icon="heroicons:gift-20-solid" width={32} height={32} style={{color:"#0a0a54"}} className="mx-auto" />
            <div className="text-[14px] font-semibold mt-3" style={{color:"#1A1A1A"}}>ของดีบ้านบึง — เร็วๆ นี้</div>
            <div className="text-[12px] mt-1" style={{color:"#8E95A5"}}>ศูนย์รวมของดีออนไลน์และหน้างาน กำลังเตรียมสินค้า</div>
          </div>
        ) : (
          <>
            <div className="px-4 lg:px-6 pt-3 grid grid-cols-2 lg:grid-cols-4 gap-3">
              {filtered.map(p=>(
                <button key={p.id} onClick={()=>setSelected(p)} className="text-left bg-white rounded-[16px] border border-slate-100 overflow-hidden hover:border-[#0a0a54]/30 hover:shadow-[0_12px_28px_rgba(10,10,84,0.12)] hover:-translate-y-[1px] transition-all" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 text-[10px] px-2 py-1 rounded-full border bg-white/90 backdrop-blur" style={{color:"#0a0a54", borderColor:"#E2E8F0"}}>{p.cat}</span>
                    {p.badge && <span className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded-full bg-[#FF6B2C] text-white font-medium">{p.badge}</span>}
                  </div>
                  <div className="p-3">
                    <div className="text-[12px] font-semibold leading-snug line-clamp-2" style={{color:"#1A1A1A"}}>{p.name}</div>
                    <div className="text-[11px] mt-1 line-clamp-1" style={{color:"#8E95A5"}}>{p.seller.split("•")[0]}</div>
                    <div className="mt-2 flex items-baseline gap-1"><span className="text-[14px] font-bold" style={{color:"#0a0a54"}}>฿{p.price}</span><span className="text-[11px]" style={{color:"#8E95A5"}}>/{p.unit}</span><span className="ml-auto inline-flex items-center gap-1 text-[11px]" style={{color:"#8E95A5"}}>ดู <Icon icon="heroicons:chevron-right-20-solid" width={12} height={12} /></span></div>
                  </div>
                </button>
              ))}
            </div>
            {filtered.length===0 && <div className="mx-4 lg:mx-6 mt-4 bg-white rounded-[16px] border border-slate-100 p-8 text-center text-[13px]" style={{color:"#8E95A5"}}>ไม่พบสินค้า</div>}
          </>
        )}
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end lg:items-center justify-center p-0 lg:p-4" onClick={()=>setSelected(null)}>
          <div className="bg-white rounded-t-[20px] lg:rounded-[20px] w-full lg:max-w-[480px] max-h-[85vh] overflow-auto" onClick={e=>e.stopPropagation()}>
            <div className="aspect-[16/10] bg-slate-100 relative">
              <img src={selected.img} alt={selected.name} className="w-full h-full object-cover" />
              <button onClick={()=>setSelected(null)} className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center"><Icon icon="heroicons:x-mark-20-solid" width={18} height={18} /></button>
              <span className="absolute bottom-3 left-3 text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200" style={{color:"#0a0a54"}}>{selected.cat}</span>
            </div>
            <div className="p-5">
              <div className="text-[16px] font-bold" style={{color:"#1A1A1A"}}>{selected.name}</div>
              <div className="text-[12px] mt-1" style={{color:"#8E95A5"}}>{selected.seller}</div>
              <div className="mt-3 flex items-baseline gap-2"><span className="text-[20px] font-bold" style={{color:"#0a0a54"}}>฿{selected.price}</span><span className="text-[12px]" style={{color:"#8E95A5"}}>/{selected.unit}</span></div>
              <p className="text-[12px] mt-3 leading-relaxed" style={{color:"#1A1A1A"}}>{selected.desc}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <a href={`tel:${selected.tel.replace(/-/g,"")}`} className="py-2.5 rounded-full bg-[#0a0a54] text-white text-[13px] font-medium text-center inline-flex items-center justify-center gap-1.5"><Icon icon="heroicons:phone-20-solid" width={16} height={16} /> โทร {selected.tel}</a>
                <a href={`https://line.me/ti/p/~${selected.tel}`} target="_blank" rel="noreferrer" className="py-2.5 rounded-full bg-[#06C755] text-white text-[13px] font-medium text-center">LINE สั่งซื้อ</a>
              </div>
              <div className="mt-3 text-[11px] text-center" style={{color:"#8E95A5"}}>นัดรับที่ ที่ว่าการอำเภอบ้านบึง • ส่งทั่วประเทศ</div>
            </div>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
}
