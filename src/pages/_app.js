// src/pages/_app.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import dynamic from "next/dynamic";
import "../styles/globals.scss";

const AgeGate = dynamic(() => import("../components/AgeGate"), { ssr: false });
import { AuthProvider } from "../context/AuthContext";
import { track } from "../lib/track";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

// Minimal, local helpers (stable)
const detectLocation = (pathname = "") =>
  pathname.startsWith("/alamogordo") ? "alamogordo"
  : pathname.startsWith("/las-cruces") ? "las-cruces"
  : "";

const categorize = (asPath = "") =>
  asPath.includes("/map") ? "directions"
  : asPath.includes("/shop") ? "shop"
  : "content";

function sendPageView(router) {
  if (typeof window === "undefined") return;
  const asPath = router.asPath || "/";
  const pathname = router.pathname || "/";
  track("pageview", {
    location: detectLocation(pathname),
    page_category: categorize(asPath),
    page_route: pathname,
    page_path: asPath,
    page_title: document?.title || "",
  });
}

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Persist location cookie
  useEffect(() => {
    const m = router.pathname.match(/^\/(las-cruces|alamogordo)/);
    if (m && typeof document !== "undefined") {
      const city = m[1];
      if (!document.cookie.match(/(?:^|;\s*)ee_city=/)) {
        document.cookie = `ee_city=${city}; max-age=${60 * 60 * 24 * 180}; path=/; samesite=lax`;
      }
    }
  }, [router.pathname]);

  // Fire SPA pageviews
  useEffect(() => {
    if (GTM_ID) sendPageView(router);
  }, [router.asPath]);

  useEffect(() => {
    if (!GTM_ID) return;
    const handleRouteChange = () => sendPageView(router);
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events, router]);

  return (
    <>
      {GTM_ID && (
        <Script
          id="gtm-src"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
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
