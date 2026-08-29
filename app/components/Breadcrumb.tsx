import { NavLink } from "react-router";

export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] flex-wrap">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span style={{color:"#8E95A5"}}>›</span>}
          {it.to ? (
            <NavLink to={it.to} className="hover:underline" style={{color:i===items.length-1 ? "#1A1A1A" : "#8E95A5"}}>{it.label}</NavLink>
          ) : (
            <span className="font-medium" style={{color:"#1A1A1A"}}>{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
