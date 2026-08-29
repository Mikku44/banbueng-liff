import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { useEffect, useState } from "react";
import { I18nProvider, useI18n } from "./lib/i18n";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: "https://cdn.jsdelivr.net/gh/lazywasabi/thai-web-fonts@7/fonts/BaiJamjuree/BaiJamjuree.css" },
];

function FontControls() {
  const [scale, setScale] = useState<"sm"|"md"|"lg">("md");
  const { lang, setLang } = useI18n();
  useEffect(()=>{
    const s = localStorage.getItem("banbueng_font") as any;
    if (s==="sm"||s==="md"||s==="lg") setScale(s);
  },[]);
  useEffect(()=>{
    const map = { sm:"0.88", md:"1", lg:"1.15" } as const;
    document.documentElement.style.setProperty("--font-scale", map[scale]);
    const v = map[scale];
    (document.body as any).style.zoom = v;
    document.documentElement.style.fontSize = `${16*parseFloat(v)}px`;
    localStorage.setItem("banbueng_font", scale);
  },[scale]);
  const btn = (k:"sm"|"md"|"lg", label:string) => (
    <button
      key={k}
      onClick={()=>setScale(k)}
      className={`px-2.5 py-1 text-[12px] font-medium rounded-full transition ${scale===k ? "bg-[#0a0a54] text-white shadow" : "text-[#8E95A5] hover:bg-slate-100"}`}
      aria-label={label}
    >
      {label}
    </button>
  );
  return (
    <div className="w-full bg-[#F7F8FC] border-b border-slate-100">
      <div className="w-full lg:max-w-[1180px] mx-auto flex justify-end items-center gap-2 px-4 lg:px-6 py-1.5">
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-full px-1 py-1 shadow-sm">
          <button onClick={()=>setLang(lang==="th"?"en":"th")} className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition ${lang==="th" ? "bg-[#0a0a54] text-white" : "text-[#8E95A5]"}`}>TH</button>
          <button onClick={()=>setLang(lang==="en"?"th":"en")} className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition ${lang==="en" ? "bg-[#0a0a54] text-white" : "text-[#8E95A5]"}`}>EN</button>
        </div>
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-full px-1 py-1 shadow-sm">
          {btn("sm","A-")}
          {btn("md","A")}
          {btn("lg","A+")}
        </div>
      </div>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <I18nProvider>
          <FontControls />
          {children}
        </I18nProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
