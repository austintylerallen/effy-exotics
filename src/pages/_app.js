// src/pages/_app.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import dynamic from "next/dynamic";
import "../styles/globals.scss";

const AgeGate = dynamic(() => import("../components/AgeGate"), { ssr: false });
import { AuthProvider } from "../context/AuthContext";

// GTM container ID from env
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

// Lightweight helpers for analytics
import { detectLocation, categorize, track } from "../lib/analytics";

// Send a normalized SPA pageview into GTM
function sendPageView(router) {
  if (typeof window === "undefined") return;
  const asPath = router.asPath || "/";
  const pathname = router.pathname || "/";
  const location = detectLocation(pathname);
  const page_category = categorize(asPath);
  const page_route = pathname;         // Next.js route pattern
  const page_path = asPath;            // includes query
  const page_title = document?.title || "";

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "pageview",
    location,
    page_category,
    page_route,
    page_path,
    page_title,
  });
}

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Persist ee_city cookie for location preference
  useEffect(() => {
    const m = router.pathname.match(/^\/(las-cruces|alamogordo)/);
    if (m && typeof document !== "undefined") {
      const city = m[1];
      if (!document.cookie.match(/(?:^|;\s*)ee_city=/)) {
        document.cookie = `ee_city=${city}; max-age=${60 * 60 * 24 * 180}; path=/; samesite=lax`;
      }
    }
  }, [router.pathname]);

  // Initial and subsequent SPA pageviews
  useEffect(() => {
    if (GTM_ID) sendPageView(router);
  }, [router.asPath]);  // fires on client nav and initial mount

  // Also listen to route changes for safety (some Next setups need this)
  useEffect(() => {
    if (!GTM_ID) return;
    const handleRouteChange = () => sendPageView(router);
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events, router]);

  return (
    <>
      {/* Google Tag Manager loader */}
      {GTM_ID && (
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
      )}

      <AuthProvider>
        <AgeGate />
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}
