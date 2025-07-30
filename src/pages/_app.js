// src/pages/_app.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import dynamic from "next/dynamic";

import "../styles/globals.scss";

// Load AgeGate only on the client (prevents SSR issues with `document`)
const AgeGate = dynamic(() => import("../components/AgeGate"), { ssr: false });

// IMPORTANT: AuthProvider must be a **named** export in ../context/AuthContext
import { AuthProvider } from "../context/AuthContext";

// GA helpers (make sure this file exists and GA_ID is set in env)
import { GA_ID, pageview } from "../lib/gtag";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Persist ee_city cookie when user is inside a city section
  useEffect(() => {
    const m = router.pathname.match(/^\/(las-cruces|alamogordo)/);
    if (m && typeof document !== "undefined") {
      const city = m[1];
      if (!document.cookie.match(/(?:^|;\s*)ee_city=/)) {
        document.cookie = `ee_city=${city}; max-age=${60 * 60 * 24 * 180}; path=/; samesite=lax`;
      }
    }
  }, [router.pathname]);

  // INITIAL pageview (on first load)
  useEffect(() => {
    if (!GA_ID) return;
    pageview(router.asPath || "/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [GA_ID]); // run once when GA_ID is present

  // Subsequent client-side navigations
  useEffect(() => {
    if (!GA_ID) return;
    const handleRouteChange = (url) => pageview(url);
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  return (
    <>
      {/* Google Analytics, only when configured */}
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
