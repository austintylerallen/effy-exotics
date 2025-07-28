import { useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/globals.scss";
import AgeGate from "../components/AgeGate";
import AuthProvider from "../context/AuthContext"; // default import now

export default function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter();

  useEffect(() => {
    const m = pathname.match(/^\/(las-cruces|alamogordo)/);
    if (m && typeof document !== "undefined") {
      const city = m[1];
      if (!document.cookie.match(/(?:^|;\s*)ee_city=/)) {
        document.cookie = `ee_city=${city}; max-age=${60 * 60 * 24 * 180}; path=/; samesite=lax`;
      }
    }
  }, [pathname]);

  return (
    <AuthProvider>
      <AgeGate />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
