import { Link } from "react-router";

export default function MascotFloatingButton() {
  return (
    <Link
      to="/ask"
      aria-label="ถามเจ้าหน้าที่"
      className="fixed z-40 right-4 bottom-[74px] lg:bottom-6 lg:right-6 flex flex-col items-center gap-1 group"
    >
      <span className="bg-white text-[#0a0a54] text-[11px] font-semibold px-2.5 py-1 rounded-full border border-slate-100 whitespace-nowrap">
        ถามเจ้าหน้าที่
      </span>
      <img
        src="/mascot.png"
        alt="mascot"
        width={72}
        height={72}
        draggable={false}
        className="w-[72px] h-[72px] lg:w-[84px] lg:h-[84px] object-contain hover:scale-105 active:scale-95 transition-transform"
      />
    </Link>
  );
}
