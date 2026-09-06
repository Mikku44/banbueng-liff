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
import { I18nProvider } from "./lib/i18n";
import { LiffProvider } from "./lib/liff";
import { DesktopSidebar } from "./components/Navbar";
import MascotFloatingButton from "./components/MascotFloatingButton";
import { Toaster } from "sonner";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: "https://cdn.jsdelivr.net/gh/lazywasabi/thai-web-fonts@7/fonts/BaiJamjuree/BaiJamjuree.css" },
  { rel: "icon", href: "/logo.png", type: "image/png" },
  { rel: "apple-touch-icon", href: "/logo.png" },
];



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
          <LiffProvider>
            <div className="lg:flex lg:min-h-screen">
              <DesktopSidebar />
              <div className="flex-1 min-w-0 flex flex-col">
                {children}
              </div>
            </div>
            <MascotFloatingButton />
            <Toaster position="top-center" richColors closeButton />
          </LiffProvider>
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
