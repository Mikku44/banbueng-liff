import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import liff from "@line/liff";

export const LIFF_ID = "2011445636-rLZ5hyH6";
export const LIFF_URL = `https://liff.line.me/${LIFF_ID}`;

type Profile = { userId: string; displayName: string; pictureUrl?: string; statusMessage?: string };

type LiffState = {
  ready: boolean;
  error: string | null;
  isInClient: boolean;
  isLoggedIn: boolean;
  profile: Profile | null;
  idToken: string | null;
  login: () => void;
  logout: () => void;
  close: () => void;
};

const Ctx = createContext<LiffState>({
  ready: false,
  error: null,
  isInClient: false,
  isLoggedIn: false,
  profile: null,
  idToken: null,
  login: () => {},
  logout: () => {},
  close: () => {},
});

export function useLiff() {
  return useContext(Ctx);
}

export function LiffProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isInClient, setIsInClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await liff.init({ liffId: LIFF_ID });
        if (cancelled) return;
        setIsInClient(liff.isInClient());
        const logged = liff.isLoggedIn();
        setIsLoggedIn(logged);
        if (logged) {
          try {
            const p = await liff.getProfile();
            if (!cancelled) setProfile(p as Profile);
          } catch {}
          try {
            const t = liff.getIDToken();
            if (!cancelled) setIdToken(t);
          } catch {}
        }
        setReady(true);
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? String(e));
          setReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = () => {
    if (!liff.isLoggedIn()) liff.login();
  };
  const logout = () => {
    if (liff.isLoggedIn()) {
      liff.logout();
      setIsLoggedIn(false);
      setProfile(null);
      setIdToken(null);
    }
  };
  const close = () => {
    if (liff.isInClient()) liff.closeWindow();
  };

  return <Ctx.Provider value={{ ready, error, isInClient, isLoggedIn, profile, idToken, login, logout, close }}>{children}</Ctx.Provider>;
}
