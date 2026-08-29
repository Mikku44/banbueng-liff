import { useEffect, useState, useRef } from "react";

const images = [
  "/images/cover.png",
];

export default function ImageCarousel() {
  const [idx, setIdx] = useState(0);
  const timer = useRef<number | null>(null);
  const start = () => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = window.setInterval(()=> setIdx(i=> (i+1)%images.length), 3500) as unknown as number;
  };
  useEffect(()=>{ start(); return ()=>{ if(timer.current) window.clearInterval(timer.current); }; },[]);
  const go = (i:number) => { setIdx((i+images.length)%images.length); start(); };
  return (
    <div className="w-full overflow-hidden rounded-[16px] border border-slate-100 bg-white" style={{boxShadow:"0px 10px 25px rgba(0,0,0,0.05)"}}>
      <div className="relative w-full aspect-[16/9] max-h-[250px] overflow-hidden bg-slate-100">
        <div className="flex h-full transition-transform duration-500 ease-out" style={{transform:`translateX(-${idx*100}%)`}}>
          {images.map((src,i)=>(
            <img key={i} src={src} alt={`slide ${i+1}`} className="w-full h-full object-cover shrink-0" draggable={false} />
          ))}
        </div>
        <button onClick={()=>go(idx-1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/35 backdrop-blur text-white flex items-center justify-center hover:bg-black/50">‹</button>
        <button onClick={()=>go(idx+1)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/35 backdrop-blur text-white flex items-center justify-center hover:bg-black/50">›</button>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/25 backdrop-blur px-2 py-1 rounded-full">
          {images.map((_,i)=>(
            <button key={i} onClick={()=>go(i)} className={`w-1.5 h-1.5 rounded-full transition ${i===idx ? "bg-white w-4" : "bg-white/60"}`} />
          ))}
        </div>
      </div>

    </div>
  );
}
