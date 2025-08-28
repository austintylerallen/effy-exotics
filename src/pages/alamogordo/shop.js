// src/pages/alamogordo/shop.js
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Header from "../../components/Header";
import SEO from "../../components/SEO";
import styles from "./shop.module.css";
import { track as realTrack } from "../../lib/track";

const CANON = "https://www.effyexotics.com/alamogordo/shop";
// Confirm this is the *Alamogordo* embed id from Dutchie Admin → Customize → Embed
const ALAMO_EMBED_ID = "688904f4ca54c616139353b0";
const EMBED_SRC = `https://dutchie.com/api/v2/embedded-menu/${ALAMO_EMBED_ID}.js`;
const track = typeof realTrack === "function" ? realTrack : () => {};

function AlamogordoShop() {
  const [loading, setLoading] = useState(true);
  const headerInit = useRef(false);

  // Keep CSS var for header height current (cheap + stable)
  useEffect(() => {
    if (headerInit.current) return;
    headerInit.current = true;

    const updateHeaderVar = () => {
      const nav = document.querySelector("header.ee-header nav");
      const h = nav?.getBoundingClientRect().height ?? 80;
      document.documentElement.style.setProperty("--ee-header-h", `${Math.round(h)}px`);
    };
    updateHeaderVar();

    const ro = new ResizeObserver(updateHeaderVar);
    const header = document.querySelector("header.ee-header nav");
    if (header) ro.observe(header);
    window.addEventListener("load", updateHeaderVar);
    window.addEventListener("resize", updateHeaderVar);

    return () => {
      ro.disconnect();
      window.removeEventListener("load", updateHeaderVar);
      window.removeEventListener("resize", updateHeaderVar);
    };
  }, []);

  useEffect(() => {
    // Persist across StrictMode re-mounts
    const state =
      (window.__DUTCHIE_ALAMO__ ||= {
        injected: false,
        loaded: false,
        trackedShopView: false,
        trackedMenuView: false,
      });

    if (!state.trackedShopView) {
      track("shop_view", { location: "alamogordo", page: "/alamogordo/shop" });
      state.trackedShopView = true;
    }

    const container = document.getElementById("dutchie-embed-root");
    if (!container) return;

    // Already loaded or injected? just stop the spinner.
    if (state.loaded || document.getElementById("dutchie--embed__script")) {
      setLoading(false);
      return;
    }

    // Create the exact script tag Dutchie expects, INSIDE the container div.
    const script = document.createElement("script");
    script.async = true;
    script.id = "dutchie--embed__script"; // <-- keep their canonical id
    script.src = EMBED_SRC;

    script.onload = () => {
      state.loaded = true;
      setLoading(false);
      if (!state.trackedMenuView) {
        track("view_shop_menu", {
          city: "alamogordo",
          page_location: window.location.href,
        });
        state.trackedMenuView = true;
      }
    };
    script.onerror = () => {
      setLoading(false);
      console.error("[Dutchie] Failed to load embedded script:", EMBED_SRC);
    };

    container.appendChild(script);
    state.injected = true;

    // DO NOT remove on cleanup; StrictMode re-mount would cause double-injects.
    return () => {};
  }, []);

  // As a last resort, also stop the loader after a few seconds even if onload didn't fire,
  // so we don't show "Loading…" forever during ad-block hiccups.
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <SEO
        title="TrapHouse – Alamogordo | Effy Exotics"
        description="Browse Effy Exotics — Alamogordo (TrapHouse) menu and order online for pickup."
        canonical={CANON}
        image="/img/social-preview.jpg"
        noindex={false}
      />
      <Header />
      <main className={styles.container}>
        {loading && (
          <p style={{ textAlign: "center", margin: "16px 0" }}>
            Loading menu…
          </p>
        )}

        {/* 🔒 DUTCHIE RENDER TARGET — keep this div, we inject the script inside it */}
        <div
          id="dutchie-embed-root"
          // give the container real height so the menu isn't collapsed during load
          style={{ minHeight: "calc(100vh - var(--ee-header-h, 80px))" }}
        />
      </main>
    </>
  );
}

// client-only to avoid SSR/hydration issues with document.*
export default dynamic(() => Promise.resolve(AlamogordoShop), { ssr: false });






// src/pages/alamogordo/shop.js
// Temporarily route Alamogordo's shop to the global Coming Soon page.
// Las Cruces remains live.

// export async function getServerSideProps() {
//   return {
//     redirect: { destination: "/coming-soon", permanent: false },
//   };
// }

// export default function AlamogordoShopRedirect() {
//   // Nothing to render; Next.js performs a server-side redirect.
//   return null;
// }
