// src/pages/_app.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";

import "../styles/globals.scss";
import AgeGate from "../components/AgeGate";
import { AuthProvider } from "../context/AuthContext";
import { GA_ID, pageview } from "../lib/gtag";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Persist ee_city cookie (your existing logic)
  useEffect(() => {
    const m = router.pathname.match(/^\/(las-cruces|alamogordo)/);
    if (m && typeof document !== "undefined") {
      const city = m[1];
      if (!document.cookie.match(/(?:^|;\s*)ee_city=/)) {
        document.cookie = `ee_city=${city}; max-age=${60 * 60 * 24 * 180}; path=/; samesite=lax`;
      }
    }
  }, [router.pathname]);

  // Track client-side route changes
  useEffect(() => {
    if (!GA_ID) return;
    const handleRouteChange = (url) => pageview(url);
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  return (
    <>
      {/* Load GA only when we have an ID */}
      {GA_ID && (
        <>
          <Script
            id="ga-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      <AuthProvider>
        <AgeGate />
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}
