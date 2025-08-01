// src/pages/_app.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import dynamic from "next/dynamic";

import "../styles/globals.scss";

// Client-only component
const AgeGate = dynamic(() => import("../components/AgeGate"), { ssr: false });

// Auth context
import { AuthProvider } from "../context/AuthContext";

// GTM container ID from env
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID; // e.g. GTM-XXXXXXX

// Light helper to push pageviews into GTM / GA4
function pageview(url) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "pageview",
    page_path: url,
  });
}

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  /* ------------------------------------------------------------ */
  /* Persist ee_city cookie for location preference               */
  /* ------------------------------------------------------------ */
  useEffect(() => {
    const m = router.pathname.match(/^\/(las-cruces|alamogordo)/);
    if (m && typeof document !== "undefined") {
      const city = m[1];
      if (!document.cookie.match(/(?:^|;\s*)ee_city=/)) {
        document.cookie =
          `ee_city=${city}; max-age=${60 * 60 * 24 * 180}; path=/; samesite=lax`;
      }
    }
  }, [router.pathname]);

  /* ------------------------------------------------------------ */
  /* Page-view tracking                                           */
  /* ------------------------------------------------------------ */
  // Initial load
  useEffect(() => {
    if (GTM_ID) pageview(router.asPath || "/");
  }, [GTM_ID]);

  // Client-side navigations
  useEffect(() => {
    if (!GTM_ID) return;
    const handleRouteChange = (url) => pageview(url);
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  return (
    <>
      {/* ---------------- Google Tag Manager ------------------- */}
      {GTM_ID && (
        <>
          {/* GTM script – injected in <head> afterInteractive */}
          <Script
            id="gtm-src"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
            }}
          />

          {/* GTM noscript iframe for <noscript> browsers */}
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      )}

      <AuthProvider>
        <AgeGate />
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}
